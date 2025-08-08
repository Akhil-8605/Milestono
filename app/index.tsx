"use client"

import { useEffect, useState, useCallback } from "react"
import { View, ScrollView, StatusBar, ActivityIndicator, Text, RefreshControl } from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage"

import Homepage from "./homepage" // adjust paths if needed
import BottomNavbar from "./components/BottomNavbar"
import SplashScreen from "./SplashScreen"

export default function Main() {
  const [isLoading, setIsLoading] = useState(true)
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false)
  const [refreshing, setRefreshing] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const token = await AsyncStorage.getItem("auth")
        setIsLoggedIn(!!token)
      } catch (err) {
        console.error("Error reading login token from AsyncStorage", err)
        setIsLoggedIn(false)
      } finally {
        setIsLoading(false)
      }
    }

    checkLoginStatus()
  }, [])

  const handleGetStarted = () => {
    setIsLoggedIn(true)
  }

  const onRefresh = useCallback(async () => {
    setRefreshing(true)

    try {
      // Update refresh key to force re-render of Homepage component
      setRefreshKey((prevKey) => prevKey + 1)

      // Add a small delay to show the refresh animation
      await new Promise((resolve) => setTimeout(resolve, 1000))
    } catch (error) {
      console.error("Error during refresh:", error)
    } finally {
      setRefreshing(false)
    }
  }, [])

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#f5f5f5" }}>
        <ActivityIndicator size="large" color="#232761" />
        <Text style={{ marginTop: 10, fontSize: 16, color: "#333" }}>Loading...</Text>
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
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#232761"]} // Android
            tintColor="#232761" // iOS
            title="Pull to refresh..."
            titleColor="#232761"
            progressBackgroundColor="#ffffff"
          />
        }
      >
        <Homepage key={`homepage-${refreshKey}`} />
      </ScrollView>
      <BottomNavbar />
    </View>
  )
}
