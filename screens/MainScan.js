import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { useNavigation, useRoute } from '@react-navigation/native';
import WifiManager from "react-native-wifi-reborn";
import { StatusBar } from 'expo-status-bar';
const MainScan = () => {
  const [selectedWifi, setSelectedWifi] = useState('');
  const route = useRoute();
  const { networks } = route.params;
  const [ssid, setSSID] = useState('');
  const [password, setPassword] = useState('');
  const [recNetworks, setrecNetworks] = useState([])
  const [wifiList, setWifiList] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const selectedWifiFunc = (data) => {
    console.log("Ssid:", data);
    setSelectedWifi(data);
    inputRef.current.focus();
  }
  const connectToWifi = async (ssids, pwd) => {
    if (selectedWifi) {
      const password = pwd ?? null;
      const isWep = false;
      console.log(ssids, pwd)
      const isHidden = false;
      await WifiManager.connectToProtectedSSID(ssids, password, isWep, isHidden).then(
        () => {
          console.log("Connected successfully!");
          navigation.navigate("ScannedDetails");
        },
        () => {
          console.log("Connection failed!");
        }
      );
    }
  };
  const inputRef = useRef();
  useEffect(() => {
    setSSID(selectedWifi);
  }, [selectedWifi])
  const [wifis, setWifis] = useState(networks);
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
    <View style={{ flex: 1, marginTop: 100, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20 }}>
      <StatusBar style='auto' />
      <TextInput
        placeholder="Enter Password"
        value={password}
        onChangeText={text => setPassword(text)}
        secureTextEntry
        autoFocus={false}
        ref={inputRef}
        style={{ borderWidth: 1, padding: 10, marginBottom: 10, width: 240, borderRadius: 4, }}
      />
      {selectedWifi.length > 0 &&
        <TouchableOpacity onPress={() => connectToWifi(ssid, password)} style={{ width: 220, margin: 20, height: 70, backgroundColor: "#000", borderRadius: 30, padding: 20, alignItems: "center" }}>
          <Text style={{ fontSize: 20, color: "#fff", fontWeight: "bold" }}>Connect</Text>
        </TouchableOpacity>
      }
      <FlatList
        data={wifis}
        keyExtractor={item => item.bssid}
        key={item => item.bssid}
        renderItem={renderList}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
      />
    </View>
  )
}

export default MainScan


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