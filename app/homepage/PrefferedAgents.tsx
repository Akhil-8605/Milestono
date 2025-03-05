import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
  Animated,
  ScrollView,
  Modal,
  Linking,
  Platform
} from 'react-native';
import { useNavigation } from 'expo-router';
import { Feather, MaterialIcons, AntDesign, Ionicons } from '@expo/vector-icons';

// ----- Stub for LinearGradient (replace with your actual implementation if available) -----
const LinearGradient = ({ colors, style, children }) => {
  return (
    <View style={[style, { backgroundColor: colors[0] }]}>
      {children}
    </View>
  );
};

// ----- Featured Agents Data (same structure as in AgentsPage) -----
const featuredAgents = [
  {
    id: 1,
    name: "Agent 1",
    fullName: "Sarah Johnson",
    company: "Luxury Homes Realty",
    operatingSince: 2010,
    address: "1234 Main St, New York",
    phone: "(500) 555-1000",
    email: "agent1@luxuryhomes.com",
    image: "https://randomuser.me/api/portraits/women/1.jpg",
    rating: 3,
    propertiesSold: 10,
    specialization: "Luxury Homes",
    featured: true,
    verified: true,
    experience: 3,
    awards: 1,
    residentialProperties: [
      {
        id: 1,
        name: "Sample Residential 1",
        location: "Sample Location 1",
        propertyimage: require("../../assets/images/dummyImg.webp"),
        price: 99999,
        bhk: "1BHK",
      },
      {
        id: 2,
        name: "Sample Residential 2",
        location: "Sample Location 2",
        propertyimage: require("../../assets/images/dummyImg.webp"),
        price: 150000,
        bhk: "2BHK",
      },
    ],
    commercialProperties: [
      {
        id: 1,
        name: "Sample Commercial 1",
        location: "Sample Location 3",
        propertyimage: require("../../assets/images/dummyImg.webp"),
        price: 200000,
        bhk: "Office Space",
      },
      {
        id: 2,
        name: "Sample Commercial 2",
        location: "Sample Location 4",
        propertyimage: require("../../assets/images/dummyImg.webp"),
        price: 250000,
        bhk: "Shop",
      },
    ],
  },
  {
    id: 2,
    name: "Agent 2",
    fullName: "Michael Chen",
    company: "Urban Property Group",
    operatingSince: 2011,
    address: "1235 Broadway Ave, Los Angeles",
    phone: "(501) 555-1001",
    email: "agent2@urbanproperty.com",
    image: "https://randomuser.me/api/portraits/men/2.jpg",
    rating: 4,
    propertiesSold: 13,
    specialization: "Commercial",
    featured: false,
    verified: false,
    experience: 4,
    awards: 2,
    residentialProperties: [
      {
        id: 1,
        name: "Sample Residential 1",
        location: "Sample Location 1",
        propertyimage: require("../../assets/images/dummyImg.webp"),
        price: 99999,
        bhk: "1BHK",
      },
      {
        id: 2,
        name: "Sample Residential 2",
        location: "Sample Location 2",
        propertyimage: require("../../assets/images/dummyImg.webp"),
        price: 150000,
        bhk: "2BHK",
      },
    ],
    commercialProperties: [
      {
        id: 1,
        name: "Sample Commercial 1",
        location: "Sample Location 3",
        propertyimage: require("../../assets/images/dummyImg.webp"),
        price: 200000,
        bhk: "Office Space",
      },
      {
        id: 2,
        name: "Sample Commercial 2",
        location: "Sample Location 4",
        propertyimage: require("../../assets/images/dummyImg.webp"),
        price: 250000,
        bhk: "Shop",
      },
    ],
  },
  {
    id: 3,
    name: "Agent 3",
    fullName: "Emily Rodriguez",
    company: "Coastal Estates",
    operatingSince: 2012,
    address: "1236 Park Rd, Chicago",
    phone: "(502) 555-1002",
    email: "agent3@coastalestates.com",
    image: "https://randomuser.me/api/portraits/women/3.jpg",
    rating: 5,
    propertiesSold: 16,
    specialization: "Residential",
    featured: false,
    verified: false,
    experience: 5,
    awards: 3,
    residentialProperties: [
      {
        id: 1,
        name: "Sample Residential 1",
        location: "Sample Location 1",
        propertyimage: require("../../assets/images/dummyImg.webp"),
        price: 99999,
        bhk: "1BHK",
      },
      {
        id: 2,
        name: "Sample Residential 2",
        location: "Sample Location 2",
        propertyimage: require("../../assets/images/dummyImg.webp"),
        price: 150000,
        bhk: "2BHK",
      },
    ],
    commercialProperties: [
      {
        id: 1,
        name: "Sample Commercial 1",
        location: "Sample Location 3",
        propertyimage: require("../../assets/images/dummyImg.webp"),
        price: 200000,
        bhk: "Office Space",
      },
      {
        id: 2,
        name: "Sample Commercial 2",
        location: "Sample Location 4",
        propertyimage: require("../../assets/images/dummyImg.webp"),
        price: 250000,
        bhk: "Shop",
      },
    ],
  },
  {
    id: 4,
    name: "Agent 4",
    fullName: "David Kim",
    company: "Metropolitan Realtors",
    operatingSince: 2013,
    address: "1237 Ocean Blvd, Miami",
    phone: "(503) 555-1003",
    email: "agent4@metropolitan.com",
    image: "https://randomuser.me/api/portraits/men/4.jpg",
    rating: 3,
    propertiesSold: 19,
    specialization: "Vacation Rentals",
    featured: false,
    verified: true,
    experience: 6,
    awards: 4,
    residentialProperties: [
      {
        id: 1,
        name: "Sample Residential 1",
        location: "Sample Location 1",
        propertyimage: require("../../assets/images/dummyImg.webp"),
        price: 99999,
        bhk: "1BHK",
      },
      {
        id: 2,
        name: "Sample Residential 2",
        location: "Sample Location 2",
        propertyimage: require("../../assets/images/dummyImg.webp"),
        price: 150000,
        bhk: "2BHK",
      },
    ],
    commercialProperties: [
      {
        id: 1,
        name: "Sample Commercial 1",
        location: "Sample Location 3",
        propertyimage: require("../../assets/images/dummyImg.webp"),
        price: 200000,
        bhk: "Office Space",
      },
      {
        id: 2,
        name: "Sample Commercial 2",
        location: "Sample Location 4",
        propertyimage: require("../../assets/images/dummyImg.webp"),
        price: 250000,
        bhk: "Shop",
      },
    ],
  },
  {
    id: 5,
    name: "Agent 5",
    fullName: "Jessica Patel",
    company: "Premier Properties",
    operatingSince: 2014,
    address: "1238 Highland Dr, Seattle",
    phone: "(504) 555-1004",
    email: "agent5@premier.com",
    image: "https://randomuser.me/api/portraits/women/5.jpg",
    rating: 4,
    propertiesSold: 22,
    specialization: "New Developments",
    featured: false,
    verified: false,
    experience: 7,
    awards: 5,
    residentialProperties: [
      {
        id: 1,
        name: "Sample Residential 1",
        location: "Sample Location 1",
        propertyimage: require("../../assets/images/dummyImg.webp"),
        price: 99999,
        bhk: "1BHK",
      },
      {
        id: 2,
        name: "Sample Residential 2",
        location: "Sample Location 2",
        propertyimage: require("../../assets/images/dummyImg.webp"),
        price: 150000,
        bhk: "2BHK",
      },
    ],
    commercialProperties: [
      {
        id: 1,
        name: "Sample Commercial 1",
        location: "Sample Location 3",
        propertyimage: require("../../assets/images/dummyImg.webp"),
        price: 200000,
        bhk: "Office Space",
      },
      {
        id: 2,
        name: "Sample Commercial 2",
        location: "Sample Location 4",
        propertyimage: require("../../assets/images/dummyImg.webp"),
        price: 250000,
        bhk: "Shop",
      },
    ],
  },
];

export default function PreferredAgents() {
  const navigation = useNavigation();
  const scrollViewRef = useRef<ScrollView>(null);
  const scrollX = useRef(new Animated.Value(0)).current;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTab, setSelectedTab] = useState('residential');
  const modalAnimation = useRef(new Animated.Value(0)).current;

  // ----- Auto-scroll every 5 seconds -----
  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex = (currentIndex + 1) % featuredAgents.length;
      if (scrollViewRef.current) {
        scrollViewRef.current.scrollTo({
          x: nextIndex * (cardWidth + 16),
          animated: true,
        });
        setCurrentIndex(nextIndex);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [currentIndex]);

  const handleScroll = (event) => {
    const x = event.nativeEvent.contentOffset.x;
    const index = Math.round(x / (cardWidth + 16));
    if (index !== currentIndex) {
      setCurrentIndex(index);
    }
  };

  const handleContactPress = (agent) => {
    setSelectedAgent(agent);
    setSelectedTab('residential'); // Reset to default
    setModalVisible(true);
    Animated.timing(modalAnimation, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const closeModal = () => {
    Animated.timing(modalAnimation, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setModalVisible(false);
      setSelectedAgent(null);
      setSelectedTab('residential');
    });
  };

  const handleCall = (phone) => {
    Linking.openURL(`tel:${phone}`);
  };

  const handleEmail = (email) => {
    Linking.openURL(`mailto:${email}`);
  };

  const modalTranslateY = modalAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [500, 0],
  });
  const modalBackdropOpacity = modalAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.7],
  });

  // ----- Helper: Render Property Card -----
  const renderPropertyCard = (property) => {
    return (
      <View key={property.id} style={styles.propertyCard}>
        <Image
          source={property.propertyimage}
          style={styles.propertyImage}
          resizeMode="cover"
        />
        <View style={styles.propertyDetails}>
          <Text style={styles.propertyName}>{property.name}</Text>
          <Text style={styles.propertyLocation}>{property.location}</Text>
          <View style={styles.priceContainer}>
            <Text style={styles.priceText}>Rs {property.price}</Text>
            <Text style={styles.propertyBhk}>| {property.bhk}</Text>
          </View>
          <TouchableOpacity style={styles.viewPropertyButton}>
            <Text style={styles.viewPropertyButtonText}>View Details</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  // Determine which properties to display
  const properties =
    selectedAgent && selectedTab === 'residential'
      ? selectedAgent.residentialProperties
      : selectedAgent && selectedTab === 'commercial'
      ? selectedAgent.commercialProperties
      : [];

  return (
    <View style={styles.container}>
      {/* Header with title and See All button */}
      <View style={styles.header}>
        <Text style={styles.title}>Top Real Estate Agents</Text>
        <TouchableOpacity
          style={styles.seeAllButton}
          onPress={() => navigation.navigate("AgentsPage" as never)}
        >
          <Text style={styles.seeAllText}>See all</Text>
          <Feather name="chevron-right" size={16} color="#FF385C" />
        </TouchableOpacity>
      </View>

      {/* Horizontal ScrollView for agent cards */}
      <Animated.ScrollView
        ref={scrollViewRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        snapToInterval={cardWidth + 16}
        decelerationRate="fast"
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: true, listener: handleScroll }
        )}
        scrollEventThrottle={16}
      >
        {featuredAgents.map((agent, index) => {
          const inputRange = [
            (index - 1) * (cardWidth + 16),
            index * (cardWidth + 16),
            (index + 1) * (cardWidth + 16),
          ];
          const scale = scrollX.interpolate({
            inputRange,
            outputRange: [0.97, 1, 0.97],
            extrapolate: 'clamp',
          });
          const opacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.85, 1, 0.85],
            extrapolate: 'clamp',
          });
          return (
            <Animated.View
              key={agent.id}
              style={[styles.cardContainer, { transform: [{ scale }], opacity }]}
            >
              <View style={styles.card}>
                <View style={styles.cardHeader}>
                  <Image
                    source={{ uri: agent.image }}
                    style={styles.agentImage}
                    resizeMode="cover"
                  />
                  {agent.featured && (
                    <View style={styles.featuredBadge}>
                      <AntDesign name="star" size={12} color="#fff" />
                      <Text style={styles.featuredText}>Featured</Text>
                    </View>
                  )}
                  {agent.verified && (
                    <View style={styles.verifiedBadge}>
                      <Ionicons name="checkmark-circle" size={14} color="#fff" />
                      <Text style={styles.verifiedText}>Verified</Text>
                    </View>
                  )}
                </View>
                <View style={styles.cardBody}>
                  <View style={styles.cardBodyTop}>
                    <View>
                      <Text style={styles.agentName}>{agent.fullName}</Text>
                      <View style={styles.companyContainer}>
                        <MaterialIcons name="business" size={14} color="#666" />
                        <Text style={styles.companyText}>{agent.company}</Text>
                      </View>
                    </View>
                    <View style={styles.ratingContainer}>
                      {Array(5)
                        .fill(0)
                        .map((_, i) => (
                          <AntDesign
                            key={i}
                            name={i < Math.floor(agent.rating) ? "star" : "staro"}
                            size={14}
                            color="#FFD700"
                            style={{ marginRight: 2 }}
                          />
                        ))}
                      <Text style={styles.ratingText}>
                        ({agent.rating.toFixed(1)})
                      </Text>
                    </View>
                  </View>
                  <View style={styles.statsContainer}>
                    <View style={styles.statItem}>
                      <Text style={styles.statValue}>{agent.propertiesSold}</Text>
                      <Text style={styles.statLabel}>Sold</Text>
                    </View>
                    <View style={styles.statItem}>
                      <Text style={styles.statValue}>{agent.experience}</Text>
                      <Text style={styles.statLabel}>Years</Text>
                    </View>
                    <View style={styles.statItem}>
                      <Text style={styles.statValue}>{agent.awards}</Text>
                      <Text style={styles.statLabel}>Awards</Text>
                    </View>
                  </View>
                  <View style={styles.infoSection}>
                    <View style={styles.infoRow}>
                      <Feather name="calendar" size={14} color="#666" />
                      <Text style={styles.infoText}>
                        Operating since {agent.operatingSince}
                      </Text>
                    </View>
                    <View style={styles.infoRow}>
                      <Feather name="map-pin" size={14} color="#666" />
                      <Text style={styles.infoText} numberOfLines={1}>
                        {agent.address}
                      </Text>
                    </View>
                  </View>
                  <TouchableOpacity
                    style={styles.contactButton}
                    onPress={() => handleContactPress(agent)}
                    activeOpacity={1}
                  >
                    <Text style={styles.contactButtonText}>Contact Now</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Animated.View>
          );
        })}
      </Animated.ScrollView>

      {/* Pagination Dots */}
      <View style={styles.pagination}>
        {featuredAgents.map((_, index) => (
          <View
            key={index}
            style={[
              styles.paginationDot,
              index === currentIndex && styles.paginationDotActive,
            ]}
          />
        ))}
      </View>

      {/* Modal Overlay */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="none"
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          <Animated.View
            style={[styles.modalBackdrop, { opacity: modalBackdropOpacity }]}
          >
            <TouchableOpacity style={{ flex: 1 }} onPress={closeModal} />
          </Animated.View>
          {selectedAgent && (
            <Animated.View
              style={[styles.modalContent, { transform: [{ translateY: modalTranslateY }] }]}
            >
              <View style={styles.modalHeader}>
                <View style={styles.modalHeaderLine} />
                <Text style={styles.modalTitle}>Contact Agent</Text>
                <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
                  <Feather name="x" size={24} color="#333" />
                </TouchableOpacity>
              </View>
              <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
                {/* Agent Info */}
                <View style={styles.modalAgentInfo}>
                  <Image
                    source={{ uri: selectedAgent.image }}
                    style={styles.modalAgentImage}
                  />
                  <View style={styles.modalAgentDetails}>
                    <Text style={styles.modalAgentName}>{selectedAgent.fullName}</Text>
                    <Text style={styles.modalAgentCompany}>{selectedAgent.company}</Text>
                    <View style={styles.modalAgentRating}>
                      {Array(5)
                        .fill(0)
                        .map((_, i) => (
                          <AntDesign
                            key={i}
                            name={i < Math.floor(selectedAgent.rating) ? "star" : "staro"}
                            size={14}
                            color="#FFD700"
                            style={{ marginRight: 2 }}
                          />
                        ))}
                    </View>
                  </View>
                </View>

                {/* Agent Stats */}
                <View style={styles.agentStatsRow}>
                  <View style={styles.agentStatBox}>
                    <Text style={styles.agentStatValue}>{selectedAgent.propertiesSold}</Text>
                    <Text style={styles.agentStatLabel}>Properties Sold</Text>
                  </View>
                  <View style={styles.agentStatBox}>
                    <Text style={styles.agentStatValue}>{selectedAgent.experience}</Text>
                    <Text style={styles.agentStatLabel}>Years Experience</Text>
                  </View>
                  <View style={styles.agentStatBox}>
                    <Text style={styles.agentStatValue}>{selectedAgent.awards}</Text>
                    <Text style={styles.agentStatLabel}>Awards</Text>
                  </View>
                </View>

                {/* About Agent */}
                <View style={styles.modalSection}>
                  <Text style={styles.modalSectionTitle}>About Agent</Text>
                  <Text style={styles.aboutText}>
                    {selectedAgent.fullName} is a professional real estate agent specializing in {selectedAgent.specialization}.
                  </Text>
                </View>

                {/* Tabs for Properties */}
                <View style={styles.tabContainer}>
                  <TouchableOpacity
                    style={[styles.tabButton, selectedTab === 'residential' && styles.activeTabButton]}
                    onPress={() => setSelectedTab('residential')}
                  >
                    <Text style={[styles.tabButtonText, selectedTab === 'residential' && styles.activeTabButtonText]}>
                      Residential
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.tabButton, selectedTab === 'commercial' && styles.activeTabButton]}
                    onPress={() => setSelectedTab('commercial')}
                  >
                    <Text style={[styles.tabButtonText, selectedTab === 'commercial' && styles.activeTabButtonText]}>
                      Commercial
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* Horizontal ScrollView for Property Cards */}
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.propertiesScroll}
                >
                  {properties.map((property) => renderPropertyCard(property))}
                </ScrollView>

                {/* Schedule Meeting Button */}
                <TouchableOpacity style={styles.scheduleButton} activeOpacity={0.8}>
                  <LinearGradient colors={["#FF385C", "#E31B54"]} style={styles.scheduleButtonGradient}>
                    <Text style={styles.scheduleButtonText}>Schedule Meeting</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </ScrollView>
            </Animated.View>
          )}
        </View>
      </Modal>
    </View>
  );
}

const { width } = Dimensions.get('window');
const cardWidth = width * 0.75;

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FF385C',
    marginRight: 4,
  },
  scrollContent: {
    paddingLeft: 16,
    paddingRight: 8,
  },
  cardContainer: {
    marginRight: 16,
  },
  card: {
    width: cardWidth,
    backgroundColor: '#fff',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    overflow: 'hidden',
  },
  cardHeader: {
    position: 'relative',
  },
  agentImage: {
    width: '100%',
    height: 160,
  },
  featuredBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFD700',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  featuredText: {
    fontSize: 10,
    color: '#fff',
    marginLeft: 4,
  },
  verifiedBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(76, 175, 80, 0.9)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  verifiedText: {
    fontSize: 10,
    color: '#fff',
    marginLeft: 4,
  },
  cardBody: {
    padding: 16,
  },
  cardBodyTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  agentName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  companyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  companyText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 6,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
    padding: 10,
    marginBottom: 12,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
  infoSection: {
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  infoText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  contactButton: {
    backgroundColor: '#232761',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  contactButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ddd',
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: '#232761',
    width: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#000',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 16,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  modalHeaderLine: {
    width: 40,
    height: 4,
    backgroundColor: '#ccc',
    borderRadius: 2,
    position: 'absolute',
    top: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    position: 'absolute',
    right: 16,
  },
  modalBody: {
    paddingHorizontal: 16,
  },
  modalAgentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalAgentImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  modalAgentDetails: {
    marginLeft: 12,
  },
  modalAgentName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  modalAgentCompany: {
    fontSize: 14,
    color: '#666',
  },
  modalAgentRating: {
    flexDirection: 'row',
    marginTop: 4,
  },
  agentStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  agentStatBox: {
    alignItems: 'center',
  },
  agentStatValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  agentStatLabel: {
    fontSize: 12,
    color: '#666',
  },
  modalSection: {
    marginBottom: 16,
  },
  modalSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  aboutText: {
    fontSize: 14,
    color: '#666',
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
    alignItems: 'center',
  },
  activeTabButton: {
    borderBottomColor: '#FF385C',
  },
  tabButtonText: {
    fontSize: 14,
    color: '#666',
  },
  activeTabButtonText: {
    color: '#FF385C',
    fontWeight: 'bold',
  },
  propertiesScroll: {
    paddingVertical: 10,
  },
  propertyCard: {
    width: width * 0.6,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginRight: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  propertyImage: {
    width: '100%',
    height: 100,
  },
  propertyDetails: {
    padding: 10,
  },
  propertyName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  propertyLocation: {
    fontSize: 12,
    color: '#666',
    marginVertical: 4,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priceText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FF385C',
  },
  propertyBhk: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  viewPropertyButton: {
    marginTop: 8,
    backgroundColor: '#232761',
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
  viewPropertyButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  scheduleButton: {
    marginTop: 16,
  },
  scheduleButtonGradient: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  scheduleButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
