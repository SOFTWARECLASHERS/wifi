import { ActivityIndicator, Alert, Modal, StyleSheet, Text, ToastAndroid, TouchableOpacity, View } from 'react-native'
import React, { useLayoutEffect, useRef, useState } from 'react'
import WifiManager from 'react-native-wifi-reborn';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { companyName, companyNameSize } from '../config/config';
const Scaned = () => {
  const [wifiData, setWifiData] = useState();
  const navigation = useNavigation();
  const closeWifi = async () => {
    ToastAndroid.show(`CURRENT WIFI DISCONNECTED`, ToastAndroid.SHORT);
    WifiManager.disconnect();

    navigation.navigate("Home", {
      disconnect: true,
    });
  }
  const [laoding, setLoading] = useState(false);
  const reScan = () => {
    const fetchWifiList = async () => {
      setLoading(true);
      try {
        const list = await WifiManager.reScanAndLoadWifiList();
        if (list.length > 0) {
          navigation.navigate("Scanned", {
            networks: list,
          })
        } else {
          navigation.navigate("Scanned", {
            networks: list,
          })
        }
        setLoading(false);
        console.log(list);
      } catch (err) {
        setLoading(false);
        Alert.alert("Declined!");
        console.log(err);
      }
    };
    fetchWifiList();
  }
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <>
          <TouchableOpacity onPress={() => reScan()}>
            <Ionicons name="reload" size={24} color="black" />
          </TouchableOpacity>
        </>
      ),
      headerLeft: () => (
        <>
        </>
      ),
    });
  }, [navigation]);

  const [background, setBackground] = useState("#000");
  const [backgroundtwo, setBackgroundtwo] = useState("#000");
  const changebgColor = () => {
    if (background === "#000") {
      setBackground("green");
    } else {
      setBackground("#000");
    }
  }
  const changebgColortwo = () => {
    if (backgroundtwo === "#000") {
      setBackgroundtwo("green");
    } else {
      setBackgroundtwo("#000");
    }
  }
  const wifiStatus = async () => {
    setWifiData([]);
    // get the info about cuucurrent wifi
    const fetchData = async () => {
      const strength = await WifiManager.getCurrentSignalStrength();
      const frequency = await WifiManager.getFrequency();
      const ip = await WifiManager.getIP();
      const ssid = await WifiManager.getCurrentWifiSSID();
      Alert.alert(
        'WIFI Is Connected',
        `SSID: ${ssid}\nFrequency: ${frequency}\nIP: ${ip}\nStrength: ${strength}`
      );
      ToastAndroid.show(`WIFI Is Connected WITH ${ssid}:Freq${frequency}:ip${ip}`, ToastAndroid.CENTER);
    };
    fetchData();
  }
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <StatusBar style='auto' />
      <Text style={{ fontSize: companyNameSize, fontWeight: '400', marginBottom: 20 }}>{companyName}</Text>
      <TouchableOpacity onPress={() => changebgColor()} style={{ width: 220, margin: 20, height: 70, backgroundColor: background, borderRadius: 30, padding: 20, alignItems: "center" }}>
        <Text style={{ fontSize: 20, color: "#fff", fontWeight: "bold" }}>Start</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => changebgColortwo()} style={{ width: 220, margin: 20, height: 70, backgroundColor: backgroundtwo, borderRadius: 30, padding: 20, alignItems: "center" }}>
        <Text style={{ fontSize: 20, color: "#fff", fontWeight: "bold" }}>Stop</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => wifiStatus()} style={{ width: 220, margin: 20, height: 70, backgroundColor: "#000", borderRadius: 30, padding: 20, alignItems: "center" }}>
        <Text style={{ fontSize: 20, color: "#fff", fontWeight: "bold" }}>Status</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => closeWifi()} style={{ width: 220, margin: 20, height: 70, backgroundColor: "#000", borderRadius: 30, padding: 20, alignItems: "center" }}>
        <Text style={{ fontSize: 20, color: "#fff", fontWeight: "bold" }}>Close</Text>
      </TouchableOpacity>
      {
        laoding && (
          <View style={{ margin: 30, }}>
            <ActivityIndicator size={60} color="black" />
          </View>
        )
      }
    </View>
  )
}

export default Scaned

const styles = StyleSheet.create({})