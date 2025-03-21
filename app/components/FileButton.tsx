import React from "react";
import { Text, TouchableOpacity, StyleSheet } from "react-native";

type FileButtonProps = {
  label: string;
  onPress: () => void;
};

const FileButton: React.FC<FileButtonProps> = ({ label, onPress }) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.text}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: '80%', // Occupy 80% of the white background width
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: "#D0DDD0",
    alignItems: "center",
    alignSelf: "center",
    marginVertical: 8, // Add spacing between buttons
  },
  text: {
    color: "#000000",
  },
});

export default FileButton;
