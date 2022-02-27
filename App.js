import React, {useState} from 'react';
import AgoraUIKit from 'agora-rn-uikit';
import {
    Dimensions, 
    StyleSheet,
    Text,
    View,
    TouchableOpacity,} from 'react-native';
import axios from 'axios';

import styles from './components/style';



const rtcProps = {
    appId: '08abc2d5356748b4841342daedf162e0',
    token: null,
    // token: '00608abc2d5356748b4841342daedf162e0IAApUOZX749bDv57QfZLltdi49eAs8AfSusHjLr73ojKUQx+f9gAAAAAEACEYx7Aj0wTYgEAAQCPTBNi',
    channel: 'test',
    uid: (Math.round(Date.now() /1000)),
  };

const App = () => {

    console.log(rtcProps.uid)
  const [videoCall, setVideoCall] = useState(false);
  const [isHost, setIsHost] = useState(false);
  const [recordData, setRecordData] = useState(false);

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
        <Text style={styles.greeting}>
          Welcome to Medicall, {isHost ? 'Doctor' : 'user'}.
        </Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={() => setIsHost(!isHost)} style={styles.button}>
            <Text style={styles.buttonText}> Toggle Role </Text>
          </TouchableOpacity>
          <View style={styles.spacer}></View>
          <TouchableOpacity onPress={() => setRecordData(!recordData)} style={styles.button}>
              <Text style={styles.buttonText}> {recordData ? 'Stop' : 'Record'} </Text>
          </TouchableOpacity>
          <View style={styles.spacer}></View>
          <TouchableOpacity onPress={ () => {setVideoCall(true); console.log(rtcProps)}} style={styles.button}>
            <Text style={styles.buttonText}> Start Call </Text>
          </TouchableOpacity>
        </View>
      </View>
    )
};

export default App;