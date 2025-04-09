import { Text } from "react-native";
import ScreenWrapper from "./ScreenWrapper";
import CustomButton from "../components/CustomButton";
import { router } from "expo-router";
import { View, StyleSheet } from "react-native";

export default function LoginScreen() {
  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <Text>Tutaj API USOS</Text>
        <View style={styles.buttonWrapper}>
            <CustomButton label="Zaloguj" onPress={() => router.push("../files")}/>
        </View>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center", // centrowanie w pionie
    alignItems: "center", // centrowanie w poziomie
  },
  buttonWrapper: {
    justifyContent: "center",
    alignItems: "center", // wyśrodkowanie guzika w poziomie
    marginTop: 10,
  }
})