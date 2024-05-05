import React, { useState } from 'react';
import { View } from 'react-native';
import { Calendar } from 'react-native-calendars';

const MyCalendar = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const handleDayPress = (day) => {
    setSelectedDate(day.dateString);
  };

  return (
    <View style={{ flex: 1, marginTop: 50 }}>
      <Calendar
        current={selectedDate}
        onDayPress={handleDayPress}
        markedDates={{ [selectedDate]: { selected: true, selectedColor: 'blue' } }}
      />
    </View>
  );
};

export default MyCalendar;
