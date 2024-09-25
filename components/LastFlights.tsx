import { View, Text, Image } from "react-native";

export default function LastFlights() {
  return (
    <View
      style={{
        display: "flex",
        marginTop: 10,
        width: 500, // TODO: make this responsive later
        backgroundColor: "lightblue",
        borderRadius: 20,
        flexDirection: "row",
      }}
    >
      {/* Left Side */}
      <View>
        <Image
          style={{
            borderTopLeftRadius: 20,
            borderBottomLeftRadius: 20,
          }}
          id="goat"
          source={{
            uri: "/assets/images/stats-goat.png",
            width: 100,
            height: 100,
          }}
        />
      </View>

      {/* Right Side  */}
      <View>
        {/* Top */}
        <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-evenly" }}>
          {/* Flight Number */}
          <Text style={{ paddingTop: 5, paddingLeft: 5 }}>
            Flight number:{" "}
            <Text style={{ backgroundColor: "orange", borderRadius: 5, paddingHorizontal: 5 }}>
              #2441
            </Text>
          </Text>

          {/* Date */}
          <Text style={{ paddingTop: 5, paddingLeft: 5 }}>
            Date:{" "}
            <Text style={{ backgroundColor: "orange", borderRadius: 5, paddingHorizontal: 5 }}>
              1/1/2024
            </Text>
          </Text>
        </View>

        {/* Bottom  */}
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-evenly",
            padding: "auto",
          }}
        >
          {/* Arabian Tahr */}
          <View style={{ display: "flex", flexDirection: "row", marginTop: 20 }}>
            <View>
              <Text style={{ paddingTop: 5, paddingLeft: 5 }}>Arabian Tahr</Text>

              <View
                style={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    backgroundColor: "orange",
                    borderRadius: 5,
                    paddingHorizontal: 5,
                  }}
                >
                  20
                </Text>
              </View>
            </View>
          </View>

          {/* Threats */}
          <View style={{ display: "flex", flexDirection: "row", marginTop: 20 }}>
            <View>
              <Text style={{ paddingTop: 5, paddingLeft: 5 }}>Threats</Text>

              <View
                style={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    backgroundColor: "orange",
                    borderRadius: 5,
                    paddingHorizontal: 5,
                  }}
                >
                  2
                </Text>
              </View>
            </View>
          </View>

          {/* Other Animals */}
          <View style={{ display: "flex", flexDirection: "row", marginTop: 20 }}>
            <View>
              <Text style={{ paddingTop: 5, paddingLeft: 5 }}>Other Animals</Text>

              <View
                style={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    backgroundColor: "orange",
                    borderRadius: 5,
                    paddingHorizontal: 5,
                  }}
                >
                  5
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}
