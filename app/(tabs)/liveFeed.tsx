import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Video, ResizeMode } from "expo-av"; // Use expo-av for video
import { MaterialIcons } from "@expo/vector-icons"; // Import icons from expo/vector-icons

const LiveFeed = () => {
  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text>
          <MaterialIcons name="live-tv" size={24} color="red" /> {/* Add the live streaming icon */}
        </Text>
        <Text style={styles.title}>Live Stream</Text>
      </View>
      <Video
        source={{
          uri: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4",
        }} // Use a direct video URL
        style={styles.video}
        resizeMode={ResizeMode.CONTAIN}
        useNativeControls
        shouldPlay
      />
      <Text style={styles.countText}>Count: 0</Text>
    </View> // Counter not working just displaying text for now
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  titleContainer: {
    flexDirection: "row", // Align children horizontally
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginLeft: 8,
    textAlign: "center",
  },
  video: {
    width: 480,
    height: 270,
    backgroundColor: "black",
  },
  countText: {
    marginTop: 20, // Add some space above the text
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default LiveFeed;
