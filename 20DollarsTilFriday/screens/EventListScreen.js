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
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const [updateEvent, setUpdateEvent] = useState(null);
  const [isAddEventModalVisible, setIsAddEventModalVisible] = useState(false);
  const [showDatePicker1, setShowDatePicker1] = useState(false);
  const [showDatePicker2, setShowDatePicker2] = useState(false);

  // New Event vars
  const [newEventTitle, setNewEventTitle] = useState("");
  const [newEventType, setNewEventType] = useState("Bill");
  const userId = "1"; // Placeholder user ID
  const [newEventAmount, setNewEventAmount] = useState(null);
  const [newEventRecurrenceType, setNewEventRecurrenceType] =
    useState("every_nth_day");

  const [newEventFrequency, setNewEventFrequency] = useState(null);
  const [newEventDiffDays, setNewEventDiffDays] = useState(null);

  const [newEventPaymentMethod, setNewEventPaymentMethod] = useState("Auto");
  const [newEvent2ndLastConfirmedDate, setNewEvent2ndLastConfirmedDate] =
    useState(null);
  const [newEventLastConfirmedDate, setNewEventLastConfirmedDate] =
    useState(null);
  const [newEventNextDate, setNewEventNextDate] = useState(null);

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
      let eventFrequency = null 
      if (newEventFrequency) {
        eventFrequency = `${newEventFrequency}${getOrdinalIndicator(parseInt(newEventFrequency))} of every month`
      } else {
        eventFrequency = `every ${newEventDiffDays} days`
      }
      const requestBody = {
        title: newEventTitle,
        type: newEventType,
        user_id: userId,
        amount: newEventAmount,
        recurring_type: newEventRecurrenceType,
        frequency: eventFrequency,
        payment_method: newEventPaymentMethod,
        last_confirmed_date: newEventLastConfirmedDate,
        next_event_date: newEventNextDate,
      }
      console.log(requestBody);
      await axios.post(`${API_BASE_URL}/events`, requestBody);
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
  }, [newEventLastConfirmedDate, newEvent2ndLastConfirmedDate]);

  // Function to calculate frequency
  const calculateFrequency = () => {
    // console.log("Here");
    if (newEvent2ndLastConfirmedDate && newEventLastConfirmedDate) {
      const lastDate = new Date(newEvent2ndLastConfirmedDate);
      const prevDate = new Date(newEventLastConfirmedDate);
      const diffTime = Math.abs(lastDate - prevDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      // console.log("Diff days: " + diffDays);
      setNewEventDiffDays(diffDays);
      return diffDays;
    } else {
      // console.log("No dates");
      return null;
    }
  };

  const onChangeLastConfirmedDate = ({ type }, selectedDate) => {
    toggleDatepicker1();
    // console.log(selectedDate)
    setNewEventLastConfirmedDate(formatDate(selectedDate));
    console.log("Date 1: " + formatDate(selectedDate));
  };

  const onChange2ndLastConfirmedDate = ({ type }, selectedDate) => {
    toggleDatepicker2();
    // console.log(selectedDate)
    setNewEvent2ndLastConfirmedDate(formatDate(selectedDate));
    console.log("Date 2: " + formatDate(selectedDate));
  };

  const toggleDatepicker1 = () => {
    setShowDatePicker1(!showDatePicker1);
  };

  const toggleDatepicker2 = () => {
    setShowDatePicker2(!showDatePicker2);
  };

  const handleRecurrenceTypeChange = (value) => {
    setNewEventRecurrenceType(value);
  };

  const handleFrequencyValueChange = (value) => {
    setNewEventFrequency(value);
    // setNewEventNextDate(calculateNextEventDate());
  };

  const handleNewEventTypeChange = (value) => {
    setNewEventType(value);
  };

  const handleNewEventPaymentMethodChange = (value) => {
    setNewEventPaymentMethod(value);
  };

  const calculateNextEventDate = () => {
    // console.log("here1");
    if (newEventRecurrenceType === "every_nth_day" && newEventDiffDays && newEventLastConfirmedDate) {
      let lastConfirmedDate = new Date(newEventLastConfirmedDate);
      // Adding the frequency to the last confirmed date
      setNewEventNextDate(formatDate(lastConfirmedDate.setDate(lastConfirmedDate.getDate() + parseInt(newEventDiffDays))))
    } else if (newEventRecurrenceType === "nth_day_of_month" && newEventFrequency) {
      // console.log("here2");
      const today = new Date();
      const year = today.getFullYear();
      const month = today.getMonth();
      const date = today.getDate();
      const dayOfWeek = today.getDay();

      const userSelectedDay = parseInt(newEventFrequency);

      let todayDate = new Date(year, month, date);
      let eventNextDate = new Date(year, month, userSelectedDay);
      // console.log("Today date: " + todayDate)
      // console.log("Next date: " + eventNextDate)
      if (todayDate < eventNextDate) {
        // console.log("Result1: " + eventNextDate)
        let updatedEventNextDate = new Date(eventNextDate.setMonth(eventNextDate.getMonth() - 1));
        // console.log(updatedEventNextDate)
        setNewEventLastConfirmedDate(formatDate(updatedEventNextDate));
        setNewEventNextDate(formatDate(eventNextDate))
      }
      if (todayDate >= eventNextDate) {
        // console.log(eventNextDate)
        setNewEventLastConfirmedDate(formatDate(eventNextDate));
        eventNextDate.setMonth(eventNextDate.getMonth() + 1);
        // console.log("Next date in loop: " + eventNextDate)
      }
      // console.log("Result: " + eventNextDate)
      setNewEventNextDate(formatDate(eventNextDate))
    }
    // return formatDate(nextDate); // Format the next date

    return "Didn't work"; // Return null if last confirmed date or frequency is not set
  };

  useEffect(() => {
    calculateNextEventDate(); // This will be executed when the state changes
  }, [newEventFrequency, newEventDiffDays]);

  function getOrdinalIndicator(day) {
    if (day >= 11 && day <= 13) {
        return "th";
    }
    switch (day % 10) {
        case 1: return "st";
        case 2: return "nd";
        case 3: return "rd";
        default: return "th";
    }
}

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
              onChangeText={setNewEventTitle}
            />
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <View>
                <Text>Event Type:</Text>
              </View>
              <View>
                <TouchableOpacity
                  onPress={() => handleNewEventTypeChange("Bill")}
                >
                  <Text
                    style={{
                      marginLeft: 10,
                      color: newEventType === "Bill" ? "blue" : "black",
                    }}
                  >
                    Bill
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleNewEventTypeChange("Pay Day")}
                >
                  <Text
                    style={{
                      marginLeft: 10,
                      color: newEventType === "Pay Day" ? "blue" : "black",
                    }}
                  >
                    Pay Day
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            <TextInput
              placeholder="Event Amount"
              onChangeText={setNewEventAmount}
              keyboardType="numeric"
            />
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <View>
                <Text>Recurrence Type:</Text>
              </View>
              <View>
                <TouchableOpacity
                  onPress={() => handleRecurrenceTypeChange("every_nth_day")}
                >
                  <Text
                    style={{
                      marginLeft: 10,
                      color:
                        newEventRecurrenceType === "every_nth_day"
                          ? "blue"
                          : "black",
                    }}
                  >
                    Every Nth Day
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleRecurrenceTypeChange("nth_day_of_month")}
                >
                  <Text
                    style={{
                      marginLeft: 10,
                      color:
                        newEventRecurrenceType === "nth_day_of_month"
                          ? "blue"
                          : "black",
                    }}
                  >
                    Nth Day of Month
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            {newEventRecurrenceType === "nth_day_of_month" ? (
              <TextInput
                placeholder="Enter day of the month"
                onChangeText={handleFrequencyValueChange}
                keyboardType="numeric"
                style={{ marginTop: 10 }}
              />
            ) : (
              <View>
                {/* Using date picker for event dates */}
                <Text>When is the last time this event occurred?</Text>
                <Button title="Add Date" onPress={toggleDatepicker1} />
                {showDatePicker1 && (
                  <DateTimePicker
                    value={currentDate}
                    mode="date"
                    display="default"
                    onChange={onChangeLastConfirmedDate}
                  />
                )}
                <Text>
                  When is the last time this event occurred before that?
                </Text>
                <Button title="Add Date" onPress={toggleDatepicker2} />
                {showDatePicker2 && (
                  <DateTimePicker
                    value={currentDate}
                    mode="date"
                    display="default"
                    onChange={onChange2ndLastConfirmedDate}
                  />
                )}
                {/* Displaying frequency */}
                {/* {newEvent2ndLastConfirmedDate && newEventLastConfirmedDate && (
                  <View>
                  <Text>Frequency: {newEventFrequency} days</Text>
                  </View>
                )} */}
              </View>
            )}
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <View>
                <Text>Payment/Withdrawal Method:</Text>
              </View>
              <View>
                <TouchableOpacity
                  onPress={() => handleNewEventPaymentMethodChange("Auto")}
                >
                  <Text
                    style={{
                      marginLeft: 10,
                      color:
                        newEventPaymentMethod === "Auto" ? "blue" : "black",
                    }}
                  >
                    Auto
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleNewEventPaymentMethodChange("Manual")}
                >
                  <Text
                    style={{
                      marginLeft: 10,
                      color:
                        newEventPaymentMethod === "Manual" ? "blue" : "black",
                    }}
                  >
                    Manual
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            {/* Displaying Next Event Date */}
            {/* {calculateNextEventDate() !== null && ( */}
            <View>
              <Text>Next Event Date: {newEventNextDate || newEventDiffDays}</Text>
            </View>
            {/* )} */}
            <Button title="Add Event" onPress={handleCreateEvent} />
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
            <Text>Event Type: {item.type}</Text>
            <Text>Amount: ${item.amount}</Text>
            {/* <Text>{item.recurring_type}</Text> */}
            <Text>Frequency: {item.frequency}</Text>
            <Text>Payment Method: {item.payment_method}</Text>
            <Text>Last Event Date: {item.last_confirmed_date.split("T")[0]}</Text>
            <Text>Next Event Date: {item.next_event_date.split("T")[0]}</Text>
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
        contentContainerStyle={{ paddingBottom: 95 }}
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
