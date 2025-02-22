import React from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import Homepage from "./homepage"; // adjust path as needed
import Footer from "./components/Footer";
import BottomNavbar from "./components/BottomNavbar";

export default function Main() {
  return (
    <View style={{ flex: 1 }}>
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
