import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Button } from 'react-native';
import axios from 'axios';

export function EventListScreen() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await axios.get('https://b8ef-71-85-245-93.ngrok-free.app/events');
      setEvents(response.data);
    } catch (error) {
      console.error('Error fetching events: ', error);
    }
  };

  return (
    <View>
      <Text>Event List</Text>
      <FlatList
        data={events}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View>
            <Text>{item.title}</Text>
            <Text>{item.date}</Text>
          </View>
        )}
      />
    </View>
  );
};
