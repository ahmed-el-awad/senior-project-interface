import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const { width, height } = Dimensions.get("window");

const LiveFeed = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications] = useState([
    { id: 1, message: "Flight ended at 2:45 PM", timestamp: "2 mins ago" },
    { id: 2, message: "Intruder Detected", timestamp: "15 mins ago" },
    { id: 3, message: "New flight started", timestamp: "1 hour ago" },
  ]);

  const [imageUri, setImageUri] = useState("");
  const [liveFeedData, setLiveFeedData] = useState({
    humanCount: 0,
    donkeyCount: 0,
    tahrCount: 0,
  });

  // Fetch the MJPEG stream URL every 100ms
  useEffect(() => {
    const intervalId = setInterval(() => {
      setImageUri("http://localhost:5000/video_feed"); // Flask server MJPEG feed URL
    }, 100); // Update the image every 100ms (adjust as necessary)

    return () => clearInterval(intervalId); // Clean up interval on component unmount
  }, []);

  // Fetch the object counts from the Flask server
  useEffect(() => {
    const fetchObjectCount = async () => {
      try {
        const response = await fetch("http://127.0.0.1:5000/object_count"); // Endpoint for detections
        const data = await response.json();
        console.log("Response data:", data); // Log the response to check its structure

        // Ensure the response contains detections and destructure it
        if (data.detections) {
          const { human, donkey, tahr } = data.detections;
          console.log(`Human: ${human}, Donkey: ${donkey}, Tahr: ${tahr}`); // Log values
          setLiveFeedData({ humanCount: human, donkeyCount: donkey, tahrCount: tahr });
        } else {
          console.error("Invalid response structure", data);
        }
      } catch (error) {
        console.error("Error fetching object count:", error);
      }
    };

    fetchObjectCount(); // Call the function to fetch object count

    // Optionally set an interval to refresh the count periodically
    const intervalId = setInterval(fetchObjectCount, 5000); // Fetch every 5 seconds
    return () => clearInterval(intervalId); // Cleanup on component unmount
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Image source={require("../../assets/images/goat-logo.png")} style={styles.logo} />
          <View style={styles.headerRight}>
            <View style={styles.notificationContainer}>
              <TouchableOpacity onPress={() => setShowNotifications(!showNotifications)}>
                <MaterialIcons name="notifications" size={24} color="#fff" />
              </TouchableOpacity>
              {showNotifications && (
                <View style={styles.notificationDropdown}>
                  {notifications.map((notification) => (
                    <View key={notification.id} style={styles.notificationItem}>
                      <Text style={styles.notificationText}>{notification.message}</Text>
                      <Text style={styles.notificationTime}>{notification.timestamp}</Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
            <Image
              source={{
                uri: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2.5&w=256&h=256&q=80",
              }}
              style={styles.profilePicture}
            />
          </View>
        </View>

        <View style={styles.titleContainer}>
          <Text style={styles.flightNumber}>Flight #1234</Text>
          <Text style={styles.dateTimeText}>January 1, 2025 • 3:00 PM</Text>
        </View>

        <LinearGradient
          colors={["#FF416C", "#FF4B2B"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.liveStreamContainer}
        >
          <MaterialIcons name="live-tv" size={24} color="#fff" />
          <Text style={styles.title}>Live Feed</Text>
        </LinearGradient>

        {/* Displaying MJPEG stream using Image */}

        <View style={styles.infoContainer}>
          <View style={styles.infoBoxContainer}>
            <Text style={styles.label}>Tahr</Text>
            <View style={styles.countBox}>
              <Text style={styles.countText}>{liveFeedData.tahrCount}</Text>{" "}
              {/* Display tahr count */}
            </View>
          </View>

          <View style={styles.infoBoxContainer}>
            <Text style={styles.label}>Intruders</Text>
            <View style={styles.countBox}>
              <Text style={styles.countText}>
                {liveFeedData.humanCount + liveFeedData.donkeyCount}{" "}
                {/* Display sum of human and donkey counts */}
              </Text>
            </View>
          </View>

          <View style={styles.infoBoxContainer}>
            <Text style={styles.label}>Flight Time</Text>
            <View style={styles.countBox}>
              <Text style={styles.countText}>02:30</Text> {/* Static flight time (for example) */}
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f2f5",
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 30,
    zIndex: 2,
    elevation: 2,
  },
  logo: {
    width: 80,
    height: 65,
    resizeMode: "contain",
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    zIndex: 2,
    elevation: 2,
  },
  notificationContainer: {
    backgroundColor: "#FF4B2B",
    padding: 10,
    borderRadius: 20,
    marginRight: 10,
    zIndex: 9999,
    elevation: 9999,
  },
  profilePicture: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: "#FFA500",
  },
  titleContainer: {
    marginBottom: 25,
  },
  flightNumber: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 5,
  },
  dateTimeText: {
    fontSize: 16,
    color: "#7f8c8d",
  },
  liveStreamContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    padding: 10,
    borderRadius: 25,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 8,
    color: "#fff",
  },
  video: {
    width: "100%",
    aspectRatio: 16 / 9,
    borderRadius: 15,
    overflow: "hidden",
    marginBottom: 25,
    backgroundColor: "#000",
  },
  infoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  infoBoxContainer: {
    alignItems: "center",
    flex: 1,
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
    color: "#7f8c8d",
  },
  countBox: {
    backgroundColor: "#FF4B2B",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 15,
    width: 80,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
  },
  countText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  notificationDropdown: {
    position: "absolute",
    top: 50,
    right: 0,
    backgroundColor: "#fff",
    borderRadius: 10,
    width: 200,
    elevation: 5,
  },
  notificationItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f2f5",
  },
  notificationText: {
    fontSize: 14,
    fontWeight: "bold",
  },
  notificationTime: {
    fontSize: 12,
    color: "#7f8c8d",
  },
});

export default LiveFeed;
