import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Button,
  TextInput,
  Modal,
  TouchableOpacity,
  Platform,
} from "react-native";
import axios from "axios";
import DateTimePicker from "@react-native-community/datetimepicker";
import API_BASE_URL from "../apiConfig";

export function EventListScreen() {
  const [events, setEvents] = useState([]);
  const [newEventTitle, setNewEventTitle] = useState("");
  const [newEventType, setNewEventType] = useState("");
  const [newEventDate1, setNewEventDate1] = useState(null);
  const [newEventDate2, setNewEventDate2] = useState(null);
  const [newEventFrequency, setNewEventFrequency] = useState(null);
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const [updateEvent, setUpdateEvent] = useState(null);
  const [isAddEventModalVisible, setIsAddEventModalVisible] = useState(false);
  const [showDatePicker1, setShowDatePicker1] = useState(false);
  const [showDatePicker2, setShowDatePicker2] = useState(false);
  const userId = "1"; // Placeholder user ID

  let currentDate = new Date();

  const formatDate = (rawDate) => {
    let date = new Date(rawDate);

    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();

    let formattedMonth = month < 10 ? `0${month}` : `${month}`;
    let formattedDay = day < 10 ? `0${day}` : `${day}`;

    return `${year}-${formattedMonth}-${formattedDay}`;
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/events`);
      setEvents(response.data);
    } catch (error) {
      console.error("Error fetching events: ", error);
    }
  };

  const handleCreateEvent = async () => {
    try {
      await axios.post(`${API_BASE_URL}/events`, {
        title: newEventTitle,
        type: newEventType,
        date: newEventDates[0], // Only storing the last two dates
        user_id: userId,
      });
      fetchEvents(); // Refresh event list after creating event
      // Clear input fields
      setNewEventTitle("");
      setNewEventType("");
      setIsAddEventModalVisible(false); // Hide the add event modal
    } catch (error) {
      console.error("Error creating event: ", error);
    }
  };

  const handleDeleteEvent = async (eventId) => {
    try {
      await axios.delete(`${API_BASE_URL}/events/${eventId}`);
      fetchEvents(); // Refresh event list after deleting event
    } catch (error) {
      console.error("Error deleting event: ", error);
    }
  };

  const handleUpdateEvent = async () => {
    if (!updateEvent) return;
    try {
      await axios.put(`${API_BASE_URL}/events/${updateEvent.id}`, {
        ...updateEvent,
        userId: userId,
      });
      fetchEvents(); // Refresh event list after updating event
      setIsUpdateModalVisible(false); // Hide the update modal
    } catch (error) {
      console.error("Error updating event: ", error);
    }
  };

  useEffect(() => {
    calculateFrequency(); // This will be executed when the state changes
}, [newEventDate2]);

  // Function to calculate frequency
  const calculateFrequency = () => {
    console.log("Here");
    // setTimeout(() => {--
      console.log("Hello World");
      console.log(newEventDate1);
      console.log(newEventDate2);
      console.log("End");
      if (newEventDate1 && newEventDate2) {
        const lastDate = new Date(newEventDate1);
        const prevDate = new Date(newEventDate2);
        const diffTime = Math.abs(lastDate - prevDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        console.log("Diff days: " + diffDays);
        setNewEventFrequency(diffDays);
        return diffDays;
      } else {
        console.log("No dates");
        return null;
      }
    // }, 2000);
  };

  const onChangeDate1 = ({ type }, selectedDate) => {
    // if (type == "set") {
      setNewEventDate1(formatDate(selectedDate));
      console.log("Date 1: " + formatDate(selectedDate));
      toggleDatepicker1();
    // } else {
    //   toggleDatepicker();
    // }
  };

  const onChangeDate2 = ({ type }, selectedDate) => {
    // if (type == "set") {
      setNewEventDate2(formatDate(selectedDate));
      console.log("Date 2: " + formatDate(selectedDate));
      toggleDatepicker2();
      // setNewEventFrequency();
    // } else {
    //   toggleDatepicker();
    // }
  };

  const toggleDatepicker1 = () => {
    setShowDatePicker1(!showDatePicker1);
  };

  const toggleDatepicker2 = () => {
    setShowDatePicker2(!showDatePicker2);
  };

  return (
    <View>
      <Text>Event List</Text>
      <Button
        title="Add Event"
        onPress={() => setIsAddEventModalVisible(true)}
      />
      <Modal
        visible={isAddEventModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsAddEventModalVisible(false)}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          }}
        >
          <View
            style={{
              backgroundColor: "white",
              padding: 20,
              borderRadius: 10,
              width: "80%",
            }}
          >
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
            {/* Using date picker for event dates */}
            <Text>When is the last time this event occurred?</Text>
            <Button title="Add Date" onPress={toggleDatepicker1} />
            {showDatePicker1 && !showDatePicker2 && !newEventDate1 &&(
              <DateTimePicker
                value={currentDate}
                mode="date"
                display="spinner"
                onChange={onChangeDate1}
              />
            )}
            <Text>When is the last time this event occurred before that?</Text>
            <Button title="Add Date" onPress={toggleDatepicker2} />
            {showDatePicker2 && !showDatePicker1 && !newEventDate2 && (
              <DateTimePicker
                value={currentDate}
                mode="date"
                display="default"
                onChange={onChangeDate2}
              />
            )}
            {newEventDate1 && newEventDate2 && (
              <View>
                {/* Displaying frequency */}
                <Text>Frequency: {newEventFrequency} days</Text>
              </View>
            )}
            <Button title="Add" onPress={handleCreateEvent} />
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
            <Text>{item.amount}</Text>
            <Text>{item.recurring_type}</Text>
            <Text>{item.frequency}</Text>
            <Text>{item.payment_method}</Text>
            <Text>{item.last_confirmed_date.split("T")[0]}</Text>
            <Text>{item.next_event_date.split("T")[0]}</Text>
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
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          }}
        >
          <View
            style={{
              backgroundColor: "white",
              padding: 20,
              borderRadius: 10,
              width: "80%",
            }}
          >
            <Text>Update Event</Text>
            <TextInput
              placeholder="New Title"
              value={updateEvent ? updateEvent.title : ""}
              onChangeText={(text) =>
                setUpdateEvent({ ...updateEvent, title: text })
              }
            />
            <TextInput
              placeholder="New Type"
              value={updateEvent ? updateEvent.type : ""}
              onChangeText={(text) =>
                setUpdateEvent({ ...updateEvent, type: text })
              }
            />
            <Button title="Update" onPress={handleUpdateEvent} />
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
}
