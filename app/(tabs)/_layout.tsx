import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Drawer } from "expo-router/drawer";
import { Ionicons } from "@expo/vector-icons";

// Layout of the sidebar
export default function Layout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer>
        <Drawer.Screen
          name="index"
          options={{
            drawerLabel: "Home",
            title: "Home",
            drawerIcon: () => <Ionicons name="home-outline" size={24} />,
          }}
        />
        <Drawer.Screen
          name="liveFeed"
          options={{
            drawerLabel: "Live Feed",
            title: "Live Feed",
            drawerIcon: () => <Ionicons name="videocam-outline" size={24} />,
          }}
        />

        <Drawer.Screen
          name="dashboard"
          options={{
            drawerLabel: "Dashboard",
            title: "Dashboard",
            drawerIcon: () => <Ionicons name="analytics-outline" size={24} />,
          }}
        />
        <Drawer.Screen
          name="settings"
          options={{
            drawerLabel: "Settings",
            title: "Settings",
            drawerIcon: () => <Ionicons name="settings-outline" size={24} />,
          }}
        />
        <Drawer.Screen
          name="statistics"
          options={{
            drawerLabel: "Statistics",
            title: "Statistics",
            drawerIcon: () => <Ionicons name="stats-chart-outline" size={24} />,
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}
