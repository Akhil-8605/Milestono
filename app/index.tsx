import React, { useEffect, useState } from "react";
import {
  View,
  ScrollView,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import Homepage from "./homepage";
import BottomNavbar from "./components/BottomNavbar";
import SplashScreen from "./SplashScreen";

export default function Main() {
  const [isLoading, setIsLoading] = useState(true);
  const [hasLaunched, setHasLaunched] = useState(false);

  useEffect(() => {
    const checkFirstLaunch = async () => {
      try {
        const value = await AsyncStorage.getItem("hasLaunched");
        if (value === null) {
          // First time launch
          setHasLaunched(false);
        } else {
          setHasLaunched(true);
        }
      } catch (error) {
        console.error("Error checking launch flag", error);
      } finally {
        setIsLoading(false);
      }
    };
    checkFirstLaunch();
  }, []);

  const handleGetStarted = async () => {
    try {
      await AsyncStorage.setItem("hasLaunched", "true");
    } catch (error) {
      console.error("Failed to set launch flag", error);
    }
    setHasLaunched(true);
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!hasLaunched) {
    return <SplashScreen onGetStarted={handleGetStarted} />;
  }

  const statusBarHeight = StatusBar.currentHeight || 0;

  return (
    <View style={{ flex: 1, marginTop: statusBarHeight }}>
      <StatusBar backgroundColor="white" barStyle="dark-content" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 80 }}
        style={{ flex: 1, backgroundColor: "#f5f5f5" }}
      >
        <Homepage />
      </ScrollView>
      <BottomNavbar />
    </View>
  );
}
