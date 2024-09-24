import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Video, ResizeMode } from "expo-av"; // Use expo-av for video
import { MaterialIcons } from "@expo/vector-icons"; // Import icons from expo/vector-icons
import { Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

const LiveFeed = () => {
  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text>
          <MaterialIcons name="live-tv" size={24} color="red" /> {/* Add the live streaming icon */}
        </Text>
        <Text style={styles.title}>Live Stream</Text>
      </View>
      <View>
        <View style={{ display: "flex", alignContent: "center", alignItems: "center" }}>
          <Video
            source={{
              uri: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4",
            }} // Use a direct video URL
            style={styles.video}
            resizeMode={ResizeMode.CONTAIN}
            useNativeControls
            shouldPlay
          />
        </View>
        <Text style={styles.countText}>Count: 0</Text>
        <Text style={styles.countText}>Habitat: Field</Text>
        <Text style={styles.countText}>Elevation: </Text>
      </View>
    </View> // Counter not working just displaying text for now
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
    flexDirection: "row", // Align children horizontally
    alignItems: "flex-start",
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginLeft: 8,
    textAlign: "center",
  },
  video: {
    width: width / 2,
    height: height / 3,
    // backgroundColor: "black",
  },
  countText: {
    marginTop: 20, // Add some space above the text
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default LiveFeed;
