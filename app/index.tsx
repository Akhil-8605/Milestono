import React from "react";
import {

  ScrollView,
} from "react-native";

import Homepage from "./homepage";
import Footer from "./Footer"
import BottomNavbar from "./BottomNavbar";
export default function Main() {
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={{ position: "relative", flex: 1, backgroundColor: "#f5f5f5" }}
    >
      <Homepage />
      <Footer />
      <BottomNavbar />
    </ScrollView>
  );
}
