import { StatusBar } from 'expo-status-bar';
import React, {useState, Component} from 'react';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { getAuth, onAuthStateChanged, GoogleAuthProvider, signInWithCredential, signInWithRedirect, getRedirectResult, PhoneAuthProvider} from 'firebase/auth';
import { initializeApp, getApp } from 'firebase/app';
import { StyleSheet, Text, View, Button, TextInput, ActivityIndicator, Platform} from 'react-native';
// import { auth, firebaseConfig } from './firebase';
import * as FirebaseRecaptcha from 'expo-firebase-recaptcha';
import 'expo-dev-client';
import AgoraUIKit, {PropsInterface} from 'agora-rn-uikit';
import RtcEngine, {
  RtcLocalView,
  RtcRemoteView,
  VideoRenderMode,
  ClientRole,
  ChannelProfile,
} from 'react-native-agora'

import requestCameraAndAudioPermission from './component/Permission';


// const token = 1684f4e8a4b046b0befdd03ee1b70845;
const token = '00608abc2d5356748b4841342daedf162e0IACH6uG8V7vW9l4mhlxtro+7eDk6TMw0sUV9ygArKU/lfwx+f9gAAAAAEACEYx7ARcsSYgEAAQBFyxJi';
const appId = '08abc2d5356748b4841342daedf162e0';
const channelName = 'test';

  // let reference;
  // let username = '';




  let onCallPress = () => {
    setVideoCall(true);
    // alert("You pressed Call Doctor");
  }

  let onRecordPress = () => {
    alert("You pressed Record Data");
  }

  let onOCRPress = () => {
    alert("You pressed Use OCR");
  }

  return (
    <View style={styles.container}>
      <Text>Welcome to Medicall{username === '' ? '' : ', ' + JSON.stringify(username)}</Text>
      <View style={styles.buttonContainer}>
        <Button
          // disabled={user}
          onPress={onCallPress}
          title="Call Doctor"
        />
      </View>
      <View style={styles.buttonContainer}>
        <Button
          onPress={onRecordPress}
          title="Record Data"
        />
      </View>
      <View style={styles.buttonContainer}>
        <Button
          onPress={onOCRPress}
          title="Use OCR"
        />
      </View>
      <View style={styles.buttonContainer}>
        <Button
          disabled={username !== ''}
          title="Login"
          onPress={() => {
            handleLogin();
            // promptAsync();
          }}
        />
      </View>
      {this._renderVideos()}
    </View>
  );

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: '#005bbb',
    borderWidth: 20,
  },
  buttonContainer: {
    margin: 20
  },
});
