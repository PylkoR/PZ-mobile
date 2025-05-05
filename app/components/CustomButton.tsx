import React from "react";
import { Text, TouchableOpacity, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

type CustomButtonProps = { //Przycisk albo ma label albo ikonę
  label?: string; 
  onPress?: () => void;
  icon?: keyof typeof MaterialIcons.glyphMap; 
};

const CustomButton: React.FC<CustomButtonProps> = ({ label, onPress, icon }) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      {icon && <MaterialIcons name={icon} size={40} color="black" />}
      {label && <Text style={styles.text}>{label}</Text>}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: "#D0DDD0",
    alignItems: "center",
    alignSelf: "flex-start", 
    flexDirection: "row", 
    borderColor: "black",
    borderWidth: 1,
    
  },
  text: {
    color: "#000000",
  },
  
});

export default CustomButton;