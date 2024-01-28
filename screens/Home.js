import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, Alert, Button, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import React, { useLayoutEffect } from 'react'
import WifiManager from "react-native-wifi-reborn";
import { useEffect, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { companyName, companyNameSize } from '../config/config';
const Home = () => {
    const route = useRoute();
    const navigation = useNavigation();
    useLayoutEffect(() => {
        navigation.setOptions({
            headerLeft: () => null,
        });
    }, [navigation]);
    const [recNetworks, setrecNetworks] = useState([])
    const [loading, setLoading] = useState(false);
    // Fetch and update the list of available WiFi networks
    const fetchWifiList = async () => {
        setLoading(true);
        try {
            const list = await WifiManager.reScanAndLoadWifiList();
            if (recNetworks.length > 0) {
                setrecNetworks([]);
                navigation.navigate("Scanned", {
                    networks: list,
                })
            } else {
                setrecNetworks(list);
                navigation.navigate("Scanned", {
                    networks: list,
                })
            }
            setLoading(false);
            console.log(list);
        } catch (err) {
            setLoading(false);
            Alert.alert(`Something went wrong:(`);
            console.log(err);
        }
    };
    const loadWifi = () => {
        fetchWifiList();
    }
    useEffect(() => {
        if (route.params?.disconnect !== undefined && route.params?.disconnect === true) {
            // do nothing
        } else  {
            WifiManager.connectionStatus().then((data) => {
                console.log(data);
                if (data === true) {
                    navigation.navigate("ScannedDetails")
                }
            }).catch((err) => {
                console.log(err);
            })
        }
    }, [])
    return (
        <View style={styles.container}>
            <StatusBar style='auto' />
            <View style={{ flex: 1, marginTop: 100, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20 }}>
                <Text style={{ fontSize: companyNameSize, fontWeight: '400', marginBottom: 20 }}>{companyName}</Text>
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