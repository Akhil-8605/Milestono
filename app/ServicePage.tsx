"use client";

import type React from "react";
import { useState, useRef, useEffect } from "react";
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
} from "react-native";
import {
  Feather,
  Ionicons,
  FontAwesome5,
  MaterialIcons,
  AntDesign,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import {
  launchImageLibrary,
  type ImageLibraryOptions,
  type PhotoQuality,
} from "react-native-image-picker";
import { useNavigation } from "expo-router";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
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
} from "react-native-reanimated";
import { BlurView } from "expo-blur";
import HeroSection from "./servicepage/HeroSection";
const { width, height } = Dimensions.get("window");

interface FormData {
  altNumber: string;
  address: string;
  description: string;
}

interface ServiceType {
  id: string;
  name: string;
  icon: React.ReactNode;
}

interface SuggestionCard {
  title: string;
  description: string;
  icon: string;
  color: string;
}

// Helper functions for color manipulation
const hexToRgb = (hex: string): { r: number; g: number; b: number } => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: Number.parseInt(result[1], 16),
        g: Number.parseInt(result[2], 16),
        b: Number.parseInt(result[3], 16),
      }
    : { r: 0, g: 0, b: 0 };
};

const rgbToHex = (r: number, g: number, b: number): string => {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
};

const lightenColor = (color: string, percent: number): string => {
  const { r, g, b } = hexToRgb(color);
  const amount = Math.floor(255 * (percent / 100));

  const newR = Math.min(r + amount, 255);
  const newG = Math.min(g + amount, 255);
  const newB = Math.min(b + amount, 255);

  return rgbToHex(newR, newG, newB);
};

const darkenColor = (color: string, percent: number): string => {
  const { r, g, b } = hexToRgb(color);
  const amount = Math.floor(255 * (percent / 100));

  const newR = Math.max(r - amount, 0);
  const newG = Math.max(g - amount, 0);
  const newB = Math.max(b - amount, 0);

  return rgbToHex(newR, newG, newB);
};

// Success Animation Component (inline)
const SuccessAnimation: React.FC = () => {
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);
  const checkScale = useSharedValue(0);

  useEffect(() => {
    scale.value = withTiming(1, {
      duration: 400,
      easing: Easing.out(Easing.cubic),
    });
    opacity.value = withTiming(1, {
      duration: 400,
      easing: Easing.out(Easing.cubic),
    });

    // Animate the checkmark after the circle appears
    checkScale.value = withDelay(
      300,
      withSpring(1, { damping: 12, stiffness: 100 })
    );
  }, []);

  const circleStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      opacity: opacity.value,
    };
  });

  const checkStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: checkScale.value }],
      opacity: checkScale.value,
    };
  });

  return (
    <View style={styles.successAnimation}>
      <Animated.View style={[styles.successCircle, circleStyle]}>
        <Animated.View style={checkStyle}>
          <AntDesign name="checkcircle" size={60} color="#6366f1" />
        </Animated.View>
      </Animated.View>
    </View>
  );
};

const ServicesPage: React.FC = () => {
  const [selectedService, setSelectedService] = useState<string>("");
  const [formData, setFormData] = useState<FormData>({
    altNumber: "",
    address: "",
    description: "",
  });
  const [fileName, setFileName] = useState<string>("");
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showSuccess, setShowSuccess] = useState<boolean>(false);

  // Animation values with Reanimated
  const fadeIn = useSharedValue(0);
  const slideUp = useSharedValue(20);
  const scale = useSharedValue(0.95);
  const buttonScale = useSharedValue(1);
  const formOpacity = useSharedValue(0);
  const formSlide = useSharedValue(20);
  const uploadPulse = useSharedValue(1);
  const spinValue = useSharedValue(0);

  // Card animations
  const cardAnimValues = useRef(
    Array(3)
      .fill(0)
      .map(() => useSharedValue(50))
  ).current;

  const navigation = useNavigation();

  // Animated value for service selection
  const serviceScale = useSharedValue(1);

  useEffect(() => {
    // Run entrance animations
    fadeIn.value = withTiming(1, {
      duration: 800,
      easing: Easing.out(Easing.cubic),
    });
    slideUp.value = withTiming(0, {
      duration: 800,
      easing: Easing.out(Easing.cubic),
    });
    scale.value = withTiming(1, {
      duration: 800,
      easing: Easing.out(Easing.cubic),
    });

    // Stagger card animations
    cardAnimValues.forEach((anim, index) => {
      anim.value = withDelay(
        150 * index,
        withTiming(0, { duration: 600, easing: Easing.out(Easing.cubic) })
      );
    });

    // Form animations
    formOpacity.value = withDelay(
      400,
      withTiming(1, { duration: 600, easing: Easing.out(Easing.cubic) })
    );

    formSlide.value = withDelay(
      400,
      withTiming(0, { duration: 600, easing: Easing.out(Easing.cubic) })
    );

    // Start pulsing animation for upload area
    startUploadPulseAnimation();

    // Start spinning animation for loading icon
    spinValue.value = withRepeat(
      withTiming(1, { duration: 1000, easing: Easing.linear }),
      -1, // Infinite
      false
    );
  }, []);

  const startUploadPulseAnimation = () => {
    uploadPulse.value = withRepeat(
      withSequence(
        withTiming(1.05, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 1500, easing: Easing.inOut(Easing.ease) })
      ),
      -1, // Infinite
      false
    );
  };

  const handleServiceSelect = (service: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedService(service);

    // Add a little animation when selecting a service
    serviceScale.value = withSequence(
      withTiming(0.92, { duration: 100, easing: Easing.out(Easing.cubic) }),
      withTiming(1.05, { duration: 150, easing: Easing.out(Easing.cubic) }),
      withTiming(1, { duration: 200, easing: Easing.out(Easing.cubic) })
    );
  };

  const handleInputChange = (name: keyof FormData, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = () => {
    if (!formData.address || !formData.description) {
      Alert.alert("Missing Information", "Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);

    // Button press animation
    buttonScale.value = withSequence(
      withTiming(0.95, { duration: 100, easing: Easing.out(Easing.cubic) }),
      withTiming(1, { duration: 200, easing: Easing.out(Easing.cubic) })
    );

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setShowSuccess(true);

      setTimeout(() => {
        Alert.alert(
          "Success",
          "Your service request has been submitted! We'll find you the best service professionals near you",
          [
            {
              text: "OK",
              onPress: () => navigation.navigate("ServiceMansPage" as never),
            },
          ]
        );
      }, 1500);
    }, 1500);
  };

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
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    const hasPermission = await requestLocationPermission();
    if (!hasPermission) {
      Alert.alert("Permission denied", "Unable to access your location");
      return;
    }

    // Simulate location detection
    setFormData({
      ...formData,
      address: "123 Main Street, New York, NY 10001",
    });

    // Animation for success
    scale.value = withSequence(
      withTiming(1.05, { duration: 150, easing: Easing.out(Easing.cubic) }),
      withTiming(1, { duration: 200, easing: Easing.out(Easing.cubic) })
    );
  };

  const pickImage = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

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
        scale.value = withSequence(
          withTiming(1.05, { duration: 150, easing: Easing.out(Easing.cubic) }),
          withTiming(1, { duration: 200, easing: Easing.out(Easing.cubic) })
        );

        // Stop the pulsing animation
        cancelAnimation(uploadPulse);
        uploadPulse.value = 1;
      }
    });
  };

  // Animated styles
  const mainContentStyle = useAnimatedStyle(() => {
    return {
      opacity: fadeIn.value,
      transform: [{ translateY: slideUp.value }],
    };
  });

  const headerStyle = useAnimatedStyle(() => {
    return {
      opacity: fadeIn.value,
      transform: [{ translateY: slideUp.value }],
    };
  });

  const formContainerStyle = useAnimatedStyle(() => {
    return {
      opacity: formOpacity.value,
      transform: [{ translateX: formSlide.value }],
    };
  });

  const buttonScaleStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: buttonScale.value }],
    };
  });

  const uploadPulseStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: imageUri ? 1 : uploadPulse.value }],
    };
  });

  const spinStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          rotate: `${interpolate(spinValue.value, [0, 1], [0, 360])}deg`,
        },
      ],
    };
  });

  const serviceTypes: ServiceType[] = [
    {
      id: "service",
      name: "Service",
      icon: (
        <FontAwesome5
          name="user-cog"
          size={24}
          color={selectedService === "service" ? "#6366f1" : "#9ca3af"}
        />
      ),
    },
  ];

  const suggestionCards: SuggestionCard[] = [
    {
      title: "Home Service",
      description: "Professional home maintenance and repair services",
      icon: "home",
      color: "#6366f1", // Indigo
    },
    {
      title: "Appliance Repair",
      description: "Expert repair for all household appliances",
      icon: "settings",
      color: "#8b5cf6", // Purple
    },
    {
      title: "Emergency Service",
      description: "24/7 emergency repair and maintenance",
      icon: "alert-circle",
      color: "#ec4899", // Pink
    },
  ];

  const statusBarHeight = StatusBar.currentHeight || 0;

  // Animated style for service selection
  const serviceTypeAnimStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: serviceScale.value }],
    };
  });

  return (
    <KeyboardAvoidingView
      // behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={[styles.container, { marginTop: statusBarHeight }]}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <HeroSection />
        <Animated.View style={[styles.content, mainContentStyle]}>
          {/* Left Section */}
          <View style={styles.leftSection}>
            <Animated.View style={[styles.header, headerStyle]}>
              <Text style={styles.headerTitle}>
                What type of <Text style={styles.highlight}>service</Text> do
                you need?
              </Text>
              <Text style={styles.headerSubtitle}>
                Choose the option that best fits your requirements
              </Text>
            </Animated.View>

            <View style={styles.typesContainer}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.typesScrollContent}
              >
                {serviceTypes.map((service, index) => {
                  return (
                    <Animated.View
                      key={service.id}
                      style={[styles.typeItem, serviceTypeAnimStyle]}
                    >
                      <TouchableOpacity
                        onPress={() => handleServiceSelect(service.id)}
                        style={[
                          styles.typeButton,
                          selectedService === service.id &&
                            styles.activeTypeButton,
                        ]}
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
                  );
                })}
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
                          translateY:
                            cardAnimValues[index % cardAnimValues.length].value,
                        },
                        {
                          scale: interpolate(
                            fadeIn.value,
                            [0, 1],
                            [0.95, 1],
                            Extrapolate.CLAMP
                          ),
                        },
                      ],
                    };
                  });

                  return (
                    <Animated.View
                      key={index}
                      style={[styles.card, cardAnimStyle]}
                    >
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
                              <Feather
                                name={card.icon as any}
                                size={16}
                                color={card.color}
                              />
                            </View>
                            <Text style={styles.cardTitle}>{card.title}</Text>
                          </View>
                          <Feather
                            name="chevron-right"
                            size={16}
                            color={card.color}
                          />
                        </View>
                        <Text style={styles.cardDescription}>
                          {card.description}
                        </Text>
                        <TouchableOpacity
                          style={[
                            styles.detailsButton,
                            { borderColor: lightenColor(card.color, 30) },
                          ]}
                          activeOpacity={0.7}
                          onPress={() =>
                            Haptics.impactAsync(
                              Haptics.ImpactFeedbackStyle.Light
                            )
                          }
                        >
                          <Text
                            style={[
                              styles.detailsButtonText,
                              { color: card.color },
                            ]}
                          >
                            View Details
                          </Text>
                          <Feather
                            name="arrow-right"
                            size={12}
                            color={card.color}
                          />
                        </TouchableOpacity>
                      </View>
                    </Animated.View>
                  );
                })}
              </ScrollView>
            </View>
          </View>

          {/* Right Section - Form */}
          <Animated.View style={[styles.rightSection, formContainerStyle]}>
            <View style={styles.formContainer}>
              <View style={styles.formTitleContainer}>
                <Text style={styles.formTitle}>Request Service</Text>
                <View style={styles.formBadge}>
                  <Text style={styles.formBadgeText}>Easy Process</Text>
                </View>
              </View>

              <View style={styles.formFields}>
                <View style={styles.formGroup}>
                  <Text style={styles.label}>Alternative Number</Text>
                  <View style={styles.inputContainer}>
                    <Feather
                      name="phone"
                      size={16}
                      color="#9ca3af"
                      style={styles.inputIcon}
                    />
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
                </View>

                <View style={styles.formGroup}>
                  <View style={styles.addressHeader}>
                    <Text style={styles.label}>
                      Enter Address <Text style={styles.requiredStar}>*</Text>
                    </Text>
                    <TouchableOpacity
                      style={styles.locationButton}
                      onPress={detectLocation}
                      activeOpacity={0.7}
                    >
                      <Ionicons name="location" size={14} color="#6366f1" />
                      <Text style={styles.locationButtonText}>
                        Detect Location
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.inputContainer}>
                    <Feather
                      name="map-pin"
                      size={16}
                      color="#9ca3af"
                      style={styles.inputIcon}
                    />
                    <TextInput
                      style={styles.input}
                      placeholder="Enter Address"
                      value={formData.address}
                      onChangeText={(text) =>
                        handleInputChange("address", text)
                      }
                      placeholderTextColor="#9ca3af"
                    />
                  </View>
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.label}>Upload photo of your problem</Text>
                  <Animated.View style={uploadPulseStyle}>
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
                          <View style={styles.fileInfoContainer}>
                            <Feather
                              name="check-circle"
                              size={20}
                              color="#6366f1"
                            />
                            <Text
                              style={styles.fileSelectedText}
                              numberOfLines={1}
                            >
                              {fileName}
                            </Text>
                          </View>
                          {imageUri && (
                            <>
                              <Image
                                source={{ uri: imageUri }}
                                style={styles.previewImage}
                                resizeMode="cover"
                              />
                              <BlurView
                                intensity={20}
                                style={styles.imageOverlay}
                              >
                                <TouchableOpacity
                                  style={styles.changePhotoButton}
                                  onPress={pickImage}
                                >
                                  <Text style={styles.changePhotoText}>
                                    Change Photo
                                  </Text>
                                </TouchableOpacity>
                              </BlurView>
                            </>
                          )}
                        </View>
                      ) : (
                        <View style={styles.uploadContent}>
                          <View style={styles.uploadIconContainer}>
                            <Feather
                              name="upload-cloud"
                              size={32}
                              color="#6366f1"
                            />
                          </View>
                          <Text style={styles.uploadText}>
                            + Add Photo of Problem
                          </Text>
                          <Text style={styles.uploadHint}>
                            Tap here to select a photo
                          </Text>
                        </View>
                      )}
                    </TouchableOpacity>
                  </Animated.View>
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.label}>
                    Problem Description{" "}
                    <Text style={styles.requiredStar}>*</Text>
                  </Text>
                  <View style={styles.textAreaContainer}>
                    <TextInput
                      style={[styles.input, styles.textArea]}
                      placeholder="Please describe your problem in detail..."
                      value={formData.description}
                      onChangeText={(text) =>
                        handleInputChange("description", text)
                      }
                      multiline
                      numberOfLines={4}
                      placeholderTextColor="#9ca3af"
                    />
                  </View>
                </View>

                <Animated.View style={buttonScaleStyle}>
                  <TouchableOpacity
                    style={[
                      styles.submitButton,
                      isSubmitting && styles.submittingButton,
                    ]}
                    onPress={handleSubmit}
                    activeOpacity={0.8}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <View style={styles.loadingContainer}>
                        <Animated.View style={spinStyle}>
                          <Feather name="loader" size={20} color="#ffffff" />
                        </Animated.View>
                        <Text style={styles.submitButtonText}>
                          Processing...
                        </Text>
                      </View>
                    ) : (
                      <>
                        <Text style={styles.submitButtonText}>
                          Submit Request
                        </Text>
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
  );
};

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
    width: width,
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
    color: "#6366f1",
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
    color: "#6366f1",
    fontWeight: "900",
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
    width: 64,
    height: 64,
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
    marginTop: 24,
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
    color: "#6366f1",
  },
  cardsContainer: {
    flexDirection: width < 768 ? "row" : "column",
    flexWrap: width < 768 ? "nowrap" : "wrap",
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 16, // More rounded corners
    overflow: "hidden",
    shadowColor: "#6366f1",
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
    shadowColor: "#6366f1",
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
    color: "#6366f1",
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
    color: "#6366f1",
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
    borderColor: "#6366f1",
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
    color: "#6366f1",
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
    color: "#6366f1",
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
    color: "#6366f1",
    fontWeight: "500",
  },
  submitButton: {
    width: "100%",
    padding: 16,
    backgroundColor: "#6366f1", // Indigo
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
    backgroundColor: "#4f46e5", // Darker indigo
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
    color: "#6366f1",
  },
  successCheckContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
});

export default ServicesPage;
