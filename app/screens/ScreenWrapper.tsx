import { View, StyleSheet } from "react-native";
import { ReactNode } from "react";

interface ScreenWrapperProps {
  children: ReactNode;
}

export default function ScreenWrapper({ children }: ScreenWrapperProps) {
  return <View style={styles.container}>{children}</View>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#4C6866", // Globalny kolor tła
    padding: 20,
  },
});