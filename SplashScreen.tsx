import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { AntDesign } from "@expo/vector-icons"; // For arrow icons
import {
  GestureHandlerRootView,
  PanGestureHandler,
} from "react-native-gesture-handler";
import Animated, { withSpring, useSharedValue, useAnimatedGestureHandler } from "react-native-reanimated";

const SplashScreen = () => {
  const navigation = useNavigation();
  const screenWidth = Dimensions.get("window").width;

  const [currentIndex, setCurrentIndex] = useState(0); // Track current slide

  const slides = [
    {
      image: require("../assets/images/human1.png"),
      title: "Register Online",
      description: "Lorem ipsum dolor sit amet consectetur adipiscing",
    },
    {
      image: require("../assets/images/human2.png"),
      title: "Get Started",
      description: "Lorem ipsum dolor sit amet consectetur adipiscing",
    },
    {
      image: require("../assets/images/human3.png"),
      title: "Sit Back & Relax",
      description: "Lorem ipsum dolor sit amet consectetur adipiscing",
    },
  ];

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleSkip = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: "Main" }],
    });
  };

  // Gesture handling with PanGestureHandler
  const translateX = useSharedValue(0);

  const swipeHandler = useAnimatedGestureHandler({
    onActive: (event) => {
      translateX.value = event.translationX;
    },
    onEnd: (event) => {
      if (event.translationX > 100) {
        handleNext(); // Swipe right
      } else if (event.translationX < -100) {
        handlePrev(); // Swipe left
      } else {
        translateX.value = withSpring(0); // Reset position if swipe is small
      }
    },
  });

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        {/* Navigation Controls */}
        <View style={styles.navControls}>
          <TouchableOpacity style={styles.navButton} onPress={handlePrev}>
            <AntDesign name="arrowleft" size={24} color="#999" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
        </View>

        {/* Swipeable Slide View */}
        <PanGestureHandler onGestureEvent={swipeHandler}>
          <Animated.View
            style={[
              styles.swipeContainer,
              { transform: [{ translateX: translateX.value }] },
            ]}
          >
            <View style={styles.slide}>
              <Image
                source={slides[currentIndex].image}
                style={styles.image}
                resizeMode="contain"
              />
              <Text style={styles.title}>{slides[currentIndex].title}</Text>
              <Text style={styles.description}>{slides[currentIndex].description}</Text>

              {currentIndex < slides.length - 1 ? (
                <TouchableOpacity style={styles.navigatorButton} onPress={handleNext}>
                  <AntDesign name="arrowright" size={24} color="white" />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={styles.getStartedButton}
                  onPress={handleSkip}
                >
                  <Text style={styles.getStartedText}>Get Started</Text>
                </TouchableOpacity>
              )}
            </View>
          </Animated.View>
        </PanGestureHandler>
      </View>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
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
  navButton: {
    padding: 10,
  },
  skipButton: {
    padding: 10,
  },
  skipText: {
    color: "#999",
    fontSize: 16,
  },
  swipeContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  slide: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: Dimensions.get("window").width * 0.66,
    height: Dimensions.get("window").width * 0.66,
    alignSelf: "center",
    marginTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginTop: 20,
    textAlign: "center",
  },
  description: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginTop: 10,
    marginBottom: 5,
  },
  navigatorButton: {
    backgroundColor: "#0505f2",
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
    backgroundColor: "#0505f2",
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
