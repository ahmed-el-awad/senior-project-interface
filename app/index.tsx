import { Pressable, StyleSheet, Text, Touchable, TouchableHighlight, View } from "react-native";
import { useEffect, useState } from "react";

export default function Index() {
  // TODO: replace the local server with a cloud infra, maybe render.com
  const [data, setData] = useState("");

  const fetchDataFromServer: any = async () => {
    try {
      // Get data exposed from local server
      const response = await fetch("http://localhost:3000/");

      // imagine the content being the coordinates, with x and y coordinates
      // obtained from the image to display the bounding boxes on the UI
      const content = await response.json();

      setData(JSON.stringify(content));
    } catch (err) {
      console.log("Error: Failed to get data from server");
    }
  };

  return (
    <View style={{ display: "flex" }}>
      <View>
        <Text style={styles.header}>Ahmed is testing</Text>
      </View>
      <View>
        <TouchableHighlight onPress={() => fetchDataFromServer()}>
          <Text style={styles.button}>Get data from server</Text>
        </TouchableHighlight>
        <Pressable>
          <Text>Data: {data}</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    // alignContent: "center",
    // justifyContent: "center",
    textAlign: "center",
    fontSize: 32,
    backgroundColor: "red",
  },
  button: {
    backgroundColor: "lightblue",
    padding: 5,
    textAlign: "center",
    fontSize: 24,
  },
});
