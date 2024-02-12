import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Button, TextInput, Modal, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';

export function EventListScreen() {
    const [events, setEvents] = useState([]);
    const [newEventTitle, setNewEventTitle] = useState('');
    const [newEventType, setNewEventType] = useState('');
    const [newEventAmount, setNewEventAmount] = useState('');
    const [newEventPaymentMethod, setNewEventPaymentMethod] = useState('');
    const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
    const [updateEvent, setUpdateEvent] = useState(null);
    const [isAddEventModalVisible, setIsAddEventModalVisible] = useState(false);
    const [recurringType, setRecurringType] = useState('');
    const [recurringFrequency, setRecurringFrequency] = useState('');
    const [recurringIntervalType, setRecurringIntervalType] = useState('');
    const [recurringSuffix, setRecurringSuffix] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('');
    const userId = 1

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const response = await axios.get('https://fecf-71-85-245-93.ngrok-free.app/events');
            setEvents(response.data);
        } catch (error) {
            console.error('Error fetching events: ', error);
        }
    };

    const handleCreateEvent = async () => {
        try {
            // Prepare event data including the recurring type and frequency
            frequencyString = ""
            if (recurringType === "same day every month") {
                frequencyString = `The ${recurringFrequency} of every month`
            } else {
                frequencyString = `Every ${recurringFrequency} ${recurringIntervalType}`
            }
            const eventData = {
                title: newEventTitle,
                type: newEventType,
                amount: newEventAmount,
                user_id: userId,
                recurring_type: recurringType,
                frequency: frequencyString,
                payment_method: paymentMethod,
            };

            // Send the event data to the server
            await axios.post('https://fecf-71-85-245-93.ngrok-free.app/events', eventData);

            // Refresh event list after creating event
            fetchEvents();

            // Clear input fields and hide the add event modal
            // setNewEventTitle('');
            // setNewEventType('');
            setIsAddEventModalVisible(false);
        } catch (error) {
            console.error('Error creating event: ', error);
        }
    };

    // const handleDeleteEvent = async (eventId) => {
    //     try {
    //         await axios.delete(`https://fecf-71-85-245-93.ngrok-free.app/events/${eventId}`);
    //         fetchEvents(); // Refresh event list after deleting event
    //     } catch (error) {
    //         console.error('Error deleting event: ', error);
    //     }
    // };

    // const handleUpdateEvent = async () => {
    //     if (!updateEvent) return;
    //     try {
    //         await axios.put(`https://fecf-71-85-245-93.ngrok-free.app/events/${updateEvent.id}`, {
    //             ...updateEvent,
    //             userId: userId
    //         });
    //         fetchEvents(); // Refresh event list after updating event
    //         setIsUpdateModalVisible(false); // Hide the update modal
    //     } catch (error) {
    //         console.error('Error updating event: ', error);
    //     }
    // };

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
                            onChangeText={setNewEventTitle}
                        />
                        <TextInput
                            placeholder="Amount"
                            onChangeText={setNewEventAmount}
                        />
                        <View>
                            <Text>Event Type</Text>
                            <Picker
                                selectedValue={recurringSuffix} // Added selectedValue prop
                                onValueChange={(itemValue, itemIndex) => setNewEventType(itemValue)} // Changed setRecurringType to setRecurringSuffix
                            >
                                <Picker.Item label="Bill" value="Bill" />
                                <Picker.Item label="Pay Day" value="Pay Day" />
                            </Picker>
                        </View>
                        {/* Input for selecting recurring type */}
                        <Text>Select Recurring Type:</Text>
                        <Picker
                            selectedValue={recurringType}
                            onValueChange={(itemValue, itemIndex) => setRecurringType(itemValue)}
                        >
                            <Picker.Item label="Same Day Every Month" value="same day every month" />
                            <Picker.Item label="Every nth Days/Weeks" value="every nth days/weeks" />
                        </Picker>
                        {/* Conditional input fields based on selected recurring type */}
                        {recurringType === 'same day every month' && (
                            <View>
                                <Text>The </Text>
                                <TextInput
                                    placeholder="1"
                                    onChangeText={setRecurringFrequency} // Corrected the onChangeText prop
                                />
                                <Picker
                                    selectedValue={recurringSuffix} // Added selectedValue prop
                                    onValueChange={(itemValue, itemIndex) => setRecurringSuffix(itemValue)} // Changed setRecurringType to setRecurringSuffix
                                >
                                    <Picker.Item label="st" value="st" />
                                    <Picker.Item label="rd" value="rd" />
                                </Picker>
                                <Text>of every month</Text>
                            </View>
                        )}
                        {recurringType === 'every nth days/weeks' && (
                            <View>
                                <Text>Every </Text>
                                <TextInput
                                    placeholder="1"
                                    onChangeText={setRecurringFrequency} // Corrected the onChangeText prop
                                />
                                <Picker
                                    selectedValue={recurringIntervalType} // Added selectedValue prop
                                    onValueChange={(itemValue, itemIndex) => setRecurringIntervalType(itemValue)} // Changed setRecurringType to setRecurringIntervalType
                                >
                                    <Picker.Item label="days" value="days" />
                                    <Picker.Item label="weeks" value="weeks" />
                                    <Picker.Item label="months" value="months" />
                                    <Picker.Item label="years" value="years" />
                                </Picker>
                            </View>
                        )}
                        <View>
                            <Text>Payment Method</Text>
                            <Picker
                                onValueChange={(itemValue, itemIndex) => setPaymentMethod(itemValue)} // Changed setRecurringType to setRecurringIntervalType
                            >
                                <Picker.Item label="auto-pay" value="auto-pay" />
                                <Picker.Item label="manual" value="manual" />
                            </Picker>
                        </View>
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
                    <View style={{ marginBottom: 20, borderBottomWidth: 1, borderBottomColor: '#ccc', paddingBottom: 10 }}>
                        <Text style={{ fontWeight: 'bold' }}>Title: {item.title}</Text>
                        <Text>Type: {item.type}</Text>
                        <Text>User ID: {item.user_id}</Text>
                        <Text>Amount: {item.amount}</Text>
                        <Text>Recurring Type: {item.recurring_type}</Text>
                        <Text>Frequency: {item.frequency}</Text>
                        <Text>Payment Method: {item.payment_method}</Text>
                        <Text>Created At: {item.created_at}</Text>
                        {/* <Text>Updated At: {item.updated_at}</Text> */}
                    </View>
                )}
            />
            {/* <Modal
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
            </Modal> */}
        </View>
    );
};
