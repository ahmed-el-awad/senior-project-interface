import { Text, View } from "react-native";
import { LineChart } from "react-native-gifted-charts";
import { BarChart } from "react-native-gifted-charts";

export default function DashboardScreen() {
const data = [{value: 15}, {value: 30}, {value: 26}, {value: 40}];
return (
  /*<View style={{ backgroundColor: "blue" }}>
    <Text style={{ color: "white", padding: 5 }}>Dashboard</Text>
  </View>*/

<LineChart
    data={data}
    color={'#177AD5'}
    thickness={3}
    dataPointsColor={'red'}
/>
/*<BarChart
    data={data}
    color={'#177AD5'}
    capThickness={3}
    barBorderColor ={'red'}
  />*/
);
};
