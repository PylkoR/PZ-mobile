// app/screens/FilesListScreen.tsx
import { Alert, StyleSheet, View } from "react-native";
import ScreenWrapper from "./ScreenWrapper";
import CustomButton from "../components/CustomButton";
import FilesList from "../components/FilesList";
import { useRouter } from "expo-router";
import React, { useState, useEffect } from "react";
import { WebView } from 'react-native-webview'; // Importujemy WebView


const YOUR_BACKEND_IP = '192.168.210.189'; // Użyj swojego IP
const DJANGO_LOGOUT_URL = `http://${YOUR_BACKEND_IP}:8000/logout/`;
const GET_INVENTORIES_URL = `http://${YOUR_BACKEND_IP}:8000/inventories/`;

export default function FilesListScreen() {
  const router = useRouter(); 
  const [files, setFiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false); 

  useEffect(() => {
    const fetchInventories = async () => {
      try {
        const response = await fetch(GET_INVENTORIES_URL, {
          credentials: "include",
        });

        if (!response.ok) {
          let errorMessage = `Network error: ${response.status} - ${response.statusText}`;
          try {
            const errorData = await response.json();
            errorMessage = errorData.detail || JSON.stringify(errorData);
          } catch (err) {
            console.error("Error parsing inventory fetch response:", err);
          }
          throw new Error(errorMessage);
        }

        const data = await response.json();
        setFiles(data.reverse());
      } catch (err) {
        console.error("Error fetching inventories:", err);
        setFiles([]);
      } finally {
        setLoading(false);
      }
    };

    fetchInventories();
  }, []);

  const performLogoutOnBackend = () => {
    console.log("Rozpoczęcie wylogowywania backendu, ustawienie isLoggingOut na true");
    setIsLoggingOut(true); 
  };

  const handleLogout = () => {
    Alert.alert(
      "Potwierdzenie",
      "Czy na pewno chcesz się wylogować?",
      [
        {
          text: "Anuluj",
          style: "cancel"
        },
        {
          text: "Wyloguj",
          onPress: performLogoutOnBackend 
        }
      ]
    );
  };

  const onLogoutWebViewLoadOrError = (event?: any) => {
    if (event && event.nativeEvent && event.nativeEvent.title === "Error page") { // Prosty sposób na wykrycie błędu strony
        console.warn("Ukryte WebView napotkało błąd strony podczas wylogowywania.");
        Alert.alert("Błąd", "Nie udało się w pełni wylogować z serwera, ale zostaniesz wylogowany z aplikacji.");
    } else if (event && event.nativeEvent && event.nativeEvent.description) { // Błąd natywny WebView
        console.warn("Natywny błąd ukrytego WebView podczas wylogowywania:", event.nativeEvent.description);
        Alert.alert("Błąd", `Wystąpił problem podczas wylogowywania: ${event.nativeEvent.description}. Zostaniesz wylogowany z aplikacji.`);
    } else {
        console.log("Ukryte WebView zakończyło ładowanie (strona wylogowania).");
    }
    
    setIsLoggingOut(false); 
    console.log("Przekierowanie do HomeScreen po próbie wylogowania.");
    router.replace('/');    
  };

  if (loading) {
    return (
      <ScreenWrapper>
        <View style={styles.loadingContainer}>
          <CustomButton label="Loading..." disabled />
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper>
      <View style={styles.buttonWrapper}>
        <CustomButton label="Logout" onPress={handleLogout} />
      </View>
      <FilesList files={files.map(file => ({ id: file.id.toString(), name: file.name }))} />

      {isLoggingOut && (
        <View style={styles.hiddenWebViewContainer} pointerEvents="none">
          <WebView
            source={{ uri: DJANGO_LOGOUT_URL }}
            onLoadEnd={onLogoutWebViewLoadOrError} // Wywołane po załadowaniu (sukces lub błąd strony)
            onError={onLogoutWebViewLoadOrError}   // Wywołane przy błędach natywnych WebView
            // incognito={true} // Rozważ dla "czystszego" wylogowania
            style={{ width: 1, height: 1 }} // Minimalny rozmiar, aby działało
          />
        </View>
      )}
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  buttonWrapper: {
    position: "absolute",
    top: 30,
    right: 40,
    zIndex: 10, // Upewnij się, że jest na wierzchu
  },
  hiddenWebViewContainer: {
    position: 'absolute',
    top: -1000, // Przesuń daleko poza ekran, aby na pewno nie było widoczne
    left: -1000, // Przesuń daleko poza ekran
    width: 1,
    height: 1,
    opacity: 0, // Opcjonalnie, dla pewności
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});