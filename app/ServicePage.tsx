"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
  Platform,
  Alert,
  Image,
  KeyboardAvoidingView,
  PermissionsAndroid,
  StatusBar,
} from "react-native"
import { Feather, Ionicons, FontAwesome5, MaterialIcons, AntDesign, MaterialCommunityIcons } from "@expo/vector-icons"
import { useNavigation, useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import * as Haptics from "expo-haptics"
import { LinearGradient } from "expo-linear-gradient"
import { BASE_URL } from "@env"
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withRepeat,
  withSequence,
  withDelay,
  Easing,
  interpolate,
  Extrapolate,
  cancelAnimation,
} from "react-native-reanimated"
import { BlurView } from "expo-blur"
import HeroSection from "./servicepage/HeroSection"
const { width, height } = Dimensions.get("window")
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from 'expo-location';
import { Picker } from "@react-native-picker/picker";

const categories = [
  "Property Legal",
  "Plumbing",
  "Electrician",
  "Construction",
  "Painting",
  "Cleaning",
  "Interior Designing",
  "Pest Control",
  "Appliance Repair",
  "Carpentry",
  "Landscaping",
  "Courier",
];

interface FormData {
  name: string;
  description: string;
  landmark: string;
  category: string;
  image: {
    uri: string;
    name: string;
    type: string;
  } | null;
  address: string;
  coordinates: [number, number];
}

interface ServiceType {
  id: string
  name: string
  icon: React.ReactNode
}

interface SuggestionCard {
  title: string
  description: string
  icon: string
  color: string
}

// Helper functions for color manipulation
const hexToRgb = (hex: string): { r: number; g: number; b: number } => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? {
        r: Number.parseInt(result[1], 16),
        g: Number.parseInt(result[2], 16),
        b: Number.parseInt(result[3], 16),
      }
    : { r: 0, g: 0, b: 0 }
}

const rgbToHex = (r: number, g: number, b: number): string => {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)
}

const lightenColor = (color: string, percent: number): string => {
  const { r, g, b } = hexToRgb(color)
  const amount = Math.floor(255 * (percent / 100))

  const newR = Math.min(r + amount, 255)
  const newG = Math.min(g + amount, 255)
  const newB = Math.min(b + amount, 255)

  return rgbToHex(newR, newG, newB)
}

const darkenColor = (color: string, percent: number): string => {
  const { r, g, b } = hexToRgb(color)
  const amount = Math.floor(255 * (percent / 100))

  const newR = Math.max(r - amount, 0)
  const newG = Math.max(g - amount, 0)
  const newB = Math.max(b - amount, 0)

  return rgbToHex(newR, newG, newB)
}

// Success Animation Component (inline)
const SuccessAnimation: React.FC = () => {
  const scale = useSharedValue(0)
  const opacity = useSharedValue(0)
  const checkScale = useSharedValue(0)

  useEffect(() => {
    scale.value = withTiming(1, {
      duration: 400,
      easing: Easing.out(Easing.cubic),
    })
    opacity.value = withTiming(1, {
      duration: 400,
      easing: Easing.out(Easing.cubic),
    })

    // Animate the checkmark after the circle appears
    checkScale.value = withDelay(300, withSpring(1, { damping: 12, stiffness: 100 }))
  }, [])

  const circleStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      opacity: opacity.value,
    }
  })

  const checkStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: checkScale.value }],
      opacity: checkScale.value,
    }
  })

  return (
    <View style={styles.successAnimation}>
      <Animated.View style={[styles.successCircle, circleStyle]}>
        <Animated.View style={checkStyle}>
          <AntDesign name="checkcircle" size={60} color="#10b981" />
        </Animated.View>
      </Animated.View>
    </View>
  )
}

const ServicesPage: React.FC = () => {
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    description: "",
    landmark: "",
    category: "",
    image: null,
    address: "",
    coordinates: [0, 0],
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [fileName, setFileName] = useState<string>("")
  const [imageUri, setImageUri] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [showSuccess, setShowSuccess] = useState<boolean>(false)

  // Animation values with Reanimated
  const fadeIn = useSharedValue(0)
  const slideUp = useSharedValue(20)
  const scale = useSharedValue(0.95)
  const buttonScale = useSharedValue(1)
  const formOpacity = useSharedValue(0)
  const formSlide = useSharedValue(20)
  const uploadPulse = useSharedValue(1)
  const spinValue = useSharedValue(0)

  // Card animations
  const cardAnimValues = useRef(
    Array(3)
      .fill(0)
      .map(() => useSharedValue(50)),
  ).current

  const navigation = useNavigation()
  const router = useRouter();

  // Animated value for service selection
  const serviceScale = useSharedValue(1)

  // Animated value for location detection
  const locationScale = useSharedValue(1)

  const [uploadPulseState, setUploadPulseState] = useState(1)

  useEffect(() => {
    // Run entrance animations
    fadeIn.value = withTiming(1, {
      duration: 800,
      easing: Easing.out(Easing.cubic),
    })
    slideUp.value = withTiming(0, {
      duration: 800,
      easing: Easing.out(Easing.cubic),
    })
    scale.value = withTiming(1, {
      duration: 800,
      easing: Easing.out(Easing.cubic),
    })

    // Stagger card animations
    cardAnimValues.forEach((anim, index) => {
      anim.value = withDelay(150 * index, withTiming(0, { duration: 600, easing: Easing.out(Easing.cubic) }))
    })

    // Form animations
    formOpacity.value = withDelay(400, withTiming(1, { duration: 600, easing: Easing.out(Easing.cubic) }))

    formSlide.value = withDelay(400, withTiming(0, { duration: 600, easing: Easing.out(Easing.cubic) }))

    // Start pulsing animation for upload area
    startUploadPulseAnimation()

    // Start spinning animation for loading icon
    spinValue.value = withRepeat(
      withTiming(1, { duration: 1000, easing: Easing.linear }),
      -1, // Infinite
      false,
    )
  }, [])

  const startUploadPulseAnimation = () => {
    uploadPulse.value = withRepeat(
      withSequence(
        withTiming(1.05, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
      ),
      -1, // Infinite
      false,
    )
  }

  const handleServiceSelect = (service: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
    setSelectedService(service)
    setFormData(prev => ({ ...prev, category: service }))

    // Add animation when selecting a service
    serviceScale.value = withSequence(
      withTiming(0.95, { duration: 100, easing: Easing.out(Easing.cubic) }),
      withTiming(1.05, { duration: 150, easing: Easing.out(Easing.cubic) }),
      withTiming(1, { duration: 200, easing: Easing.out(Easing.cubic) }),
    )
  }

  const handleInputChange = (name: keyof FormData, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    })
    // Clear error when user types
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: "" }))
    }
  }

  const pickImage = async () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission Required", "Permission to access media library is required!");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        const nameFromUri = asset.uri.split("/").pop() || "image.jpg";
        const extension = nameFromUri.split(".").pop() || "jpg";
        const type = `image/${extension}`;

        const file = {
          uri: asset.uri,
          name: asset.fileName || nameFromUri,
          type,
        };

        console.log(formData);

        setFormData({ ...formData, image: file });
        setImageUri(asset.uri);
        setFileName(file.name);
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Error", "Failed to pick image");
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setFormErrors({});

    const token = await AsyncStorage.getItem("auth");
    if (!token) {
      setLoading(false);
      Alert.alert("Login Required", "You must be logged in to request a service");
      navigation.navigate("Login" as never);
      return;
    }

    const errors: Record<string, string> = {};
    if (!formData.name) errors.name = "Problem name is required";
    if (!formData.description) errors.description = "Description is required";
    if (!formData.category) errors.category = "Category is required";

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      setLoading(false);
      return;
    }

    try {
      const data = new FormData();
      data.append("formData", JSON.stringify({
        name: formData.name,
        description: formData.description,
        landmark: formData.landmark,
        category: formData.category,
        address: formData.address,
        coordinates: [formData.coordinates[1],formData.coordinates[0]],
        status: "requested",
        price: "",
        otp: ""
      }));

      if (formData.image) {
        data.append("serviceImage", {
          uri: formData.image.uri,
          name: formData.image.name,
          type: formData.image.type
        } as any);
      }


      const response = await axios.post<{ _id: string }>(
        `${BASE_URL}/api/services`,
        data,
        {
          headers: {
            Authorization: token,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        router.push({
          pathname: "/ServiceMansPage",
          params: { serviceId: response.data._id },
        });

        // Reset form
        setFormData({
          name: "",
          description: "",
          landmark: "",
          category: "",
          image: null,
          address: "",
          coordinates: [0, 0],
        });
        setFileName("");
        setSelectedService(null);
      }, 1500);
    } catch (error: any) {
      console.error("Error submitting form:", error);
      Alert.alert(
        "Error", 
        error.response?.data?.message || error.message || "An error occurred"
      );
    } finally {
      setLoading(false);
    }
  };

  const detectLocation = async () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'We need location permissions to detect your location');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      const [latitude, longitude] = [location.coords.latitude, location.coords.longitude];
      
      // Get human-readable address
      let addressResponse = await Location.reverseGeocodeAsync({
        latitude,
        longitude
      });
      
      const address = addressResponse[0]?.name || 
        `Detected location (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`;

      setFormData(prev => ({
        ...prev,
        coordinates: [latitude, longitude],
        address: address
      }));

      // Animation feedback
      locationScale.value = withSequence(
        withTiming(0.95, { duration: 100 }),
        withTiming(1.05, { duration: 150 }),
        withTiming(1, { duration: 200 })
      );
    } catch (error) {
      console.error("Error getting location:", error);
      Alert.alert('Error', 'Could not determine your location');
    }
  };

  const mainContentStyle = useAnimatedStyle(() => {
    return {
      opacity: fadeIn.value,
      transform: [{ translateY: slideUp.value }],
    }
  })

  const headerStyle = useAnimatedStyle(() => {
    return {
      opacity: fadeIn.value,
      transform: [{ translateY: slideUp.value }],
    }
  })

  const formContainerStyle = useAnimatedStyle(() => {
    return {
      opacity: formOpacity.value,
      transform: [{ translateX: formSlide.value }],
    }
  })

  const buttonScaleStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: buttonScale.value }],
    }
  })

  const uploadPulseStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: imageUri ? 1 : uploadPulseState }],
    }
  })

  const spinStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          rotate: `${interpolate(spinValue.value, [0, 1], [0, 360])}deg`,
        },
      ],
    }
  })

  const serviceTypes = [
    {
      id: "Property Legal",
      name: "Property Legal",
      icon: (
        <FontAwesome5 name="gavel" size={24} color={selectedService === "Property Legal" ? "#10b981" : "#9ca3af"} />
      ),
    },
    {
      id: "Electrician",
      name: "Electrician",
      icon: (
        <MaterialCommunityIcons
          name="lightning-bolt"
          size={24}
          color={selectedService === "Electrician" ? "#10b981" : "#9ca3af"}
        />
      ),
    },
    {
      id: "Construction",
      name: "Construction",
      icon: (
        <FontAwesome5 name="hard-hat" size={24} color={selectedService === "Construction" ? "#10b981" : "#9ca3af"} />
      ),
    },
    {
      id: "Interior Designing",
      name: "Interior Designing",
      icon: (
        <MaterialCommunityIcons
          name="home-outline"
          size={24}
          color={selectedService === "Interior Designing" ? "#10b981" : "#9ca3af"}
        />
      ),
    },
    {
      id: "Painting",
      name: "Painting",
      icon: (
        <MaterialCommunityIcons
          name="roller-skate"
          size={24}
          color={selectedService === "Painting" ? "#10b981" : "#9ca3af"}
        />
      ),
    },
    {
      id: "Cleaning",
      name: "Cleaning",
      icon: (
        <MaterialCommunityIcons
          name="spray-bottle"
          size={24}
          color={selectedService === "Cleaning" ? "#10b981" : "#9ca3af"}
        />
      ),
    },
    {
      id: "Plumbing",
      name: "Plumbing",
      icon: (
        <MaterialCommunityIcons name="pipe" size={24} color={selectedService === "Plumbing" ? "#10b981" : "#9ca3af"} />
      ),
    },
    {
      id: "Other",
      name: "Other",
      icon: <MaterialIcons name="more-horiz" size={24} color={selectedService === "Other" ? "#10b981" : "#9ca3af"} />,
    },
  ]

  const suggestionCards: SuggestionCard[] = [
    {
      title: "Home Service",
      description: "Professional home maintenance and repair services",
      icon: "home",
      color: "#10b981",
    },
    {
      title: "Appliance Repair",
      description: "Expert repair for all household appliances",
      icon: "settings",
      color: "#8b5cf6",
    },
    {
      title: "Emergency Service",
      description: "24/7 emergency repair and maintenance",
      icon: "alert-circle",
      color: "#ec4899",
    },
  ]

  const statusBarHeight = StatusBar.currentHeight || 0

  // Animated style for service selection
  const serviceTypeAnimStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: serviceScale.value }],
    }
  })

  // Animated style for location detection
  const locationButtonStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: locationScale.value }],
    }
  })

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={[styles.container, { marginTop: statusBarHeight }]}
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
    >
      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <HeroSection />
        <Animated.View style={[styles.content, mainContentStyle]}>
          {/* Left Section */}
          <View style={styles.leftSection}>
            <Animated.View style={[styles.header, headerStyle]}>
              <Text style={styles.headerTitle}>
                What type of <Text style={styles.highlight}>service</Text> do you need?
              </Text>
              <Text style={styles.headerSubtitle}>Choose the option that best fits your requirements</Text>
            </Animated.View>

            <View style={styles.typesContainer}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.typesScrollContent}
              >
                <View style={styles.serviceGrid}>
                  {serviceTypes.map((service) => (
                    <TouchableOpacity
                      key={service.id}
                      style={[styles.serviceCard, selectedService === service.id && styles.selectedServiceCard]}
                      onPress={() => handleServiceSelect(service.id)}
                      activeOpacity={0.7}
                    >
                      {selectedService === service.id && (
                        <View style={styles.checkmarkBadge}>
                          <Feather name="check" size={16} color="#fff" />
                        </View>
                      )}
                      <View
                        style={[
                          styles.serviceIconContainer,
                          selectedService === service.id && styles.selectedServiceIconContainer,
                        ]}
                      >
                        {service.icon}
                      </View>
                      <Text
                        style={[styles.serviceName, selectedService === service.id && styles.selectedServiceName]}
                        numberOfLines={2}
                        textBreakStrategy="balanced"
                      >
                        {service.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            </View>

            <View style={styles.suggestionsContainer}>
              <View style={styles.suggestionsHeader}>
                <Text style={styles.suggestionsTitle}>Popular Services</Text>
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>Recommended</Text>
                </View>
              </View>

              <ScrollView
                horizontal={width < 768}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.cardsContainer}
              >
                {suggestionCards.map((card, index) => {
                  const cardAnimStyle = useAnimatedStyle(() => {
                    return {
                      transform: [
                        {
                          translateY: cardAnimValues[index % cardAnimValues.length].value,
                        },
                        {
                          scale: interpolate(fadeIn.value, [0, 1], [0.95, 1], Extrapolate.CLAMP),
                        },
                      ],
                    }
                  })

                  return (
                    <Animated.View key={index} style={[styles.card, cardAnimStyle]}>
                      <LinearGradient
                        colors={[card.color, darkenColor(card.color, 10)]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.cardAccent}
                      />
                      <View style={styles.cardContent}>
                        <View style={styles.cardTitleContainer}>
                          <View style={styles.cardTitleWithIcon}>
                            <View
                              style={[
                                styles.cardIconContainer,
                                {
                                  backgroundColor: lightenColor(card.color, 40),
                                },
                              ]}
                            >
                              <Feather name={card.icon as any} size={16} color={card.color} />
                            </View>
                            <Text style={styles.cardTitle}>{card.title}</Text>
                          </View>
                          <Feather name="chevron-right" size={16} color={card.color} />
                        </View>
                        <Text style={styles.cardDescription}>{card.description}</Text>
                        <TouchableOpacity
                          style={[styles.detailsButton, { borderColor: lightenColor(card.color, 30) }]}
                          activeOpacity={0.7}
                          onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
                        >
                          <Text style={[styles.detailsButtonText, { color: card.color }]}>View Details</Text>
                          <Feather name="arrow-right" size={12} color={card.color} />
                        </TouchableOpacity>
                      </View>
                    </Animated.View>
                  )
                })}
              </ScrollView>
            </View>
          </View>

          {/* Right Section - Form */}
          <Animated.View style={[styles.rightSection, { opacity: fadeIn, transform: [{ translateY: slideUp }] }]}>
            <View style={styles.formContainer}>
              <View style={styles.formTitleContainer}>
                <Text style={styles.formTitle}>Request Service</Text>
                <View style={styles.formBadge}>
                  <Text style={styles.formBadgeText}>Easy Process</Text>
                </View>
              </View>

              <View style={styles.formFields}>
                <View style={styles.formGroup}>
                  <Text style={styles.label}>Problem Name</Text>
                  <View style={styles.inputContainer}>
                    <Feather name="alert-circle" size={16} color="#9ca3af" style={styles.inputIcon} />
                    <TextInput
                      style={[styles.input, formErrors.name && styles.errorInput]}
                      placeholder="Problem Name"
                      value={formData.name}
                      onChangeText={(text) => handleInputChange("name", text)}
                      placeholderTextColor="#9ca3af"
                    />
                  </View>
                  {formErrors.name && (
                    <Text style={styles.errorText}>{formErrors.name}</Text>
                  )}
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.label}>Problem Description</Text>
                  <View style={styles.inputContainer}>
                    <Feather name="file-text" size={16} color="#9ca3af" style={styles.inputIcon} />
                    <TextInput
                      style={[styles.input, styles.textArea, formErrors.description && styles.errorInput]}
                      placeholder="Describe your problem in detail"
                      value={formData.description}
                      onChangeText={(text) => handleInputChange("description", text)}
                      placeholderTextColor="#9ca3af"
                      multiline
                      numberOfLines={4}
                    />
                  </View>
                  {formErrors.description && (
                    <Text style={styles.errorText}>{formErrors.description}</Text>
                  )}
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.label}>Area Landmark</Text>
                  <View style={styles.inputContainer}>
                    <Feather name="map-pin" size={16} color="#9ca3af" style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      placeholder="Enter nearest landmark"
                      value={formData.landmark}
                      onChangeText={(text) => handleInputChange("landmark", text)}
                      placeholderTextColor="#9ca3af"
                    />
                  </View>
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.label}>Problem Category</Text>
                  <View style={[styles.pickerWrapper, formErrors.category && styles.errorInput]}>
                    <Picker
                      selectedValue={formData.category}
                      onValueChange={(itemValue) => {
                        handleServiceSelect(itemValue);
                        handleInputChange("category", itemValue);
                      }}
                      style={styles.picker}
                    >
                      <Picker.Item label="Select a category" value="" />
                      {categories.map((cat) => (
                        <Picker.Item key={cat} label={cat} value={cat} />
                      ))}
                    </Picker>
                  </View>
                  {formErrors.category && (
                    <Text style={styles.errorText}>{formErrors.category}</Text>
                  )}
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.label}>Upload photo of your problem</Text>
                  <Animated.View style={uploadPulseStyle}>
                    <TouchableOpacity
                      style={[styles.uploadArea, formData.image ? styles.hasFileUploadArea : null]}
                      onPress={pickImage}
                      activeOpacity={0.7}
                    >
                      {formData.image ? (
                        <View style={styles.fileSelected}>
                          <View style={styles.fileInfoContainer}>
                            <Feather name="check-circle" size={20} color="#10b981" />
                            <Text style={styles.fileSelectedText} numberOfLines={1}>
                              {fileName}
                            </Text>
                          </View>
                          <Image 
                            source={{ uri: formData.image.uri }} 
                            style={styles.previewImage} 
                            resizeMode="cover" 
                          />
                          <BlurView intensity={20} style={styles.imageOverlay}>
                            <TouchableOpacity style={styles.changePhotoButton} onPress={pickImage}>
                              <Text style={styles.changePhotoText}>Change Photo</Text>
                            </TouchableOpacity>
                          </BlurView>
                        </View>
                      ) : (
                        <View style={styles.uploadContent}>
                          <View style={styles.uploadIconContainer}>
                            <Feather name="upload-cloud" size={32} color="#10b981" />
                          </View>
                          <Text style={styles.uploadText}>+ Add Photo of Problem</Text>
                          <Text style={styles.uploadHint}>Tap here to select a photo</Text>
                        </View>
                      )}
                    </TouchableOpacity>
                  </Animated.View>
                </View>

                <View style={styles.formGroup}>
                  <View style={styles.addressHeader}>
                    <Text style={styles.label}>Location</Text>
                    <TouchableOpacity 
                      style={styles.locationButton} 
                      onPress={detectLocation} 
                      activeOpacity={0.7}
                    >
                      <Ionicons name="location" size={14} color="#10b981" />
                      <Text style={styles.locationButtonText}>Detect Location</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.inputContainer}>
                    <Feather name="map" size={16} color="#9ca3af" style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      placeholder="Address"
                      value={formData.address}
                      onChangeText={(text) => handleInputChange("address", text)}
                      placeholderTextColor="#9ca3af"
                      multiline
                    />
                  </View>
                </View>

                <Animated.View style={buttonScaleStyle}>                        
                  <TouchableOpacity
                    style={[styles.submitButton, loading && styles.submittingButton]}
                    onPress={handleSubmit}
                    activeOpacity={0.8}
                    disabled={loading}
                  >
                    {loading ? (
                      <View style={styles.loadingContainer}>
                        <Animated.View style={spinStyle}>
                          <Feather name="loader" size={20} color="#ffffff" />
                        </Animated.View>
                        <Text style={styles.submitButtonText}>Processing...</Text>
                      </View>
                    ) : (
                      <>
                        <Text style={styles.submitButtonText}>Submit Request</Text>
                        <Feather name="arrow-right" size={18} color="#ffffff" />
                      </>
                    )}
                  </TouchableOpacity>
                </Animated.View>

                {showSuccess && <SuccessAnimation />}
              </View>
            </View>
          </Animated.View>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f7ff", // Light indigo background
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 30,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  // Hero Section Styles
  heroContainer: {
    width: width * 0.95,
    paddingVertical: 40,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: "#4f46e5",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  heroContent: {
    alignItems: "center",
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1f2937",
    textAlign: "center",
    marginBottom: 12,
    letterSpacing: -1,
  },
  heroSubtitle: {
    fontSize: 16,
    color: "#4b5563",
    textAlign: "center",
    maxWidth: 500,
    marginBottom: 24,
  },
  heroStats: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 24,
    shadowColor: "#4f46e5",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statItem: {
    alignItems: "center",
    paddingHorizontal: 16,
  },
  statNumber: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#10b981",
  },
  statLabel: {
    fontSize: 12,
    color: "#4b5563",
    marginTop: 4,
  },
  statDivider: {
    height: 24,
    width: 1,
    backgroundColor: "#e5e7eb",
    marginHorizontal: 8,
  },
  leftSection: {
    marginBottom: 24,
  },
  header: {
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#1f2937",
    letterSpacing: -0.5,
  },
  highlight: {
    color: "#10b981",
    fontWeight: "900",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#4b5563",
  },
  typesContainer: {
    marginBottom: 0,
  },
  typesScrollContent: {
    paddingRight: 20,
  },
  typeItem: {
    marginRight: 16,
    alignItems: "center",
  },
  typeButton: {
    alignItems: "center",
    padding: 8,
    borderRadius: 16,
  },
  activeTypeButton: {
    backgroundColor: "rgba(99, 102, 241, 0.1)",
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 20, // More rounded corners
    backgroundColor: "#f3f4f6",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
    shadowColor: "#6366f1",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  activeIconContainer: {
    backgroundColor: "#e0e7ff", // Light indigo
    shadowColor: "#6366f1",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 4,
  },
  typeName: {
    fontWeight: "500",
    color: "#9ca3af",
    fontSize: 13,
  },
  activeTypeName: {
    color: "#6366f1",
    fontWeight: "600",
  },
  suggestionsContainer: {
    marginTop: 0,
  },
  suggestionsHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  suggestionsTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1f2937",
  },
  badge: {
    marginLeft: 8,
    backgroundColor: "#e0e7ff",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 999,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "600",
    color: "#10b981",
  },
  cardsContainer: {
    flexDirection: width < 768 ? "row" : "column",
    flexWrap: width < 768 ? "nowrap" : "wrap",
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 16, // More rounded corners
    overflow: "hidden",
    shadowColor: "#10b981",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    marginRight: width < 768 ? 16 : 0,
    marginBottom: 16,
    width: width < 768 ? width * 0.7 : "100%",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  cardAccent: {
    height: 6, // Slightly thicker accent
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
  cardTitleWithIcon: {
    flexDirection: "row",
    alignItems: "center",
  },
  cardIconContainer: {
    width: 32, // Slightly larger
    height: 32, // Slightly larger
    borderRadius: 10,
    backgroundColor: "#f3f4f6",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
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
    lineHeight: 18,
  },
  detailsButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f9fafb",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 10, // More rounded
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignSelf: "flex-start",
  },
  detailsButtonText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#1f2937",
    marginRight: 6,
  },
  rightSection: {
    width: "100%",
  },
  formContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 20, // More rounded corners
    padding: 20,
    shadowColor: "#10b981",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  formTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  formTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1f2937",
  },
  formBadge: {
    backgroundColor: "#e0e7ff",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  formBadgeText: {
    fontSize: 10,
    fontWeight: "600",
    color: "#10b981",
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
  requiredStar: {
    color: "#ef4444",
    fontWeight: "bold",
  },
  addressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  locationButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e0e7ff",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  locationButtonText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#10b981",
    marginLeft: 4,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 12, // More rounded
    backgroundColor: "#ffffff",
  },
  inputIcon: {
    paddingHorizontal: 12,
  },
  input: {
    flex: 1,
    padding: 12,
    fontSize: 14,
    color: "#1f2937",
  },
  textAreaContainer: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 12, // More rounded
    backgroundColor: "#ffffff",
  },
  textArea: {
    minHeight: 120,
    textAlignVertical: "top",
    paddingTop: 12,
  },
  uploadArea: {
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: "#e5e7eb",
    borderRadius: 16, // More rounded
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  hasFileUploadArea: {
    backgroundColor: "#eef2ff",
    borderColor: "#10b981",
  },
  uploadContent: {
    alignItems: "center",
  },
  uploadIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#e0e7ff",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  uploadText: {
    fontWeight: "600",
    color: "#10b981",
    marginTop: 8,
    marginBottom: 8,
    fontSize: 14,
  },
  uploadHint: {
    fontSize: 12,
    color: "#6b7280",
  },
  fileSelected: {
    alignItems: "center",
    width: "100%",
  },
  fileInfoContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  fileSelectedText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#10b981",
    maxWidth: 200,
    marginLeft: 8,
  },
  previewImage: {
    width: 150,
    height: 150,
    borderRadius: 16, // More rounded
    marginVertical: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  imageOverlay: {
    position: "absolute",
    bottom: 12,
    left: 0,
    right: 0,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    overflow: "hidden",
  },
  changePhotoButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: "rgba(99, 102, 241, 0.2)",
    borderRadius: 8,
  },
  changePhotoText: {
    fontSize: 12,
    color: "#10b981",
    fontWeight: "500",
  },
  submitButton: {
    width: "100%",
    padding: 16,
    backgroundColor: "#10b981", // Indigo
    borderRadius: 16, // More rounded
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    shadowColor: "#4f46e5",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  submittingButton: {
    backgroundColor: "#10b981", // Darker indigo
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ffffff",
    marginRight: 8,
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  successAnimation: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 24,
  },
  successCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#eef2ff", // Light indigo
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  successText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#10b981",
  },
  successCheckContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  typesTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 8,
    textAlign: "center",
  },
  typesSubtitle: {
    fontSize: 16,
    color: "#4b5563",
    marginBottom: 24,
    textAlign: "center",
  },
  highlightGreen: {
    color: "#10b981",
    fontWeight: "900",
  },
  errorText: {
    color: "#ef4444",
    fontSize: 12,
    marginTop: 4,
  },
  errorInput: {
    borderColor: "#ef4444",
  },
  serviceGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  serviceCard: {
    width: width < 768 ? (width - 64) / 2 : (width - 128) / 4,
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#f3f4f6",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    position: "relative",
    minHeight: 140,
    marginRight: 16,
  },
  selectedServiceCard: {
    borderColor: "#10b981",
    borderWidth: 2,
  },
  serviceIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#f0fdf4",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  selectedServiceIconContainer: {
    backgroundColor: "#d1fae5",
  },
  serviceName: {
    fontSize: 14,
    fontWeight: "500",
    color: "#374151",
    textAlign: "center",
  },
  selectedServiceName: {
    color: "#10b981",
    fontWeight: "600",
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 6,
    overflow: "hidden",
  },
  picker: {
    height: 50,
    width: "100%",
    color: "#1f2937",
  },
  checkmarkBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#10b981",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
  },
})

export default ServicesPage
