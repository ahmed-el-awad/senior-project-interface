import { View, Text, Image, Dimensions } from "react-native";

export default function LastFlights() {
  const windowWidth = Dimensions.get("window").width;

  return (
    <View
      style={{
        display: "flex",
        marginTop: 10,
        width: "100%",
        backgroundColor: "white",
        borderRadius: 20,
        flexDirection: "row",
        paddingRight: 10,
      }}
    >
      {/* Left Side */}
      <View>
        <Image
          style={{
            borderTopLeftRadius: 20,
            borderBottomLeftRadius: 20,
            width: windowWidth * 0.2,
            height: windowWidth * 0.2,
          }}
          id="goat"
          source={{
            uri: "https://images.pexels.com/photos/2658458/pexels-photo-2658458.jpeg",
          }}
        />
      </View>

      {/* Right Side  */}
      <View style={{ flex: 1 }}>
        {/* Top */}
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            paddingHorizontal: 10,
          }}
        >
          {/* Flight Number */}
          <Text style={{ paddingTop: 5 }}>
            Flight number: <Text style={{ color: "#FF4B2B", fontWeight: "600" }}>#2441</Text>
          </Text>

          {/* Date */}
          <Text style={{ paddingTop: 5 }}>
            Date: <Text style={{ color: "#FF4B2B", fontWeight: "600" }}>1/1/2024</Text>
          </Text>
        </View>

        {/* Bottom  */}
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            paddingHorizontal: 10,
            marginTop: 10,
          }}
        >
          {/* Animals */}
          <View style={{ alignItems: "center", flex: 1 }}>
            <Text>Animals</Text>
            <Text
              style={{
                color: "#FF4B2B",
                fontWeight: "600",
                marginTop: 5,
              }}
            >
              20
            </Text>
          </View>

          {/* Terrain */}
          <View style={{ alignItems: "center", flex: 1 }}>
            <Text>Terrain</Text>
            <Text
              style={{
                color: "#FF4B2B",
                fontWeight: "600",
                marginTop: 5,
              }}
            >
              Rocky
            </Text>
          </View>

          {/* Elevation */}
          <View style={{ alignItems: "center", flex: 1 }}>
            <Text>Elevation</Text>
            <Text
              style={{
                color: "#FF4B2B",
                fontWeight: "600",
                marginTop: 5,
              }}
            >
              1200m
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}
