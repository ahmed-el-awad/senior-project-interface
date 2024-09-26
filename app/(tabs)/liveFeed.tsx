import React from "react";
import { StyleSheet, Text, View, Image} from "react-native";
import { Video, ResizeMode } from "expo-av"; // Use expo-av for video
import { MaterialIcons } from "@expo/vector-icons"; // Import icons from expo/vector-icons
import { Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

const LiveFeed = () => {
  return (
    <View style={styles.container}>
      <Image
        source={{ uri: "https://via.placeholder.com/50" }} // Example placeholder profile picture
        style={styles.profilePicture}
      />
      
      {/* Bright orange notification bell on the top left */}
      <MaterialIcons name="notifications" size={50} color="#F4A261" style={styles.notificationBell} />
      <View style={styles.titleContainer}>
        
        {/* Flight number displayed first */}
        <Text style={styles.FlightNumber}>Flight Number: #1234</Text>
        <View style={styles.flightInfo}>
          <Text style={styles.DateTimeText}>Date: January 1, 2025</Text>
        </View>
        <View>
          <Text style={styles.DateTimeText}>Time: 3 PM</Text>
        </View>
        <View style={styles.liveStreamContainer}>
          <MaterialIcons name="live-tv" size={24} color="red" />
          <Text style={styles.title}>Live Feed</Text>
        </View>
      </View>
      <View>
        <View style={{ display: "flex", alignContent: "center", alignItems: "center"}}>
          <Video
            source={{
              uri: "https://videos.pexels.com/video-files/5598968/5598968-uhd_2560_1440_30fps.mp4",
            }} // Use a direct video URL
            style={styles.video}
            resizeMode={ResizeMode.CONTAIN}
            useNativeControls
            shouldPlay
          />
        </View>
        {/* Info Boxes Under the Video */}
        <View style={styles.infoContainer}>
          <View style={styles.infoBoxContainer}>
            <Text style={styles.label}>Count</Text>
            <View style={styles.countBox}>
              <Text style={styles.countText}>0</Text>
            </View>
          </View>
          <View style={styles.infoBoxContainer}>
            <Text style={styles.label}>Habitat</Text>
            <View style={styles.countBox}>
              <Text style={styles.countText}>Field</Text>
            </View>
          </View>
          <View style={styles.infoBoxContainer}>
            <Text style={styles.label}>Elevation</Text>
            <View style={styles.countBox}>
              <Text style={styles.countText}>-</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  titleContainer: {
    width: "100%", // Take up the full width of the screen
    paddingHorizontal: 40, // Add some padding to the left and right
    marginBottom: 20,
  },
  flightInfo: {
    marginTop: 20,
    marginBottom: 10,
  },
  profilePicture: {
    width: 50, // Adjust the size of the profile picture
    height: 50,
    borderRadius: 25, // Make it circular
    position: "absolute", // Position it absolutely
    top: 10, // Position from top
    right: 10, // Position from right
  },
  notificationBell: {
    position: "absolute", // Position it absolutely
    top: 10, // Position from top
    left: 10, // Position from left
  },
  liveStreamContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 100, 
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginLeft: 8,
    textAlign: "center",
  },
  FlightNumber: {
    fontSize: 30,
    fontWeight: "bold",
    alignSelf: 'flex-start', // Align the flight number to the left
  },
  DateTimeText: {
    fontSize: 12,
    fontWeight: "bold",
    alignSelf: 'flex-start', // Align the date to the left
  },
  video: {
    alignSelf: 'center',
    width: width / 1.2,
    height: height / 3,
    borderRadius: 20,
    overflow: "hidden",
  },
  infoContainer: {
    flexDirection: "row", // Align the boxes horizontally
    justifyContent: "space-between", // Even spacing between boxes
    marginTop: 20,
    width: width * 0.8, // Adjust width for proper alignment
  },
  infoBoxContainer: {
    alignItems: "center", // Center the label and the box
  },
  label: {
    fontSize: 14,
    marginBottom: 5,
    textAlign: "center",
  },
  countBox: {
    backgroundColor: "#F4A261", // Light orange background for the count boxes
    paddingHorizontal: 20, // Adjust padding to control the box size
    paddingVertical: 10,
    borderRadius: 8, // Round corners
    justifyContent: "center",
    alignItems: "center",
  },
  countText: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default LiveFeed;
