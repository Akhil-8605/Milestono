"use client"

import { useEffect, useState } from "react"
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
} from "react-native"
import { useNavigation, useRouter } from "expo-router"
import axios from "axios"
import AsyncStorage from "@react-native-async-storage/async-storage"
import * as Location from "expo-location"
import { BASE_URL } from "@env"

const CARD_WIDTH = Dimensions.get("window").width * 0.65
const dummyImg = require("../../assets/images/dummyImg.webp") // Add your dummy image path

interface Property {
  _id: string
  heading: string
  sellerType: string
  landmark: string
  city: string
  sellType: "Sell" | "Rent"
  expectedPrice: string
  pricePerMonth: string
  bedrooms: string
  uploadedPhotos: string[]
  propertyImages?: string[]
  saved: boolean
  // Additional fields that might be needed for PropertyDetailsPage
  propertyCategory?: string
  areaSqft?: string
  builtUpArea?: string
  amenities?: string[]
  furnitures?: string[]
  propertyContains?: string
  oldProperty?: string
  createdAt?: string
  updatedAt?: string
  latitude?: number
  longitude?: number
  propertyType?: string
  propertyLocation?: string
}

interface NavigationProps {
  navigate: (screen: string, params?: any) => void
}

export default function NewLaunchProperties() {
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const navigation = useNavigation<NavigationProps>()
  const router = useRouter();

  useEffect(() => {
    getProperties()
  }, [])

  const getProperties = async (): Promise<void> => {
    // Use AsyncStorage to retrieve the token
    const token = await AsyncStorage.getItem("auth")

    if (!token) {
      Alert.alert("Authentication Required", "Please log in to view properties.", [
        { text: "Cancel", style: "cancel" },
        { text: "Login", onPress: () => navigation.navigate("LoginPage" as never) },
      ])
      return
    }

    try {
      // Request location permission (if not already granted)
      const { status } = await Location.requestForegroundPermissionsAsync()
      if (status !== "granted") {
        Alert.alert("Location Permission", "Permission to access location was denied. Using default location.")
        fetchWithFallback()
        return
      }

      // Get current location
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      })
      const { latitude, longitude } = location.coords

      const res = await axios.post<Property[]>(
        `${BASE_URL}/api/home-properties`,
        {
          latitude,
          longitude,
          radius: 50,
        },
        {
          headers: { Authorization: token },
        },
      )
      setProperties(res.data)
    } catch (err) {
      console.error("Error loading properties:", err)
      fetchWithFallback()
    } finally {
      setLoading(false)
    }
  }

  const fetchWithFallback = async (): Promise<void> => {
    const token = await AsyncStorage.getItem("auth")
    if (!token) {
      Alert.alert("Authentication Required", "Please log in to view properties.", [
        { text: "Cancel", style: "cancel" },
        { text: "Login", onPress: () => navigation.navigate("login" as never) },
      ])
      return
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
        },
      )
      setProperties(res.data)
    } catch (err) {
      console.error("Error with fallback location:", err)
      Alert.alert("Error", "Failed to load properties. Please try again later.")
    } finally {
      setLoading(false)
    }
  }

  const handleSaveClick = async (id: string): Promise<void> => {
    const token = await AsyncStorage.getItem("auth")
    if (!token) {
      Alert.alert("Authentication Required", "Please log in to save a property.", [
        { text: "Cancel", style: "cancel" },
        { text: "Login", onPress: () => navigation.navigate("login" as never) },
      ])
      return
    }
    try {
      await axios.post(`${BASE_URL}/api/save-property`, { property_id: id }, { headers: { Authorization: token } })
      getProperties() // Refresh saved state
      Alert.alert("Success", "Property saved successfully!")
    } catch (err) {
      console.error("Error saving property:", err)
      Alert.alert("Error", "Failed to save property. Please try again.")
    }
  }

  // Clean and validate image arrays
  const cleanImageArray = (images: any[]): string[] => {
    if (!Array.isArray(images)) return []
    return images
      .filter((img) => {
        if (!img) return false
        if (typeof img === "number") return false
        if (typeof img !== "string") return false
        if (img.trim() === "") return false
        return true
      })
      .map((img) => String(img).trim())
  }

  // Get property image with fallback
  const getPropertyImage = (property: Property) => {
    try {
      const images = property.uploadedPhotos || property.propertyImages || []
      const validImages = cleanImageArray(images)

      if (validImages.length > 0) {
        const firstImage = validImages[0]
        if (firstImage.startsWith("http") || firstImage.startsWith("file://") || firstImage.startsWith("/")) {
          return { uri: firstImage }
        }
      }
    } catch (error) {
      console.warn("Error processing property image:", error)
    }
    return dummyImg
  }

  // Navigate to property details with complete property data
  const navigateToPropertyDetails = (property: Property) => {
    try {
      // Ensure all required fields are present and properly formatted
      const propertyForNavigation = {
        _id: String(property._id || ""),
        heading: String(property.heading || "Property"),
        propertyCategory: String(property.propertyCategory || ""),
        sellType: String(property.sellType || ""),
        bedrooms: String(property.bedrooms || ""),
        areaSqft: String(property.areaSqft || "0"),
        builtUpArea: String(property.builtUpArea || property.areaSqft || "0"),
        expectedPrice: String(property.expectedPrice || "0"),
        pricePerMonth: property.pricePerMonth ? String(property.pricePerMonth) : undefined,
        landmark: String(property.landmark || ""),
        city: String(property.city || ""),
        propertyLocation: String(
          property.propertyLocation || `${property.landmark || ""}, ${property.city || ""}`.trim(),
        ),
        uploadedPhotos: cleanImageArray(property.uploadedPhotos || []),
        propertyImages: cleanImageArray(property.propertyImages || []),
        amenities: Array.isArray(property.amenities) ? property.amenities : [],
        furnitures: Array.isArray(property.furnitures) ? property.furnitures : [],
        propertyContains: String(property.propertyContains || ""),
        sellerType: String(property.sellerType || ""),
        oldProperty: String(property.oldProperty || ""),
        createdAt: String(property.createdAt || ""),
        updatedAt: String(property.updatedAt || ""),
        latitude: property.latitude || 0,
        longitude: property.longitude || 0,
        propertyType: String(property.propertyType || property.propertyCategory || ""),
        saved: Boolean(property.saved),
      }

      console.log("Navigating to PropertyDetailsPage with data:", {
        id: propertyForNavigation._id,
        heading: propertyForNavigation.heading,
        price: propertyForNavigation.expectedPrice,
      })

      router.push({
        pathname: "/PropertyDetailsPage" as any,
        params: {
          id: property._id,
        },
      })
    } catch (error) {
      console.error("Navigation error:", error)
      Alert.alert("Error", "Unable to navigate to property details. Please try again.")
    }
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2E3192" />
        <Text style={styles.loadingText}>Loading properties...</Text>
      </View>
    )
  }

  if (properties.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.heading}>New Launch Properties</Text>
        <Text style={styles.subheading}>Properties only for you</Text>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No properties found in your area.</Text>
          <TouchableOpacity style={styles.retryButton} onPress={getProperties}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  const propertyCount = properties.length
  const firstHalf = properties.slice(0, Math.floor(propertyCount / 2))
  const secondHalf = properties.slice(Math.floor(propertyCount / 2), properties.length)

  const renderPropertyCard = (property: Property) => (
    <View key={property._id} style={styles.card}>
      <Image source={getPropertyImage(property)} style={styles.propertyImage} resizeMode="cover" />
      <View style={styles.cardContent}>
        <Text style={styles.propertyName} numberOfLines={2}>
          {property.heading} ({property.sellerType})
        </Text>
        <Text style={styles.locationText} numberOfLines={1}>
          Location: {property.landmark?.replace(/\b\w/g, (c: string) => c.toUpperCase())}, {property.city}
        </Text>
        <View style={styles.priceContainer}>
          <Text style={styles.priceText}>
            {property.sellType === "Sell" ? "Rs " : "Rent: Rs "}
            {property.sellType === "Sell" ? property.expectedPrice : property.pricePerMonth}
          </Text>
          <Text style={styles.typeText}>
            | {property.bedrooms}
            {property.bedrooms !== "1RK" ? "BHK" : ""}
          </Text>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.saveButton} onPress={() => handleSaveClick(property._id)}>
            <Text style={styles.saveButtonText}>{property.saved ? "Saved" : "Save Property"}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.viewButton} onPress={() => navigateToPropertyDetails(property)}>
            <Text style={styles.viewButtonText}>View Details</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>New Launch Properties</Text>
      <Text style={styles.subheading}>Properties only for you</Text>

      {firstHalf.length > 0 && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContainer}>
          {firstHalf.map(renderPropertyCard)}
        </ScrollView>
      )}

      {secondHalf.length > 0 && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContainer}>
          {secondHalf.map(renderPropertyCard)}
        </ScrollView>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  loadingContainer: {
    marginTop: 50,
    alignItems: "center",
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
  },
  emptyContainer: {
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    marginBottom: 20,
    textAlign: "center",
  },
  retryButton: {
    backgroundColor: "#2E3192",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
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
})
