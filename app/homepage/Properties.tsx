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
  Alert,
} from "react-native";
import * as Location from "expo-location";
import * as SecureStore from "expo-secure-store";
import axios from "axios";
import { useNavigation } from "expo-router";
import { NavigationProp } from "@react-navigation/native";
import { BASE_URL } from "@env";

const CARD_WIDTH = Dimensions.get("window").width * 0.65;

export default function NewLaunchProperties() {
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation<NavigationProp<{ PropertyDetailsPage: { property: any } }>>();

  const fetchProperties = async (lat: number, lng: number) => {
    try {
      const token = await SecureStore.getItemAsync("auth"); // optional: if you use token
      const response = await axios.post<any[]>(
        `${BASE_URL}/api/home-properties`,
        {
          latitude: lat,
          longitude: lng,
          radius: 50,
        },
        {
          headers: {
            Authorization: token || "",
          },
        }
      );
      setProperties(response.data);
    } catch (error) {
      console.error("Failed to fetch properties:", error);
      // Alert.alert("Error", "Failed to load properties from server.");
    } finally {
      setLoading(false);
    }
  };

  const getUserLocationAndFetch = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      // fallback to default location (Pune)
      fetchProperties(18.52097398044019, 73.86017831259551);
    } else {
      const location = await Location.getCurrentPositionAsync({});
      fetchProperties(location.coords.latitude, location.coords.longitude);
    }
  };

  useEffect(() => {
    getUserLocationAndFetch();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="#2E3192" style={{ marginTop: 20 }} />;
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
        {properties.slice(0,propertyCount/2).map((property) => (
          <View key={property._id} style={styles.card}>
            <Image
              source={{ uri: property.uploadedPhotos[0] }}
              style={styles.propertyImage}
              resizeMode="cover"
            />
            <View style={styles.cardContent}>
              <Text style={styles.propertyName}>{property.heading}</Text>
              <Text style={styles.locationText}>
                Location: {property.landmark}, {property.city}
              </Text>
              <View style={styles.priceContainer}>
                <Text style={styles.priceText}>
                  Rs{" "}
                  {property.sellType === "Sell"
                    ? property.expectedPrice
                    : property.pricePerMonth}
                </Text>
                <Text style={styles.typeText}>
                  | {property.bedrooms} {property.bedrooms !== "1RK" && "BHK"}
                </Text>
              </View>
              <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.saveButton}>
                  <Text style={styles.saveButtonText}>Save Property</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.viewButton}
                  onPress={() =>
                    // navigation.navigate("PropertyDetailsPage", {
                    //   id: property._id,
                    // })
                    navigation.navigate("PropertyDetailsPage", { property })
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
        {properties.slice(propertyCount / 2 ,properties.length).map((property) => (
          <View key={property._id} style={styles.card}>
            <Image
              source={{ uri: property.uploadedPhotos[0] }}
              style={styles.propertyImage}
              resizeMode="cover"
            />
            <View style={styles.cardContent}>
              <Text style={styles.propertyName}>{property.heading}</Text>
              <Text style={styles.locationText}>
                Location: {property.landmark}, {property.city}
              </Text>
              <View style={styles.priceContainer}>
                <Text style={styles.priceText}>
                  Rs{" "}
                  {property.sellType === "Sell"
                    ? property.expectedPrice
                    : property.pricePerMonth}
                </Text>
                <Text style={styles.typeText}>
                  | {property.bedrooms} {property.bedrooms !== "1RK" && "BHK"}
                </Text>
              </View>
              <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.saveButton}>
                  <Text style={styles.saveButtonText}>Save Property</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.viewButton}
                  onPress={() =>
                    // navigation.navigate("PropertyDetailsPage", {
                    //   id: property._id,
                    // })
                    navigation.navigate("PropertyDetailsPage", { property })
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
