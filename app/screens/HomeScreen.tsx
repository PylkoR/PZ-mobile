import { Button, Modal, Text, View, StyleSheet } from "react-native";
import ScreenWrapper from "./ScreenWrapper";
import CustomButton from "../components/CustomButton";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { WebView } from 'react-native-webview';

const DJANGO_URL = 'http://192.168.1.72:8000/oauth/login'


export default function HomeScreen() {
  const router = useRouter(); // testowy button do redirectu na strony z menu
  const [showUsosLoginModal, setShowUsosLoginModal] = useState(false); // Stan do kontrolowania modala

  const handleOpenUsosLogin = () => {
    setShowUsosLoginModal(true); // Pokaż modal
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
       
        <View style={{ flex: 1 }}> {/* Zwykły View jako kontener dla WebView i przycisku Zamknij */}
          <WebView
            source={{ uri: DJANGO_URL }}
            style={{ flex: 1 }}
            startInLoadingState={true} // Opcjonalnie: pokazuje wskaźnik ładowania
            // onError={(syntheticEvent) => {
            //   const { nativeEvent } = syntheticEvent;
            //   console.warn('WebView error: ', nativeEvent);
            //   setShowUsosLoginModal(false);
            //   alert(`Błąd ładowania strony logowania: ${nativeEvent.description || nativeEvent.code}`);
            // }}
          />
          <Button title="Zamknij" onPress={() => setShowUsosLoginModal(false)} />
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