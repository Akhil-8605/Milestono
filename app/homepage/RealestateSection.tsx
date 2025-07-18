import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  StyleSheet,
  Animated,
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

const categories = Object.keys(realEstateData); // ["Residential", "Commercial", "Investment"]

const RealEstateSection = () => {
  const [selectedCategory, setSelectedCategory] =
    useState<keyof typeof realEstateData>("Residential");

  const fadeAnim = useRef(new Animated.Value(1)).current; // Initial opacity set to 1

  useEffect(() => {
    const interval = setInterval(() => {
      Animated.timing(fadeAnim, {
        toValue: 0, // Fade out
        duration: 400, // Animation duration
        useNativeDriver: true,
      }).start(() => {
        // Change category after fade-out
        setSelectedCategory((prevCategory) => {
          const currentIndex = categories.indexOf(prevCategory);
          const nextIndex = (currentIndex + 1) % categories.length;
          return categories[nextIndex] as keyof typeof realEstateData;
        });

        // Fade in new category
        Animated.timing(fadeAnim, {
          toValue: 1, // Fade in
          duration: 400,
          useNativeDriver: true,
        }).start();
      });
    }, 5000); // Change category every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
      {/* Toggle Buttons */}
      <View style={styles.tabContainer}>
        {categories.map((category) => (
          <TouchableOpacity
            key={category}
            onPress={() => {
              Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
              }).start(() => {
                setSelectedCategory(category as keyof typeof realEstateData);
                Animated.timing(fadeAnim, {
                  toValue: 1,
                  duration: 300,
                  useNativeDriver: true,
                }).start();
              });
            }}
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

      {/* Background Image with Animated Opacity */}
      <Animated.View style={{ opacity: fadeAnim }}>
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
      </Animated.View>
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
    fontSize: 12,
    fontWeight: "600",
    color: "#666",
  },
  activeTabText: {
    color: "#FFF",
  },
  backgroundImage: {
    width: "100%",
    height: 225,
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
    fontSize: 22,
    fontWeight: "bold",
    color: "#FFF",
    marginBottom: 10,
  },
  description: {
    fontSize: 14,
    textAlign: "center",
    color: "#FFF",
    paddingHorizontal: 10,
  },
});

export default RealEstateSection;
