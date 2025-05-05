import { StyleSheet,View } from "react-native";
import ScreenWrapper from "./ScreenWrapper";
import TanStackTable from "../components/TanStackTable";
import { useState,useEffect } from "react";
import inventoryData from "../inventoryData.json";
export default function TableViewScreen() {

  
    const [data, setData] = useState<any[]>([]);
  
    useEffect(() => {
      setData(inventoryData);
    }, []);
  

  return (
    <ScreenWrapper>
      
      <View style={styles.container}>
        <View style={styles.tableContainer}>
            <TanStackTable data={data} />
        </View>

        
      </View>
      
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  tableContainer: {
    flex: 0.9, 
  },
});