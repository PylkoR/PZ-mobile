import { Text } from "react-native";
import ScreenWrapper from "./ScreenWrapper";
import CustomButton from "../components/CustomButton";
import { useRouter } from "expo-router";
import { View, StyleSheet } from "react-native";
import FilesList from "../components/FilesList";

export default function FilesListScreen() {
  const router = useRouter(); // testowy button do redirectu na strony z menu

  const files = [
    { id: '1', name: 'File 1' },
    { id: '2', name: 'File 2' },
    { id: '3', name: 'File 3' },
    { id: '4', name: 'File 4' },
    { id: '5', name: 'File 5' },
    { id: '6', name: 'File 6' },
    { id: '7', name: 'File 7' },
    { id: '8', name: 'File 8' },
    { id: '9', name: 'File 9' },
    { id: '10', name: 'File 10' },
    { id: '11', name: 'File 11' },
    { id: '12', name: 'File 12' },
  ];

  return (
    <ScreenWrapper>
      <View style={styles.buttonWrapper}>
          <CustomButton label={"Wyloguj"} onPress={() => router.push("/")}/>
      </View>
      <FilesList files={files} />
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
    buttonWrapper: {
      position: "absolute",
      top: 30,
      right: 40,
    },
});