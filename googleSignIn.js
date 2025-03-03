// Import the necessary Firebase functions
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.0/firebase-app.js';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'https://www.gstatic.com/firebasejs/9.6.0/firebase-auth.js';

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAVaHggK9BekkWiK4JlKOIXeHYcxtg_KuI",
  authDomain: "event-management-f4ea3.firebaseapp.com",
  projectId: "event-management-f4ea3",
  storageBucket: "event-management-f4ea3.firebasestorage.app",
  messagingSenderId: "8810104526",
  appId: "1:8810104526:web:4059e923527fc483eef29f",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Function to sign in with Google and get the ID Token
const signInWithGoogle = async () => {
  try {
    const googleProvider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, googleProvider);

    // User Info
    const user = result.user;
    console.log("User Info:", user);

    // Fetch ID Token
    const idToken = await user.getIdToken();
    console.log("ID Token:", idToken);

    // Display success message
    alert(`Signed in successfully as ${user.displayName}`);

    // Send token to backend
    await sendToBackend(idToken);
  } catch (error) {
    console.error("Error signing in with Google:", error);
    alert("Sign-in failed! Check console for details.");
  }
};

// Function to send ID Token to backend
const sendToBackend = async (idToken) => {
  try {
      const response = await fetch("http://172.20.10.6:4000/api/users/google-login", {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
          },
          body: JSON.stringify({ idToken }),
      });

      const data = await response.json(); // Parse JSON response
      console.log("Backend Response:", data);

      if (!response.ok) {
          throw new Error(data.message || "Backend authentication failed!");
      }

      alert("Login Successful!"); // Show success message
      localStorage.setItem("token", data.token); // Store token for future use

  } catch (error) {
      console.error("Error:", error);
      alert(error.message);
  }
};


// Set up event listener for the button
document.getElementById("googleSignInBtn").addEventListener("click", signInWithGoogle);