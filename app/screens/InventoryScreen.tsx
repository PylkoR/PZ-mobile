import { Text } from "react-native";
import ScreenWrapper from "./ScreenWrapper";
import CustomButton from "../components/CustomButton";
import { router } from "expo-router";

export default function InventoryScreen() {
  return (
    <ScreenWrapper>
      <Text>Welcome to the Inventory Screen!</Text>
      <CustomButton label={"Działam"} onPress={() => router.push("/")}/>
      
      
    </ScreenWrapper>
  );
}