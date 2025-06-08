import { Alert, Button, Modal, Text, View, StyleSheet, ActivityIndicator } from "react-native";
import ScreenWrapper from "./ScreenWrapper";
import CustomButton from "../components/CustomButton";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { WebView } from 'react-native-webview';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DJANGO_URL = 'http://192.168.1.72:8000/oauth/login/?source=mobile';
const DJANGO_SUCCESS_INDICATOR_URL_PART = 'http://192.168.1.72:8000/oauth/callback/';

export default function HomeScreen() {
  const router = useRouter(); 
  const [showUsosLoginModal, setShowUsosLoginModal] = useState(false);
  const [webViewLoading, setWebViewLoading] = useState(false);
  
  // ZMIANA 1: Nowy stan do zarządzania widocznością WebView
  const [isHidingWebView, setIsHidingWebView] = useState(false);

  const handleOpenUsosLogin = () => {
    // ZMIANA 2: Resetujemy stan ukrywania przy każdym otwarciu modala
    setIsHidingWebView(false);
    setShowUsosLoginModal(true);
  };

  const handleCloseUsosLogin = () => {
    setShowUsosLoginModal(false);
    setWebViewLoading(false); 
  };
  
  const injectedJS = `
    (function() {
      // ... (treść injectedJS pozostaje bez zmian)
      function sendToRN(msg) { if (window.ReactNativeWebView && window.ReactNativeWebView.postMessage) { window.ReactNativeWebView.postMessage(msg); } }
      function trySendBody() { try { var bodyText = document.body && document.body.innerText; sendToRN(bodyText); } catch (e) { sendToRN('ERROR: ' + e.message); } }
      window.onload = trySendBody; setTimeout(trySendBody, 100);
      sendToRN(window.location.href);
    })();
  `;

  const handleWebViewMessage = async (event: any) => {
    const raw = event.nativeEvent.data;
    console.log('handleWebViewMessage fired:', raw);
    
    const jsonMatch = raw.match(/{[\s\S]*}/);
    if (jsonMatch) {
      try {
        const data = JSON.parse(jsonMatch[0]);
        if (data && data.token) {
          await AsyncStorage.setItem('authToken', data.token);
          console.log("Znaleziono token z JSON. Zamykanie modala i nawigacja.");
          
          // Zamykamy modal i nawigujemy do plików
          setShowUsosLoginModal(false);
          router.replace('/files');
          return;
        }
      } catch (e) {
        console.log("Błąd parsowania JSON z WebView:", jsonMatch[0]);
      }
    }
  };

  // ZMIANA 3: Dodajemy logikę ukrywania do onNavigationStateChange
  const onNavigationStateChange = (navState: any) => {
    setWebViewLoading(navState.loading);
    console.log("WebView URL Changed:", navState.url);

    // Jeśli URL zaczyna się od adresu zwrotnego, ukryj WebView
    if (navState.url.startsWith(DJANGO_SUCCESS_INDICATOR_URL_PART)) {
      if (!isHidingWebView) { // Ustawiamy tylko raz, aby uniknąć niepotrzebnych re-renderów
        console.log("Wykryto URL zwrotny, ukrywanie WebView.");
        setIsHidingWebView(true);
      }
    }
  };

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <Text style={styles.text}>Zaloguj się używając konta USOS</Text>
        <View style={styles.buttonWrapper}>
          <CustomButton icon="login" onPress={handleOpenUsosLogin}/>
        </View>
      </View>
      <Modal
        visible={showUsosLoginModal}
        onRequestClose={handleCloseUsosLogin}
      >
        <View style={{ flex: 1 ,paddingTop: 20 }}> 
          {/* ZMIANA 4: Dodajemy warunkowy styl `opacity` do WebView */}
          <WebView
            source={{ uri: DJANGO_URL }}
            style={{ flex: 1, opacity: isHidingWebView ? 0 : 1 }} 
            startInLoadingState={true} 
            onMessage={handleWebViewMessage}
            onNavigationStateChange={onNavigationStateChange}
            injectedJavaScript={injectedJS}
            // Dodajemy renderLoading, aby pokazać wskaźnik aktywności na pełnym ekranie
            renderLoading={() => (
              <View style={styles.loadingOverlay}>
                <ActivityIndicator size="large" color="#007AFF" />
              </View>
            )}
          />
          <Button title="Zamknij" onPress={handleCloseUsosLogin} />
        </View>
      </Modal>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonWrapper: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 15,
    transform: [{ scale: 1 }],
  },
  text: {
    width: "80%",
    fontSize: 24,
    color: "#fff",
    textAlign: "center",
  },
  // ZMIANA 5: Nowy styl dla nakładki ładowania
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'white', // Tło, aby zakryć ewentualne mignięcia
    justifyContent: 'center',
    alignItems: 'center',
  },
});