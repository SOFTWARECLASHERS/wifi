import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, Alert, Button, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import React from 'react'
import WifiManager from "react-native-wifi-reborn";
import { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
const Home = () => {
    const navigation = useNavigation();
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
                navigation.navigate("Scanned", {
                    networks: recNetworks,
                })
            } else {
                setrecNetworks(list);
                navigation.navigate("Scanned", {
                    networks: recNetworks,
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


    // const handleStart = () => {
    //     fetchWifiList();
    // }
    // const handleStop = () => {
    //     setrecNetworks([]);
    //     setSSID('');
    //     setSelectedWifi('');
    //     setPassword('');
    // }
    const loadWifi = () => {
        fetchWifiList();
    }
    // useEffect(() => {
    //     if (WifiManager.getCurrentWifiSSID != null) {
    //         navigation.navigate("ScannedDetails");
    //     }
    // })

    return (
        <View style={styles.container}>
            <StatusBar style='auto' />
            <View style={{ flex: 1, marginTop: 100, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20 }}>
                <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 20 }}>Wifi-Connecting App</Text>
                {/* <TextInput
                    placeholder="Enter SSID"
                    value={ssid}
                    onChangeText={text => setSSID(text)}
                    style={{ borderWidth: 1, padding: 10, marginBottom: 10, width: 240, borderRadius: 4, }}
                />
                <TextInput
                    placeholder="Enter Password"
                    value={password}
                    onChangeText={text => setPassword(text)}
                    secureTextEntry
                    style={{ borderWidth: 1, padding: 10, marginBottom: 10, width: 240, borderRadius: 4, }}
                /> */}
                {/* <View style={{ marginBottom: 10, width: 120, overflow: 'hidden' }}>
                    <Button title="Connect" onPress={handleConnect} />
                </View>
                <View style={{ marginBottom: 10, width: 120, overflow: 'hidden' }}>
                    <Button title="Start" onPress={handleStart} />
                </View>
                <View style={{ marginBottom: 10, width: 120, overflow: 'hidden' }}>
                    <Button title="Stop" onPress={handleStop} />
                </View> */}

                <TouchableOpacity onPress={() => loadWifi()} style={{ width: 220, margin: 20, height: 70, backgroundColor: "#000", borderRadius: 30, padding: 20, alignItems: "center" }}>
                    <Text style={{ fontSize: 20, color: "#fff", fontWeight: "bold" }}>Scan</Text>
                </TouchableOpacity>
                {
                    loading && (
                        <ActivityIndicator style={{ margin: 100 }} color="#000" size={70} />
                    )
                }

            </View>
        </View>
    );
}

export default Home


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