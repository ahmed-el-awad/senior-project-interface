import React, { useEffect, useState } from "react";
import { StyleSheet, SafeAreaView, View, Text } from "react-native";
import { WebView } from "react-native-webview";

const App = () => {
  const SERVER_IP = "192.168.1.171"; // Flask server IP
  const [liveFeedData, setLiveFeedData] = useState({
    humanCount: 0,
    donkeyCount: 0,
    tahrCount: 0,
  });

  // Fetch object detection counts from Flask server
  useEffect(() => {
    const fetchObjectCount = async () => {
      try {
        const response = await fetch(`http://${SERVER_IP}:5000/object_count`);
        const data = await response.json();
        if (data.detections) {
          setLiveFeedData(data.detections);
        }
      } catch (error) {
        console.error("Error fetching object count:", error);
      }
    };

    fetchObjectCount();
    const intervalId = setInterval(fetchObjectCount, 5000); // Fetch every 5 seconds

    return () => clearInterval(intervalId);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.infoContainer}>
        <View style={styles.infoBox}>
          <Text style={styles.label}>Humans:</Text>
          <Text style={styles.value}>{liveFeedData.humanCount}</Text>
        </View>
        <View style={styles.infoBox}>
          <Text style={styles.label}>Donkeys:</Text>
          <Text style={styles.value}>{liveFeedData.donkeyCount}</Text>
        </View>
        <View style={styles.infoBox}>
          <Text style={styles.label}>Tahrs:</Text>
          <Text style={styles.value}>{liveFeedData.tahrCount}</Text>
        </View>
      </View>

      {/* Render MJPEG stream */}
      <WebView
        source={{ uri: `http://${SERVER_IP}:5000/video_feed` }}
        style={styles.video}
        javaScriptEnabled={true}
        allowsInlineMediaPlayback={true}
        mediaPlaybackRequiresUserAction={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  infoContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10,
    backgroundColor: "#333",
  },
  infoBox: {
    alignItems: "center",
  },
  label: {
    fontSize: 16,
    color: "#bbb",
  },
  value: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  video: {
    flex: 1,
    width: "100%",
  },
});

export default App;
