import React from "react";
import { StyleSheet } from "react-native";
import Workout from "./scr/components/Workout";
import PlannedWorkout from "./scr/components/PlannedWorkouts";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialCommunityIcons, AntDesign } from '@expo/vector-icons';
import Calendar from "./scr/components/Calendar";
import MyCalendar from "./scr/components/Calendar";

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
            }

            return null;
          },
          tabBarActiveTintColor: 'tomato',
          tabBarInactiveTintColor: 'gray',
        })}
      >
        <Tab.Screen name="Search Workouts" component={Workout} />
        <Tab.Screen name="Planned Workouts" component={PlannedWorkout} />
       
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
