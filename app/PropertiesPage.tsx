"use client"

import { useState, useEffect } from "react"
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
} from "react-native"
import Icon from "react-native-vector-icons/Ionicons"
import FilterDesign from "./components/FilterDesign"
import { useRouter, useLocalSearchParams } from "expo-router"
import AsyncStorage from "@react-native-async-storage/async-storage"
import axios from "axios"

const dummyImg = require("../assets/images/dummyImg.webp")

interface Property {
  _id: string
  propertyTitle: string
  propertyCategory: string
  sellType: string
  bedrooms: string
  areaSqft: string
  expectedPrice: string
  propertyLocation: string
  propertyImages: string[]
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

  const formatPrice = (price: string | number) => {
    const numPrice = typeof price === "string" ? Number.parseInt(price) : price
    if (numPrice >= 10000000) {
      return `₹ ${(numPrice / 10000000).toFixed(1)} CR`
    } else if (numPrice >= 100000) {
      return `₹ ${(numPrice / 100000).toFixed(1)} L`
    } else {
      return `₹ ${numPrice.toLocaleString()}`
    }
  }

  const formatPricePerSqft = (price: string, area: string) => {
    const numPrice = Number.parseInt(price)
    const numArea = Number.parseInt(area)
    if (numArea > 0) {
      const pricePerSqft = numPrice / numArea
      return `₹ ${Math.round(pricePerSqft).toLocaleString()}/sq.ft`
    }
    return "Price on request"
  }

  const getPropertyImage = () => {
    if (property.propertyImages && property.propertyImages.length > 0) {
      return { uri: property.propertyImages[0] }
    }
    return dummyImg
  }

  return (
    <View style={styles.card}>
      <View style={styles.imageContainer}>
        <Image source={getPropertyImage()} style={styles.propertyImage} />
        <View style={styles.propertyTypeTag}>
          <Text style={styles.propertyTypeText}>{property.propertyCategory}</Text>
        </View>
        <View style={styles.sellTypeTag}>
          <Text style={styles.sellTypeText}>{property.sellType}</Text>
        </View>
      </View>
      <View style={styles.cardContent}>
        <Text style={styles.propertyTitle} numberOfLines={2}>
          {property.propertyTitle}
        </Text>

        <View style={styles.featuresRow}>
          <View style={styles.featureItem}>
            <Icon name="location-outline" size={16} color="#666" />
            <Text style={styles.featureText} numberOfLines={1}>
              {property.propertyLocation}
            </Text>
          </View>
          <View style={styles.featureItem}>
            <Icon name="home-outline" size={16} color="#666" />
            <Text style={styles.featureText}>{property.areaSqft} sq.ft</Text>
          </View>
        </View>

        <View style={styles.bedroomRow}>
          <View style={styles.featureItem}>
            <Icon name="bed-outline" size={16} color="#666" />
            <Text style={styles.featureText}>{property.bedrooms}</Text>
          </View>
          <View style={styles.featureItem}>
            <Icon name="person-outline" size={16} color="#666" />
            <Text style={styles.featureText}>{property.sellerType}</Text>
          </View>
        </View>

        <View style={styles.priceContainer}>
          <Text style={styles.pricePerSqft}>{formatPricePerSqft(property.expectedPrice, property.areaSqft)}</Text>
          <Text style={styles.price}>{formatPrice(property.expectedPrice)}</Text>
        </View>

        {property.amenities && property.amenities.length > 0 && (
          <View style={styles.amenitiesContainer}>
            <Text style={styles.amenitiesLabel}>Amenities:</Text>
            <Text style={styles.amenitiesText} numberOfLines={1}>
              {property.amenities.slice(0, 3).join(", ")}
              {property.amenities.length > 3 && "..."}
            </Text>
          </View>
        )}

        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={styles.viewButton}
            onPress={() => {
              router.push({
                pathname: "/PropertyDetailsPage",
                params: { propertyId: property._id },
              })
            }}
          >
            <Icon name="eye-outline" size={18} color="#fff" />
            <Text style={styles.viewButtonText}>View Details</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.contactButton}>
            <Icon name="call-outline" size={18} color="#232761" />
            <Text style={styles.contactButtonText}>Contact</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

const PropertyListingScreen = () => {
  const router = useRouter()
  const params = useLocalSearchParams()
  const BASE_URL = "http://localhost:6005";

  // Search & header state
  const [searchText, setSearchText] = useState("")
  const [headerCity, setHeaderCity] = useState("")
  const [properties, setProperties] = useState<Property[]>([])
  const [originalProperties, setOriginalProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [appliedFilters, setAppliedFilters] = useState<any>(null)
  const [hasSearched, setHasSearched] = useState(false) // Track if search has been performed

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

  // Load initial data from route params or AsyncStorage
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        // Check if data was passed from navigation
        if (params?.properties) {
          const propertiesData =
            typeof params.properties === "string" ? JSON.parse(params.properties) : params.properties
          setProperties(propertiesData)
          setOriginalProperties(propertiesData)
          setHeaderCity((params.searchQuery as string) || "")
          setSearchText((params.searchQuery as string) || "")
          setHasSearched(true)
          if (params.appliedFilters) {
            const filters = typeof params.appliedFilters === "string" ? JSON.parse(params.appliedFilters) : params.appliedFilters
            setAppliedFilters(filters)
            loadFiltersFromData(filters)
          }
          return
        }

        // Load from AsyncStorage only if no params
        const savedLocation = await AsyncStorage.getItem("searchLocation")
        const savedFilters = await AsyncStorage.getItem("propertyFilters")

        if (savedLocation) {
          const location = JSON.parse(savedLocation)
          setSearchText(location.query || "")
          setHeaderCity(location.query || "")
          // Only search if we haven't searched yet
          if (!hasSearched) {
            await searchProperties(location)
          }
        }

        if (savedFilters) {
          const filters = JSON.parse(savedFilters)
          loadFiltersFromData(filters)
        }
      } catch (error) {
        console.error("Error loading initial data:", error)
      }
    }

    loadInitialData()
  }, [params])

  // Load filters from saved data
  const loadFiltersFromData = (filters: any) => {
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
  }

  // Search properties with backend API
  const searchProperties = async (locationData?: any) => {
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

      setProperties(response.data as Property[])
      setOriginalProperties(response.data as Property[])
      setHasSearched(true)
    } catch (error) {
      console.error("Error searching properties:", error)
      setProperties([])
      setOriginalProperties([])
      setHasSearched(true)
    } finally {
      setLoading(false)
    }
  }

  // Handle search button press
  const handleSearch = async () => {
    if (!searchText.trim()) {
      Alert.alert("Error", "Please enter a location to search")
      return
    }

    try {
      setLoading(true)
      setHasSearched(false) // Reset search state

      // Geocode the search text
      const apiKey = "AIzaSyCd2I5FCBPa4-W9Ms1VQxhuKm4LeAF-Iiw"
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
        setHasSearched(true)
      }
    } catch (error) {
      console.error("Error searching:", error)
      Alert.alert("Error", "Failed to search. Please try again.")
      setHasSearched(true)
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
    setHasSearched(false)
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
            <Text style={styles.updateDate}>Updated: {new Date().toLocaleDateString()}</Text>
          </View>
        )}

        {loading && properties.length === 0 ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#232761" />
            <Text style={styles.loadingText}>Searching properties...</Text>
          </View>
        ) : hasSearched && properties.length === 0 ? (
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
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#232761",
  },
  searchContainer: {
    padding: 8,
    backgroundColor: "#fff",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  inputContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  input: {
    flex: 1,
    paddingLeft: 8,
    paddingVertical: 12,
    fontSize: 14,
    color: "#333",
  },
  iconButton: {
    padding: 8,
  },
  disabledButton: {
    opacity: 0.6,
  },
  scrollView: {
    flex: 1,
  },
  resultHeader: {
    padding: 16,
  },
  resultCount: {
    fontSize: 16,
    fontWeight: "600",
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
  card: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    overflow: "hidden",
  },
  imageContainer: {
    position: "relative",
  },
  propertyImage: {
    width: "100%",
    height: 180,
    backgroundColor: "#e0e0e0",
  },
  propertyTypeTag: {
    position: "absolute",
    top: 12,
    left: 12,
    backgroundColor: "#232761",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  propertyTypeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  sellTypeTag: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  sellTypeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  cardContent: {
    padding: 16,
  },
  propertyTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 12,
    lineHeight: 22,
  },
  featuresRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  bedroomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  featureText: {
    marginLeft: 6,
    fontSize: 13,
    color: "#666",
    flex: 1,
  },
  priceContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
    marginBottom: 12,
  },
  pricePerSqft: {
    fontSize: 13,
    color: "#666",
  },
  price: {
    fontSize: 18,
    fontWeight: "700",
    color: "#232761",
  },
  amenitiesContainer: {
    marginBottom: 16,
  },
  amenitiesLabel: {
    fontSize: 13,
    color: "#666",
    marginBottom: 4,
  },
  amenitiesText: {
    fontSize: 13,
    color: "#333",
    fontWeight: "500",
  },
  buttonRow: {
    flexDirection: "row",
    gap: 12,
  },
  viewButton: {
    flex: 1,
    backgroundColor: "#232761",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    borderRadius: 8,
    gap: 8,
  },
  viewButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  contactButton: {
    flex: 1,
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: "#232761",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    borderRadius: 8,
    gap: 8,
  },
  contactButtonText: {
    color: "#232761",
    fontSize: 14,
    fontWeight: "600",
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