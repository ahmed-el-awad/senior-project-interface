import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
  Alert,
  RefreshControl,
} from "react-native";
import axios from "axios";

const Patrol = () => {
  const baseURL = "http://127.0.0.1:5000";
  const [patrols, setPatrols] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  // Form states
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [patrolArea, setPatrolArea] = useState("");
  const [notes, setNotes] = useState("");
  const [team, setTeam] = useState("");

  const [expandedNote, setExpandedNote] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const [checkInPeriod, setCheckInPeriod] = useState<"AM" | "PM">("AM");
  const [checkOutPeriod, setCheckOutPeriod] = useState<"AM" | "PM">("AM");

  const fetchPatrols = async () => {
    try {
      const response = await axios.get(`${baseURL}/patrols`);
      setPatrols(response.data);
    } catch (error) {
      console.error("Error fetching patrols:", error);
      Alert.alert("Error", "Failed to fetch patrol data");
    }
  };

  const addPatrol = async () => {
    try {
      if (!checkIn || !checkOut || !patrolArea || !team) {
        Alert.alert("Error", "Please fill in all required fields");
        return;
      }

      // Validate time format (HH:MM)
      const timeRegex = /^(0?[1-9]|1[0-2]):[0-5][0-9]$/;
      if (!timeRegex.test(checkIn) || !timeRegex.test(checkOut)) {
        Alert.alert("Error", "Please enter valid times in HH:MM format (e.g., 07:30)");
        return;
      }

      // Convert 12-hour to 24-hour format
      const convert12to24 = (time: string, period: "AM" | "PM") => {
        const [hours, minutes] = time.split(":");
        let hour = parseInt(hours, 10);

        if (period === "PM" && hour !== 12) {
          hour += 12;
        } else if (period === "AM" && hour === 12) {
          hour = 0;
        }

        return `${hour.toString().padStart(2, "0")}:${minutes}`;
      };

      const formattedCheckIn = convert12to24(checkIn, checkInPeriod);
      const formattedCheckOut = convert12to24(checkOut, checkOutPeriod);

      // Parse the converted times
      const checkInTime = new Date(`1970-01-01T${formattedCheckIn}:00`);
      const checkOutTime = new Date(`1970-01-01T${formattedCheckOut}:00`);

      if (isNaN(checkInTime.getTime()) || isNaN(checkOutTime.getTime())) {
        Alert.alert("Error", "Invalid time format");
        return;
      }

      const today = new Date().toISOString().slice(0, 10);

      const response = await axios.post(`${baseURL}/patrols`, {
        check_in_time: checkInTime.toISOString(),
        check_out_time: checkOutTime.toISOString(),
        patrol_area: patrolArea,
        team_members: team,
        notes: notes || "",
        date: today,
      });

      // Clear form
      setCheckIn("");
      setCheckOut("");
      setCheckInPeriod("AM");
      setCheckOutPeriod("AM");
      setPatrolArea("");
      setTeam("");
      setNotes("");

      // Refresh patrol list
      fetchPatrols();
      Alert.alert("Success", "Patrol data added successfully");
    } catch (error: any) {
      console.error("Error adding patrol:", error);
      Alert.alert("Error", "Failed to add patrol data. Please check your input and try again.");
    }
  };

  const deletePatrol = async (id: number) => {
    try {
      const response = await axios.delete(`${baseURL}/patrols/${id}`);
      console.log("Delete response:", response.data);
      fetchPatrols();
      Alert.alert("Success", "Patrol deleted successfully");
    } catch (error: any) {
      console.error("Error deleting patrol:", error);
      console.error("Error details:", error.response?.data);
      Alert.alert(
        "Error",
        `Failed to delete patrol: ${
          error.response?.data?.error || error.message || "Unknown error"
        }`
      );
    }
  };

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await fetchPatrols();
    setRefreshing(false);
  }, []);

  const filteredPatrols = patrols.filter((patrol) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      patrol.patrol_number.toLowerCase().includes(searchLower) ||
      patrol.patrol_area.toLowerCase().includes(searchLower) ||
      patrol.team_members.toLowerCase().includes(searchLower) ||
      patrol.notes?.toLowerCase().includes(searchLower) ||
      new Date(patrol.date).toLocaleDateString().includes(searchQuery)
    );
  });

  useEffect(() => {
    fetchPatrols();
  }, []);

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View style={styles.formContainer}>
        <Text style={styles.title}>Add New Patrol</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Check-in Time (HH:MM)</Text>
          <View style={styles.timeInputContainer}>
            <TextInput
              style={[styles.input, styles.timeInput]}
              value={checkIn}
              onChangeText={setCheckIn}
              placeholder="Enter check-in time"
              keyboardType="numeric"
            />
            <View style={styles.periodSelector}>
              <TouchableOpacity
                style={[styles.periodButton, checkInPeriod === "AM" && styles.periodButtonActive]}
                onPress={() => setCheckInPeriod("AM")}
              >
                <Text
                  style={[
                    styles.periodButtonText,
                    checkInPeriod === "AM" && styles.periodButtonTextActive,
                  ]}
                >
                  AM
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.periodButton, checkInPeriod === "PM" && styles.periodButtonActive]}
                onPress={() => setCheckInPeriod("PM")}
              >
                <Text
                  style={[
                    styles.periodButtonText,
                    checkInPeriod === "PM" && styles.periodButtonTextActive,
                  ]}
                >
                  PM
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Check-out Time (HH:MM)</Text>
          <View style={styles.timeInputContainer}>
            <TextInput
              style={[styles.input, styles.timeInput]}
              value={checkOut}
              onChangeText={setCheckOut}
              placeholder="Enter check-out time"
              keyboardType="numeric"
            />
            <View style={styles.periodSelector}>
              <TouchableOpacity
                style={[styles.periodButton, checkOutPeriod === "AM" && styles.periodButtonActive]}
                onPress={() => setCheckOutPeriod("AM")}
              >
                <Text
                  style={[
                    styles.periodButtonText,
                    checkOutPeriod === "AM" && styles.periodButtonTextActive,
                  ]}
                >
                  AM
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.periodButton, checkOutPeriod === "PM" && styles.periodButtonActive]}
                onPress={() => setCheckOutPeriod("PM")}
              >
                <Text
                  style={[
                    styles.periodButtonText,
                    checkOutPeriod === "PM" && styles.periodButtonTextActive,
                  ]}
                >
                  PM
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Patrol Area</Text>
          <TextInput
            style={styles.input}
            value={patrolArea}
            onChangeText={setPatrolArea}
            placeholder="Enter patrol area"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Team Members</Text>
          <TextInput
            style={styles.input}
            value={team}
            onChangeText={setTeam}
            placeholder="Enter team members"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Notes</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={notes}
            onChangeText={setNotes}
            placeholder="Enter any additional notes"
            multiline
            numberOfLines={4}
          />
        </View>

        <TouchableOpacity style={styles.addButton} onPress={addPatrol}>
          <Text style={styles.buttonText}>Add Patrol</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.tableContainer}>
        <Text style={styles.title}>Patrol History</Text>

        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search patrols..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={true}>
          <View>
            <View style={styles.tableHeader}>
              <Text style={[styles.headerCell, { width: 80 }]}>Patrol #</Text>
              <Text style={[styles.headerCell, { width: 180 }]}>Check In</Text>
              <Text style={[styles.headerCell, { width: 180 }]}>Check Out</Text>
              <Text style={[styles.headerCell, { width: 120 }]}>Area</Text>
              <Text style={[styles.headerCell, { width: 120 }]}>Team</Text>
              <Text style={[styles.headerCell, { width: 150 }]}>Notes</Text>
              <Text style={[styles.headerCell, { width: 80 }]}>Action</Text>
            </View>

            {filteredPatrols.map((patrol) => (
              <View key={patrol.id} style={styles.tableRow}>
                <Text style={[styles.cell, { width: 80 }]}>#{patrol.patrol_number}</Text>
                <Text style={[styles.cell, { width: 180 }]}>
                  {new Date(patrol.date).toLocaleDateString()} {"\n"}
                  {new Date(patrol.check_in_time).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  })}
                </Text>
                <Text style={[styles.cell, { width: 180 }]}>
                  {new Date(patrol.date).toLocaleDateString()} {"\n"}
                  {new Date(patrol.check_out_time).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  })}
                </Text>
                <Text style={[styles.cell, { width: 120 }]}>{patrol.patrol_area}</Text>
                <Text style={[styles.cell, { width: 120 }]}>{patrol.team_members}</Text>
                <TouchableOpacity
                  style={[styles.cell, { width: 150 }]}
                  onPress={() => setExpandedNote(expandedNote === patrol.id ? null : patrol.id)}
                >
                  <Text
                    style={styles.noteText}
                    numberOfLines={expandedNote === patrol.id ? undefined : 2}
                    ellipsizeMode="tail"
                  >
                    {patrol.notes || "-"}
                  </Text>
                </TouchableOpacity>
                <View style={[styles.cell, { width: 80 }]}>
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => deletePatrol(patrol.id)}
                  >
                    <Text style={styles.buttonText}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>

        {filteredPatrols.length === 0 && (
          <View style={styles.noDataContainer}>
            <Text style={styles.noDataText}>
              {searchQuery ? "No matching patrols found" : "No patrol data available"}
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  formContainer: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: "#2c3e50",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    padding: 10,
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  addButton: {
    backgroundColor: "#ECB367",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "#2C3E50",
    fontWeight: "bold",
  },
  tableContainer: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f5f5f5",
    padding: 15,
    borderBottomWidth: 2,
    borderBottomColor: "#ECB367",
  },
  headerCell: {
    fontWeight: "bold",
    color: "#2c3e50",
    fontSize: 16,
    paddingHorizontal: 10,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    padding: 15,
    alignItems: "center",
  },
  cell: {
    fontSize: 15,
    color: "#2c3e50",
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  deleteButton: {
    backgroundColor: "#ECB367",
    padding: 8,
    borderRadius: 5,
    alignItems: "center",
    width: "90%",
  },
  noDataContainer: {
    padding: 20,
    alignItems: "center",
  },
  noDataText: {
    color: "#666",
    fontSize: 16,
  },
  searchContainer: {
    marginBottom: 15,
    paddingHorizontal: 5,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    padding: 10,
    backgroundColor: "white",
  },
  noteText: {
    fontSize: 15,
    color: "#2c3e50",
  },
  timeInputContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  timeInput: {
    flex: 1,
    marginRight: 10,
  },
  periodSelector: {
    flexDirection: "row",
    borderRadius: 5,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  periodButton: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: "#f5f5f5",
  },
  periodButtonActive: {
    backgroundColor: "#ECB367",
  },
  periodButtonText: {
    color: "#2c3e50",
    fontWeight: "500",
  },
  periodButtonTextActive: {
    color: "#2C3E50",
    fontWeight: "bold",
  },
});

export default Patrol;
