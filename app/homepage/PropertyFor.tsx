import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  Image,
  Modal,
} from "react-native";
import { BlurView } from "expo-blur";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const CARD_WIDTH = Dimensions.get("window").width * 0.65;

export default function PropertyForSection() {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedType, setSelectedType] = useState<string>("");
  const [location, setLocation] = useState("");

  const cardData = [
    {
      id: 1,
      image: require("../../assets/images/ForStudentsImg.jpg"),
      title: "For Students",
      subtitle: "Find the best accommodation options tailored for students.",
    },
    {
      id: 2,
      image: require("../../assets/images/ForBuyersImg.jpg"),
      title: "For Buyers",
      subtitle: "Explore a wide variety of properties available for buyers.",
    },
  ];

  const handleExplore = (type: string) => {
    setSelectedType(type);
    setModalVisible(true);
  };

  const handleSubmit = () => {
    if (selectedType === "For Students" || selectedType === "For Buyers") {
      // Navigate to SearchPage with the location input
      router.push({
        pathname: "SearchPage" as never,
        params: {
          cityName: location,
        },
      });
    }
    setModalVisible(false);
    setLocation(""); // Reset location input
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setLocation(""); // Reset location input
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Property for</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        {cardData.map((card) => (
          <View key={card.id} style={styles.card}>
            <Image
              source={card.image}
              style={styles.image}
              resizeMode="cover"
            />
            <View style={styles.cardContent}>
              <Text style={styles.title}>{card.title}</Text>
              <Text style={styles.subtitle}>{card.subtitle}</Text>
              <TouchableOpacity
                style={styles.button}
                onPress={() => handleExplore(card.title)}
              >
                <Text style={styles.buttonText}>EXPLORE</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
        <View key={3} style={styles.card}>
          <Image
            source={require("../../assets/images/ForInvestorsImg.jpg")}
            style={styles.image}
            resizeMode="cover"
          />
          <View style={styles.cardContent}>
            <Text style={styles.title}>For Investors</Text>
            <Text style={styles.subtitle}>
              "Discover lucrative property investment opportunities for
              long-term gains."
            </Text>
            <TouchableOpacity
              style={styles.button}
              onPress={() => router.push("NewProjectsPage" as never)}
            >
              <Text style={styles.buttonText}>EXPLORE</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalOverlay}>
          <BlurView
            style={styles.modalContent}
            intensity={80}
            tint="systemThinMaterialDark"
          >
            {/* Close button */}
            <TouchableOpacity
              style={styles.closeIconButton}
              onPress={handleCloseModal}
            >
              <Ionicons name="close" size={24} color="#fff" />
            </TouchableOpacity>

            {/* Header with icon */}
            <View style={styles.modalHeader}>
              <View style={styles.iconContainer}>
                <Ionicons
                  name={selectedType === "For Students" ? "school" : "home"}
                  size={32}
                  color="#4A90E2"
                />
              </View>
              <Text style={styles.modalTitle}>
                Find Properties {selectedType}
              </Text>
              <Text style={styles.modalSubtitle}>
                Tell us your preferred location to get started
              </Text>
            </View>

            {/* Input section */}
            <View style={styles.inputSection}>
              <Text style={styles.modalLabel}>
                <Ionicons name="location" size={16} color="#fff" /> Location Preferences
              </Text>
              <View style={styles.inputContainer}>
                <Ionicons name="search" size={20} color="#666" style={styles.inputIcon} />
                <TextInput
                  style={styles.modalInput}
                  placeholder="e.g., City center, suburbs, university area"
                  placeholderTextColor="#999"
                  value={location}
                  onChangeText={setLocation}
                  autoCapitalize="words"
                />
              </View>
            </View>

            {/* Action buttons */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.submitButton, !location.trim() && styles.disabledButton]}
                onPress={handleSubmit}
                disabled={!location.trim()}
              >
                <Text style={styles.submitButtonText}>
                  <Ionicons name="search" size={16} color="#fff" /> Search Properties
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.cancelButton}
                onPress={handleCloseModal}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </BlurView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  heading: {
    fontSize: 25,
    fontWeight: "700",
    marginBottom: 20,
    color: "#333333",
  },
  scrollContainer: {
    gap: 20,
    paddingRight: 10,
    paddingLeft: 2,
  },
  card: {
    width: CARD_WIDTH,
    height: 450,
    maxHeight: 450,
    paddingBottom: 35,
    backgroundColor: "white",
    borderRadius: 20,
    marginBottom: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    justifyContent: 'space-between'
  },
  image: {
    width: "90%",
    height: 200,
    borderRadius: 10,
    margin: 20,
    alignSelf: "center",
  },
  cardContent: {
    padding: 20,
    width: "100%",
    alignSelf: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    lineHeight: 22,
    marginBottom: 20,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#1a237e",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignSelf: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    width: "95%",
    maxWidth: 400,
    borderRadius: 24,
    padding: 0,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  closeIconButton: {
    position: "absolute",
    top: 16,
    right: 16,
    zIndex: 1,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalHeader: {
    alignItems: "center",
    paddingTop: 32,
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "rgba(74, 144, 226, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 8,
    textAlign: "center",
  },
  modalSubtitle: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.8)",
    textAlign: "center",
    lineHeight: 22,
  },
  inputSection: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  modalLabel: {
    fontSize: 16,
    color: "#fff",
    marginBottom: 12,
    fontWeight: "600",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  inputIcon: {
    marginRight: 12,
  },
  modalInput: {
    flex: 1,
    padding: 16,
    fontSize: 16,
    color: "#333",
  },
  buttonContainer: {
    paddingHorizontal: 24,
    paddingBottom: 24,
    gap: 12,
  },
  submitButton: {
    backgroundColor: "#4A90E2",
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: "#4A90E2",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  disabledButton: {
    backgroundColor: "rgba(74, 144, 226, 0.5)",
    shadowOpacity: 0,
    elevation: 0,
  },
  submitButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  cancelButton: {
    backgroundColor: "transparent",
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  cancelButtonText: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
});