import React from "react";
import { Text, TouchableOpacity, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

type CustomButtonProps = {
  label?: string;
  onPress?: () => void;
  icon?: keyof typeof MaterialIcons.glyphMap;
  disabled?: boolean; // Add the disabled property
};

const CustomButton: React.FC<CustomButtonProps> = ({
  label,
  onPress,
  icon,
  disabled,
}) => {
  return (
    <TouchableOpacity
      style={[styles.button, disabled && styles.disabledButton]} // Apply disabled style if needed
      onPress={!disabled ? onPress : undefined} // Disable onPress if the button is disabled
      disabled={disabled} // Pass the disabled prop to TouchableOpacity
    >
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
  disabledButton: {
    backgroundColor: "#E0E0E0", // Lighter color for disabled state
    borderColor: "#A0A0A0", // Adjust border color for disabled state
  },
  text: {
    color: "#000000",
  },
});

export default CustomButton;