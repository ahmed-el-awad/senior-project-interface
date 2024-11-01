import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { MaterialIcons } from '@expo/vector-icons';

export default function Patrol() {
  const [checkIn, setCheckIn] = useState(new Date());
  const [checkOut, setCheckOut] = useState(new Date());
  const [showCheckIn, setShowCheckIn] = useState(false);
  const [showCheckOut, setShowCheckOut] = useState(false);
  const [patrolArea, setPatrolArea] = useState('');
  const [notes, setNotes] = useState('');
  const [team, setTeam] = useState('');

  const onCheckInChange = (event: any, selectedDate?: Date) => {
    setShowCheckIn(false);
    if (selectedDate) setCheckIn(selectedDate);
  };

  const onCheckOutChange = (event: any, selectedDate?: Date) => {
    setShowCheckOut(false);
    if (selectedDate) setCheckOut(selectedDate);
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Image
          source={require("../../assets/images/goat-logo.png")}
          style={styles.logo}
        />
        <Image
          source={{ uri: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2.5&w=256&h=256&q=80" }}
          style={styles.profilePicture}
        />
      </View>

      <Text style={styles.title}>Patrol Details</Text>

      {/* Form Container */}
      <View style={styles.formContainer}>
        {/* Check-in Time */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Check-in Time</Text>
          <TouchableOpacity 
            style={styles.timeButton}
            onPress={() => setShowCheckIn(true)}
          >
            <Text style={styles.timeText}>
              {checkIn.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Text>
            <MaterialIcons name="access-time" size={24} color="#FF4B2B" />
          </TouchableOpacity>
        </View>

        {/* Check-out Time */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Check-out Time</Text>
          <TouchableOpacity 
            style={styles.timeButton}
            onPress={() => setShowCheckOut(true)}
          >
            <Text style={styles.timeText}>
              {checkOut.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Text>
            <MaterialIcons name="access-time" size={24} color="#FF4B2B" />
          </TouchableOpacity>
        </View>

        {/* Patrol Area */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Patrol Area</Text>
          <TextInput
            style={styles.input}
            value={patrolArea}
            onChangeText={setPatrolArea}
            placeholder="Enter patrol area"
          />
        </View>

        {/* Team Members */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Team Members</Text>
          <TextInput
            style={styles.input}
            value={team}
            onChangeText={setTeam}
            placeholder="Enter team members"
          />
        </View>

        {/* Notes */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Notes</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={notes}
            onChangeText={setNotes}
            placeholder="Enter any additional notes"
            multiline
            numberOfLines={4}
          />
        </View>

        {/* Submit Button */}
        <TouchableOpacity style={styles.submitButton}>
          <Text style={styles.submitButtonText}>Start Patrol</Text>
        </TouchableOpacity>
      </View>

      {showCheckIn && (
        <DateTimePicker
          value={checkIn}
          mode="time"
          is24Hour={true}
          onChange={onCheckInChange}
        />
      )}

      {showCheckOut && (
        <DateTimePicker
          value={checkOut}
          mode="time"
          is24Hour={true}
          onChange={onCheckOutChange}
        />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f2f5',
    padding: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  logo: {
    width: 80,
    height: 65,
  },
  profilePicture: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#FFA500',
  },
  title: {
    fontSize: 30,
    fontWeight: '700',
    marginBottom: 20,
  },
  formContainer: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
    color: '#2c3e50',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  timeButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
  },
  timeText: {
    fontSize: 16,
    color: '#2c3e50',
  },
  submitButton: {
    backgroundColor: '#FF4B2B',
    borderRadius: 25,
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
}); 