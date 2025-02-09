import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  Modal,
  Dimensions,
  Platform,
} from "react-native";

const cities = [
  {
    id: "1",
    title: "Delhi",
    image: require("../../assets/images/cities1.jpg"),
  },
  {
    id: "2",
    title: "Mumbai",
    image: require("../../assets/images/cities2.jpg"),
  },
  {
    id: "3",
    title: "Pune",
    image: require("../../assets/images/cities3.jpg"),
  },
  {
    id: "4",
    title: "Hydrabad",
    image: require("../../assets/images/cities4.jpg"),
  },
  {
    id: "3",
    title: "Kolkata",
    image: require("../../assets/images/cities5.jpg"),
  },
  {
    id: "4",
    title: "Banglore",
    image: require("../../assets/images/cities6.jpg"),
  },
  {
    id: "3",
    title: "Chennai",
    image: require("../../assets/images/cities7.jpg"),
  },
  {
    id: "4",
    title: "Ahmedabad",
    image: require("../../assets/images/cities8.jpg"),
  },
];

export default function ProjectsSection() {

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Explore Real Estate in Popular Indian Cities</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {cities.map((cities) => (
          <TouchableOpacity key={cities.id} style={styles.card}>
            <Image
              source={cities.image}
              style={styles.projectImage}
              resizeMode="cover"
            />
            <Text style={styles.projectTitle}>{cities.title}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    padding: 20,
    marginBottom: 10,
    backgroundColor: "#f5f5f5",
  },
  heading: {
    fontSize: 32,
    fontWeight: "700",
    marginBottom: 25,
    color: "#333333",
  },
  scrollContent: {
    paddingRight: 20,
  },
  card: {
    marginRight: 20,
    borderRadius: 16,
  },
  projectImage: {
    width: 120,
    height: 120,
    borderRadius: '50%',
  },
  projectTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#1A1A1A",
    textAlign: "center",
    marginVertical: 12,
  },
  seeMore: {
    fontSize: 16,
    color: "#4A4A9C",
    fontWeight: "500",
    marginTop: 16,
    textAlign: "right",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    width: "100%",
    maxWidth: 400,
  },
  closeButton: {
    position: "absolute",
    right: 16,
    top: 16,
    zIndex: 1,
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  closeButtonText: {
    fontSize: 20,
    color: "#1A1A1A",
    fontWeight: "500",
  },
  modalImage: {
    width: "100%",
    height: 200,
    borderRadius: 12,
    marginBottom: 16,
    margin: "auto",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1A1A1A",
    marginBottom: 8,
  },
  modalDescription: {
    fontSize: 14,
    color: "#666666",
    marginBottom: 12,
    lineHeight: 20,
  },
  modalLocation: {
    fontSize: 14,
    color: "#1A1A1A",
    marginBottom: 4,
  },
  modalStatus: {
    fontSize: 14,
    color: "#4A90E2",
    marginBottom: 16,
  },
  inquiryButton: {
    backgroundColor: "#1A1A4C",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  inquiryButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "500",
  },
});
