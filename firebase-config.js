// firebase-config.js
// Firebase Setup using Compat CDN

const firebaseConfig = {
  apiKey: "AIzaSyBhZMcU6iV79rzwDOayB8W14YddVHnwxxc",
  authDomain: "technet-14b4a.firebaseapp.com",
  projectId: "technet-14b4a",
  storageBucket: "technet-14b4a.firebasestorage.app",
  messagingSenderId: "375535207384",
  appId: "1:375535207384:web:121527e4da3699e61f28ad"
};

let app;
let auth;
let db;
let storage;

try {
  app = firebase.initializeApp(firebaseConfig);
  auth = firebase.auth();
  db = firebase.firestore();
  if (firebase.storage) {
    storage = firebase.storage();
  }
  db.settings({
    experimentalForceLongPolling: true,
    useFetchStreams: false
  });
  console.log("Firebase initialized successfully with live config.");
} catch (error) {
  console.error("Firebase initialization error:", error);
}
