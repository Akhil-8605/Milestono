"use client"

import type React from "react"
import { useState, useEffect } from "react"
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Alert,
} from "react-native"
import { useNavigation } from "expo-router"
import { NavigationProp } from "@react-navigation/native";
import MultiSlider from "@ptomasroos/react-native-multi-slider"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { BASE_URL } from "@env";

const FiltersPage = () => {
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
  const [selectedCategory, setSelectedCategory] = useState<string>("")
  const [selectedType, setSelectedType] = useState<string>("")
  const [loading, setLoading] = useState(false)

  const navigation = useNavigation<NavigationProp<{ PropertiesPage: { filters: any } }>>();

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

  // Load saved filters from AsyncStorage
  const loadSavedFilters = async () => {
    try {
      const savedFilters = await AsyncStorage.getItem("propertyFilters")
      if (savedFilters) {
        const filters = JSON.parse(savedFilters)
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
        setSelectedCategory(filters.category || "")
        setSelectedType(filters.type || "")
      }
    } catch (error) {
      console.error("Error loading saved filters:", error)
    }
  }

  // Save filters to AsyncStorage
  const saveFilters = async () => {
    try {
      const filters = {
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
        category: selectedCategory,
        type: selectedType,
      }
      await AsyncStorage.setItem("propertyFilters", JSON.stringify(filters))
    } catch (error) {
      console.error("Error saving filters:", error)
    }
  }

  // Apply filters and search properties
  const applyFiltersAndSearch = async () => {
    try {
      setLoading(true)
      await saveFilters()

      // Get location data
      const locationData = await AsyncStorage.getItem("searchLocation")
      const location = locationData ? JSON.parse(locationData) : null

      const filterData = {
        category: selectedCategory,
        bedrooms: selectedBedrooms,
        propertyTypes: selectedPropertyTypes,
        amenities: selectedAmenities,
        constructionStatus: selectedConstructionStatus,
        postedBy: selectedPostedBy,
        areaRange,
        priceRange: [priceRange[0] * 10000000, priceRange[1] * 10000000], // Convert to actual price
        type: selectedType,
        latitude: location?.latitude || -1,
        longitude: location?.longitude || -1,
        radius: location?.radius || 5,
      }

      // Navigate to properties page with filters
      navigation.navigate("PropertiesPage", { filters: filterData })
    } catch (error) {
      console.error("Error applying filters:", error)
      Alert.alert("Error", "Failed to apply filters. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const toggleItem = (
    item: string,
    selectedList: string[],
    setSelectedList: React.Dispatch<React.SetStateAction<string[]>>,
  ) => {
    setSelectedList((prev) => (prev.includes(item) ? prev.filter((b) => b !== item) : [...prev, item]))
  }

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
    setSelectedCategory("")
    setSelectedType("")
  }

  useEffect(() => {
    loadSavedFilters()
  }, [])

  const statusBarHeight = StatusBar.currentHeight || 0

  return (
    <SafeAreaView style={[styles.container, { marginTop: statusBarHeight }]}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Category Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Category</Text>
          <View style={styles.bedroomsContainer}>
            {["Commercial", "Residential"].map((category) => (
              <TouchableOpacity
                key={category}
                style={[styles.bedroomChip, selectedCategory === category && styles.selectedChip]}
                onPress={() => setSelectedCategory(selectedCategory === category ? "" : category)}
              >
                <Text style={[styles.bedroomText, selectedCategory === category && styles.selectedChipText]}>
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Type Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Type</Text>
          <View style={styles.bedroomsContainer}>
            {["Sell", "Rent", "PG"].map((type) => (
              <TouchableOpacity
                key={type}
                style={[styles.bedroomChip, selectedType === type && styles.selectedChip]}
                onPress={() => setSelectedType(selectedType === type ? "" : type)}
              >
                <Text style={[styles.bedroomText, selectedType === type && styles.selectedChipText]}>{type}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Bedrooms Section */}
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

        {/* Area Range Section */}
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

        {/* Price Range Section */}
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

        {/* Property Type Section */}
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

        {/* Construction Status Section */}
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

        {/* Posted By Section */}
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

        {/* Amenities Section */}
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
            onPress={applyFiltersAndSearch}
            disabled={loading}
          >
            <Text style={styles.seeAllButtonText}>{loading ? "Applying..." : "See all properties"}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollView: {
    flex: 1,
  },
  section: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  sectionTitle: {
    fontSize: 20,
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
    fontSize: 15,
  },
  selectedChipText: {
    color: "#0066cc",
  },
  sliderContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  rangeText: {
    fontSize: 14,
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
    padding: 12,
    fontSize: 16,
  },
  bottomButtons: {
    flexDirection: "row",
    padding: 16,
    gap: 16,
  },
  clearButton: {
    flex: 1,
    padding: 16,
    alignItems: "center",
  },
  clearButtonText: {
    color: "#232761",
    fontSize: 16,
  },
  seeAllButton: {
    flex: 2,
    backgroundColor: "#232761",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  seeAllButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  disabledButton: {
    opacity: 0.6,
  },
})

export default FiltersPage
