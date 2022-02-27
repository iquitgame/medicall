import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { Platform } from 'react-native';

const androidConfig = {
    apiKey: "AIzaSyAhVF1aPxhN72VzzJLZx0yfn-ikIc-FCso",
    authDomain: "medicall-42b5f.firebaseapp.com",
    projectId: "medicall-42b5f",
    storageBucket: "medicall-42b5f.appspot.com",
    messagingSenderId: "435023579739",
    appId: "1:435023579739:android:0e9aee988d793b5098cd7e",
};

const iosConfig = {
    apiKey: "AIzaSyAhVF1aPxhN72VzzJLZx0yfn-ikIc-FCso",
    authDomain: "medicall-42b5f.firebaseapp.com",
    projectId: "medicall-42b5f",
    storageBucket: "medicall-42b5f.appspot.com",
    messagingSenderId: "435023579739",
    appId: "1:435023579739:ios:54017b51dfc30d8398cd7e",
};

const webConfig = {
    apiKey: "AIzaSyDPQItzUORf9Y9AdIZ7O74uOyF9WGSDsmg",
    authDomain: "medicall-42b5f.firebaseapp.com",
    projectId: "medicall-42b5f",
    storageBucket: "medicall-42b5f.appspot.com",
    messagingSenderId: "435023579739",
    appId: "1:435023579739:web:4851b799a91532c098cd7e",
    measurementId: "G-YVXX610Z68"
};
  
let config;
if (Platform.OS === 'android'){
    config = androidConfig;
}
else if(Platform.OS === 'ios'){
    config = iosConfig;
}
else {//(Platform.OS === 'web'){
    config = webConfig;
}

// let app;
// if (firebase.apps.length === 0){
//     app = firebase.initializeApp(firebaseConfig);
// }
// else{
//     app = firebase.app()
// }
const firebaseConfig = config;

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const firebaseConfig;
// export const db = getFirestore(app);