import React, { useState, useEffect } from "react";
import { 
  View, 
  Button, 
  Text, 
  TextInput, 
  StyleSheet, 
  ScrollView,
  TouchableOpacity,
  Alert,
  RefreshControl
} from "react-native";
import axios from "axios";
import DateTimePicker from '@react-native-community/datetimepicker';

const GetFromDatabase = () => {
  const baseURL = "http://127.0.0.1:5000";
  const [flights, setFlights] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  
  // Form states
  const [tahrCount, setTahrCount] = useState('');
  const [intruderCount, setIntruderCount] = useState('');
  const [flightDate, setFlightDate] = useState(new Date());
  const [duration, setDuration] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);

  const fetchFlights = async () => {
    try {
      const response = await axios.get(`${baseURL}/flight_data`);
      setFlights(response.data);
    } catch (error) {
      console.error("Error fetching flights:", error);
      Alert.alert("Error", "Failed to fetch flight data");
    }
  };

  const addFlight = async () => {
    try {
      const formattedDate = flightDate.toISOString().slice(0, 10);
      console.log('Sending date to server:', formattedDate);
      
      await axios.post(`${baseURL}/flight_data`, {
        tahr_count: parseInt(tahrCount),
        intruder_detections: parseInt(intruderCount),
        flight_date: formattedDate,
        flight_duration: parseInt(duration)
      });
      
      // Clear form
      setTahrCount('');
      setIntruderCount('');
      setFlightDate(new Date());
      setDuration('');
      
      // Refresh flight list
      fetchFlights();
      Alert.alert("Success", "Flight data added successfully");
    } catch (error) {
      console.error("Error adding flight:", error);
      Alert.alert("Error", "Failed to add flight data");
    }
  };

  const deleteFlight = async (id: number) => {
    try {
      await axios.delete(`${baseURL}/flight_data/${id}`);
      fetchFlights();
      Alert.alert("Success", "Flight deleted successfully");
    } catch (error) {
      console.error("Error deleting flight:", error);
      Alert.alert("Error", "Failed to delete flight");
    }
  };

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await fetchFlights();
    setRefreshing(false);
  }, []);

  useEffect(() => {
    fetchFlights();
  }, []);

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.formContainer}>
        <Text style={styles.title}>Add New Flight Data</Text>
        
        <TextInput
          style={styles.input}
          placeholder="Tahr Count"
          value={tahrCount}
          onChangeText={setTahrCount}
          keyboardType="numeric"
        />
        
        <TextInput
          style={styles.input}
          placeholder="Intruder Detections"
          value={intruderCount}
          onChangeText={setIntruderCount}
          keyboardType="numeric"
        />
        
        <TouchableOpacity 
          style={styles.dateButton}
          onPress={() => setShowDatePicker(true)}
        >
          <Text>Select Date: {flightDate.toLocaleDateString()}</Text>
        </TouchableOpacity>
        
        {showDatePicker && (
          <DateTimePicker
            value={flightDate}
            mode="date"
            onChange={(event, selectedDate) => {
              setShowDatePicker(false);
              if (selectedDate) setFlightDate(selectedDate);
            }}
          />
        )}
        
        <TextInput
          style={styles.input}
          placeholder="Flight Duration (minutes)"
          value={duration}
          onChangeText={setDuration}
          keyboardType="numeric"
        />
        
        <TouchableOpacity style={styles.addButton} onPress={addFlight}>
          <Text style={styles.buttonText}>Add Flight Data</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.tableContainer}>
        <Text style={styles.title}>Flight Data Table</Text>
        
        {/* Table Header */}
        <View style={styles.tableHeader}>
          <Text style={[styles.headerCell, { flex: 1 }]}>Flight #</Text>
          <Text style={[styles.headerCell, { flex: 1 }]}>Tahr</Text>
          <Text style={[styles.headerCell, { flex: 1 }]}>Intruders</Text>
          <Text style={[styles.headerCell, { flex: 1.5 }]}>Date</Text>
          <Text style={[styles.headerCell, { flex: 1 }]}>Duration</Text>
          <Text style={[styles.headerCell, { flex: 0.8 }]}>Action</Text>
        </View>

        {/* Table Rows */}
        {flights.map((flight) => (
          <View key={flight.id} style={styles.tableRow}>
            <Text style={[styles.cell, { flex: 1 }]}>#{flight.flight_number}</Text>
            <Text style={[styles.cell, { flex: 1 }]}>{flight.tahr_count}</Text>
            <Text style={[styles.cell, { flex: 1 }]}>{flight.intruder_detections}</Text>
            <Text style={[styles.cell, { flex: 1.5 }]}>
              {new Date(flight.flight_date).toLocaleDateString()}
            </Text>
            <Text style={[styles.cell, { flex: 1 }]}>{flight.flight_duration}m</Text>
            <TouchableOpacity
              style={[styles.deleteButton, { flex: 0.8 }]}
              onPress={() => deleteFlight(flight.id)}
            >
              <Text style={styles.buttonText}>Delete</Text>
            </TouchableOpacity>
          </View>
        ))}

        {/* No Data Message */}
        {flights.length === 0 && (
          <View style={styles.noDataContainer}>
            <Text style={styles.noDataText}>No flight data available</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  formContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
  },
  dateButton: {
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    marginBottom: 15,
  },
  addButton: {
    backgroundColor: '#FF4B2B',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  tableContainer: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    marginBottom: 20,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f5f5f5',
    padding: 10,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomWidth: 2,
    borderBottomColor: '#FF4B2B',
  },
  headerCell: {
    fontWeight: 'bold',
    color: '#2c3e50',
    fontSize: 14,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    padding: 10,
    alignItems: 'center',
  },
  cell: {
    fontSize: 14,
    color: '#2c3e50',
  },
  deleteButton: {
    backgroundColor: '#FF4B2B',
    padding: 5,
    borderRadius: 5,
    alignItems: 'center',
  },
  noDataContainer: {
    padding: 20,
    alignItems: 'center',
  },
  noDataText: {
    color: '#666',
    fontSize: 16,
  },
});

export default GetFromDatabase;
