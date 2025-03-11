import React from "react";
import { Text, TouchableOpacity, StyleSheet, Image, ImageSourcePropType } from "react-native";

type CustomButtonProps = { //Przycisk albo ma label albo iokonę
  label?: string; 
  onPress?: () => void;
  icon?: ImageSourcePropType; 
};

const CustomButton: React.FC<CustomButtonProps> = ({ label, onPress, icon }) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      {icon && <Image source={icon} style={styles.icon} />}
      {label && <Text style={styles.text}>{label}</Text>}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    backgroundColor: "#D0DDD0",
    borderColor: "#000000",
    alignItems: "center",
    alignSelf: "flex-start", 
    flexDirection: "row", 
  },
  text: {
    color: "#000000",
    fontWeight: "bold",
  },
  icon: {
    width: 20, 
    height: 20, 
    marginRight: 8,
  },
});

export default CustomButton;