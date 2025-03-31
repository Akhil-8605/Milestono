"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  Dimensions,
  Linking,
  StatusBar,
  SafeAreaView,
  FlatList,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import MapView, {
  Marker,
  PROVIDER_GOOGLE,
  Callout,
  type Region,
} from "react-native-maps";
import {
  GestureHandlerRootView,
  GestureDetector,
} from "react-native-gesture-handler";
import * as Location from "expo-location";
import {
  Filter,
  ChevronLeft,
  Phone,
  MapPin,
  Star,
  Search,
  X,
  Navigation,
} from "react-native-feather";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import Reanimated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
  interpolate,
  Extrapolation,
} from "react-native-reanimated";
import { Gesture } from "react-native-gesture-handler";

const { width, height } = Dimensions.get("window");

// Define snap points using translateY values
const SNAP_POINTS = {
  OPEN: 0, // fully open (detailed profile)
  MIDDLE: height * 0.4, // intermediate state (not used in this update)
  CLOSED: height - 100, // closed state (list is visible, but only the handle is shown)
};

// Sample data with 15 service providers
const serviceProviders = [
  {
    id: "mile123",
    name: "Mr. Ajay Gavasane",
    experience: "9+ years Exp",
    rating: 8.6,
    position: { latitude: 17.6599, longitude: 75.9064 },
    price: 50,
    milestone: "Delivering excellent, professional service.",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
    pin: "4AF1E",
  },
  {
    id: "mile124",
    name: "Larana, Inc.",
    experience: "7+ years Exp",
    rating: 7.8,
    position: { latitude: 17.6699, longitude: 75.9164 },
    price: 210,
    milestone: "Professional corporate services with guaranteed results.",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
    pin: "5BG2F",
  },
  {
    id: "mile125",
    name: "Claudia Alves",
    experience: "5+ years Exp",
    rating: 8.2,
    position: { latitude: 17.6559, longitude: 75.9024 },
    price: 300,
    milestone: "Specialized in premium quality service delivery.",
    image: "https://randomuser.me/api/portraits/women/68.jpg",
    pin: "7CH3G",
  },
  {
    id: "mile126",
    name: "Borcelle Cafe",
    experience: "4+ years Exp",
    rating: 7.9,
    position: { latitude: 17.6649, longitude: 75.9124 },
    price: 200,
    milestone: "Bringing cafe-quality service to your doorstep.",
    image: "https://randomuser.me/api/portraits/men/75.jpg",
    pin: "9DI4H",
  },
  {
    id: "mile127",
    name: "Avery Clinic",
    experience: "8+ years Exp",
    rating: 8.4,
    position: { latitude: 17.6579, longitude: 75.9094 },
    price: 210,
    milestone: "Medical-grade precision in all our services.",
    image: "https://randomuser.me/api/portraits/women/90.jpg",
    pin: "2EJ5I",
  },
  // 10 additional sample servicemen
  {
    id: "mile128",
    name: "Samir Desai",
    experience: "6+ years Exp",
    rating: 8.0,
    position: { latitude: 17.662, longitude: 75.91 },
    price: 180,
    milestone: "Efficient and reliable service.",
    image: "https://randomuser.me/api/portraits/men/45.jpg",
    pin: "3KF9L",
  },
  {
    id: "mile129",
    name: "Priya Shah",
    experience: "5+ years Exp",
    rating: 8.5,
    position: { latitude: 17.6605, longitude: 75.908 },
    price: 220,
    milestone: "Quality and care in every task.",
    image: "https://randomuser.me/api/portraits/women/55.jpg",
    pin: "8LM2P",
  },
  {
    id: "mile130",
    name: "Ravi Kumar",
    experience: "10+ years Exp",
    rating: 9.0,
    position: { latitude: 17.658, longitude: 75.907 },
    price: 250,
    milestone: "Over a decade of expertise.",
    image: "https://randomuser.me/api/portraits/men/60.jpg",
    pin: "1QP3R",
  },
  {
    id: "mile131",
    name: "Sneha Patel",
    experience: "7+ years Exp",
    rating: 8.3,
    position: { latitude: 17.661, longitude: 75.912 },
    price: 190,
    milestone: "Your trusted service partner.",
    image: "https://randomuser.me/api/portraits/women/65.jpg",
    pin: "7UV5W",
  },
  {
    id: "mile132",
    name: "Arjun Mehta",
    experience: "8+ years Exp",
    rating: 8.7,
    position: { latitude: 17.659, longitude: 75.914 },
    price: 230,
    milestone: "Precision and professionalism.",
    image: "https://randomuser.me/api/portraits/men/70.jpg",
    pin: "5XT9Y",
  },
  {
    id: "mile133",
    name: "Nisha Reddy",
    experience: "6+ years Exp",
    rating: 8.1,
    position: { latitude: 17.6575, longitude: 75.9085 },
    price: 210,
    milestone: "Detail oriented and dedicated.",
    image: "https://randomuser.me/api/portraits/women/75.jpg",
    pin: "9ZB2C",
  },
  {
    id: "mile134",
    name: "Vikram Singh",
    experience: "9+ years Exp",
    rating: 8.9,
    position: { latitude: 17.66, longitude: 75.915 },
    price: 260,
    milestone: "Expert in all aspects of service.",
    image: "https://randomuser.me/api/portraits/men/80.jpg",
    pin: "6DE4F",
  },
  {
    id: "mile135",
    name: "Anjali Gupta",
    experience: "7+ years Exp",
    rating: 8.4,
    position: { latitude: 17.6595, longitude: 75.911 },
    price: 200,
    milestone: "Reliable and professional service.",
    image: "https://randomuser.me/api/portraits/women/85.jpg",
    pin: "4GH7I",
  },
  {
    id: "mile136",
    name: "Manoj Verma",
    experience: "10+ years Exp",
    rating: 9.2,
    position: { latitude: 17.6585, longitude: 75.9095 },
    price: 280,
    milestone: "Experience you can trust.",
    image: "https://randomuser.me/api/portraits/men/90.jpg",
    pin: "3JK8L",
  },
  {
    id: "mile137",
    name: "Deepa Joshi",
    experience: "5+ years Exp",
    rating: 8.0,
    position: { latitude: 17.6608, longitude: 75.9078 },
    price: 210,
    milestone: "Committed to excellence.",
    image: "https://randomuser.me/api/portraits/women/95.jpg",
    pin: "7MN9O",
  },
];

const defaultCenter = {
  latitude: 17.6599,
  longitude: 75.9064,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
};

const AnimatedView = Reanimated.createAnimatedComponent(View);

const ServiceMansPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [userLocation, setUserLocation] = useState<Region>(defaultCenter);
  const [selectedProvider, setSelectedProvider] = useState<any>(null);
  // showDetailedProfile indicates that the detailed profile view is open
  const [showDetailedProfile, setShowDetailedProfile] = useState(false);
  const [loading, setLoading] = useState(true);

  const mapRef = useRef<MapView>(null);
  const scrollViewRef = useRef<ScrollView>(null);
  const insets = useSafeAreaInsets();

  // Shared value for bottom sheet translateY
  const translateY = useSharedValue(SNAP_POINTS.CLOSED);
  const startY = useSharedValue(0);

  const filteredProviders = serviceProviders.filter(
    (provider) =>
      provider.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      provider.experience.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          console.log("Permission to access location was denied");
          setLoading(false);
          return;
        }
        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
        const newRegion = {
          ...defaultCenter,
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        };
        setUserLocation(newRegion);
        if (mapRef.current) {
          mapRef.current.animateToRegion(newRegion, 1000);
        }
      } catch (error) {
        console.log("Error getting location:", error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // When a provider is selected from the list, update selection, animate map and collapse sheet.
  const selectProviderFromList = useCallback(
    (provider: any) => {
      setSelectedProvider(provider);
      if (mapRef.current) {
        mapRef.current.animateToRegion(
          {
            latitude: provider.position.latitude,
            longitude: provider.position.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          },
          500
        );
      }
      translateY.value = withSpring(SNAP_POINTS.CLOSED, {
        damping: 20,
        stiffness: 90,
      });
    },
    [translateY]
  );

  // When tapping a marker or its callout, open detailed profile view.
  const showProfile = useCallback(
    (provider: any) => {
      setSelectedProvider(provider);
      setShowDetailedProfile(true);
      translateY.value = withSpring(SNAP_POINTS.OPEN, {
        damping: 20,
        stiffness: 90,
      });
      setTimeout(() => {
        if (scrollViewRef.current) {
          scrollViewRef.current.scrollTo({ y: 0, animated: false });
        }
      }, 100);
    },
    [translateY]
  );

  const closeProfile = useCallback(() => {
    translateY.value = withSpring(
      SNAP_POINTS.CLOSED,
      {
        damping: 20,
        stiffness: 90,
      },
      () => {
        runOnJS(setShowDetailedProfile)(false);
      }
    );
  }, [translateY]);

  const snapToPosition = useCallback(
    (position: number) => {
      "worklet";
      translateY.value = withSpring(position, {
        damping: 20,
        stiffness: 90,
      });
      if (position === SNAP_POINTS.CLOSED && showDetailedProfile) {
        runOnJS(setShowDetailedProfile)(false);
      }
    },
    [translateY, showDetailedProfile]
  );

  const getSnapPoint = useCallback((y: number, velocity: number) => {
    "worklet";
    if (Math.abs(velocity) > 500) {
      if (velocity > 0) {
        if (y > SNAP_POINTS.MIDDLE) {
          return SNAP_POINTS.CLOSED;
        } else {
          return SNAP_POINTS.MIDDLE;
        }
      } else {
        if (y < SNAP_POINTS.MIDDLE) {
          return SNAP_POINTS.OPEN;
        } else {
          return SNAP_POINTS.MIDDLE;
        }
      }
    }
    const distToOpen = Math.abs(y - SNAP_POINTS.OPEN);
    const distToMiddle = Math.abs(y - SNAP_POINTS.MIDDLE);
    const distToClosed = Math.abs(y - SNAP_POINTS.CLOSED);
    if (distToOpen < distToMiddle && distToOpen < distToClosed) {
      return SNAP_POINTS.OPEN;
    } else if (distToMiddle < distToOpen && distToMiddle < distToClosed) {
      return SNAP_POINTS.MIDDLE;
    } else {
      return SNAP_POINTS.CLOSED;
    }
  }, []);
  const panGesture = Gesture.Pan()
    .onStart(() => {
      startY.value = translateY.value;
    })
    .onUpdate((event) => {
      const newPosition = startY.value + event.translationY;
      translateY.value = Math.min(
        SNAP_POINTS.CLOSED,
        Math.max(SNAP_POINTS.OPEN, newPosition)
      );
    })
    .onEnd((event) => {
      const snapPoint = getSnapPoint(translateY.value, event.velocityY);
      snapToPosition(snapPoint);
    });

  const bottomSheetStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
      borderTopLeftRadius: interpolate(
        translateY.value,
        [SNAP_POINTS.OPEN, SNAP_POINTS.CLOSED],
        [0, 20],
        Extrapolation.CLAMP
      ),
      borderTopRightRadius: interpolate(
        translateY.value,
        [SNAP_POINTS.OPEN, SNAP_POINTS.CLOSED],
        [0, 20],
        Extrapolation.CLAMP
      ),
    };
  });

  const overlayStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(
        translateY.value,
        [SNAP_POINTS.CLOSED, SNAP_POINTS.OPEN],
        [0, 0.5],
        Extrapolation.CLAMP
      ),
    };
  });

  const formatRating = (rating: number) => {
    return (
      <View style={styles.ratingContainer}>
        <Text style={styles.ratingText}>{rating.toFixed(1)}</Text>
        <Star width={14} height={14} fill="#FFD700" stroke="#FFD700" />
      </View>
    );
  };

  const mapStyle = [
    {
      featureType: "all",
      elementType: "labels.text.fill",
      stylers: [{ color: "#7c93a3" }, { lightness: -10 }],
    },
    {
      featureType: "administrative.country",
      elementType: "geometry",
      stylers: [{ visibility: "on" }],
    },
    {
      featureType: "administrative.province",
      elementType: "geometry.stroke",
      stylers: [{ color: "#ffffff" }, { visibility: "on" }, { weight: 1 }],
    },
    {
      featureType: "landscape",
      elementType: "geometry",
      stylers: [{ color: "#f9f9f9" }],
    },
    {
      featureType: "landscape.natural",
      elementType: "geometry",
      stylers: [{ color: "#f5f5f2" }],
    },
    {
      featureType: "road",
      elementType: "geometry",
      stylers: [{ color: "#f5f5f5" }, { saturation: -100 }, { lightness: 26 }],
    },
    {
      featureType: "road.arterial",
      elementType: "geometry",
      stylers: [{ color: "#dddddd" }],
    },
    {
      featureType: "road.highway",
      elementType: "geometry",
      stylers: [{ color: "#f55f5f" }],
    },
    {
      featureType: "water",
      elementType: "geometry",
      stylers: [{ color: "#a3ccff" }],
    },
  ];

  const statusBarHeight = StatusBar.currentHeight || 0;

  return (
    <GestureHandlerRootView style={[styles.container, {marginTop: statusBarHeight}]}>
      <SafeAreaView style={styles.container}>
        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#0066ff" />
            <Text style={styles.loadingText}>Getting your location...</Text>
          </View>
        )}
        <MapView
          ref={mapRef}
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          initialRegion={userLocation}
          customMapStyle={mapStyle}
          showsUserLocation={true}
          showsMyLocationButton={false}
          showsCompass={false}
        >
          {serviceProviders.map((provider) => (
            <Marker
              key={provider.id}
              coordinate={provider.position}
              onPress={() => showProfile(provider)}
              tracksViewChanges={false}
            >
              <View style={styles.markerContainer}>
                <View style={styles.markerIconContainer}>
                  <MapPin
                    width={30}
                    height={30}
                    stroke="#232761"
                    fill="#ffffff"
                  />
                </View>
                {selectedProvider && selectedProvider.id === provider.id && (
                  <View style={styles.markerPulse} />
                )}
              </View>
              {selectedProvider && selectedProvider.id === provider.id && (
                <Callout tooltip onPress={() => showProfile(provider)}>
                  <View style={styles.calloutContainer}>
                    <View style={styles.calloutImageContainer}>
                      <Image
                        source={{ uri: provider.image }}
                        style={styles.calloutImage}
                      />
                      <View style={styles.calloutRatingBadge}>
                        {formatRating(provider.rating)}
                      </View>
                    </View>
                    <View style={styles.calloutContent}>
                      <Text style={styles.calloutTitle}>{provider.name}</Text>
                      <Text style={styles.calloutExperience}>
                        {provider.experience}
                      </Text>
                      <View style={styles.calloutDetails}>
                        <Text style={styles.calloutPrice}>
                          {provider.price} Rs
                        </Text>
                      </View>
                      <TouchableOpacity
                        style={styles.calloutButton}
                        onPress={() => showProfile(provider)}
                      >
                        <Text style={styles.calloutButtonText}>
                          View Profile
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </Callout>
              )}
            </Marker>
          ))}
        </MapView>
        <View style={[styles.mapControls, { top: insets.top + 10 }]}>
          <TouchableOpacity
            style={styles.mapControlButton}
            onPress={() => {
              if (mapRef.current && userLocation) {
                mapRef.current.animateToRegion(userLocation, 1000);
              }
            }}
          >
            <Navigation width={20} height={20} color="#232761" />
          </TouchableOpacity>
        </View>
        <AnimatedView
          style={[styles.bottomSheetOverlay, overlayStyle]}
          pointerEvents="none"
        />
        <GestureDetector gesture={panGesture}>
          <AnimatedView
            style={[
              styles.bottomSheet,
              bottomSheetStyle,
              { paddingBottom: insets.bottom },
            ]}
          >
            <View style={styles.bottomSheetHandle}>
              <View style={styles.bottomSheetHandleBar} />
            </View>
            {!showDetailedProfile ? (
              <View style={styles.listContent}>
                <View style={styles.searchContainer}>
                  <View style={styles.searchInputContainer}>
                    <Search
                      width={18}
                      height={18}
                      color="#999"
                      style={styles.searchIcon}
                    />
                    <TextInput
                      style={styles.searchInput}
                      placeholder="Search with experience"
                      placeholderTextColor="#999"
                      value={searchQuery}
                      onChangeText={setSearchQuery}
                    />
                  </View>
                  <TouchableOpacity style={styles.filterButton}>
                    <Filter width={18} height={18} color="#fff" />
                  </TouchableOpacity>
                </View>
                <Text style={styles.listTitle}>See Available Service man</Text>
                <FlatList
                  data={filteredProviders}
                  keyExtractor={(item) => item.id}
                  showsVerticalScrollIndicator={true}
                  contentContainerStyle={styles.providersList}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.providerItem}
                      onPress={() => selectProviderFromList(item)}
                      activeOpacity={0.7}
                    >
                      <View style={styles.providerAvatarContainer}>
                        <Image
                          source={{ uri: item.image }}
                          style={styles.avatarImage}
                        />
                        <View style={styles.providerRatingBadge}>
                          {formatRating(item.rating)}
                        </View>
                      </View>
                      <View style={styles.providerInfo}>
                        <Text style={styles.providerName}>{item.name}</Text>
                        <Text style={styles.providerExperience}>
                          {item.experience}
                        </Text>
                      </View>
                      <View style={styles.providerActions}>
                        <TouchableOpacity
                          style={styles.requestButton}
                          onPress={() => showProfile(item)}
                        >
                          <Text style={styles.requestButtonText}>Request</Text>
                        </TouchableOpacity>
                        <Text style={styles.providerPrice}>
                          {item.price} Rs
                        </Text>
                      </View>
                    </TouchableOpacity>
                  )}
                  removeClippedSubviews={true}
                  maxToRenderPerBatch={10}
                  windowSize={10}
                  initialNumToRender={5}
                />
              </View>
            ) : (
              <ScrollView
                ref={scrollViewRef}
                style={styles.profileScrollView}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.profileScrollContent}
              >
                <TouchableOpacity
                  style={styles.backButton}
                  onPress={closeProfile}
                >
                  <ChevronLeft width={24} height={24} color="#fff" />
                  <Text style={styles.backButtonText}>Back</Text>
                </TouchableOpacity>
                <View style={styles.profileHeader}>
                  <Image
                    source={{
                      uri:
                        selectedProvider?.image ||
                        "https://randomuser.me/api/portraits/lego/1.jpg",
                    }}
                    style={styles.profileImage}
                  />
                  <View style={styles.profileTitle}>
                    <Text style={styles.profileName}>
                      {selectedProvider?.name}
                    </Text>
                    <Text style={styles.profileExperience}>
                      {selectedProvider?.experience}
                    </Text>
                    <View style={styles.profileRatingRow}>
                      <Text style={{ color: "white" }}>
                        {formatRating(selectedProvider?.rating || 0)}
                      </Text>
                      <Text style={styles.profileRatingText}>
                        Excellent Service
                      </Text>
                    </View>
                  </View>
                </View>
                <View style={styles.profileDivider} />
                <View style={styles.pinSection}>
                  <View style={styles.pinWarningContainer}>
                    <X
                      width={16}
                      height={16}
                      color="#ff6b6b"
                      style={{ marginRight: 8 }}
                    />
                    <Text style={styles.pinWarning}>
                      Don't Share that Pin until your work complete
                    </Text>
                  </View>
                  <LinearGradient
                    colors={["rgba(50, 50, 50, 0.7)", "rgba(30, 30, 30, 0.7)"]}
                    style={styles.pinContainer}
                  >
                    <Text style={styles.pinTitle}>Code PIN</Text>
                    <View style={styles.pinDigits}>
                      {selectedProvider?.pin
                        .split("")
                        .map((digit: string, index: number) => (
                          <View key={index} style={styles.pinDigit}>
                            <Text style={styles.pinDigitText}>{digit}</Text>
                          </View>
                        ))}
                    </View>
                  </LinearGradient>
                </View>
                <View style={styles.profileInfoSection}>
                  <View style={styles.profileId}>
                    <Text style={styles.profileIdLabel}>Service Man ID: </Text>
                    <Text style={styles.profileIdValue}>
                      {selectedProvider?.id}
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={styles.callButton}
                    onPress={() => Linking.openURL(`tel:+1234567890`)}
                  >
                    <Phone width={18} height={18} color="#fff" />
                    <Text style={styles.callButtonText}>Call Now</Text>
                  </TouchableOpacity>
                </View>
                <LinearGradient
                  colors={["rgba(50, 50, 50, 0.7)", "rgba(30, 30, 30, 0.7)"]}
                  style={styles.milestoneContainer}
                >
                  <Text style={styles.milestoneTitle}>About Service</Text>
                  <Text style={styles.profileMilestone}>
                    {selectedProvider?.milestone}
                  </Text>
                </LinearGradient>
                <View style={styles.profileDivider} />
                <View style={styles.profileContact}>
                  <Text style={styles.contactText}>
                    You need any help{" "}
                    <Text
                      style={styles.contactLink}
                      onPress={() =>
                        Linking.openURL("mailto:contact@milestono.com")
                      }
                    >
                      contact@milestono.com
                    </Text>
                  </Text>
                </View>
                <View style={{ height: 40 }} />
              </ScrollView>
            )}
          </AnimatedView>
        </GestureDetector>
        <BlurView
          intensity={80}
          tint="dark"
          style={[styles.footer, { paddingBottom: insets.bottom || 8 }]}
        >
          <Text style={styles.footerText}>
            © Milestono.com. All Rights Reserved 2025
          </Text>
        </BlurView>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  loadingText: {
    color: "white",
    marginTop: 10,
    fontSize: 16,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  mapControls: {
    position: "absolute",
    right: 16,
    zIndex: 5,
  },
  mapControlButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  markerContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  markerIconContainer: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  markerPulse: {
    position: "absolute",
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(35, 39, 97, 0.2)",
    transform: [{ scale: 1.2 }],
  },
  calloutContainer: {
    width: 250,
    backgroundColor: "white",
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  calloutImageContainer: {
    width: "100%",
    height: 120,
    position: "relative",
  },
  calloutImage: {
    width: "100%",
    height: "100%",
  },
  calloutRatingBadge: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "white",
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  calloutContent: {
    padding: 12,
  },
  calloutTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#222",
    marginBottom: 4,
  },
  calloutExperience: {
    fontSize: 13,
    color: "#666",
    marginBottom: 8,
  },
  calloutDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  calloutPrice: {
    color: "#4caf50",
    fontWeight: "500",
    fontSize: 14,
  },
  calloutButton: {
    backgroundColor: "#0066ff",
    borderRadius: 8,
    padding: 10,
    alignItems: "center",
  },
  calloutButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "500",
  },
  bottomSheetOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "black",
    pointerEvents: "none",
  },
  bottomSheet: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
    backgroundColor: "rgba(18, 18, 18, 0.95)",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
  },
  bottomSheetHandle: {
    width: "100%",
    height: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  bottomSheetHandleBar: {
    width: 40,
    height: 5,
    borderRadius: 3,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
  },
  listContent: {
    flex: 1,
    padding: 20,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 24,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(50, 50, 50, 0.7)",
    borderWidth: 1,
    borderColor: "#444",
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 46,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: "white",
    fontSize: 14,
    height: "100%",
  },
  filterButton: {
    backgroundColor: "rgba(50, 50, 50, 0.7)",
    borderWidth: 1,
    borderColor: "#444",
    borderRadius: 12,
    width: 46,
    height: 46,
    alignItems: "center",
    justifyContent: "center",
  },
  listTitle: {
    fontSize: 22,
    fontWeight: "600",
    color: "white",
    marginBottom: 20,
  },
  providersList: {
    paddingBottom: 20,
  },
  providerItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
  },
  providerAvatarContainer: {
    position: "relative",
    width: 56,
    height: 56,
    borderRadius: 12,
    marginRight: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  providerRatingBadge: {
    position: "absolute",
    bottom: -5,
    right: -5,
    backgroundColor: "white",
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
    elevation: 2,
  },
  avatarImage: {
    width: "100%",
    height: "100%",
  },
  providerInfo: {
    flex: 1,
  },
  providerName: {
    fontSize: 16,
    fontWeight: "600",
    color: "white",
    marginBottom: 4,
  },
  providerExperience: {
    fontSize: 14,
    color: "#999",
  },
  providerActions: {
    alignItems: "flex-end",
    gap: 6,
  },
  requestButton: {
    backgroundColor: "#0066ff",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  requestButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "500",
  },
  providerPrice: {
    color: "#4caf50",
    fontWeight: "500",
    fontSize: 14,
  },
  profileScrollView: {
    flex: 1,
  },
  profileScrollContent: {
    padding: 20,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  backButtonText: {
    color: "white",
    fontSize: 16,
    marginLeft: 4,
  },
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  profileTitle: {
    flex: 1,
  },
  profileName: {
    fontSize: 24,
    fontWeight: "600",
    color: "white",
    marginBottom: 4,
  },
  profileExperience: {
    fontSize: 16,
    color: "#999",
    marginBottom: 6,
  },
  profileRatingRow: {
    flexDirection: "row",
    alignItems: "center",
    color: "white",
  },
  profileRatingText: {
    color: "#999",
    fontSize: 14,
    marginLeft: 8,
  },
  profileDivider: {
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    marginVertical: 24,
  },
  pinSection: {
    marginBottom: 24,
  },
  pinWarningContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  pinWarning: {
    fontSize: 14,
    color: "#ff6b6b",
    flex: 1,
  },
  pinContainer: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  pinTitle: {
    fontSize: 18,
    color: "#4caf50",
    marginBottom: 12,
    fontWeight: "600",
  },
  pinDigits: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  pinDigit: {
    width: 50,
    height: 50,
    backgroundColor: "#333",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  pinDigitText: {
    fontSize: 24,
    fontWeight: "600",
    color: "white",
  },
  profileInfoSection: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
    justifyContent: "space-between",
  },
  profileId: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  profileIdLabel: {
    fontSize: 16,
    color: "#999",
  },
  profileIdValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "white",
  },
  callButton: {
    backgroundColor: "#0066ff",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  callButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
  milestoneContainer: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  milestoneTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "white",
    marginBottom: 8,
  },
  profileMilestone: {
    fontSize: 16,
    lineHeight: 24,
    color: "#ccc",
  },
  profileContact: {
    alignItems: "center",
  },
  contactText: {
    fontSize: 14,
    color: "#999",
  },
  contactLink: {
    color: "#0066ff",
    textDecorationLine: "underline",
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingVertical: 8,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  footerText: {
    color: "#ccc",
    fontSize: 14,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000",
  },
});

export default ServiceMansPage;
