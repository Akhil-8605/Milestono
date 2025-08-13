import React, { useState, useEffect } from "react";
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
import * as Location from 'expo-location';
import LocationPickerComponent from "./LocationPickerComponent";

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
  const [furnitures, setFurnitures] = useState(formData.furnitures || []);
  const [deposite, setDeposite] = useState(formData.deposite || "");
  const [pricePerMonth, setPricePerMonth] = useState(formData.pricePerMonth || "");
  const [ownership, setOwnership] = useState(formData.ownership || "");
  const [areaSqft, setAreaSqft] = useState(formData.areaSqft || "");
  const [expectedPrice, setExpectedPrice] = useState(
    formData.expectedPrice || ""
  );
  const [pricePerSqFt, setPricePerSqFt] = useState(formData.pricePerSqFt || "");
  const [isAllInclusive, setIsAllInclusive] = useState(
    formData.isAllInclusive || false
  );
  const [isPriceNegotiable, setIsPriceNegotiable] = useState(
    formData.isPriceNegotiable || false
  );
  const [isTaxchargeExc, setIsTaxchargeExc] = useState(formData.isTaxchargeExc || false);
  const [uniqueFeatures, setUniqueFeatures] = useState(
    formData.uniqueFeatures || ""
  );
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // <CHANGE> Auto-calculate price per sq ft when area or expected price changes
  useEffect(() => {
    if (areaSqft && expectedPrice && formData.sellType === "Sell") {
      const area = parseFloat(areaSqft);
      const price = parseFloat(expectedPrice);

      if (area > 0 && price > 0) {
        const calculatedPricePerSqFt = (price / area).toFixed(2);
        setPricePerSqFt(calculatedPricePerSqFt);
      } else {
        setPricePerSqFt("");
      }
    }
  }, [areaSqft, expectedPrice, formData.sellType]);

  const validateForm = () => {

    const newErrors: { [key: string]: string } = {};

    if (!location) {
      newErrors.location = "Please select or detect your property location.";
    }

    if (!city) {
      newErrors.city = "Please fill the city name";
    }

    if (!landmark) {
      newErrors.landmark = "Please fill the landmark";
    }

    if (!bedrooms) {
      newErrors.bedrooms = "Number of bedrooms is required.";
    }

    if (!bathrooms) {
      newErrors.bathrooms = "Number of bathrooms is required.";
    }

    if (!balconies) {
      newErrors.balconies = "Number of balconies is required.";
    }

    if (!ownership) {
      newErrors.ownership = "Please select a Ownership.";
    }

    if (formData.sellType !== "Sell") {
      if (!deposite) {
        newErrors.deposite = "Deposite is required.";

      }
      if (!pricePerMonth) {
        newErrors.pricePerMonth = "Price per month is required.";

      }
    }

    if (formData.sellType === "Sell") {
      if (!areaSqft) {
        newErrors.areaSqft = "Area in sq.ft. is required.";

      }
      if (!expectedPrice) {
        newErrors.expectedPrice = "Expected price is required.";

      }
      if (!pricePerSqFt) {
        newErrors.pricePerSqFt = "Price per sq.ft. is required.";

      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateForm()) {
      updateFormData({
        city,
        landmark,
        latitude: location.latitude,
        longitude: location.longitude,
        bedrooms,
        bathrooms,
        balconies,
        furnitures,
        ownership,
        areaSqft,
        expectedPrice,
        pricePerSqFt,
        isAllInclusive,
        isPriceNegotiable,
        isTaxchargeExc,
        uniqueFeatures,
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


  return (
    <View style={styles.container}>
      {/* Scrollable Content */}
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onBack}>
            <Text style={styles.arrow}>←</Text>
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
        <TouchableOpacity
          style={styles.detectLocationButton}
          onPress={async () => {
            try {
              let { status } = await Location.requestForegroundPermissionsAsync();
              if (status !== 'granted') {
                alert('Permission to access location was denied');
                return;
              }

              let locationResult = await Location.getCurrentPositionAsync({});
              const { latitude, longitude } = locationResult.coords;
              setLocation({ latitude, longitude });
            } catch (err) {
              console.error("Location error:", err);
            }
          }}
        >
          <Text style={styles.detectLocationButtonText}>📍 Detect My Location</Text>
        </TouchableOpacity>
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
              location={location}
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
                selected={furnitures.includes(item)}
                onPress={() => {
                  setFurnitures(
                    furnitures.includes(item)
                      ? furnitures.filter((f: string) => f !== item)
                      : [...furnitures, item]
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
                selected={ownership === detail}
                onPress={() => setOwnership(detail)}
                style={styles.selectionButton}
              />
            ))}
          </View>
        </View>
        {formData.sellType !== 'Sell' ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Price Details</Text>

            <TextInput
              style={[styles.input, errors.deposite && styles.inputError]}
              value={deposite}
              onChangeText={setDeposite}
              placeholder="₹ Deposite"
              keyboardType="numeric"
            />
            {errors.deposite && (
              <Text style={styles.errorText}>{errors.deposite}</Text>
            )}

            <TextInput
              style={[styles.input, errors.pricePerMonth && styles.inputError]}
              value={pricePerMonth}
              onChangeText={setPricePerMonth}
              placeholder="₹ Price per month"
              keyboardType="numeric"
            />
            {errors.pricePerMonth && (
              <Text style={styles.errorText}>{errors.pricePerMonth}</Text>
            )}
          </View>
        ) : (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Price Details</Text>

            <TextInput
              style={[styles.input, errors.areaSqft && styles.inputError]}
              value={areaSqft}
              onChangeText={setAreaSqft}
              placeholder="Area sq.ft."
              keyboardType="numeric"
            />
            {errors.areaSqft && (
              <Text style={styles.errorText}>{errors.areaSqft}</Text>
            )}

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

            {/* <CHANGE> Made price per sq ft field read-only since it's auto-calculated */}
            <TextInput
              style={[
                styles.input,
                errors.pricePerSqFt && styles.inputError,
                styles.calculatedInput
              ]}
              value={pricePerSqFt}
              placeholder="₹ Price per sq.ft. (Auto-calculated)"
              keyboardType="numeric"
              editable={false}
            />
            {errors.pricePerSqFt && (
              <Text style={styles.errorText}>{errors.pricePerSqFt}</Text>
            )}

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
                onPress={() => setIsPriceNegotiable(!isPriceNegotiable)}
              >
                <View
                  style={[
                    styles.checkboxBox,
                    isPriceNegotiable && styles.checkboxChecked,
                  ]}
                />
                <Text style={styles.checkboxLabel}>Price Negotiable</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.checkbox}
                onPress={() => setIsTaxchargeExc(!isTaxchargeExc)}
              >
                <View
                  style={[
                    styles.checkboxBox,
                    isTaxchargeExc && styles.checkboxChecked,
                  ]}
                />
                <Text style={styles.checkboxLabel}>
                  Tax and Govt.charges excluded
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}


        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            What makes your property unique? (Optional)
          </Text>
          <TextInput
            style={styles.textArea}
            value={uniqueFeatures}
            onChangeText={setUniqueFeatures}
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
    fontSize: 22,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 10,
    fontSize: 12,
    marginBottom: 12,
  },
  inputError: {
    borderColor: "#ff0000",
  },
  // <CHANGE> Added style for calculated input field
  calculatedInput: {
    backgroundColor: "#f5f5f5",
    color: "#666",
  },
  errorText: {
    color: "#ff0000",
    fontSize: 12,
    marginTop: 4,
  },
  detectLocationButton: {
    backgroundColor: '#222761',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
    alignSelf: 'flex-start',
  },
  detectLocationButtonText: {
    color: 'white',
    fontWeight: 'bold',
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
    paddingHorizontal: 15,
    paddingVertical: 10,
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
    fontSize: 10,
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
    width: 15,
    height: 15,
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
    fontSize: 14,
    color: "#333",
  },

  /* TEXT AREA */
  textArea: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
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
