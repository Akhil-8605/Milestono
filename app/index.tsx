import React from "react";
import { View, ScrollView, StyleSheet, StatusBar } from "react-native";
import Homepage from "./homepage"; // adjust path as needed
import Footer from "./components/Footer";
import BottomNavbar from "./components/BottomNavbar";

export default function Main() {
  const statusBarHeight = StatusBar.currentHeight || 0;
  return (
    <View style={{ flex: 1, marginTop: statusBarHeight }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 80 }}
        style={{ flex: 1, backgroundColor: "#f5f5f5" }}
      >
        <Homepage />
        <Footer />
      </ScrollView>
      <BottomNavbar />
    </View>
  );
}
