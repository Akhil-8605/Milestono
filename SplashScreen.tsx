import React, { useRef, useState } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { AntDesign } from "@expo/vector-icons"; // For arrow icons
import { SwiperFlatList } from "react-native-swiper-flatlist";

const SplashScreen = () => {
  const navigation = useNavigation();
  const swiperRef = useRef<SwiperFlatList | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const screenWidth = Dimensions.get("window").width;

  // Slides data
  const slides = [
    {
      key: "slide1",
      title: "Register Online",
      text: "Lorem ipsum dolor sit amet consectetur adipiscing",
      image: require("../assets/images/human1.png"),
    },
    {
      key: "slide2",
      title: "Get Started",
      text: "Lorem ipsum dolor sit amet consectetur adipiscing",
      image: require("../assets/images/human2.png"),
    },
    {
      key: "slide3",
      title: "Sit Back & Relax",
      text: "Lorem ipsum dolor sit amet consectetur adipiscing",
      image: require("../assets/images/human3.png"),
    },
  ];

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      if (swiperRef.current) {
        swiperRef.current.scrollToIndex({ index: currentIndex + 1, animated: true });
      }
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      if (swiperRef.current) {
        swiperRef.current.scrollToIndex({ index: currentIndex - 1, animated: true });
      }
    }
  };

  const handleSkip = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: "Main" as never }],
    });
  };

  return (
    <View style={styles.container}>
      {/* Top Navigation Controls */}
      <View style={styles.navControls}>
        <TouchableOpacity style={styles.navButton} onPress={handlePrev}>
          <AntDesign name="arrowleft" size={24} color="#999" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>

      <SwiperFlatList
        ref={swiperRef}
        index={0}
        showPagination
        onChangeIndex={({ index }) => setCurrentIndex(index)}
        data={slides}
        renderItem={({ item, index }) => (
          <View style={styles.slide}>
            <Image source={item.image} style={styles.image} resizeMode="contain" />
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.description}>{item.text}</Text>
            {index < slides.length - 1 ? (
              <TouchableOpacity style={styles.navigatorButton} onPress={handleNext}>
                <AntDesign name="arrowright" size={24} color="white" />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={styles.getStartedButton} onPress={handleSkip}>
                <Text style={styles.getStartedText}>Get Started</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      />
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
    zIndex: 1,
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
    width: Dimensions.get("window").width,
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
    position: "absolute",
    right: 30,
    bottom: 50,
  },
  getStartedText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default SplashScreen;
