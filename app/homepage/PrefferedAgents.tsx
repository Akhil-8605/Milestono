import React, { useState, useRef, useEffect } from "react";
import * as Location from "expo-location";
import axios from "axios";
import { BASE_URL } from "@env";
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  Image,
  TouchableOpacity,
  Modal,
  Animated,
  Dimensions,
  StatusBar,
  Platform,
  Linking,
  ScrollView,
} from "react-native";
import {
  Feather,
  MaterialIcons,
  AntDesign,
  Ionicons,
} from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "expo-router";

const agents = [
  {
    id: 1,
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
    project: [
      {
        id: "proj-1",
        name: "Green Valley",
        location: "Bangalore",
        status: "Under Construction",
        image: require("../../assets/images/newproject2.png"),
        description:
          "Eco-friendly residential complex with sustainable features and green spaces throughout the property.",
        price: "₹ 85L - 1.5Cr",
        possession: "December 2025",
        rating: 4.5,
      },
      {
        id: "proj-2",
        name: "Riverside Residences",
        location: "Pune",
        status: "Under Construction",
        image: require("../../assets/images/newproject4.png"),
        description:
          "Elegant apartments along the riverside with beautiful views and tranquil environment.",
        price: "₹ 65L - 1.1Cr",
        possession: "June 2025",
        rating: 4.6,
      },
    ],
  },
  {
    id: 2,
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
    project: [
      {
        id: "proj-3",
        name: "Serene Meadows",
        location: "Chennai",
        status: "Under Construction",
        image: require("../../assets/images/newproject2.png"),
        description:
          "Peaceful residential community surrounded by nature yet close to urban amenities.",
        price: "₹ 60L - 95L",
        possession: "March 2026",
        rating: 4.4,
      },
      {
        id: "proj-4",
        name: "Industrial Park",
        location: "Pune",
        status: "Under Construction",
        image: require("../../assets/images/newproject1.png"),
        description:
          "Industrial spaces with robust infrastructure for manufacturing and warehousing.",
        price: "₹ 1Cr - 2.2Cr",
        possession: "December 2025",
        rating: 4.5,
      },
    ],
  },
  {
    id: 3,
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
    project: [
      {
        id: "proj-5",
        name: "Retail Plaza",
        location: "Delhi",
        status: "Under Construction",
        image: require("../../assets/images/newproject3.png"),
        description:
          "Prime retail spaces in high-footfall area with excellent visibility and accessibility.",
        price: "₹ 1.2Cr - 2.5Cr",
        possession: "September 2025",
        rating: 4.6,
      },
      {
        id: "proj-6",
        name: "Green Valley",
        location: "Bangalore",
        status: "Under Construction",
        image: require("../../assets/images/newproject2.png"),
        description:
          "Eco-friendly residential complex with sustainable features and green spaces throughout the property.",
        price: "₹ 85L - 1.5Cr",
        possession: "December 2025",
        rating: 4.5,
      },
    ],
  },
  {
    id: 4,
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
    project: [
      {
        id: "proj-7",
        name: "Riverside Residences",
        location: "Pune",
        status: "Under Construction",
        image: require("../../assets/images/newproject4.png"),
        description:
          "Elegant apartments along the riverside with beautiful views and tranquil environment.",
        price: "₹ 65L - 1.1Cr",
        possession: "June 2025",
        rating: 4.6,
      },
      {
        id: "proj-8",
        name: "Serene Meadows",
        location: "Chennai",
        status: "Under Construction",
        image: require("../../assets/images/newproject2.png"),
        description:
          "Peaceful residential community surrounded by nature yet close to urban amenities.",
        price: "₹ 60L - 95L",
        possession: "March 2026",
        rating: 4.4,
      },
    ],
  },
  {
    id: 5,
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
    project: [
      {
        id: "proj-9",
        name: "Retail Plaza",
        location: "Delhi",
        status: "Under Construction",
        image: require("../../assets/images/newproject3.png"),
        description:
          "Prime retail spaces in high-footfall area with excellent visibility and accessibility.",
        price: "₹ 1.2Cr - 2.5Cr",
        possession: "September 2025",
        rating: 4.6,
      },
      {
        id: "proj-10",
        name: "Industrial Park",
        location: "Pune",
        status: "Under Construction",
        image: require("../../assets/images/newproject1.png"),
        description:
          "Industrial spaces with robust infrastructure for manufacturing and warehousing.",
        price: "₹ 1Cr - 2.2Cr",
        possession: "December 2025",
        rating: 4.5,
      },
    ],
  },
];

export default function AgentsSection() {
  const [selectedAgent, setSelectedAgent] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [projectModalVisible, setProjectModalVisible] = useState(false);
  const [inquiryModalVisible, setInquiryModalVisible] = useState(false);
  const [selectedProjectForModal, setSelectedProjectForModal] =
    useState<any>(null);
  const [selectedTab, setSelectedTab] = useState("residential");
  const [activeIndex, setActiveIndex] = useState(0);

  const scrollViewRef = useRef<ScrollView>(null);
  const modalAnimation = useRef(new Animated.Value(0)).current;
  const { width } = Dimensions.get("window");
  const cardWidth = width * 0.85;
  const [agents, setAgents] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (scrollViewRef.current) {
        const nextIndex = (activeIndex + 1) % agents.slice(0, 5).length;
        scrollViewRef.current.scrollTo({
          x: nextIndex * (cardWidth + 20),
          animated: true,
        });
        setActiveIndex(nextIndex);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [activeIndex, cardWidth]);

  const handleScroll = (event: any) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / (cardWidth + 20));
    if (index !== activeIndex) {
      setActiveIndex(index);
    }
  };

  const handleContactPress = (agent: any) => {
    setSelectedAgent(agent);
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
      setSelectedTab("residential");
    });
  };

  const handleCall = (phone: string) => {
    Linking.openURL(`tel:${phone}`);
  };

  const handleEmail = (email: string) => {
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
  const statusBarHeight = StatusBar.currentHeight || 0;

  const handleAgents = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.warn("Permission to access location was denied");
        fetchAgents(18.52097398044019, 73.86017831259551);
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
      fetchAgents(latitude, longitude);
    } catch (error) {
      console.error("Error fetching location or agents:", error);
      fetchAgents(18.52097398044019, 73.86017831259551);
    }
  };

  const fetchAgents = async (latitude: number, longitude: number): Promise<void> => {
    try {
      const response = await axios.post(`${BASE_URL}/api/verified-agents-by-city`, {
        latitude,
        longitude,
      });
      setAgents(response.data);
    } catch (err) {
      console.error("Error fetching agents:", err);
      setAgents([]);
    }
  };

  useEffect(() => {
    handleAgents();
  }, []);

  const renderAgentCard = (agent: any) => {
    const fullName = `${agent.firstName} ${agent.lastName}`;
    const branding = agent.branding;
    const isVerified = branding === "trusted" || branding === "custom";
    const showFeatured =
      branding === "custom" && !agent.logo;
  
    const profileUri = agent.profile || "https://yourcdn.com/placeholder.png";
    const logoUri = agent.logo || "https://yourcdn.com/placeholder.png";
  
    return (
      <View key={agent._id} style={styles.cardContainer}>
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Image
              source={{ uri: profileUri }}
              style={styles.agentImage}
              resizeMode="cover"
            />
  
            {branding === "custom" && agent.logo ? (
              <Image
                source={{ uri: logoUri }}
                style={styles.agentLogo}
                resizeMode="contain"
              />
            ) : showFeatured ? (
              <View style={styles.featuredBadge}>
                <AntDesign name="star" size={12} color="#fff" />
                <Text style={styles.featuredText}>{agent.agency}</Text>
              </View>
            ) : null}
  
            {isVerified && (
              <View style={styles.verifiedBadge}>
                <Ionicons name="checkmark-circle" size={14} color="#fff" />
                <Text style={styles.verifiedText}>Verified</Text>
              </View>
            )}
          </View>
  
          <View style={styles.cardBody}>
            <View style={styles.cardBodyTop}>
              <View>
                <Text style={styles.agentName}>{fullName}</Text>
                <View style={styles.companyContainer}>
                  <MaterialIcons name="business" size={14} color="#666" />
                  <Text style={styles.companyText}>{agent.agency}</Text>
                </View>
              </View>
              <View style={styles.ratingContainer}>
                {Array(5)
                  .fill(0)
                  .map((_, i) => (
                    <AntDesign
                      key={i}
                      name={i < Math.floor(agent.rating) ? "star" : "staro"}
                      size={12}
                      color="#FFD700"
                      style={{ marginRight: 2 }}
                    />
                  ))}
                <Text style={styles.ratingTextAgent}>{agent.rating}</Text>
              </View>
            </View>
  
            <View style={styles.statsContainer}>
              <View style={styles.agentStatBox}>
                <Text style={styles.agentStatValue}>13</Text>
                <Text style={styles.agentStatLabel}>Properties</Text>
              </View>
              <View style={styles.agentStatBox}>
                <Text style={styles.agentStatValue}>{agent.yearsOfExperience}</Text>
                <Text style={styles.agentStatLabel}>Years Experience</Text>
              </View>
              <View style={styles.agentStatBox}>
                <Text style={styles.agentStatValue}>3</Text>
                <Text style={styles.agentStatLabel}>Projects</Text>
              </View>
            </View>
  
            <View style={styles.infoSection}>
              <View style={styles.infoRow}>
                <Feather name="calendar" size={14} color="#666" />
                <Text style={styles.infoText}>
                  Operating since: {new Date(agent.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
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
            >
              <Text style={styles.contactButtonText}>Contact Now</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };
  
  const navigation = useNavigation();

  return (
    <SafeAreaView style={[styles.container, { marginTop: statusBarHeight }]}>
      <Text style={styles.sectionTitle}>Milestono Preffered Agents</Text>
      <Text style={styles.sectionSubtitle}>Connect with our top-rated real estate professionals</Text>

      <ScrollView
        ref={scrollViewRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.horizontalScroll}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        pagingEnabled
        snapToInterval={cardWidth + 20}
        decelerationRate="fast"
      >
        {agents.slice(0, 5).map((agent) => renderAgentCard(agent))}
      </ScrollView>
      
      {/* Carousel Dots */}
      <View style={styles.paginationContainer}>
        {agents.slice(0, 5).map((_, index) => (
          <View
            key={index}
            style={[
              styles.paginationDot,
              index === activeIndex && styles.paginationDotActive,
            ]}
          />
        ))}
      </View>
      
      <TouchableOpacity
        onPress={() => navigation.navigate("AgentsPage" as never)}
      >
        <Text style={styles.seeMoreButtonText}>See More</Text>
      </TouchableOpacity>
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
              style={[
                styles.modalContent,
                { transform: [{ translateY: modalTranslateY }] },
              ]}
            >
              <View style={styles.modalHeader}>
                <View style={styles.modalHeaderLine} />
                <Text style={styles.modalTitle}>Contact Agent</Text>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={closeModal}
                >
                  <Feather name="x" size={24} color="#333" />
                </TouchableOpacity>
              </View>
              <ScrollView
                style={styles.modalBody}
                showsVerticalScrollIndicator={false}
              >
                <View style={styles.modalAgentInfo}>
                  <Image
                    source={{ uri: selectedAgent.profile }}
                    style={styles.modalAgentImage}
                  />
                  <View style={styles.modalAgentDetails}>
                    <Text style={styles.modalAgentName}>
                      {selectedAgent.firstName + " " + selectedAgent.lastName}
                    </Text>
                    <Text style={styles.modalAgentCompany}>
                      {selectedAgent.agency}
                    </Text>
                    <View style={styles.modalAgentRating}>
                      {Array(5)
                        .fill(0)
                        .map((_, i) => (
                          <AntDesign
                            key={i}
                            name={
                              i < Math.floor(4)
                                ? "star"
                                : "staro"
                            }
                            size={14}
                            color="#FFD700"
                            style={{ marginRight: 2 }}
                          />
                        ))}
                      <Text style={styles.modalRatingText}>
                        ({4})
                      </Text>
                    </View>
                  </View>
                </View>
                <View style={styles.statsContainer}>
                  <View style={styles.agentStatBox}>
                    <Text style={styles.agentStatValue}>
                      {4}
                    </Text>
                    <Text style={styles.agentStatLabel}>Properties Sold</Text>
                  </View>
                  <View style={styles.agentStatBox}>
                    <Text style={styles.agentStatValue}>
                    {selectedAgent.yearsOfExperience}
                    </Text>
                    <Text style={styles.agentStatLabel}>Years Experience</Text>
                  </View>
                  <View style={styles.agentStatBox}>
                    <Text style={styles.agentStatValue}>
                      {3}
                    </Text>
                    <Text style={styles.agentStatLabel}>Projects</Text>
                  </View>
                </View>
                <View style={styles.modalSection}>
                  <Text style={styles.modalSectionTitle}>About Agent</Text>
                  <Text style={styles.aboutText}>
                  {selectedAgent.firstName + " " + selectedAgent.lastName} is a professional real estate agent
                  with {selectedAgent.yearsOfExperience} years of experience,
                  specializing in {selectedAgent.projects} new projects. With a proven
                  track record of {selectedAgent.properties} properties
                  , they are a trusted advisor in the real estate market.
                  </Text>
                </View>
                <View style={styles.modalSection}>
                  <Text style={styles.modalSectionTitle}>Properties</Text>
                  <View style={styles.tabContainer}>
                    <TouchableOpacity
                      style={[
                        styles.tabButton,
                        selectedTab === "residential" && styles.activeTabButton,
                      ]}
                      onPress={() => setSelectedTab("residential")}
                    >
                      <Text
                        style={[
                          styles.tabButtonText,
                          selectedTab === "residential" &&
                            styles.activeTabButtonText,
                        ]}
                      >
                        Residential
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.tabButton,
                        selectedTab === "commercial" && styles.activeTabButton,
                      ]}
                      onPress={() => setSelectedTab("commercial")}
                    >
                      <Text
                        style={[
                          styles.tabButtonText,
                          selectedTab === "commercial" &&
                            styles.activeTabButtonText,
                        ]}
                      >
                        Commercial
                      </Text>
                    </TouchableOpacity>
                  </View>
                  {selectedTab === "residential" ? (
                    <ScrollView
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      contentContainerStyle={styles.scrollContainer}
                    >
                      {(selectedAgent.residentialProperties || []).map(
                        (property: any) => (
                          <View key={property.id} style={styles.propertyCard}>
                            <Image
                              source={property.propertyimage}
                              style={styles.propertyImage}
                              resizeMode="contain"
                            />
                            <View style={styles.cardContent}>
                              <Text style={styles.propertyName}>
                                {property.name}
                              </Text>
                              <Text style={styles.locationText}>
                                Location: {property.location}
                              </Text>
                              <View style={styles.priceContainer}>
                                <Text style={styles.priceText}>
                                  Rs {property.price}
                                </Text>
                                <Text style={styles.typeText}>
                                  | {property.bhk}
                                </Text>
                              </View>
                              <View style={styles.buttonContainer}>
                                <TouchableOpacity style={styles.saveButton}>
                                  <Text style={styles.saveButtonText}>
                                    Save Property
                                  </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                  style={styles.viewButtonAgent}
                                  onPress={() => console.log("View Details")}
                                >
                                  <Text style={styles.viewButtonTextAgent}>
                                    View Details
                                  </Text>
                                </TouchableOpacity>
                              </View>
                            </View>
                          </View>
                        )
                      )}
                    </ScrollView>
                  ) : (
                    <ScrollView
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      contentContainerStyle={styles.scrollContainer}
                    >
                      {(selectedAgent.commercialProperties || []).map(
                        (property: any) => (
                          <View key={property.id} style={styles.propertyCard}>
                            <Image
                              source={property.propertyimage}
                              style={styles.propertyImage}
                              resizeMode="contain"
                            />
                            <View style={styles.cardContent}>
                              <Text style={styles.propertyName}>
                                {property.name}
                              </Text>
                              <Text style={styles.locationText}>
                                Location: {property.location}
                              </Text>
                              <View style={styles.priceContainer}>
                                <Text style={styles.priceText}>
                                  Rs {property.price}
                                </Text>
                                <Text style={styles.typeText}>
                                  | {property.bhk}
                                </Text>
                              </View>
                              <View style={styles.buttonContainer}>
                                <TouchableOpacity style={styles.saveButton}>
                                  <Text style={styles.saveButtonText}>
                                    Save Property
                                  </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                  style={styles.viewButtonAgent}
                                  onPress={() => console.log("View Details")}
                                >
                                  <Text style={styles.viewButtonTextAgent}>
                                    View Details
                                  </Text>
                                </TouchableOpacity>
                              </View>
                            </View>
                          </View>
                        )
                      )}
                    </ScrollView>
                  )}
                </View>
                <View style={styles.modalSection}>
                  <Text style={styles.modalSectionTitle}>New Projects</Text>
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContainer}
                  >
                    {(selectedAgent.project || []).map((proj: any) => (
                      <View key={proj.id} style={styles.projectCard}>
                        <View style={styles.projectImageContainer}>
                          <Image
                            source={proj.image}
                            style={styles.projectImage}
                          />
                          <LinearGradient
                            colors={["rgba(0,0,0,0)", "transparent"]}
                            style={styles.imageGradient}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 0, y: 0.6 }}
                          />
                          {proj.status && (
                            <View style={styles.projectBadge}>
                              <Text style={styles.projectBadgeText}>
                                {proj.status}
                              </Text>
                            </View>
                          )}
                          {proj.rating && (
                            <View style={styles.ratingBadge}>
                              <Text style={styles.ratingText}>
                                ★ {proj.rating}
                              </Text>
                            </View>
                          )}
                        </View>
                        <View style={styles.projectInfo}>
                          <Text style={styles.projectTitle}>{proj.name}</Text>
                          <View style={styles.locationContainer}>
                            <Text style={styles.projectLocation}>
                              📍 {proj.location}
                            </Text>
                            {proj.price && (
                              <Text style={styles.projectPrice}>
                                {proj.price}
                              </Text>
                            )}
                          </View>
                          {proj.possession && (
                            <Text style={styles.projectPossession}>
                              🗓️ Possession: {proj.possession}
                            </Text>
                          )}
                          <View style={styles.projectButtons}>
                            <TouchableOpacity
                              style={styles.viewButton}
                              onPress={() => {
                                setSelectedProjectForModal(proj);
                                setProjectModalVisible(true);
                              }}
                            >
                              <Text style={styles.buttonText}>
                                View Details
                              </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                              style={styles.inquiryButton}
                              onPress={() => {
                                setInquiryModalVisible(true);
                              }}
                            >
                              <Text style={styles.buttonText}>Inquiry</Text>
                            </TouchableOpacity>
                          </View>
                        </View>
                      </View>
                    ))}
                  </ScrollView>
                </View>
                <View style={styles.modalSection}>
                  <Text style={styles.modalSectionTitle}>
                    Contact Information
                  </Text>
                  <View style={styles.contactOptions}>
                    <TouchableOpacity
                      style={styles.contactOption}
                      onPress={() => handleCall(selectedAgent.phone)}
                    >
                      <LinearGradient
                        colors={["#4CAF50", "#2E7D32"]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.contactOptionIcon}
                      >
                        <Feather name="phone" size={18} color="#fff" />
                      </LinearGradient>
                      <View style={styles.contactOptionDetails}>
                        <Text style={styles.contactOptionLabel}>Phone</Text>
                        <Text style={styles.contactOptionValue}>
                          {selectedAgent.phone}
                        </Text>
                      </View>
                      <View style={styles.contactOptionAction}>
                        <Text style={styles.contactOptionActionText}>Call</Text>
                        <Feather name="chevron-right" size={14} color="#666" />
                      </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.contactOption}
                      onPress={() => handleEmail(selectedAgent.email)}
                    >
                      <LinearGradient
                        colors={["#2196F3", "#0D47A1"]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.contactOptionIcon}
                      >
                        <Feather name="mail" size={20} color="#fff" />
                      </LinearGradient>
                      <View style={styles.contactOptionDetails}>
                        <Text style={styles.contactOptionLabel}>Email</Text>
                        <Text style={styles.contactOptionValue}>
                          {selectedAgent.email}
                        </Text>
                      </View>
                      <View style={styles.contactOptionAction}>
                        <Text style={styles.contactOptionActionText}>
                          Email
                        </Text>
                        <Feather name="chevron-right" size={14} color="#666" />
                      </View>
                    </TouchableOpacity>
                    <View style={styles.contactOption}>
                      <LinearGradient
                        colors={["#FF9800", "#E65100"]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.contactOptionIcon}
                      >
                        <Feather name="map-pin" size={20} color="#fff" />
                      </LinearGradient>
                      <View style={styles.contactOptionDetails}>
                        <Text style={styles.contactOptionLabel}>
                          Office Address
                        </Text>
                        <Text style={styles.contactOptionValue}>
                          {selectedAgent.address}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
                <TouchableOpacity style={styles.scheduleButton}>
                  <LinearGradient
                    colors={["#232761", "#232761"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.scheduleButtonGradient}
                  >
                    <Text style={styles.scheduleButtonText}>Contact Now</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </ScrollView>
            </Animated.View>
          )}
        </View>
      </Modal>
      <Modal
        visible={projectModalVisible}
        animationType="fade"
        transparent
        onRequestClose={() => setProjectModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.projectModalContainer}>
            {selectedProjectForModal && (
              <>
                <TouchableOpacity
                  style={styles.modalCloseButton}
                  onPress={() => setProjectModalVisible(false)}
                >
                  <Feather name="x" size={24} color="#FFF" />
                </TouchableOpacity>
                <Image
                  source={selectedProjectForModal.image}
                  style={styles.modalProjectImage}
                />
                <ScrollView style={styles.modalScrollView}>
                  <Text style={styles.modalTitle}>
                    {selectedProjectForModal.name}
                  </Text>
                  <View style={styles.modalInfoRow}>
                    <Text style={styles.modalLocation}>
                      📍 {selectedProjectForModal.location}
                    </Text>
                    {selectedProjectForModal.rating && (
                      <Text style={styles.modalRating}>
                        ★ {selectedProjectForModal.rating}
                      </Text>
                    )}
                  </View>
                  <Text style={styles.modalStatus}>
                    {selectedProjectForModal.status}
                  </Text>
                  {selectedProjectForModal.price && (
                    <View style={styles.priceContainerModal}>
                      <Text style={styles.priceLabel}>Price Range:</Text>
                      <Text style={styles.priceValue}>
                        {selectedProjectForModal.price}
                      </Text>
                    </View>
                  )}
                  {selectedProjectForModal.possession && (
                    <View style={styles.possessionContainerModal}>
                      <Text style={styles.possessionLabel}>Possession:</Text>
                      <Text style={styles.possessionValue}>
                        {selectedProjectForModal.possession}
                      </Text>
                    </View>
                  )}
                  <Text style={styles.modalDescription}>
                    {selectedProjectForModal.description}
                  </Text>
                </ScrollView>
                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    style={styles.modalButton}
                    onPress={() => setProjectModalVisible(false)}
                  >
                    <Text style={styles.modalButtonCloseText}>Close</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.modalInquiryButton]}
                    onPress={() => {
                      setInquiryModalVisible(true);
                      setProjectModalVisible(false);
                    }}
                  >
                    <Text style={styles.modalButtonText}>Inquiry</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
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
              <Feather name="x" size={30} color={"#232761"} />
            </TouchableOpacity>
            <Text style={styles.inquiryModalTitle}>
              You are requesting to view advertiser details
            </Text>
            <View style={styles.inquiryModalDetails}>
              <Text style={styles.inquiryModalLabel}>POSTED BY AGENT:</Text>
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

const { width } = Dimensions.get("window");
const cardWidth = width * 0.75;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    paddingLeft: 10
  },
  sectionTitle: {
    fontSize: 25,
    fontWeight: "700",
    marginBottom: 0,
    color: "#333333",
  },
  sectionSubtitle: {
    fontSize: 12,
    color: "#666",
    fontWeight: '500',
    marginBottom: 20,
  },
  stickyHeader: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    paddingTop: Platform.OS === "ios" ? 50 : 20,
    paddingBottom: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    zIndex: 1000,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  listContainer: {
    paddingTop: Platform.OS === "ios" ? 110 : 90,
    paddingBottom: 80,
  },
  searchContainer: {
    padding: 20,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 50,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  filterContainer: {
    marginTop: 15,
    flexDirection: "row",
    alignItems: "center",
  },
  filterLabel: {
    fontSize: 14,
    color: "#666",
    marginRight: 10,
  },
  filterOptions: {
    flexDirection: "row",
  },
  filterOption: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: "#f2f2f2",
  },
  filterOptionActive: {
    backgroundColor: "#232761",
  },
  filterOptionText: {
    fontSize: 14,
    color: "#666",
  },
  filterOptionTextActive: {
    color: "#fff",
  },
  resultsInfo: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  resultsText: {
    fontSize: 14,
    color: "#666",
  },
  horizontalScroll: {
    paddingRight: 10,
    marginBottom: 50
  },
  seeMoreButtonText: {
    fontSize: 16,
    color: "#4A4A9C",
    fontWeight: "500",
    marginTop: 16,
    textAlign: "right",
    marginRight: 10
  },
  cardContainer: {
    width: cardWidth,
    marginRight: 20,
    marginVertical: 10,
    borderRadius: 16,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  card: {
    borderRadius: 16,
    overflow: "hidden",
  },
  cardHeader: {
    position: "relative",
  },
  agentImage: {
    width: "100%",
    height: 175,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  featuredBadge: {
    position: "absolute",
    top: 10,
    left: 10,
    backgroundColor: "rgba(255, 193, 7, 0.9)",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    flexDirection: "row",
    alignItems: "center",
  },
  featuredText: {
    color: "#fff",
    fontWeight: "bold",
    marginLeft: 4,
    fontSize: 10,
  },
  verifiedBadge: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "rgba(76, 175, 80, 0.9)",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    flexDirection: "row",
    alignItems: "center",
  },
  verifiedText: {
    color: "#fff",
    fontWeight: "bold",
    marginLeft: 4,
    fontSize: 10,
  },
  cardBody: {
    padding: 15,
  },
  cardBodyTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  agentName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  companyContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  companyText: {
    fontSize: 12,
    color: "#666",
    marginLeft: 6,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingTextAgent: {
    fontSize: 12,
    color: "#666",
    marginLeft: 4,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#f8f9fa",
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
  },
  agentLogo: {
    position: 'absolute',
    top: 10,
    left: 10,
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    minWidth: 50,
    maxWidth: 50,
    minHeight: 35,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    backgroundColor: 'rgba(255, 255, 255, 0.1)', 
  },
  
  agentStatBox: {
    alignItems: "center",
  },
  agentStatValue: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
  },
  agentStatLabel: {
    fontSize: 10,
    color: "#666",
  },
  infoSection: {
    marginBottom: 15,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  infoText: {
    fontSize: 12,
    color: "#666",
    marginLeft: 8,
  },
  contactButton: {
    backgroundColor: "#1a1e4d",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  contactButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
  stickyFooter: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  paginationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f2f2f2",
    alignItems: "center",
    justifyContent: "center",
  },
  paginationButtonDisabled: {
    backgroundColor: "#f8f8f8",
  },
  paginationInfo: {
    alignItems: "center",
  },
  paginationText: {
    fontSize: 14,
    color: "#666",
  },
  // Carousel dots styles
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 10,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#ccc",
    marginHorizontal: 4,
  },
  paginationDotActive: {
    width: 20,
    height: 8,
    backgroundColor: "#232761",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
  },
  modalBackdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#000",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 16,
    paddingBottom: Platform.OS === "ios" ? 40 : 24,
    maxHeight: "85%",
  },
  modalHeader: {
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    position: "relative",
  },
  modalHeaderLine: {
    width: 40,
    height: 4,
    backgroundColor: "#ddd",
    borderRadius: 2,
    marginBottom: 16,
  },
  closeButton: {
    position: "absolute",
    right: 16,
    top: 16,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#f5f5f5",
    alignItems: "center",
    justifyContent: "center",
  },
  modalBody: {
    padding: 20,
  },
  modalAgentInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  modalAgentImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 2,
    borderColor: "#fff",
  },
  modalAgentDetails: {
    marginLeft: 15,
    flex: 1,
  },
  modalAgentName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 2,
    letterSpacing: -0.5,
  },
  modalAgentCompany: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  modalAgentRating: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  modalRatingText: {
    fontSize: 12,
    color: "#666",
    marginLeft: 4,
  },
  agentStatsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  modalSection: {
    marginBottom: 24,
  },
  modalSectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
    letterSpacing: -0.3,
  },
  contactOptions: {
    marginBottom: 10,
  },
  contactOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  contactOptionIcon: {
    width: 40,
    height: 40,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 15,
  },
  contactOptionDetails: {
    flex: 1,
  },
  contactOptionLabel: {
    fontSize: 10,
    color: "#999",
    marginBottom: 2,
  },
  contactOptionValue: {
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
  },
  contactOptionAction: {
    flexDirection: "row",
    alignItems: "center",
  },
  contactOptionActionText: {
    fontSize: 12,
    color: "#3498db",
    fontWeight: "600",
    marginRight: 4,
  },
  aboutText: {
    fontSize: 14,
    color: "#666",
    lineHeight: 22,
    marginBottom: 16,
  },
  scheduleButton: {
    marginTop: 0,
    borderRadius: 12,
    overflow: "hidden",
    elevation: 5,
    marginBottom: 50,
  },
  scheduleButtonGradient: {
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  scheduleButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
    letterSpacing: 0.5,
  },
  tabContainer: {
    flexDirection: "row",
    marginVertical: 10,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    marginRight: 5,
    alignItems: "center",
  },
  tabButtonText: {
    fontSize: 14,
    color: "#333",
  },
  activeTabButton: {
    backgroundColor: "#232761",
    borderColor: "#232761",
  },
  activeTabButtonText: {
    color: "#fff",
  },
  scrollContainer: {
    paddingRight: 20,
    paddingLeft: 2,
    paddingVertical: 10,
  },
  propertyCard: {
    width: 220,
    backgroundColor: "white",
    borderRadius: 8,
    marginRight: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#eee",
  },
  propertyImage: {
    width: "100%",
    height: 120,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    backgroundColor: "#f5f5f5",
  },
  cardContent: {
    padding: 16,
  },
  propertyName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  locationText: {
    fontSize: 12,
    color: "#666",
    marginBottom: 8,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  priceText: {
    fontSize: 12,
    fontWeight: "600",
    color: "green",
  },
  typeText: {
    fontSize: 14,
    color: "#666",
    marginLeft: 4,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  saveButton: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#2E3192",
    marginRight: 8,
  },
  saveButtonText: {
    color: "#2E3192",
    fontSize: 10,
    fontWeight: "500",
  },
  viewButtonAgent: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 4,
    backgroundColor: "#2E3192",
  },
  viewButtonTextAgent: {
    color: "white",
    fontSize: 10,
    fontWeight: "500",
  },
  projectCard: {
    backgroundColor: "#fff",
    borderRadius: 15,
    overflow: "hidden",
    marginRight: 20,
    elevation: 5,
  },
  projectImageContainer: {
    position: "relative",
    width: cardWidth,
    height: 180,
  },
  projectImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  imageGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 60,
  },
  projectBadge: {
    position: "absolute",
    top: 10,
    left: 10,
    backgroundColor: "#4CAF50",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  projectBadgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  ratingBadge: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "rgba(255, 193, 7, 0.9)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
  },
  ratingText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  projectInfo: {
    padding: 15,
  },
  projectTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1a237e",
    marginBottom: 5,
  },
  locationContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  projectLocation: {
    fontSize: 14,
    color: "#757575",
  },
  projectPrice: {
    fontSize: 14,
    color: "#1a237e",
    fontWeight: "bold",
  },
  projectPossession: {
    fontSize: 14,
    color: "#757575",
    marginBottom: 10,
  },
  projectButtons: {
    flexDirection: "row",
    gap: 10,
  },
  viewButton: {
    flex: 1,
    backgroundColor: "#1a237e",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  inquiryButton: {
    flex: 1,
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  propertiesSection: {
    paddingVertical: 20,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
  },
  propertiesSectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  propertiesScrollContainer: {
    paddingRight: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  projectModalContainer: {
    backgroundColor: "#fff",
    borderRadius: 15,
    width: "90%",
    maxHeight: "80%",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 15,
  },
  modalCloseButton: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 2,
    backgroundColor: "rgba(0,0,0,0.5)",
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  modalProjectImage: {
    width: "100%",
    height: 200,
  },
  modalScrollView: {
    padding: 20,
    maxHeight: 350,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1a237e",
    marginBottom: 10,
  },
  modalInfoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },
  modalLocation: {
    fontSize: 16,
    color: "#757575",
  },
  modalRating: {
    fontSize: 16,
    color: "#FFC107",
    fontWeight: "bold",
  },
  modalStatus: {
    fontSize: 16,
    color: "#4CAF50",
    marginBottom: 15,
  },
  priceContainerModal: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(26, 35, 126, 0.05)",
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  priceLabel: {
    fontSize: 14,
    color: "#757575",
    marginRight: 5,
  },
  priceValue: {
    fontSize: 16,
    color: "#1a237e",
    fontWeight: "bold",
  },
  possessionContainerModal: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(76, 175, 80, 0.05)",
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  possessionLabel: {
    fontSize: 14,
    color: "#757575",
    marginRight: 5,
  },
  possessionValue: {
    fontSize: 16,
    color: "#4CAF50",
    fontWeight: "bold",
  },
  modalDescription: {
    fontSize: 14,
    color: "#424242",
    lineHeight: 20,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  modalButton: {
    flex: 1,
    padding: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  modalButtonCloseText: {
    color: "#232761",
    fontSize: 16,
    fontWeight: "bold",
  },
  modalInquiryButton: {
    backgroundColor: "#1a237e",
  },
  modalButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  inquiryModalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  inquiryModalContainer: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
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
    color: "#1a237e",
  },
  inquiryModalDetails: {
    width: "100%",
    marginBottom: 20,
  },
  inquiryModalLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#757575",
    marginTop: 10,
  },
  inquiryModalValue: {
    fontSize: 14,
    color: "#1a237e",
    marginTop: 4,
  },
  divider: {
    height: 1,
    backgroundColor: "#DDD",
    marginVertical: 16,
  },
});