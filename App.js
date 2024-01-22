import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, Alert, Button, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import 'expo-dev-client';
import WifiManager from "react-native-wifi-reborn";
import { useEffect, useState } from 'react';

export default function App() {
  const [ssid, setSSID] = useState('');
  const [password, setPassword] = useState('');
  const [recNetworks, setrecNetworks] = useState([])
  const [wifiList, setWifiList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedWifi, setSelectedWifi] = useState('');
  // Fetch and update the list of available WiFi networks
  const fetchWifiList = async () => {
    setLoading(true);
    try {
      const list = await WifiManager.reScanAndLoadWifiList();
      if (recNetworks.length > 0) {
        setrecNetworks([]);
      } else {
        setrecNetworks(list);
      }
      setLoading(false);
      console.log(list);
    } catch (err) {
      setLoading(false);
      Alert.alert("Declined!");
      console.log(err);
    }

  };
  useEffect(() => {
    setSSID(selectedWifi);
  }, [selectedWifi])
  const connectToWifi = async (ssids, pwd) => {
    if (selectedWifi) {
      const password = pwd ?? null;
      const isWep = false;
      console.log(ssids, pwd)
      const isHidden = false;
      console.log(selectedWifi.secure);
      try {
        await WifiManager.connectToProtectedSSID(ssids, password, isWep, isHidden).catch(() => {
          Alert.alert("Something Went Wrong!!!");
        });
        console.log('Connected successfully!');
        Alert.alert('Connected successfully!');
      } catch (error) {
        Alert.alert('Failed to Connect!', error);
        console.error('Error connecting to WiFi:', error);
      }
    }
  };
  const selectedWifiFunc = (data) => {
    console.log("Ssid:", data);
    setSelectedWifi(data);
  }
  const handleStart = () => {
    fetchWifiList();
  }
  const handleStop = () => {
    setrecNetworks([]);
    setSSID('');
    setSelectedWifi('')
    setPassword('')
  }
  const renderList = ({ item, index }) => {
    return (
      <>
        <View key={index}>
          <View style={styles.contE}>
            <Text style={styles.text}>
              SSID: <Text style={styles.bold}>{item?.SSID}</Text>
            </Text>
            <Text style={styles.text}>
              BSSID: <Text style={styles.bold}>{item?.BSSID}</Text>
            </Text>
            <Text style={styles.text}>
              FREQUENCY: <Text style={styles.bold}>{item?.frequency}</Text>
            </Text>
            <Text style={styles.text}>
              CAPABILATIES: <Text style={styles.bold}>{item?.capabilities}</Text>
            </Text>
            <TouchableOpacity onPress={() => selectedWifiFunc(item?.SSID)} style={{ width: 220, margin: 20, height: 70, backgroundColor: "#fff", borderRadius: 20, padding: 20, alignItems: "center" }}>
              <Text style={{ fontSize: 20, fontWeight: "bold" }}>Connect</Text>
            </TouchableOpacity>
          </View>
        </View>
      </>
    )
  }
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={{ flex: 1, marginTop: 100, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20 }}>
        <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 20 }}>Wifi-Connecting App</Text>
        <TextInput
          placeholder="Enter SSID"
          value={ssid}
          onChangeText={text => setSSID(text)}
          style={{ borderWidth: 1, padding: 10, marginBottom: 10, width: 240, borderRadius:4,}}
        />
        <TextInput
          placeholder="Enter Password"
          value={password}
          onChangeText={text => setPassword(text)}
          secureTextEntry
          style={{ borderWidth: 1, padding: 10, marginBottom: 10, width: 240, borderRadius:4,  }}
        />
        <View style={{ marginBottom: 10, width: 120, overflow: 'hidden' }}>
          {/* <Button title="Connect" onPress={handleConnect} /> */}
        </View>
        <View style={{ marginBottom: 10, width: 120, overflow: 'hidden' }}>
          <Button title="Start" onPress={handleStart} />
        </View>
        <View style={{ marginBottom: 10, width: 120, overflow: 'hidden' }}>
          <Button title="Stop" onPress={handleStop} />
        </View>
        {selectedWifi.length > 0 &&
          <TouchableOpacity onPress={() => connectToWifi(ssid, password)} style={{ width: 220, margin: 20, height: 70, backgroundColor: "#000", borderRadius: 30, padding: 20, alignItems: "center" }}>
            <Text style={{ fontSize: 20, color: "#fff", fontWeight: "bold" }}>Connect</Text>
          </TouchableOpacity>
        }
        {
          loading && (
            <ActivityIndicator style={{ margin: 100 }} color="#000" size={70} />
          )
        }
        <FlatList
          data={recNetworks}
          keyExtractor={item => item.bssid}
          key={item => item.bssid}
          renderItem={renderList}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
        />

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  contE: {
    width: 300,
    margin: 20,
    padding: 20,
    backgroundColor: "#000",
    borderRadius: 20,
  },
  text: {
    color: "#fff",
  },
  bold: {
    fontWeight: "bold",
  }
});