import React, { useState } from "react";
import { AntDesign } from "@expo/vector-icons";
import {
  TouchableOpacity,
  FlatList,
  TextInput,
  View,
  Text,
} from "react-native";
import { styles } from "./Styles";
import Toast from "react-native-toast-message";

export default function Workout() {
  const [keyword, setKeyword] = useState("");
  const [workouts, setWorkouts] = useState([]);
  const [showMessage, setShowMessage] = useState(true);

  const getWorkouts = () => {
    setShowMessage(false); // Piilotetaan viesti haun jälkeen
    fetch(`https://api.api-ninjas.com/v1/exercises?muscle=${keyword}`, {
      method: "GET",
      headers: {
        "X-Api-Key": process.env.EXPO_PUBLIC_API_KEY,
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        if (data && data.length > 0) {
          setWorkouts(data);
          Toast.show({
            type: "success",
            text1: "Search completed",
          });
        } else {
          console.log("No workouts found");
          Toast.show({
            type: "error",
            text1: "No workouts found.",
          });
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const renderWorkoutDetails = ({ item }) => (
    <View style={styles.workoutContainer}>
      <Text style={styles.title}>Workout Details</Text>
      <View style={styles.instructionContainer}>
        <Text style={styles.label}>Name:</Text>
        <Text style={styles.value}>{item.name}</Text>

        <Text style={styles.label}>Type:</Text>
        <Text style={styles.value}>{item.type}</Text>

        <Text style={styles.label}>Muscle:</Text>
        <Text style={styles.value}>{item.muscle}</Text>

        <Text style={styles.label}>Equipment:</Text>
        <Text style={styles.value}>{item.equipment}</Text>

        <Text style={styles.label}>Difficulty:</Text>
        <Text style={styles.value}>{item.difficulty}</Text>
      </View>
      <View style={styles.instructionContainer}>
        <Text style={styles.label}>Instructions:</Text>
        <Text style={styles.value}>{item.instructions}</Text>
      </View>
    </View>
  );

  const showOptions = () => {
    return (
      <Text style={styles.message}>
        Voit hakea harjoituksia seuraavista lihasryhmistä: abdominals, abductors, adductors, biceps, calves, chest, forearms, glutes, hamstrings, lats, lower_back, middle_back, neck, quadriceps, traps, triceps
      </Text>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.textinput}
          placeholder="Search workouts"
          value={keyword}
          onChangeText={(text) => setKeyword(text)}
        />
        <TouchableOpacity onPress={getWorkouts} style={styles.buttonContainer}>
          <AntDesign name="search1" size={30} color="black" />
        </TouchableOpacity>
      </View>
      {showMessage && showOptions()}
      {workouts.length > 0 && (
        <FlatList
          data={workouts}
          renderItem={renderWorkoutDetails}
          keyExtractor={(item, index) => index.toString()}
        />
      )}
      <Toast />
    </View>
  );
}
