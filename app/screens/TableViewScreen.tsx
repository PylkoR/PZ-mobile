import { Text } from "react-native";
import ScreenWrapper from "./ScreenWrapper";
import CustomButton from "../components/CustomButton";
import { router } from "expo-router";

export default function TableViewScreen() {
  return (
    <ScreenWrapper>
      <Text>Welcome to the Table View Screen!</Text>
      <CustomButton label={"Działam"} onPress={() => router.push("/")}/>
      
      
    </ScreenWrapper>
  );
}