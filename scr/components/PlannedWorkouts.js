// PlannedWorkout.js
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, TouchableOpacity } from 'react-native';
import dayjs from 'dayjs';
import 'dayjs/locale/fi';
import { database, ref, push, onValue, remove } from '../../Firebase';

export default function PlannedWorkout() {
  const [workout, setWorkout] = useState({
    date: dayjs(new Date()).locale('fi').format('YYYY-MM-DD'),
    exercises: "",
    duration: "",
  });
  const [workouts, setWorkouts] = useState([]);

  useEffect(() => {
    // Kuuntele muutoksia Firebase-tietokannassa ja päivitä workouts-tila
    const itemsRef = ref(database, 'workouts');
    onValue(itemsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setWorkouts(Object.entries(data)); // Tallennetaan workouts kuten [key, value] -pareina
      } else {
        setWorkouts([]);
      }
    });
  }, []);

  const handleInputChange = (key, value) => {
    setWorkout({ ...workout, [key]: value });
  };

  const handleSaveWorkout = () => {
    push(ref(database, 'workouts'), workout);
    setWorkout({ ...workout, exercises: "", duration: "" });
  };

  const handleDeleteWorkout = (key) => {
    remove(ref(database, `workouts/${key}`)); // Poista treeni tietokannasta
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text>Treeniohjelma:</Text>
      <TextInput
        style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 10 }}
        placeholder="Päivämäärä"
        value={workout.date}
        onChangeText={(text) => handleInputChange('date', text)}
      />
      <TextInput
        style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 10 }}
        placeholder="Liikkeet"
        value={workout.exercises}
        onChangeText={(text) => handleInputChange('exercises', text)}
      />
      <TextInput
        style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 10 }}
        placeholder="Kesto"
        value={workout.duration}
        onChangeText={(text) => handleInputChange('duration', text)}
      />
      <Button title="Tallenna treeni" onPress={handleSaveWorkout} />
      
      <FlatList
        data={workouts}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleDeleteWorkout(item[0])}>
            <View style={{ borderBottomWidth: 1, borderBottomColor: 'gray', paddingVertical: 10 }}>
              <Text>Päivämäärä: {dayjs(item[1].date).format('DD.MM.YYYY')}</Text>
              <Text>Liikkeet: {item[1].exercises}</Text>
              <Text>Kesto: {item[1].duration}</Text>
              <Text style={{ color: 'red' }}>Poista</Text>
            </View>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item[0]} // Käytetään treenin avainta key:na
      />
    </View>
  );
}
