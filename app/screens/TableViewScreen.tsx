import { StyleSheet, View, Text, ActivityIndicator } from "react-native";
import ScreenWrapper from "./ScreenWrapper";
import TanStackTable from "../components/TanStackTable";
import { useInventory } from "../context/InventoryContext";

export default function TableViewScreen() {
  const { inventoryData, isLoading } = useInventory();

  if (isLoading) {
    return (
      <ScreenWrapper>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.infoText}>Ładowanie danych...</Text>
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper>
      <View style={styles.tableContainer}>
        {inventoryData.length > 0 ? (
          <TanStackTable data={inventoryData} />
        ) : (
          <View style={styles.centered}>
            <Text style={styles.infoText}>
              Brak danych do wyświetlenia.{"\n"}Wybierz inwentaryzację z ekranu "Pliki".
            </Text>
          </View>
        )}
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tableContainer: {
    flex: 1, 
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  infoText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 10,
  }
});