import { Drawer } from "expo-router/drawer";
import { useRouter } from "expo-router";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";

export default function TabLayout() {
  const router = useRouter();

  return (
    <Drawer>
      <Drawer.Screen
        name="index"
        options={{
          drawerLabel: "Home",
          title: "Home",
          drawerIcon: ({ color, size }) => <MaterialIcons name="home" size={size} color={color} />,
          // drawerItemStyle: { display: "none" },
        }}
      />
      <Drawer.Screen
        name="liveFeed"
        options={{
          drawerLabel: "Live Feed",
          title: "Live Feed",
          drawerIcon: ({ color, size }) => (
            <MaterialIcons name="videocam" size={size} color={color} />
          ),
        }}
        listeners={{
          drawerItemPress: (e) => {
            e.preventDefault();
            router.push("/(tabs)/connectDrone");
          },
        }}
      />
      <Drawer.Screen
        name="connectDrone"
        options={{
          drawerLabel: "Connect Drone",
          title: "Connect Drone",
          drawerIcon: ({ color, size }) => (
            <MaterialIcons name="flight" size={size} color={color} />
          ),
          drawerItemStyle: { display: "none" },
        }}
      />
      <Drawer.Screen
        name="dashboard"
        options={{
          drawerLabel: "Dashboard",
          title: "Dashboard",
          drawerIcon: ({ color, size }) => (
            <MaterialIcons name="dashboard" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="patrol"
        options={{
          drawerLabel: "Patrol",
          title: "Patrol",
          drawerIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="shoe-print" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="statistics"
        options={{
          drawerLabel: "Flight History",
          title: "Flight History",
          drawerIcon: ({ color, size }) => (
            <MaterialIcons name="bar-chart" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="settings"
        options={{
          drawerLabel: "Settings",
          title: "Settings",
          drawerIcon: ({ color, size }) => (
            <MaterialIcons name="settings" size={size} color={color} />
          ),
        }}
      />
    </Drawer>
  );
}
