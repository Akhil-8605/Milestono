import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
} from "react-native";
import { useNavigation } from "expo-router";
import { goBack } from "expo-router/build/global-state/routing";

interface Form1Props {
  formData: any;
  updateFormData: (data: any) => void;
  onNext: () => void;
  // Optional if you want a back function in Form1:
  onBack?: () => void;
}

const Form1: React.FC<Form1Props> = ({
  formData,
  updateFormData,
  onNext,
  onBack,
}) => {

  const navigation = useNavigation();

  // ----- STATE -----
  const [heading, setHeading] = useState(formData.heading || "");
  const [sellType, setSellType] = useState(formData.sellType || "");
  const [sellerType, setSellerType] = useState(formData.sellerType || "");
  const [oldProperty, setOldProperty] = useState(
    formData.oldProperty || ""
  );
  const [propertyCategory, setPropertyCategory] = useState(formData.propertyCategory || "");

  // Stores which property services have been selected
  const [propertyContains, setPropertyContains] = useState<string[]>(
    formData.propertyContains || []
  );

  // Stores which amenities have been selected
  const [amenities, setAmenities] = useState<string[]>(
    formData.amenities || []
  );

  // For user input when adding a custom amenity
  const [customAmenity, setCustomAmenity] = useState("");

  // A separate list for the **default** amenity options
  const defaultAmenityOptions = [
    "Car Parking",
    "CCTV",
    "Guard",
    "Gym",
    "Club House",
    "Water Supply",
    "Lift",
  ];

  // A list of newly added custom amenities (buttons) to display
  const [customAmenityOptions, setCustomAmenityOptions] = useState<string[]>(
    []
  );

  // Combine default + custom for rendering as toggle buttons
  const allAmenityOptions = [...defaultAmenityOptions, ...customAmenityOptions];

  // Validation errors
  const [errors, setErrors] = useState<{
    heading?: string;
    sellType?: string;
    sellerType?: string;
    oldProperty?: string;
    propertyCategory?: string;
    propertyContains?: string; // new
    amenities?: string; // new
  }>({});

  // ----- VALIDATION -----
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!heading) {
      newErrors.heading = "Property name is required";
    }
    if (!sellType) {
      newErrors.sellType = "Please select property kind";
    }
    if (!sellerType) {
      newErrors.sellerType = "Please select seller type";
    }
    if (!oldProperty) {
      newErrors.oldProperty = "Please select construction status";
    }
    if (!propertyCategory) {
      newErrors.propertyCategory = "Please select property type";
    }

    // If no property services selected
    if (propertyContains.length === 0) {
      newErrors.propertyContains = "Select at least one property service";
    }

    // If no amenities selected
    if (amenities.length === 0) {
      newErrors.amenities = "Select at least one amenity";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ----- NEXT BUTTON -----
  const handleNext = () => {
    if (validateForm()) {
      updateFormData({
        heading,
        sellType,
        sellerType,
        oldProperty,
        propertyCategory,
        propertyContains,
        amenities,
      });
      onNext();
    } else {
      Alert.alert("Error", "Please fill in all required fields");
    }
  };

  // ----- TOGGLE BUTTONS -----
  const SelectionButton = ({ title, selected, onPress, error }: any) => (
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

  const MultiSelectButton = ({ title, selected, onPress }: any) => (
    <TouchableOpacity
      style={[styles.selectionButton, selected && styles.selectedButton]}
      onPress={onPress}
    >
      <Text style={[styles.selectionText, selected && styles.selectedText]}>
        {title}
      </Text>
    </TouchableOpacity>
  );

  // ----- HANDLERS -----
  const togglePropertyService = (service: string) => {
    setPropertyContains((prev) =>
      prev.includes(service)
        ? prev.filter((s) => s !== service)
        : [...prev, service]
    );
  };

  const toggleAmenity = (amenity: string) => {
    setAmenities((prev) =>
      prev.includes(amenity)
        ? prev.filter((a) => a !== amenity)
        : [...prev, amenity]
    );
  };

  // Called when user presses "Add" for custom amenity
  const addCustomAmenity = () => {
    const newAmenity = customAmenity.trim();
    if (newAmenity) {
      // If not already in default or custom list, add it
      if (
        !defaultAmenityOptions.includes(newAmenity) &&
        !customAmenityOptions.includes(newAmenity)
      ) {
        setCustomAmenityOptions([...customAmenityOptions, newAmenity]);
      }
      // Clear the text input
      setCustomAmenity("");
    }
  };

  // ----- RENDER -----
  return (
    <View style={styles.container}>
      {/* Fixed Header */}

      {/* Scrollable Form Content */}
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => {
              goBack()
            }}
          >
            <Text style={styles.arrow}>←</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.title}>Basic Details</Text>
        <Text style={styles.subtitle}>Step 1 of 3</Text>


        {/* Property Name */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Property Name</Text>
          <TextInput
            style={[styles.input, errors.heading && styles.inputError]}
            value={heading}
            onChangeText={setHeading}
            placeholder="Enter Property Name"
          />
          {errors.heading && (
            <Text style={styles.errorText}>{errors.heading}</Text>
          )}
        </View>

        {/* Property Kind */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            What Kind of Property Do You Have?
          </Text>
          <View style={styles.optionsContainer}>
            <SelectionButton
              title="Sell"
              selected={sellType === "Sell"}
              onPress={() => setSellType("Sell")}
              error={errors.sellType}
            />
            <SelectionButton
              title="Rent"
              selected={sellType === "Rent"}
              onPress={() => setSellType("Rent")}
              error={errors.sellType}
            />
            <SelectionButton
              title="PG"
              selected={sellType === "PG"}
              onPress={() => setSellType("PG")}
              error={errors.sellType}
            />
          </View>
          {errors.sellType && (
            <Text style={styles.errorText}>{errors.sellType}</Text>
          )}
        </View>

        {/* Seller Type */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Seller Type?</Text>
          <View style={styles.optionsContainer}>
            <SelectionButton
              title="Owner"
              selected={sellerType === "Owner"}
              onPress={() => setSellerType("Owner")}
              error={errors.sellerType}
            />
            <SelectionButton
              title="Builder"
              selected={sellerType === "Builder"}
              onPress={() => setSellerType("Builder")}
              error={errors.sellerType}
            />
            <SelectionButton
              title="Dealer"
              selected={sellerType === "Dealer"}
              onPress={() => setSellerType("Dealer")}
              error={errors.sellerType}
            />
          </View>
          {errors.sellerType && (
            <Text style={styles.errorText}>{errors.sellerType}</Text>
          )}
        </View>

        {/* Construction Status */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Construction Status?</Text>
          <View style={styles.optionsContainer}>
            <SelectionButton
              title="New Launch"
              selected={oldProperty === "New Launch"}
              onPress={() => setOldProperty("New Launch")}
              error={errors.oldProperty}
            />
            <SelectionButton
              title="Under Construction"
              selected={oldProperty === "Under Construction"}
              onPress={() => setOldProperty("Under Construction")}
              error={errors.oldProperty}
            />
            <SelectionButton
              title="Ready to move"
              selected={oldProperty === "Ready To Move"}
              onPress={() => setOldProperty("Ready To Move")}
              error={errors.oldProperty}
            />
          </View>
          {errors.oldProperty && (
            <Text style={styles.errorText}>{errors.oldProperty}</Text>
          )}
        </View>

        {/* Property Type */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Property Type</Text>
          <View style={styles.optionsContainer}>
            <SelectionButton
              title="Residential"
              selected={propertyCategory === "Residential"}
              onPress={() => setPropertyCategory("Residential")}
              error={errors.propertyCategory}
            />
            <SelectionButton
              title="Commercial"
              selected={propertyCategory === "Commercial"}
              onPress={() => setPropertyCategory("Commercial")}
              error={errors.propertyCategory}
            />
          </View>
          {errors.propertyCategory && (
            <Text style={styles.errorText}>{errors.propertyCategory}</Text>
          )}
        </View>

        {/* Property Services */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Property Services</Text>
          <View style={styles.optionsContainer}>
            {[
              "Plots/Apartment",
              "Independent House/Villa",
              "Independent/Builder Floor",
              "Plot/Land",
              "RK/Studio Apartment",
              "Serviced Apartment",
              "Farmhouse",
              "Other",
            ].map((service) => (
              <MultiSelectButton
                key={service}
                title={service}
                selected={propertyContains.includes(service)}
                onPress={() => togglePropertyService(service)}
              />
            ))}
          </View>
          {errors.propertyContains && (
            <Text style={styles.errorText}>{errors.propertyContains}</Text>
          )}
        </View>

        {/* Amenities */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Amenities</Text>
          {/* Render default + custom amenity buttons */}
          <View style={styles.optionsContainer}>
            {allAmenityOptions.map((amenity) => (
              <MultiSelectButton
                key={amenity}
                title={amenity}
                selected={amenities.includes(amenity)}
                onPress={() => toggleAmenity(amenity)}
              />
            ))}
          </View>
          {errors.amenities && (
            <Text style={styles.errorText}>{errors.amenities}</Text>
          )}

          {/* Add custom amenity */}
          <View style={styles.customAmenityContainer}>
            <TextInput
              style={styles.customAmenityInput}
              value={customAmenity}
              onChangeText={setCustomAmenity}
              placeholder="Add custom amenity"
            />
            <TouchableOpacity
              style={styles.addButton}
              onPress={addCustomAmenity}
            >
              <Text style={styles.addButtonText}>Add</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Extra bottom padding so content doesn't hide behind bottom bar */}
        <View style={{ height: 40 }} />
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

export default Form1;

/* ---------- STYLES ---------- */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  /* HEADER */
  header: {
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 0, // to avoid overlap with header
    paddingBottom: 25, // to avoid overlap with header
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
    paddingTop: 16, // to avoid overlap with header
    paddingHorizontal: 16,
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
  inputContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
    fontWeight: "500",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 12,
  },
  inputError: {
    borderColor: "#ff0000",
  },
  errorText: {
    color: "#ff0000",
    fontSize: 12,
    marginTop: 4,
  },

  /* SECTIONS */
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 16,
  },
  optionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },

  /* SELECTION BUTTONS */
  selectionButton: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
  },
  selectedButton: {
    backgroundColor: "#242a80",
  },
  errorButton: {
    borderColor: "#ff0000",
  },
  selectionText: {
    color: "#333",
    fontSize: 12,
  },
  selectedText: {
    color: "#fff",
  },

  /* AMENITIES (Add Custom) */
  customAmenityContainer: {
    flexDirection: "row",
    gap: 12,
    marginTop: 16,
    marginBottom: 30,
  },
  customAmenityInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 12,
  },
  addButton: {
    backgroundColor: "#222761",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    justifyContent: "center",
  },
  addButtonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
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