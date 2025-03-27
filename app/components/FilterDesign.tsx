import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
} from "react-native";
import MultiSlider from "@ptomasroos/react-native-multi-slider";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation } from "expo-router";

interface FilterDesignProps {
  selectedCity: string | null;
  searchQuery: string;
  setShowFilters: (show: boolean) => void;
  bedroomOptions: string[];
  selectedBedrooms: string[];
  setSelectedBedrooms: React.Dispatch<React.SetStateAction<string[]>>;
  areaRange: [number, number];
  setAreaRange: React.Dispatch<React.SetStateAction<[number, number]>>;
  minArea: string;
  setMinArea: React.Dispatch<React.SetStateAction<string>>;
  maxArea: string;
  setMaxArea: React.Dispatch<React.SetStateAction<string>>;
  priceRange: [number, number];
  setPriceRange: React.Dispatch<React.SetStateAction<[number, number]>>;
  minPrice: string;
  setMinPrice: React.Dispatch<React.SetStateAction<string>>;
  maxPrice: string;
  setMaxPrice: React.Dispatch<React.SetStateAction<string>>;
  propertyTypeOptions: string[];
  selectedPropertyTypes: string[];
  setSelectedPropertyTypes: React.Dispatch<React.SetStateAction<string[]>>;
  constructionStatusOptions: string[];
  selectedConstructionStatus: string[];
  setSelectedConstructionStatus: React.Dispatch<React.SetStateAction<string[]>>;
  postedByOptions: string[];
  selectedPostedBy: string[];
  setSelectedPostedBy: React.Dispatch<React.SetStateAction<string[]>>;
  amenitiesOptions: string[];
  selectedAmenities: string[];
  setSelectedAmenities: React.Dispatch<React.SetStateAction<string[]>>;
  clearAll: () => void;
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
}) => {
  const navigation = useNavigation();

  const toggleItem = (
    item: string,
    selectedList: string[],
    setSelectedList: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    setSelectedList((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  return (
    <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Filters</Text>
        <TouchableOpacity onPress={() => setShowFilters(false)}>
          <Icon name="close" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      {/* Bedroom Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Bedrooms</Text>
        <View style={styles.optionsContainer}>
          {bedroomOptions.map((bedroom) => (
            <TouchableOpacity
              key={bedroom}
              style={[
                styles.optionChip,
                selectedBedrooms.includes(bedroom) && styles.selectedChip,
              ]}
              onPress={() =>
                toggleItem(bedroom, selectedBedrooms, setSelectedBedrooms)
              }
            >
              <Text
                style={[
                  styles.optionText,
                  selectedBedrooms.includes(bedroom) && styles.selectedChipText,
                ]}
              >
                {bedroom}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Area Range Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Area Range (sq ft)</Text>
        <View style={styles.sliderLabelContainer}>
          <Text style={styles.sliderLabel}>{areaRange[0]} sq ft</Text>
          <Text style={styles.sliderLabel}>{areaRange[1]} sq ft</Text>
        </View>
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
          selectedStyle={styles.sliderSelected}
          unselectedStyle={styles.sliderUnselected}
          markerStyle={styles.sliderMarker}
          containerStyle={styles.sliderContainer}
        />
        <View style={styles.inputRow}>
          <TextInput
            style={styles.rangeInput}
            placeholder="Min"
            keyboardType="numeric"
            value={minArea}
            onChangeText={(text) => {
              setMinArea(text);
              const value = Number.parseInt(text) || 0;
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
              if (value >= areaRange[0]) {
                setAreaRange([areaRange[0], value]);
              }
            }}
          />
        </View>
      </View>

      {/* Price Range Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Price Range</Text>
        <View style={styles.sliderLabelContainer}>
          <Text style={styles.sliderLabel}>{priceRange[0].toFixed(1)}CR</Text>
          <Text style={styles.sliderLabel}>{priceRange[1].toFixed(1)}CR</Text>
        </View>
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
          selectedStyle={styles.sliderSelected}
          unselectedStyle={styles.sliderUnselected}
          markerStyle={styles.sliderMarker}
          containerStyle={styles.sliderContainer}
        />
        <View style={styles.inputRow}>
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

      {/* Property Type Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Type of Property</Text>
        <View style={styles.optionsContainer}>
          {propertyTypeOptions.map((type) => (
            <TouchableOpacity
              key={type}
              style={[
                styles.optionChip,
                selectedPropertyTypes.includes(type) && styles.selectedChip,
              ]}
              onPress={() =>
                toggleItem(type, selectedPropertyTypes, setSelectedPropertyTypes)
              }
            >
              <Text
                style={[
                  styles.optionText,
                  selectedPropertyTypes.includes(type) && styles.selectedChipText,
                ]}
              >
                {type}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Construction Status Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Construction Status</Text>
        <View style={styles.optionsContainer}>
          {constructionStatusOptions.map((status) => (
            <TouchableOpacity
              key={status}
              style={[
                styles.optionChip,
                selectedConstructionStatus.includes(status) && styles.selectedChip,
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
                  styles.optionText,
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

      {/* Posted By Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Posted By</Text>
        <View style={styles.optionsContainer}>
          {postedByOptions.map((option) => (
            <TouchableOpacity
              key={option}
              style={[
                styles.optionChip,
                selectedPostedBy.includes(option) && styles.selectedChip,
              ]}
              onPress={() =>
                toggleItem(option, selectedPostedBy, setSelectedPostedBy)
              }
            >
              <Text
                style={[
                  styles.optionText,
                  selectedPostedBy.includes(option) && styles.selectedChipText,
                ]}
              >
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Amenities Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Amenities</Text>
        <View style={styles.optionsContainer}>
          {amenitiesOptions.map((amenity) => (
            <TouchableOpacity
              key={amenity}
              style={[
                styles.optionChip,
                selectedAmenities.includes(amenity) && styles.selectedChip,
              ]}
              onPress={() =>
                toggleItem(amenity, selectedAmenities, setSelectedAmenities)
              }
            >
              <Text
                style={[
                  styles.optionText,
                  selectedAmenities.includes(amenity) && styles.selectedChipText,
                ]}
              >
                {amenity}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Bottom Action Buttons */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity style={styles.clearButton} onPress={clearAll}>
          <Text style={styles.clearButtonText}>Clear All</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.applyButton}
          onPress={() => {
            setShowFilters(false);
          }}
        >
          <Text style={styles.applyButtonText}>Apply Filters</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default FilterDesign;

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: "#f9f9f9",
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
  section: {
    padding: 16,
    backgroundColor: "#fff",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#444",
    marginBottom: 12,
  },
  optionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  optionChip: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 25,
    marginBottom: 10,
  },
  selectedChip: {
    backgroundColor: "#e0f0ff",
    borderColor: "#0066cc",
  },
  optionText: {
    fontSize: 12,
    color: "#555",
  },
  selectedChipText: {
    color: "#0066cc",
    fontWeight: "600",
  },
  sliderLabelContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  sliderLabel: {
    fontSize: 12,
    color: "#666",
  },
  sliderContainer: {
    width: '100%',
    marginVertical: 10,
    marginHorizontal: 10
  },
  sliderSelected: {
    backgroundColor: "#0066cc",
  },
  sliderUnselected: {
    backgroundColor: "#ddd",
  },
  sliderMarker: {
    backgroundColor: "#0066cc",
    borderWidth: 0,
  },
  inputRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    marginTop: 8,
  },
  rangeInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 25,
    width: 150,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 12,
    backgroundColor: "#f9f9f9",
  },
  bottomContainer: {
    flexDirection: "row",
    padding: 16,
    backgroundColor: "#fff",
    justifyContent: "space-between",
    alignItems: "center",
  },
  clearButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#0066cc",
    borderRadius: 25,
    marginRight: 8,
  },
  clearButtonText: {
    color: "#0066cc",
    fontSize: 12,
    fontWeight: "600",
  },
  applyButton: {
    flex: 2,
    paddingVertical: 10,
    backgroundColor: "#0066cc",
    borderRadius: 25,
    alignItems: "center",
  },
  applyButtonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
});
