import React, {useState, Component} from 'react';
import RtcEngine, { RtcEngineContext } from 'react-native-agora';
import AgoraUIKit from 'agora-rn-uikit';
import {
    Dimensions, 
    StyleSheet,
    Text,
    View,
    TouchableOpacity,} from 'react-native';

import requestCameraAndAudioPermission from './components/permission';
import styles from './components/style';

// const dimensions = {
//     width: Dimensions.get('window').width,
//     height: Dimensions.get('window').height,
// }

export default class App extends Component {

    constructor(props) {
        super(props);
        this.rtcProps = {
            // token: '00608abc2d5356748b4841342daedf162e0IACH6uG8V7vW9l4mhlxtro+7eDk6TMw0sUV9ygArKU/lfwx+f9gAAAAAEACEYx7ARcsSYgEAAQBFyxJi',
            appId: '08abc2d5356748b4841342daedf162e0',
            channelName: 'test',
        };
        this.state = {
            videoCall: false,
            isHost: false,
            recordData: false,
            isJoined: false,
        }
        this._engine;
    }
    componentDidMount() {
        this.init();
    }
    componentWillUnmount() {
        this._engine?.destroy();
    }

    init = async() => {
        // this._engine = await RtcEngine.createWithContext(
        //     new RtcEngineContext(this.rtcProps.appId)
        // );
        this._engine = await RtcEngine.create(this.rtcProps.appId);
        
        alert('debug2 ' + JSON.stringify(this._engine, null, 2));

        this._addListeners();
    };

    _addListeners = () => {
        this._engine.addListener('Warning', (warningCode) => {
            console.info('Warning', warningCode);
        });
        this._engine.addListener('Error', (errorCode) => {
            console.info('Error', errorCode);
        });
        this._engine.addListener('JoinChannelSuccess', (channel, uid, elapsed) => {
            console.info('JoinChannelSuccess', channel, uid, elapsed);
            this.setState({ isJoined: true });
        });
        this._engine.addListener('LeaveChannel', (stats) => {
            console.info('LeaveChannel', stats);
            this.setState({ isJoined: false});
        });
    };

    // setVideoCall = (newVal) => {this.videoCall = newVal;};
    // setIsHost = (newVal) => {this.isHost = newVal;};
    // setRecordData = (newVal) => {this.recordData = newVal;};

    render() {
        if (Platform.OS === 'android') {
            // Request required permissions from Android
            requestCameraAndAudioPermission().then(() => {
              console.log('requested!');
            }).catch((error) => {alert(error)});
        }

        let callbacks = {
            EndCall: () => this.setState({videoCall: false}),
            LocalMuteAudio: (muted) => alert('audio muted: ' + muted),
            LocalMuteVideo: (muted) => alert('video muted: ' + muted),
            // SwitchCamera: () => alert('switch camera'),
            SwitchCamera: async () => {
                await this._engine?.switchCamera();
                // RtcEngine.switchCamera();
            },
    
        }

        return this.state.videoCall ? (
            <AgoraUIKit rtcProps={this.rtcProps} callbacks={callbacks} />
            ) : (
                <View style={styles.container}>
                <Text style={styles.greeting}>
                  Welcome to Medicall, {this.state.isHost ? 'Doctor' : 'user'}.
                </Text>
                <View style={styles.buttonContainer}>
                  <TouchableOpacity onPress={() => this.setState({isHost: !this.state.isHost})} style={styles.button}>
                    <Text style={styles.buttonText}> Toggle Role </Text>
                  </TouchableOpacity>
                  <View style={styles.spacer}></View>
                  <TouchableOpacity onPress={() => this.setState({recordData: !this.state.recordData})} style={styles.button}>
                      <Text style={styles.buttonText}> {this.state.recordData ? 'Stop' : 'Record'} </Text>
                  </TouchableOpacity>
                  <View style={styles.spacer}></View>
                  <TouchableOpacity onPress={ () => this.setState({videoCall: true})} style={styles.button}>
                    <Text style={styles.buttonText}> Start Call </Text>
                  </TouchableOpacity>
                  {/* <View style={styles.spacer}></View>
                  <TouchableOpacity onPress={endCall} style={styles.button}>
                    <Text style={styles.buttonText}> End Call </Text>
                  </TouchableOpacity> */}
                </View>
              </View>
            )


    }
    

}
// function App (){   

    

    
// }

// export default App;