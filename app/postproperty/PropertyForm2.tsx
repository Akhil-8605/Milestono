import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  Platform,
} from "react-native";
import MapView, { Marker } from "react-native-maps";

interface Form2Props {
  formData: any;
  updateFormData: (data: any) => void;
  onNext: () => void;
  onBack: () => void;
}

const Form2: React.FC<Form2Props> = ({
  formData,
  updateFormData,
  onNext,
  onBack,
}) => {
  const [city, setCity] = useState(formData.city || "");
  const [landmark, setLandmark] = useState(formData.landmark || "");
  const [location, setLocation] = useState(
    formData.location || {
      latitude: 26.8467,
      longitude: 75.8258,
    }
  );
  const [bedrooms, setBedrooms] = useState(formData.bedrooms || "");
  const [bathrooms, setBathrooms] = useState(formData.bathrooms || "");
  const [balconies, setBalconies] = useState(formData.balconies || "");
  const [furnishings, setFurnishings] = useState(formData.furnishings || []);
  const [basicDetails, setBasicDetails] = useState(formData.basicDetails || "");
  const [area, setArea] = useState(formData.area || "");
  const [expectedPrice, setExpectedPrice] = useState(
    formData.expectedPrice || ""
  );
  const [pricePerSqFt, setPricePerSqFt] = useState(formData.pricePerSqFt || "");
  const [isAllInclusive, setIsAllInclusive] = useState(
    formData.isAllInclusive || false
  );
  const [isNegotiable, setIsNegotiable] = useState(
    formData.isNegotiable || false
  );
  const [taxExcluded, setTaxExcluded] = useState(formData.taxExcluded || false);
  const [propertyDescription, setPropertyDescription] = useState(
    formData.propertyDescription || ""
  );
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!city) newErrors.city = "City is required";
    if (!location) newErrors.location = "Please select location on map";
    if (!bedrooms) newErrors.bedrooms = "Please select number of bedrooms";
    if (!bathrooms) newErrors.bathrooms = "Please select number of bathrooms";
    if (!area) newErrors.area = "Area is required";
    if (!expectedPrice) newErrors.expectedPrice = "Expected price is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateForm()) {
      updateFormData({
        city,
        landmark,
        location,
        bedrooms,
        bathrooms,
        balconies,
        furnishings,
        basicDetails,
        area,
        expectedPrice,
        pricePerSqFt,
        isAllInclusive,
        isNegotiable,
        taxExcluded,
        propertyDescription,
      });
      onNext();
    } else {
      Alert.alert("Error", "Please fill in all required fields");
    }
  };

  const SelectionButton = ({ title, selected, onPress, error }: any) => (
    <TouchableOpacity
      style={[
        styles.RoundedselectionButton,
        selected && styles.selectedButton,
        error && styles.errorButton,
      ]}
      onPress={onPress}
    >
      <Text style={[styles.selectionText, selected && styles.selectedText]}>
        {title}
      </Text>
    </TouchableOpacity>
  );

  const SelectionBasicDetailsButton = ({
    title,
    selected,
    onPress,
    error,
  }: any) => (
    <TouchableOpacity
      style={[
        styles.selectionButton,
        selected && styles.selectedButton,
        error && styles.errorButton,
      ]}
      onPress={onPress}
    >
      <Text style={[styles.selectionText, selected && styles.selectedText]}>
        {title}
      </Text>
    </TouchableOpacity>
  );

  const FurnishingButton = ({ title, selected, onPress }: any) => (
    <TouchableOpacity
      style={[styles.selectionButton, selected && styles.selectedButton]}
      onPress={onPress}
    >
      <Text style={[styles.selectionText, selected && styles.selectedText]}>
        {title}
      </Text>
    </TouchableOpacity>
  );

  // Dummy for web usage (since react-native-maps won't work well on web):
  const LocationPickerComponent = ({ onLocationSelect, style }: any) => {
    return (
      <View style={[style, styles.webMapFallback]}>
        <Text style={styles.webMapText}>
          Please enter your location details in the fields above. Map selection
          is available in the mobile app.
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Scrollable Content */}
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onBack}>
            <Text style={styles.arrow}>←</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => console.log("Post Via WhatsApp pressed (Form2)")}
          >
            {/* <Text style={styles.whatsapp}>Post Via WhatsApp</Text> */}
          </TouchableOpacity>
        </View>

        <Text style={styles.title}>Basic Details of Your Property</Text>
        <Text style={styles.subtitle}>Step 2 of 3</Text>

        {/* City / Landmark */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Where is your property located?
          </Text>
          <TextInput
            style={[styles.input, errors.city && styles.inputError]}
            value={city}
            onChangeText={setCity}
            placeholder="City"
          />
          {errors.city && <Text style={styles.errorText}>{errors.city}</Text>}

          <TextInput
            style={styles.input}
            value={landmark}
            onChangeText={setLandmark}
            placeholder="Nearest Landmark"
          />
        </View>

        {/* Map Location */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Select Your Property Location on the Map
          </Text>
          <View style={styles.mapContainer}>
            <LocationPickerComponent
              onLocationSelect={(e: {
                nativeEvent: {
                  coordinate: { latitude: number; longitude: number };
                };
              }) => setLocation(e.nativeEvent.coordinate)}
              style={styles.map}
            />
          </View>
          {errors.location && (
            <Text style={styles.errorText}>{errors.location}</Text>
          )}
        </View>

        {/* Bedrooms */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>No. of Bedrooms (RK)</Text>
          <View style={styles.optionsContainer}>
            {["1RK", "1", "2", "3", "4", "5+"].map((num) => (
              <SelectionButton
                key={num}
                title={num}
                selected={bedrooms === num}
                onPress={() => setBedrooms(num)}
                error={errors.bedrooms}
              />
            ))}
          </View>
          {errors.bedrooms && (
            <Text style={styles.errorText}>{errors.bedrooms}</Text>
          )}
        </View>

        {/* Bathrooms */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>No. of Bathrooms</Text>
          <View style={styles.optionsContainer}>
            {["1", "2", "3", "4", "5+"].map((num) => (
              <SelectionButton
                key={num}
                title={num}
                selected={bathrooms === num}
                onPress={() => setBathrooms(num)}
                error={errors.bathrooms}
              />
            ))}
          </View>
          {errors.bathrooms && (
            <Text style={styles.errorText}>{errors.bathrooms}</Text>
          )}
        </View>

        {/* Balconies */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>No. of Balconies</Text>
          <View style={styles.optionsContainer}>
            {["1", "2", "3", "4", "5+"].map((num) => (
              <SelectionButton
                key={num}
                title={num}
                selected={balconies === num}
                onPress={() => setBalconies(num)}
              />
            ))}
          </View>
        </View>

        {/* Furnitures */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Furnitures (Optional)</Text>
          <View style={styles.optionsContainer}>
            {[
              "Bed",
              "Sofa",
              "TV",
              "Cupboard",
              "AC",
              "Water Purifier",
              "Geyser",
              "Washing Machine",
              "Dining Table",
            ].map((item) => (
              <FurnishingButton
                key={item}
                title={item}
                selected={furnishings.includes(item)}
                onPress={() => {
                  setFurnishings(
                    furnishings.includes(item)
                      ? furnishings.filter((f: string) => f !== item)
                      : [...furnishings, item]
                  );
                }}
              />
            ))}
          </View>
        </View>

        {/* Basic Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Basic Details</Text>
          <View style={styles.optionsContainer}>
            {[
              "Freehold",
              "Co-operative society",
              "Leasehold",
              "Power of Attorney",
            ].map((detail) => (
              <SelectionBasicDetailsButton
                key={detail}
                title={detail}
                selected={basicDetails === detail}
                onPress={() => setBasicDetails(detail)}
                style={styles.selectionButton}
              />
            ))}
          </View>
        </View>

        {/* Area */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Area Details</Text>
          <TextInput
            style={[styles.input, errors.area && styles.inputError]}
            value={area}
            onChangeText={setArea}
            placeholder="₹ Area sq.ft."
            keyboardType="numeric"
          />
          {errors.area && <Text style={styles.errorText}>{errors.area}</Text>}
        </View>

        {/* Price Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Price Details</Text>
          <TextInput
            style={[styles.input, errors.expectedPrice && styles.inputError]}
            value={expectedPrice}
            onChangeText={setExpectedPrice}
            placeholder="₹ Expected Price"
            keyboardType="numeric"
          />
          {errors.expectedPrice && (
            <Text style={styles.errorText}>{errors.expectedPrice}</Text>
          )}

          <TextInput
            style={styles.input}
            value={pricePerSqFt}
            onChangeText={setPricePerSqFt}
            placeholder="₹ Price per sq.ft."
            keyboardType="numeric"
          />

          <View style={styles.checkboxContainer}>
            <TouchableOpacity
              style={styles.checkbox}
              onPress={() => setIsAllInclusive(!isAllInclusive)}
            >
              <View
                style={[
                  styles.checkboxBox,
                  isAllInclusive && styles.checkboxChecked,
                ]}
              />
              <Text style={styles.checkboxLabel}>All inclusive price?</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.checkbox}
              onPress={() => setIsNegotiable(!isNegotiable)}
            >
              <View
                style={[
                  styles.checkboxBox,
                  isNegotiable && styles.checkboxChecked,
                ]}
              />
              <Text style={styles.checkboxLabel}>Price Negotiable</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.checkbox}
              onPress={() => setTaxExcluded(!taxExcluded)}
            >
              <View
                style={[
                  styles.checkboxBox,
                  taxExcluded && styles.checkboxChecked,
                ]}
              />
              <Text style={styles.checkboxLabel}>
                Tax and Govt.charges excluded
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            What makes your property unique? (Optional)
          </Text>
          <TextInput
            style={styles.textArea}
            value={propertyDescription}
            onChangeText={setPropertyDescription}
            placeholder="Share some details about your property..."
            multiline
            numberOfLines={4}
          />
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>

      {/* Fixed Bottom Bar */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.bottomButton} onPress={handleNext}>
          <Text style={styles.bottomButtonText}>Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Form2;

/* --- STYLES --- */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  /* HEADER */
  header: {
    backgroundColor: "#fff",
    zIndex: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 0, // to avoid overlap with header
    paddingBottom: 25,
  },
  arrow: {
    fontSize: 24,
    color: "#333",
  },
  whatsapp: {
    fontSize: 16,
    color: "#0066CC",
    fontWeight: "600",
  },

  /* SCROLL CONTENT */
  scrollContent: {
    paddingTop: 16, // offset for the fixed header
    paddingHorizontal: 16,
    paddingBottom: 60, // offset for bottom bar
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 12,
  },
  inputError: {
    borderColor: "#ff0000",
  },
  errorText: {
    color: "#ff0000",
    fontSize: 14,
    marginTop: 4,
  },
  mapContainer: {
    height: 300,
    marginBottom: 16,
    borderRadius: 8,
    overflow: "hidden",
  },
  map: {
    flex: 1,
  },
  webMapFallback: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  webMapText: {
    textAlign: "center",
    color: "#666",
    fontSize: 14,
  },

  /* SELECTION BUTTONS */
  optionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  RoundedselectionButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
  },
  selectionButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
  },
  selectedButton: {
    backgroundColor: "#222761",
    borderColor: "#0066CC",
  },
  errorButton: {
    borderColor: "#ff0000",
  },
  selectionText: {
    color: "#333",
    fontSize: 16,
  },
  selectedText: {
    color: "#ffffff",
  },

  /* CHECKBOXES */
  checkboxContainer: {
    marginTop: 16,
  },
  checkbox: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  checkboxBox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 4,
    marginRight: 8,
  },
  checkboxChecked: {
    backgroundColor: "#0066CC",
    borderColor: "#0066CC",
  },
  checkboxLabel: {
    fontSize: 16,
    color: "#333",
  },

  /* TEXT AREA */
  textArea: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    height: 100,
    textAlignVertical: "top",
  },

  /* BOTTOM BAR */
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  bottomButton: {
    backgroundColor: "#222761",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    width: "80%",
  },
  bottomButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});
