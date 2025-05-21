// Np. w app/index.tsx lub app/screens/HomeScreen.tsx

import React, { useEffect, useState } from 'react';
import { View, Text, Button, ActivityIndicator, Platform, StyleSheet } from 'react-native';

// Adresy URL do testowania:
// 1. Dla emulatora Androida, 10.0.2.2 to localhost Twojego komputera.
const ANDROID_EMULATOR_URL = 'http://10.0.2.2:8000/'; // Zmień '/api/' na istniejący u Ciebie endpoint lub nawet '/'

// 2. Dla symulatora iOS, localhost powinien działać bezpośrednio.
const IOS_SIMULATOR_URL = 'http://192.168.1.72:8000/'; // Zmień '/api/' na istniejący u Ciebie endpoint lub nawet '/'

// 3. Dla fizycznego urządzenia w tej samej sieci Wi-Fi co Twój komputer:
//    Musisz użyć adresu IP Twojego komputera w sieci lokalnej.
//    Np. 'http://192.168.1.105:8000/api/' (znajdź swój IP np. przez ipconfig/ifconfig)
//    PAMIĘTAJ: Twój backend Django musi mieć ten adres IP w ALLOWED_HOSTS.
const PHYSICAL_DEVICE_URL = 'http://192.168.1.72:8000/api/'; // ZMIEŃ NA SWÓJ IP i endpoint

// Automatyczny wybór URL na podstawie platformy
const getBackendUrl = () => {
  if (Platform.OS === 'android') {
    // Jeśli używasz emulatora Android
    return ANDROID_EMULATOR_URL;
    // Jeśli używasz fizycznego urządzenia Android, użyj PHYSICAL_DEVICE_URL
    // return PHYSICAL_DEVICE_URL;
  } else if (Platform.OS === 'ios') {
    // Jeśli używasz symulatora iOS
    return IOS_SIMULATOR_URL;
    // Jeśli używasz fizycznego urządzenia iOS, użyj PHYSICAL_DEVICE_URL
    // return PHYSICAL_DEVICE_URL;
  } else {
    // Dla web lub innych platform
    return IOS_SIMULATOR_URL; // Lub inny domyślny
  }
};

export default function ConnectionTestScreen() {
  const [status, setStatus] = useState<string>('Oczekiwanie na test...');
  const [loading, setLoading] = useState<boolean>(false);

  const testConnection = async () => {
    setLoading(true);
    setStatus('Łączenie...');
    const URL_TO_TEST = getBackendUrl();
    console.log(`Próba połączenia z: ${URL_TO_TEST}`);

    try {
      // Używamy prostego fetch API
      const response = await fetch(URL_TO_TEST, {
        method: 'GET', // Lub inna metoda, jeśli endpoint tego wymaga
        // Możesz dodać timeout, jeśli chcesz
        // signal: AbortSignal.timeout(5000) // Np. 5 sekund timeout (wymaga obsługi błędu AbortError)
      });

      // Sprawdzamy status odpowiedzi
      // Każdy status poniżej 500 oznacza, że serwer odpowiedział (nawet 404, 403, itp.)
      if (response.status < 500) {
        setStatus(`Połączono! Status: ${response.status} (${response.statusText})`);
        // Możesz spróbować odczytać odpowiedź, jeśli jest to np. JSON
        // const data = await response.text(); // lub response.json() jeśli backend zwraca JSON
        // console.log("Odpowiedź z serwera:", data);
      } else {
        setStatus(`Błąd serwera! Status: ${response.status} (${response.statusText})`);
      }
    } catch (error: any) {
      console.error("Błąd połączenia:", error);
      if (error.message === 'Network request failed') {
        setStatus('Błąd sieciowy! Sprawdź adres URL, połączenie internetowe i czy serwer backendu działa oraz czy jest dostępny z tego urządzenia/emulatora. Sprawdź też konfigurację ALLOWED_HOSTS w Django i czy zapora sieciowa nie blokuje połączeń.');
      } else {
        setStatus(`Błąd: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Test Połączenia z Backendem</Text>
      <Button title="Testuj Połączenie" onPress={testConnection} disabled={loading} />
      {loading && <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />}
      <Text style={styles.statusText}>Status: {status}</Text>
      <Text style={styles.infoText}>
        Testowany URL: {getBackendUrl()} (upewnij się, że jest poprawny dla Twojego środowiska testowego i że backend na nim nasłuchuje).
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  loader: {
    marginVertical: 20,
  },
  statusText: {
    marginTop: 20,
    fontSize: 16,
    textAlign: 'center',
    color: '#333',
  },
  infoText: {
    marginTop: 15,
    fontSize: 12,
    textAlign: 'center',
    color: 'gray',
    paddingHorizontal: 10,
  }
});