import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Animated,
} from "react-native";

const slides = [
  {
    id: 1,
    title: "Cut Your Expenses",
    image: require("../../assets/images/optimize1.jpg"),
    description:
      "Optimize your investments by reducing unnecessary expenses. Our property management solutions help you lower operational costs while maximizing your returns, ensuring every dollar goes further.",
  },
  {
    id: 2,
    title: "High-Quality Properties",
    image: require("../../assets/images/optimize2.jpg"),
    description:
      "Explore a wide range of properties that align with your investment goals and lifestyle preferences. Our platform showcases reliable listings with verified details to give you peace of mind.",
  },
  {
    id: 3,
    title: "Advanced Technology",
    image: require("../../assets/images/optimize3.jpg"),
    description:
      "Leverage cutting-edge tools and resources to stay ahead in the real estate market. Our platform offers valuable insights, analytics, and property management solutions, empowering you to make smarter, data-driven decisions.",
  },
  {
    id: 4,
    title: "Expert Guidance",
    image: require("../../assets/images/optimize4.jpg"),
    description:
      "Get unmatched support from our experienced team. From property insights to investment advice, we're here to guide you at every step and make your real estate journey seamless and rewarding.",
  },
];

export default function PropertySlider() {
  const [selectedSlide, setSelectedSlide] = useState<number | null>(1);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Reset opacity to 0 and then animate to 1 for a fade-in effect
    fadeAnim.setValue(0);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, [selectedSlide, fadeAnim]);

  return (
    <View style={styles.container}>
      <Text style={styles.mainTitle}>
        <Text>Optimize Costs and </Text>
        <Text style={styles.greenText}>Maximize Property Value </Text>
        <Text>with Our Real Estate Solutions</Text>
      </Text>

      <View style={styles.listContainer}>
        {slides.map((slide) => (
          <TouchableOpacity
            key={slide.id}
            onPress={() =>
              setSelectedSlide(slide.id === selectedSlide ? null : slide.id)
            }
          >
            <Text
              style={[
                styles.listItem,
                slide.id === selectedSlide && styles.activeItem,
              ]}
            >
              <Text style={styles.activeItemBefore}>
                {slide.id === selectedSlide ? "+" : "-"}
              </Text>{" "}
              {slide.title}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {selectedSlide !== null && (
        <Animated.View style={[styles.slideContainer, { opacity: fadeAnim }]}>
          <Text style={styles.description}>
            {slides.find((s) => s.id === selectedSlide)?.description}
          </Text>
          <Image
            source={slides.find((s) => s.id === selectedSlide)?.image}
            style={styles.image}
            resizeMode="cover"
          />
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    padding: 20,
  },
  mainTitle: {
    fontSize: 23,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 5,
  },
  greenText: {
    color: "#00ff00",
  },
  listContainer: {
    marginVertical: 20,
  },
  listItem: {
    fontSize: 16,
    color: "#666",
    marginVertical: 5,
  },
  activeItemBefore: {
    fontSize: 20,
  },
  activeItem: {
    fontSize: 17,
    color: "#fff",
    fontWeight: "bold",
  },
  slideContainer: {
    height: 450,
  },
  description: {
    fontSize: 18,
    color: "#fff",
    marginVertical: 10,
    lineHeight: 24,
    fontWeight: "600",
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginTop: 20,
    marginBottom: 10,
  },
});
