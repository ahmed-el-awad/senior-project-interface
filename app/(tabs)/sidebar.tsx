import { Pressable, StyleSheet, Text, View } from "react-native";
import { Dimensions } from "react-native";

import Ionicons from "@expo/vector-icons/Ionicons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Entypo from "@expo/vector-icons/Entypo";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

// this will be used to make the page responsive
const { width, height } = Dimensions.get("window");

export default function SideBar() {
  return (
    <View
      style={{
        backgroundColor: "lightgrey",
        width: 250,
        height: height,
        display: "flex",
        rowGap: 20,
      }}
    >
      <Pressable style={styles.button}>
        <Ionicons name="person-sharp" size={16} color="black" />
        <Text>Profile</Text>
      </Pressable>
      <Pressable style={styles.button}>
        <FontAwesome name="gear" size={16} color="black" />
        <Text>Settings</Text>
      </Pressable>
      <Pressable style={styles.button}>
        <Entypo name="help-with-circle" size={16} color="black" />
        <Text>Help</Text>
      </Pressable>
      <Pressable style={styles.button}>
        <MaterialIcons name="logout" size={16} color="black" />
        <Text>Logout</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "green",
    paddingLeft: 2,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    textAlign: "center",
    height: 30,
    gap: 10,
  },
});
