import React, {useState} from 'react';
//There's a weird bug that AgoraUIKit doesn't load properly. Looking into this
//Follow these instructions:
//https://www.agora.io/en/blog/building-a-video-calling-app-using-the-agora-sdk-on-expo-react-native/
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

import styles from './components/style';



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

  console.log(rtcProps.uid)
  const [videoCall, setVideoCall] = useState(false);
  const [isHost, setIsHost] = useState(false);
  const [recording, setRecording] = useState(false);
  const [state, setState] = useState({'Data':'Empty'})

  function recordData() {
    setRecording(!recording);
    const data = {
      'spo2': 1234,
      'hr': 70,
      'bp_s': 120,
      'bp_d': 120,
      'temp': 98.6,
    };
    setState(data);
  }

  const fetchToken = () => {
    let url = `https://ub-medicall.herokuapp.com/rtc/${rtcProps.channel}/1/uid/${rtcProps.uid}/?100000`;
    // let url = `https://ub-medicall.herokuapp.com/rtc/${rtcProps.channel}/1/userAccount/${rtcProps.appId}/?100000`;
    // let options = {

    // }
    console.log(url)
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
      set(reference, state);
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
        setState(snapshot.val());
        console.log(snapshot.val());
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
        <View style={styles.buttonContainer}>
          {!isHost ? <TouchableOpacity onPress={() => recordData()} style={styles.button}>
            <Text style={styles.buttonText}> {recording ? 'Stop' : 'Record'} </Text>
            </TouchableOpacity> : null}          
          <View style={styles.spacer}></View>
          <TouchableOpacity onPress={() => isHost ? getData() : transmitData()} style={styles.button}>
              <Text style={styles.buttonText}> {isHost ? 'Receive' : 'Transmit'} </Text>
          </TouchableOpacity>
          <View style={styles.spacer}></View>
          <TouchableOpacity onPress={ () => {setVideoCall(true); console.log(rtcProps)}} style={styles.button}>
            <Text style={styles.buttonText}> Start Call </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.dataContainer}>
          <Text>{JSON.stringify(state)}</Text>
        </View>
      </View>
    )
};

export default App;