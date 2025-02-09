import React, { useState } from "react";
import {
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

// Data for each section
const realEstateData = {
  Residential: {
    title: "Residential",
    description:
      "Explore a wide range of residential properties designed to suit every lifestyle. From urban apartments to spacious family homes, each property offers comfort, modern amenities, and easy access to schools, parks, and shopping centers. Perfect for creating a place you'll love to call home.",
    image: require("../../assets/images/realestate1.jpg"),
  },
  Commercial: {
    title: "Commercial",
    description:
      "Find the ideal location for your business with our commercial spaces, offering high visibility and prime accessibility. From retail storefronts to corporate offices, these properties are situated in vibrant, bustling areas, making them ideal for businesses of all sizes aiming for growth and success.",
    image: require("../../assets/images/realestate2.jpg"),
  },
  Investment: {
    title: "Investment",
    description:
      "Unlock real estate investment opportunities with high potential for growth and long-term returns. Our curated selection of properties includes residential and commercial spaces, carefully evaluated for their market value and future appreciation. Build wealth with real estate that works for you.",
    image: require("../../assets/images/realestate3.jpg"),
  },
};

const RealEstateSection = () => {
  const [selectedCategory, setSelectedCategory] =
    useState<keyof typeof realEstateData>("Residential");

  return (
    <View style={styles.container}>
      {/* Toggle Buttons */}
      <View style={styles.tabContainer}>
        {Object.keys(realEstateData).map((category) => (
          <TouchableOpacity
            key={category}
            onPress={() =>
              setSelectedCategory(category as keyof typeof realEstateData)
            }
            style={[
              styles.tabButton,
              selectedCategory === category ? styles.activeTab : {},
            ]}
          >
            <Text
              style={[
                styles.tabText,
                selectedCategory === category ? styles.activeTabText : {},
              ]}
            >
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Background Image with Overlay */}
      <ImageBackground
        source={realEstateData[selectedCategory].image}
        style={styles.backgroundImage}
      >
        <View style={styles.overlay} />
        <View style={styles.contentContainer}>
          <Text style={styles.title}>
            {realEstateData[selectedCategory].title}
          </Text>
          <Text style={styles.description}>
            {realEstateData[selectedCategory].description}
          </Text>
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F5F5F5",
    borderRadius: 10,
    margin: 10,
    overflow: "hidden",
  },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
    backgroundColor: "#EAEAEA",
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 1,
  },
  activeTab: {
    backgroundColor: "#000",
  },
  tabText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#666",
  },
  activeTabText: {
    color: "#FFF",
  },
  backgroundImage: {
    width: "100%",
    height: 250,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject, // Covers the entire background image
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent black overlay
  },
  contentContainer: {
    position: "absolute",
    paddingHorizontal: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFF",
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    textAlign: "center",
    color: "#FFF",
    paddingHorizontal: 10,
  },
});

export default RealEstateSection;
