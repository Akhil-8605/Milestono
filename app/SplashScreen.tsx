import React from "react";
import { useRef } from "react";
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
import Swiper from "react-native-swiper";

const SplashScreen = () => {
  const navigation = useNavigation();
  const screenWidth = Dimensions.get("window").width;
  const swiperRef = useRef(null); // Store Swiper reference

  const handleNext = () => {
    swiperRef?.current?.scrollBy(1, true);
  };

  const handlePrev = () => {
    swiperRef?.current?.scrollBy(-1, true);
  };

  const handleSkip = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: "Main" }],
    });
  };
  return (
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

      <Swiper
        loop={false}
        dotStyle={styles.dot}
        activeDotStyle={styles.activeDot}
        ref={swiperRef}
      >
        {/* Slide 1 */}
        <View style={styles.slide}>
          <Image
            source={require("../assets/images/human1.png")} // Image path
            style={styles.image}
            resizeMode="contain"
          />
          <Text style={styles.title}>Register Online</Text>{" "}
          {/* description title */}
          <Text style={styles.description}>
            Lorem ipsum dolor sit amet consectetur adipiscing
          </Text>{" "}
          {/* Description text */}
          <TouchableOpacity style={styles.navigatorButton} onPress={handleNext}>
            <AntDesign name="arrowright" size={24} color="white" />
          </TouchableOpacity>
        </View>

        {/* Slide 2 */}
        <View style={styles.slide}>
          <Image
            source={require("../assets/images/human2.png")} // Image path
            style={styles.image}
            resizeMode="contain"
          />
          <Text style={styles.title}>Get Started</Text>{" "}
          {/* description title */}
          <Text style={styles.description}>
            Lorem ipsum dolor sit amet consectetur adipiscing
            {/* Description text */}
          </Text>
          <TouchableOpacity style={styles.navigatorButton} onPress={handleNext}>
            <AntDesign name="arrowright" size={24} color="white" />
          </TouchableOpacity>
        </View>

        {/* Slide 3 */}
        <View style={styles.slide}>
          <Image
            source={require("../assets/images/human3.png")}
            // Image path
            style={styles.image}
            resizeMode="contain"
          />
          <Text style={styles.title}>Sit Back & Relax </Text>
          {/* description title */}
          <Text style={styles.description}>
            Lorem ipsum dolor sit amet consectetur adipiscing
            {/* Description text */}
          </Text>
          <TouchableOpacity
            style={styles.getStartedButton}
            onPress={handleSkip}
          >
            <Text style={styles.getStartedText}>Get Started</Text>
          </TouchableOpacity>
        </View>
      </Swiper>
    </View>
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
  slide: {
    flex: 1,
    justifyContent: "center", // Center vertically
    alignItems: "center", // Center horizontally
  },
  image: {
    width: Dimensions.get("window").width * 0.66,
    height: Dimensions.get("window").width * 0.66,
    alignSelf: "center", // Ensures image is centered
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
  dot: {
    backgroundColor: "#ccc",
    width: 8,
    height: 8,
    borderRadius: 4,
    margin: 5,
  },
  activeDot: {
    backgroundColor: "#0505f2",
    width: 10,
    height: 10,
    borderRadius: 5,
    margin: 5,
  },
});

export default SplashScreen;
