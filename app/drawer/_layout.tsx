import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Drawer } from 'expo-router/drawer';

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

          headerStyle: {
            backgroundColor: '#D0DDD0',
          },

        }}
      />
      
    </GestureHandlerRootView>
  );
}

