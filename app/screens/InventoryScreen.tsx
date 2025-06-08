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
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useInventory } from "../context/InventoryContext"; 

const YOUR_BACKEND_IP = '192.168.1.72';
const BASE_BACKEND_URL = `http://${YOUR_BACKEND_IP}:8000`;

export default function InventoryScreen() {
  const { 
    inventoryData, 
    setInventoryData, 
    isLoading, 
    setIsLoading,
    currentInventoryId,
    setCurrentInventoryId 
  } = useInventory();

  const [error, setError] = useState<string | null>(null);
  const [room, setRoom] = useState("");
  const [pendingRoom, setPendingRoom] = useState("");
  const [canScan, setCanScan] = useState(false);
  
  const params = useLocalSearchParams<{ inventoryId?: string, scannedData?: string, room?: string }>();
  const inventoryId = params.inventoryId;
  const scannedData = params.scannedData;
  const roomParam = params.room;

  const expoRouter = useRouter();

  useEffect(() => {
    if (roomParam && roomParam !== room) {
      setRoom(roomParam);
      setPendingRoom(roomParam);
    }
    if (roomParam && !canScan) {
      setCanScan(true);
    }
  }, [roomParam]);

  // ZMIANA 1: Dodajemy drugi argument `forceRefresh`
  const fetchInventoryItems = useCallback(async (idToFetch?: string, forceRefresh = false) => {
    if (!idToFetch) {
      setError("Nie wybrano inwentarza do wyświetlenia.");
      setIsLoading(false);
      setInventoryData([]);
      return;
    }

    // ZMIANA 2: Modyfikujemy warunek, aby sprawdzał `forceRefresh`
    if (!forceRefresh && idToFetch === currentInventoryId && inventoryData.length > 0) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setCurrentInventoryId(idToFetch);
    setError(null);
    const itemsUrl = `${BASE_BACKEND_URL}/items/?inventory_id=${idToFetch}`;
    console.log(`Fetching inventory items (forceRefresh: ${forceRefresh}) from URL:`, itemsUrl);

    try {
      const authToken = await AsyncStorage.getItem('authToken');
      const response = await fetch(itemsUrl, {
        headers: {
          ...(authToken ? { 'Authorization': `Token ${authToken}` } : {}),
        },
      });

      if (!response.ok) {
        let errorDetail = `Błąd sieci: ${response.status} - ${response.statusText}`;
        try {
          const errorData = await response.json();
          errorDetail = errorData.detail || errorData.message || JSON.stringify(errorData) || errorDetail;
        } catch (e) { }
        throw new Error(errorDetail);
      }
      const fetchedData = await response.json();
      setInventoryData(fetchedData); 
    } catch (e: any) {
      console.error("Błąd podczas pobierania przedmiotów inwentarza:", e);
      setError(e.message || "Wystąpił błąd podczas pobierania danych.");
      setInventoryData([]); 
    } finally {
      setIsLoading(false);
    }
  }, [setInventoryData, setIsLoading, setCurrentInventoryId, currentInventoryId, inventoryData.length]);

  useEffect(() => {
    if (inventoryId) {
      // Przy pierwszym ładowaniu nie wymuszamy odświeżenia
      fetchInventoryItems(inventoryId);
    } else {
      console.warn("InventoryScreen: Brak inventoryId przy montowaniu komponentu.");
      setError("Nie przekazano ID inwentarza.");
      setInventoryData([]);
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
    if (!scannedData || inventoryData.length === 0) return;

    const [category, assets, subNumber] = String(scannedData).split("-");
    const found = inventoryData.find(
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
            { text: "Zaznacz", onPress: async () => {
                if (!found) return;
                try {
                  const patchUrl = `${BASE_BACKEND_URL}/items/${found.id}/`;
                  const patchBody = JSON.stringify({ scanned: true, currentRoom: room });
                  const authToken = await AsyncStorage.getItem('authToken');
                  const patchResp = await fetch(patchUrl, {
                    method: "PATCH",
                    headers: {
                      "Content-Type": "application/json",
                      ...(authToken ? { 'Authorization': `Token ${authToken}` } : {}),
                    },
                    body: patchBody,
                  });
                  if (!patchResp.ok) {
                    let errorMsg = `Błąd aktualizacji: ${patchResp.status}`;
                    try {
                      const errData = await patchResp.json();
                      errorMsg = errData.detail || errData.message || JSON.stringify(errData) || errorMsg;
                    } catch {}
                    Alert.alert("Błąd", errorMsg);
                  } else {
                    // ZMIANA 3: Wymuszamy odświeżenie danych, przekazując `true`
                    await fetchInventoryItems(inventoryId, true);
                  }
                } catch (e: any) {
                  Alert.alert("Błąd", e.message || "Nie udało się zaktualizować rekordu.");
                } finally {
                  expoRouter.replace({ pathname: "../drawer/inventory", params: { inventoryId, room } });
                }
            } },
          ]
        : [{ text: "OK", style: "cancel", onPress: () => {
            expoRouter.replace({ pathname: "../drawer/inventory", params: { inventoryId, room } });
        } }]
    );
  }, [scannedData, inventoryData, room]);


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

  if (error && !inventoryData.length) {
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
          {inventoryData.length > 0 ? (
            <TanStackTable data={inventoryData} />
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