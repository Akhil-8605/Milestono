import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "expo-router";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";
import { BASE_URL } from "@env";

const CARD_WIDTH = Dimensions.get("window").width * 0.65;

interface Property {
  _id: string;
  heading: string;
  sellerType: string;
  landmark: string;
  city: string;
  sellType: "Sell" | "Rent";
  expectedPrice: string;
  pricePerMonth: string;
  bedrooms: string;
  uploadedPhotos: string[];
  saved: boolean;
}

interface NavigationProps {
  navigate: (screen: string, params?: any) => void;
}

export default function NewLaunchProperties() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigation = useNavigation<NavigationProps>();

  useEffect(() => {
    getProperties();
  }, []);

  const getProperties = async (): Promise<void> => {
    // Use AsyncStorage to retrieve the token
    const token = await AsyncStorage.getItem("auth");

    if (!token) {
      alert("Please log in to view properties.");
      navigation.navigate("login" as never);
      return;
    }

    try {
      // Request location permission (if not already granted)
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        alert("Permission to access location was denied.");
        fetchWithFallback();
        return;
      }

      // Get current location
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      const { latitude, longitude } = location.coords;

      const res = await axios.post<Property[]>(
        `${BASE_URL}/api/home-properties`,
        {
          latitude,
          longitude,
          radius: 50,
        },
        {
          headers: { Authorization: token },
        }
      );
      setProperties(res.data);
    } catch (err) {
      console.error("Error loading properties:", err);
      fetchWithFallback();
    } finally {
      setLoading(false);
    }
  };

  const fetchWithFallback = async (): Promise<void> => {
    const token = await AsyncStorage.getItem("auth");
    if (!token) {
      alert("Please log in to view properties.");
      navigation.navigate("login" as never);
      return;
    }

    try {
      const res = await axios.post<Property[]>(
        `${BASE_URL}/api/home-properties`,
        {
          latitude: 18.52097398044019,
          longitude: 73.86017831259551,
          radius: 50,
        },
        {
          headers: { Authorization: token },
        }
      );
      setProperties(res.data);
    } catch (err) {
      console.error("Error with fallback location:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveClick = async (id: string): Promise<void> => {
    const token = await AsyncStorage.getItem("auth");
    if (!token) {
      alert("Please log in to save a property.");
      navigation.navigate("login" as never);
      return;
    }
    try {
      await axios.post(
        `${BASE_URL}/api/save-property`,
        { property_id: id },
        { headers: { Authorization: token } }
      );
      getProperties(); // Refresh saved state
    } catch (err) {
      console.error("Error saving property:", err);
    }
  };

  if (loading) {
    return (
      <View style={{ marginTop: 50, alignItems: "center" }}>
        <ActivityIndicator size="large" color="#2E3192" />
      </View>
    );
  }

  const propertyCount = properties.length;

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>New Launch Properties</Text>
      <Text style={styles.subheading}>Properties only for you</Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        {properties.slice(0, Math.floor(propertyCount / 2)).map((property: Property) => (
          <View key={property._id} style={styles.card}>
            <Image
              source={{ uri: property.uploadedPhotos?.[0] || "" }}
              style={styles.propertyImage}
              resizeMode="cover"
            />
            <View style={styles.cardContent}>
              <Text style={styles.propertyName}>
                {property.heading} ({property.sellerType})
              </Text>
              <Text style={styles.locationText}>
                Location:{" "}
                {property.landmark?.replace(/\b\w/g, (c: string) => c.toUpperCase())},{" "}
                {property.city}
              </Text>
              <View style={styles.priceContainer}>
                <Text style={styles.priceText}>
                  {property.sellType === "Sell" ? "Rs " : "Rent: Rs "}
                  {property.sellType === "Sell"
                    ? property.expectedPrice
                    : property.pricePerMonth}
                </Text>
                <Text style={styles.typeText}>
                  | {property.bedrooms}
                  {property.bedrooms !== "1RK" ? "BHK" : ""}
                </Text>
              </View>
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={() => handleSaveClick(property._id)}
                >
                  <Text style={styles.saveButtonText}>
                    {property.saved ? "Saved" : "Save Property"}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.viewButton}
                  onPress={() =>
                    navigation.navigate("PropertyDetailsPage", {
                      propertyId: property._id,
                    } as never)
                  }
                >
                  <Text style={styles.viewButtonText}>View Details</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        {properties.slice(Math.floor(propertyCount / 2), properties.length).map((property: Property) => (
          <View key={property._id} style={styles.card}>
            <Image
              source={{ uri: property.uploadedPhotos?.[0] || "" }}
              style={styles.propertyImage}
              resizeMode="cover"
            />
            <View style={styles.cardContent}>
              <Text style={styles.propertyName}>
                {property.heading} ({property.sellerType})
              </Text>
              <Text style={styles.locationText}>
                Location:{" "}
                {property.landmark?.replace(/\b\w/g, (c: string) => c.toUpperCase())},{" "}
                {property.city}
              </Text>
              <View style={styles.priceContainer}>
                <Text style={styles.priceText}>
                  {property.sellType === "Sell" ? "Rs " : "Rent: Rs "}
                  {property.sellType === "Sell"
                    ? property.expectedPrice
                    : property.pricePerMonth}
                </Text>
                <Text style={styles.typeText}>
                  | {property.bedrooms}
                  {property.bedrooms !== "1RK" ? "BHK" : ""}
                </Text>
              </View>
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={() => handleSaveClick(property._id)}
                >
                  <Text style={styles.saveButtonText}>
                    {property.saved ? "Saved" : "Save Property"}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.viewButton}
                  onPress={() =>
                    navigation.navigate("PropertyDetailsPage", {
                      propertyId: property._id,
                    } as never)
                  }
                >
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
    fontSize: 25,
    fontWeight: "700",
    color: "#333333",
  },
  subheading: {
    fontSize: 12,
    color: "#666",
    fontWeight: "500",
    marginBottom: 20,
  },
  scrollContainer: {
    paddingRight: 20,
    paddingLeft: 2,
    paddingVertical: 10,
  },
  card: {
    width: 220,
    backgroundColor: "white",
    borderRadius: 8,
    marginRight: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#eee",
  },
  propertyImage: {
    width: "100%",
    height: 120,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    backgroundColor: "#f5f5f5",
  },
  cardContent: {
    padding: 16,
  },
  propertyName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  locationText: {
    fontSize: 12,
    color: "#666",
    marginBottom: 8,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  priceText: {
    fontSize: 12,
    fontWeight: "600",
    color: "green",
  },
  typeText: {
    fontSize: 14,
    color: "#666",
    marginLeft: 4,
  },
  buttonContainer: {
    flexDirection: "row",
  },
  saveButton: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#2E3192",
    marginRight: 8,
  },
  saveButtonText: {
    color: "#2E3192",
    fontSize: 10,
    fontWeight: "500",
  },
  viewButton: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 4,
    backgroundColor: "#2E3192",
  },
  viewButtonText: {
    color: "white",
    fontSize: 10,
    fontWeight: "500",
  },
});