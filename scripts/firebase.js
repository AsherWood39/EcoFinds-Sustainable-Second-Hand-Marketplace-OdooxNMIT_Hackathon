// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { 
	getAuth,
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
} from "firebase/auth";
import {
	getFirestore,
	doc,
	setDoc,
	serverTimestamp} from "firebase/firestore";
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
	apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
	authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
	projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
	storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
	messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
	appId: import.meta.env.VITE_FIREBASE_APP_ID,
	measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

// Attach login and signup functions to window for use in HTML forms
window.firebaseLogin = async function(email, password) {
  const user = await loginUser(email, password);
  window.location.href = "home.html";
  return user;
};

window.firebaseSignup = async function(email, password, role, name) {
  // Create user with email and password
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;
  // Save user info to Firestore, including role and name
  await setDoc(doc(db, "users", user.uid), {
    email,
    role,
    name,
    createdAt: serverTimestamp(),
    lastLogin: serverTimestamp(),
    emailVerified: user.emailVerified
  });
    window.location.href = "home.html";
  return userCredential;
};

document.addEventListener('DOMContentLoaded', function() {
  const signupForm = document.getElementById('signupForm');
  if (signupForm) {
    signupForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      const email = document.getElementById('signupEmail').value;
      const password = document.getElementById('signupPassword').value;
      const role = document.getElementById('signupRole').value;
      const name = document.getElementById('signupName') ? document.getElementById('signupName').value : '';
      const errorDiv = document.getElementById('signupError');
      errorDiv.textContent = '';
      if (!role) {
        errorDiv.textContent = 'Please select a role.';
        return;
      }
      if (!name) {
        errorDiv.textContent = 'Please enter your name.';
        return;
      }
      try {
        const userCredential = await window.firebaseSignup(email, password, role, name);
        localStorage.setItem('userRole', role);
    // Redirect handled in firebaseSignup
      } catch (err) {
        errorDiv.textContent = err.message || 'Signup failed.';
      }
    });
  }
});

document.addEventListener('DOMContentLoaded', function() {
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      const email = document.getElementById('loginEmail').value;
      const password = document.getElementById('loginPassword').value;
      const errorDiv = document.getElementById('loginError');
      errorDiv.textContent = '';
  // No role check needed for login
      try {
        const userCredential = await window.firebaseLogin(email, password);
    // Redirect handled in firebaseLogin
      } catch (err) {
        errorDiv.textContent = err.message || 'Login failed.';
      }
    });
  }
});

export async function loginUser(email, password, rememberMe = false) {
  try {
    console.log("Logging in user with email:", email);
    if (typeof setAuthPersistence === 'function') {
      await setAuthPersistence(rememberMe);
    }
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    try {
      await updateLastLogin(user.uid);
    } catch (err) {
      console.error("Error updating last login:", err);
    }
    return user;
  } catch (error) {
    console.error("Error signing in user:", error);
    throw error;
  }
}
