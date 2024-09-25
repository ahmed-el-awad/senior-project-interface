import LastFlights from "@/components/LastFlights";
import { Ionicons } from "@expo/vector-icons";
import {
  View,
  Text,
  Image,
  TextInput,
  StyleSheet,
  Button,
  Dimensions,
  Pressable,
} from "react-native";
const { width, height } = Dimensions.get("screen");

export default function Statistics() {
  return (
    <View style={{ margin: 8 }}>
      {/* Header */}
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <Pressable>
          <Image
            source={{
              uri: "assets/images/goat-logo.png",
              width: 80,
              height: 65,
            }}
          />
        </Pressable>

        {/* Ranger Pic*/}
        <Pressable style={{ display: "flex", alignSelf: "center" }}>
          <Ionicons name="menu" size={30} style={{}} />
        </Pressable>
      </View>
      <Text style={styles.greeting}>Hi, Alex</Text>

      {/* Date Selection */}
      <View style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 8 }}>
        <Text>Choose Date</Text>
        <TextInput placeholder="From" style={styles.input} />
        <TextInput placeholder="To" style={styles.input} />
        <View>
          <Pressable style={styles.filterButton}>
            <Text>Filter</Text>
          </Pressable>
        </View>
      </View>

      {/* Last Flights */}
      <Text style={{ fontWeight: "500", fontSize: 20, marginTop: 10 }}>Last Flights</Text>
      <LastFlights />
      <LastFlights />
      <LastFlights />
    </View>
  );
}

const styles = StyleSheet.create({
  greeting: {
    fontWeight: "700",
    fontSize: 30,
    marginTop: 5,
  },
  filterButton: {
    borderWidth: 0,
    justifyContent: "center",
    alignItems: "center",
    padding: 8,
    backgroundColor: "orange",
    borderRadius: 100,
    width: 50,
    height: 50,
  },
  input: {
    color: "grey",
    backgroundColor: "white",
    borderRadius: 50,
    borderWidth: 0,
    padding: 4,
  },
});
