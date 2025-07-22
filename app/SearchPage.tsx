"use client"

import React from "react"
import { useState, useEffect } from "react"
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  StatusBar,
  Alert,
  ActivityIndicator,
  PermissionsAndroid,
  Platform,
} from "react-native"
import Icon from "react-native-vector-icons/MaterialCommunityIcons"
import { useRouter } from "expo-router"
import MultiSlider from "@ptomasroos/react-native-multi-slider"
import AsyncStorage from "@react-native-async-storage/async-storage"
import axios from "axios"
import * as Location from "expo-location"

const { width } = Dimensions.get("window")

const PropertySearchAndFilter = () => {
  const router = useRouter()
  const statusBarHeight = StatusBar.currentHeight || 0
  const BASE_URL = "http://localhost:6005"

  // Basic states for Category, Search, etc.
  const [selectedType, setSelectedType] = useState("Sell")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCity, setSelectedCity] = useState<string | null>(null)
  const [showFilters, setShowFilters] = useState(false)
  const [loading, setLoading] = useState(false)
  const [locationLoading, setLocationLoading] = useState(false)

  // Location states
  const [placePredictions, setPlacePredictions] = useState<any[]>([])
  const [latitude, setLatitude] = useState(-1)
  const [longitude, setLongitude] = useState(-1)
  const [cityCordinates, setCityCordinates] = useState([-1, -1])
  const [radius, setRadius] = useState(5)
  const [currentLocationName, setCurrentLocationName] = useState("")

  // Filter States
  const [selectedBedrooms, setSelectedBedrooms] = useState<string[]>([])
  const [areaRange, setAreaRange] = useState<[number, number]>([1800, 12400])
  const [minArea, setMinArea] = useState("1800")
  const [maxArea, setMaxArea] = useState("12400")
  const [priceRange, setPriceRange] = useState<[number, number]>([21.0, 64.3])
  const [minPrice, setMinPrice] = useState("210321000")
  const [maxPrice, setMaxPrice] = useState("642981000")
  const [selectedPropertyTypes, setSelectedPropertyTypes] = useState<string[]>([])
  const [selectedConstructionStatus, setSelectedConstructionStatus] = useState<string[]>([])
  const [selectedPostedBy, setSelectedPostedBy] = useState<string[]>([])
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([])

  // Filter Option Arrays
  const bedroomOptions = ["1RK", "1BHK", "2BHK", "3BHK", "4BHK", "5+BHK"]
  const propertyTypeOptions = [
    "Flats/Apartment",
    "Independent House/Villa",
    "Independent/Builder Floor",
    "Plot/Land",
    "1RK/Studio Apartment",
    "Serviced Apartment",
    "Farmhouse",
  ]
  const constructionStatusOptions = ["New Launch", "Under Construction", "Ready to move"]
  const postedByOptions = ["Owner", "Builder", "Dealer", "Feature Dealer"]
  const amenitiesOptions = ["Car Parking", "CCTV", "Guard", "Gym", "Club House", "Water Supply", "Lift"]

  // Popular cities & city suggestions
  const popularCities = ["Noida", "Delhi", "Mumbai", "Chennai", "Gurgaon", "Bangalore", "Hyderabad"]
  const cities = [
    "Pune",
    "Mumbai",
    "Solapur",
    "Satara",
    "Amravati",
    "Nashik",
    "Delhi",
    "Hyderabad",
    "Noida",
    "Bangalore",
    "Chennai",
    "Kolkata",
    "Ahmedabad",
  ]

  const [index, setIndex] = useState(0)

  // Animated city names
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % cities.length)
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  // Request location permissions
  const requestLocationPermission = async () => {
    try {
      if (Platform.OS === "android") {
        const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, {
          title: "Location Permission",
          message: "This app needs access to your location to find nearby properties.",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK",
        })
        return granted === PermissionsAndroid.RESULTS.GRANTED
      } else {
        // For iOS, expo-location handles permissions automatically
        const { status } = await Location.requestForegroundPermissionsAsync()
        return status === "granted"
      }
    } catch (error) {
      console.error("Error requesting location permission:", error)
      return false
    }
  }

  // Get current location
  const getCurrentLocation = async () => {
    setLocationLoading(true)
    try {
      // Request permission first
      const hasPermission = await requestLocationPermission()
      if (!hasPermission) {
        Alert.alert(
          "Permission Denied",
          "Location permission is required to use this feature. Please enable it in your device settings.",
        )
        return
      }

      // Check if location services are enabled
      const isLocationEnabled = await Location.hasServicesEnabledAsync()
      if (!isLocationEnabled) {
        Alert.alert(
          "Location Services Disabled",
          "Please enable location services in your device settings to use this feature.",
        )
        return
      }

      // Get current position
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      })

      const { latitude: lat, longitude: lng } = location.coords
      setLatitude(lat)
      setLongitude(lng)

      // Get address from coordinates
      const locationName = await getAddressFromCoordinates(lat, lng)

      // Save location data with actual location name
      await saveLocationData(lat, lng, locationName)

      Alert.alert("Success", "Current location detected successfully!")
    } catch (error) {
      console.error("Error getting current location:", error)
      Alert.alert(
        "Location Error",
        "Unable to get your current location. Please check your GPS settings and try again.",
      )
    } finally {
      setLocationLoading(false)
    }
  }

  // Get address from coordinates using reverse geocoding
  const getAddressFromCoordinates = async (lat: number, lng: number): Promise<string> => {
    try {
      const apiKey = "AIzaSyCd2I5FCBPa4-W9Ms1VQxhuKm4LeAF-Iiw"
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`,
      )
      const data = await response.json()

      if (data.status === "OK" && data.results.length > 0) {
        const result = data.results[0]
        const addressComponents = result.address_components

        // Extract city name
        const cityComponent = addressComponents.find(
          (component: any) =>
            component.types.includes("locality") || component.types.includes("administrative_area_level_2"),
        )

        const areaComponent = addressComponents.find(
          (component: any) =>
            component.types.includes("sublocality_level_1") || component.types.includes("neighborhood"),
        )

        const locationName = areaComponent
          ? `${areaComponent.long_name}, ${cityComponent?.long_name || "Unknown City"}`
          : cityComponent?.long_name || result.formatted_address

        setCurrentLocationName(locationName)
        setSearchQuery(locationName)
        setSelectedCity(locationName)

        return locationName
      } else {
        console.error("Reverse geocoding failed:", data.status)
        const fallbackName = "Current Location"
        setCurrentLocationName(fallbackName)
        setSearchQuery(fallbackName)
        return fallbackName
      }
    } catch (error) {
      console.error("Error in reverse geocoding:", error)
      const fallbackName = "Current Location"
      setCurrentLocationName(fallbackName)
      setSearchQuery(fallbackName)
      return fallbackName
    }
  }

  // Google Places Autocomplete using HTTP API
  const handlePlaceChange = async (text: string) => {
    setSearchQuery(text)
    if (text.length > 2) {
      try {
        const apiKey = "AIzaSyCd2I5FCBPa4-W9Ms1VQxhuKm4LeAF-Iiw"
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(text)}&key=${apiKey}&components=country:in`,
        )
        const data = await response.json()

        if (data.status === "OK") {
          setPlacePredictions(data.predictions || [])
        } else {
          setPlacePredictions([])
        }
      } catch (error) {
        console.error("Error fetching place predictions:", error)
        setPlacePredictions([])
      }
    } else {
      setPlacePredictions([])
    }
  }

  const handlePlaceSelect = async (place: any) => {
    setSearchQuery(place.description)
    setPlacePredictions([])
    setLoading(true)

    try {
      const apiKey = "AIzaSyCd2I5FCBPa4-W9Ms1VQxhuKm4LeAF-Iiw"
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place.place_id}&key=${apiKey}`,
      )
      const data = await response.json()

      if (data.status === "OK" && data.result) {
        const lat = data.result.geometry.location.lat
        const lng = data.result.geometry.location.lng
        setLatitude(lat)
        setLongitude(lng)
        await saveLocationData(lat, lng, place.description)
      } else {
        console.error("Error fetching place details:", data.status)
      }
    } catch (error) {
      console.error("Error fetching place details:", error)
    } finally {
      setLoading(false)
    }
  }

  // Save location data to AsyncStorage
  const saveLocationData = async (lat: number, lng: number, query: string) => {
    try {
      const locationData = {
        latitude: lat,
        longitude: lng,
        query,
        radius,
      }
      await AsyncStorage.setItem("searchLocation", JSON.stringify(locationData))
    } catch (error) {
      console.error("Error saving location data:", error)
    }
  }

  // Handle city selection from geocoding
  const handleCitySelect = async (city: string) => {
    setLoading(true)
    try {
      const apiKey = "AIzaSyCd2I5FCBPa4-W9Ms1VQxhuKm4LeAF-Iiw"
      const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(city)}&key=${apiKey}`

      const response = await fetch(geocodeUrl)
      const data = await response.json()

      if (data.status === "OK" && data.results.length > 0) {
        const location = data.results[0].geometry.location
        setCityCordinates([location.lat, location.lng])
        setLatitude(location.lat)
        setLongitude(location.lng)
        await saveLocationData(location.lat, location.lng, city)
      } else {
        console.error("Geocode failed:", data.status)
        Alert.alert("Error", "Failed to find location coordinates")
      }
    } catch (error) {
      console.error("Error fetching coordinates:", error)
      Alert.alert("Error", "Failed to fetch location data")
    } finally {
      setLoading(false)
    }
  }

  // Search properties with backend API
  const searchProperties = async () => {
    try {
      setLoading(true)
      let lat = latitude
      let lng = longitude
      let searchRadius = radius

      if (latitude === -1 && longitude === -1) {
        lat = cityCordinates[0]
        lng = cityCordinates[1]
        searchRadius = 50
      }

      if (lat === -1 || lng === -1) {
        Alert.alert("Error", "Please select a location first")
        return
      }

      const response = await axios.post(`${BASE_URL}/api/search_properties`, {
        latitude: lat,
        longitude: lng,
        radius: searchRadius,
      })

      // Apply filters to the results
      const filteredResults = applyFiltersToResults(response.data as any[])

      // Save filters to AsyncStorage
      await saveFiltersToStorage()

      // Navigate to results page
      router.push({
        pathname: "/PropertiesPage",
        params: {
          properties: JSON.stringify(filteredResults),
          searchQuery: searchQuery || selectedCity || "",
          appliedFilters: JSON.stringify({
            category: selectedType === "Commercial" ? "Commercial" : "Residential",
            type: selectedType,
            bedrooms: selectedBedrooms,
            areaRange,
            minArea,
            maxArea,
            priceRange,
            minPrice,
            maxPrice,
            propertyTypes: selectedPropertyTypes,
            constructionStatus: selectedConstructionStatus,
            postedBy: selectedPostedBy,
            amenities: selectedAmenities,
          }),
        },
      })
    } catch (error) {
      console.error("Error searching properties:", error)
      Alert.alert("Error", "Failed to search properties. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  // Save filters to AsyncStorage
  const saveFiltersToStorage = async () => {
    try {
      const filters = {
        category: selectedType === "Commercial" ? "Commercial" : "Residential",
        type: selectedType,
        bedrooms: selectedBedrooms,
        areaRange,
        minArea,
        maxArea,
        priceRange,
        minPrice,
        maxPrice,
        propertyTypes: selectedPropertyTypes,
        constructionStatus: selectedConstructionStatus,
        postedBy: selectedPostedBy,
        amenities: selectedAmenities,
      }
      await AsyncStorage.setItem("propertyFilters", JSON.stringify(filters))
    } catch (error) {
      console.error("Error saving filters:", error)
    }
  }

  // Apply filters to search results
  const applyFiltersToResults = (properties: any[]) => {
    return properties.filter((property) => {
      // Category filter
      if (selectedType === "Commercial" && property.propertyCategory !== "Commercial") {
        return false
      }
      if (selectedType === "Residential" && property.propertyCategory !== "Residential") {
        return false
      }

      // Bedrooms filter
      if (selectedBedrooms.length > 0) {
        let matchesFilter = false
        selectedBedrooms.forEach((filterBedroom) => {
          if (filterBedroom.includes(property.bedrooms)) {
            if ((filterBedroom === "1RK" && property.bedrooms === "1RK") || filterBedroom !== "1RK") {
              matchesFilter = true
            }
          }
        })
        if (!matchesFilter) return false
      }

      // Area filter
      const areaSqft = Number.parseInt(property.areaSqft)
      if (areaSqft < areaRange[0] || areaSqft > areaRange[1]) {
        return false
      }

      // Price filter
      const expectedPrice = Number.parseInt(property.expectedPrice)
      const minPriceValue = priceRange[0] * 10000000
      const maxPriceValue = priceRange[1] * 10000000
      if (expectedPrice < minPriceValue || expectedPrice > maxPriceValue) {
        return false
      }

      // Type filter (Sell/Rent/PG)
      if (selectedType && property.sellType.toLowerCase() !== selectedType.toLowerCase()) {
        return false
      }

      // Property types filter
      if (selectedPropertyTypes.length > 0) {
        let matchesFilter = false
        selectedPropertyTypes.forEach((filterPropertyType) => {
          if (property.propertyContains.includes(filterPropertyType)) {
            matchesFilter = true
          }
        })
        if (!matchesFilter) return false
      }

      // Amenities filter
      if (selectedAmenities.length > 0) {
        let matchesFilter = false
        selectedAmenities.forEach((filterAmenity) => {
          if (property.amenities.includes(filterAmenity)) {
            matchesFilter = true
          }
        })
        if (!matchesFilter) return false
      }

      // Construction status filter
      if (selectedConstructionStatus.length > 0) {
        let matchesFilter = false
        selectedConstructionStatus.forEach((filterStatus) => {
          if (property.oldProperty === filterStatus) {
            matchesFilter = true
          }
        })
        if (!matchesFilter) return false
      }

      // Posted by filter
      if (selectedPostedBy.length > 0) {
        let matchesFilter = false
        selectedPostedBy.forEach((filterPostedBy) => {
          if (property.sellerType === filterPostedBy) {
            matchesFilter = true
          }
        })
        if (!matchesFilter) return false
      }

      return true
    })
  }

  const handleTypeSelect = (type: string) => {
    setSelectedType(type)
  }

  const handleCitySelectFromList = (city: string) => {
    setSelectedCity(city)
    setSearchQuery(city)
    handleCitySelect(city)
  }

  const handleNext = () => {
    if (searchQuery.trim() || selectedCity) {
      setShowFilters(true)
    }
  }

  const handleBack = () => {
    setShowFilters(false)
  }

  // Toggle selection for any array-based filter
  const toggleItem = (
    item: string,
    selectedList: string[],
    setSelectedList: React.Dispatch<React.SetStateAction<string[]>>,
  ) => {
    setSelectedList((prev) => (prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]))
  }

  // Clear all filters
  const clearAll = () => {
    setSelectedBedrooms([])
    setMinArea("1800")
    setMaxArea("12400")
    setAreaRange([1800, 12400])
    setMinPrice("210321000")
    setMaxPrice("642981000")
    setPriceRange([21.0, 64.3])
    setSelectedPropertyTypes([])
    setSelectedConstructionStatus([])
    setSelectedPostedBy([])
    setSelectedAmenities([])
  }

  // Render: Search View
  const renderSearchView = () => (
    <>
      <ScrollView style={styles.scrollView}>
        {/* Search Input */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder={`Try - ${cities[index]}`}
            placeholderTextColor="#666"
            value={searchQuery}
            onChangeText={handlePlaceChange}
          />
        </View>

        {/* Place Predictions - Modified to show only first 4 with ScrollView */}
        {placePredictions.length > 0 && (
          <View style={styles.predictionsContainer}>
            <ScrollView
              style={styles.predictionsScrollView}
              showsVerticalScrollIndicator={true}
              nestedScrollEnabled={true}
              keyboardShouldPersistTaps="handled"
            >
              {placePredictions.map((prediction, index) => (
                <TouchableOpacity
                  key={prediction.place_id}
                  style={[styles.predictionItem, index >= 4 && styles.scrollablePredictionItem]}
                  onPress={() => handlePlaceSelect(prediction)}
                >
                  <Icon name="map-marker" size={16} color="#0066cc" />
                  <Text style={styles.predictionText}>{prediction.description}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            {placePredictions.length > 4 && (
              <View style={styles.scrollIndicator}>
                <Text style={styles.scrollIndicatorText}>Scroll to see {placePredictions.length - 4} more results</Text>
              </View>
            )}
          </View>
        )}

        {/* Current Location */}
        <TouchableOpacity style={styles.locationButton} onPress={getCurrentLocation} disabled={locationLoading}>
          <Icon name={locationLoading ? "loading" : "crosshairs-gps"} size={16} color="#0066cc" />
          <Text style={styles.locationText}>
            {locationLoading ? "Getting your location..." : "Use my Current Location"}
          </Text>
          {locationLoading ? (
            <ActivityIndicator size="small" color="#0066cc" />
          ) : (
            <Icon name="chevron-right" size={16} color="#666" />
          )}
        </TouchableOpacity>

        {/* Popular Cities */}
        <View style={styles.citiesSection}>
          <Text style={styles.citiesTitle}>Popular cities in India</Text>
          <View style={styles.citiesGrid}>
            {popularCities.map((city) => (
              <TouchableOpacity
                key={city}
                style={[styles.cityChip, selectedCity === city && styles.selectedCityChip]}
                onPress={() => handleCitySelectFromList(city)}
              >
                <Icon
                  name={selectedCity === city ? "check" : "plus"}
                  size={14}
                  color={selectedCity === city ? "#fff" : "#0066cc"}
                />
                <Text style={[styles.cityText, selectedCity === city && styles.selectedCityText]}>{city}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Next Button */}
      {(searchQuery.trim() || selectedCity) && (
        <View style={styles.nextButtonContainer}>
          <TouchableOpacity
            style={[styles.nextButton, loading && styles.disabledButton]}
            onPress={handleNext}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <>
                <Text style={styles.nextButtonText}>Next</Text>
                <Icon name="arrow-right" size={20} color="#fff" />
              </>
            )}
          </TouchableOpacity>
        </View>
      )}
    </>
  )

  // Render: Filter View
  const renderFilterView = () => (
    <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
      {/* Search Tags */}
      <View style={styles.searchTags}>
        <View style={styles.cityTag}>
          <Text style={styles.cityTagText}>{selectedCity || searchQuery}</Text>
          <TouchableOpacity onPress={() => setShowFilters(false)}>
            <Icon name="close" size={20} color="#666" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Category */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Category</Text>
        <View style={styles.bedroomsContainer}>
          {["Commercial", "Residential"].map((category) => (
            <TouchableOpacity
              key={category}
              style={[styles.bedroomChip, selectedType === category && styles.selectedChip]}
              onPress={() => handleTypeSelect(category)}
            >
              <Text style={[styles.bedroomText, selectedType === category && styles.selectedChipText]}>{category}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Bedrooms */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Bedrooms</Text>
        <View style={styles.bedroomsContainer}>
          {bedroomOptions.map((bedroom) => (
            <TouchableOpacity
              key={bedroom}
              style={[styles.bedroomChip, selectedBedrooms.includes(bedroom) && styles.selectedChip]}
              onPress={() => toggleItem(bedroom, selectedBedrooms, setSelectedBedrooms)}
            >
              <Text style={[styles.bedroomText, selectedBedrooms.includes(bedroom) && styles.selectedChipText]}>
                {bedroom}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Area Range */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Area Range (sq ft)</Text>
        <View style={styles.sliderContainer}>
          <Text style={styles.rangeText}>{areaRange[0]} sq ft</Text>
          <Text style={styles.rangeText}>{areaRange[1]} sq ft</Text>
        </View>
        <MultiSlider
          values={[areaRange[0], areaRange[1]]}
          min={0}
          max={20000}
          step={100}
          onValuesChange={(values) => {
            setAreaRange([values[0], values[1]])
            setMinArea(values[0].toString())
            setMaxArea(values[1].toString())
          }}
          selectedStyle={{ backgroundColor: "#0066cc" }}
          unselectedStyle={{ backgroundColor: "#ddd" }}
          markerStyle={{ backgroundColor: "#0066cc" }}
          containerStyle={{ marginVertical: 20 }}
        />
        <View style={styles.budgetContainer}>
          <TextInput
            style={styles.rangeInput}
            placeholder="Min"
            keyboardType="numeric"
            value={minArea}
            onChangeText={(text) => {
              setMinArea(text)
              const value = Number.parseInt(text) || 0
              if (value <= areaRange[1]) {
                setAreaRange([value, areaRange[1]])
              }
            }}
          />
          <TextInput
            style={styles.rangeInput}
            placeholder="Max"
            keyboardType="numeric"
            value={maxArea}
            onChangeText={(text) => {
              setMaxArea(text)
              const value = Number.parseInt(text) || 0
              if (value >= areaRange[0]) {
                setAreaRange([areaRange[0], value])
              }
            }}
          />
        </View>
      </View>

      {/* Price Range */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Price Range</Text>
        <View style={styles.sliderContainer}>
          <Text style={styles.rangeText}>{priceRange[0].toFixed(1)}CR</Text>
          <Text style={styles.rangeText}>{priceRange[1].toFixed(1)}CR</Text>
        </View>
        <MultiSlider
          values={[priceRange[0], priceRange[1]]}
          min={0}
          max={100}
          step={0.1}
          onValuesChange={(values) => {
            setPriceRange([values[0], values[1]])
            setMinPrice((values[0] * 10000000).toString())
            setMaxPrice((values[1] * 10000000).toString())
          }}
          selectedStyle={{ backgroundColor: "#0066cc" }}
          unselectedStyle={{ backgroundColor: "#ddd" }}
          markerStyle={{ backgroundColor: "#0066cc" }}
          containerStyle={{ marginVertical: 20 }}
        />
        <View style={styles.budgetContainer}>
          <TextInput
            style={styles.rangeInput}
            placeholder="Min"
            keyboardType="numeric"
            value={minPrice}
            onChangeText={(text) => {
              setMinPrice(text)
              const value = Number.parseInt(text) / 10000000 || 0
              if (value <= priceRange[1]) {
                setPriceRange([value, priceRange[1]])
              }
            }}
          />
          <TextInput
            style={styles.rangeInput}
            placeholder="Max"
            keyboardType="numeric"
            value={maxPrice}
            onChangeText={(text) => {
              setMaxPrice(text)
              const value = Number.parseInt(text) / 10000000 || 0
              if (value >= priceRange[0]) {
                setPriceRange([priceRange[0], value])
              }
            }}
          />
        </View>
      </View>

      {/* Type of property */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Type of property</Text>
        <View style={styles.bedroomsContainer}>
          {propertyTypeOptions.map((type) => (
            <TouchableOpacity
              key={type}
              style={[styles.bedroomChip, selectedPropertyTypes.includes(type) && styles.selectedChip]}
              onPress={() => toggleItem(type, selectedPropertyTypes, setSelectedPropertyTypes)}
            >
              <Text style={[styles.bedroomText, selectedPropertyTypes.includes(type) && styles.selectedChipText]}>
                {type}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Construction Status */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Construction Status</Text>
        <View style={styles.bedroomsContainer}>
          {constructionStatusOptions.map((status) => (
            <TouchableOpacity
              key={status}
              style={[styles.bedroomChip, selectedConstructionStatus.includes(status) && styles.selectedChip]}
              onPress={() => toggleItem(status, selectedConstructionStatus, setSelectedConstructionStatus)}
            >
              <Text
                style={[styles.bedroomText, selectedConstructionStatus.includes(status) && styles.selectedChipText]}
              >
                {status}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Posted By */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Posted by</Text>
        <View style={styles.bedroomsContainer}>
          {postedByOptions.map((option) => (
            <TouchableOpacity
              key={option}
              style={[styles.bedroomChip, selectedPostedBy.includes(option) && styles.selectedChip]}
              onPress={() => toggleItem(option, selectedPostedBy, setSelectedPostedBy)}
            >
              <Text style={[styles.bedroomText, selectedPostedBy.includes(option) && styles.selectedChipText]}>
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Amenities */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Amenities</Text>
        <View style={styles.bedroomsContainer}>
          {amenitiesOptions.map((amenity) => (
            <TouchableOpacity
              key={amenity}
              style={[styles.bedroomChip, selectedAmenities.includes(amenity) && styles.selectedChip]}
              onPress={() => toggleItem(amenity, selectedAmenities, setSelectedAmenities)}
            >
              <Text style={[styles.bedroomText, selectedAmenities.includes(amenity) && styles.selectedChipText]}>
                {amenity}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Bottom Buttons */}
      <View style={styles.bottomButtons}>
        <TouchableOpacity style={styles.clearButton} onPress={clearAll}>
          <Text style={styles.clearButtonText}>Clear All</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.seeAllButton, loading && styles.disabledButton]}
          onPress={searchProperties}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={styles.seeAllButtonText}>See all properties</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  )

  // Main Render
  return (
    <SafeAreaView style={[styles.container, { marginTop: statusBarHeight }]}>
      {/* Category (Commercial / Residential) */}
      <View style={styles.typeContainer}>
        {["Sell", "Rent", "PG"].map((type) => (
          <TouchableOpacity
            key={type}
            style={[styles.typeButton, selectedType === type && styles.selectedTypeButton]}
            onPress={() => handleTypeSelect(type)}
          >
            <Text style={[styles.typeText, selectedType === type && styles.selectedTypeText]}>{type}</Text>
          </TouchableOpacity>
        ))}
        {/* Close button */}
        <TouchableOpacity style={styles.closeButton} onPress={() => router.back()}>
          <Icon name="close" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {showFilters ? renderFilterView() : renderSearchView()}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  typeContainer: {
    flexDirection: "row",
    backgroundColor: "#232761",
    padding: 12,
    alignItems: "center",
  },
  typeButton: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    marginRight: 8,
  },
  selectedTypeButton: {
    backgroundColor: "#fff",
  },
  typeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "500",
  },
  selectedTypeText: {
    color: "#004080",
  },
  closeButton: {
    marginLeft: "auto",
  },
  scrollView: {
    flex: 1,
  },
  searchContainer: {
    padding: 16,
  },
  searchInput: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 9,
    padding: 10,
    fontSize: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  predictionsContainer: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderTopWidth: 0,
    marginHorizontal: 16,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  predictionsScrollView: {
    maxHeight: 200, // Show approximately 4 items (50px each)
  },
  predictionItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    minHeight: 50,
  },
  scrollablePredictionItem: {
    // Additional styling for scrollable items if needed
  },
  predictionText: {
    marginLeft: 8,
    fontSize: 14,
    color: "#333",
    flex: 1,
  },
  scrollIndicator: {
    padding: 8,
    backgroundColor: "#f8f9fa",
    borderTopWidth: 1,
    borderTopColor: "#eee",
    alignItems: "center",
  },
  scrollIndicatorText: {
    fontSize: 12,
    color: "#666",
    fontStyle: "italic",
  },
  locationButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  locationText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 14,
    color: "#0066cc",
  },
  citiesSection: {
    padding: 16,
  },
  citiesTitle: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 16,
    color: "#333",
  },
  citiesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  cityChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
  },
  selectedCityChip: {
    backgroundColor: "#0066cc",
    borderColor: "#0066cc",
  },
  cityText: {
    marginLeft: 8,
    fontSize: 12,
    color: "#333",
  },
  selectedCityText: {
    color: "#fff",
  },
  nextButtonContainer: {
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    backgroundColor: "#fff",
  },
  nextButton: {
    backgroundColor: "#0066cc",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 8,
    gap: 8,
  },
  nextButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  disabledButton: {
    opacity: 0.6,
  },
  // Filter View Styles
  searchTags: {
    flexDirection: "row",
    padding: 16,
    gap: 8,
  },
  cityTag: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    backgroundColor: "#e6f0ff",
    borderRadius: 8,
    gap: 8,
  },
  cityTagText: {
    color: "#0066cc",
  },
  section: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 16,
    color: "#333",
  },
  bedroomsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  bedroomChip: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 20,
  },
  selectedChip: {
    borderColor: "#0066cc",
    backgroundColor: "#e6f0ff",
  },
  bedroomText: {
    color: "#333",
    fontSize: 12,
  },
  selectedChipText: {
    color: "#0066cc",
  },
  sliderContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  rangeText: {
    fontSize: 12,
    color: "#666",
  },
  budgetContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    marginTop: 10,
  },
  rangeInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 25,
    padding: 10,
    paddingHorizontal: 15,
    fontSize: 12,
  },
  bottomButtons: {
    flexDirection: "row",
    padding: 16,
    gap: 16,
  },
  clearButton: {
    flex: 1,
    padding: 12,
    alignItems: "center",
  },
  clearButtonText: {
    color: "#232761",
    fontSize: 14,
  },
  seeAllButton: {
    flex: 1.5,
    backgroundColor: "#232761",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  seeAllButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
})

export default PropertySearchAndFilter