import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  KeyboardAvoidingView,
  Image,
  Dimensions,
  Platform,
  ScrollView,
  Modal,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "expo-router";
import axios from "axios";
import { BASE_URL } from "@env";
import * as WebBrowser from 'expo-web-browser';

interface AxiosError {
  response?: {
    data: {
      message: string;
    };
  };
  message: string;
}

export default function SignupScreen() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [emailOtp, setEmailOtp] = useState("");
  const [phoneOtp, setPhoneOtp] = useState("");
  const [emailVerified, setEmailVerified] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [emailOtpInput, setEmailOtpInput] = useState("");
  const [phoneOtpInput, setPhoneOtpInput] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [message, setMessage] = useState("");
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);

  const navigation = useNavigation();

  const closeConfirmationModal = () => {
    setIsConfirmationOpen(false);
    if (message === "Registered successfully") {
      navigation.navigate("LoginPage" as never);
    }
  };

  const handleSignup = async () => {
    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
      setIsConfirmationOpen(true);
      return;
    }

    if (password.length < 8) {
      setMessage("Password must be at least 8 characters long.");
      setIsConfirmationOpen(true);
      return;
    }

    if (!emailVerified || !phoneVerified) {
      setMessage("Please verify your email and phone before signing up");
      setIsConfirmationOpen(true);
      return;
    }

    if (!acceptTerms) {
      setMessage("You must accept the privacy policy and terms and conditions.");
      setIsConfirmationOpen(true);
      return;
    }

    try {
      await axios.post(`${BASE_URL}/api/register`, {
        name: fullName,
        email,
        phone,
        password,
      });
      setMessage("Registered successfully");
      setIsConfirmationOpen(true);
    } catch (error: unknown) {
      const err = error as AxiosError;
      if (err.response?.data?.message) {
        setMessage(err.response.data.message);
      } else {
        setMessage("Signup failed: " + err.message);
      }
      setIsConfirmationOpen(true);
    }
  };

  const verifyEmail = async () => {
    try {
      const response = await axios.post<{ otp: any }>(`${BASE_URL}/api/verify-email`, { email });
      setEmailOtp(response.data.otp);
      setMessage("OTP sent successfully to email");
      setIsConfirmationOpen(true);
    } catch (error: unknown) {
      const err = error as AxiosError;
      setMessage("Failed to send email OTP: " + (err?.response?.data?.message || err.message));
      setIsConfirmationOpen(true);
    }
  };

  const verifyPhone = async () => {
    try {
      const response = await axios.post<{ otp: any }>(`${BASE_URL}/api/verify-phone`, { phone });
      setPhoneOtp(response.data.otp);
      setMessage("OTP sent successfully to phone");
      setIsConfirmationOpen(true);
    } catch (error: unknown) {
      const err = error as AxiosError;
      setMessage("Failed to send phone OTP: " + (err?.response?.data?.message || err.message));
      setIsConfirmationOpen(true);
    }
  };

  const handleEmailOtpVerification = () => {
    if (emailOtpInput === emailOtp) {
      setEmailVerified(true);
      setMessage("Email verified successfully");
      setIsConfirmationOpen(true);
    } else {
      setMessage("Invalid email OTP");
      setIsConfirmationOpen(true);
    }
  };

  const handlePhoneOtpVerification = () => {
    if (phoneOtpInput === phoneOtp) {
      setPhoneVerified(true);
      setMessage("Phone verified successfully");
      setIsConfirmationOpen(true);
    } else {
      setMessage("Invalid phone OTP");
      setIsConfirmationOpen(true);
    }
  };

  const handleGoogleSignup = async () => {
    await WebBrowser.openBrowserAsync(`${BASE_URL}/auth/google/callback`);
  };

  return (
    <ImageBackground
      source={require("../assets/images/loginbg.jpg")}
      style={styles.background}
      resizeMode="cover"
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.overlay}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.container}
          >
            <View style={styles.content}>
              <Text style={styles.logo}>MILESTONO</Text>

              <View style={styles.welcomeContainer}>
                <Text style={styles.welcomeText}>Welcome to MILESTONO,</Text>
                <Text style={styles.subText}>We're excited to welcome you!</Text>
              </View>

              <View style={styles.formContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Full Name"
                  placeholderTextColor="#999"
                  value={fullName}
                  onChangeText={setFullName}
                  autoCapitalize="words"
                />

                <View style={styles.verifyContainer}>
                  <TextInput
                    style={[styles.input, styles.verifyInput]}
                    placeholder="Email Address"
                    placeholderTextColor="#999"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    editable={!emailVerified}
                  />
                  {!emailVerified && (
                    <TouchableOpacity style={styles.verifyButton} onPress={verifyEmail}>
                      <Text style={styles.verifyButtonText}>Verify</Text>
                    </TouchableOpacity>
                  )}
                </View>

                {/* Email OTP Input */}
                {!emailVerified && emailOtp && (
                  <View style={styles.verifyContainer}>
                    <TextInput
                      style={[styles.input, styles.verifyInput]}
                      placeholder="Enter Email OTP"
                      placeholderTextColor="#999"
                      value={emailOtpInput}
                      onChangeText={setEmailOtpInput}
                      keyboardType="numeric"
                    />
                    <TouchableOpacity style={styles.verifyButton} onPress={handleEmailOtpVerification}>
                      <Text style={styles.verifyButtonText}>Verify OTP</Text>
                    </TouchableOpacity>
                  </View>
                )}

                {/* Phone Input & Verification */}
                <View style={styles.verifyContainer}>
                  <TextInput
                    style={[styles.input, styles.verifyInput]}
                    placeholder="Phone Number"
                    placeholderTextColor="#999"
                    value={phone}
                    onChangeText={setPhone}
                    keyboardType="phone-pad"
                    editable={!phoneVerified}
                  />
                  {!phoneVerified && (
                    <TouchableOpacity style={styles.verifyButton} onPress={verifyPhone}>
                      <Text style={styles.verifyButtonText}>Verify</Text>
                    </TouchableOpacity>
                  )}
                </View>

                {!phoneVerified && phoneOtp && (
                  <View style={styles.verifyContainer}>
                    <TextInput
                      style={[styles.input, styles.verifyInput]}
                      placeholder="Enter Phone OTP"
                      placeholderTextColor="#999"
                      value={phoneOtpInput}
                      onChangeText={setPhoneOtpInput}
                      keyboardType="numeric"
                    />
                    <TouchableOpacity style={styles.verifyButton} onPress={handlePhoneOtpVerification}>
                      <Text style={styles.verifyButtonText}>Verify OTP</Text>
                    </TouchableOpacity>
                  </View>
                )}

                <View style={styles.passwordContainer}>
                  <TextInput
                    style={[styles.input, styles.passwordInput]}
                    placeholder="Create Password"
                    placeholderTextColor="#999"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                  />
                  <TouchableOpacity
                    style={styles.eyeIcon}
                    onPress={() => setShowPassword(!showPassword)}
                  >
                    <Feather name={showPassword ? "eye" : "eye-off"} size={22} color="#999" />
                  </TouchableOpacity>
                </View>

                <TextInput
                  style={styles.input}
                  placeholder="Confirm Password"
                  placeholderTextColor="#999"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showPassword}
                />

                <View style={styles.termsContainer}>
                  <TouchableOpacity
                    style={[styles.checkbox, acceptTerms && styles.checkboxChecked]}
                    onPress={() => setAcceptTerms(!acceptTerms)}
                  >
                    {acceptTerms && <Feather name="check" size={14} color="#1a237e" />}
                  </TouchableOpacity>
                  <Text style={styles.termsText}>
                    I accept the{" "}
                    <TouchableOpacity>
                      <Text style={styles.linkText}>Privacy Policy</Text>
                    </TouchableOpacity>{" "}
                    and{" "}
                    <TouchableOpacity>
                      <Text style={styles.linkText}>Terms and Conditions</Text>
                    </TouchableOpacity>{" "}
                    of Milestono.
                  </Text>
                </View>

                <TouchableOpacity style={styles.signupButton} onPress={handleSignup}>
                  <Text style={styles.signupButtonText}>Sign Up</Text>
                </TouchableOpacity>

                <View style={styles.divider}>
                  <View style={styles.dividerLine} />
                  <Text style={styles.dividerText}>OR</Text>
                  <View style={styles.dividerLine} />
                </View>

                <TouchableOpacity style={styles.googleButton} onPress={handleGoogleSignup}>
                  <Image
                    source={{ uri: "https://www.google.com/favicon.ico" }}
                    style={styles.googleIcon}
                  />
                  <Text style={styles.googleButtonText}>Log in with Google</Text>
                </TouchableOpacity>

                <View style={styles.loginPrompt}>
                  <Text style={styles.loginText}>Already have an account? </Text>
                  <TouchableOpacity onPress={() => navigation.navigate("LoginPage" as never)}>
                    <Text style={styles.linkText}>Log in</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </KeyboardAvoidingView>
          <Modal
            transparent={true}
            visible={isConfirmationOpen}
            animationType="fade"
            onRequestClose={closeConfirmationModal}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <Text>{message}</Text>
                <TouchableOpacity onPress={closeConfirmationModal} style={styles.okButton}>
                  <Text>OK</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </View>
      </ScrollView>
    </ImageBackground>
  );
}
const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  // Reuse all the same styles from LoginScreen
  ...StyleSheet.create({
    background: {
      flex: 1,
      width: "100%",
      height: "100%",
    },
    overlay: {
      flex: 1,
      justifyContent: "center",
    },
    container: {
      flex: 1,
      justifyContent: "center",
    },
    content: {
      paddingHorizontal: 24,
      paddingTop: 60,
      maxWidth: 440,
      width: "100%",
      alignSelf: "center",
    },
    logo: {
      fontSize: 30,
      fontWeight: "800",
      color: "#1a237e",
      marginBottom: 32,
      letterSpacing: 1,
      textAlign: "center",
    },
    welcomeContainer: {
      marginBottom: 36,
      textAlign: "center",
    },
    welcomeText: {
      fontSize: 18,
      color: "#333",
      marginBottom: 6,
      fontWeight: "500",
      textAlign: "center",
    },
    subText: {
      fontSize: 14,
      color: "#666",
      textAlign: "center",
    },
    formContainer: {
      width: "100%",
      alignItems: "center",
    },
    input: {
      width: width * 0.8,
      height: 45,
      backgroundColor: "white",
      borderRadius: 9,
      paddingHorizontal: 24,
      fontSize: 14,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: "#E0E0E0",
      color: "#333",
    },
    verifyContainer: {
      flexDirection: "row",
      marginBottom: 10,
      width: width * 0.8,
    },
    verifyInput: {
      flex: 1,
      marginRight: 8,
    },
    verifyButton: {
      width: 80,
      height: 45,
      backgroundColor: "#1a237e",
      borderRadius: 9,
      alignItems: "center",
      justifyContent: "center",
    },
    verifyButtonText: {
      color: "white",
      fontSize: 12,
      fontWeight: "600",
    },
    passwordContainer: {
      position: "relative",
      marginBottom: 16,
      width: width * 0.8,
    },
    passwordInput: {
      marginBottom: 0,
      paddingRight: 50,
    },
    eyeIcon: {
      position: "absolute",
      right: 20,
      top: 10,
      padding: 4,
    },
    termsContainer: {
      flexDirection: "row",
      alignItems: "flex-start",
      marginBottom: 24,
      width: width * 0.8,
      paddingRight: 20,
    },
    checkbox: {
      width: 15,
      height: 15,
      borderWidth: 2,
      borderColor: "#fff",
      borderRadius: 4,
      marginRight: 12,
      marginTop: 2,
      alignItems: "center",
      justifyContent: "center",
    },
    checkboxChecked: {
      backgroundColor: "#fff",
    },
    termsText: {
      flex: 1,
      color: "#666",
      fontSize: 12,
      lineHeight: 22,
    },
    linkText: {
      color: "#fff",
      textDecorationLine: "underline",
    },
    signupButton: {
      width: width * 0.8,
      height: 45,
      backgroundColor: "#1a237e",
      borderRadius: 9,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 24,
    },
    signupButtonText: {
      color: "white",
      fontSize: 14,
      fontWeight: "600",
    },
    loginPrompt: {
      flexDirection: "row",
      justifyContent: "center",
      marginTop: 16,
      marginBottom: 16,
    },
    loginText: {
      color: "#666",
      fontSize: 14,
    },
    divider: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 24,
      width: width * 0.8,
    },
    dividerLine: {
      flex: 1,
      height: 1,
      backgroundColor: "#E0E0E0",
    },
    dividerText: {
      color: "#fff",
      paddingHorizontal: 16,
      fontSize: 14,
      fontWeight: "500",
    },
    googleButton: {
      width: width * 0.8,
      height: 45,
      backgroundColor: "white",
      borderRadius: 9,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 1,
      borderColor: "#E0E0E0",
    },
    googleIcon: {
      width: 20,
      height: 20,
      marginRight: 12,
    },
    googleButtonText: {
      color: "#333",
      fontSize: 14,
      fontWeight: "500",
    },
    modalOverlay: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
      backgroundColor: '#fff',
      padding: 20,
      alignItems: 'center',
      justifyContent: 'center',
    },
    okButton: {
      marginTop: 20,
      backgroundColor: '#000',
      padding: 10,
    },
  }),
});