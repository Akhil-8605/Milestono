import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  Dimensions,
  Linking,
  SafeAreaView,
  ActivityIndicator,
  ScrollView,
  Alert,
} from 'react-native';
import MapView, { Marker, Callout, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import { Filter, ChevronLeft, Phone, MapPin, Star, Search } from 'react-native-feather';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import axios from 'axios';
import { useLocalSearchParams, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from "@env";
const { width, height } = Dimensions.get('window');

const ServiceProviderMap = () => {
  const [serviceProviders, setServiceProviders] = useState([]);
  const [requestedService, setRequestedService] = useState(null);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showDetailedProfile, setShowDetailedProfile] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState({
    latitude: 17.6599,
    longitude: 75.9064,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [distance, setDistance] = useState(null);
  const [newReview, setNewReview] = useState({
    review: '',
    reviewer_name: '',
  });
  const [showReviewForm, setShowReviewForm] = useState(false);

  const mapRef = useRef(null);
  const scrollViewRef = useRef(null);
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { serviceId } = useLocalSearchParams();

  const formatStatus = (status) => {
    return status
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const fetchQoutedServiceProviders = async () => {
    try {
      const token = await AsyncStorage.getItem('auth');
      const response = await axios.get(
        `${BASE_URL}/api/vendors/by-service/${serviceId}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: token,
          },
        },
      );

      setServiceProviders(response.data);
      if (response.data[0]?.status === 'busy') {
        showProfile(response.data[0]);
      }
    } catch (error) {
      console.error('Error fetching vendors by service ID:', error);
    }
  };

  const getUserLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission to access location was denied');
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const newRegion = {
        ...userLocation,
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };
      setUserLocation(newRegion);
      if (mapRef.current) {
        mapRef.current.animateToRegion(newRegion, 1000);
      }
    } catch (error) {
      console.error('Error getting location:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      fetchQoutedServiceProviders();
    }, 4000);

    return () => clearInterval(interval);
  }, [serviceId]);

  const fetchServiceData = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/api/services/${serviceId}`,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      const data = response.data;
      const matchedProvider = serviceProviders.find(
        (provider) => provider.email === data.vendorEmail,
      );

      if (matchedProvider) {
        setSelectedProvider(matchedProvider);
      }

      setRequestedService(data);
    } catch (error) {
      console.error('Error fetching service data:', error);
      Alert.alert('Failed to load service data');
    }
  };

  useEffect(() => {
    fetchServiceData();
  }, [serviceProviders]);

  const handleProviderSelect = (provider) => {
    setSelectedProvider(provider);

    if (provider.coordinates && provider.coordinates.length === 2) {
      const newLocation = {
        latitude: provider.coordinates[1],
        longitude: provider.coordinates[0],
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };
      setUserLocation(newLocation);

      if (mapRef.current) {
        mapRef.current.animateToRegion(newLocation, 500);
      }
    }
  };

  const showProfile = (provider) => {
    setSelectedProvider(provider);
    setShowDetailedProfile(true);
  };

  const closeProfile = () => {
    setShowDetailedProfile(false);
  };

  const handleAcceptQoute = async (service) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/api/services/paid-service/${serviceId}`,
        {
          price: service.quotedPrice,
          vendorId: service._id,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
      router.replace('/');
    } catch (error) {
      console.error('Error in sending request to vendor:', error);
      Alert.alert(
        'Error',
        error.response
          ? `Failed to send request to vendor. Status: ${error.response.status}`
          : 'Error in sending request to vendor',
      );
    }
  };

  const fetchReviews = async (vendorId) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/api/vendors/${vendorId}/reviews`,
      );

      setSelectedProvider((prev) => ({
        ...prev,
        reviews: response.data,
      }));
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  useEffect(() => {
    if (selectedProvider) {
      fetchReviews(selectedProvider._id);
    }
  }, [selectedProvider]);

  useEffect(() => {
    getUserLocation();
  }, []);

  const handleReviewSubmit = async () => {
    try {
      const response = await axios.post(
        `${BASE_URL}/api/vendors/${selectedProvider._id}/reviews`,
        newReview,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      const data = response.data;

      setSelectedProvider((prev) => ({
        ...prev,
        reviews: [...(prev.reviews || []), data],
      }));
      setNewReview({ review: '', reviewer_name: '' });
      setShowReviewForm(false);
    } catch (error) {
      console.error('Error submitting review:', error);
    }
  };

  const handleReviewChange = (name, value) => {
    setNewReview((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const calculateDistance = async () => {
    try {
      const response = await axios.post(
        `${BASE_URL}/api/services/distance/${serviceId}`,
        {
          emailFromBody: selectedProvider?.email || null,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
      setDistance(response.data.distanceInKm);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    calculateDistance();

    if (selectedProvider && requestedService?.status !== 'requested' && requestedService?.status !== 'quoted') {
      const interval = setInterval(() => {
        calculateDistance();
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [selectedProvider]);

  const formatRating = (rating) => {
    return (
      <View style={styles.ratingContainer}>
        <Text style={styles.ratingText}>{rating?.toFixed(1) || '0.0'}</Text>
        <Star width={14} height={14} fill="#FFD700" stroke="#FFD700" />
      </View>
    );
  };

  const mapStyle = [
    {
      featureType: 'all',
      elementType: 'labels.text.fill',
      stylers: [{ color: '#7c93a3' }, { lightness: -10 }],
    },
    {
      featureType: 'administrative.country',
      elementType: 'geometry',
      stylers: [{ visibility: 'on' }],
    },
    {
      featureType: 'administrative.province',
      elementType: 'geometry.stroke',
      stylers: [{ color: '#ffffff' }, { visibility: 'on' }, { weight: 1 }],
    },
    {
      featureType: 'landscape',
      elementType: 'geometry',
      stylers: [{ color: '#f9f9f9' }],
    },
    {
      featureType: 'landscape.natural',
      elementType: 'geometry',
      stylers: [{ color: '#f5f5f2' }],
    },
    {
      featureType: 'road',
      elementType: 'geometry',
      stylers: [{ color: '#f5f5f5' }, { saturation: -100 }, { lightness: 26 }],
    },
    {
      featureType: 'road.arterial',
      elementType: 'geometry',
      stylers: [{ color: '#dddddd' }],
    },
    {
      featureType: 'road.highway',
      elementType: 'geometry',
      stylers: [{ color: '#f55f5f' }],
    },
    {
      featureType: 'water',
      elementType: 'geometry',
      stylers: [{ color: '#a3ccff' }],
    },
  ];

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0066ff" />
        <Text style={styles.loadingText}>Getting your location...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
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
        {serviceProviders.map((provider) => {
          if (!provider.coordinates || provider.coordinates.length !== 2) {
            console.warn('Invalid coordinates for provider:', provider._id);
            return null;
          }

          return (
            <Marker
              key={provider._id}
              coordinate={{
                latitude: provider.coordinates[1],
                longitude: provider.coordinates[0],
              }}
              onPress={() => showProfile(provider)}
            >
              <View style={styles.markerContainer}>
                <View style={styles.markerIconContainer}>
                  <MapPin width={30} height={30} stroke="#232761" fill="#ffffff" />
                </View>
                {selectedProvider && selectedProvider._id === provider._id && (
                  <View style={styles.markerPulse} />
                )}
              </View>
              {selectedProvider && selectedProvider._id === provider._id && (
                <Callout tooltip onPress={() => showProfile(provider)}>
                  <View style={styles.calloutContainer}>
                    <View style={styles.calloutImageContainer}>
                      <Image
                        source={{ uri: provider.vendorImage }}
                        style={styles.calloutImage}
                      />
                      <View style={styles.calloutRatingBadge}>
                        {formatRating(provider.rating)}
                      </View>
                    </View>
                    <View style={styles.calloutContent}>
                      <Text style={styles.calloutTitle}>{provider.vendorName}</Text>
                      <Text style={styles.calloutExperience}>
                        Experience: {provider.experience} years
                      </Text>
                      <View style={styles.calloutDetails}>
                        <Text style={styles.calloutPrice}>
                          {provider.quotedPrice} Rs
                        </Text>
                      </View>
                      <TouchableOpacity
                        style={styles.calloutButton}
                        onPress={() => showProfile(provider)}
                      >
                        <Text style={styles.calloutButtonText}>View Profile</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </Callout>
              )}
            </Marker>
          );
        })}
      </MapView>

      <View style={[styles.mapControls, { top: insets.top + 10 }]}>
        <TouchableOpacity
          style={styles.mapControlButton}
          onPress={() => {
            if (mapRef.current && userLocation) {
              mapRef.current.animateToRegion(userLocation, 1000);
              setSelectedProvider(null);
            }
          }}
        >
          <MapPin width={20} height={20} color="#232761" />
        </TouchableOpacity>
      </View>

      {showDetailedProfile ? (
        <View style={styles.bottomSheet}>
          <ScrollView
            ref={scrollViewRef}
            style={styles.profileScrollView}
            contentContainerStyle={styles.profileScrollContent}
          >
            <TouchableOpacity style={styles.backButton} onPress={closeProfile}>
              <ChevronLeft width={24} height={24} color="#fff" />
              <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>

            <View style={styles.profileHeader}>
              <Image
                source={{
                  uri: selectedProvider?.vendorImage || 'https://randomuser.me/api/portraits/lego/1.jpg',
                }}
                style={styles.profileImage}
              />
              <View style={styles.profileTitle}>
                <Text style={styles.profileName}>{selectedProvider?.vendorName}</Text>
                <Text style={styles.profileExperience}>
                  Experience: {selectedProvider?.experience} years
                </Text>
              </View>
            </View>

            <View style={styles.profileDivider} />

            <View style={styles.profileDistance}>
              {distance !== null ? (
                <Text style={styles.distanceText}>
                  {distance < 1
                    ? 'Less than 1 km away from your location'
                    : `Serviceman is ${distance} km away from your location. He will reach soon.`}
                </Text>
              ) : (
                <Text style={styles.distanceText}>Calculating distance...</Text>
              )}
            </View>

            <View style={styles.profileMilestone}>
              <Text style={styles.milestoneTitle}>Your Service Details:</Text>
              <Text style={styles.milestoneText}>
                Problem: {requestedService?.name}
              </Text>
              <Text style={styles.milestoneText}>
                Description: {requestedService?.description}
              </Text>
              <Text style={styles.milestoneText}>
                Category: {requestedService?.category}
              </Text>
            </View>

            <Text style={styles.quotedPrice}>
              Qouted Price: {selectedProvider?.quotedPrice} Rs.
            </Text>

            {requestedService?.status !== 'paid' ? (
              <View style={styles.paymentButtonContainer}>
                {(requestedService?.status === 'requested' || requestedService?.status === 'quoted') && (
                  <TouchableOpacity
                    style={styles.payNowButton}
                    onPress={() => handleAcceptQoute(selectedProvider)}
                  >
                    <Text style={styles.payNowButtonText}>Pay Now</Text>
                  </TouchableOpacity>
                )}
              </View>
            ) : (
              <>
                <View style={styles.pinSection}>
                  <Text style={styles.pinWarning}>
                    Don't Share that Pin until your work complete *
                  </Text>
                  <View style={styles.pinContainer}>
                    <Text style={styles.pinTitle}>Service OTP</Text>
                    <View style={styles.pinDigits}>
                      {requestedService?.otp?.split('').map((digit, index) => (
                        <View key={index} style={styles.pinDigit}>
                          <Text style={styles.pinDigitText}>{digit}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                </View>

                <View style={styles.contactInfo}>
                  <Text style={styles.contactText}>
                    EMAIL: {requestedService.vendorEmail}
                  </Text>
                  <Text style={styles.contactText}>
                    PHONE: {requestedService.vendorPhone}
                  </Text>
                </View>
              </>
            )}

            <View style={styles.reviewsSection}>
              <Text style={styles.sectionTitle}>Reviews</Text>
              {selectedProvider?.reviews?.length > 0 ? (
                selectedProvider.reviews.map((review, index) => (
                  <View key={index} style={styles.reviewItem}>
                    <Text style={styles.reviewerName}>
                      {review.reviewer_name} Says
                    </Text>
                    <Text style={styles.reviewText}>-{review.review}</Text>
                  </View>
                ))
              ) : (
                <Text style={styles.noReviewsText}>No reviews yet</Text>
              )}

              <TouchableOpacity
                style={styles.addReviewButton}
                onPress={() => setShowReviewForm(true)}
              >
                <Text style={styles.addReviewButtonText}>Add Review</Text>
              </TouchableOpacity>

              {showReviewForm && (
                <View style={styles.reviewForm}>
                  <Text style={styles.formTitle}>Write a Review</Text>
                  <TextInput
                    style={styles.formInput}
                    placeholder="Your Name"
                    value={newReview.reviewer_name}
                    onChangeText={(text) => handleReviewChange('reviewer_name', text)}
                  />
                  <TextInput
                    style={[styles.formInput, styles.formTextArea]}
                    placeholder="Your review..."
                    multiline
                    numberOfLines={4}
                    value={newReview.review}
                    onChangeText={(text) => handleReviewChange('review', text)}
                  />
                  <View style={styles.formButtons}>
                    <TouchableOpacity
                      style={styles.submitButton}
                      onPress={handleReviewSubmit}
                    >
                      <Text style={styles.buttonText}>Submit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.cancelButton}
                      onPress={() => setShowReviewForm(false)}
                    >
                      <Text style={styles.buttonText}>Cancel</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>

            <TouchableOpacity
              style={styles.callButton}
              onPress={() => Linking.openURL(`tel:${requestedService?.vendorPhone}`)}
            >
              <Phone width={18} height={18} color="#fff" />
              <Text style={styles.callButtonText}>Call Now</Text>
            </TouchableOpacity>

            <View style={styles.helpSection}>
              <Text style={styles.helpText}>
                You need any help{' '}
                <Text
                  style={styles.helpLink}
                  onPress={() => Linking.openURL('mailto:contact@milestono.com')}
                >
                  contact@milestono.com
                </Text>
              </Text>
            </View>
          </ScrollView>
        </View>
      ) : (
        <View style={styles.listPanel}>
          <View style={styles.searchContainer}>
            <View style={styles.searchInputContainer}>
              <Search width={18} height={18} color="#999" style={styles.searchIcon} />
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

          <Text style={styles.listTitle}>See Available Service man within 20 km</Text>

          <ScrollView
            style={styles.providersScrollView}
            contentContainerStyle={styles.providersList}
          >
            {serviceProviders
              .filter((val) => {
                const exp = parseInt(val.experience, 10);
                const searchExp = parseInt(searchQuery, 10);

                if (isNaN(searchExp)) return true;

                return exp >= searchExp;
              })
              .map((provider) => (
                <TouchableOpacity
                  key={provider._id}
                  style={styles.providerItem}
                  onPress={() => handleProviderSelect(provider)}
                >
                  <View style={styles.providerAvatar}>
                    {provider.vendorImage ? (
                      <Image
                        source={{ uri: provider.vendorImage }}
                        style={styles.avatarImage}
                      />
                    ) : (
                      <View style={styles.defaultAvatar}>
                        <Text style={styles.avatarText}>?</Text>
                      </View>
                    )}
                  </View>
                  <View style={styles.providerInfo}>
                    <Text style={styles.providerName}>{provider.vendorName}</Text>
                    <Text style={styles.providerExperience}>
                      Experience: {provider.experience} Years
                    </Text>
                  </View>
                  <View style={styles.providerActions}>
                    <TouchableOpacity
                      style={styles.viewButton}
                      onPress={() => showProfile(provider)}
                    >
                      <Text style={styles.viewButtonText}>View</Text>
                    </TouchableOpacity>
                    <Text style={styles.providerPrice}>
                      Qouted: {provider.quotedPrice || 'Not Qouted'} Rs
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
          </ScrollView>
        </View>
      )}

      <BlurView intensity={80} tint="dark" style={styles.footer}>
        <Text style={styles.footerText}>© Milestono.com. All Rights Reserved 2025</Text>
      </BlurView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#0066ff',
  },
  markerContainer: {
    alignItems: 'center',
  },
  markerIconContainer: {
    backgroundColor: '#fff',
    padding: 5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#232761',
  },
  markerPulse: {
    position: 'absolute',
    top: -10,
    left: -10,
    right: -10,
    bottom: -10,
    borderRadius: 25,
    backgroundColor: 'rgba(35, 39, 97, 0.3)',
    zIndex: -1,
  },
  calloutContainer: {
    width: 250,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    flexDirection: 'row',
  },
  calloutImageContainer: {
    marginRight: 10,
    position: 'relative',
  },
  calloutImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  calloutRatingBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#fff',
    padding: 5,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#eee',
  },
  calloutContent: {
    flex: 1,
  },
  calloutTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5,
  },
  calloutExperience: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
  },
  calloutDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  calloutPrice: {
    fontWeight: 'bold',
    color: '#232761',
    fontSize: 16,
  },
  calloutButton: {
    backgroundColor: '#232761',
    padding: 5,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 5,
  },
  calloutButtonText: {
    color: '#fff',
    fontSize: 12,
  },
  mapControls: {
    position: 'absolute',
    right: 15,
    zIndex: 1,
  },
  mapControlButton: {
    backgroundColor: '#fff',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: height * 0.7,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
  },
  profileScrollView: {
    flex: 1,
  },
  profileScrollContent: {
    paddingBottom: 20,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButtonText: {
    color: '#232761',
    fontSize: 16,
    marginLeft: 5,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 15,
  },
  profileTitle: {
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  profileExperience: {
    fontSize: 14,
    color: '#666',
  },
  profileDivider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 15,
  },
  profileDistance: {
    marginBottom: 15,
  },
  distanceText: {
    fontSize: 14,
    color: '#232761',
  },
  profileMilestone: {
    marginBottom: 15,
  },
  milestoneTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  milestoneText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  quotedPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#232761',
    marginBottom: 20,
  },
  paymentButtonContainer: {
    marginBottom: 20,
  },
  payNowButton: {
    backgroundColor: '#232761',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  payNowButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  pinSection: {
    marginBottom: 20,
  },
  pinWarning: {
    fontSize: 14,
    color: 'red',
    marginBottom: 10,
    textAlign: 'center',
  },
  pinContainer: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  pinTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  pinDigits: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  pinDigit: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#232761',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
  },
  pinDigitText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  contactInfo: {
    marginBottom: 20,
  },
  contactText: {
    fontSize: 14,
    color: '#232761',
    marginBottom: 5,
  },
  reviewsSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  reviewItem: {
    marginBottom: 15,
  },
  reviewerName: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  reviewText: {
    fontSize: 14,
    color: '#666',
  },
  noReviewsText: {
    fontSize: 14,
    color: '#999',
    fontStyle: 'italic',
  },
  addReviewButton: {
    backgroundColor: '#232761',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  addReviewButtonText: {
    color: '#fff',
    fontSize: 14,
  },
  reviewForm: {
    marginTop: 15,
  },
  formTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  formInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    fontSize: 14,
  },
  formTextArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  formButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  submitButton: {
    backgroundColor: '#232761',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginRight: 5,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#999',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginLeft: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
  },
  callButton: {
    backgroundColor: '#232761',
    padding: 15,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  callButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  helpSection: {
    marginBottom: 20,
  },
  helpText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  helpLink: {
    color: '#232761',
    textDecorationLine: 'underline',
  },
  listPanel: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: height * 0.4,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginRight: 10,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 14,
  },
  filterButton: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#232761',
    justifyContent: 'center',
    alignItems: 'center',
  },
  listTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  providersScrollView: {
    flex: 1,
  },
  providersList: {
    paddingBottom: 20,
  },
  providerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    marginBottom: 10,
  },
  providerAvatar: {
    marginRight: 15,
  },
  avatarImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  defaultAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#666',
  },
  providerInfo: {
    flex: 1,
  },
  providerName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  providerExperience: {
    fontSize: 12,
    color: '#666',
  },
  providerActions: {
    alignItems: 'flex-end',
  },
  viewButton: {
    backgroundColor: '#232761',
    padding: 5,
    borderRadius: 5,
    marginBottom: 5,
  },
  viewButtonText: {
    color: '#fff',
    fontSize: 12,
  },
  providerPrice: {
    fontSize: 12,
    color: '#232761',
    fontWeight: 'bold',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 10,
    alignItems: 'center',
  },
  footerText: {
    color: '#fff',
    fontSize: 12,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 12,
    marginRight: 2,
    color: '#232761',
  },
});

export default ServiceProviderMap;