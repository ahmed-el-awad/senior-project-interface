import React from "react";
import { StyleSheet, Text, View, Image, SafeAreaView, ScrollView, TouchableOpacity } from "react-native";
import { Video, ResizeMode } from "expo-av"; // Use expo-av for video
import { MaterialIcons } from "@expo/vector-icons"; // Import icons from expo/vector-icons
import { Dimensions } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get("window");

const LiveFeed = () => {
  const [showNotifications, setShowNotifications] = React.useState(false);
  const [notifications] = React.useState([
    { id: 1, message: "Flight ended at 2:45 PM", timestamp: "2 mins ago" },
    { id: 2, message: "Intruder Detected", timestamp: "15 mins ago" },
    { id: 3, message: "New flight started", timestamp: "1 hour ago" },
  ]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Image
            source={require("../../assets/images/goat-logo.png")}
            style={styles.logo}
          />
          <View style={styles.headerRight}>
            <View style={styles.notificationContainer}>
              <TouchableOpacity
                onPress={() => setShowNotifications(!showNotifications)}
              >
                <MaterialIcons name="notifications" size={24} color="#fff" />
              </TouchableOpacity>
              {showNotifications && (
                <View style={styles.notificationDropdown}>
                  {notifications.map((notification) => (
                    <View key={notification.id} style={styles.notificationItem}>
                      <Text style={styles.notificationText}>
                        {notification.message}
                      </Text>
                      <Text style={styles.notificationTime}>
                        {notification.timestamp}
                      </Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
            <Image
              source={{ uri: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2.5&w=256&h=256&q=80" }}
              style={styles.profilePicture}
            />
          </View>
        </View>
        
        <View style={styles.titleContainer}>
          <Text style={styles.flightNumber}>Flight #1234</Text>
          <Text style={styles.dateTimeText}>January 1, 2025 • 3:00 PM</Text>
        </View>
        
        <LinearGradient
          colors={['#FF416C', '#FF4B2B']}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 0}}
          style={styles.liveStreamContainer}
        >
          <MaterialIcons name="live-tv" size={24} color="#fff" />
          <Text style={styles.title}>Live Feed</Text>
        </LinearGradient>
        
        <Video
          source={{
            uri: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
          }}
          style={styles.video}
          resizeMode={ResizeMode.STRETCH}
          useNativeControls
        />
        
        <View style={styles.infoContainer}>
          {['Tahr', 'Intruders', 'Flight Time'].map((label, index) => (
            <View key={index} style={styles.infoBoxContainer}>
              <Text style={styles.label}>{label}</Text>
              <View style={styles.countBox}>
                <Text style={styles.countText}>0</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f2f5",
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
    zIndex: 2,
    elevation: 2,
  },
  logo: {
    width: 80,
    height: 65,
    resizeMode: 'contain',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 2,
    elevation: 2,
  },
  notificationContainer: {
    backgroundColor: '#FF4B2B',
    padding: 10,
    borderRadius: 20,
    marginRight: 10,
    zIndex: 9999,
    elevation: 9999,
  },
  profilePicture: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#FFA500',
  },
  titleContainer: {
    marginBottom: 25,
  },
  flightNumber: {
    fontSize: 28,
    fontWeight: "bold",
    color: '#2c3e50',
    marginBottom: 5,
  },
  dateTimeText: {
    fontSize: 16,
    color: '#7f8c8d',
  },
  liveStreamContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    padding: 10,
    borderRadius: 25,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 8,
    color: '#fff',
  },
  video: {
    width: '100%',
    aspectRatio: 16 / 9,
    borderRadius: 15,
    overflow: 'hidden',
    marginBottom: 25,
    backgroundColor: '#000',
  },
  infoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  infoBoxContainer: {
    alignItems: "center",
    flex: 1,
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
    color: '#34495e',
    fontWeight: '600',
  },
  countBox: {
    backgroundColor: "#FF4B2B",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 12,
    minWidth: 90,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  countText: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    color: '#fff',
  },
  notificationDropdown: {
    position: 'absolute',
    top: 50,
    right: 0,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
    width: 250,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 9999,
    zIndex: 9999,
  },
  notificationItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  notificationText: {
    fontSize: 14,
    color: '#2c3e50',
    marginBottom: 4,
  },
  notificationTime: {
    fontSize: 12,
    color: '#7f8c8d',
  },
});

export default LiveFeed;
