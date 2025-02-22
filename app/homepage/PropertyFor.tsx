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

const CARD_WIDTH = Dimensions.get("window").width * 0.75;

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
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>EXPLORE</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <BlurView
            style={styles.modalContent}
            intensity={50}
            tint="systemThinMaterialLight"
          >
            <Text style={styles.modalTitle}>
              Find Properties {selectedType}
            </Text>
            <Text style={styles.modalLabel}>Location Preferences:</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="e.g., City center, suburbs"
              placeholderTextColor="#666"
              value={location}
              onChangeText={setLocation}
            />
            <TouchableOpacity
              style={styles.submitButton}
              onPress={() => {
                // Handle submit logic here
                setModalVisible(false);
              }}
            >
              <Text style={styles.submitButtonText}>Submit</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
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
    fontSize: 32,
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
    fontSize: 24,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
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
    fontSize: 14,
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.65)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    width: "95%",
    maxWidth: 400,
    borderRadius: 20,
    padding: 24,
    overflow: "hidden",
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 20,
    textAlign: "center",
  },
  modalLabel: {
    fontSize: 16,
    color: "#fff",
    marginBottom: 8,
  },
  modalInput: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  submitButton: {
    backgroundColor: "#1a237e",
    paddingVertical: 14,
    borderRadius: 8,
    marginBottom: 12,
  },
  submitButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  closeButton: {
    backgroundColor: "transparent",
    paddingVertical: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#666",
  },
  closeButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
});
