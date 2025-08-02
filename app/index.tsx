import React, { useEffect, useState } from "react"
import {
  View,
  ScrollView,
  StatusBar,
  ActivityIndicator,
} from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage"

import Homepage from "./homepage"           // adjust paths if needed
import Footer from "./components/Footer"
import BottomNavbar from "./components/BottomNavbar"
import SplashScreen from "./SplashScreen"

export default function Main() {
  const [isLoading, setIsLoading] = useState(true)
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false)

  useEffect(() => {
    AsyncStorage.getItem("auth")
      .then(value => {
        setIsLoggedIn(value === "true")
      })
      .catch(err => console.error("Error reading login flag", err))
      .finally(() => setIsLoading(false))
  }, [])

  const handleGetStarted = () => {
    setIsLoggedIn(true)
  }

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    )
  }

  if (!isLoggedIn) {
    return <SplashScreen onGetStarted={handleGetStarted} />
  }

  const statusBarHeight = StatusBar.currentHeight || 0
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
  )
}
