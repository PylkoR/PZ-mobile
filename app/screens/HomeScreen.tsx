import { Text } from "react-native";
import ScreenWrapper from "./ScreenWrapper";
import CustomButton from "../components/CustomButton";
import { useRouter } from "expo-router";
import { View, StyleSheet } from "react-native";

export default function HomeScreen() {
  const router = useRouter(); // testowy button do redirectu na strony z menu

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <Text style={styles.text}>Zaloguj się używając konta USOS</Text>
        <View style={styles.buttonWrapper}>
          <CustomButton icon="login" onPress={() => router.push("../login")}/>
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
    marginTop: 15, // opcjonalnie odstęp od tekstu
    transform: [{ scale: 1 }],
  },
  text: {
    width: "80%",
    fontSize: 24,  // zwiększona czcionka
    color: "#fff", // kolor biały
    textAlign: "center", // wyśrodkowanie tekstu
  },
});