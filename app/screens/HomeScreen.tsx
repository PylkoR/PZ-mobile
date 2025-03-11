import { Text } from "react-native";
import ScreenWrapper from "./ScreenWrapper";
import CustomButton from "../components/CustomButton";

export default function HomeScreen() {
  return (
    <ScreenWrapper>
      <Text>Welcome to the Home Screen!</Text>
      <CustomButton label={"Działam"}/>
      
      
    </ScreenWrapper>
  );
}