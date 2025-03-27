"use client";

import type React from "react";
import { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  StatusBar
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation } from "expo-router";
import MultiSlider from "@ptomasroos/react-native-multi-slider";

const { width } = Dimensions.get("window");

const PropertySearchAndFilter = () => {
  const statusBarHeight = StatusBar.currentHeight || 0;

  // --- Step 1: Basic states for Category, Search, etc. ---
  const [selectedType, setSelectedType] = useState("Sell");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  // --- Step 2: New Filter States ---
  // Bedrooms
  const [selectedBedrooms, setSelectedBedrooms] = useState<string[]>([]);
  // Area Range
  const [areaRange, setAreaRange] = useState<[number, number]>([1800, 12400]);
  const [minArea, setMinArea] = useState("1800");
  const [maxArea, setMaxArea] = useState("12400");
  // Price Range
  const [priceRange, setPriceRange] = useState<[number, number]>([21.0, 64.3]);
  const [minPrice, setMinPrice] = useState("210321000");
  const [maxPrice, setMaxPrice] = useState("642981000");
  // Type of property
  const [selectedPropertyTypes, setSelectedPropertyTypes] = useState<string[]>(
    []
  );
  // Construction status
  const [selectedConstructionStatus, setSelectedConstructionStatus] = useState<
    string[]
  >([]);
  // Posted by
  const [selectedPostedBy, setSelectedPostedBy] = useState<string[]>([]);
  // Amenities
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);

  // --- Step 3: New Filter Option Arrays ---
  const bedroomOptions = ["1RK", "1BHK", "2BHK", "3BHK", "4BHK", "5+BHK"];
  const propertyTypeOptions = [
    "Flats/Apartment",
    "Independent House/Villa",
    "Independent/Builder Floor",
    "Plot/Land",
    "1RK/Studio Apartment",
    "Serviced Apartment",
    "Farmhouse",
  ];
  const constructionStatusOptions = [
    "New Launch",
    "Under Construction",
    "Ready to move",
  ];
  const postedByOptions = ["Owner", "Builder", "Dealer", "Feature Dealer"];
  const amenitiesOptions = [
    "Car Parking",
    "CCTV",
    "Guard",
    "Gym",
    "Club House",
    "Water Supply",
    "Lift",
  ];

  // --- Popular cities & city suggestions (same as before) ---
  const popularCities = [
    "Noida",
    "Delhi",
    "Mumbai",
    "Chennai",
    "Gurgaon",
    "Bangalore",
    "Hyderabad",
  ];
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
  ];

  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % cities.length);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // --- Step 4: Handlers for toggling chips ---
  const handleTypeSelect = (type: string) => {
    setSelectedType(type);
  };

  const handleCitySelect = (city: string) => {
    setSelectedCity(city);
    setSearchQuery(city);
  };

  const handleNext = () => {
    if (searchQuery.trim() || selectedCity) {
      setShowFilters(true);
    }
  };

  const handleBack = () => {
    setShowFilters(false);
  };

  // Toggle selection for any array-based filter
  const toggleItem = (
    item: string,
    selectedList: string[],
    setSelectedList: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    setSelectedList((prev) =>
      prev.includes(item) ? prev.filter((b) => b !== item) : [...prev, item]
    );
  };

  // --- Step 5: Clear all filters ---
  const clearAll = () => {
    setSelectedBedrooms([]);
    setMinArea("1800");
    setMaxArea("12400");
    setAreaRange([1800, 12400]);

    setMinPrice("210321000");
    setMaxPrice("642981000");
    setPriceRange([21.0, 64.3]);

    setSelectedPropertyTypes([]);
    setSelectedConstructionStatus([]);
    setSelectedPostedBy([]);
    setSelectedAmenities([]);
  };

  // --- Step 6: Render: Search View (same as your original) ---
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
            onChangeText={(text) => {
              setSearchQuery(text);
              setSelectedCity(null);
            }}
          />
        </View>

        {/* Current Location */}
        <TouchableOpacity style={styles.locationButton}>
          <Icon name="crosshairs-gps" size={16} color="#0066cc" />
          <Text style={styles.locationText}>Use my Current Location</Text>
          <Icon name="chevron-right" size={16} color="#666" />
        </TouchableOpacity>

        {/* Popular Cities */}
        <View style={styles.citiesSection}>
          <Text style={styles.citiesTitle}>Popular cities in India</Text>
          <View style={styles.citiesGrid}>
            {popularCities.map((city) => (
              <TouchableOpacity
                key={city}
                style={[
                  styles.cityChip,
                  selectedCity === city && styles.selectedCityChip,
                ]}
                onPress={() => handleCitySelect(city)}
              >
                <Icon
                  name={selectedCity === city ? "check" : "plus"}
                  size={14}
                  color={selectedCity === city ? "#fff" : "#0066cc"}
                />
                <Text
                  style={[
                    styles.cityText,
                    selectedCity === city && styles.selectedCityText,
                  ]}
                >
                  {city}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Next Button */}
      {(searchQuery.trim() || selectedCity) && (
        <View style={styles.nextButtonContainer}>
          <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
            <Text style={styles.nextButtonText}>Next</Text>
            <Icon name="arrow-right" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      )}
    </>
  );

  // --- Step 7: Render: Filter View (with MultiSlider) ---
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
          {["Commercial", "Residential"].map((bedroom) => (
            <TouchableOpacity
              key={bedroom}
              style={[
                styles.bedroomChip,
                selectedBedrooms.includes(bedroom) && styles.selectedChip,
              ]}
              onPress={() =>
                toggleItem(bedroom, selectedBedrooms, setSelectedBedrooms)
              }
            >
              <Text
                style={[
                  styles.bedroomText,
                  selectedBedrooms.includes(bedroom) && styles.selectedChipText,
                ]}
              >
                {bedroom}
              </Text>
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
              style={[
                styles.bedroomChip,
                selectedBedrooms.includes(bedroom) && styles.selectedChip,
              ]}
              onPress={() =>
                toggleItem(bedroom, selectedBedrooms, setSelectedBedrooms)
              }
            >
              <Text
                style={[
                  styles.bedroomText,
                  selectedBedrooms.includes(bedroom) && styles.selectedChipText,
                ]}
              >
                {bedroom}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Area Range */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Area Range (sq ft)</Text>
        {/* Display current min & max above slider */}
        <View style={styles.sliderContainer}>
          <Text style={styles.rangeText}>{areaRange[0]} sq ft</Text>
          <Text style={styles.rangeText}>{areaRange[1]} sq ft</Text>
        </View>
        {/* MultiSlider for area */}
        <MultiSlider
          values={[areaRange[0], areaRange[1]]}
          min={0}
          max={20000}
          step={100}
          onValuesChange={(values) => {
            setAreaRange([values[0], values[1]]);
            setMinArea(values[0].toString());
            setMaxArea(values[1].toString());
          }}
          selectedStyle={{ backgroundColor: "#0066cc" }}
          unselectedStyle={{ backgroundColor: "#ddd" }}
          markerStyle={{ backgroundColor: "#0066cc" }}
          containerStyle={{ marginVertical: 20 }}
        />
        {/* Inputs for direct min & max entry */}
        <View style={styles.budgetContainer}>
          <TextInput
            style={styles.rangeInput}
            placeholder="Min"
            keyboardType="numeric"
            value={minArea}
            onChangeText={(text) => {
              setMinArea(text);
              const value = Number.parseInt(text) || 0;
              // Ensure we don’t exceed the max
              if (value <= areaRange[1]) {
                setAreaRange([value, areaRange[1]]);
              }
            }}
          />
          <TextInput
            style={styles.rangeInput}
            placeholder="Max"
            keyboardType="numeric"
            value={maxArea}
            onChangeText={(text) => {
              setMaxArea(text);
              const value = Number.parseInt(text) || 0;
              // Ensure min doesn’t exceed the new max
              if (value >= areaRange[0]) {
                setAreaRange([areaRange[0], value]);
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
        {/* MultiSlider for price */}
        <MultiSlider
          values={[priceRange[0], priceRange[1]]}
          min={0}
          max={100}
          step={0.1}
          onValuesChange={(values) => {
            setPriceRange([values[0], values[1]]);
            setMinPrice((values[0] * 10000000).toString());
            setMaxPrice((values[1] * 10000000).toString());
          }}
          selectedStyle={{ backgroundColor: "#0066cc" }}
          unselectedStyle={{ backgroundColor: "#ddd" }}
          markerStyle={{ backgroundColor: "#0066cc" }}
          containerStyle={{ marginVertical: 20 }}
        />
        {/* Inputs for direct min & max entry */}
        <View style={styles.budgetContainer}>
          <TextInput
            style={styles.rangeInput}
            placeholder="Min"
            keyboardType="numeric"
            value={minPrice}
            onChangeText={(text) => {
              setMinPrice(text);
              const value = Number.parseInt(text) / 10000000 || 0;
              if (value <= priceRange[1]) {
                setPriceRange([value, priceRange[1]]);
              }
            }}
          />
          <TextInput
            style={styles.rangeInput}
            placeholder="Max"
            keyboardType="numeric"
            value={maxPrice}
            onChangeText={(text) => {
              setMaxPrice(text);
              const value = Number.parseInt(text) / 10000000 || 0;
              if (value >= priceRange[0]) {
                setPriceRange([priceRange[0], value]);
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
              style={[
                styles.bedroomChip,
                selectedPropertyTypes.includes(type) && styles.selectedChip,
              ]}
              onPress={() =>
                toggleItem(
                  type,
                  selectedPropertyTypes,
                  setSelectedPropertyTypes
                )
              }
            >
              <Text
                style={[
                  styles.bedroomText,
                  selectedPropertyTypes.includes(type) &&
                    styles.selectedChipText,
                ]}
              >
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
              style={[
                styles.bedroomChip,
                selectedConstructionStatus.includes(status) &&
                  styles.selectedChip,
              ]}
              onPress={() =>
                toggleItem(
                  status,
                  selectedConstructionStatus,
                  setSelectedConstructionStatus
                )
              }
            >
              <Text
                style={[
                  styles.bedroomText,
                  selectedConstructionStatus.includes(status) &&
                    styles.selectedChipText,
                ]}
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
              style={[
                styles.bedroomChip,
                selectedPostedBy.includes(option) && styles.selectedChip,
              ]}
              onPress={() =>
                toggleItem(option, selectedPostedBy, setSelectedPostedBy)
              }
            >
              <Text
                style={[
                  styles.bedroomText,
                  selectedPostedBy.includes(option) && styles.selectedChipText,
                ]}
              >
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
              style={[
                styles.bedroomChip,
                selectedAmenities.includes(amenity) && styles.selectedChip,
              ]}
              onPress={() =>
                toggleItem(amenity, selectedAmenities, setSelectedAmenities)
              }
            >
              <Text
                style={[
                  styles.bedroomText,
                  selectedAmenities.includes(amenity) &&
                    styles.selectedChipText,
                ]}
              >
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
          style={styles.seeAllButton}
          onPress={() => {
            navigation.navigate("PropertiesPage" as never);
          }}
        >
          <Text style={styles.seeAllButtonText}>See all properties</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  // --- Step 8: Main Render ---
  const navigation = useNavigation();

  return (
    <SafeAreaView style={[styles.container, { marginTop: statusBarHeight }]}>
      {/* Category (Commercial / Residential) */}
      <View style={styles.typeContainer}>
        {["Sell", "Rent", "PG"].map((type) => (
          <TouchableOpacity
            key={type}
            style={[
              styles.typeButton,
              selectedType === type && styles.selectedTypeButton,
            ]}
            onPress={() => handleTypeSelect(type)}
          >
            <Text
              style={[
                styles.typeText,
                selectedType === type && styles.selectedTypeText,
              ]}
            >
              {type}
            </Text>
          </TouchableOpacity>
        ))}
        {/* Close button */}
        <TouchableOpacity style={styles.closeButton}>
          <Icon
            name="close"
            size={24}
            color="#fff"
            onPress={() => {
              navigation.navigate("index" as never);
            }}
          />
        </TouchableOpacity>
      </View>

      {showFilters ? renderFilterView() : renderSearchView()}
    </SafeAreaView>
  );
};

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
});

export default PropertySearchAndFilter;
