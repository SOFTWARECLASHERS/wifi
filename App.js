import 'expo-dev-client';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from './screens/Home';
import MainScan from './screens/MainScan';
import Scaned from './screens/Scaned';
const Stack = createNativeStackNavigator();
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={Home}/>
        <Stack.Screen name="Scanned" component={MainScan} options={{ title: 'Scanned Devices' }} />
        <Stack.Screen name="ScannedDetails" component={Scaned} options={{ title: 'Manage' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

