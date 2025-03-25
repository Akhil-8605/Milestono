import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { AntDesign } from "@expo/vector-icons"; // For arrow icons
import { PanGestureHandler } from "react-native-gesture-handler";

const SplashScreen = () => {
  const navigation = useNavigation();
  const screenWidth = Dimensions.get("window").width;

  const [currentIndex, setCurrentIndex] = useState(0); // Slide index

  const handleNext = () => {
    if (currentIndex < 2) setCurrentIndex(currentIndex + 1); // Next slide
  };

  const handlePrev = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1); // Previous slide
  };

  const handleSkip = () => {
    navigation.navigate("Main");
  };

  const handleGesture = ({ nativeEvent }) => {
    if (nativeEvent.translationX < -50) {
      handleNext(); // Swipe left
    } else if (nativeEvent.translationX > 50) {
      handlePrev(); // Swipe right
    }
  };

  return (
    <View style={styles.container}>
      {/* Navigation Controls */}
      <View style={styles.navControls}>
        <TouchableOpacity onPress={handlePrev}>
          <AntDesign name="arrowleft" size={24} color="#999" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>

      {/* Gesture Handler for Swiping */}
      <PanGestureHandler onGestureEvent={handleGesture}>
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          {/* Slide 1 */}
          {currentIndex === 0 && (
            <View style={styles.slide}>
              <Image
                source={require("../assets/images/PersonDummy.png")}
                style={[styles.image, { width: screenWidth * 0.66, height: screenWidth * 0.66 }]}
                resizeMode="contain"
              />
              <Text style={styles.title}>Register Online</Text>
              <Text style={styles.description}>
                Lorem ipsum dolor sit amet consectetur adipiscing
              </Text>
              <TouchableOpacity onPress={handleNext}>
                <AntDesign name="arrowright" size={24} color="white" />
              </TouchableOpacity>
            </View>
          )}

          {/* Slide 2 */}
          {currentIndex === 1 && (
            <View style={styles.slide}>
              <Image
                source={require("../assets/images/PersonDummy.png")}
                style={[styles.image, { width: screenWidth * 0.66, height: screenWidth * 0.66 }]}
                resizeMode="contain"
              />
              <Text style={styles.title}>Get Started</Text>
              <Text style={styles.description}>
                Lorem ipsum dolor sit amet consectetur adipiscing
              </Text>
              <TouchableOpacity style={styles.navigatorButton} onPress={handleNext}>
                <AntDesign name="arrowright" size={24} color="white" />
              </TouchableOpacity>
            </View>
          )}

          {/* Slide 3 */}
          {currentIndex === 2 && (
            <View style={styles.slide}>
              <Image
                source={require("../assets/images/PersonDummy.png")}
                style={[styles.image, { width: screenWidth * 0.66, height: screenWidth * 0.66 }]}
                resizeMode="contain"
              />
              <Text style={styles.title}>Sit Back & Relax</Text>
              <Text style={styles.description}>
                Lorem ipsum dolor sit amet consectetur adipiscing
              </Text>
              <TouchableOpacity style={styles.getStartedButton} onPress={handleSkip}>
                <Text style={styles.getStartedText}>Get Started</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </PanGestureHandler>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF0F3",
    justifyContent: "center",
    alignItems: "center",
  },
  navControls: {
    position: "absolute",
    top: 20,
    left: 20,
    right: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  skipButton: {
    padding: 10,
  },
  skipText: {
    color: "#999",
    fontSize: 16,
  },
  slide: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    marginTop: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginTop: 20,
  },
  description: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginTop: 10,
    marginBottom: 5,
  },
  navigatorButton: {
    backgroundColor: "#FF6B81",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    position: "absolute",
    right: 30,
    bottom: 50,
  },
  getStartedButton: {
    backgroundColor: "#FF6B81",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginTop: 20,
  },
  getStartedText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default SplashScreen;
