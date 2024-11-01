import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from 'expo-linear-gradient';

const ConnectDrone = () => {
  const router = useRouter();

  const handleConnect = () => {
    // Add your drone connection logic here
    router.push('/liveFeed');
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <MaterialCommunityIcons name="drone" size={100} color="#FF4B2B" />
        <Text style={styles.title}>Connect to Drone</Text>
        <Text style={styles.subtitle}>Please ensure your drone is powered on and within range</Text>
        
        <TouchableOpacity onPress={handleConnect}>
          <LinearGradient
            colors={['#FF416C', '#FF4B2B']}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 0}}
            style={styles.connectButton}
          >
            <Text style={styles.buttonText}>Connect</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f2f5',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  content: {
    alignItems: 'center',
    width: '100%',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginTop: 20,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
    marginBottom: 40,
  },
  connectButton: {
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 25,
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ConnectDrone; 