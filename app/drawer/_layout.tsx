import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Drawer } from 'expo-router/drawer';
import { InventoryProvider } from '../context/InventoryContext'; // <-- DODANE

export default function DrawerLayout() {
  return (
    // "Owijamy" całą nawigację naszym Providerem
    <InventoryProvider> 
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Drawer 
          screenOptions={{
            drawerStyle: {
              backgroundColor: '#D0DDD0',
              width: 250,
            },
            swipeEdgeWidth: 0,
            drawerActiveBackgroundColor:'#9aa6a6',
            drawerActiveTintColor: 'FFFFFF', 
            headerShown: true,
            headerStyle: {
              backgroundColor: '#D0DDD0',
            },
            headerTitleAlign:"center",
          }}
        >
          <Drawer.Screen name="inventory" options={{ drawerLabel: "Inwentaryzacja" , headerTitle:"Inwentaryzacja"}} />
          <Drawer.Screen name="table" options={{ drawerLabel: "Tabela",headerTitle:"Tabela" }} />
          <Drawer.Screen name="files" options={{ 
              drawerLabel: "Pliki", 
              headerTitle: "Lista Plików",
              headerShown: false,
            }} />
        </Drawer>
      </GestureHandlerRootView>
    </InventoryProvider> // <-- DODANE
  );
}