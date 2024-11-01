import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { LineChart, BarChart, PieChart } from 'react-native-gifted-charts';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

// Dummy data
const dummyData = {
  totalFlights: 50,
  averageElevation: 70,
  totalAnimals: 1250,
  elevationTrend: [
    {value: 60}, {value: 70}, {value: 110}, {value: 90}, {value: 80}
  ],
  animalCountPerFlight: [
    {value: 20}, {value: 35}, {value: 15}, {value: 40}, {value: 30}
  ],
  terrainTypes: [
    {value: 30, text: 'Forest', color: '#177AD5'},
    {value: 25, text: 'Grassland', color: '#79D2DE'},
    {value: 20, text: 'Mountain', color: '#ED6665'},
    {value: 15, text: 'Desert', color: '#F0B775'},
    {value: 10, text: 'Wetland', color: '#8F80E4'}
  ],
  recentFlights: [
    {date: '2023-04-01', animals: 25, terrain: 'Forest', elevation: 110},
    {date: '2023-04-03', animals: 30, terrain: 'Grassland', elevation: 90},
    {date: '2023-04-05', animals: 15, terrain: 'Mountain', elevation: 70},
    {date: '2023-04-07', animals: 40, terrain: 'Forest', elevation: 100},
    {date: '2023-04-09', animals: 20, terrain: 'Desert', elevation: 80},
  ]
};

// Couldnt change the color of the bars in bar chart, so used this instead
const coloredAnimalData = dummyData.animalCountPerFlight.map(item => ({
  ...item,
  frontColor: '#FF4B2B'
}));

export default function DashboardScreen() {
  const router = useRouter();

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
            <Text style={styles.summaryValue}>{dummyData.totalFlights}</Text>
            <Text style={styles.summaryLabel}>Total Flights</Text>
          </View>
          <View style={styles.summaryItem}>
            <MaterialCommunityIcons name="elevation-rise" size={24} color="#ED6665" />
            <Text style={styles.summaryValue}>{dummyData.averageElevation}m</Text>
            <Text style={styles.summaryLabel}>Avg. Elevation</Text>
          </View>
          <View style={styles.summaryItem}>
            <MaterialCommunityIcons name="paw" size={24} color="#79D2DE" />
            <Text style={styles.summaryValue}>{dummyData.totalAnimals}</Text>
            <Text style={styles.summaryLabel}>Animals Counted</Text>
          </View>
        </View>
      </View>

      <View style={styles.chartContainer}>
        <Text style={styles.sectionTitle}>Elevation Trend</Text>
        <LineChart
          data={dummyData.elevationTrend}
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
          yAxisColor="#177AD5"
          xAxisColor="#177AD5"
        />
      </View>

      <View style={styles.chartContainer}>
        <Text style={styles.sectionTitle}>Animals Counted per Flight</Text>
        <BarChart
          data={coloredAnimalData} //displays the coloredAnimalData array because I couldnt change the color of the bars
          barWidth={30}
          spacing={20}
          roundedTop
          roundedBottom
          hideRules
          //showValuesAsTopLabel        //top labels dont look too good, wil check them out later
          //topLabelTextStyle={{color: '#000', fontSize: 12}}
          xAxisThickness={0}
          yAxisThickness={0}
          yAxisTextStyle={{color: '#000'}}
          noOfSections={5}
          maxValue={50}
          width={300}
          height={200}
        />
      </View>

      <View style={styles.chartContainer}>
        <Text style={styles.sectionTitle}>Terrain Types Surveyed</Text>
        <View style={styles.chartLegendContainer}>
          <PieChart
            data={dummyData.terrainTypes}
            donut
            radius={80}
            innerRadius={60}
          />
          <View style={styles.legend}>
            {dummyData.terrainTypes.map((item, index) => (
              <View key={index} style={styles.legendItem}>
                <View style={[styles.legendColor, { backgroundColor: item.color }]} />
                <Text style={styles.legendText}>{item.text}: {item.value}%</Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      <View style={styles.recentFlightsContainer}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Flights</Text>
          <TouchableOpacity 
            onPress={() => router.push('/(tabs)/statistics')}
            style={styles.showMoreButton}
          >
            <Text style={styles.showMoreText}>Show more</Text>
          </TouchableOpacity>
        </View>
        {dummyData.recentFlights.map((flight, index) => (
          <View key={index} style={styles.flightItem}>
            <MaterialCommunityIcons name="drone" size={24} color="#177AD5" />
            <View style={styles.flightInfo}>
              <Text style={styles.flightDate}>{flight.date}</Text>
              <Text style={styles.flightDetail}>Animals: {flight.animals} | Terrain: {flight.terrain}</Text>
              <Text style={styles.flightDetail}>Elevation: {flight.elevation}m</Text>
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
    backgroundColor: '#f0f0f0',
  },
  header: {
    backgroundColor: '#FF4B2B',
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  summaryContainer: {
    backgroundColor: 'white',
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
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 5,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
  chartContainer: {
    backgroundColor: 'white',
    margin: 15,
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  recentFlightsContainer: {
    backgroundColor: 'white',
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
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    paddingVertical: 15,
  },
  flightInfo: {
    marginLeft: 15,
  },
  flightDate: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  flightDetail: {
    fontSize: 14,
    color: '#666',
    marginTop: 3,
  },
  chartLegendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  legend: {
    marginLeft: 20,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
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
    color: '#333',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  showMoreButton: {
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  showMoreText: {
    color: '#FF4B2B',
    fontSize: 14,
    fontWeight: '600',
  },
});