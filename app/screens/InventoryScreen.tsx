import { StyleSheet } from "react-native";
import ScreenWrapper from "./ScreenWrapper";
import CustomButton from "../components/CustomButton";
import DataTable from "../components/DataTable";
import inventoryData from "../inventoryData.json";
import { router } from "expo-router";
import { useState, useEffect } from "react";

export default function InventoryScreen() {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    setData(inventoryData);
  }, []);
  
  return (
    <ScreenWrapper>
      <CustomButton label={"Działam"} onPress={() => router.push("/")} />
      <DataTable data={data} />
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
