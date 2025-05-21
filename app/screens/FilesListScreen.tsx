// app/screens/FilesListScreen.tsx
import { Alert, Text, View, StyleSheet } from "react-native";
import ScreenWrapper from "./ScreenWrapper";
import CustomButton from "../components/CustomButton";
import { useRouter } from "expo-router"; // Używamy useRouter hook
import FilesList from "../components/FilesList";
import React, { useState } from "react"; // Dodajemy useState dla stanu
import { WebView } from 'react-native-webview'; // Importujemy WebView


const YOUR_BACKEND_IP = '192.168.1.72'; // Użyj swojego IP
const DJANGO_LOGOUT_URL = `http://${YOUR_BACKEND_IP}:8000/logout/`;

export default function FilesListScreen() {
  const router = useRouter(); 
  const [isLoggingOut, setIsLoggingOut] = useState(false); 

  const files = [
    { id: '1', name: 'File 1' }, { id: '2', name: 'File 2' },
    { id: '3', name: 'File 3' }, { id: '4', name: 'File 4' },
    { id: '5', name: 'File 5' }, { id: '6', name: 'File 6' },
    { id: '7', name: 'File 7' }, { id: '8', name: 'File 8' },
    { id: '9', name: 'File 9' }, { id: '10', name: 'File 10' },
    { id: '11', name: 'File 11' }, { id: '12', name: 'File 12' },
  ];

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


  return (
    <ScreenWrapper>
      <View style={styles.buttonWrapper}>
          <CustomButton label={"Wyloguj"} onPress={handleLogout}/>
      </View>

      <FilesList files={files} />

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
    }
});