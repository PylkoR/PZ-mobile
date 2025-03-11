import { Text } from "react-native";
import ScreenWrapper from "./ScreenWrapper";
import CustomButton from "../components/CustomButton";
import { useRouter } from "expo-router";

export default function HomeScreen() {
  const router = useRouter(); // testowy button do redirectu na strony z menu

  return (
    <ScreenWrapper>
      <Text>Welcome to the Home Screen!</Text>
      <CustomButton label={"Działam"} onPress={() => router.push("../drawer/inventory")}/>
      
      
    </ScreenWrapper>
  );
}