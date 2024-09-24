import { Text, View } from "react-native";

export default function SettingsScreen() {
  return (
    <View
      style={{
        backgroundColor: "green",
        display: "flex",
        alignContent: "center",
        // justifyContent: "center",
      }}
    >
      <Text style={{ color: "white", padding: 5 }}>Settings</Text>
    </View>
  );
}
