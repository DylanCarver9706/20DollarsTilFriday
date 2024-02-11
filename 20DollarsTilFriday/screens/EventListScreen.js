import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Button, TextInput, Modal, TouchableOpacity } from 'react-native';
import axios from 'axios';

export function EventListScreen() {
  const [events, setEvents] = useState([]);
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventType, setNewEventType] = useState('');
  const [newEventDate, setNewEventDate] = useState('');
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const [updateEvent, setUpdateEvent] = useState(null);
  const [isAddEventModalVisible, setIsAddEventModalVisible] = useState(false);
  const userId = "1"; // Placeholder user ID

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

  const handleCreateEvent = async () => {
    try {
      await axios.post('https://b8ef-71-85-245-93.ngrok-free.app/events', {
        title: newEventTitle,
        type: newEventType,
        date: newEventDate,
        user_id: userId
      });
      fetchEvents(); // Refresh event list after creating event
      // Clear input fields
      setNewEventTitle('');
      setNewEventType('');
      setNewEventDate('');
      setIsAddEventModalVisible(false); // Hide the add event modal
    } catch (error) {
      console.error('Error creating event: ', error);
    }
  };

  const handleDeleteEvent = async (eventId) => {
    try {
      await axios.delete(`https://b8ef-71-85-245-93.ngrok-free.app/events/${eventId}`);
      fetchEvents(); // Refresh event list after deleting event
    } catch (error) {
      console.error('Error deleting event: ', error);
    }
  };

  const handleUpdateEvent = async () => {
    if (!updateEvent) return;
    try {
      await axios.put(`https://b8ef-71-85-245-93.ngrok-free.app/events/${updateEvent.id}`, {
        ...updateEvent,
        userId: userId
      });
      fetchEvents(); // Refresh event list after updating event
      setIsUpdateModalVisible(false); // Hide the update modal
    } catch (error) {
      console.error('Error updating event: ', error);
    }
  };

  return (
    <View>
      <Text>Event List</Text>
      <Button title="Add Event" onPress={() => setIsAddEventModalVisible(true)} />
      <Modal
        visible={isAddEventModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsAddEventModalVisible(false)}
      >
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10, width: '80%' }}>
            <Text>Add Event</Text>
            <TextInput
              placeholder="Event Title"
              value={newEventTitle}
              onChangeText={setNewEventTitle}
            />
            <TextInput
              placeholder="Event Type"
              value={newEventType}
              onChangeText={setNewEventType}
            />
            <TextInput
              placeholder="Event Date (YYYY-MM-DD)"
              value={newEventDate}
              onChangeText={setNewEventDate}
            />
            <Button
              title="Add"
              onPress={handleCreateEvent}
            />
            <TouchableOpacity
              style={{ marginTop: 10 }}
              onPress={() => setIsAddEventModalVisible(false)}
            >
              <Text>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <FlatList
        data={events}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View>
            <Text>{item.title}</Text>
            <Text>{item.type}</Text>
            <Text>{item.date.split("T")[0]}</Text>
            <Button
              title="Delete"
              onPress={() => {
                handleDeleteEvent(item.id);
              }}
            />
            <Button
              title="Update"
              onPress={() => {
                setUpdateEvent(item);
                setIsUpdateModalVisible(true);
              }}
            />
          </View>
        )}
      />
      <Modal
        visible={isUpdateModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsUpdateModalVisible(false)}
      >
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10, width: '80%' }}>
            <Text>Update Event</Text>
            <TextInput
              placeholder="New Title"
              value={updateEvent ? updateEvent.title : ''}
              onChangeText={(text) => setUpdateEvent({ ...updateEvent, title: text })}
            />
            <TextInput
              placeholder="New Type"
              value={updateEvent ? updateEvent.type : ''}
              onChangeText={(text) => setUpdateEvent({ ...updateEvent, type: text })}
            />
            <TextInput
              placeholder="New Date (YYYY-MM-DD)"
              value={updateEvent ? updateEvent.date.split("T")[0] : ''}
              onChangeText={(text) => setUpdateEvent({ ...updateEvent, date: text })}
            />
            <Button
              title="Update"
              onPress={handleUpdateEvent}
            />
            <TouchableOpacity
              style={{ marginTop: 10 }}
              onPress={() => setIsUpdateModalVisible(false)}
            >
              <Text>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};
