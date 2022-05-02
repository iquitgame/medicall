import React, {useState, useCallback, useEffect} from 'react';
//There's a weird bug that AgoraUIKit doesn't load properly. Looking into this
//Follow these instructions:
//https://www.agora.io/en/blog/building-a-video-calling-app-using-the-agora-sdk-on-expo-react-native/
//expo prebuild for the android/ios files
//expo run:android
import AgoraUIKit from 'agora-rn-uikit';
import {
    Dimensions, 
    StyleSheet,
    Text,
    View,
    TouchableOpacity,} from 'react-native';
import axios from 'axios';
//if error is thrown on firebase/app line, it's cuz google broke a thing. Need to downgrade firebase version to 9.6.7
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, child, get } from 'firebase/database';
import { LineChart } from "react-native-chart-kit";
//was originally doing this with import, but had to revert to old version
//new version uses crypto module to get crypto-secure random numbers
var AES = require("crypto-js/aes");
var CryptoJS = require("crypto-js");
import { BleManager, Device, Service, Characteristic } from 'react-native-ble-plx';
import { Buffer } from 'buffer';

import styles from './components/style';
import { Base64 } from './base64';

const bleManager = new BleManager();

const decodeBleString = (value) => {
  if (!value) {
    return '';
  }
  return Base64.decode(value).charCodeAt(0);
}

const rtcProps = {
    appId: '08abc2d5356748b4841342daedf162e0',
    token: null,
    // token: '00608abc2d5356748b4841342daedf162e0IAApUOZX749bDv57QfZLltdi49eAs8AfSusHjLr73ojKUQx+f9gAAAAAEACEYx7Aj0wTYgEAAQCPTBNi',
    channel: 'test',
    uid: (Math.round(Date.now() /1000)),
  };

  const firebaseConfig = {
    apiKey: "AIzaSyAhVF1aPxhN72VzzJLZx0yfn-ikIc-FCso",
    authDomain: "medicall-42b5f.firebaseapp.com",
    databaseURL: 'https://medicall-42b5f-default-rtdb.firebaseio.com/',
    projectId: "medicall-42b5f",
    storageBucket: "medicall-42b5f.appspot.com",
    messagingSenderId: "435023579739",
    appId: '1:435023579739:web:4851b799a91532c098cd7e',
    measurementId: 'G-YVXX610Z68',
  };
  
  initializeApp(firebaseConfig);

const App = () => {

  // console.log(rtcProps.uid)
  const [videoCall, setVideoCall] = useState(false);
  const [isHost, setIsHost] = useState(false);
  const [recording, setRecording] = useState(false);
  const [state, setState] = useState({'data':''});
  const [devices, setDevices] = useState([]);
  const [device, setDevice] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [services, setServices] = useState([]);
  const [service, setService] = useState(null);
  const [characteristics, setCharacteristics] = useState([]);

  const disconnectDevice = useCallback(async () => {
    const isDeviceConnected = await devices.isConnected();
    if (isDeviceConnected) {
      await device?.cancelConnection();
    }
  }, [device])

  useEffect(() => {
    if(device === null){
      return;
    }

    const getDeviceInformations = async () => {
      const connectedDevice = await device.connect();
      setIsConnected(true);
      const allServicesAndCharacteristics = await connectedDevice.discoverAllServicesAndCharacteristics();
      const discoveredServices = await allServicesAndCharacteristics.services();
      setServices(discoveredServices);
      //TODO: figure out service we want and setService, which will trigger getCharacteristic
    };

    getDeviceInformations();

    device.onDisconnected(() => {
      console.log("device disconnected");
    });

    return () => {
      disconnectDevice();
    };
  }, [device, disconnectDevice])

  useEffect(() => {
    const getCharacteristics = async() => {
      const newCharacteristics = await service.characteristics()
      setCharacteristics(newCharacteristics);
      //TODO: figure out characteristic we want and setCharacteristic, which we can monitor and get value
    }
    getCharacteristics();
  }, [service]);

  const blankData = {
    labels: ["00:00:00", "00:00:30", "00:01:00", "00:01:30", "00:02:00", "00:02:30"],
    datasets: [
      {
        data: [
          Math.random() * 100.0,
          Math.random() * 100.0,
          Math.random() * 100.0,
          Math.random() * 100.0,
          Math.random() * 100.0,
          Math.random() * 100.0
        ]
      },
      {
        data: [0,0,0,0,0,0],
        color: ()=> 'transparent', 
        strokeWidth: 0, 
        withDots: false, 
      },
      {
        data: [100,100,100,100,100,100],
        color: ()=> 'transparent', 
        strokeWidth: 0, 
        withDots: false, 
      }
    ]
  }

  function recordData() {
    console.log("recordData()");

    //If recording, stop and return.
    if(recording === true){
      setRecording(false);
      bleManager.stopDeviceScan();
      console.log("stop scanning");
      return;
    }

    //if not recording, start scanning.


    bleManager.startDeviceScan(null, null, (error, scannedDevice) => {
      if (error) {
        console.warn(error);
      }

      // console.log(scannedDevice);
      //Eventually I should just check for our bluetooth module and only accept that.
      if(scannedDevice.name !== null){
        setDevices([...devices,scannedDevice]);

        console.log('id:',scannedDevice.id);
        console.log('name',scannedDevice.name);
        console.log('rssi',scannedDevice.rssi);
        //no point, decoded is still a mess
        // console.log('manufacturer:', Base64.decode(scannedDevice.manufacturerData?.replace(/[=]/g, ''),));
        // console.log('serviceData:',scannedDevice.serviceData);
        console.log('serviceData');
        for(const key in scannedDevice.serviceData){
          console.log(`${key}: ${Base64.decode(scannedDevice.serviceData[key],)}`);
        }
        console.log('UUIDS:',scannedDevice.UUIDs);
        // bleManager.stopDeviceScan();
      }
    });

    setTimeout(() => {
      bleManager.stopDeviceScan();
      console.log("stop scanning");
    }, 5000);

    setRecording(!recording);
    const data = {
      'data': 'filled',
      'spo2': 
      {
        labels: ["00:00:00", "", "", "", "", "00:02:30"],
        datasets: 
        [
          {
            data: [99.5, 95.0, 96.0, 98.0, 99.5, 98.0]
          },
          {
            data: [0,0,0,0,0,0],
            color: ()=> 'transparent', 
            strokeWidth: 0, 
            withDots: false, 
          },
          {
            data: [100,100,100,100,100,100],
            color: ()=> 'transparent', 
            strokeWidth: 0, 
            withDots: false, 
          }
        ]
      },
      'hr': 70,
      'bp_s': 120,
      'bp_d': 80,
      'temp': 98.6,
    };
    setState(data);
  }

  const fetchToken = () => {
    let url = `https://ub-medicall.herokuapp.com/rtc/${rtcProps.channel}/1/uid/${rtcProps.uid}/?100000`;
    // let url = `https://ub-medicall.herokuapp.com/rtc/${rtcProps.channel}/1/userAccount/${rtcProps.appId}/?100000`;
    // let options = {

    // }
    // console.log(url)
    axios.get(url)
    .then(function (response) {
        let data = response['data']
        let token = data['rtcToken']
        if(rtcProps.token == null){
            rtcProps.token = token
        }
    })
    .catch(function (err){
        console.log(err)
    })
  }
  fetchToken()

  async function transmitData() {
    console.log('transmitData');
    try {
      const db = getDatabase();
      const reference = ref(db, 'channel/' + rtcProps.channel);
      console.log('transmitted: ', state);
      const encrypted = AES.encrypt(JSON.stringify(state), 'secret key 123').toString();
      set(reference, encrypted);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  }

  async function getData() {
    console.log('getData');
    const db = getDatabase();
    const reference = ref(db);

    get(child(reference, 'channel/' + rtcProps.channel)).then((snapshot) => {
      if (snapshot.exists()) {
        console.log(snapshot.val())
        const bytes = AES.decrypt(snapshot.val(), 'secret key 123');
        const plaintext = bytes.toString(CryptoJS.enc.Utf8);
        console.log('decoded: ',plaintext);
        setState(JSON.parse(plaintext));
      } else {
        console.log("No data available");
      }
    }).catch((error) => {
      console.error(error);
    });
  }
  
  const callbacks = {
    EndCall: () => setVideoCall(false),
    // LocalMuteAudio: (muted) => alert('audio muted: ' + muted),
    // LocalMuteVideo: (muted) => alert('video muted: ' + muted),
    // SwitchCamera: () => alert('switch camera'),
  };

  return videoCall ? (
    <AgoraUIKit rtcProps={rtcProps} callbacks={callbacks} />
    ) : (
      <View style={styles.container}>

        <TouchableOpacity onPress={() => setIsHost(!isHost)} style={styles.clickableText}>
            <Text style={styles.greeting}> Welcome to Medicall, {isHost ? 'Doctor' : 'user'}.</Text>
        </TouchableOpacity>

        <View style={styles.dataContainer}>
          <Text>Blood Oxygen Levels (%)</Text>
          <LineChart
            data={state.data === '' ? blankData : state.spo2}
            width={Dimensions.get("window").width-40} //40 is from border
        
            height={200}
            chartConfig={
              {
                backgroundColor: "#ffffff",
                backgroundGradientFrom: "#ffffff",
                backgroundGradientTo: "#ffffff",
                backgroundGradientFromOpacity: 0,
                decimalPlaces: 1,
                color: (opacity = 1) => `rgba(0,0,0,${opacity})`,
                labelColor: (opacity = 1) => `rgba(0,0,0,${opacity})`,
                style: {borderRadius: 16}
              }
            }
          />
          <Text>Heart rate: {state.data === '' ? '00' : state.hr} bpm</Text>
          <Text>Blood pressure: {state.data === '' ? '000' : state.bp_s} / {state.data === '' ? '000' : state.bp_d}</Text>
          <Text>Body Temperature: {state.data === '' ? '00.0' : state.temp}{'\u00b0'}</Text>
          {/* <Text>{JSON.stringify(state)}</Text> */}
        </View>

        <View style={styles.buttonContainer}>
          {!isHost ? <TouchableOpacity onPress={() => recordData()} style={styles.button}>
            <Text style={styles.buttonText}> {recording ? 'Stop' : 'Record'} </Text>
            </TouchableOpacity> : null}          
          <View style={styles.spacer}></View>
          <TouchableOpacity onPress={() => isHost ? getData() : transmitData()} style={styles.button}>
              <Text style={styles.buttonText}> {isHost ? 'Receive' : 'Transmit'} </Text>
          </TouchableOpacity>
          <View style={styles.spacer}></View>
          <TouchableOpacity onPress={ () => {
              setVideoCall(true);
              console.log(rtcProps);
              const d = new Date();
              const time = "ms: " + d.getMinutes() + ":" + d.getSeconds() + "." + d.getMilliseconds();
              console.log(time);
            }} style={styles.button}>
            <Text style={styles.buttonText}> Start Call </Text>
          </TouchableOpacity>
        </View>

      </View>
    )
};

export default App;