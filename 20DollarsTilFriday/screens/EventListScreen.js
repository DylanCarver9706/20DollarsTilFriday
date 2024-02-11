import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Button } from 'react-native';
import axios from 'axios';

const EventListScreen = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await axios.get('http://your-backend-url/events');
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

export default EventListScreen;
