import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Drawer } from 'expo-router/drawer';
import LoginScreen from '../login'; 

export default function DrawerLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer 
        screenOptions={{
          
          drawerStyle: {
            backgroundColor: '#D0DDD0',
            width: 250,
          },
          
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
  );
}

