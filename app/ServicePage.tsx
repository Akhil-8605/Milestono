import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
  Animated,
  Platform,
  Alert,
  Image,
  KeyboardAvoidingView,
  PermissionsAndroid,
  StatusBar,
} from "react-native";
import { Feather, Ionicons, FontAwesome5 } from "@expo/vector-icons";

import {
  launchImageLibrary,
  ImageLibraryOptions,
  PhotoQuality,
} from "react-native-image-picker";
import HeroSection from "./servicepage/HeroSection";
import { useNavigation } from "expo-router";

const { width } = Dimensions.get("window");

interface FormData {
  altNumber: string;
  address: string;
  description: string;
}

const ServicesPage: React.FC = () => {
  const [selectedService, setSelectedService] = useState<string>("service");
  const [formData, setFormData] = useState<FormData>({
    altNumber: "",
    address: "",
    description: "",
  });
  const [fileName, setFileName] = useState<string>("");
  const [imageUri, setImageUri] = useState<string | null>(null);

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;
  const cardAnimValues = useRef([new Animated.Value(50)]).current;

  // Refs for animation sequencing
  const formOpacity = useRef(new Animated.Value(0)).current;
  const formSlide = useRef(new Animated.Value(20)).current;

  React.useEffect(() => {
    // Run entrance animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.stagger(150, [
        Animated.timing(cardAnimValues[0], {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
      Animated.sequence([
        Animated.delay(300),
        Animated.parallel([
          Animated.timing(formOpacity, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(formSlide, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }),
        ]),
      ]),
    ]).start();
  }, []);

  const handleServiceSelect = (service: string) => {
    setSelectedService(service);

    // Add a little animation when selecting a service
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleInputChange = (name: keyof FormData, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = () => {
    console.log("Form submitted:", formData);
    Alert.alert("Success", "Your service request has been submitted!");
  };

  // Helper to request location permission on Android
  const requestLocationPermission = async (): Promise<boolean> => {
    if (Platform.OS === "android") {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    return true;
  };

  const detectLocation = async () => {
    const hasPermission = await requestLocationPermission();
    if (!hasPermission) {
      Alert.alert("Permission denied", "Unable to access your location");
      return;
    }
  };

  const pickImage = async () => {
    const options: ImageLibraryOptions = {
      mediaType: "photo",
      quality: 1 as PhotoQuality,
      includeExtra: true,
    };

    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log("User cancelled image picker");
      } else if (response.errorCode) {
        Alert.alert("Error", response.errorMessage || "Unknown error");
      } else if (response.assets && response.assets.length > 0) {
        const asset = response.assets[0];
        setImageUri(asset.uri || null);
        // Extract the file name from the URI
        const uriParts = asset.uri?.split("/") || [];
        setFileName(uriParts[uriParts.length - 1] || "image.jpg");

        // Add a success animation
        Animated.sequence([
          Animated.timing(scaleAnim, {
            toValue: 1.05,
            duration: 150,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          }),
        ]).start();
      }
    });
  };

  const serviceTypes = [
    {
      id: "service",
      name: "Service",
      icon: (
        <FontAwesome5
          name="user-cog"
          size={20}
          color={selectedService === "service" ? "#10b981" : "#9ca3af"}
        />
      ),
    },
  ];

  const suggestionCards = [
    {
      title: "Service",
      description: "milestono provide, please give your feedback",
    },
  ];

  const statusBarHeight = StatusBar.currentHeight || 0;
  const navigation = useNavigation();

  return (
    <KeyboardAvoidingView
      // behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={[styles.container, { marginTop: statusBarHeight }]}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <HeroSection />
        <Animated.View
          style={[
            styles.content,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          {/* Left Section */}
          <View style={styles.leftSection}>
            <Animated.View
              style={[
                styles.header,
                {
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }],
                },
              ]}
            >
              <Text style={styles.headerTitle}>
                What type of <Text style={styles.highlight}>service you</Text>{" "}
                want?
              </Text>
              <Text style={styles.headerSubtitle}>
                pick the one that suits your needs
              </Text>
            </Animated.View>

            <Animated.View style={styles.typesContainer}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.typesScrollContent}
              >
                {serviceTypes.map((service) => (
                  <Animated.View
                    key={service.id}
                    style={[
                      styles.typeItem,
                      selectedService === service.id && styles.activeTypeItem,
                      { transform: [{ scale: scaleAnim }] },
                    ]}
                  >
                    <TouchableOpacity
                      onPress={() => handleServiceSelect(service.id)}
                      style={styles.typeButton}
                      activeOpacity={0.7}
                    >
                      <View
                        style={[
                          styles.iconContainer,
                          selectedService === service.id &&
                            styles.activeIconContainer,
                        ]}
                      >
                        {service.icon}
                      </View>
                      <Text
                        style={[
                          styles.typeName,
                          selectedService === service.id &&
                            styles.activeTypeName,
                        ]}
                      >
                        {service.name}
                      </Text>
                    </TouchableOpacity>
                  </Animated.View>
                ))}
              </ScrollView>
            </Animated.View>

            <View style={styles.suggestionsContainer}>
              <View style={styles.suggestionsHeader}>
                <Text style={styles.suggestionsTitle}>Suggestions</Text>
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>Popular</Text>
                </View>
              </View>

              <ScrollView
                horizontal={width < 768}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.cardsContainer}
              >
                {suggestionCards.map((card, index) => (
                  <Animated.View
                    key={index}
                    style={[
                      styles.card,
                      {
                        transform: [{ translateY: cardAnimValues[0] }],
                      },
                    ]}
                  >
                    <View style={styles.cardAccent} />
                    <View style={styles.cardContent}>
                      <View style={styles.cardTitleContainer}>
                        <Text style={styles.cardTitle}>{card.title}</Text>
                        <Feather
                          name="chevron-right"
                          size={16}
                          color="#10b981"
                        />
                      </View>
                      <Text style={styles.cardDescription}>
                        {card.description}
                      </Text>
                      <TouchableOpacity
                        style={styles.detailsButton}
                        activeOpacity={0.7}
                      >
                        <Text style={styles.detailsButtonText}>Details</Text>
                        <Feather name="arrow-right" size={12} color="#9ca3af" />
                      </TouchableOpacity>
                    </View>
                  </Animated.View>
                ))}
              </ScrollView>
            </View>
          </View>

          {/* Right Section - Form */}
          <Animated.View
            style={[
              styles.rightSection,
              {
                opacity: formOpacity,
                transform: [{ translateX: formSlide }],
              },
            ]}
          >
            <View style={styles.formContainer}>
              <Text style={styles.formTitle}>Request Service</Text>

              <View style={styles.formFields}>
                <View style={styles.formGroup}>
                  <Text style={styles.label}>Alternative Number</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Alternative Phone Number"
                    value={formData.altNumber}
                    onChangeText={(text) =>
                      handleInputChange("altNumber", text)
                    }
                    keyboardType="phone-pad"
                    placeholderTextColor="#9ca3af"
                  />
                </View>

                <View style={styles.formGroup}>
                  <View style={styles.addressHeader}>
                    <Text style={styles.label}>Enter Address</Text>
                    <TouchableOpacity
                      style={styles.locationButton}
                      onPress={detectLocation}
                      activeOpacity={0.7}
                    >
                      <Ionicons name="location" size={12} color="#10b981" />
                      <Text style={styles.locationButtonText}>
                        Detect Location
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter Address"
                    value={formData.address}
                    onChangeText={(text) => handleInputChange("address", text)}
                    placeholderTextColor="#9ca3af"
                  />
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.label}>Upload photo of your problem</Text>
                  <TouchableOpacity
                    style={[
                      styles.uploadArea,
                      imageUri ? styles.hasFileUploadArea : null,
                    ]}
                    onPress={pickImage}
                    activeOpacity={0.7}
                  >
                    {imageUri ? (
                      <View style={styles.fileSelected}>
                        <Feather name="check" size={20} color="#10b981" />
                        <Text style={styles.fileSelectedText} numberOfLines={1}>
                          {fileName}
                        </Text>
                        {imageUri && (
                          <Image
                            source={{ uri: imageUri }}
                            style={styles.previewImage}
                            resizeMode="cover"
                          />
                        )}
                      </View>
                    ) : (
                      <View style={styles.uploadContent}>
                        <Feather name="upload" size={32} color="#9ca3af" />
                        <Text style={styles.uploadText}>
                          + Add Photo of Problem
                        </Text>
                        <Text style={styles.uploadHint}>
                          Tap here to select a photo
                        </Text>
                      </View>
                    )}
                  </TouchableOpacity>
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.label}>Problem Description</Text>
                  <TextInput
                    style={[styles.input, styles.textArea]}
                    placeholder="Enter Description"
                    value={formData.description}
                    onChangeText={(text) =>
                      handleInputChange("description", text)
                    }
                    multiline
                    numberOfLines={4}
                    placeholderTextColor="#9ca3af"
                  />
                </View>

                <TouchableOpacity
                  style={styles.submitButton}
                  //   onPress={handleSubmit}
                  onPress={() => {
                    navigation.navigate("ServiceMansPage" as never);
                  }}
                  activeOpacity={0.8}
                >
                  <Text style={styles.submitButtonText}>Submit Request</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Animated.View>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  leftSection: {
    marginBottom: 24,
  },
  header: {
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#1f2937",
  },
  highlight: {
    color: "#10b981",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#4b5563",
  },
  typesContainer: {
    marginBottom: 24,
  },
  typesScrollContent: {
    paddingBottom: 8,
  },
  typeItem: {
    marginRight: 16,
    alignItems: "center",
  },
  activeTypeItem: {},
  typeButton: {
    alignItems: "center",
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 16,
    backgroundColor: "#f3f4f6",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  activeIconContainer: {
    backgroundColor: "#d1fae5",
  },
  typeName: {
    fontWeight: "500",
    color: "#9ca3af",
    fontSize: 12,
  },
  activeTypeName: {
    color: "#1f2937",
    fontWeight: "600",
  },
  suggestionsContainer: {
    marginTop: 24,
  },
  suggestionsHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  suggestionsTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1f2937",
  },
  badge: {
    marginLeft: 8,
    backgroundColor: "#d1fae5",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 999,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "500",
    color: "#10b981",
  },
  cardsContainer: {
    flexDirection: width < 768 ? "row" : "column",
    flexWrap: width < 768 ? "nowrap" : "wrap",
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    marginRight: width < 768 ? 16 : 0,
    marginBottom: 16,
    width: width < 768 ? width * 0.7 : "100%",
  },
  cardAccent: {
    height: 4,
    backgroundColor: "#10b981",
  },
  cardContent: {
    padding: 16,
  },
  cardTitleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1f2937",
  },
  cardDescription: {
    fontSize: 13,
    color: "#4b5563",
    marginBottom: 12,
  },
  detailsButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
    alignSelf: "flex-start",
  },
  detailsButtonText: {
    fontSize: 10,
    fontWeight: "500",
    color: "#1f2937",
    marginRight: 4,
  },
  rightSection: {
    width: "100%",
  },
  formContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  formTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    color: "#1f2937",
  },
  formFields: {},
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#1f2937",
    marginBottom: 10,
  },
  addressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  locationButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#d1fae5",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  locationButtonText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#10b981",
    marginLeft: 4,
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    backgroundColor: "#ffffff",
    color: "#1f2937",
  },
  textArea: {
    minHeight: 120,
    textAlignVertical: "top",
  },
  uploadArea: {
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: "#e5e7eb",
    borderRadius: 8,
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  hasFileUploadArea: {
    backgroundColor: "#d1fae5",
    borderColor: "#10b981",
  },
  uploadContent: {
    alignItems: "center",
  },
  uploadText: {
    fontWeight: "500",
    color: "#10b981",
    marginTop: 12,
    marginBottom: 8,
  },
  uploadHint: {
    fontSize: 12,
    color: "#4b5563",
  },
  fileSelected: {
    alignItems: "center",
    marginVertical: 8,
  },
  fileSelectedText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#10b981",
    maxWidth: 200,
  },
  previewImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginTop: 8,
  },
  submitButton: {
    width: "100%",
    padding: 14,
    backgroundColor: "#10b981",
    borderRadius: 8,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  submitButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#ffffff",
  },
});

export default ServicesPage;
