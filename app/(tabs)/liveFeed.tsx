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
import { Video, ResizeMode } from "expo-av"; // Use expo-av for video
import { MaterialIcons } from "@expo/vector-icons"; // Import icons from expo/vector-icons
import { Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { WebView } from "react-native-webview";

const { width, height } = Dimensions.get("window");

const SERVER_IP = "192.168.1.171"; // Flask server IP

const LiveFeed = () => {
  const [showNotifications, setShowNotifications] = React.useState(false);
  const [imageUri, setImageUri] = useState("");
  const [notifications] = React.useState([
    { id: 1, message: "Flight ended at 2:45 PM", timestamp: "2 mins ago" },
    { id: 2, message: "Intruder Detected", timestamp: "15 mins ago" },
    { id: 3, message: "New flight started", timestamp: "1 hour ago" },
  ]);

  // Add state for detection counts
  const [liveFeedData, setLiveFeedData] = useState({
    humanCount: 0,
    donkeyCount: 0,
    tahrCount: 0,
  });

  // Add these state variables at the top of the LiveFeed component
  const [flightStartTime, setFlightStartTime] = useState<Date | null>(null);
  const [flightTime, setFlightTime] = useState(0);
  const [isFlightActive, setIsFlightActive] = useState(false);

  // Fetch object detection counts from Flask server
  useEffect(() => {
    const fetchObjectCount = async () => {
      try {
        const response = await fetch(`http://${SERVER_IP}:5000/object_count`);
        const data = await response.json();
        console.log("Received data:", data);

        if (data && data.detections) {
          const { human, donkey, tahr } = data.detections;
          setLiveFeedData({
            humanCount: human || 0,
            donkeyCount: donkey || 0,
            tahrCount: tahr || 0,
          });
        }
      } catch (error) {
        console.error("Error fetching object count:", error);
      }
    };

    fetchObjectCount();
    const intervalId = setInterval(fetchObjectCount, 200);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setImageUri("http://localhost:5000/video_feed"); // Flask server MJPEG feed URL
    }, 100); // Update the image every 100ms (adjust as necessary)

    return () => clearInterval(intervalId); // Clean up interval on component unmount
  }, []);

  // Add this useEffect for tracking flight time
  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (isFlightActive && flightStartTime) {
      intervalId = setInterval(() => {
        const currentTime = new Date();
        const elapsedSeconds = Math.floor(
          (currentTime.getTime() - flightStartTime.getTime()) / 1000
        );
        setFlightTime(elapsedSeconds);
      }, 1000);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isFlightActive, flightStartTime]);

  // Add this function to handle flight end
  const handleEndFlight = async () => {
    if (!isFlightActive) return;

    try {
      const flightDuration = Math.floor(flightTime / 60); // Convert seconds to minutes

      await fetch(`http://${SERVER_IP}:5000/flight_data`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tahr_count: liveFeedData.tahrCount,
          intruder_detections: liveFeedData.humanCount + liveFeedData.donkeyCount,
          flight_date: new Date().toISOString().split("T")[0],
          flight_duration: flightDuration,
        }),
      });

      setIsFlightActive(false);
      setFlightStartTime(null);
      setFlightTime(0);
    } catch (error) {
      console.error("Error saving flight data:", error);
    }
  };

  // Add this function to format flight time
  const formatFlightTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Image source={require("../../assets/images/goat-logo.png")} style={styles.logo} />
          <View style={styles.headerRight}>
            <View style={styles.notificationContainer}>
              <TouchableOpacity onPress={() => setShowNotifications(!showNotifications)}>
                <MaterialIcons name="notifications" size={24} color="#000" />
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
          <Text style={styles.flightNumber}>Live Detection</Text>
          <View style={styles.dateTimeContainer}>
            <Text style={styles.dateTimeText}>
              {new Date().toLocaleDateString()}
              {isFlightActive && ` • Flight Time: ${formatFlightTime(flightTime)}`}
            </Text>
            <TouchableOpacity
              style={[
                styles.flightButton,
                isFlightActive ? styles.endFlightButton : styles.startFlightButton,
              ]}
              onPress={() => {
                if (isFlightActive) {
                  handleEndFlight();
                } else {
                  setIsFlightActive(true);
                  setFlightStartTime(new Date());
                }
              }}
            >
              <Text style={[styles.flightButtonText, { color: "#000" }]}>
                {isFlightActive ? "End Flight" : "Start Flight"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <LinearGradient
          colors={["#ECB367", "#ECB367"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.liveStreamContainer}
        >
          <MaterialIcons name="live-tv" size={24} color="#000" />
          <Text style={[styles.title, { color: "#000" }]}>Live Feed</Text>
        </LinearGradient>

        <View style={styles.videoContainer}>
          <Image source={{ uri: imageUri }} style={styles.video} />
        </View>

        <View style={styles.infoContainer}>
          {[
            { label: "Tahr", value: liveFeedData.tahrCount },
            { label: "Intruders", value: liveFeedData.humanCount + liveFeedData.donkeyCount },
            { label: "Habitat", value: "Mountain" },
          ].map(({ label, value }, index) => (
            <View key={index} style={styles.infoBoxContainer}>
              <Text style={styles.label}>{label}</Text>
              <View style={styles.countBox}>
                <Text style={styles.countText}>{value}</Text>
              </View>
            </View>
          ))}
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
    backgroundColor: "#ECB367",
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
    color: "#000",
  },
  videoContainer: {
    width: "100%",
    aspectRatio: 16 / 9,
    backgroundColor: "#000",
    borderRadius: 15,
    overflow: "hidden",
    marginBottom: 25,
  },
  video: {
    flex: 1,
    backgroundColor: "transparent",
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
    color: "#34495e",
    fontWeight: "600",
  },
  countBox: {
    backgroundColor: "#ECB367",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 12,
    minWidth: 90,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  countText: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    color: "#000",
  },
  notificationDropdown: {
    position: "absolute",
    top: 50,
    right: 0,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 10,
    width: 250,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 9999,
    zIndex: 9999,
  },
  notificationItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  notificationText: {
    fontSize: 14,
    color: "#2c3e50",
    marginBottom: 4,
  },
  notificationTime: {
    fontSize: 12,
    color: "#7f8c8d",
  },
  dateTimeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  flightButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  startFlightButton: {
    backgroundColor: "#4CAF50",
  },
  endFlightButton: {
    backgroundColor: "red",
  },
  flightButtonText: {
    color: "#000",
    fontWeight: "600",
  },
});

export default LiveFeed;
