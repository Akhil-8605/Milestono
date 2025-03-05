"use client";

import { useState, useRef, useEffect } from "react";
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

  const [heartClicked, sethearClicked] = useState(false);

  const statusBarHeight = StatusBar.currentHeight || 0;

  return (
    <SafeAreaView style={[styles.container, { marginTop: statusBarHeight }]}>
      <Animated.ScrollView
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
        showsHorizontalScrollIndicator={false}
      >
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
          <LinearGradient
            colors={["transparent", "rgba(0,0,0,0.8)"]}
            style={styles.headerOverlay}
          >
            <Text style={styles.title}>Luxurious 1RK Flat</Text>
            <View style={styles.headerButtons}>
              <TouchableOpacity style={styles.headerButton}>
                <Icon
                  name="share-variant"
                  size={22}
                  color={COLORS.background}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.headerButton, ""]}
                onPress={() => {
                  sethearClicked(!heartClicked);
                }}
              >
                {heartClicked ? (
                  <Icon name="heart" size={22} color={"red"} />
                ) : (
                  <Icon
                    name="heart-outline"
                    size={22}
                    color={COLORS.background}
                  />
                )}
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </Animated.View>

        <View style={styles.content}>
          <PriceSection />
          <QuickInfoSection scrollY={scrollY} />
          <LocationCard />
          <ContactSection />
          <AmenitiesSection scrollY={scrollY} />
          <FurnitureSection scrollY={scrollY} />
          <ViewerCount count={15} />
        </View>
      </Animated.ScrollView>

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
    </SafeAreaView>
  );
}

const PriceSection = () => (
  <View style={styles.priceSection}>
    <View style={styles.priceContainer}>
      <Text style={styles.priceLabel}>Price</Text>
      <Text style={styles.priceValue}>₹ 30,00,000</Text>
      <Text style={styles.pricePerSqFt}>₹ 3,000/sq.ft</Text>
    </View>
  </View>
);

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

  return (
    <View style={styles.quickInfoContainer}>
      {renderDetail("bed", "Bedrooms", "1RK")}
      {renderDetail("ruler-square", "Area", "1000 sq.ft")}
      {renderDetail("balcony", "Balconies", "2")}
      {renderDetail("shower", "Bathrooms", "1")}
      {renderDetail("check-circle", "Status", "For Sale")}
      {renderDetail("briefcase", "Brokerage", "No Brokerage")}
    </View>
  );
};

const LocationCard = () => (
  <TouchableOpacity style={styles.locationCard}>
    <View style={styles.locationContent}>
      <View style={styles.locationHeader}>
        <Icon name="map-marker" size={24} color={COLORS.primary} />
        <Text style={styles.locationTitle}>Location</Text>
      </View>
      <Text style={styles.locationText}>Airport 1RK Flat Solapur</Text>
      <Text style={styles.locationSubtext}>View on map</Text>
    </View>
  </TouchableOpacity>
);

const ContactSection = () => (
  <View style={styles.contactSection}>
    <View style={styles.contactContent}>
      <Text style={styles.contactTitle}>Contact Owner</Text>
      <View style={styles.contactButtons}>
        <TouchableOpacity style={styles.callButton}>
          <Icon name="phone" size={22} color={COLORS.background} />
          <Text style={styles.buttonText}>Call Now</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.whatsappButton}>
          <Icon name="whatsapp" size={22} color={COLORS.background} />
          <Text style={styles.buttonText}>WhatsApp</Text>
        </TouchableOpacity>
      </View>
    </View>
  </View>
);

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
    fontSize: 24,
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
    paddingBottom: 80,
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
    fontSize: 16,
    color: COLORS.textLight,
    marginBottom: 4,
  },
  priceValue: {
    fontSize: 32,
    fontWeight: "bold",
    color: COLORS.primary,
  },
  pricePerSqFt: {
    fontSize: 14,
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
    fontSize: 14,
    color: COLORS.textLight,
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.text,
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
    fontSize: 14,
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
    padding: 12,
    borderRadius: 8,
    marginRight: 8,
  },
  whatsappButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#25D366",
    padding: 12,
    borderRadius: 8,
    marginLeft: 8,
  },
  buttonText: {
    color: COLORS.background,
    fontSize: 16,
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
});
