import React from "react";
import FileButton from "./FileButton";
import { View, StyleSheet, FlatList } from "react-native";
import { useRouter } from "expo-router";

interface FileItem {
  id: string;
  name: string;
}

interface FilesListProps {
  files: FileItem[];
}

const FilesList: React.FC<FilesListProps> = ({ files }) => {
  const router = useRouter();

  const renderItem = ({ item }: { item: FileItem }) => (
    <FileButton
      label={item.name}
      onPress={() => {
        console.log(`Navigating to inventory with ID: ${item.id}`);
        router.push({
          pathname: "../drawer/inventory",
          params: { inventoryId: item.id },
        });
      }}
    />
  );

  return (
    <View style={styles.container}>
      <View style={styles.background}>
        <FlatList
          data={files}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
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
    marginTop: 80,
  },
  list: {
    paddingVertical: 20,
  },
  background: {
    flex: 1,
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 10,
  },
});

export default FilesList;