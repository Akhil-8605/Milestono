import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useNavigation } from "expo-router";

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState("");

    const navigation = useNavigation();
  

  return (
    <ImageBackground
      source={require("../assets/images/loginbg.jpg")}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.container}
        >
          <View style={styles.content}>
            <Text style={styles.logo}>FORGOT PASSWORD</Text>

            <View style={styles.messageContainer}>
              <Text style={styles.messageText}>
                Forgot your password? No worries! Set a new password and regain
                access in no time!
              </Text>
            </View>

            <View style={styles.formContainer}>
              <TextInput
                style={styles.input}
                placeholder="Enter Your Email Address"
                placeholderTextColor="#999"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />

              <TouchableOpacity style={styles.resetButton}>
                <Text style={styles.resetButtonText}>Send Reset Link</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.backToLogin}
                onPress={() => navigation.navigate("LoginPage" as never)}
              >
                <Text style={styles.linkText}>Back to Login</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.85)",
    justifyContent: "center",
  },
  container: {
    flex: 1,
    justifyContent: "center",
  },
  content: {
    paddingHorizontal: 24,
    maxWidth: 440,
    width: "100%",
    alignSelf: "center",
  },
  logo: {
    fontSize: 30,
    fontWeight: "800",
    color: "#1a237e",
    marginBottom: 10,
    letterSpacing: 1,
    textAlign: "center",
  },
  messageContainer: {
    marginBottom: 20,
  },
  messageText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    lineHeight: 24,
  },
  formContainer: {
    width: "100%",
  },
  input: {
    height: 45,
    backgroundColor: "white",
    borderRadius: 9,
    paddingHorizontal: 20,
    fontSize: 14,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    color: "#333",
  },
  resetButton: {
    height: 45,
    backgroundColor: "#1a237e",
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  resetButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
  linkText: {
    color: "#1a237e",
    textDecorationLine: "underline",
    textAlign: "center",
    fontSize: 14,
  },
  backToLogin: {
    marginTop: 14,
  },
});
