import { StyleSheet, View, Alert, TextInput} from "react-native";
import ScreenWrapper from "./ScreenWrapper";
import CustomButton from "../components/CustomButton";
import inventoryData from "../inventoryData.json";
import { useState, useEffect } from "react";
import { useLocalSearchParams, router, useFocusEffect } from "expo-router";
import TanStackTable from "../components/TanStackTable";

export default function InventoryScreen() {
  const [data, setData] = useState<any[]>([]);
  const { scannedData } = useLocalSearchParams();

  useEffect(() => {
    setData(inventoryData);
  }, []);
  
  useFocusEffect(() => {
    if (scannedData) {
      Alert.alert("Zeskanowano kod QR", `Dane: ${scannedData}`, [
        {
          text: "OK",
          onPress: () => router.replace("../drawer/inventory"),
        },
        {
          text: "Anuluj",
          style: "cancel",
          onPress: () => router.replace("../drawer/inventory"),
        },
      ]);
    }
  });

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <View style={styles.roomInputContainer}>
          <TextInput
              placeholder="Pokój"
              style={styles.roomInput}
              onChangeText={(text) => console.log(text)}
          />
          <CustomButton
            label="Rozpocznij"
          />
        </View>
        
        <View style={styles.tableContainer}>
            <TanStackTable data={data} />
        </View>

        <View style={styles.bottomButtonContainer}>
            <CustomButton
                icon="photo-camera" 
                onPress={() => router.push("../scanner")}
             />
        </View>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  roomInputContainer: {
    flexDirection: "row",
    margin:20,
    justifyContent: "center",
    gap: 40,
  },
  roomInput: {
    height: 40,
    width: "20%",
    backgroundColor: "#fff",
  },

  tableContainer: {
    flex: 0.9, 
  },
  bottomButtonContainer: {
    position: "absolute",
    bottom: 0,
    left: "40%",
    alignItems: "center",
  },
});
