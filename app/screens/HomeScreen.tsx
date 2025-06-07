import { Alert, Button, Modal, Text, View, StyleSheet } from "react-native";
import ScreenWrapper from "./ScreenWrapper";
import CustomButton from "../components/CustomButton";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { WebView } from 'react-native-webview';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DJANGO_URL = 'http://192.168.0.180:8000/oauth/login/?source=mobile';
const DJANGO_SUCCESS_INDICATOR_URL_PART = 'http://192.168.0.180:8000/oauth/callback/'; // zmień na swoje IP

export default function HomeScreen() {
  const router = useRouter(); 
  const [showUsosLoginModal, setShowUsosLoginModal] = useState(false);
  const [webViewLoading, setWebViewLoading] = useState(false);
  const [authToken, setAuthToken] = useState<string | null>(null);

  const handleOpenUsosLogin = () => {
    setShowUsosLoginModal(true);
  };

  const handleCloseUsosLogin = () => {
    setShowUsosLoginModal(false);
    setWebViewLoading(false); 
  };

  // Wstrzykuj JS do WebView, aby przechwycić odpowiedź JSON
  const injectedJS = `
    (function() {
      function sendToRN(msg) {
        if (window.ReactNativeWebView && window.ReactNativeWebView.postMessage) {
          window.ReactNativeWebView.postMessage(msg);
        }
      }
      // Log do konsoli WebView
      console.log('InjectedJS działa!');
      // Wysyłaj body od razu po załadowaniu strony
      function trySendBody() {
        try {
          var bodyText = document.body && document.body.innerText;
          sendToRN(bodyText);
        } catch (e) { sendToRN('ERROR: ' + e.message); }
      }
      window.onload = trySendBody;
      setTimeout(trySendBody, 100); // szybciej!
      // Fallback: wyślij URL
      sendToRN(window.location.href);

      // Przechwyć XHR
      var origOpen = XMLHttpRequest.prototype.open;
      XMLHttpRequest.prototype.open = function() {
        this.addEventListener('load', function() {
          if (this.responseType === '' || this.responseType === 'text') {
            try {
              var json = JSON.parse(this.responseText);
              sendToRN(JSON.stringify(json));
            } catch (e) {}
          }
        });
        origOpen.apply(this, arguments);
      };
      // Przechwyć fetch
      var origFetch = window.fetch;
      window.fetch = function() {
        return origFetch.apply(this, arguments).then(function(response) {
          if (response.headers.get('content-type') && response.headers.get('content-type').includes('application/json')) {
            response.clone().json().then(function(json) {
              sendToRN(JSON.stringify(json));
            });
          }
          return response;
        });
      };
    })();
  `;

  const handleWebViewMessage = async (event: any) => {
    const raw = event.nativeEvent.data;
    console.log('handleWebViewMessage fired:', raw);

    // Poprawiony regex!
    const jsonMatch = raw.match(/{[\s\S]*}/);
    if (jsonMatch) {
      try {
        const data = JSON.parse(jsonMatch[0]);
        if (data && data.token) {
          setAuthToken(data.token);
          await AsyncStorage.setItem('authToken', data.token);
          console.log("Znaleziono token z JSON");
          setShowUsosLoginModal(false);
          router.replace('/files');
          return;
        }
      } catch (e) {
        console.log("Błąd parsowania JSON z WebView:", jsonMatch[0]);
      }
    }
    // Jeśli nie znaleziono JSON-a lub nie ma tokena
    console.log("Nie znaleziono poprawnego JSON-a z tokenem w odpowiedzi WebView.");
  };

  // Uprość onNavigationStateChange, usuwając z niej logikę nawigacji
  const onNavigationStateChange = (navState: any) => {
    setWebViewLoading(navState.loading);
    console.log("WebView URL Changed:", navState.url); // Zostaw to do debugowania
    // Usuń stąd warunek sprawdzający URL i nawigację
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
          <WebView
            source={{ uri: DJANGO_URL }}
            style={{ flex: 1 }}
            startInLoadingState={true} 
            onMessage={handleWebViewMessage}
            onNavigationStateChange={onNavigationStateChange}
            injectedJavaScript={injectedJS}
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
    justifyContent: "center", // centrowanie w pionie
    alignItems: "center", // centrowanie w poziomie
  },
  buttonWrapper: {
    justifyContent: "center",
    alignItems: "center", // wyśrodkowanie guzika w poziomie
    marginTop: 15, // opcjonalnie odstęp od tekstu
    transform: [{ scale: 1 }],
  },
  text: {
    width: "80%",
    fontSize: 24,  // zwiększona czcionka
    color: "#fff", // kolor biały
    textAlign: "center", // wyśrodkowanie tekstu
  },
});