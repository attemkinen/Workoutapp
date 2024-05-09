import React from "react";
import { StyleSheet } from "react-native";
import Workout from "./scr/components/Workout";
import PlannedWorkout from "./scr/components/PlannedWorkouts";
import Calendar from "./scr/components/Calendar";
import Calories from "./scr/components/Calories"; // Lisätty Calories-tiedoston tuonti
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialCommunityIcons, AntDesign, FontAwesome5, FontAwesome } from '@expo/vector-icons'; // Lisätty FontAwesome

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Search Workouts') {
              return <AntDesign name="search1" size={size} color={color} />;
            } else if (route.name === 'Planned Workouts') {
              return <MaterialCommunityIcons name="weight-lifter" size={size} color={color} />;
            } else if (route.name === 'Calendar') {
              return <FontAwesome5 name="calendar-alt" size={size} color={color} />;
            } else if (route.name === 'Calories') { // Korjattu navigointi komponenttiin
              return <FontAwesome name="calculator" size={size} color={color} />;
            }

            return null;
          },
          tabBarActiveTintColor: 'tomato',
          tabBarInactiveTintColor: 'gray',
        })}
      >
        <Tab.Screen name="Search Workouts" component={Workout} />
        <Tab.Screen name="Planned Workouts" component={PlannedWorkout} />
        <Tab.Screen name="Calendar" component={Calendar} />
        <Tab.Screen name="Calories" component={Calories} /> 
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
