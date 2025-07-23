"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  SafeAreaView,
  Modal,
  StatusBar,
  ActivityIndicator,
  Alert,
  RefreshControl,
  Dimensions,
} from "react-native"
import Icon from "react-native-vector-icons/Ionicons"
import FilterDesign from "./components/FilterDesign"
import { useRouter, useLocalSearchParams } from "expo-router"
import AsyncStorage from "@react-native-async-storage/async-storage"
import axios from "axios"
import { BASE_URL, GOOGLE_API_KEY } from "@env"
import { useNavigation } from "expo-router";
import { NavigationProp } from "@react-navigation/native";

const { width: screenWidth } = Dimensions.get("window")
const dummyImg = require("../assets/images/dummyImg.webp")

// Updated interface to match Properties.tsx structure
interface Property {
  _id: string
  heading: string
  propertyCategory: string
  sellType: string
  bedrooms: string
  areaSqft: string
  expectedPrice: string
  pricePerMonth?: string
  landmark: string
  city: string
  propertyLocation?: string
  uploadedPhotos: string[]
  propertyImages?: string[]
  amenities: string[]
  propertyContains: string
  sellerType: string
  oldProperty: string
  createdAt: string
  updatedAt: string
  latitude?: number
  longitude?: number
}

const PropertyCard = ({ property }: { property: Property }) => {
  const router = useRouter()
  const navigation = useNavigation<NavigationProp<{ PropertyDetailsPage: { property: any } }>>();

  const formatPrice = (price: string | number) => {
    const numPrice = typeof price === "string" ? Number.parseInt(price) : price
    if (numPrice >= 10000000) {
      return `₹${(numPrice / 10000000).toFixed(1)} Cr`
    } else if (numPrice >= 100000) {
      return `₹${(numPrice / 100000).toFixed(1)} L`
    } else {
      return `₹${numPrice.toLocaleString()}`
    }
  }

  const formatPricePerSqft = (price: string, area: string) => {
    const numPrice = Number.parseInt(price)
    const numArea = Number.parseInt(area)
    if (numArea > 0) {
      const pricePerSqft = numPrice / numArea
      return `₹${Math.round(pricePerSqft).toLocaleString()}/sq.ft`
    }
    return "Price on request"
  }

  const getPropertyImage = () => {
    const images = property.uploadedPhotos || property.propertyImages
    if (images && images.length > 0) {
      return { uri: images[0] }
    }
    return dummyImg
  }

  const getLocationText = () => {
    if (property.landmark && property.city) {
      return `${property.landmark}, ${property.city}`
    }
    return property.propertyLocation || "Location not specified"
  }

  const getPropertyTitle = () => {
    return property.heading || (property as any).propertyTitle || "Property"
  }

  const getPrice = () => {
    if (property.sellType === "Sell") {
      return property.expectedPrice
    } else {
      return property.pricePerMonth || property.expectedPrice
    }
  }

  const navigateToDetails = () => {
    navigation.navigate("PropertyDetailsPage", { property })
  }

  const getPropertyTypeColor = (category: string) => {
    switch (category.toLowerCase()) {
      case "flats/apartment":
        return "#4CAF50"
      case "independent house/villa":
        return "#2196F3"
      case "plot/land":
        return "#FF9800"
      default:
        return "#232761"
    }
  }

  const getSellTypeColor = (sellType: string) => {
    return sellType === "Sell" ? "#E91E63" : "#9C27B0"
  }

  return (
    <View style={styles.card}>
      {/* Image Container with Enhanced Overlay */}
      <View style={styles.imageContainer}>
        <Image source={getPropertyImage()} style={styles.propertyImage} />

        {/* Gradient Overlay */}
        <View style={styles.gradientOverlay} />

        {/* Property Type Badge */}
        <View style={[styles.propertyTypeBadge, { backgroundColor: getPropertyTypeColor(property.propertyCategory) }]}>
          <Icon name="home" size={12} color="#fff" />
          <Text style={styles.propertyTypeText}>{property.propertyCategory}</Text>
        </View>

        {/* Sell Type Badge */}
        <View style={[styles.sellTypeBadge, { backgroundColor: getSellTypeColor(property.sellType) }]}>
          <Text style={styles.sellTypeText}>{property.sellType}</Text>
        </View>

        {/* Image Count Badge */}
        {(property.uploadedPhotos || property.propertyImages || []).length > 1 && (
          <View style={styles.imageCountBadge}>
            <Icon name="images" size={12} color="#fff" />
            <Text style={styles.imageCountText}>
              {(property.uploadedPhotos || property.propertyImages || []).length}
            </Text>
          </View>
        )}
      </View>

      {/* Card Content */}
      <View style={styles.cardContent}>
        {/* Property Title */}
        <Text style={styles.propertyTitle} numberOfLines={2}>
          {getPropertyTitle()}
        </Text>

        {/* Location Row */}
        <View style={styles.locationRow}>
          <Icon name="location" size={16} color="#FF6B6B" />
          <Text style={styles.locationText} numberOfLines={1}>
            {getLocationText()}
          </Text>
        </View>

        {/* Property Details Grid */}
        <View style={styles.detailsGrid}>
          <View style={styles.detailItem}>
            <View style={styles.detailIconContainer}>
              <Icon name="bed" size={16} color="#4ECDC4" />
            </View>
            <Text style={styles.detailLabel}>Bedrooms</Text>
            <Text style={styles.detailValue}>
              {property.bedrooms}
              {property.bedrooms !== "1RK" ? " BHK" : ""}
            </Text>
          </View>

          <View style={styles.detailItem}>
            <View style={styles.detailIconContainer}>
              <Icon name="resize" size={16} color="#45B7D1" />
            </View>
            <Text style={styles.detailLabel}>Area</Text>
            <Text style={styles.detailValue}>{property.areaSqft} sq.ft</Text>
          </View>

          <View style={styles.detailItem}>
            <View style={styles.detailIconContainer}>
              <Icon name="person" size={16} color="#96CEB4" />
            </View>
            <Text style={styles.detailLabel}>Seller</Text>
            <Text style={styles.detailValue}>{property.sellerType}</Text>
          </View>
        </View>

        {/* Price Section */}
        <View style={styles.priceSection}>
          <View style={styles.priceContainer}>
            <Text style={styles.mainPrice}>{formatPrice(getPrice())}</Text>
            <Text style={styles.priceLabel}>{property.sellType === "Sell" ? "Total Price" : "Per Month"}</Text>
          </View>
          <View style={styles.pricePerSqftContainer}>
            <Text style={styles.pricePerSqft}>{formatPricePerSqft(getPrice(), property.areaSqft)}</Text>
          </View>
        </View>

        {/* Amenities Preview */}
        {property.amenities && property.amenities.length > 0 && (
          <View style={styles.amenitiesPreview}>
            <View style={styles.amenitiesHeader}>
              <Icon name="checkmark-circle" size={14} color="#4CAF50" />
              <Text style={styles.amenitiesLabel}>Key Amenities</Text>
            </View>
            <View style={styles.amenitiesList}>
              {property.amenities.slice(0, 3).map((amenity, index) => (
                <View key={index} style={styles.amenityTag}>
                  <Text style={styles.amenityText}>{amenity}</Text>
                </View>
              ))}
              {property.amenities.length > 3 && (
                <View style={styles.amenityTag}>
                  <Text style={styles.amenityText}>+{property.amenities.length - 3} more</Text>
                </View>
              )}
            </View>
          </View>
        )}

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.viewDetailsButton} onPress={navigateToDetails} activeOpacity={0.8}>
            <Icon name="eye" size={18} color="#fff" />
            <Text style={styles.viewDetailsText}>View Details</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.contactButton} onPress={navigateToDetails} activeOpacity={0.8}>
            <Icon name="call" size={18} color="#232761" />
            <Text style={styles.contactText}>Contact Now</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

const PropertyListingScreen = () => {
  const router = useRouter()
  const params = useLocalSearchParams()

  // Use ref to track if initial load has been done
  const initialLoadDone = useRef(false)

  // Search & header state
  const [searchText, setSearchText] = useState("")
  const [headerCity, setHeaderCity] = useState("")
  const [properties, setProperties] = useState<Property[]>([])
  const [originalProperties, setOriginalProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [appliedFilters, setAppliedFilters] = useState<any>(null)

  // Filter modal visibility state
  const [showFilters, setShowFilters] = useState(false)

  // Filter states for FilterDesign component
  const bedroomOptions = ["1RK", "1BHK", "2BHK", "3BHK", "4BHK", "5+BHK"]
  const [selectedBedrooms, setSelectedBedrooms] = useState<string[]>([])

  // Area Range
  const [areaRange, setAreaRange] = useState<[number, number]>([1800, 12400])
  const [minArea, setMinArea] = useState("1800")
  const [maxArea, setMaxArea] = useState("12400")

  // Price Range
  const [priceRange, setPriceRange] = useState<[number, number]>([21.0, 64.3])
  const [minPrice, setMinPrice] = useState("210321000")
  const [maxPrice, setMaxPrice] = useState("642981000")

  // Property Types
  const propertyTypeOptions = [
    "Flats/Apartment",
    "Independent House/Villa",
    "Independent/Builder Floor",
    "Plot/Land",
    "1RK/Studio Apartment",
    "Serviced Apartment",
    "Farmhouse",
  ]
  const [selectedPropertyTypes, setSelectedPropertyTypes] = useState<string[]>([])

  // Construction Status
  const constructionStatusOptions = ["New Launch", "Under Construction", "Ready to move"]
  const [selectedConstructionStatus, setSelectedConstructionStatus] = useState<string[]>([])

  // Posted By
  const postedByOptions = ["Owner", "Builder", "Dealer", "Feature Dealer"]
  const [selectedPostedBy, setSelectedPostedBy] = useState<string[]>([])

  // Amenities
  const amenitiesOptions = ["Car Parking", "CCTV", "Guard", "Gym", "Club House", "Water Supply", "Lift"]
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([])

  // Load filters from saved data
  const loadFiltersFromData = useCallback((filters: any) => {
    setSelectedBedrooms(filters.bedrooms || [])
    setAreaRange(filters.areaRange || [1800, 12400])
    setMinArea(filters.minArea || "1800")
    setMaxArea(filters.maxArea || "12400")
    setPriceRange(filters.priceRange || [21.0, 64.3])
    setMinPrice(filters.minPrice || "210321000")
    setMaxPrice(filters.maxPrice || "642981000")
    setSelectedPropertyTypes(filters.propertyTypes || [])
    setSelectedConstructionStatus(filters.constructionStatus || [])
    setSelectedPostedBy(filters.postedBy || [])
    setSelectedAmenities(filters.amenities || [])
  }, [])

  // Search properties with backend API
  const searchProperties = useCallback(
    async (locationData?: any) => {
      try {
        setLoading(true)
        const location = locationData || (await AsyncStorage.getItem("searchLocation"))
        const parsedLocation = typeof location === "string" ? JSON.parse(location) : location

        if (!parsedLocation) {
          Alert.alert("Error", "No search location found")
          return
        }

        const response = await axios.post(`${BASE_URL}/api/search_properties`, {
          latitude: parsedLocation.latitude,
          longitude: parsedLocation.longitude,
          radius: parsedLocation.radius || 5,
        })

        // Transform the data if needed to match the expected structure
        const transformedProperties = Array.isArray(response.data)
          ? response.data.map((property: any) => {
            const heading = property?.heading || property?.propertyTitle || "Untitled"
            const uploadedPhotos = Array.isArray(property?.uploadedPhotos)
              ? property.uploadedPhotos
              : Array.isArray(property?.propertyImages)
                ? property.propertyImages
                : []

            const landmark = property?.landmark || ""
            const city = property?.city || ""
            const propertyLocation =
              typeof property?.propertyLocation === "string"
                ? property.propertyLocation
                : `${landmark}, ${city}`.trim().replace(/^,\s*/, "")

            return {
              ...property,
              heading,
              uploadedPhotos,
              landmark,
              city,
              propertyLocation,
            }
          })
          : []


        setProperties(transformedProperties as Property[])
        setOriginalProperties(transformedProperties as Property[])
      } catch (error) {
        console.error("Error searching properties:", error)
        setProperties([])
        setOriginalProperties([])
      } finally {
        setLoading(false)
      }
    },
    [BASE_URL],
  )

  // Load initial data from route params or AsyncStorage
  useEffect(() => {
    const loadInitialData = async () => {
      // Prevent multiple initial loads
      if (initialLoadDone.current) return

      try {
        // Check if data was passed from navigation
        if (params?.properties) {
          const propertiesData =
            typeof params.properties === "string" ? JSON.parse(params.properties) : params.properties
          setProperties(propertiesData)
          setOriginalProperties(propertiesData)
          setHeaderCity((params.searchQuery as string) || "")
          setSearchText((params.searchQuery as string) || "")

          if (params.appliedFilters) {
            const filters =
              typeof params.appliedFilters === "string" ? JSON.parse(params.appliedFilters) : params.appliedFilters
            setAppliedFilters(filters)
            loadFiltersFromData(filters)
          }
          initialLoadDone.current = true
          return
        }

        // Load from AsyncStorage only if no params
        const savedLocation = await AsyncStorage.getItem("searchLocation")
        const savedFilters = await AsyncStorage.getItem("propertyFilters")

        if (savedLocation) {
          const location = JSON.parse(savedLocation)
          setSearchText(location.query || "")
          setHeaderCity(location.query || "")
          await searchProperties(location)
        }

        if (savedFilters) {
          const filters = JSON.parse(savedFilters)
          loadFiltersFromData(filters)
        }

        initialLoadDone.current = true
      } catch (error) {
        console.error("Error loading initial data:", error)
        initialLoadDone.current = true
      }
    }

    loadInitialData()
  }, [])

  // Handle search button press
  const handleSearch = async () => {
    if (!searchText.trim()) {
      Alert.alert("Error", "Please enter a location to search")
      return
    }

    try {
      setLoading(true)

      // Geocode the search text
      const apiKey = GOOGLE_API_KEY
      const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(searchText)}&key=${apiKey}`

      const response = await fetch(geocodeUrl)
      const data = await response.json()

      if (data.status === "OK" && data.results.length > 0) {
        const location = data.results[0].geometry.location
        const locationData = {
          latitude: location.lat,
          longitude: location.lng,
          query: searchText,
          radius: 5,
        }

        await AsyncStorage.setItem("searchLocation", JSON.stringify(locationData))
        setHeaderCity(searchText)
        await searchProperties(locationData)
      } else {
        Alert.alert("Error", "Location not found. Please try a different search term.")
      }
    } catch (error) {
      console.error("Error searching:", error)
      Alert.alert("Error", "Failed to search. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  // Handle clear search
  const handleClear = () => {
    setSearchText("")
    setHeaderCity("")
    setProperties([])
    setOriginalProperties([])
  }

  // Handle refresh
  const onRefresh = async () => {
    setRefreshing(true)
    await searchProperties()
    setRefreshing(false)
  }

  // Handle filter application
  const handleFiltersApplied = (filteredProperties: Property[]) => {
    setProperties(filteredProperties)
    setShowFilters(false)
  }

  const clearAll = () => {
    setSelectedBedrooms([])
    setAreaRange([1800, 12400])
    setMinArea("1800")
    setMaxArea("12400")
    setPriceRange([21.0, 64.3])
    setMinPrice("210321000")
    setMaxPrice("642981000")
    setSelectedPropertyTypes([])
    setSelectedConstructionStatus([])
    setSelectedPostedBy([])
    setSelectedAmenities([])
  }

  const statusBarHeight = StatusBar.currentHeight || 0

  return (
    <SafeAreaView style={[styles.container, { marginTop: statusBarHeight }]}>
      {/* Header with back button */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Icon name="arrow-back" size={24} color="#232761" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Properties</Text>
      </View>

      {/* Search Container */}
      <View style={styles.searchContainer}>
        <View style={styles.searchRow}>
          <View style={styles.inputContainer}>
            <Icon name="location-outline" size={20} color="#666" />
            <TextInput
              style={styles.input}
              value={searchText}
              onChangeText={setSearchText}
              placeholder="Enter location to search"
              placeholderTextColor="#999"
            />
          </View>
          <TouchableOpacity
            style={[styles.iconButton, loading && styles.disabledButton]}
            onPress={handleSearch}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#1a237e" />
            ) : (
              <Icon name="search-outline" size={24} color="#1a237e" />
            )}
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton} onPress={handleClear}>
            <Icon name="close-circle-outline" size={24} color="#1a237e" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton} onPress={() => setShowFilters(true)}>
            <Icon name="filter-outline" size={24} color="#1a237e" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Results */}
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {headerCity && (
          <View style={styles.resultHeader}>
            <Text style={styles.resultCount}>
              {properties.length} Properties for sale in {headerCity}
            </Text>
            <Text style={styles.updateDate}>Updated: 23/07/2025</Text>
          </View>
        )}

        {loading && properties.length === 0 ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#232761" />
            <Text style={styles.loadingText}>Searching properties...</Text>
          </View>
        ) : properties.length === 0 && initialLoadDone.current ? (
          <View style={styles.emptyContainer}>
            <Icon name="home-outline" size={64} color="#ccc" />
            <Text style={styles.emptyTitle}>No Properties Found</Text>
            <Text style={styles.emptyText}>Try adjusting your search criteria or location</Text>
          </View>
        ) : (
          properties.map((property) => <PropertyCard key={property._id} property={property} />)
        )}
      </ScrollView>

      {/* Filter Modal with FilterDesign Component */}
      <Modal visible={showFilters} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <FilterDesign
              selectedCity={headerCity}
              searchQuery={searchText}
              setShowFilters={setShowFilters}
              bedroomOptions={bedroomOptions}
              selectedBedrooms={selectedBedrooms}
              setSelectedBedrooms={setSelectedBedrooms}
              areaRange={areaRange}
              setAreaRange={setAreaRange}
              minArea={minArea}
              setMinArea={setMinArea}
              maxArea={maxArea}
              setMaxArea={setMaxArea}
              priceRange={priceRange}
              setPriceRange={setPriceRange}
              minPrice={minPrice}
              setMinPrice={setMinPrice}
              maxPrice={maxPrice}
              setMaxPrice={setMaxPrice}
              propertyTypeOptions={propertyTypeOptions}
              selectedPropertyTypes={selectedPropertyTypes}
              setSelectedPropertyTypes={setSelectedPropertyTypes}
              constructionStatusOptions={constructionStatusOptions}
              selectedConstructionStatus={selectedConstructionStatus}
              setSelectedConstructionStatus={setSelectedConstructionStatus}
              postedByOptions={postedByOptions}
              selectedPostedBy={selectedPostedBy}
              setSelectedPostedBy={setSelectedPostedBy}
              amenitiesOptions={amenitiesOptions}
              selectedAmenities={selectedAmenities}
              setSelectedAmenities={setSelectedAmenities}
              clearAll={clearAll}
              onApplyFilters={handleFiltersApplied}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  backButton: {
    marginRight: 16,
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#232761",
  },
  searchContainer: {
    padding: 12,
    backgroundColor: "#fff",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  inputContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  input: {
    flex: 1,
    paddingLeft: 8,
    paddingVertical: 14,
    fontSize: 15,
    color: "#333",
  },
  iconButton: {
    padding: 10,
    borderRadius: 8,
    backgroundColor: "#f0f0f0",
  },
  disabledButton: {
    opacity: 0.6,
  },
  scrollView: {
    flex: 1,
  },
  resultHeader: {
    padding: 16,
    backgroundColor: "#fff",
    marginBottom: 8,
  },
  resultCount: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
    marginBottom: 4,
  },
  updateDate: {
    fontSize: 14,
    color: "#666",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 50,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#666",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 50,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    paddingHorizontal: 32,
  },

  // Enhanced Card Styles
  card: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginBottom: 20,
    borderRadius: 16,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    overflow: "hidden",
  },
  imageContainer: {
    position: "relative",
    height: 220,
  },
  propertyImage: {
    width: "100%",
    height: "100%",
    backgroundColor: "#e0e0e0",
  },
  gradientOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 60,
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  propertyTypeBadge: {
    position: "absolute",
    top: 12,
    left: 12,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
  },
  propertyTypeText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "700",
  },
  sellTypeBadge: {
    position: "absolute",
    top: 12,
    right: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  sellTypeText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "700",
  },
  imageCountBadge: {
    position: "absolute",
    bottom: 12,
    right: 12,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.7)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  imageCountText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "600",
  },
  cardContent: {
    padding: 20,
  },
  propertyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 12,
    lineHeight: 24,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 6,
  },
  locationText: {
    fontSize: 14,
    color: "#666",
    flex: 1,
    fontWeight: "500",
  },
  detailsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    paddingVertical: 16,
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    paddingHorizontal: 12,
  },
  detailItem: {
    alignItems: "center",
    flex: 1,
  },
  detailIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 6,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  detailLabel: {
    fontSize: 11,
    color: "#888",
    fontWeight: "500",
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 13,
    color: "#333",
    fontWeight: "700",
    textAlign: "center",
  },
  priceSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "#f0f8ff",
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: "#232761",
  },
  priceContainer: {
    flex: 1,
  },
  mainPrice: {
    fontSize: 22,
    fontWeight: "800",
    color: "#232761",
    marginBottom: 2,
  },
  priceLabel: {
    fontSize: 12,
    color: "#666",
    fontWeight: "500",
  },
  pricePerSqftContainer: {
    alignItems: "flex-end",
  },
  pricePerSqft: {
    fontSize: 13,
    color: "#666",
    fontWeight: "600",
    backgroundColor: "#fff",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  amenitiesPreview: {
    marginBottom: 20,
  },
  amenitiesHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    gap: 6,
  },
  amenitiesLabel: {
    fontSize: 14,
    color: "#333",
    fontWeight: "600",
  },
  amenitiesList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  amenityTag: {
    backgroundColor: "#e8f5e8",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#c8e6c9",
  },
  amenityText: {
    fontSize: 11,
    color: "#2e7d32",
    fontWeight: "600",
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 12,
  },
  viewDetailsButton: {
    flex: 1,
    backgroundColor: "#232761",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
    elevation: 2,
    shadowColor: "#232761",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  viewDetailsText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },
  contactButton: {
    flex: 1,
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#232761",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  contactText: {
    color: "#232761",
    fontSize: 15,
    fontWeight: "700",
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    height: "90%",
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: "hidden",
  },
})

export default PropertyListingScreen
