import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { useNavigation, useRoute } from '@react-navigation/native';
import WifiManager from "react-native-wifi-reborn";
import { StatusBar } from 'expo-status-bar';
import { companyName, companyNameSize } from '../config/config';
const MainScan = () => {
  const [selectedWifi, setSelectedWifi] = useState('');
  const route = useRoute();
  const { networks } = route.params;
  const [ssid, setSSID] = useState('');
  const [password, setPassword] = useState('');

  const navigation = useNavigation();

  const [isChecked, setIsChecked] = useState(false);
  const saveDataArray = async (datas) => {
    try {
      const dataWithPassword = {
        password: password,
        datas: datas.SSID
      };
      // Convert the array to a string using JSON.stringify
      const dataArrayString = JSON.stringify(datas);

      // Save the data array string with a specific key
      await AsyncStorage.setItem('dataKey', dataArrayString);

      console.log('Data array saved successfully!');
    } catch (error) {
      console.error('Error saving data array:', error);
    }
  };
  const toggleCheckbox = () => {
    setIsChecked(!isChecked);
  };
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
          if (isChecked === true) {
            saveDataArray(ssids);
          } else {
            navigation.navigate("ScannedDetails");
          }
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
      <Text style={{ fontSize: companyNameSize, fontWeight: '400', marginBottom: 40 }}>{companyName}</Text>
      <TextInput
        placeholder="SSID"
        value={ssid}
        onChangeText={text => setSSID(text)}
        autoFocus={false}
        editable={false}
        style={{ borderWidth: 1, padding: 10, marginBottom: 10, width: 240, borderRadius: 4, }}
      />
      <TextInput
        placeholder="Enter Password"
        value={password}
        onChangeText={text => setPassword(text)}
        secureTextEntry
        autoFocus={false}
        ref={inputRef}
        style={{ borderWidth: 1, padding: 10, marginBottom: 10, width: 240, borderRadius: 4, }}
      />
      {/* 
      <TouchableOpacity
        style={styles.checkbox}
        onPress={toggleCheckbox}
      >
        {isChecked ? (
          <>
            <Text>PASSWORD WILL BE SAVED</Text>
          </>
        ) : (
          <>
            <Text>PASSWORD WILL NOT BE SAVED</Text>
          </>
        )}
      </TouchableOpacity> */}
      <Text>{isChecked ? true : false}</Text>
      {selectedWifi.length > 0 &&
        <TouchableOpacity onPress={() => connectToWifi(ssid, password)} style={{ width: 220, margin: 20, height: 70, backgroundColor: "#000", borderRadius: 30, padding: 20, alignItems: "center" }}>
          <Text style={{ fontSize: 20, color: "#fff", fontWeight: "bold" }}>Connect</Text>
        </TouchableOpacity>
      }
      <FlatList
        data={wifis}
        keyExtractor={item => item.BSSID}
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
  checkbox: {
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
    borderWidth: 0.9,
    borderColor: "black",
    padding: 20,
    borderRadius: 30,
    width: 'auto',
  },
  text: {
    color: "#fff",
  },
  bold: {
    fontWeight: "bold",
  }
});