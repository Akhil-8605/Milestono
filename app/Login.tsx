import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  Image,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Feather } from "@expo/vector-icons";

import { useNavigation } from "expo-router";

const { width } = Dimensions.get("window");

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);

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
            <Text style={styles.logo}>MILESTONO</Text>

            <View style={styles.welcomeContainer}>
              <Text style={styles.welcomeText}>Welcome to the MILESTONO,</Text>
              <Text style={styles.subText}>
                We're thrilled to have you back!
              </Text>
            </View>

            <View style={styles.formContainer}>
              <TextInput
                style={styles.input}
                placeholder="Enter Email Address"
                placeholderTextColor="#999"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />

              <View style={styles.passwordContainer}>
                <TextInput
                  style={[styles.input, styles.passwordInput]}
                  placeholder="Enter Password"
                  placeholderTextColor="#999"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity
                  style={styles.eyeIcon}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Feather
                    name={showPassword ? "eye" : "eye-off"}
                    size={22}
                    color="#999"
                  />
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={styles.forgotPassword}
                onPress={() => navigation.navigate("ForgotPassword" as never)}
              >
                <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
              </TouchableOpacity>

              <View style={styles.termsContainer}>
                <TouchableOpacity
                  style={[
                    styles.checkbox,
                    acceptTerms && styles.checkboxChecked,
                  ]}
                  onPress={() => setAcceptTerms(!acceptTerms)}
                >
                  {acceptTerms && (
                    <Feather name="check" size={14} color="#1a237e" />
                  )}
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

              <TouchableOpacity style={styles.loginButton}>
                <Text style={styles.loginButtonText}>Login</Text>
              </TouchableOpacity>

              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>OR</Text>
                <View style={styles.dividerLine} />
              </View>

              <TouchableOpacity style={styles.googleButton}>
                <Image
                  source={{ uri: "https://www.google.com/favicon.ico" }}
                  style={styles.googleIcon}
                />
                <Text style={styles.googleButtonText}>Log in with Google</Text>
              </TouchableOpacity>

              <View style={styles.signupContainer}>
                <Text style={styles.signupText}>Don't have an account? </Text>
                <TouchableOpacity
                  onPress={() => navigation.navigate("Signup" as never)}
                >
                  <Text style={styles.signupTextLink}>Sign up</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    height: "100%",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  overlay: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
    maxWidth: 440,
    alignSelf: "center",
    width: "100%",
    justifyContent: "center",
    textAlign: "center",
  },
  logo: {
    fontSize: 38,
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
    fontSize: 20,
    color: "#333",
    marginBottom: 6,
    fontWeight: "500",
    textAlign: "center",
  },
  subText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
  formContainer: {
    width: "100%",
  },
  input: {
    height: 56,
    backgroundColor: "white",
    borderRadius: 9,
    paddingHorizontal: 24,
    fontSize: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    color: "#333",
  },
  passwordContainer: {
    position: "relative",
    marginBottom: 16,
  },
  passwordInput: {
    marginBottom: 0,
    paddingRight: 50,
  },
  eyeIcon: {
    position: "absolute",
    right: 20,
    top: 17,
    padding: 4,
  },
  forgotPassword: {
    alignSelf: "flex-end",
    marginBottom: 24,
    marginTop: 8,
    color: "#fff",
  },
  forgotPasswordText: {
    color: "#fff",
    fontSize: 15,
  },
  termsContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 24,
    paddingRight: 20,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderWidth: 2,
    borderColor: "#1a237e",
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
    color: "#333",
    fontSize: 14,
    lineHeight: 22,
  },
  linkText: {
    color: "#000",
    textDecorationLine: "underline",
  },
  loginButton: {
    height: 56,
    backgroundColor: "#1a237e",
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  loginButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
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
    height: 56,
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
    fontSize: 16,
    fontWeight: "500",
  },
  signupContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 24,
  },
  signupText: {
    color: "#666",
    fontSize: 15,
  },
  signupTextLink: {
    color: "#fff",
    textDecorationLine: "underline",
  },
});
