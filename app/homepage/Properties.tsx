import React from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";

const CARD_WIDTH = Dimensions.get("window").width * 0.75;

export default function NewLaunchProperties() {
  const properties = [
    {
      id: 1,
      name: "Sample Property",
      location: "Sample Location",
      price: "99999",
      type: "1BHK BHK",
      image: require("../../assets/images/dummyImg.webp"),
    },
    {
      id: 2,
      name: "Sample Property",
      location: "Sample Location",
      price: "99999",
      type: "1BHK BHK",
      image: require("../../assets/images/dummyImg.webp"),
    },
    {
      id: 3,
      name: "Sample Property",
      location: "Sample Location",
      price: "99999",
      type: "1BHK BHK",
      image: require("../../assets/images/dummyImg.webp"),
    },
    {
      id: 1,
      name: "Sample Property",
      location: "Sample Location",
      price: "99999",
      type: "1BHK BHK",
      image: require("../../assets/images/dummyImg.webp"),
    },
    {
      id: 2,
      name: "Sample Property",
      location: "Sample Location",
      price: "99999",
      type: "1BHK BHK",
      image: require("../../assets/images/dummyImg.webp"),
    },
    {
      id: 3,
      name: "Sample Property",
      location: "Sample Location",
      price: "99999",
      type: "1BHK BHK",
      image: require("../../assets/images/dummyImg.webp"),
    },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>New Launch Properties</Text>
      <Text style={styles.subheading}>Properties only for you</Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        {properties.map((property) => (
          <View key={property.id} style={styles.card}>
            <Image
              source={property.image}
              style={styles.propertyImage}
              resizeMode="contain"
            />
            <View style={styles.cardContent}>
              <Text style={styles.propertyName}>{property.name}</Text>
              <Text style={styles.locationText}>
                Location: {property.location}
              </Text>
              <View style={styles.priceContainer}>
                <Text style={styles.priceText}>Rs {property.price}</Text>
                <Text style={styles.typeText}>| {property.type}</Text>
              </View>
              <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.saveButton}>
                  <Text style={styles.saveButtonText}>Save Property</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.viewButton}>
                  <Text style={styles.viewButtonText}>View Details</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  heading: {
    fontSize: 32,
    fontWeight: "700",
    color: "#333333",
  },
  subheading: {
    fontSize: 15,
    color: "#666",
    fontWeight: '500',
    marginBottom: 20,
  },
  scrollContainer: {
    paddingRight: 20,
    paddingLeft: 2,
    paddingVertical: 10,
  },
  card: {
    width: CARD_WIDTH,
    backgroundColor: "white",
    borderRadius: 8,
    marginRight: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#eee",
  },
  propertyImage: {
    width: "100%",
    height: 200,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    backgroundColor: "#f5f5f5",
  },
  cardContent: {
    padding: 16,
  },
  propertyName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  locationText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  priceText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2E3192",
  },
  typeText: {
    fontSize: 14,
    color: "#666",
    marginLeft: 4,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  saveButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#2E3192",
    marginRight: 8,
  },
  saveButtonText: {
    color: "#2E3192",
    fontSize: 14,
    fontWeight: "500",
  },
  viewButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
    backgroundColor: "#2E3192",
  },
  viewButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "500",
  },
});
