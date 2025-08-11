import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  Linking,
  SafeAreaView,
  ActivityIndicator,
  ScrollView,
  TextInput,
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
  const [requestedServices, setRequestedServices] = useState([]);
  const [isListOpen, setIsListOpen] = useState(true);
  const [selectedService, setSelectedService] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [vendorLocation, setVendorLocation] = useState(null);
  const [centerLoc, setCenterLoc] = useState(null);
  const [showDetailedProfile, setShowDetailedProfile] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const mapRef = useRef(null);
  const [serviceId, setServiceId] = useState('');
  const [userId, setUserId] = useState('');
  const [quotedPrice, setQuotedPrice] = useState('');
  const [otpErr, setOtpErr] = useState('');
  const [serviceOTP, setServiceOTP] = useState('');
  const router = useRouter();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    const getUserId = async () => {
      const user_id = await AsyncStorage.getItem('user_id');
      setUserId(user_id);
      getVendorCurrentLocation();
    };
    getUserId();
  }, []);

  const submitServiceOTP = async (serviceId, serviceOTP) => {
    try {
      const token = await AsyncStorage.getItem('auth');
      if (!token) throw new Error('No token found. Please login again.');

      const response = await axios.post(
        `${BASE_URL}/api/services/verify-otp`,
        {
          serviceId,
          otp: serviceOTP,
        },
        {
          headers: {
            Authorization: token,
            'Content-Type': 'application/json',
          },
        }
      );
      
      if (response.data.success) {
        router.replace('/');
      } else {
        setOtpErr(response.data?.message || 'OTP verification failed');
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      setOtpErr('OTP verification failed');
    }
  };

  const getVendorCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission to access location was denied');
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const newLocation = {
        lng: location.coords.longitude,
        lat: location.coords.latitude,
      };
      setVendorLocation(newLocation);
      setCenterLoc(newLocation);
    } catch (error) {
      console.error('Unable to fetch current location', error);
    }
  };

  const onMapLoad = () => {
    setLoading(false);
  };

  const toggleList = () => {
    setIsListOpen(!isListOpen);
    if (showDetailedProfile) {
      setShowDetailedProfile(false);
    }
  };

  const handleServiceSelect = (service) => {
    setSelectedService(service);
    setServiceId(service._id);
    if (mapRef.current && service.coordinates && service.coordinates.length === 2) {
      mapRef.current.animateToRegion({
        latitude: service.coordinates[0],
        longitude: service.coordinates[1],
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }, 500);
    }
  };

  const showService = (service) => {
    setSelectedService(service);
    setServiceId(service._id);
    setShowDetailedProfile(true);
  };

  const closeProfile = () => {
    setShowDetailedProfile(false);
  };

  const fetchNearByRequestedServiceByCategory = async (longitude, latitude, maxDistance = 100000) => {
    try {
      const token = await AsyncStorage.getItem('auth');
      if (!token) {
        setError('No token found. Please log in again.');
        return;
      }
      
      const response = await axios.post(
        `${BASE_URL}/api/services/nearby/category`,
        {
          longitude,
          latitude,
          maxDistance,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: token,
          },
        }
      );

      setRequestedServices(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching requested services:', error);
      setError(error?.response?.data?.error || 'Failed to load requested services');
      setLoading(false);
    }
  };

  const handleQuoteAndAssociateVendorWithService = async () => {
    try {
      const token = await AsyncStorage.getItem('auth');
      if (!token) {
        setError('No token found. Please log in again.');
        return;
      }
      
      const numericPrice = Number(quotedPrice);
      if (!quotedPrice || isNaN(numericPrice) || numericPrice <= 0) {
        Alert.alert('Please enter a valid numeric charge');
        return;
      }

      const response = await axios.patch(
        `${BASE_URL}/api/vendors/quote`,
        {
          serviceId: selectedService._id,
          price: quotedPrice,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: token,
          },
        }
      );
      
      router.replace('/');
    } catch (error) {
      console.error('Error in Quoting Price:', error);
      setError('Error in Quoting Price');
    }
  };

  const updateVendorLocation = async () => {
    try {
      const token = await AsyncStorage.getItem('auth');
      if (!token) {
        throw new Error('No token found. Please log in again.');
      }

      await axios.patch(
        `${BASE_URL}/api/vendors`,
        {
          coordinates: [vendorLocation.lat, vendorLocation.lng],
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: token,
          },
        }
      );
    } catch (error) {
      console.error('Error updating vendor location:', error);
    }
  };

  useEffect(() => {
    if (vendorLocation) {
      const interval = setInterval(() => {
        fetchNearByRequestedServiceByCategory(
          vendorLocation.lat,
          vendorLocation.lng,
          200000,
        );
      }, 2000);

      return () => clearInterval(interval);
    }
  }, [vendorLocation]);

  useEffect(() => {
    let intervalId;
    const setupLocationUpdates = async () => {
      await getVendorCurrentLocation();
      intervalId = setInterval(() => {
        getVendorCurrentLocation();
        if (userId) {
          updateVendorLocation();
        }
      }, 3000);
    };

    setupLocationUpdates();
    return () => clearInterval(intervalId);
  }, [userId]);

  const formatStatus = (status) => {
    return status
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0066ff" />
        <Text style={styles.loadingText}>Loading service data...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={{
          latitude: centerLoc?.lat || 0,
          longitude: centerLoc?.lng || 0,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        onMapLoaded={onMapLoad}
        showsUserLocation={true}
        showsMyLocationButton={false}
      >
        {centerLoc && (
          <Marker
            coordinate={{
              latitude: centerLoc.lat,
              longitude: centerLoc.lng,
            }}
            title="Your location"
          />
        )}

        {requestedServices.map((service) => {
          if (!service.coordinates || service.coordinates.length !== 2) {
            console.warn('Invalid coordinates for service:', service._id);
            return null;
          }

          return (
            <Marker
              key={service._id}
              coordinate={{
                latitude: service.coordinates[0],
                longitude: service.coordinates[1],
              }}
              onPress={() => handleServiceSelect(service)}
            >
              <View style={styles.markerContainer}>
                <View style={styles.markerIconContainer}>
                  <MapPin width={30} height={30} stroke="#10b981" fill="#ffffff" />
                </View>
              </View>
              
              {selectedService && selectedService._id === service._id && (
                <Callout tooltip onPress={() => showService(service)}>
                  <View style={styles.calloutContainer}>
                    <Image
                      source={{ uri: service.image }}
                      style={styles.calloutImage}
                    />
                    <View style={styles.calloutContent}>
                      <Text style={styles.calloutTitle}>{service.name}</Text>
                      <Text style={styles.calloutCategory}>
                        Category: {service.category}
                      </Text>
                      <Text style={styles.calloutDescription}>
                        {service.description}
                      </Text>
                      <Text style={styles.calloutAddress}>
                        Address: {service.landmark}
                      </Text>
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
            if (mapRef.current && centerLoc) {
              mapRef.current.animateToRegion({
                latitude: centerLoc.lat,
                longitude: centerLoc.lng,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }, 1000);
              setSelectedService(null);
            }
          }}
        >
          <MapPin width={20} height={20} color="#232761" />
        </TouchableOpacity>
      </View>

      <View style={[styles.listPanel, { height: isListOpen ? height * 0.4 : 0 }]}>
        {!showDetailedProfile ? (
          <ScrollView
            style={styles.listContent}
            contentContainerStyle={styles.listScrollContent}
          >
            <Text style={styles.listTitle}>Available Services for you:</Text>

            {requestedServices.map((service) => (
              <TouchableOpacity
                key={service._id}
                style={styles.providerItem}
                onPress={() => handleServiceSelect(service)}
              >
                <View style={styles.providerAvatar}>
                  {service.profileImage ? (
                    <Image
                      source={{ uri: service.profileImage }}
                      style={styles.avatarImage}
                    />
                  ) : (
                    <View style={styles.defaultAvatar}>
                    </View>
                  )}
                </View>
                <View style={styles.providerInfo}>
                  <Text style={styles.providerName}>{service.name}</Text>
                  <Text style={styles.providerLandmark}>
                    {service.landmark}
                  </Text>
                </View>
                <View style={styles.providerActions}>
                  <TouchableOpacity
                    style={styles.viewButton}
                    onPress={(e) => {
                      e.stopPropagation();
                      showService(service);
                    }}
                  >
                    <Text style={styles.viewButtonText}>View</Text>
                  </TouchableOpacity>
                  {service.quotedPrice && (
                    <Text style={styles.providerPrice}>
                      You Quoted: {service.quotedPrice} Rs. {service.status === 'paid' ? 'is PAID' : ''}
                    </Text>
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        ) : (
          <ScrollView
            style={styles.profileScrollView}
            contentContainerStyle={styles.profileScrollContent}
          >
            <TouchableOpacity style={styles.backButton} onPress={closeProfile}>
              <ChevronLeft width={24} height={24} color="#232761" />
              <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>

            <View style={styles.profileHeader}>
              <Image
                source={{ uri: selectedService?.image || 'https://randomuser.me/api/portraits/lego/1.jpg' }}
                style={styles.profileImage}
              />
              <View style={styles.profileTitle}>
                <Text style={styles.profileName}>{selectedService?.name}</Text>
                <Text style={styles.profileCategory}>
                  Category: {selectedService?.category}
                </Text>
                <Text style={styles.profileAddress}>
                  Address: {selectedService?.landmark}
                </Text>
              </View>
            </View>

            <Text style={styles.profileDescription}>
              {selectedService?.description || 'No description available'}
            </Text>

            {selectedService?.quotedPrice && (
              <Text style={styles.quotedPrice}>
                Your Quote: {selectedService?.quotedPrice} Rs
              </Text>
            )}

            {selectedService?.status !== 'paid' ? (
              <>
                <Text style={styles.quoteTitle}>
                  {selectedService?.quotedPrice ? 'Update' : 'Quote'} Your Charges for this Service:
                </Text>
                <TextInput
                  style={styles.quoteInput}
                  placeholder="Enter Charges"
                  value={quotedPrice}
                  onChangeText={setQuotedPrice}
                  keyboardType="numeric"
                />
                <TouchableOpacity
                  style={styles.quoteButton}
                  onPress={handleQuoteAndAssociateVendorWithService}
                >
                  <Text style={styles.quoteButtonText}>Quote</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <Text style={styles.contactInfo}>
                  EMAIL: {selectedService.email}
                </Text>
                <Text style={styles.contactInfo}>
                  PHONE: {selectedService.servicePhone}
                </Text>
                <Text style={styles.otpTitle}>Enter Service OTP:</Text>
                <TextInput
                  style={styles.otpInput}
                  placeholder="Enter OTP"
                  value={serviceOTP}
                  onChangeText={setServiceOTP}
                  keyboardType="numeric"
                />
                <TouchableOpacity
                  style={styles.otpButton}
                  onPress={() => submitServiceOTP(selectedService._id, serviceOTP)}
                >
                  <Text style={styles.otpButtonText}>Submit OTP</Text>
                </TouchableOpacity>
                {otpErr && <Text style={styles.otpError}>{otpErr}</Text>}
              </>
            )}

            <TouchableOpacity
              style={styles.callButton}
              onPress={() => Linking.openURL(`tel:${selectedService?.mobile}`)}
            >
              <Phone width={18} height={18} color="#fff" />
              <Text style={styles.callButtonText}>Call Customer Now</Text>
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
        )}
      </View>

      <TouchableOpacity
        onPress={toggleList}
        style={[styles.toggleButton, { bottom: isListOpen ? height * 0.4 : 20 }]}
      >
        <ChevronLeft
          width={16}
          height={16}
          color="#fff"
          style={{
            transform: [{ rotate: isListOpen ? '90deg' : '-90deg' }],
          }}
        />
      </TouchableOpacity>

      <BlurView intensity={80} tint="dark" style={styles.footer}>
        <Text style={styles.footerText}>© Milestono.com. All Rights Reserved</Text>
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
  },
  markerContainer: {
    alignItems: 'center',
  },
  markerIconContainer: {
    backgroundColor: '#fff',
    padding: 5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#10b981',
  },
  calloutContainer: {
    width: 250,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  calloutImage: {
    width: '100%',
    height: 120,
    borderRadius: 5,
    marginBottom: 5,
  },
  calloutContent: {
    padding: 5,
  },
  calloutTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5,
  },
  calloutCategory: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  calloutDescription: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
  },
  calloutAddress: {
    fontSize: 12,
    color: '#666',
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
  listPanel: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
    overflow: 'hidden',
  },
  listContent: {
    flex: 1,
  },
  listScrollContent: {
    paddingBottom: 20,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
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
  providerInfo: {
    flex: 1,
  },
  providerName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  providerLandmark: {
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
  profileCategory: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  profileAddress: {
    fontSize: 14,
    color: '#666',
  },
  profileDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
  },
  quotedPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#232761',
    marginBottom: 20,
  },
  quoteTitle: {
    fontSize: 16,
    marginBottom: 10,
  },
  quoteInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  quoteButton: {
    backgroundColor: '#232761',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  quoteButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  contactInfo: {
    fontSize: 16,
    color: '#232761',
    marginBottom: 10,
  },
  otpTitle: {
    fontSize: 16,
    marginBottom: 10,
    marginTop: 20,
  },
  otpInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  otpButton: {
    backgroundColor: '#232761',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  otpButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  otpError: {
    color: 'red',
    fontSize: 14,
    marginBottom: 20,
    textAlign: 'center',
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
  toggleButton: {
    position: 'absolute',
    right: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#232761',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
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
});

export default ServiceProviderMap;