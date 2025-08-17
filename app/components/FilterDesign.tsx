"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet, Alert } from "react-native"
import MultiSlider from "@ptomasroos/react-native-multi-slider"
import Icon from "react-native-vector-icons/MaterialCommunityIcons"
import AsyncStorage from "@react-native-async-storage/async-storage"
import axios from "axios"
import { BASE_URL } from "@env"

interface FilterDesignProps {
  selectedCity: string | null
  searchQuery: string
  setShowFilters: (show: boolean) => void
  bedroomOptions: string[]
  selectedBedrooms: string[]
  setSelectedBedrooms: React.Dispatch<React.SetStateAction<string[]>>
  areaRange: [number, number]
  setAreaRange: React.Dispatch<React.SetStateAction<[number, number]>>
  minArea: string
  setMinArea: React.Dispatch<React.SetStateAction<string>>
  maxArea: string
  setMaxArea: React.Dispatch<React.SetStateAction<string>>
  priceRange: [number, number]
  setPriceRange: React.Dispatch<React.SetStateAction<[number, number]>>
  minPrice: string
  setMinPrice: React.Dispatch<React.SetStateAction<string>>
  maxPrice: string
  setMaxPrice: React.Dispatch<React.SetStateAction<string>>
  propertyTypeOptions: string[]
  selectedPropertyTypes: string[]
  setSelectedPropertyTypes: React.Dispatch<React.SetStateAction<string[]>>
  constructionStatusOptions: string[]
  selectedConstructionStatus: string[]
  setSelectedConstructionStatus: React.Dispatch<React.SetStateAction<string[]>>
  postedByOptions: string[]
  selectedPostedBy: string[]
  setSelectedPostedBy: React.Dispatch<React.SetStateAction<string[]>>
  amenitiesOptions: string[]
  selectedAmenities: string[]
  setSelectedAmenities: React.Dispatch<React.SetStateAction<string[]>>
  clearAll: () => void
  onApplyFilters?: (filteredProperties: any[]) => void
}

const FilterDesign: React.FC<FilterDesignProps> = ({
  selectedCity,
  searchQuery,
  setShowFilters,
  bedroomOptions,
  selectedBedrooms,
  setSelectedBedrooms,
  areaRange,
  setAreaRange,
  minArea,
  setMinArea,
  maxArea,
  setMaxArea,
  priceRange,
  setPriceRange,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  propertyTypeOptions,
  selectedPropertyTypes,
  setSelectedPropertyTypes,
  constructionStatusOptions,
  selectedConstructionStatus,
  setSelectedConstructionStatus,
  postedByOptions,
  selectedPostedBy,
  setSelectedPostedBy,
  amenitiesOptions,
  selectedAmenities,
  setSelectedAmenities,
  clearAll,
  onApplyFilters,
}) => {
  // Additional filter states from SearchFiltersPage
  const [selectedCategory, setSelectedCategory] = useState<string>("Residential")
  const [selectedType, setSelectedType] = useState<string>("Sell")
  const [loading, setLoading] = useState(false)

  // Load saved filters from AsyncStorage when component mounts
  const loadSavedFilters = async () => {
    try {
      const savedFilters = await AsyncStorage.getItem("propertyFilters")
      if (savedFilters) {
        const filters = JSON.parse(savedFilters)

        // Load category and type
        setSelectedCategory(filters.category || "Residential")
        setSelectedType(filters.type || "Sell")

        // Update parent component states with saved filters
        if (filters.bedrooms && filters.bedrooms.length > 0) {
          setSelectedBedrooms(filters.bedrooms)
        }
        if (filters.areaRange) {
          setAreaRange(filters.areaRange)
          setMinArea(filters.minArea || filters.areaRange[0].toString())
          setMaxArea(filters.maxArea || filters.areaRange[1].toString())
        }
        if (filters.priceRange) {
          setPriceRange(filters.priceRange)
          setMinPrice(filters.minPrice || (filters.priceRange[0] * 10000000).toString())
          setMaxPrice(filters.maxPrice || (filters.priceRange[1] * 10000000).toString())
        }
        if (filters.propertyTypes && filters.propertyTypes.length > 0) {
          setSelectedPropertyTypes(filters.propertyTypes)
        }
        if (filters.constructionStatus && filters.constructionStatus.length > 0) {
          setSelectedConstructionStatus(filters.constructionStatus)
        }
        if (filters.postedBy && filters.postedBy.length > 0) {
          setSelectedPostedBy(filters.postedBy)
        }
        if (filters.amenities && filters.amenities.length > 0) {
          setSelectedAmenities(filters.amenities)
        }
      }
    } catch (error) {
      console.error("Error loading saved filters:", error)
    }
  }

  useEffect(() => {
    loadSavedFilters()
  }, [])

  const toggleItem = (
    item: string,
    selectedList: string[],
    setSelectedList: React.Dispatch<React.SetStateAction<string[]>>,
  ) => {
    setSelectedList((prev) => (prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]))
  }

  // Save filters to AsyncStorage (matching SearchFiltersPage format)
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

  // Apply filters to search results (matching SearchFiltersPage logic)
  const applyFiltersToResults = (properties: any[], filters: any) => {
    return properties.filter((property) => {
      // Category filter
      if (filters.category && filters.category !== "Residential" && property.propertyCategory !== filters.category) {
        return false
      }

      // Type filter (Sell/Rent/PG)
      if (filters.type && property.sellType.toLowerCase() !== filters.type.toLowerCase()) {
        return false
      }

      // Bedrooms filter
      if (filters.bedrooms.length > 0) {
        const propertyBedrooms = property.bedrooms
        const matchesBedroom = filters.bedrooms.some((filterBedroom: string) => {
          if (filterBedroom === "1RK" && propertyBedrooms === "1RK") return true
          if (filterBedroom === "1BHK" && propertyBedrooms === "1BHK") return true
          if (filterBedroom === "2BHK" && propertyBedrooms === "2BHK") return true
          if (filterBedroom === "3BHK" && propertyBedrooms === "3BHK") return true
          if (filterBedroom === "4BHK" && propertyBedrooms === "4BHK") return true
          if (
            filterBedroom === "5+BHK" &&
            (propertyBedrooms === "5BHK" ||
              propertyBedrooms === "6BHK" ||
              propertyBedrooms === "7BHK" ||
              propertyBedrooms === "8BHK" ||
              propertyBedrooms === "9BHK" ||
              propertyBedrooms === "10BHK")
          )
            return true
          return false
        })
        if (!matchesBedroom) return false
      }

      // Area filter
      const areaSqft = Number.parseInt(property.areaSqft) || 0
      if (areaSqft < filters.areaRange[0] || areaSqft > filters.areaRange[1]) {
        return false
      }

      // Price filter
      const expectedPrice = Number.parseInt(property.expectedPrice) || 0
      const minPriceValue = filters.priceRange[0] * 10000000
      const maxPriceValue = filters.priceRange[1] * 10000000
      if (expectedPrice < minPriceValue || expectedPrice > maxPriceValue) {
        return false
      }

      // Property types filter
      if (filters.propertyTypes.length > 0) {
        const propertyCategory = property.propertyCategory || ""
        const propertyContains = property.propertyContains || ""
        const matchesPropertyType = filters.propertyTypes.some(
          (filterType: string) =>
            propertyCategory.toLowerCase().includes(filterType.toLowerCase()) ||
            propertyContains.toLowerCase().includes(filterType.toLowerCase()),
        )
        if (!matchesPropertyType) return false
      }

      // Amenities filter
      if (filters.amenities.length > 0) {
        const propertyAmenities = property.amenities || []
        const matchesAmenity = filters.amenities.some((filterAmenity: string) =>
          propertyAmenities.some((amenity: string) => amenity.toLowerCase().includes(filterAmenity.toLowerCase())),
        )
        if (!matchesAmenity) return false
      }

      // Construction status filter
      if (filters.constructionStatus.length > 0) {
        const oldProperty = property.oldProperty || ""
        const matchesStatus = filters.constructionStatus.some((filterStatus: string) =>
          oldProperty.toLowerCase().includes(filterStatus.toLowerCase()),
        )
        if (!matchesStatus) return false
      }

      // Posted by filter
      if (filters.postedBy.length > 0) {
        const sellerType = property.sellerType || ""
        const matchesPostedBy = filters.postedBy.some((filterPostedBy: string) =>
          sellerType.toLowerCase().includes(filterPostedBy.toLowerCase()),
        )
        if (!matchesPostedBy) return false
      }

      return true
    })
  }

  // Apply filters and search properties (matching SearchFiltersPage logic)
  const applyFiltersAndSearch = async () => {
    try {
      setLoading(true)
      await saveFilters()

      // Get location data
      const locationData = await AsyncStorage.getItem("searchLocation")
      const location = locationData ? JSON.parse(locationData) : null

      if (!location) {
        Alert.alert("Error", "No search location found. Please search for a location first.")
        return
      }

      const filterData = {
        category: selectedCategory,
        bedrooms: selectedBedrooms,
        propertyTypes: selectedPropertyTypes,
        amenities: selectedAmenities,
        constructionStatus: selectedConstructionStatus,
        postedBy: selectedPostedBy,
        areaRange,
        priceRange,
        type: selectedType,
        latitude: location.latitude || -1,
        longitude: location.longitude || -1,
        radius: location.radius || 5,
      }

      // Call the search API with filters
      const response = await axios.post(`${BASE_URL}/api/search_properties`, {
        latitude: filterData.latitude,
        longitude: filterData.longitude,
        radius: filterData.radius,
      })

      // Apply client-side filters to the results
      const filteredResults = applyFiltersToResults(response.data as any[], filterData)

      // Close filters and pass results back
      if (onApplyFilters) {
        onApplyFilters(filteredResults)
      }
    } catch (error) {
      console.error("Error applying filters:", error)
      Alert.alert("Error", "Failed to apply filters. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  // Enhanced clear all function (matching SearchFiltersPage)
  const handleClearAll = () => {
    clearAll()
    setSelectedCategory("Residential")
    setSelectedType("Sell")

    // Reset to SearchFiltersPage default values
    setAreaRange([1800, 12400])
    setMinArea("1800")
    setMaxArea("12400")
    setPriceRange([21.0, 64.3])
    setMinPrice("210321000")
    setMaxPrice("642981000")
  }

  // Add commercial property types for when Commercial category is selected
  const commercialPropertyTypes = [
    "Shop",
    "Industrial land",
    "Office",
    "Godown",
    "Agricultural land",
    "Industrial plots",
    "Showrooms",
    "Warehouse",
    "Kiosk",
    "Factory",
    "Guest house",
    "Banquet halls",
    "Hotels",
    "Resorts"
  ]

  return (
    <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Filters</Text>
        <TouchableOpacity onPress={() => setShowFilters(false)}>
          <Icon name="close" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      {/* Search Location Display */}
      {(selectedCity || searchQuery) && (
        <View style={styles.locationSection}>
          <Text style={styles.locationTitle}>Searching in:</Text>
          <Text style={styles.locationText}>{selectedCity || searchQuery}</Text>
        </View>
      )}

      {/* Category Section - From SearchFiltersPage */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Category</Text>
        <View style={styles.bedroomsContainer}>
          {["Commercial", "Residential"].map((category) => (
            <TouchableOpacity
              key={category}
              style={[styles.bedroomChip, selectedCategory === category && styles.selectedChip]}
              onPress={() => setSelectedCategory(selectedCategory === category ? "Residential" : category)}
            >
              <Text style={[styles.bedroomText, selectedCategory === category && styles.selectedChipText]}>
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Type Section - From SearchFiltersPage */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Type</Text>
        <View style={styles.bedroomsContainer}>
          {["Sell", "Rent", "PG"].map((type) => (
            <TouchableOpacity
              key={type}
              style={[styles.bedroomChip, selectedType === type && styles.selectedChip]}
              onPress={() => setSelectedType(selectedType === type ? "Sell" : type)}
            >
              <Text style={[styles.bedroomText, selectedType === type && styles.selectedChipText]}>{type}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Bedrooms Section */}
      <View style={styles.section}>
        {/* Change label to "Rooms" when Commercial category is selected */}
        <Text style={styles.sectionTitle}>{selectedCategory === "Commercial" ? "Rooms" : "Bedrooms"}</Text>
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

      {/* Area Range Section - Matching SearchFiltersPage styling */}
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

      {/* Price Range Section - Matching SearchFiltersPage styling */}
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
          {/* Show commercial property types when Commercial category is selected, allow multiple selection */}
          {(selectedCategory === "Commercial" ? commercialPropertyTypes : propertyTypeOptions).map((type) => (
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

      {/* Bottom Buttons - Matching SearchFiltersPage styling */}
      <View style={styles.bottomButtons}>
        <TouchableOpacity style={styles.clearButton} onPress={handleClearAll}>
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
  )
}

export default FilterDesign

// Styles matching SearchFiltersPage.tsx
const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    padding: 16,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomColor: "#eee",
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
  },
  locationSection: {
    padding: 16,
    backgroundColor: "#fff",
    borderBottomColor: "#eee",
    borderBottomWidth: 1,
  },
  locationTitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  locationText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#0066cc",
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