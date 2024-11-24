import React, { useState, useEffect } from 'react';
import { Ionicons } from "@expo/vector-icons";
import axios from 'axios';
import {
  View,
  Text,
  Image,
  TextInput,
  StyleSheet,
  ScrollView,
  Pressable,
  Alert,
  Modal,
} from "react-native";
import DateTimePicker from '@react-native-community/datetimepicker';

interface FlightData {
  id: number;
  tahr_count: number;
  intruder_detections: number;
  flight_date: string;
  flight_duration: number;
  flight_number: string;
}

export default function Statistics() {
  const [searchQuery, setSearchQuery] = useState('');
  const [flights, setFlights] = useState<FlightData[]>([]);
  const [stats, setStats] = useState({
    totalFlights: 0,
    totalTime: 0,
    totalDetections: 0,
  });

  const baseURL = "http://127.0.0.1:5000";

  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().setMonth(new Date().getMonth() - 1)), // Default to last month
    endDate: new Date(),
  });
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  // Add state for manual date inputs
  const [manualDates, setManualDates] = useState({
    startDate: dateRange.startDate.toISOString().split('T')[0],
    endDate: dateRange.endDate.toISOString().split('T')[0]
  });

  const fetchFlights = async () => {
    try {
      const response = await axios.get(`${baseURL}/flight_data`);
      setFlights(response.data);
      
      // Calculate statistics
      const totalFlights = response.data.length;
      const totalTime = response.data.reduce((acc: number, flight: FlightData) => 
        acc + flight.flight_duration, 0);
      const totalDetections = response.data.reduce((acc: number, flight: FlightData) => 
        acc + flight.tahr_count + flight.intruder_detections, 0);
      
      setStats({
        totalFlights,
        totalTime,
        totalDetections,
      });
    } catch (error) {
      console.error("Error fetching flights:", error);
      Alert.alert("Error", "Failed to fetch flight data");
    }
  };

  useEffect(() => {
    fetchFlights();
  }, []);

  // Filter flights based on search query
  const filteredFlights = flights.filter(flight => {
    const searchMatch = flight.flight_number.toString().toLowerCase().includes(searchQuery.toLowerCase());
    const flightDate = new Date(flight.flight_date);
    const dateMatch = flightDate >= dateRange.startDate && 
                     flightDate <= new Date(dateRange.endDate.setHours(23, 59, 59)); // Include full end date
    return searchMatch && dateMatch;
  });

  // Add a function to reset to default dates
  const resetDateFilter = () => {
    const defaultStartDate = new Date(new Date().setMonth(new Date().getMonth() - 1));
    const defaultEndDate = new Date();
    
    setDateRange({
      startDate: defaultStartDate,
      endDate: defaultEndDate
    });
    setManualDates({
      startDate: defaultStartDate.toISOString().split('T')[0],
      endDate: defaultEndDate.toISOString().split('T')[0]
    });
  };

  const FilterModal = () => (
    <Modal
      visible={isFilterVisible}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setIsFilterVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.filterHeader}>
            <Text style={styles.modalTitle}>Filter by Date Range</Text>
            <Pressable 
              style={styles.clearButton}
              onPress={() => {
                resetDateFilter();
                setIsFilterVisible(false);
              }}
            >
              <Text style={styles.clearButtonText}>Clear Filter</Text>
            </Pressable>
          </View>
          
          <View style={styles.datePickerContainer}>
            <Text style={styles.dateLabel}>Start Date:</Text>
            <View style={styles.dateInputContainer}>
              <TextInput
                style={styles.dateInput}
                value={manualDates.startDate}
                onChangeText={(text) => {
                  setManualDates(prev => ({...prev, startDate: text}));
                }}
                placeholder="YYYY-MM-DD"
              />
              <Pressable 
                style={styles.calendarButton}
                onPress={() => setShowStartPicker(true)}
              >
                <Ionicons name="calendar-outline" size={20} color="#666" />
              </Pressable>
            </View>
          </View>

          <View style={styles.datePickerContainer}>
            <Text style={styles.dateLabel}>End Date:</Text>
            <View style={styles.dateInputContainer}>
              <TextInput
                style={styles.dateInput}
                value={manualDates.endDate}
                onChangeText={(text) => {
                  setManualDates(prev => ({...prev, endDate: text}));
                }}
                placeholder="YYYY-MM-DD"
              />
              <Pressable 
                style={styles.calendarButton}
                onPress={() => setShowEndPicker(true)}
              >
                <Ionicons name="calendar-outline" size={20} color="#666" />
              </Pressable>
            </View>
          </View>

          <View style={styles.modalButtons}>
            <Pressable 
              style={styles.modalButton}
              onPress={() => {
                setIsFilterVisible(false);
                // Reset to previous values
                setManualDates({
                  startDate: dateRange.startDate.toISOString().split('T')[0],
                  endDate: dateRange.endDate.toISOString().split('T')[0]
                });
              }}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </Pressable>
            <Pressable 
              style={styles.modalButton}
              onPress={() => {
                // Validate and apply dates
                try {
                  const newStartDate = new Date(manualDates.startDate);
                  const newEndDate = new Date(manualDates.endDate);
                  
                  if (isNaN(newStartDate.getTime()) || isNaN(newEndDate.getTime())) {
                    Alert.alert('Invalid Date', 'Please enter dates in YYYY-MM-DD format');
                    return;
                  }
                  
                  setDateRange({
                    startDate: newStartDate,
                    endDate: newEndDate
                  });
                  setIsFilterVisible(false);
                } catch (error) {
                  Alert.alert('Invalid Date', 'Please enter dates in YYYY-MM-DD format');
                }
              }}
            >
              <Text style={styles.buttonText}>Apply</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable>
          <Image
            source={require("../../assets/images/goat-logo.png")}
            style={styles.logo}
          />
        </Pressable>
        <Image
          source={{ uri: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2.5&w=256&h=256&q=80" }}
          style={styles.profilePicture}
        />
      </View>

      {/* Search and Filter */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by flight number..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <Pressable 
          style={styles.filterButton}
          onPress={() => setIsFilterVisible(true)}
        >
          <Ionicons name="filter" size={20} color="white" />
        </Pressable>
        
        {isFilterVisible && (
          <View style={styles.filterDropdown}>
            <View style={styles.filterHeader}>
              <Text style={styles.modalTitle}>Filter by Date Range</Text>
              <Pressable 
                style={styles.clearButton}
                onPress={() => {
                  resetDateFilter();
                  setIsFilterVisible(false);
                }}
              >
                <Text style={styles.clearButtonText}>Clear Filter</Text>
              </Pressable>
            </View>
            
            <View style={styles.datePickerContainer}>
              <Text style={styles.dateLabel}>Start Date:</Text>
              <View style={styles.dateInputContainer}>
                <TextInput
                  style={styles.dateInput}
                  value={manualDates.startDate}
                  onChangeText={(text) => {
                    setManualDates(prev => ({...prev, startDate: text}));
                  }}
                  placeholder="YYYY-MM-DD"
                />
                <Pressable 
                  style={styles.calendarButton}
                  onPress={() => setShowStartPicker(true)}
                >
                  <Ionicons name="calendar-outline" size={20} color="#666" />
                </Pressable>
              </View>
            </View>

            <View style={styles.datePickerContainer}>
              <Text style={styles.dateLabel}>End Date:</Text>
              <View style={styles.dateInputContainer}>
                <TextInput
                  style={styles.dateInput}
                  value={manualDates.endDate}
                  onChangeText={(text) => {
                    setManualDates(prev => ({...prev, endDate: text}));
                  }}
                  placeholder="YYYY-MM-DD"
                />
                <Pressable 
                  style={styles.calendarButton}
                  onPress={() => setShowEndPicker(true)}
                >
                  <Ionicons name="calendar-outline" size={20} color="#666" />
                </Pressable>
              </View>
            </View>

            <View style={styles.modalButtons}>
              <Pressable 
                style={styles.modalButton}
                onPress={() => {
                  setIsFilterVisible(false);
                  // Reset to previous values
                  setManualDates({
                    startDate: dateRange.startDate.toISOString().split('T')[0],
                    endDate: dateRange.endDate.toISOString().split('T')[0]
                  });
                }}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </Pressable>
              <Pressable 
                style={styles.modalButton}
                onPress={() => {
                  // Validate and apply dates
                  try {
                    const newStartDate = new Date(manualDates.startDate);
                    const newEndDate = new Date(manualDates.endDate);
                    
                    if (isNaN(newStartDate.getTime()) || isNaN(newEndDate.getTime())) {
                      Alert.alert('Invalid Date', 'Please enter dates in YYYY-MM-DD format');
                      return;
                    }
                    
                    setDateRange({
                      startDate: newStartDate,
                      endDate: newEndDate
                    });
                    setIsFilterVisible(false);
                  } catch (error) {
                    Alert.alert('Invalid Date', 'Please enter dates in YYYY-MM-DD format');
                  }
                }}
              >
                <Text style={styles.buttonText}>Apply</Text>
              </Pressable>
            </View>
          </View>
        )}
      </View>

      {/* Flight Statistics Summary */}
      <View style={styles.statsContainer}>
        <Text style={styles.sectionTitle}>Flight Statistics</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{stats.totalFlights}</Text>
            <Text style={styles.statLabel}>Total Flights</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{Math.round(stats.totalTime / 60)}h</Text>
            <Text style={styles.statLabel}>Flight Time</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{stats.totalDetections}</Text>
            <Text style={styles.statLabel}>Total Detections</Text>
          </View>
        </View>
      </View>

      {/* Flight List */}
      <View style={styles.flightsSection}>
        <Text style={styles.sectionTitle}>Flight History</Text>
        {filteredFlights.map((flight) => (
          <View key={flight.id} style={styles.flightCard}>
            <View style={styles.flightHeader}>
              <View style={styles.flightHeaderLeft}>
                <Text style={styles.flightNumber}>Flight #{flight.flight_number}</Text>
                <Text style={styles.flightDate}>
                  {new Date(flight.flight_date).toLocaleDateString()}
                </Text>
              </View>
              <Text style={styles.flightDuration}>{flight.flight_duration}m</Text>
            </View>
            <View style={styles.flightDetails}>
              <View style={styles.detectionBox}>
                <Text style={styles.detectionLabel}>Tahr Detected</Text>
                <Text style={styles.detectionCount}>{flight.tahr_count}</Text>
              </View>
              <View style={styles.verticalDivider} />
              <View style={styles.detectionBox}>
                <Text style={styles.detectionLabel}>Intruders</Text>
                <Text style={[styles.detectionCount, styles.intruderCount]}>{flight.intruder_detections}</Text>
              </View>
            </View>
          </View>
        ))}
      </View>

      {/* Add the DateTimePicker components here */}
      {showStartPicker && (
        <DateTimePicker
          value={dateRange.startDate}
          mode="date"
          onChange={(event, selectedDate) => {
            setShowStartPicker(false);
            if (selectedDate) {
              setDateRange(prev => ({...prev, startDate: selectedDate}));
              setManualDates(prev => ({
                ...prev, 
                startDate: selectedDate.toISOString().split('T')[0]
              }));
            }
          }}
        />
      )}

      {showEndPicker && (
        <DateTimePicker
          value={dateRange.endDate}
          mode="date"
          onChange={(event, selectedDate) => {
            setShowEndPicker(false);
            if (selectedDate) {
              setDateRange(prev => ({...prev, endDate: selectedDate}));
              setManualDates(prev => ({
                ...prev, 
                endDate: selectedDate.toISOString().split('T')[0]
              }));
            }
          }}
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
  greeting: {
    fontWeight: "700",
    fontSize: 30,
    marginBottom: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 20,
    position: 'relative',
    zIndex: 1000,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 50,
    paddingHorizontal: 15,
    height: 45,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#2c3e50',
  },
  filterButton: {
    backgroundColor: '#FF4B2B',
    width: 45,
    height: 45,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsContainer: {
    marginBottom: 20,
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 15,
    zIndex: 1,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '500',
    marginBottom: 15,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  statBox: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 80,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FF4B2B',
    marginBottom: 5,
    textAlign: 'center',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  flightsSection: {
    marginBottom: 20,
    zIndex: 1,
  },
  profilePicture: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#FFA500',
  },
  flightCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 15,
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  flightHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  flightDate: {
    fontSize: 14,
    color: '#666',
  },
  flightDuration: {
    fontSize: 14,
    color: '#666',
    backgroundColor: '#f0f2f5',
  },
  flightDetails: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    gap: 5,
  },
  verticalDivider: {
    width: 1,
    height: '100%',
    backgroundColor: '#eee',
    marginHorizontal: 10,
  },
  detailText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  flightHeaderLeft: {
    flexDirection: 'column',
    gap: 4,
  },
  flightNumber: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FF4B2B',
    marginBottom: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
  },
  datePickerContainer: {
    marginBottom: 15,
  },
  dateLabel: {
    fontSize: 16,
    marginBottom: 5,
    color: '#666',
  },
  dateInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  dateInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    paddingHorizontal: 10,
  },
  calendarButton: {
    padding: 10,
    marginLeft: 10,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    gap: 10,
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: 'transparent', // Remove background color
  },
  buttonText: {
    color: '#FF4B2B',  // Orange color for both buttons
    fontSize: 16,
    fontWeight: '600',
  },
  filterDropdown: {
    position: 'absolute',
    top: '100%',
    right: 0,
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    width: 300,
    marginTop: 10,
    zIndex: 1001,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  filterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  clearButton: {
    padding: 5,
  },
  clearButtonText: {
    color: '#FF4B2B',
    fontSize: 14,
    fontWeight: '500',
  },
  detectionBox: {
    flex: 1,
    alignItems: 'center',
  },
  detectionLabel: {
    fontSize: 16,
    color: '#666',
  },
  detectionCount: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FF4B2B',
    marginBottom: 5,
    textAlign: 'center',
  },
  intruderCount: {
    color: '#FF4B2B',
  },
});
