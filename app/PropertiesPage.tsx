import React, { useState } from "react";
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
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import FilterDesign from "./components/FilterDesign"; // Adjust the path as needed

const dummyImg = require("../assets/images/dummyImg.webp");

const propertiesData = [
  {
    id: "1",
    type: "Residential",
    title: "2 BHK Flat for Sale in Solapur",
    location: "Mumbai",
    sqft: "1200 sq.ft",
    pricePerSqft: "₹ 5000/sq.ft",
    price: "₹ 60,00,000",
    deposit: "₹ 10,00,000",
    image: dummyImg,
  },
  {
    id: "2",
    type: "Commercial",
    title: "Office Space for Sale in Solapur",
    location: "Bangalore",
    sqft: "3000 sq.ft",
    pricePerSqft: "₹ 7000/sq.ft",
    price: "₹ 2,10,00,000",
    deposit: "₹ 20,00,000",
    image: dummyImg,
  },
  {
    id: "3",
    type: "Residential",
    title: "3 BHK Villa for Sale in Solapur",
    location: "Delhi",
    sqft: "2500 sq.ft",
    pricePerSqft: "₹ 6000/sq.ft",
    price: "₹ 1,50,00,000",
    deposit: "₹ 15,00,000",
    image: dummyImg,
  },
];

interface Property {
  id: string;
  type: string;
  title: string;
  location: string;
  sqft: string;
  pricePerSqft: string;
  price: string;
  deposit: string;
  image: any;
}

const PropertyCard = ({ property }: { property: Property }) => (
  <View style={styles.card}>
    <View style={styles.imageContainer}>
      <Image source={property.image} style={styles.propertyImage} />
      <View style={styles.propertyTypeTag}>
        <Text style={styles.propertyTypeText}>{property.type}</Text>
      </View>
    </View>
    <View style={styles.cardContent}>
      <Text style={styles.propertyTitle}>{property.title}</Text>

      <View style={styles.featuresRow}>
        <View style={styles.featureItem}>
          <Icon name="location-outline" size={16} color="#666" />
          <Text style={styles.featureText}>{property.location}</Text>
        </View>
        <View style={styles.featureItem}>
          <Icon name="home-outline" size={16} color="#666" />
          <Text style={styles.featureText}>{property.sqft}</Text>
        </View>
      </View>

      <View style={styles.priceContainer}>
        <Text style={styles.pricePerSqft}>{property.pricePerSqft}</Text>
        <Text style={styles.price}>{property.price}</Text>
      </View>

      <View style={styles.depositContainer}>
        <Text style={styles.depositLabel}>Deposit:</Text>
        <Text style={styles.depositAmount}>{property.deposit}</Text>
      </View>

      <TouchableOpacity style={styles.viewButton}>
        <Icon name="eye-outline" size={20} color="#fff" />
        <Text style={styles.viewButtonText}>View Details</Text>
      </TouchableOpacity>
    </View>
  </View>
);

const PropertyListingScreen = () => {
  // Search & header state
  const [searchText, setSearchText] = useState("Solapur");
  const [headerCity, setHeaderCity] = useState(searchText);

  const handleSearch = () => {
    setHeaderCity(searchText);
  };

  const handleClear = () => {
    setSearchText("");
  };

  // *** NEW: Filter modal visibility state ***
  const [showFilters, setShowFilters] = useState(false);

  // *** NEW: States for FilterDesign props ***

  // Bedrooms
  const bedroomOptions = ["1 BHK", "2 BHK", "3 BHK", "4 BHK"];
  const [selectedBedrooms, setSelectedBedrooms] = useState<string[]>([]);

  // Area Range
  const [areaRange, setAreaRange] = useState<[number, number]>([0, 20000]);
  const [minArea, setMinArea] = useState("0");
  const [maxArea, setMaxArea] = useState("20000");

  // Price Range
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100]);
  const [minPrice, setMinPrice] = useState("0");
  const [maxPrice, setMaxPrice] = useState("100");

  // Property Types
  const propertyTypeOptions = ["Residential", "Commercial", "Industrial"];
  const [selectedPropertyTypes, setSelectedPropertyTypes] = useState<string[]>([]);

  // Construction Status
  const constructionStatusOptions = ["Under Construction", "Ready to Move"];
  const [selectedConstructionStatus, setSelectedConstructionStatus] = useState<string[]>([]);

  // Posted By
  const postedByOptions = ["Owner", "Agent"];
  const [selectedPostedBy, setSelectedPostedBy] = useState<string[]>([]);

  // Amenities
  const amenitiesOptions = ["Parking", "Gym", "Swimming Pool", "Garden"];
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);

  const clearAll = () => {
    setSelectedBedrooms([]);
    setAreaRange([0, 20000]);
    setMinArea("0");
    setMaxArea("20000");
    setPriceRange([0, 100]);
    setMinPrice("0");
    setMaxPrice("100");
    setSelectedPropertyTypes([]);
    setSelectedConstructionStatus([]);
    setSelectedPostedBy([]);
    setSelectedAmenities([]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchContainer}>
        <View style={styles.searchRow}>
          <View style={styles.inputContainer}>
            <Icon name="location-outline" size={20} color="#666" />
            <TextInput
              style={styles.input}
              value={searchText}
              onChangeText={setSearchText}
            />
          </View>
          <TouchableOpacity style={styles.iconButton} onPress={handleSearch}>
            <Icon name="search-outline" size={24} color="#1a237e" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton} onPress={handleClear}>
            <Icon name="close-circle-outline" size={24} color="#1a237e" />
          </TouchableOpacity>
          {/* Filter Icon that opens the modal */}
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => setShowFilters(true)}
          >
            <Icon name="filter-outline" size={24} color="#1a237e" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsHorizontalScrollIndicator={false}
      >
        <View style={styles.resultHeader}>
          <Text style={styles.resultCount}>
            {propertiesData.length} Apartments for sale in {headerCity}
          </Text>
          <Text style={styles.updateDate}>Updated: Feb 18, 2025</Text>
        </View>
        {headerCity !== "" &&
          propertiesData.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
      </ScrollView>

      {/* Filter Modal Overlay */}
      <Modal visible={showFilters} animationType="fade" transparent>
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
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  searchContainer: {
    padding: 12,
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
    padding: 8,
  },
  input: {
    flex: 1,
    paddingLeft: 8,
    fontSize: 16,
    color: "#333",
    outlineColor: "#f5f5f5",
    outline: "none",
  },
  iconButton: {
    padding: 8,
  },
  scrollView: {
    flex: 1,
  },
  resultHeader: {
    padding: 16,
  },
  resultCount: {
    fontSize: 15,
    color: "#333",
    marginBottom: 4,
  },
  updateDate: {
    fontSize: 14,
    color: "#666",
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
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  propertyTypeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  cardContent: {
    padding: 16,
  },
  propertyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 12,
  },
  featuresRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  featureText: {
    marginLeft: 4,
    fontSize: 14,
    color: "#666",
  },
  priceContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
    marginBottom: 8,
  },
  pricePerSqft: {
    fontSize: 14,
    color: "#666",
  },
  price: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
  },
  depositContainer: {
    flexDirection: "row",
    marginBottom: 16,
  },
  depositLabel: {
    fontSize: 14,
    color: "#666",
    marginRight: 4,
  },
  depositAmount: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  viewButton: {
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
    fontSize: 16,
    fontWeight: "600",
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "90%",
    height: "80%",
    backgroundColor: "#fff",
    borderRadius: 10,
    overflow: "hidden",
  },
});

export default PropertyListingScreen;
