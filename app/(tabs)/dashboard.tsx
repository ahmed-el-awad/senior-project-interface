import React, { useState, useEffect } from "react";
import axios from "axios";
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { LineChart, BarChart, PieChart } from "react-native-gifted-charts";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

interface FlightData {
  id: number;
  tahr_count: number;
  intruder_detections: number;
  flight_date: string;
  flight_duration: number;
  flight_number: string;
}

// Dummy data
const dummyData = {
  totalFlights: 50,
  averageElevation: 70,
  totalAnimals: 1250,
  elevationTrend: [{ value: 60 }, { value: 70 }, { value: 110 }, { value: 90 }, { value: 80 }],
  animalCountPerFlight: [{ value: 20 }, { value: 35 }, { value: 15 }, { value: 40 }, { value: 30 }],
  terrainTypes: [
    { value: 30, text: "Forest", color: "#177AD5" },
    { value: 25, text: "Grassland", color: "#79D2DE" },
    { value: 20, text: "Mountain", color: "#ED6665" },
    { value: 15, text: "Desert", color: "#F0B775" },
    { value: 10, text: "Wetland", color: "#8F80E4" },
  ],
  recentFlights: [
    { date: "2023-04-01", animals: 25, terrain: "Forest", elevation: 110 },
    { date: "2023-04-03", animals: 30, terrain: "Grassland", elevation: 90 },
    { date: "2023-04-05", animals: 15, terrain: "Mountain", elevation: 70 },
    { date: "2023-04-07", animals: 40, terrain: "Forest", elevation: 100 },
    { date: "2023-04-09", animals: 20, terrain: "Desert", elevation: 80 },
  ],
};

// Couldnt change the color of the bars in bar chart, so used this instead
const coloredAnimalData = dummyData.animalCountPerFlight.map((item) => ({
  ...item,
  frontColor: "#FF4B2B",
}));

export default function DashboardScreen() {
  const router = useRouter();
  const baseURL = "http://127.0.0.1:5000";
  const [summaryStats, setSummaryStats] = useState({
    totalFlights: 0,
    totalAnimals: 0,
    totalIntruders: 0,
  });
  const [tahrTrend, setTahrTrend] = useState<{ value: number }[]>([]);
  const [recentFlights, setRecentFlights] = useState<FlightData[]>([]);
  const [intruderTrend, setIntruderTrend] = useState<
    {
      value: number;
      frontColor: string;
      label: string;
    }[]
  >([]);

  // Add new state for tooltip
  const [tooltipData, setTooltipData] = useState<{
    visible: boolean;
    date: string;
    value: number;
    x: number;
    y: number;
  } | null>(null);

  const fetchFlightStats = async () => {
    try {
      const response = await axios.get(`${baseURL}/flight_data`);
      const flights: FlightData[] = response.data;

      // Calculate summary statistics
      const totalFlights = flights.length;
      const totalAnimals = flights.reduce(
        (acc, flight) => acc + flight.tahr_count + flight.intruder_detections,
        0
      );
      const totalIntruders = flights.reduce((acc, flight) => acc + flight.intruder_detections, 0);

      // Get last 5 flights for tahr trend (reversed to show newest last)
      const recentTahrCounts = flights.slice(-5).map((flight) => ({
        value: flight.tahr_count,
        label: flight.flight_number,
      }));

      setTahrTrend(recentTahrCounts);
      setSummaryStats({
        totalFlights,
        totalAnimals,
        totalIntruders,
      });

      // Get the last 5 flights (newest first)
      const recent = flights.slice(-5).reverse();
      setRecentFlights(recent);

      // Get last 5 flights' intruder counts with flight numbers as labels
      const recentIntruderCounts = flights.slice(-5).map((flight) => ({
        value: flight.intruder_detections,
        frontColor: "#FF4B2B",
        label: flight.flight_number,
        date: flight.flight_date, // Add date to the data
        onPress: (item: any, index: number, width: number) => {
          const xPos = width * (index + 1) - width / 2;
          setTooltipData({
            visible: true,
            date: flight.flight_date,
            value: flight.intruder_detections,
            x: xPos,
            y: 200 - flight.intruder_detections * 40, // Adjust based on chart height and scale
          });
        },
      }));

      setIntruderTrend(recentIntruderCounts);
    } catch (error) {
      console.error("Error fetching flight stats:", error);
    }
  };

  useEffect(() => {
    fetchFlightStats();
  }, []);

  // Add touch handler to hide tooltip
  const handleBackgroundPress = () => {
    setTooltipData(null);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <MaterialCommunityIcons name="drone" size={24} color="white" />
        <Text style={styles.headerText}>Flight Statistics Dashboard</Text>
      </View>

      <View style={styles.summaryContainer}>
        <Text style={styles.sectionTitle}>Flight Summary</Text>
        <View style={styles.summaryRow}>
          <View style={styles.summaryItem}>
            <MaterialCommunityIcons name="drone" size={24} color="#177AD5" />
            <Text style={styles.summaryValue}>{summaryStats.totalFlights}</Text>
            <Text style={styles.summaryLabel}>Total Flights</Text>
          </View>
          <View style={styles.summaryItem}>
            <MaterialCommunityIcons name="paw" size={24} color="#79D2DE" />
            <Text style={styles.summaryValue}>{summaryStats.totalAnimals}</Text>
            <Text style={styles.summaryLabel}>Animals Counted</Text>
          </View>
          <View style={styles.summaryItem}>
            <MaterialCommunityIcons name="alert-circle" size={24} color="#ED6665" />
            <Text style={styles.summaryValue}>{summaryStats.totalIntruders}</Text>
            <Text style={styles.summaryLabel}>Total Intruders</Text>
          </View>
        </View>
      </View>

      <View style={styles.chartContainer}>
        <Text style={styles.sectionTitle}>Tahr Detection Trend</Text>
        <View style={styles.chartWithLabels}>
          <View style={styles.yAxisLabelContainer}>
            <Text style={styles.yAxisLabel}>Number of Tahr</Text>
          </View>
          <View>
            <LineChart
              data={tahrTrend}
              hideRules
              color="#177AD5"
              thickness={3}
              dataPointsColor="#ED6665"
              width={300}
              height={200}
              startFillColor="#177AD5"
              endFillColor="#177AD520"
              startOpacity={0.9}
              endOpacity={0.2}
              initialSpacing={20}
              noOfSections={6}
              xAxisThickness={0}
              yAxisThickness={0}
              yAxisColor="#177AD5"
              xAxisColor="#177AD5"
              xAxisLabelTextStyle={{ color: "#FF" }}
              spacing={40}
            />
            <Text style={styles.xAxisLabel}>Flight Number</Text>
          </View>
        </View>
      </View>

      <View style={styles.chartContainer}>
        <Text style={styles.sectionTitle}>Intruder Detections per Flight</Text>
        <TouchableOpacity
          activeOpacity={1}
          onPress={handleBackgroundPress}
          style={styles.chartWrapper}
        >
          <View style={styles.chartWithLabels}>
            <View style={styles.yAxisLabelContainer}>
              <Text style={styles.yAxisLabel}>Number of Intruders</Text>
            </View>
            <View>
              <BarChart
                data={intruderTrend}
                barWidth={30}
                spacing={20}
                roundedTop
                roundedBottom
                hideRules
                xAxisThickness={0}
                yAxisThickness={0}
                yAxisTextStyle={{ color: "#000" }}
                noOfSections={5}
                maxValue={5}
                width={300}
                height={200}
                xAxisLabelTextStyle={{ color: "#000" }}
                yAxisLabelWidth={40}
              />
              <Text style={styles.xAxisLabel}>Flight Number</Text>
            </View>
          </View>
          {tooltipData && tooltipData.visible && (
            <View
              style={[
                styles.tooltip,
                {
                  position: "absolute",
                  left: tooltipData.x,
                  top: tooltipData.y,
                  transform: [{ translateX: -50 }, { translateY: -40 }],
                },
              ]}
            >
              <Text style={styles.tooltipText}>
                {new Date(tooltipData.date).toLocaleDateString()}
              </Text>
              <Text style={styles.tooltipText}>Intruders: {tooltipData.value}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.chartContainer}>
        <Text style={styles.sectionTitle}>Detection Distribution</Text>
        <View style={styles.chartLegendContainer}>
          <PieChart
            data={[
              {
                value: recentFlights.reduce((sum, flight) => sum + flight.tahr_count, 0),
                text: "Tahr",
                color: "#177AD5",
              },
              {
                value: recentFlights.reduce((sum, flight) => sum + flight.intruder_detections, 0),
                text: "Intruders",
                color: "#ED6665",
              },
            ]}
            donut
            radius={80}
            innerRadius={60}
          />
          <View style={styles.legend}>
            {[
              { text: "Tahr", color: "#177AD5" },
              { text: "Intruders", color: "#ED6665" },
            ].map((item, index) => {
              const tahrCount = recentFlights.reduce((sum, flight) => sum + flight.tahr_count, 0);
              const intruderCount = recentFlights.reduce(
                (sum, flight) => sum + flight.intruder_detections,
                0
              );
              const total = tahrCount + intruderCount;
              const count = item.text === "Tahr" ? tahrCount : intruderCount;
              const percentage = total > 0 ? ((count / total) * 100).toFixed(1) : "0.0";

              return (
                <View key={index} style={styles.legendItem}>
                  <View style={[styles.legendColor, { backgroundColor: item.color }]} />
                  <Text style={styles.legendText}>
                    {item.text}: {count} ({percentage}%)
                  </Text>
                </View>
              );
            })}
          </View>
        </View>
      </View>

      <View style={styles.recentFlightsContainer}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Flights</Text>
          <TouchableOpacity
            onPress={() => router.push("/(tabs)/statistics")}
            style={styles.showMoreButton}
          >
            <Text style={styles.showMoreText}>Show more</Text>
          </TouchableOpacity>
        </View>
        {recentFlights.map((flight, index) => (
          <View key={index} style={styles.flightItem}>
            <MaterialCommunityIcons name="drone" size={24} color="#177AD5" />
            <View style={styles.flightInfo}>
              <Text style={styles.flightDate}>
                {new Date(flight.flight_date).toLocaleDateString()}
              </Text>
              <Text style={styles.flightDetail}>
                Flight: {flight.flight_number} | Duration: {flight.flight_duration}min
              </Text>
              <Text style={styles.flightDetail}>
                Tahr: {flight.tahr_count} | Intruders: {flight.intruder_detections}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
  },
  header: {
    backgroundColor: "#FF4B2B",
    padding: 20,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  headerText: {
    color: "white",
    fontSize: 22,
    fontWeight: "bold",
    marginLeft: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#333",
  },
  summaryContainer: {
    backgroundColor: "white",
    margin: 15,
    padding: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  summaryItem: {
    alignItems: "center",
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginTop: 5,
  },
  summaryLabel: {
    fontSize: 12,
    color: "#666",
    marginTop: 5,
  },
  chartContainer: {
    backgroundColor: "white",
    margin: 15,
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  recentFlightsContainer: {
    backgroundColor: "white",
    margin: 15,
    padding: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  flightItem: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    paddingVertical: 15,
  },
  flightInfo: {
    marginLeft: 15,
  },
  flightDate: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  flightDetail: {
    fontSize: 14,
    color: "#666",
    marginTop: 3,
  },
  chartLegendContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  legend: {
    marginLeft: 20,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  legendColor: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 10,
  },
  legendText: {
    fontSize: 14,
    color: "#333",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  showMoreButton: {
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  showMoreText: {
    color: "#FF4B2B",
    fontSize: 14,
    fontWeight: "600",
  },
  tooltip: {
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    padding: 8,
    borderRadius: 5,
    alignItems: "center",
  },
  tooltipText: {
    color: "white",
    fontSize: 12,
  },
  axisLabels: {
    width: "100%",
    paddingHorizontal: 10,
  },
  chartWithLabels: {
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 20,
  },
  yAxisLabelContainer: {
    width: 20,
    height: 200,
    justifyContent: "center",
    alignItems: "center",
  },
  yAxisLabel: {
    transform: [{ rotate: "-90deg" }],
    color: "#666",
    width: 200,
    textAlign: "center",
  },
  xAxisLabel: {
    textAlign: "center",
    color: "#666",
    marginTop: 10,
    marginBottom: 10,
  },
  chartWrapper: {
    position: "relative",
    width: "100%",
    alignItems: "center",
  },
});
