import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  ImageBackground,
  TextInput,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  ScrollView,
} from "react-native";

import HeroSection from "./homepage/HeroSection";
import PostAndSearchSection from "./homepage/PostAndSearchSection";
import Properties from "./homepage/Properties";
import PropertyForSection from "./homepage/PropertyFor";
import PostPropertySection from "./homepage/PostPropertySection";
import BottomNavbar from "./components/BottomNavbar";
import PreferredAgents from "./homepage/PrefferedAgents";
import ServicesSection from "./homepage/ServicesSection";
import NewProjects from "./homepage/NewProjects";
import CitiesSection from "./homepage/CitiesSection";
import OptimizeSection from "./homepage/OptimizeSection";
import RealEstateTabs from "./homepage/RealestateSection";
import NewsArticlesSection from "./homepage/NewsArticalsSection";
import AboutMilestono from "./homepage/AboutMilestono";
import Footer from "./components/Footer"
import ReviewSection from "./components/ReviewSection"
export default function homepage() {
  const [menuOpen, setMenuOpen] = useState(true);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };
  return (
    <ScrollView
      style={{ position: "relative", flex: 1, backgroundColor: "#f5f5f5" }}
    >
      <HeroSection />
      <PostAndSearchSection />
      <Properties />
      <PropertyForSection />
      <PostPropertySection />
      <PreferredAgents />
      <NewProjects />
      <ServicesSection />
      <CitiesSection />
      <OptimizeSection />
      <RealEstateTabs />
      <NewsArticlesSection />
      <AboutMilestono />
      <ReviewSection/>
    </ScrollView>
  );
}
