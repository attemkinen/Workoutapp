import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  TouchableOpacity,
  Modal,
  FlatList,
} from "react-native";
import { Calendar } from "react-native-calendars";
import dayjs from "dayjs";
import { database, ref, push, onValue, remove } from "../../Firebase";
import DateTimePicker from "@react-native-community/datetimepicker";
import { AntDesign } from "@expo/vector-icons";
import Toast from "react-native-toast-message";

const MyCalendar = () => {
  // Tilamuuttujat
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [workout, setWorkout] = useState({
    date: new Date(),
    exercises: "",
    duration: "",
  });
  const [workouts, setWorkouts] = useState([]);
  const [showAddWorkout, setShowAddWorkout] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [deletedWorkoutId, setDeletedWorkoutId] = useState(null);

  // Vaikutusefektit
  useEffect(() => {
    const itemsRef = ref(database, "workouts");
    const unsubscribe = onValue(itemsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setWorkouts(Object.entries(data));
      } else {
        setWorkouts([]);
      }
    });

    return () => unsubscribe(); // Poistetaan kuuntelija purkamisen yhteydessä
  }, []);

  useEffect(() => {
    if (deletedWorkoutId) {
      // Näytetään ilmoitus, jos treeni poistettiin onnistuneesti
      Toast.show({
        type: "success",
        text1: "Deleted successfully",
      });
    }
  }, [deletedWorkoutId]);

  // Päivän valinta kalenterissa
  const handleDayPress = (day) => {
    setSelectedDate(day.dateString);
    setModalVisible(true);
  };

  // Input-kentän muutokset
  const handleInputChange = (key, value) => {
    setWorkout({ ...workout, [key]: value });
  };

  // Treenin tallentaminen tietokantaan
  const handleSaveWorkout = () => {
    const isoDate = workout.date.toISOString();
    const newWorkout = { ...workout, date: isoDate };

    push(ref(database, "workouts"), newWorkout)
      .then((newWorkoutRef) => {
        console.log("New workout saved with ID:", newWorkoutRef.key);
        setWorkouts([...workouts, [newWorkoutRef.key, newWorkout]]);
        setWorkout({ date: new Date(), exercises: "", duration: "" });
        setShowAddWorkout(false);
        setDeletedWorkoutId(null); // Asetetaan poistettu treenin ID nollaksi
        Toast.show({
          type: "success",
          text1: "Workout added",
          text2: "New workout successfully saved.",
        });
      })
      .catch((error) => {
        console.error("Error saving workout: ", error);
      });
  };

  // Treenin poistaminen tietokannasta
  const handleDeleteWorkout = (key) => {
    remove(ref(database, `workouts/${key}`))
      .then(() => {
        setDeletedWorkoutId(key);
      })
      .catch((error) => {
        console.error("Error deleting workout: ", error);
      });
  };

  // Merkittyjen päivien haku
  const getMarkedDates = () => {
    const marked = {};
    workouts.forEach(([key, value]) => {
      marked[dayjs(value.date).format("YYYY-MM-DD")] = { marked: true };
    });
    return marked;
  };

  // Päivämäärän muuttaminen datepickerin avulla
  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || workout.date;
    setShowDatePicker(false);
    setWorkout({ ...workout, date: currentDate });
  };

  // Valitut treenit valitulla päivämäärällä
  const selectedWorkouts = workouts.filter(
    ([key, value]) => dayjs(value.date).format("YYYY-MM-DD") === selectedDate
  );

  const toastRef = useRef(); // Viittaus Toast-ilmoituksiin

  return (
    <View style={{ flex: 1, marginTop: 50 }}>
      {/* Lisää treeni -painike */}
      {!showAddWorkout && (
        <TouchableOpacity
          onPress={() => setShowAddWorkout(true)}
          style={{
            backgroundColor: "#f0f0f0",
            borderRadius: 10,
            padding: 5,
            alignItems: "left",
            justifyContent: "center",
          }}
        >
          <AntDesign name="plus" size={30} color="black" />
        </TouchableOpacity>
      )}

      {/* Lisää treeni -näkymä */}
      {showAddWorkout && (
        <View style={{ padding: 20 }}>
          <TouchableOpacity onPress={() => setShowDatePicker(true)}>
            <Text>Date: {dayjs(workout.date).format("DD.MM.YYYY")}</Text>
          </TouchableOpacity>
          {showDatePicker && (
            <View>
              <DateTimePicker
                testID="dateTimePicker"
                value={workout.date}
                mode="date"
                is24Hour={true}
                display="default"
                onChange={onChange}
              />
              <Button
                title="Valitse"
                onPress={() => setShowDatePicker(false)}
              />
            </View>
          )}
          <TextInput
            style={{
              height: 40,
              borderColor: "gray",
              borderWidth: 1,
              marginBottom: 10,
            }}
            placeholder="Liikkeet"
            value={workout.exercises}
            onChangeText={(text) => handleInputChange("exercises", text)}
          />
          <TextInput
            style={{
              height: 40,
              borderColor: "gray",
              borderWidth: 1,
              marginBottom: 10,
            }}
            placeholder="Kesto"
            value={workout.duration}
            onChangeText={(text) => handleInputChange("duration", text)}
          />
          <View style={{ flexDirection: "row" }}>
            <TouchableOpacity
              onPress={handleSaveWorkout}
              style={{
                backgroundColor: "blue",
                padding: 10,
                borderRadius: 5,
                marginRight: 10,
              }}
            >
              <AntDesign name="save" size={20} color="white" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setShowAddWorkout(false)}
              style={{ backgroundColor: "red", padding: 10, borderRadius: 5 }}
            >
              <AntDesign name="close" size={20} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Kalenteri */}
      {!showAddWorkout && (
        <Calendar
          current={selectedDate}
          onDayPress={handleDayPress}
          markedDates={{
            [selectedDate]: { selected: true, selectedColor: "blue" },
            ...getMarkedDates(),
          }}
        />
      )}

      {/* Modaali */}
      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={{ marginTop: 22 }}>
          <View>
            <TouchableOpacity
              onPress={() => setModalVisible(!modalVisible)}
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "left",
                padding: 5,
              }}
            >
              <AntDesign
                name="close"
                size={24}
                color="black"
                style={{ marginRight: 5 }}
              />
              <Text style={{ fontSize: 16, color: "black" }}>Close</Text>
            </TouchableOpacity>
            {/* Tarkistetaan, onko päivälle merkitty tapahtumia */}
            {selectedWorkouts.length === 0 ? (
              <View style={{ marginTop: 10, paddingHorizontal: 20 }}>
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: "bold",
                    paddingTop:20,
                    
                  }}
                >
                  No events for this day
                </Text>
              </View>
            ) : (
              <FlatList
                data={selectedWorkouts}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => handleDeleteWorkout(item[0])}
                  >
                    <View
                      style={{
                        borderWidth: 1,
                        borderColor: "#ccc",
                        borderRadius: 8,
                        padding: 8,
                        marginBottom: 8,
                        width: "95%",
                        alignSelf: "center",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <View>
                        <Text>
                          Päivämäärä: {dayjs(item[1].date).format("DD.MM.YYYY")}
                        </Text>
                        <Text>Liikkeet: {item[1].exercises}</Text>
                        <Text>Kesto: {item[1].duration}</Text>
                      </View>
                      <TouchableOpacity
                        onPress={() => handleDeleteWorkout(item[0])}
                      >
                        <AntDesign name="delete" size={20} color="red" />
                      </TouchableOpacity>
                    </View>
                  </TouchableOpacity>
                )}
                keyExtractor={(item) => item[0]}
              />
            )}
          </View>
        </View>
      </Modal>

      {/* Toast-ilmoitukset */}
      <Toast />
    </View>
  );
};

export default MyCalendar;
