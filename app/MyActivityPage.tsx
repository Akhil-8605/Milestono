"use client"

import type React from "react"
import { useState, useEffect, useCallback } from "react"
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  StatusBar,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { useRoute, RouteProp } from "@react-navigation/native" // Import route hooks
import { BASE_URL } from "@env"

// Local image imports
const recentActivityHouse = require("../assets/images/recentActivityHouse.png")
const recentActivityPhone = require("../assets/images/recentActivityPhone.png")
const recentActivityNothingHere = require("../assets/images/recentActivitynothing.png")

const TABS = [
  { id: "viewed", title: "Recently Viewed" },
  { id: "posted", title: "Posted Properties" },
  { id: "shortlisted", title: "Shortlisted" },
  { id: "contacted", title: "Contacted" },
]

// Define route params type
type RouteParams = {
  MyActivityPage: {
    initialTab?: string;
  };
};

interface Property {
  _id: string
  uploadedPhotos?: string[]
  heading?: string
  landmark?: string
  city: string
  bedrooms?: string
  sellType?: string
  uniqueFeatures?: string
  areaSqft?: number
  pricePerSqFt?: number
  expectedPrice: number
  propertyCategory?: string
  date?: string // For shortlisted
  dateContacted?: string // For contacted
}

interface ViewedPropertyCardProps {
  item: Property
  onViewDetails: (id: string) => void
}

const ViewedPropertyCard = ({ item, onViewDetails }: ViewedPropertyCardProps) => (
  <TouchableOpacity style={styles.viewedCard} onPress={() => onViewDetails(item._id)}>
    <Image
      source={{ uri: item.uploadedPhotos?.[0] || "/placeholder.svg?height=120&width=300" }}
      style={styles.viewedImage}
    />
    <View style={styles.viewedContent}>
      <Text style={styles.viewedTitle}>{item.heading}</Text>
      <Text style={styles.viewedLocation}>
        {item.landmark} | {item.city}
      </Text>
    </View>
  </TouchableOpacity>
)

interface PostedPropertyCardProps {
  item: Property
  onViewDetails: (id: string) => void
}

const PostedPropertyCard = ({ item, onViewDetails }: PostedPropertyCardProps) => (
  <View style={styles.postedCard}>
    <Image
      source={{ uri: item.uploadedPhotos?.[0] || "/placeholder.svg?height=125&width=300" }}
      style={styles.postedImage}
    />
    <View style={styles.postedContent}>
      <Text style={styles.postedTitle}>
        {item.bedrooms}
        {item.bedrooms !== "1RK" ? "BHK" : ""} Flat for {item.sellType} in {item.city}
      </Text>
      <Text style={styles.postedDescription}>{item.uniqueFeatures}</Text>
      <View style={styles.tagContainer}>
        {[
          item.city,
          item.propertyCategory,
          item.areaSqft ? `Built-up Area: ${item.areaSqft} sq.ft` : null,
          item.pricePerSqFt ? `₹${item.pricePerSqFt}/sq.ft` : null,
        ]
          .filter(Boolean)
          .map((tag, index) => (
            <View key={index} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
      </View>
      <Text style={styles.price}>Price: ₹{item.expectedPrice}</Text>
      <TouchableOpacity style={styles.viewButton} onPress={() => onViewDetails(item._id)}>
        <Text style={styles.viewButtonText}>View Details</Text>
      </TouchableOpacity>
    </View>
  </View>
)

interface ShortlistedPropertyCardProps {
  item: Property
  onRemove: (id: string) => void
  onViewDetails: (id: string) => void
}

const ShortlistedPropertyCard = ({ item, onRemove, onViewDetails }: ShortlistedPropertyCardProps) => (
  <View style={styles.shortlistedCard}>
    <Image
      source={{ uri: item.uploadedPhotos?.[0] || "/placeholder.svg?height=120&width=300" }}
      style={styles.shortlistedImage}
    />
    <View style={styles.shortlistedContent}>
      <Text style={styles.shortlistedTitle}>{item.heading}</Text>
      <Text style={styles.shortlistedLocation}>{item.city}</Text>
      <Text style={styles.dateText}>
        Added on: {item.date ? new Date(item.date).toLocaleDateString("en-GB") : "N/A"}
      </Text>
      <Text style={styles.shortlistedPrice}>₹{item.expectedPrice}</Text>
      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.viewButton} onPress={() => onViewDetails(item._id)}>
          <Text style={styles.viewButtonText}>View Details</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.removeButton} onPress={() => onRemove(item._id)}>
          <Text style={styles.removeButtonText}>Remove</Text>
        </TouchableOpacity>
      </View>
    </View>
  </View>
)

interface ContactedPropertyCardProps {
  item: Property
  onViewDetails: (id: string) => void
}

const ContactedPropertyCard = ({ item, onViewDetails }: ContactedPropertyCardProps) => (
  <View style={styles.contactedCard}>
    <Image
      source={{ uri: item.uploadedPhotos?.[0] || "/placeholder.svg?height=100&width=125" }}
      style={styles.contactedImage}
    />
    <View style={styles.contactedContent}>
      <Text style={styles.contactedTitle}>{item.heading}</Text>
      <Text style={styles.contactedLocation}>{item.city}</Text>
      <Text style={styles.dateText}>
        Contacted on: {item.dateContacted ? new Date(item.dateContacted).toLocaleDateString("en-GB") : "N/A"}
      </Text>
      <Text style={styles.contactedStatus}>Contacted</Text>
      <TouchableOpacity style={styles.viewButton} onPress={() => onViewDetails(item._id)}>
        <Text style={styles.viewButtonText}>View Details</Text>
      </TouchableOpacity>
    </View>
  </View>
)

export default function PropertyActivities() {
  const route = useRoute<RouteProp<RouteParams, 'MyActivityPage'>>()
  const initialTab = route.params?.initialTab || "viewed" // Get initial tab from params
  
  const [activeTab, setActiveTab] = useState(initialTab)
  const [loading, setLoading] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [postedProperties, setPostedProperties] = useState<Property[]>([])
  const [recentProperties, setRecentProperties] = useState<Property[]>([])
  const [savedProperties, setSavedProperties] = useState<Property[]>([])
  const [contactedProperties, setContactedProperties] = useState<Property[]>([])

  // Update active tab when route params change
  useEffect(() => {
    if (route.params?.initialTab) {
      setActiveTab(route.params.initialTab)
    }
  }, [route.params?.initialTab])

  // Dummy navigation function for React Native context
  const handleViewDetails = (id: string) => {
    Alert.alert("Navigate to Details", `Would navigate to property details for ID: ${id}`)
    // In a real Expo app, you would use navigation like:
    // navigation.navigate("PropertyDetails", { id });
  }

  const fetchData = useCallback(
    async (url: string, setter: React.Dispatch<React.SetStateAction<Property[]>>) => {
      setLoading(true)
      const token = await AsyncStorage.getItem("auth") // Get token from AsyncStorage
      if (!token) {
        console.error("No auth token found")
        setLoading(false)
        setRefreshing(false) // Stop refreshing if no token
        Alert.alert("Authentication Required", "Please log in to view your activities.")
        return
      }
      try {
        const response = await fetch(`${BASE_URL}${url}`, {
          headers: {
            Authorization: token,
          },
        })
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        // Adjusting for different response structures
        if (url.includes("shared-property")) {
          setter(data.properties || [])
        } else if (url.includes("get-recent-property")) {
          setter(data || []) // Assuming data is directly the array
        } else if (url.includes("saved-property")) {
          setter(data || [])
        } else if (url.includes("unlocked-property")) {
          setter(data || [])
        } else {
          setter(data || [])
        }
      } catch (error) {
        console.error(`Error fetching data from ${url}:`, error)
        Alert.alert("Error", `Failed to load data. Please check your network and try again.`)
      } finally {
        setLoading(false)
        setRefreshing(false) // Stop refreshing after fetch attempt
      }
    },
    [], // Dependencies for useCallback
  )

  const handleUnSaveClick = async (id: string) => {
    const token = await AsyncStorage.getItem("auth") // Get token from AsyncStorage
    if (!token) {
      Alert.alert("Login Required", "Please log in to unsave properties.")
      return
    }
    try {
      const response = await fetch(`${BASE_URL}/api/unsave-property`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({ property_id: id }),
      })
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      Alert.alert("Success", "Property unsaved successfully!")
      fetchData("/api/saved-property", setSavedProperties) // Refresh saved properties
    } catch (error) {
      console.error("Error unsaving property:", error)
      Alert.alert("Error", "Failed to unsave property. Please try again.")
    }
  }

  const onRefresh = useCallback(() => {
    setRefreshing(true)
    // Re-fetch data for the current active tab
    switch (activeTab) {
      case "viewed":
        fetchData("/api/get-recent-property", setRecentProperties)
        break
      case "posted":
        fetchData("/api/shared-property", setPostedProperties)
        break
      case "shortlisted":
        fetchData("/api/saved-property", setSavedProperties)
        break
      case "contacted":
        fetchData("/api/unlocked-property", setContactedProperties)
        break
      default:
        setRefreshing(false) // If no active tab, stop refreshing
        break
    }
  }, [activeTab, fetchData]) // Dependencies for onRefresh

  useEffect(() => {
    // Initial fetch for the active tab
    onRefresh()
  }, [activeTab, onRefresh]) // Re-fetch when activeTab changes or onRefresh changes

  const renderTabContent = () => {
    const NoActivityFound = ({
      imageSource,
      title,
      description,
    }: {
      imageSource: any // Use 'any' for local require images
      title: string
      description: string
    }) => (
      <View style={styles.noFoundContainer}>
        <Image source={imageSource} style={styles.noFoundImage} />
        <Text style={styles.noFoundTitle}>{title}</Text>
        <Text style={styles.noFoundDescription}>{description}</Text>
      </View>
    )

    const commonFlatListProps = {
      keyExtractor: (item: Property) => item._id,
      showsVerticalScrollIndicator: false,
      refreshControl: <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#232761" />,
    }

    switch (activeTab) {
      case "viewed":
        return (
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Viewed Properties</Text>
            <Text style={styles.sectionSubtitle}>Contact now to close the deal</Text>
            {recentProperties.length > 0 ? (
              <FlatList
                data={recentProperties}
                renderItem={({ item }) => <ViewedPropertyCard item={item} onViewDetails={handleViewDetails} />}
                {...commonFlatListProps}
              />
            ) : (
              <NoActivityFound
                imageSource={recentActivityNothingHere}
                title="You haven’t viewed anything yet!"
                description="All the properties and projects that you have viewed will start appearing here. Search or explore cities now."
              />
            )}
          </View>
        )
      case "posted":
        return (
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Posted Properties</Text>
            {postedProperties.length > 0 ? (
              <FlatList
                data={postedProperties}
                renderItem={({ item }) => <PostedPropertyCard item={item} onViewDetails={handleViewDetails} />}
                {...commonFlatListProps}
              />
            ) : (
              <NoActivityFound
                imageSource={recentActivityHouse}
                title="You haven’t posted anything yet!"
                description="You will see your posted properties here, once you start listing properties."
              />
            )}
          </View>
        )
      case "shortlisted":
        return (
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Shortlisted Properties</Text>
            {savedProperties.length > 0 ? (
              <FlatList
                data={savedProperties}
                renderItem={({ item }) => (
                  <ShortlistedPropertyCard item={item} onRemove={handleUnSaveClick} onViewDetails={handleViewDetails} />
                )}
                {...commonFlatListProps}
              />
            ) : (
              <NoActivityFound
                imageSource={recentActivityHouse}
                title="You haven’t shortlisted anything yet!"
                description="In case you have shortlisted something on another device/account, Login / Register to view them here."
              />
            )}
          </View>
        )
      case "contacted":
        return (
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Contacted Properties</Text>
            {contactedProperties.length > 0 ? (
              <FlatList
                data={contactedProperties}
                renderItem={({ item }) => <ContactedPropertyCard item={item} onViewDetails={handleViewDetails} />}
                {...commonFlatListProps}
              />
            ) : (
              <NoActivityFound
                imageSource={recentActivityPhone}
                title="You haven’t contacted anyone lately!"
                description="You will see the list of properties / projects here, where you have contacted the advertiser."
              />
            )}
          </View>
        )
      default:
        return null
    }
  }

  const statusBarHeight = StatusBar.currentHeight || 0

  return (
    <SafeAreaView style={[styles.container, { marginTop: statusBarHeight }]}>
      <View style={styles.tabContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabScroll}>
          {TABS.map((tab) => (
            <TouchableOpacity
              key={tab.id}
              style={[styles.tab, activeTab === tab.id && styles.activeTab]}
              onPress={() => setActiveTab(tab.id)}
            >
              <Text style={[styles.tabText, activeTab === tab.id && styles.activeTabText]}>
                {tab.title} (
                {tab.id === "viewed"
                  ? recentProperties.length
                  : tab.id === "posted"
                    ? postedProperties.length
                    : tab.id === "shortlisted"
                      ? savedProperties.length
                      : contactedProperties.length}
                )
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      <View style={styles.content}>
        {loading && !refreshing ? ( // Show full loading indicator only on initial load, not during refresh
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#232761" />
            <Text style={styles.loadingText}>Loading...</Text>
          </View>
        ) : (
          renderTabContent()
        )}
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f2f5", // Light grey background
  },
  tabContainer: {
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  tabScroll: {
    paddingHorizontal: 16,
    alignItems: "center",
  },
  tab: {
    paddingVertical: 14,
    paddingHorizontal: 18,
    marginRight: 12,
  },
  activeTab: {
    borderBottomWidth: 3,
    borderBottomColor: "#232761", // Primary brand color
  },
  tabText: {
    fontSize: 13,
    color: "#666666",
    fontWeight: "500",
  },
  activeTabText: {
    color: "#232761",
    fontWeight: "600",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  sectionContainer: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#333333",
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: "#666666",
    fontWeight: "400",
    marginBottom: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666666",
  },
  noFoundContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#ffffff",
    borderRadius: 12,
    marginTop: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  noFoundImage: {
    width: 150,
    height: 150,
    resizeMode: "contain",
    marginBottom: 20,
  },
  noFoundTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333333",
    textAlign: "center",
    marginBottom: 10,
  },
  noFoundDescription: {
    fontSize: 14,
    color: "#666666",
    textAlign: "center",
    lineHeight: 20,
  },
  // Card Styles (Common Base properties applied directly)
  viewedCard: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    marginBottom: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  viewedImage: {
    width: "100%",
    height: 120,
    borderBottomWidth: 1,
    borderColor: "#f0f0f0",
    resizeMode: "cover",
  },
  viewedContent: {
    padding: 16, // Original padding was 14, adjusted to 16 for consistency
    paddingVertical: 12,
  },
  viewedTitle: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 4,
    color: "#333333",
  },
  viewedLocation: {
    fontSize: 12,
    color: "#666666",
    marginBottom: 8,
  },
  postedCard: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    marginBottom: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  postedImage: {
    width: "100%",
    height: 140,
    borderBottomWidth: 1,
    borderColor: "#f0f0f0",
    resizeMode: "cover",
  },
  postedContent: {
    padding: 16,
  },
  postedTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
    color: "#333333",
  },
  postedDescription: {
    fontSize: 13,
    color: "#666666",
    marginBottom: 12,
  },
  tagContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 12,
    gap: 8, // Spacing between tags
  },
  tag: {
    backgroundColor: "#e6f0ff", // Light blue for tags
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
  },
  tagText: {
    fontSize: 11,
    color: "#232761", // Darker blue for tag text
    fontWeight: "500",
  },
  price: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 16,
    color: "#333333",
  },
  shortlistedCard: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    marginBottom: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  shortlistedImage: {
    width: "100%",
    height: 120,
    borderBottomWidth: 1,
    borderColor: "#f0f0f0",
    resizeMode: "cover",
  },
  shortlistedContent: {
    padding: 16,
  },
  shortlistedTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
    color: "#333333",
  },
  shortlistedLocation: {
    fontSize: 13,
    color: "#666666",
    marginBottom: 8,
  },
  shortlistedPrice: {
    fontSize: 15,
    fontWeight: "700",
    marginVertical: 8,
    color: "#333333",
  },
  buttonRow: {
    flexDirection: "row",
    gap: 10, // Spacing between buttons
    marginTop: 8,
  },
  contactedCard: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    marginBottom: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#f0f0f0",
    flexDirection: "row", // Specific to contacted card
    padding: 12, // Specific to contacted card
    alignItems: "center", // Specific to contacted card
  },
  contactedImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginRight: 12,
    borderWidth: 1,
    borderColor: "#f0f0f0",
    resizeMode: "cover",
  },
  contactedContent: {
    flex: 1,
  },
  contactedTitle: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 4,
    color: "#333333",
  },
  contactedLocation: {
    fontSize: 13,
    color: "#666666",
    marginBottom: 8,
  },
  contactedStatus: {
    color: "#10b981", // Green for contacted status
    fontSize: 12,
    fontWeight: "600",
    marginVertical: 4,
  },
  dateText: {
    fontSize: 12,
    color: "#888888",
    marginBottom: 4,
  },
  // Common Button Styles
  viewButton: {
    backgroundColor: "#232761", // Primary brand color
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
    flex: 1,
  },
  viewButtonText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "600",
  },
  removeButton: {
    backgroundColor: "#ef4444", // Red for remove
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
    flex: 1,
  },
  removeButtonText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "600",
  },
})
