import { Stack } from "expo-router";
import { View, StyleSheet,StatusBar } from "react-native";

export default function Layout() {
  return (
    <View style={styles.container}>
      <Stack screenOptions={{ headerShown: false }} />
      <StatusBar backgroundColor={'#D0DDD0'} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});