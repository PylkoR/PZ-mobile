import {
  StyleSheet,
  View,
  Alert,
  TextInput,
  ActivityIndicator,
  Text,
} from "react-native";
import ScreenWrapper from "./ScreenWrapper";
import CustomButton from "../components/CustomButton";
import { useState, useEffect, useCallback } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import TanStackTable from "../components/TanStackTable";
import { DataItem } from "../components/TanStackTable";

const YOUR_BACKEND_IP = '192.168.210.189';
const BASE_BACKEND_URL = `http://${YOUR_BACKEND_IP}:8000`;

export default function InventoryScreen() {
  const [data, setData] = useState<DataItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [room, setRoom] = useState("");
  const [pendingRoom, setPendingRoom] = useState("");
  const [canScan, setCanScan] = useState(false);
  
  const params = useLocalSearchParams<{ inventoryId?: string, scannedData?: string, room?: string }>();
  const inventoryId = params.inventoryId;
  const scannedData = params.scannedData;
  const roomParam = params.room;

  const expoRouter = useRouter();

  // Ustaw pokój po powrocie ze skanera (jeśli jest w parametrach)
  useEffect(() => {
    if (roomParam && roomParam !== room) {
      setRoom(roomParam);
      setPendingRoom(roomParam);
    }
    if (roomParam && !canScan) {
      setCanScan(true);
    }
  }, [roomParam]);

  const fetchInventoryItems = useCallback(async (currentInventoryId?: string) => {
    if (!currentInventoryId) {
      setError("Nie wybrano inwentarza do wyświetlenia.");
      setIsLoading(false);
      setData([]);
      return;
    }

    setIsLoading(true);
    setError(null);
    const itemsUrl = `${BASE_BACKEND_URL}/items/?inventory_id=${currentInventoryId}`;
    console.log("Fetching inventory items from URL:", itemsUrl);

    try {
      const response = await fetch(itemsUrl, {
        credentials: "include",
      });

      if (!response.ok) {
        let errorDetail = `Błąd sieci: ${response.status} - ${response.statusText}`;
        try {
          const errorData = await response.json();
          errorDetail = errorData.detail || errorData.message || JSON.stringify(errorData) || errorDetail;
        } catch (e) { }
        throw new Error(errorDetail);
      }
      const fetchedData: DataItem[] = await response.json();
      if (fetchedData && fetchedData.length > 0) {
      }
      setData(fetchedData);
    } catch (e: any) {
      console.error("Błąd podczas pobierania przedmiotów inwentarza:", e);
      setError(e.message || "Wystąpił błąd podczas pobierania danych.");
      setData([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (inventoryId) {
      fetchInventoryItems(inventoryId);
    } else {
      console.warn("InventoryScreen: Brak inventoryId przy montowaniu komponentu.");
      setError("Nie przekazano ID inwentarza.");
      setData([]);
      setIsLoading(false);
    }
  }, [inventoryId, fetchInventoryItems]);

  const handleStartInventory = () => {
    if (!pendingRoom.trim()) {
      Alert.alert("Błąd", "Wpisz numer pokoju przed rozpoczęciem.");
      return;
    }
    setRoom(pendingRoom);
    setCanScan(true);
  };

  useEffect(() => {
    if (!scannedData || data.length === 0) return;

    const [category, assets, subNumber] = String(scannedData).split("-");
    const found = data.find(
      (item) =>
        String(item.category) === String(category) &&
        String(item.asset_component) === String(assets) &&
        String(item.sub_number) === String(subNumber)
    );

    let alertMessage = `Pokój: ${room}\nKategoria: ${category || ''}\nSkładnik aktywów: ${assets || ''}\nPodnumer: ${subNumber || ''}`;
    if (found) {
      alertMessage += `\n\nRekord znaleziony w tabeli.\nOpis: ${found.asset_description || ''}`;
    } else {
      alertMessage += "\n\nNie znaleziono rekordu w tabeli.";
    }

    Alert.alert(
      "Zeskanowano kod",
      alertMessage,
      found
        ? [
            { text: "Anuluj", style: "cancel", onPress: () => {
              expoRouter.replace({ pathname: "../drawer/inventory", params: { inventoryId, room } });
            } },
            { text: "Zaznacz", onPress: () => {
              expoRouter.replace({ pathname: "../drawer/inventory", params: { inventoryId, room } });
            } },
          ]
        : [{ text: "OK", style: "cancel", onPress: () => {
            expoRouter.replace({ pathname: "../drawer/inventory", params: { inventoryId, room } });
        } }]
    );
  }, [scannedData, data, room]);


  if (isLoading) {
    return (
      <ScreenWrapper>
        <View style={[styles.container, localStyles.centered]}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={localStyles.loadingText}>Ładowanie danych...</Text>
        </View>
      </ScreenWrapper>
    );
  }

  if (error && !data.length) {
    return (
      <ScreenWrapper>
        <View style={[styles.container, localStyles.centered]}>
          <Text style={localStyles.errorText}>Błąd: {error}</Text>
          <CustomButton label="Spróbuj ponownie" onPress={() => inventoryId && fetchInventoryItems(inventoryId)} />
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <View style={styles.roomInputContainer}>
          <TextInput
            placeholder="Pokój"
            style={styles.roomInput}
            value={pendingRoom}
            onChangeText={setPendingRoom}
            editable={!room || !canScan ? true : false}
          />
          {room && canScan ? (
            <CustomButton
              label="Zmień pokój"
              onPress={() => {
                setRoom("");
                setPendingRoom("");
                setCanScan(false);
              }}
            />
          ) : (
            <CustomButton
              label="Rozpocznij"
              onPress={handleStartInventory}
              disabled={canScan}
            />
          )}
        </View>
        
        {error && <Text style={[localStyles.errorText, { marginVertical: 10, paddingHorizontal: 20 }]}>Ostrzeżenie: {error}</Text>}

        <View style={styles.tableContainer}>
          {data.length > 0 ? (
            <TanStackTable data={data} />
          ) : (
            <View style={localStyles.centeredTableMessage}>
              {!isLoading && <Text>Brak danych do wyświetlenia.</Text>}
            </View>
          )}
        </View>

        <View style={styles.bottomButtonContainer}>
          <CustomButton
            icon="photo-camera"
            onPress={() => {
              if (!room.trim()) {
                Alert.alert("Proszę wybrać pokój");
                return;
              }
              setCanScan(true);
              expoRouter.push({ pathname: "../scanner", params: { inventoryId, room } });
            }}
            disabled={!canScan}
          />
        </View>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  roomInputContainer: {
    flexDirection: "row",
    margin:20,
    justifyContent: "center",
    gap: 40,
  },
  roomInput: {
    height: 40,
    width: "20%",
    backgroundColor: "#fff",
    textAlign:"center",
    borderWidth: 1,
    borderColor: "#ccc",
  },
  tableContainer: {
    flex: 0.9, 
  },
  bottomButtonContainer: {
    position: "absolute",
    bottom: 0,
    left: "40%",
    alignItems: "center",
  },
});

const localStyles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#333',
  },
  errorText: {
    color: "red",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 15,
  },
  centeredTableMessage: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  }
});