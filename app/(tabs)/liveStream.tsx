import React from "react";
import { SafeAreaView, StyleSheet } from "react-native";
import { MSEPlayer } from "./MSEPlayer";

export default function liveStream() {
  // Example HLS stream URL - replace with your own
  const streamUrl =
    "https://stream-akamai.castr.com/5b9352dbda7b8c769937e459/live_2361c920455111ea85db6911fe397b9e/index.fmp4.m3u8";

  return (
    <SafeAreaView style={styles.container}>
      <MSEPlayer uri={streamUrl} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
