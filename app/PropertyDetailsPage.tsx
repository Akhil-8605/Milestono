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
  Animated,
  Dimensions,
  Modal,
  StatusBar,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";

// Import our two separate sections
import UserFeedbackSection from "./propertydetails/UserFeedbackSection";
import RecommendedProjectsSection from "./propertydetails/NewProjectsSection";

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
};

// Property images (for the main listing)
const PROPERTY_IMAGES = [
  "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2",
  "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267",
  "https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6",
];

export default function PropertyListing() {
  const scrollY = useRef(new Animated.Value(0)).current;
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const imageScrollRef = useRef<ScrollView>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Inquiry modal state
  const [inquiryModalVisible, setInquiryModalVisible] = useState(false);

  const [heartClicked, sethearClicked] = useState(false);

  const statusBarHeight = StatusBar.currentHeight || 0;

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
  }, []);

  const headerHeight = scrollY.interpolate({
    inputRange: [0, 350],
    outputRange: [350, 80],
    extrapolate: "clamp",
  });

  const headerTranslateY = scrollY.interpolate({
    inputRange: [0, 350],
    outputRange: [0, -270],
    extrapolate: "clamp",
  });

  const imageOpacity = scrollY.interpolate({
    inputRange: [0, 200],
    outputRange: [1, 0.2],
    extrapolate: "clamp",
  });

  return (
    <SafeAreaView style={[styles.container, { marginTop: statusBarHeight }]}>
      <Animated.ScrollView
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
        showsHorizontalScrollIndicator={false}
        // Added extra bottom padding so content doesn't hide behind the fixed bottom bar
        contentContainerStyle={{ paddingBottom: 160 }}
      >
        {/* Header with Auto-Scrolling Images */}
        <Animated.View
          style={[
            styles.header,
            {
              height: headerHeight,
              transform: [{ translateY: headerTranslateY }],
            },
          ]}
        >
          <Animated.View
            style={[styles.imageContainer, { opacity: imageOpacity }]}
          >
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
              {PROPERTY_IMAGES.map((image, index) => (
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
              {PROPERTY_IMAGES.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.imageDot,
                    activeImageIndex === index && styles.imageDotActive,
                  ]}
                />
              ))}
            </View>
          </Animated.View>

          {/* Title & Heart/Share Icons */}
          <LinearGradient
            colors={["transparent", "rgba(0,0,0,0.8)"]}
            style={styles.headerOverlay}
          >
            <Text style={styles.title}>2 Guntha Residential Land</Text>
            <View style={styles.headerButtons}>
              <TouchableOpacity style={styles.headerButton}>
                <Icon
                  name="share-variant"
                  size={20}
                  color={COLORS.background}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.headerButton}
                onPress={() => sethearClicked(!heartClicked)}
              >
                {heartClicked ? (
                  <Icon name="heart" size={20} color={"red"} />
                ) : (
                  <Icon
                    name="heart-outline"
                    size={20}
                    color={COLORS.background}
                  />
                )}
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </Animated.View>

        {/* Main Content */}
        <View style={styles.content}>
          <PriceSection />
          <QuickInfoSection scrollY={scrollY} />
          <LocationCard />
          <ContactSection onInquiryPress={() => setInquiryModalVisible(true)} />
          <AmenitiesSection scrollY={scrollY} />
          <FurnitureSection scrollY={scrollY} />
          <ViewerCount count={15} />

          {/* Feedback Section */}
          <UserFeedbackSection />

          {/* Recommended Projects Section */}
          <RecommendedProjectsSection />
        </View>
      </Animated.ScrollView>

      {/* Fixed Bottom Bar */}
      <View style={styles.bottomBar}>
        {/* Pink info area */}
        <View style={styles.bottomBarInfoContainer}>
          <Text style={styles.bottomBarInfoText}>
            15 people viewed this property today
          </Text>
        </View>
        {/* Buttons row */}
        <View style={styles.bottomBarButtonsContainer}>
          <TouchableOpacity
            style={[styles.bottomBarButton, styles.whatsAppButton]}
            onPress={() => setInquiryModalVisible(true)}
          >
            <Icon name="phone" size={22} color={COLORS.background} />
            <Text style={styles.bottomBarButtonText}>Call Now</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.bottomBarButton, styles.viewNumberButton]}
            onPress={() => setInquiryModalVisible(true)}
          >
            <Icon name="information" size={22} color={COLORS.background} />
            <Text style={styles.buttonText}>Inquiry</Text>
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

      {/* Inquiry Modal */}
      <Modal
        visible={inquiryModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setInquiryModalVisible(false)}
      >
        <View style={styles.inquiryModalOverlay}>
          <View style={styles.inquiryModalContainer}>
            {/* Close Button at top-right */}
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
                +91 988** **** | i********@gmail.com
              </Text>
              <Text style={styles.inquiryModalValue}>VISHAL KATE</Text>

              <View style={styles.divider} />

              <Text style={styles.inquiryModalLabel}>
                POSTED ON 17th DEC, 2024
              </Text>
              <Text style={styles.inquiryModalValue}>
                ₹ 15 Lac | Phule Nagar Akkuj
              </Text>
              <Text style={styles.inquiryModalValue}>
                2 Guntha | Residential Land
              </Text>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

/* PRICE SECTION */
const PriceSection = () => (
  <View style={styles.priceSection}>
    <View style={styles.priceContainer}>
      <Text style={styles.priceLabel}>Price</Text>
      <Text style={styles.priceValue}>₹ 15,00,000</Text>
      <Text style={styles.pricePerSqFt}>Approx. ₹ 750/sq.ft</Text>
    </View>
  </View>
);

/* QUICK INFO SECTION */
const QuickInfoSection = ({ scrollY }: { scrollY: Animated.Value }) => {
  const renderDetail = (icon: string, label: string, value: string) => (
    <Animated.View
      style={[
        styles.detailCard,
        {
          transform: [
            {
              scale: scrollY.interpolate({
                inputRange: [0, 200],
                outputRange: [1, 0.95],
                extrapolate: "clamp",
              }),
            },
          ],
        },
      ]}
      key={label}
    >
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
    </Animated.View>
  );

  const infoData = [
    { icon: "ruler-square", label: "Plot Area", value: "2 Guntha" },
    { icon: "home", label: "Type", value: "Residential Land" },
    { icon: "check-circle", label: "Status", value: "For Sale" },
    { icon: "briefcase", label: "Brokerage", value: "No Brokerage" },
    { icon: "calendar", label: "Posted On", value: "17th Dec, 2024" },
    { icon: "map-marker", label: "Location", value: "Phule Nagar Akkuj" },
  ];

  return (
    <View style={styles.quickInfoContainer}>
      {infoData.map((item) => renderDetail(item.icon, item.label, item.value))}
    </View>
  );
};

const LocationCard = () => (
  <TouchableOpacity style={styles.locationCard}>
    <View style={styles.locationContent}>
      <View style={styles.locationHeader}>
        <Icon name="map-marker" size={18} color={COLORS.primary} />
        <Text style={styles.locationTitle}>Location</Text>
      </View>
      <Text style={styles.locationText}>Phule Nagar Akkuj</Text>
      <Text style={styles.locationSubtext}>View on map</Text>
    </View>
  </TouchableOpacity>
);

/* CONTACT SECTION */
const ContactSection = ({ onInquiryPress }: { onInquiryPress: () => void }) => (
  <View style={styles.contactSection}>
    <View style={styles.contactContent}>
      <Text style={styles.contactTitle}>Contact Owner</Text>
      <View style={styles.contactButtons}>
        <TouchableOpacity style={styles.callButton} onPress={onInquiryPress}>
          <Icon name="phone" size={22} color={COLORS.background} />
          <Text style={styles.buttonText}>Call Now</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.callButton} onPress={onInquiryPress}>
          <Icon name="information" size={22} color={COLORS.background} />
          <Text style={styles.buttonText}>Inquiry</Text>
        </TouchableOpacity>
      </View>
    </View>
  </View>
);

/* AMENITIES SECTION */
const AmenitiesSection = ({ scrollY }: { scrollY: Animated.Value }) => {
  const amenities = [
    { icon: "car", label: "Car Parking" },
    { icon: "cctv", label: "CCTV" },
    { icon: "shield-check", label: "Security" },
    { icon: "dumbbell", label: "Gym" },
    { icon: "home", label: "Club House" },
    { icon: "water", label: "Water Supply" },
    { icon: "elevator", label: "Lift" },
    { icon: "pool", label: "Swimming Pool" },
  ];

  const renderAmenity = (icon: string, label: string, index: number) => (
    <Animated.View
      style={[
        styles.amenityCard,
        {
          transform: [
            {
              scale: scrollY.interpolate({
                inputRange: [400, 600],
                outputRange: [0.9, 1],
                extrapolate: "clamp",
              }),
            },
          ],
          opacity: scrollY.interpolate({
            inputRange: [400, 600],
            outputRange: [0.5, 1],
            extrapolate: "clamp",
          }),
        },
      ]}
      key={index}
    >
      <View style={styles.amenityContent}>
        <Icon name={icon} size={28} color={COLORS.primary} />
        <Text style={styles.amenityLabel}>{label}</Text>
      </View>
    </Animated.View>
  );

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Amenities</Text>
      <View style={styles.amenitiesContainer}>
        {amenities.map((item, index) =>
          renderAmenity(item.icon, item.label, index)
        )}
      </View>
    </View>
  );
};

/* FURNITURE SECTION */
const FurnitureSection = ({ scrollY }: { scrollY: Animated.Value }) => {
  const furnitureItems = [
    { icon: "bed-king", label: "King Size Bed" },
    { icon: "sofa", label: "Premium Sofa" },
    { icon: "television", label: '55" Smart TV' },
    { icon: "fridge", label: "Refrigerator" },
    { icon: "washing-machine", label: "Washing Machine" },
  ];

  const renderFurnitureItem = (icon: string, label: string, index: number) => (
    <Animated.View
      style={[
        styles.furnitureCard,
        {
          transform: [
            {
              scale: scrollY.interpolate({
                inputRange: [600, 800],
                outputRange: [0.9, 1],
                extrapolate: "clamp",
              }),
            },
          ],
          opacity: scrollY.interpolate({
            inputRange: [600, 800],
            outputRange: [0.5, 1],
            extrapolate: "clamp",
          }),
        },
      ]}
      key={index}
    >
      <View style={styles.furnitureContent}>
        <Icon name={icon} size={28} color={COLORS.primary} />
        <Text style={styles.furnitureLabel}>{label}</Text>
      </View>
    </Animated.View>
  );

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Included Furniture</Text>
      <View style={styles.furnitureContainer}>
        {furnitureItems.map((item, index) =>
          renderFurnitureItem(item.icon, item.label, index)
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
  header: {
    width: "100%",
    overflow: "hidden",
  },
  imageContainer: {
    height: 350,
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
  content: {
    // Space for content sections
  },
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
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 16,
  },
  contactButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  callButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.primary,
    padding: 10,
    borderRadius: 8,
    marginRight: 8,
  },
  buttonText: {
    color: COLORS.background,
    fontSize: 12,
    fontWeight: "500",
    marginLeft: 8,
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
  /* Fullscreen Image Modal */
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
  /* Inquiry Modal */
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
  /* Bottom Bar */
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
    backgroundColor: "#232761",
    padding: 12,
    borderRadius: 8,
    marginRight: 8,
  },
  whatsAppButton: {
    backgroundColor: "#1E3A8A",
  },
  viewNumberButton: {
    backgroundColor: "#1E3A8A",
  },
  bottomBarButtonText: {
    color: "#fff",
    marginLeft: 6,
    fontWeight: "600",
  },
});
