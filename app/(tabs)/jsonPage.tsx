import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

// TODO: whatever data is obtained from ahmed.tsx will be rendered on this component
// All code here is being tested, and is not properly working
export default function JsonPage({ jsonDataBody = "Data should show here", refreshData }: any) {
  const [data, setData] = useState(jsonDataBody);

  console.log("test");

  if (refreshData) {
    setData(jsonDataBody);
    console.log("refresh");
  }

  return (
    <View>
      <Text style={styles.text}>{data}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  text: { backgroundColor: "red", textAlign: "center", fontSize: 32 },
});
