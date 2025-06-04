import { Button, Modal, Text, View, StyleSheet } from "react-native";
import ScreenWrapper from "./ScreenWrapper";
import CustomButton from "../components/CustomButton";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { WebView,WebViewNavigation } from 'react-native-webview';

const DJANGO_URL = 'http://192.168.210.189:8000/oauth/login'

const DJANGO_SUCCESS_INDICATOR_URL_PART = 'http://192.168.210.189:8000/oauth/callback/'; //zmien na twoje ip


export default function HomeScreen() {
  const router = useRouter(); 
  const [showUsosLoginModal, setShowUsosLoginModal] = useState(false); // Stan do kontrolowania modala
  const [webViewLoading, setWebViewLoading] = useState(false);


  const handleOpenUsosLogin = () => {
    setShowUsosLoginModal(true); // Pokaż modal
  };

  const handleCloseUsosLogin = () => {
    setShowUsosLoginModal(false);
    setWebViewLoading(false); 
  }

  const onNavigationStateChange = (navState: WebViewNavigation) => {
    console.log("WebView Navigating to: ", navState.url);
    setWebViewLoading(navState.loading); 

    if (navState.url && navState.url.includes(DJANGO_SUCCESS_INDICATOR_URL_PART)) {
      console.log("Wykryto URL sukcesu (dashboard), zamykanie modala i nawigacja do /files");
      setShowUsosLoginModal(false); // Zamknij modal
      setWebViewLoading(false); // Zakończ ładowanie
      router.replace('/files');   // Przejdź do ekranu FilesListScreen (lub innej docelowej ścieżki)
                                  // Używamy replace, aby użytkownik nie mógł wrócić do WebView przyciskiem "wstecz"
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
        onRequestClose={() => setShowUsosLoginModal(false)}
        
      >
       
        <View style={{ flex: 1 ,paddingTop: 20 }}> 
          <WebView
            source={{ uri: DJANGO_URL }}
            style={{ flex: 1 }}
            onNavigationStateChange={onNavigationStateChange}
            startInLoadingState={true} 
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