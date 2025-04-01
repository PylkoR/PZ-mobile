import { StyleSheet } from "react-native";
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
      <TanStackTable data={data}/>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  bottomButtonContainer: {
    position: "absolute",
    bottom: 50,
    left: "45%",
    alignItems: "center",
  },
});
