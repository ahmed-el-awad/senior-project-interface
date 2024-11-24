import React, { useEffect, useState } from 'react';
import { View, Button, Text, Alert } from 'react-native';
import axios from 'axios';

const App = () => {
  const baseURL = 'http://127.0.0.1:5000';  // Replace with your server's IP
  const [detectionData, setDetectionData] = useState("Waiting for detection data...");
  const [pollingInterval, setPollingInterval] = useState<NodeJS.Timeout | null>(null); // Adjusted type here

  // Function to start detection
  const startDetection = async () => {
    try {
      const response = await axios.post(`${baseURL}/start_detection`);
      Alert.alert("Success", response.data.message);

      // Start polling every 0.5 seconds to fetch detection data
      const interval = setInterval(fetchDetectionData, 500);
      setPollingInterval(interval); // Save interval ID to state
    } catch (error) {
      Alert.alert("Error", "Failed to start detection");
      console.error(error);
    }
  };

  // Function to end detection
  const endDetection = async () => {
    try {
      const response = await axios.post(`${baseURL}/end_detection`);
      Alert.alert("Success", response.data.message);

      // Stop polling when detection ends
      if (pollingInterval) {
        clearInterval(pollingInterval);
        setPollingInterval(null);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to stop detection");
      console.error(error);
    }
  };

  // Polling function to get the latest detection data
  const fetchDetectionData = async () => {
    try {
      const response = await axios.get(`${baseURL}/get_latest_detection`);
      console.log("Detection Data:", response.data);
      setDetectionData(response.data.detections);
    } catch (error) {
      console.error("Error fetching detection data:", error);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button title="New Flight" onPress={startDetection} />
      <View style={{ marginTop: 20 }}>
        <Button title="End Flight" onPress={endDetection} />
      </View>
      <View style={{ marginTop: 40 }}>
        <Text>Detection Data:</Text>
        <Text>{detectionData}</Text>
      </View>
    </View>
  );
};

export default App;
