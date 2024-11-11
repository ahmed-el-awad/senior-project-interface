import React, { useState } from "react";
import { View, Button, Text } from "react-native";
import axios from "axios";

const GetFromDatabase = () => {
  const baseURL = "http://127.0.0.1:5000";
  const [databaseData, setDatabaseData] = useState("");

  const fetchDatabaseData = async () => {
    try {
      const response = await axios.get(`${baseURL}/movies`);

      console.log("Detection Data:", JSON.stringify(response.data));
      setDatabaseData(
        response.data.map((elem: any) => (
          <View style={{ display: "flex", flexDirection: "row" }}>
            <Text>Title: {elem.title} </Text>
            <Text>Year: {elem.year} </Text>
            <Text>Score: {elem.score}</Text>
          </View>
        ))
      );
    } catch (error) {
      console.error("Error fetching database data:", error);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Button title="Get data from database" onPress={fetchDatabaseData} />
      <View style={{ marginTop: 40 }}>
        <Text>Database Data:</Text>
        <Text>{databaseData}</Text>
      </View>
    </View>
  );
};

export default GetFromDatabase;
