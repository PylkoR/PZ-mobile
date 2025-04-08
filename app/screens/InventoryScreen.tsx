import { StyleSheet, View } from "react-native";
import ScreenWrapper from "./ScreenWrapper";
import CustomButton from "../components/CustomButton";
import inventoryData from "../inventoryData.json";
import { useState, useEffect } from "react";
import { router } from "expo-router";
import TanStackTable from "../components/TanStackTable";

export default function InventoryScreen() {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    setData(inventoryData);
  }, []);
  
  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <View style={styles.tableContainer}>
            <TanStackTable data={data} />
        </View>

        <View style={styles.bottomButtonContainer}>
            <CustomButton
                icon="photo-camera" 
                
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
