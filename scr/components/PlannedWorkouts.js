import React, { useState, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import dayjs from "dayjs"; 
import "dayjs/locale/fi"; 
import { database, ref, push, onValue, remove } from "../../Firebase"; // Tuodaan tietokantaan liittyvät toiminnot
import { AntDesign } from "@expo/vector-icons"; 
import Toast from "react-native-toast-message"; 

export default function PlannedWorkout() {
  const [workouts, setWorkouts] = React.useState([]); // Tilamuuttuja treenien tallentamiseen
  const [selectedDate, setSelectedDate] = React.useState(""); // Tilamuuttuja valitulle päivämäärälle

  React.useEffect(() => {
    const itemsRef = ref(database, "workouts"); // Viittaus tietokantaan
    const unsubscribe = onValue(itemsRef, (snapshot) => { // Tilannetta seuraava kuuntelija
      const data = snapshot.val(); // Haetaan tietokannasta tiedot
      if (data) {
        setWorkouts(Object.entries(data)); // Asetetaan treenit tilamuuttujaan
      } else {
        setWorkouts([]); // Tyhjennetään treenit, jos tietoja ei löytynyt
      }
    });

    return () => unsubscribe(); // Kuuntelijan poisto purkaessa komponenttia
  }, []);

  // Poista treeni tietokannasta ja näytä onnistunut ilmoitus
  const handleDeleteWorkout = (key) => {
    remove(ref(database, `workouts/${key}`));
    Toast.show({
      type: "success",
      text1: "Deleted successfully", // Onnistuneen poiston ilmoitus
    });
  };

  // Käsittele päivän painallus
  const handleDayPress = (day) => {
    setSelectedDate(day.dateString); // Aseta valittu päivämäärä tilamuuttujaan
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <FlatList
        data={workouts}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleDeleteWorkout(item[0])}>
            <View
              style={{
                borderBottomWidth: 1,
                borderBottomColor: "gray",
                paddingVertical: 10,
              }}
            >
              <Text>
                Päivämäärä: {dayjs(item[1].date).format("DD.MM.YYYY")}
              </Text>
              <Text>Liikkeet: {item[1].exercises}</Text>
              <Text>Kesto: {item[1].duration}</Text>
              <TouchableOpacity
                style={{ position: "absolute", top: 10, right: 10 }}
                onPress={() => handleDeleteWorkout(item[0])}
              >
                <AntDesign name="delete" size={20} color="red" />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item[0]} // Käytetään treenin avainta key:na
      />
    </View>
  );
}
