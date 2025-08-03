import React, { useState } from "react"
import {
  View,
  ScrollView,
  StatusBar,
} from "react-native"

import Homepage from "./homepage"
import Footer from "./components/Footer"
import BottomNavbar from "./components/BottomNavbar"
import SplashScreen from "./SplashScreen"

export default function Main() {
  const [hasStarted, setHasStarted] = useState(false)

  const handleGetStarted = () => {
    setHasStarted(true)
  }

  if (!hasStarted) {
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
