"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Image,
  Dimensions,
  Modal,
  StatusBar,
  Alert,
  Linking,
  ActivityIndicator,
  Clipboard,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import { useRoute, useNavigation } from "@react-navigation/native";
import * as SecureStore from "expo-secure-store";
import axios from "axios";
import { BASE_URL } from "@env";

// Import our two separate sections
import UserFeedbackSection from "./propertydetails/UserFeedbackSection";
import RecommendedProjectsSection from "./propertydetails/NewProjectsSection";

const DummyImage = require("../assets/images/dummyImg.webp");

// Device width
const { width } = Dimensions.get("window");

// Enhanced color palette
const COLORS = {
  primary: "#1E3A8A",
  secondary: "#3B82F6",
  background: "#F3F4F6",
  cardBackground: "#FFFFFF",
  text: "#1F2937",
  textLight: "#6B7280",
  accent: "#EF4444",
  success: "#10B981",
  warning: "#F59E0B",
  facebook: "#1877F2",
  twitter: "#1DA1F2",
  whatsapp: "#25D366",
};

export default function PropertyListing() {
  const route = useRoute();
  const navigation = useNavigation();
  const { property } = route.params as { property: any };

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const imageScrollRef = useRef<ScrollView>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // New state variables for enhanced functionality
  const [contactViewed, setContactViewed] = useState(false);
  const [saved, setSaved] = useState(false);
  const [countViewed, setCountViewed] = useState(0);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [inquiryModalVisible, setInquiryModalVisible] = useState(false);
  const [shareModalVisible, setShareModalVisible] = useState(false);

  const statusBarHeight = StatusBar.currentHeight || 0;

  // Use property images or fallback to placeholder
  const PROPERTY_IMAGES = property?.uploadedPhotos?.length > 0
    ? property.uploadedPhotos
    : [DummyImage];

  // Auto-slide header images
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveImageIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % PROPERTY_IMAGES.length;
        imageScrollRef.current?.scrollTo({
          x: nextIndex * width,
          animated: true,
        });
        return nextIndex;
      });
    }, 6000);

    return () => clearInterval(timer);
  }, [PROPERTY_IMAGES.length]);

  // Check initial states on component mount
  useEffect(() => {
    checkContactViewed();
    checkSaved();
    checkCountContactViewed();
    handleAddToRecent();
  }, []);

  // Get user details when contact is viewed
  useEffect(() => {
    if (contactViewed) {
      getUserDetail();
    }
  }, [contactViewed]);

  const checkContactViewed = async () => {
    try {
      const token = await SecureStore.getItemAsync("jwt");
      if (token) {
        const response = await axios.get(
          `${BASE_URL}/api/contact-viewed/${property._id}`,
          {
            headers: { Authorization: token },
          }
        );
        setContactViewed((response.data as { viewed: boolean }).viewed);
      }
    } catch (error) {
      console.error("Error checking contact viewed status:", error);
    }
  };

  const checkCountContactViewed = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/api/count-contact-viewed/${property._id}`
      );
      setCountViewed((response.data as { count: number }).count);
    } catch (error) {
      console.error("Error fetching view count:", error);
    }
  };

  const getUserDetail = async () => {
    setLoading(true);
    const token = await SecureStore.getItemAsync("jwt");
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const response = await axios.get(`${BASE_URL}/api/userdetail`, {
        headers: { Authorization: token },
      });
      setUser(response.data);
    } catch (error) {
      console.error("Error fetching user details:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewPhoneClick = async () => {
    Alert.alert(
      "Unlock Contact",
      "Do you want to unlock the contact?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Yes", onPress: unlockContact }
      ]
    );
  };

  const unlockContact = async () => {
    const token = await SecureStore.getItemAsync("jwt");
    if (!token) {
      Alert.alert(
        "Login Required",
        "If you want to unlock, login first.",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Login", onPress: () => navigation.navigate("Login" as never) }
        ]
      );
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `${BASE_URL}/api/contact-viewed`,
        { property_id: property._id },
        { headers: { Authorization: token } }
      );
      if ((response.data as { message: string }).message === "Property marked as viewed.") {
        setContactViewed(true);
        Alert.alert("Success", "Contact unlocked successfully!");
      }
    } catch (error: any) {
      if (error.response && error.response.status === 403) {
        Alert.alert(
          "Upgrade Required",
          "You have reached the limit. Upgrade to a premium account to view more contacts.",
          [
            { text: "Cancel", style: "cancel" },
            { text: "Upgrade", onPress: () => navigation.navigate("Premium" as never) }
          ]
        );
      } else {
        Alert.alert("Error", "Failed to unlock contact. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleViewWhatsappClick = async () => {
    const token = await SecureStore.getItemAsync("jwt");
    if (!token) {
      Alert.alert(
        "Login Required",
        "If you want to unlock, login first.",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Login", onPress: () => navigation.navigate("Login" as never) }
        ]
      );
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(
        `${BASE_URL}/api/whatsapp-status/${property._id}`,
        { headers: { Authorization: token } }
      );
      const data = response.data as { contacted: boolean };
      if (data.contacted) {
        openWhatsApp();
      }
    } catch (error: any) {
      if (error.response && error.response.status === 403) {
        Alert.alert(
          "Upgrade Required",
          "You have reached the limit. Upgrade to a premium account to view more contacts.",
          [
            { text: "Cancel", style: "cancel" },
            { text: "Upgrade", onPress: () => navigation.navigate("Premium" as never) }
          ]
        );
      } else {
        Alert.alert("Error", "Failed to access WhatsApp. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const openWhatsApp = () => {
    if (!contactViewed) {
      Alert.alert("Error", "Unlock contact first.");
      return;
    }
    if (!user?.phone) {
      Alert.alert("Error", "Phone number is not available.");
      return;
    }
    const message = `Hi, I'm interested in the property listed as "${property.heading}" at ${property.landmark}. Can we discuss further?`;
    const whatsappUrl = `https://wa.me/${user.phone}?text=${encodeURIComponent(message)}`;
    Linking.openURL(whatsappUrl);
  };

  const handleSaveClick = async () => {
    const token = await SecureStore.getItemAsync("jwt");
    if (!token) {
      Alert.alert(
        "Login Required",
        "If you want to save, login first.",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Login", onPress: () => navigation.navigate("Login" as never) }
        ]
      );
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `${BASE_URL}/api/save-property`,
        { property_id: property._id },
        { headers: { Authorization: token } }
      );
      const data = response.data as { message: string };
      if (data.message === "Property marked as saved.") {
        setSaved(true);
        Alert.alert("Success", "Property saved successfully!");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to save property. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleUnSaveClick = async () => {
    const token = await SecureStore.getItemAsync("jwt");
    if (!token) {
      Alert.alert("Error", "Authentication required.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `${BASE_URL}/api/unsave-property`,
        { property_id: property._id },
        { headers: { Authorization: token } }
      );
      const data = response.data as { message: string };
      if (data.message === "Property removed from saved list.") {
        setSaved(false);
        Alert.alert("Success", "Property removed from saved list!");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to unsave property. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const checkSaved = async () => {
    try {
      const token = await SecureStore.getItemAsync("jwt");
      if (token) {
        const response = await axios.get(`${BASE_URL}/api/saved/${property._id}`, {
          headers: { Authorization: token },
        });
        setSaved((response.data as { viewed: boolean }).viewed);
      }
    } catch (error) {
      console.error("Error checking saved status:", error);
    }
  };

  const handleAddToRecent = async () => {
    const token = await SecureStore.getItemAsync("jwt");
    try {
      await axios.post(
        `${BASE_URL}/api/mark-view`,
        { property_id: property._id },
        { headers: { Authorization: token || "" } }
      );
    } catch (error) {
      console.error("Error marking property as viewed:", error);
    }
  };

  const handleInquiryClick = async () => {
    const token = await SecureStore.getItemAsync("jwt");
    if (!token) {
      Alert.alert("Login Required", "User must be logged in to send a property enquiry.");
      return;
    }

    setLoading(true);
    try {
      await axios.post(
        `${BASE_URL}/api/property-enquiry`,
        { property_id: property._id },
        { headers: { Authorization: token } }
      );
      Alert.alert("Success", "Property enquiry submitted to agent successfully.");
    } catch (error) {
      Alert.alert("Error", "Error submitting property enquiry. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleShareClick = () => {
    setShareModalVisible(true);
  };

  const shareProperty = async (method: string) => {
    const propertyUrl = `https://milestono.com/details/${property._id}`;
    const propertyTitle = `${property.heading} at ${property.landmark}`;
    const message = `Check out this amazing property: ${propertyTitle}`;

    try {
      switch (method) {
        case 'facebook':
          const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(propertyUrl)}`;
          await Linking.openURL(facebookUrl);
          break;

        case 'twitter':
          const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}&url=${encodeURIComponent(propertyUrl)}`;
          await Linking.openURL(twitterUrl);
          break;

        case 'whatsapp':
          const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message + ' ' + propertyUrl)}`;
          await Linking.openURL(whatsappUrl);
          break;

        case 'copy':
          await Clipboard.setString(propertyUrl);
          Alert.alert("Copied!", "Property link copied to clipboard!");
          break;

        default:
          break;
      }
    } catch (error) {
      Alert.alert("Error", "Failed to share property.");
    }
    setShareModalVisible(false);
  };

  // Format price based on sell type
  const formatPrice = () => {
    if (property?.sellType === "Sell") {
      return `₹ ${property.expectedPrice?.toLocaleString() || "N/A"}`;
    } else {
      return `₹ ${property.pricePerMonth?.toLocaleString() || "N/A"}/month`;
    }
  };

  // Calculate price per sq ft if area is available
  const calculatePricePerSqFt = () => {
    if (property?.sellType === "Sell" && property?.expectedPrice && property?.builtUpArea) {
      const pricePerSqFt = property.expectedPrice / property.builtUpArea;
      return `Approx. ₹ ${Math.round(pricePerSqFt)}/sq.ft`;
    }
    return "";
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { marginTop: statusBarHeight }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 160 }}
      >
        {/* Header with Auto-Scrolling Images - Fixed Size */}
        <View style={styles.header}>
          <View style={styles.imageContainer}>
            <ScrollView
              ref={imageScrollRef}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onMomentumScrollEnd={(e) => {
                const newIndex = Math.round(
                  e.nativeEvent.contentOffset.x / width
                );
                setActiveImageIndex(newIndex);
              }}
            >
              {PROPERTY_IMAGES.map((image: any, index: number) => (
                <TouchableOpacity
                  key={index}
                  activeOpacity={0.9}
                  onPress={() => {
                    setSelectedImage(image);
                    setModalVisible(true);
                  }}
                >
                  <Image source={{ uri: image }} style={styles.headerImage} />
                </TouchableOpacity>
              ))}
            </ScrollView>
            <View style={styles.imageDots}>
              {PROPERTY_IMAGES.map((_: any, index: number) => (
                <View
                  key={index}
                  style={[
                    styles.imageDot,
                    activeImageIndex === index && styles.imageDotActive,
                  ]}
                />
              ))}
            </View>
          </View>

          {/* Title & Action Icons */}
          <LinearGradient
            colors={["transparent", "rgba(0,0,0,0.8)"]}
            style={styles.headerOverlay}
          >
            <Text style={styles.title}>{property?.heading || "Property Details"}</Text>
            <View style={styles.headerButtons}>
              <TouchableOpacity style={styles.headerButton} onPress={handleShareClick}>
                <Icon name="share-variant" size={20} color={COLORS.background} />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.headerButton}
                onPress={saved ? handleUnSaveClick : handleSaveClick}
              >
                <Icon
                  name={saved ? "heart" : "heart-outline"}
                  size={20}
                  color={saved ? "red" : COLORS.background}
                />
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </View>

        {/* Main Content */}
        <View style={styles.content}>
          <PriceSection
            price={formatPrice()}
            pricePerSqFt={calculatePricePerSqFt()}
          />
          <QuickInfoSection property={property} />
          <LocationCard property={property} />
          <ContactSection
            contactViewed={contactViewed}
            user={user}
            onUnlockContact={handleViewPhoneClick}
            onWhatsAppClick={handleViewWhatsappClick}
            onInquiryPress={handleInquiryClick}
          />
          <AmenitiesSection property={property} />
          <FurnitureSection property={property} />
          <ViewerCount count={countViewed} />

          {/* Feedback Section */}
          <UserFeedbackSection />

          {/* Recommended Projects Section */}
          <RecommendedProjectsSection />
        </View>
      </ScrollView>

      {/* Fixed Bottom Bar */}
      <View style={styles.bottomBar}>
        <View style={styles.bottomBarInfoContainer}>
          <Text style={styles.bottomBarInfoText}>
            {countViewed} people viewed this property today
          </Text>
        </View>
        <View style={styles.bottomBarButtonsContainer}>
          <TouchableOpacity
            style={[styles.bottomBarButton, styles.callButton]}
            onPress={handleInquiryClick}
          >
            <Icon name="phone" size={22} color={COLORS.background} />
            <Text style={styles.bottomBarButtonText}>Call Now</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.bottomBarButton, styles.inquiryButton]}
            onPress={handleInquiryClick}
          >
            <Icon name="information" size={22} color={COLORS.background} />
            <Text style={styles.bottomBarButtonText}>Inquiry</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Fullscreen Image Modal */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <BlurView intensity={100} style={styles.modalContainer}>
          <TouchableOpacity
            style={styles.modalCloseButton}
            onPress={() => setModalVisible(false)}
          >
            <Icon name="close" size={28} color={COLORS.background} />
          </TouchableOpacity>
          {selectedImage && (
            <Image
              source={{ uri: selectedImage }}
              style={styles.modalImage}
              resizeMode="contain"
            />
          )}
        </BlurView>
      </Modal>

      {/* Enhanced Share Modal */}
      <Modal
        visible={shareModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setShareModalVisible(false)}
      >
        <View style={styles.shareModalOverlay}>
          <TouchableOpacity
            style={styles.shareModalBackdrop}
            activeOpacity={1}
            onPress={() => setShareModalVisible(false)}
          />
          <View style={styles.shareModalContainer}>
            <View style={styles.shareModalHeader}>
              <Text style={styles.shareModalTitle}>Share Property</Text>
              <TouchableOpacity
                style={styles.shareModalCloseButton}
                onPress={() => setShareModalVisible(false)}
              >
                <Icon name="close" size={24} color={COLORS.textLight} />
              </TouchableOpacity>
            </View>

            <View style={styles.shareOptionsContainer}>
              <TouchableOpacity
                style={styles.shareOption}
                onPress={() => shareProperty('facebook')}
              >
                <View style={[styles.shareIconContainer, { backgroundColor: COLORS.facebook }]}>
                  <Icon name="facebook" size={28} color="white" />
                </View>
                <Text style={styles.shareOptionText}>Facebook</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.shareOption}
                onPress={() => shareProperty('twitter')}
              >
                <View style={[styles.shareIconContainer, { backgroundColor: COLORS.twitter }]}>
                  <Icon name="twitter" size={28} color="white" />
                </View>
                <Text style={styles.shareOptionText}>Twitter</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.shareOption}
                onPress={() => shareProperty('whatsapp')}
              >
                <View style={[styles.shareIconContainer, { backgroundColor: COLORS.whatsapp }]}>
                  <Icon name="whatsapp" size={28} color="white" />
                </View>
                <Text style={styles.shareOptionText}>WhatsApp</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.shareOption}
                onPress={() => shareProperty('copy')}
              >
                <View style={[styles.shareIconContainer, { backgroundColor: COLORS.textLight }]}>
                  <Icon name="content-copy" size={28} color="white" />
                </View>
                <Text style={styles.shareOptionText}>Copy Link</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.shareCancelButton}
              onPress={() => setShareModalVisible(false)}
            >
              <Text style={styles.shareCancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Inquiry Modal */}
      <Modal
        visible={inquiryModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setInquiryModalVisible(false)}
      >
        <View style={styles.inquiryModalOverlay}>
          <View style={styles.inquiryModalContainer}>
            <TouchableOpacity
              style={styles.inquiryModalCloseButton}
              onPress={() => setInquiryModalVisible(false)}
            >
              <Icon name="close" size={30} color={"#232761"} />
            </TouchableOpacity>

            <Text style={styles.inquiryModalTitle}>
              You are requesting to view advertiser details
            </Text>

            <View style={styles.inquiryModalDetails}>
              <Text style={styles.inquiryModalLabel}>POSTED BY OWNER:</Text>
              <Text style={styles.inquiryModalValue}>
                {user?.phone || "+91 988** ****"} | {user?.email || "i********@gmail.com"}
              </Text>
              <Text style={styles.inquiryModalValue}>
                {user?.name?.toUpperCase() || "PROPERTY OWNER"}
              </Text>

              <View style={styles.divider} />

              <Text style={styles.inquiryModalLabel}>
                POSTED ON {property?.createdAt ? new Date(property.createdAt).toLocaleDateString('en-GB', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric'
                }).toUpperCase() : "N/A"}
              </Text>
              <Text style={styles.inquiryModalValue}>
                {formatPrice()} | {property?.landmark || property?.city || "Location"}
              </Text>
              <Text style={styles.inquiryModalValue}>
                {property?.builtUpArea ? `${property.builtUpArea} sq.ft` : ""} | {property?.propertyType || "Property"}
              </Text>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

/* PRICE SECTION */
const PriceSection = ({ price, pricePerSqFt }: { price: string; pricePerSqFt: string }) => (
  <View style={styles.priceSection}>
    <View style={styles.priceContainer}>
      <Text style={styles.priceLabel}>Price</Text>
      <Text style={styles.priceValue}>{price}</Text>
      {pricePerSqFt && <Text style={styles.pricePerSqFt}>{pricePerSqFt}</Text>}
    </View>
  </View>
);

/* QUICK INFO SECTION */
const QuickInfoSection = ({ property }: { property: any }) => {
  const renderDetail = (icon: string, label: string, value: string) => (
    <View style={styles.detailCard} key={label}>
      <View style={styles.detailContent}>
        <Icon
          name={icon}
          size={24}
          color={COLORS.primary}
          style={styles.detailIcon}
        />
        <Text style={styles.detailLabel}>{label}</Text>
        <Text style={styles.detailValue}>{value}</Text>
      </View>
    </View>
  );

  const infoData = [
    {
      icon: "ruler-square",
      label: "Area",
      value: property?.builtUpArea ? `${property.builtUpArea} sq.ft` : "N/A"
    },
    {
      icon: "home",
      label: "Type",
      value: property?.propertyType || "N/A"
    },
    {
      icon: "check-circle",
      label: "Status",
      value: property?.sellType === "Sell" ? "For Sale" : "For Rent"
    },
    {
      icon: "briefcase",
      label: "Brokerage",
      value: "No Brokerage"
    },
    {
      icon: "calendar",
      label: "Posted On",
      value: property?.createdAt ? new Date(property.createdAt).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      }) : "N/A"
    },
    {
      icon: "map-marker",
      label: "Location",
      value: `${property?.landmark || ""}, ${property?.city || ""}`.replace(/^,\s*|,\s*$/g, '') || "N/A"
    },
  ];

  return (
    <View style={styles.quickInfoContainer}>
      {infoData.map((item) => renderDetail(item.icon, item.label, item.value))}
    </View>
  );
};

const LocationCard = ({ property }: { property: any }) => (
  <TouchableOpacity style={styles.locationCard}>
    <View style={styles.locationContent}>
      <View style={styles.locationHeader}>
        <Icon name="map-marker" size={18} color={COLORS.primary} />
        <Text style={styles.locationTitle}>Location</Text>
      </View>
      <Text style={styles.locationText}>
        {`${property?.landmark || ""}, ${property?.city || ""}`.replace(/^,\s*|,\s*$/g, '') || "Location not specified"}
      </Text>
      <Text style={styles.locationSubtext}>View on map</Text>
    </View>
  </TouchableOpacity>
);

/* ENHANCED CONTACT SECTION */
const ContactSection = ({
  contactViewed,
  user,
  onUnlockContact,
  onWhatsAppClick,
  onInquiryPress
}: {
  contactViewed: boolean;
  user: any;
  onUnlockContact: () => void;
  onWhatsAppClick: () => void;
  onInquiryPress: () => void;
}) => (
  <View style={styles.contactSection}>
    <View style={styles.contactContent}>
      <Text style={styles.contactTitle}>Owner Contact Details</Text>

      <View style={styles.contactDetails}>
        <Text style={styles.contactInfo}>
          <Icon name="email" size={16} color={COLORS.primary} />
          {" "}{user ? user.email : "XXXXXXXXXX"}
        </Text>
        <Text style={styles.contactInfo}>
          <Icon name="phone" size={16} color={COLORS.primary} />
          {" "}{user ? user.phone : "XXXXXXXXXX"}
        </Text>
      </View>

      <View style={styles.contactButtons}>
        <TouchableOpacity
          style={[
            styles.contactButton,
            contactViewed ? styles.unlockedButton : styles.lockButton
          ]}
          onPress={onUnlockContact}
          disabled={contactViewed}
        >
          <Icon
            name={contactViewed ? "lock-open" : "lock"}
            size={18}
            color={COLORS.background}
          />
          <Text style={styles.contactButtonText}>
            {contactViewed ? "Contact Now" : "Unlock Contact"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.contactButton} onPress={onWhatsAppClick}>
          <Icon name="whatsapp" size={18} color={COLORS.background} />
          <Text style={styles.contactButtonText}>WhatsApp</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.contactButton} onPress={onInquiryPress}>
          <Icon name="information" size={18} color={COLORS.background} />
          <Text style={styles.contactButtonText}>Inquiry</Text>
        </TouchableOpacity>
      </View>
    </View>
  </View>
);

/* AMENITIES SECTION */
const AmenitiesSection = ({ property }: { property: any }) => {
  const amenityIcons: { [key: string]: string } = {
    "Car Parking": "car",
    "CCTV": "cctv",
    "Guard": "shield-check",
    "Gym": "dumbbell",
    "Club House": "home",
    "Water Supply": "water",
    "Lift": "elevator",
    "Swimming Pool": "pool",
  };

  // Filter amenities that exist in the property
  const availableAmenities = property?.amenities?.filter((amenity: string) =>
    Object.keys(amenityIcons).includes(amenity)
  ) || [];

  const renderAmenity = (amenity: string, index: number) => (
    <View style={styles.amenityCard} key={index}>
      <View style={styles.amenityContent}>
        <Icon name={amenityIcons[amenity]} size={28} color={COLORS.primary} />
        <Text style={styles.amenityLabel}>{amenity}</Text>
      </View>
    </View>
  );

  if (availableAmenities.length === 0) {
    return null;
  }

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Amenities</Text>
      <View style={styles.amenitiesContainer}>
        {availableAmenities.map((amenity: string, index: number) =>
          renderAmenity(amenity, index)
        )}
      </View>
    </View>
  );
};

/* FURNITURE SECTION */
const FurnitureSection = ({ property }: { property: any }) => {
  const furnitureIcons: { [key: string]: string } = {
    "Bed": "bed-king",
    "Sofa": "sofa",
    "TV": "television",
    "Cupboard": "wardrobe",
    "AC": "air-conditioner",
    "Water Purifier": "water",
    "Geyser": "shower",
    "Washing Machine": "washing-machine",
    "Dining Table": "table-furniture",
  };

  // Filter furniture that exists in the property
  const availableFurniture = property?.furnitures?.filter((furniture: string) =>
    Object.keys(furnitureIcons).includes(furniture)
  ) || [];

  const renderFurnitureItem = (furniture: string, index: number) => (
    <View style={styles.furnitureCard} key={index}>
      <View style={styles.furnitureContent}>
        <Icon name={furnitureIcons[furniture]} size={28} color={COLORS.primary} />
        <Text style={styles.furnitureLabel}>{furniture}</Text>
      </View>
    </View>
  );

  if (availableFurniture.length === 0) {
    return null;
  }

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Included Furniture</Text>
      <View style={styles.furnitureContainer}>
        {availableFurniture.map((furniture: string, index: number) =>
          renderFurnitureItem(furniture, index)
        )}
      </View>
    </View>
  );
};

/* VIEWER COUNT */
const ViewerCount = ({ count }: { count: number }) => (
  <View style={styles.viewerSection}>
    <Icon name="eye" size={18} color={COLORS.primary} />
    <Text style={styles.viewerText}>
      {count} people viewed this property today
    </Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: COLORS.text,
  },
  header: {
    width: "100%",
    height: 350, // Fixed height
    overflow: "hidden",
  },
  imageContainer: {
    height: 350, // Fixed height
  },
  headerImage: {
    width,
    height: 350,
    resizeMode: "cover",
  },
  headerOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  imageDots: {
    position: "absolute",
    bottom: 110,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
  },
  imageDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "rgba(255,255,255,0.5)",
    marginHorizontal: 3,
  },
  imageDotActive: {
    backgroundColor: COLORS.background,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: COLORS.background,
    flex: 1,
    marginRight: 10,
  },
  headerButtons: {
    flexDirection: "row",
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 12,
  },
  content: {},
  priceSection: {
    margin: 16,
    borderRadius: 12,
    backgroundColor: COLORS.cardBackground,
    padding: 20,
    shadowColor: COLORS.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  priceContainer: {
    alignItems: "center",
  },
  priceLabel: {
    fontSize: 12,
    color: COLORS.textLight,
    marginBottom: 4,
  },
  priceValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.primary,
  },
  pricePerSqFt: {
    fontSize: 12,
    color: COLORS.textLight,
    marginTop: 4,
  },
  quickInfoContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  detailCard: {
    width: "48%",
    borderRadius: 12,
    backgroundColor: COLORS.cardBackground,
    padding: 16,
    marginBottom: 16,
    shadowColor: COLORS.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  detailContent: {
    alignItems: "center",
  },
  detailIcon: {
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 12,
    color: COLORS.textLight,
    marginBottom: 4,
    textAlign: "center",
  },
  detailValue: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.text,
    textAlign: "center",
  },
  locationCard: {
    margin: 16,
    borderRadius: 12,
    backgroundColor: COLORS.cardBackground,
    shadowColor: COLORS.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  locationContent: {
    padding: 20,
  },
  locationHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  locationTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.text,
    marginLeft: 8,
  },
  locationText: {
    fontSize: 16,
    color: COLORS.text,
    marginBottom: 8,
  },
  locationSubtext: {
    fontSize: 12,
    color: COLORS.secondary,
  },
  contactSection: {
    margin: 16,
    borderRadius: 12,
    backgroundColor: COLORS.cardBackground,
    shadowColor: COLORS.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  contactContent: {
    padding: 20,
  },
  contactTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 16,
  },
  contactDetails: {
    marginBottom: 16,
  },
  contactInfo: {
    fontSize: 14,
    color: COLORS.text,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  contactButtons: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  contactButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    flex: 1,
    minWidth: "30%",
  },
  lockButton: {
    backgroundColor: COLORS.warning,
  },
  unlockedButton: {
    backgroundColor: COLORS.success,
  },
  contactButtonText: {
    color: COLORS.background,
    fontSize: 12,
    fontWeight: "600",
    marginLeft: 6,
  },
  section: {
    margin: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 16,
  },
  amenitiesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  amenityCard: {
    width: "48%",
    borderRadius: 12,
    backgroundColor: COLORS.cardBackground,
    padding: 16,
    marginBottom: 16,
    shadowColor: COLORS.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  amenityContent: {
    alignItems: "center",
  },
  amenityLabel: {
    marginTop: 8,
    fontSize: 14,
    color: COLORS.text,
    textAlign: "center",
  },
  furnitureContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  furnitureCard: {
    width: "48%",
    borderRadius: 12,
    backgroundColor: COLORS.cardBackground,
    padding: 16,
    marginBottom: 16,
    shadowColor: COLORS.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  furnitureContent: {
    alignItems: "center",
  },
  furnitureLabel: {
    marginTop: 8,
    fontSize: 14,
    color: COLORS.text,
    textAlign: "center",
  },
  viewerSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    margin: 16,
    backgroundColor: COLORS.cardBackground,
    borderRadius: 12,
    shadowColor: COLORS.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  viewerText: {
    fontSize: 14,
    color: COLORS.text,
    marginLeft: 8,
  },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 9999,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#ddd",
  },
  bottomBarInfoContainer: {
    backgroundColor: "#FFE5EA",
    paddingVertical: 8,
    alignItems: "center",
  },
  bottomBarInfoText: {
    fontSize: 14,
    color: COLORS.text,
  },
  bottomBarButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 8,
    paddingHorizontal: 30,
  },
  bottomBarButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    borderRadius: 8,
    marginRight: 8,
  },
  callButton: {
    backgroundColor: COLORS.primary,
  },
  inquiryButton: {
    backgroundColor: COLORS.primary,
  },
  bottomBarButtonText: {
    color: "#fff",
    marginLeft: 6,
    fontWeight: "600",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalImage: {
    width: width * 0.9,
    height: "80%",
  },
  modalCloseButton: {
    position: "absolute",
    top: 40,
    right: 20,
    zIndex: 2,
  },
  // Enhanced Share Modal Styles
  shareModalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  shareModalBackdrop: {
    flex: 1,
  },
  shareModalContainer: {
    backgroundColor: COLORS.cardBackground,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 34, // Safe area padding
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  shareModalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  shareModalTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: COLORS.text,
  },
  shareModalCloseButton: {
    padding: 4,
  },
  shareOptionsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  shareOption: {
    alignItems: "center",
    flex: 1,
  },
  shareIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  shareOptionText: {
    fontSize: 14,
    color: COLORS.text,
    fontWeight: "500",
    textAlign: "center",
  },
  shareCancelButton: {
    marginHorizontal: 24,
    paddingVertical: 16,
    alignItems: "center",
    backgroundColor: COLORS.background,
    borderRadius: 12,
    marginTop: 8,
  },
  shareCancelButtonText: {
    fontSize: 16,
    color: COLORS.textLight,
    fontWeight: "600",
  },
  inquiryModalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  inquiryModalContainer: {
    width: "90%",
    backgroundColor: COLORS.cardBackground,
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  inquiryModalCloseButton: {
    position: "absolute",
    top: 15,
    right: 15,
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2,
  },
  inquiryModalTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 20,
    color: COLORS.text,
  },
  inquiryModalDetails: {
    width: "100%",
    marginBottom: 20,
  },
  inquiryModalLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.textLight,
    marginTop: 10,
  },
  inquiryModalValue: {
    fontSize: 14,
    color: COLORS.text,
    marginTop: 4,
  },
  divider: {
    height: 1,
    backgroundColor: "#DDD",
    marginVertical: 16,
  },
});