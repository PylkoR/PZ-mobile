import React from "react";
import CustomButton from "./CustomButton";
import FileButton from "./FileButton"; // Import the new FileButton component
import { View, StyleSheet, FlatList } from "react-native";
import { useRouter } from "expo-router";

const FilesList = ({ files }: { files: { id: string; name: string }[] }) => {
  const router = useRouter();

  const renderItem = ({ item }: { item: { id: string; name: string } }) => (
    <FileButton
      label={item.name}
      onPress={() => router.push("../drawer/inventory")}
    />
  );

  return (
    <View style={styles.container}>
      <View style={styles.background}>
        <FlatList
          data={files}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.list}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 80, // Adjust to avoid overlap with the logout button
  },
  list: {
    paddingVertical: 20,
  },
  background: {
    flex: 1,
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 20, // Round all corners
    padding: 10,
  },
});

export default FilesList;
