import { initializeApp } from "firebase/app";
import {
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "firebase/auth";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCSbHhLcBH4SAoPiYXsdmi5iR9FRbFmedI",
  authDomain: "gkp360-1d354.firebaseapp.com",
  projectId: "gkp360-1d354",
  storageBucket: "gkp360-1d354.firebasestorage.app",
  messagingSenderId: "1061962480086",
  appId: "1:1061962480086:web:63422f500cc16460b9cc77",
  measurementId: "G-0VSRKC7L9N",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Setup reCAPTCHA
export const setupRecaptcha = () => {
  if (typeof window !== "undefined") {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        "recaptcha-container", // Match your container ID
        {
          size: "invisible",
          callback: (response) => {
            console.log("ReCAPTCHA solved:", response);
          },
          "expired-callback": () => {
            console.warn("ReCAPTCHA expired. Please try again.");
          },
        },
        auth
      );
    }
  }
};

// Function to send OTP
export const sendOtp = async (mobile) => {
  try {
    setupRecaptcha();
    const appVerifier = window.recaptchaVerifier;

    const formattedMobile = `+91${mobile.trim()}`; // Format the phone number
    const confirmationResult = await signInWithPhoneNumber(
      auth,
      formattedMobile,
      appVerifier
    );

    console.log("OTP sent successfully:", confirmationResult);
    return { success: true, verificationId: confirmationResult.verificationId };
  } catch (error) {
    console.error("Error sending OTP:", error.message);
    return { success: false, error: error.message };
  }
};

export { auth };
