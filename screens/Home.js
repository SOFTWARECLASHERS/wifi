import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, PermissionsAndroid, Alert, Button, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { WifiP2pInfo } from 'react-native-wifi-p2p';
import React, { useLayoutEffect } from 'react'
import WifiManager from "react-native-wifi-reborn";
import { useEffect, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { companyName, companyNameSize } from '../config/config';
import {
    initialize,
    startDiscoveringPeers,
    stopDiscoveringPeers,
    subscribeOnConnectionInfoUpdates,
    subscribeOnThisDeviceChanged,
    subscribeOnPeersUpdates,
    connect,
    cancelConnect,
    createGroup,
    removeGroup,
    getAvailablePeers,
    sendFile,
    receiveFile,
    getConnectionInfo,
    getGroupInfo,
    receiveMessage,
    sendMessage,
} from 'react-native-wifi-p2p';
import { subscribeOnEvent } from 'react-native-wifi-p2p';
const Home = () => {
    const [devices, setDevices] = useState([]);
    useEffect(() => {
        const setupWifi = async () => {
            try {
                await initialize();
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
                    {
                        title: 'Access to wi-fi P2P mode',
                        message: 'ACCESS_COARSE_LOCATION',
                    }
                );
                console.log(
                    granted === PermissionsAndroid.RESULTS.GRANTED
                        ? 'You can use the p2p mode'
                        : 'Permission denied: p2p mode will not work'
                );
                const peersUpdatesSubscription = subscribeOnPeersUpdates(handleNewPeers);
                const connectionInfoUpdatesSubscription = subscribeOnConnectionInfoUpdates(
                    handleNewInfo
                );
                const thisDeviceChangedSubscription = subscribeOnThisDeviceChanged(
                    handleThisDeviceChanged
                );
                const status = await startDiscoveringPeers();
                console.log('startDiscoveringPeers status: ', status);
                return () => {
                    peersUpdatesSubscription.remove();
                    connectionInfoUpdatesSubscription.remove();
                    thisDeviceChangedSubscription.remove();
                };
            } catch (e) {
                console.error(e);
            }
        };
        setupWifi();
    }, []);
    const handleNewInfo = (info) => {
        console.log('OnConnectionInfoUpdated', info);
    };

    const handleNewPeers = ({ devices }) => {
        console.log('OnPeersUpdated', devices);
        setDevices(devices);
    };
    const handleThisDeviceChanged = (groupInfo) => {
        console.log('THIS_DEVICE_CHANGED_ACTION', groupInfo);
    };
    const connectToFirstDevice = () => {
        console.log('Connect to: ', devices[0]);
        connect(devices[0].deviceAddress)
            .then(() => console.log('Successfully connected'))
            .catch((err) => console.error('Something gone wrong. Details: ', err));
    };
    const onCancelConnect = () => {
        cancelConnect()
            .then(() => console.log('cancelConnect', 'Connection successfully canceled'))
            .catch((err) =>
                console.error('cancelConnect', 'Something gone wrong. Details: ', err)
            );


    };
    const onCreateGroup = () => {
        createGroup()
            .then(() => console.log('Group created successfully!'))
            .catch((err) => console.error('Something gone wrong. Details: ', err));
    };
    const onRemoveGroup = () => {
        removeGroup()
            .then(() => console.log("Currently you don't belong to group!"))
            .catch((err) => console.error('Something gone wrong. Details: ', err));
    };
    const onStopInvestigation = () => {
        stopDiscoveringPeers()
            .then(() => console.log('Stopping of discovering was successful'))
            .catch((err) =>
                console.error(
                    `Something is gone wrong. Maybe your WiFi is disabled? Error details`,
                    err
                )
            );
    };

    const onStartInvestigate = () => {
        startDiscoveringPeers()
            .then((status) =>
                console.log('startDiscoveringPeers', `Status of discovering peers: ${status}`)
            )
            .catch((err) =>
                console.error(
                    `Something is gone wrong. Maybe your WiFi is disabled? Error details: ${err}`
                )
            );
    };
    const onGetAvailableDevices = () => {
        getAvailablePeers().then((peers) => console.log(peers));
    };
    const onSendFile = () => {
        const url = '/storage/emulated/0/Music/Bullet For My Valentine:Letting You Go.mp3';
        PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE, {
            title: 'Access to read',
            message: 'READ_EXTERNAL_STORAGE',
        })
            .then((granted) => {
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    console.log('You can use the storage');
                } else {
                    console.log('Storage permission denied');
                }
            })
            .then(() => {
                return PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE, {
                    title: 'Access to write',
                    message: 'WRITE_EXTERNAL_STORAGE',
                });
            })
            .then(() => {
                return sendFile(url)
                    .then((metaInfo) => console.log('File sent successfully', metaInfo))
                    .catch((err) => console.log('Error while file sending', err));
            })
            .catch((err) => console.log(err));
    };

    const onReceiveFile = () => {
        PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE, {
            title: 'Access to read',
            message: 'READ_EXTERNAL_STORAGE',
        })
            .then((granted) => {
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    console.log('You can use the storage');
                } else {
                    console.log('Storage permission denied');
                }
            })
            .then(() => {
                return PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE, {
                    title: 'Access to write',
                    message: 'WRITE_EXTERNAL_STORAGE',
                });
            })
            .then(() => {
                return receiveFile('/storage/emulated/0/Music/', 'BFMV:Letting You Go.mp3')
                    .then(() => console.log('File received successfully'))
                    .catch((err) => console.log('Error while file receiving', err));
            })
            .catch((err) => console.log(err));
    };

    const onSendMessage = () => {
        sendMessage('Hello world!')
            .then((metaInfo) => console.log('Message sent successfully', metaInfo))
            .catch((err) => console.log('Error while message sending', err));
    };

    const onReceiveMessage = () => {
        receiveMessage()
            .then((msg) => console.log('Message received successfully', msg))
            .catch((err) => console.log('Error while message receiving', err));
    };

    const onGetConnectionInfo = () => {
        getConnectionInfo().then((info) => console.log('getConnectionInfo', info));
    };
    const onGetGroupInfo = () => {
        getGroupInfo().then((info) => console.log('getGroupInfo', info));
    };
    const permission = async () => {
        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
                title: 'Location permission is required for WiFi connections',
                message:
                    'This app needs location permission as this is required  ' +
                    'to scan for wifi networks.',
                buttonNegative: 'DENY',
                buttonPositive: 'ALLOW',
            },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            // You can now use react-native-wifi-reborn
        } else {
            // Permission denied
            Alert.alert("Please Give The Location Permision To Use This App!");
        }
    }
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
    // useEffect(() => {
    //     if (route.params?.disconnect !== undefined && route.params?.disconnect === true) {
    //         // do nothing
    //     } else {
    //         WifiManager.connectionStatus().then((data) => {
    //             console.log(data);
    //             if (data === true) {
    //                 navigation.navigate("ScannedDetails")
    //             }
    //         }).catch((err) => {
    //             console.log(err);
    //         })
    //     }
    // }, [])
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