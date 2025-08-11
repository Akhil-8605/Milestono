import React, { useState, useEffect } from "react";
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
  Alert,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import axios from "axios";
import * as WebBrowser from "expo-web-browser";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, useRouter, useLocalSearchParams } from "expo-router";
import { BASE_URL } from "@env";
import * as Linking from "expo-linking";
const { width } = Dimensions.get("window");

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);

  const navigation = useNavigation();
  const router = useRouter();
  const searchParams = useLocalSearchParams();

  const handleLogin = async () => {
    if (!acceptTerms) {
      Alert.alert(
        "Terms Required",
        "You must accept the privacy policy and terms to log in."
      );
      return;
    }
    try {
      const response = await axios.post(`${BASE_URL}/api/login`, {
        email,
        password,
      });

      const { token } = response.data as any;
      await AsyncStorage.setItem("auth", token);
      router.replace("/");
    } catch (error: any) {
      console.error(error);
      Alert.alert("Login Failed", error?.response?.data?.message || "An error occurred.");
    }
  };

  const handleGoogleSignup = async () => {
  const redirectUri = Linking.createURL("auth");
  const authUrl = `${BASE_URL}/auth/google?platform=mobile&redirect_uri=${encodeURIComponent(redirectUri)}`;

  const result = await WebBrowser.openAuthSessionAsync(authUrl, redirectUri);

  if (result.type === "success" && result.url) {
    const tokenParam = Linking.parse(result.url)?.queryParams?.token;
    
    const token = Array.isArray(tokenParam) ? tokenParam[0] : tokenParam;

    if (typeof token === "string" && token.trim()) {
      await AsyncStorage.setItem("auth", token);
      router.replace("/");
    }
  }
};


  useEffect(() => {
    const token = searchParams.token;
    if (token) {
      AsyncStorage.setItem("auth", token as string);
      router.replace("/");
    }
  }, [searchParams]);

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
              <Text style={styles.welcomeText}>
                Welcome to the MILESTONO,
              </Text>
              <Text style={styles.subText}>We're thrilled to have you back!</Text>
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
                onPress={() => router.push("/ForgotPasswordPage")}
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
                  {acceptTerms && <Feather name="check" size={14} color="#1a237e" />}
                </TouchableOpacity>
                <Text style={styles.termsText}>
                  I accept the{" "}
                  <Text style={styles.linkText} onPress={() => Linking.openURL("/privacy-policy")}>
                    Privacy Policy
                  </Text>{" "}
                  and{" "}
                  <Text style={styles.linkText} onPress={() => Linking.openURL("/terms-condition")}>
                    Terms and Conditions
                  </Text>{" "}
                  of Milestono.
                </Text>
              </View>

              <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                <Text style={styles.loginButtonText}>Login</Text>
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

              <View style={styles.signupContainer}>
                <Text style={styles.signupText}>Don't have an account? </Text>
                <TouchableOpacity onPress={() => router.push("/SignupPage")}>
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
    paddingTop: 100,
    paddingBottom: 40,
    alignSelf: "center",
    width: "100%",
    justifyContent: "center",
    textAlign: "center",
  },
  logo: {
    fontSize: 35,
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
    paddingHorizontal: 20,
    fontSize: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    color: "#333",
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
  forgotPassword: {
    alignSelf: "flex-end",
    marginBottom: 18,
    marginTop: 8,
  },
  forgotPasswordText: {
    color: "#fff",
    fontSize: 14,
  },
  termsContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 24,
    width: width * 0.8,
  },
  checkbox: {
    width: 15,
    height: 15,
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
    fontSize: 12,
    lineHeight: 22,
  },
  linkText: {
    color: "#000",
    textDecorationLine: "underline",
  },
  loginButton: {
    width: width * 0.8,
    height: 45,
    backgroundColor: "#1a237e",
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  loginButtonText: {
    color: "white",
    fontSize: 14,
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
    backgroundColor: "#000000",
  },
  dividerText: {
    color: "#000000",
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
  signupContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 24,
  },
  signupText: {
    color: "#fff",
    fontSize: 15,
  },
  signupTextLink: {
    color: "#666",
    textDecorationLine: "underline",
  },
});