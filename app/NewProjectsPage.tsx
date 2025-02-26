import React, { useState, useRef, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Animated,
  Modal,
  Dimensions,
  ImageBackground,
  FlatList,
  Easing,
  Pressable,
} from "react-native";
import { BlurView } from "expo-blur";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import { MotiView } from "moti";
import * as Animatable from "react-native-animatable";

const { width, height } = Dimensions.get("window");

const PROJECTS_PER_PAGE = 5;

const residentialProjects = [
  {
    id: "1",
    name: "Project Launch",
    location: "New Delhi",
    status: "Construction Completed",
    image: require("../assets/images/newproject1.png"),
    description:
      "We are launching a new project, please check properly. Luxury apartments with modern amenities including swimming pool, gym, and 24/7 security.",
    price: "₹ 75L - 1.2Cr",
    rating: 4.8,
  },
  {
    id: "2",
    name: "Green Valley",
    location: "Bangalore",
    status: "Under Construction",
    image: require("../assets/images/newproject2.png"),
    description:
      "Eco-friendly residential complex with sustainable features and green spaces throughout the property.",
    price: "₹ 85L - 1.5Cr",
    possession: "December 2025",
    rating: 4.5,
  },
  {
    id: "3",
    name: "Skyline Heights",
    location: "Mumbai",
    status: "Ready to Move",
    image: require("../assets/images/newproject3.png"),
    description:
      "Luxury high-rise apartments with panoramic sea views and premium finishes.",
    price: "₹ 1.8Cr - 3.5Cr",
    rating: 4.9,
  },
  {
    id: "4",
    name: "Riverside Residences",
    location: "Pune",
    status: "Under Construction",
    image: require("../assets/images/newproject4.png"),
    description:
      "Elegant apartments along the riverside with beautiful views and tranquil environment.",
    price: "₹ 65L - 1.1Cr",
    possession: "June 2025",
    rating: 4.6,
  },
  {
    id: "5",
    name: "Urban Square",
    location: "Hyderabad",
    status: "Ready to Move",
    image: require("../assets/images/newproject1.png"),
    description:
      "Modern apartments in the heart of the city with easy access to tech parks and entertainment hubs.",
    price: "₹ 70L - 1.3Cr",
    rating: 4.7,
  },
  {
    id: "6",
    name: "Serene Meadows",
    location: "Chennai",
    status: "Under Construction",
    image: require("../assets/images/newproject2.png"),
    description:
      "Peaceful residential community surrounded by nature yet close to urban amenities.",
    price: "₹ 60L - 95L",
    possession: "March 2026",
    rating: 4.4,
  },
];

const commercialProjects = [
  {
    id: "1",
    name: "Project 1",
    location: "Mumbai",
    status: "Under Construction",
    possession: "March 2025",
    image: require("../assets/images/newproject1.png"),
    description:
      "Premium office spaces designed for modern businesses with state-of-the-art facilities.",
    price: "₹ 1.5Cr - 3Cr",
    rating: 4.7,
  },
  {
    id: "2",
    name: "Tech Hub",
    location: "Bangalore",
    status: "Ready to Move",
    image: require("../assets/images/newproject2.png"),
    description:
      "Modern office spaces designed for tech companies with advanced infrastructure.",
    price: "₹ 2Cr - 4Cr",
    rating: 4.8,
  },
  {
    id: "3",
    name: "Retail Plaza",
    location: "Delhi",
    status: "Under Construction",
    possession: "September 2025",
    image: require("../assets/images/newproject3.png"),
    description:
      "Prime retail spaces in high-footfall area with excellent visibility and accessibility.",
    price: "₹ 1.2Cr - 2.5Cr",
    rating: 4.6,
  },
  {
    id: "4",
    name: "Business Square",
    location: "Hyderabad",
    status: "Ready to Move",
    image: require("../assets/images/newproject4.png"),
    description:
      "Corporate office spaces with premium amenities and strategic location.",
    price: "₹ 1.8Cr - 3.2Cr",
    rating: 4.9,
  },
  {
    id: "5",
    name: "Industrial Park",
    location: "Pune",
    status: "Under Construction",
    possession: "December 2025",
    image: require("../assets/images/newproject1.png"),
    description:
      "Industrial spaces with robust infrastructure for manufacturing and warehousing.",
    price: "₹ 1Cr - 2.2Cr",
    rating: 4.5,
  },
  {
    id: "6",
    name: "Hospitality Center",
    location: "Goa",
    status: "Ready to Move",
    image: require("../assets/images/newproject2.png"),
    description:
      "Commercial spaces ideal for hotels, restaurants, and entertainment venues.",
    price: "₹ 2.5Cr - 5Cr",
    rating: 4.7,
  },
];

export default function App() {
  const [activeTab, setActiveTab] = useState("residential");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProject, setSelectedProject] = useState<
    (typeof residentialProjects)[0] | (typeof commercialProjects)[0] | null
  >(null);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    location: "",
    propertyType: "",
    description: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const scrollY = useRef(new Animated.Value(0)).current;
  const scrollX = useRef(new Animated.Value(0)).current;

  const marqueeAnim = useRef(new Animated.Value(width)).current;
  const formScaleAnim = useRef(new Animated.Value(0.95)).current;
  const formOpacityAnim = useRef(new Animated.Value(0)).current;

  const tabIndicatorPosition = useRef(
    new Animated.Value(activeTab === "residential" ? 0 : 225)
  ).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(formScaleAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
        easing: Easing.elastic(1),
      }),
      Animated.timing(formOpacityAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();

    const runAnimation = () => {
      Animated.timing(marqueeAnim, {
        toValue: -width * 1.5,
        duration: 15000,
        useNativeDriver: true,
        easing: Easing.linear,
      }).start(() => {
        marqueeAnim.setValue(width);
        runAnimation();
      });
    };
    runAnimation();
  }, [marqueeAnim, formScaleAnim, formOpacityAnim]);

  useEffect(() => {
    Animated.spring(tabIndicatorPosition, {
      toValue: activeTab === "residential" ? 0 : 225,
      useNativeDriver: true,
      friction: 8,
      tension: 50,
    }).start();
  }, [activeTab, tabIndicatorPosition]);

  const handleSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        setFormData({
          name: "",
          phone: "",
          email: "",
          location: "",
          propertyType: "",
          description: "",
        });
      }, 2000);
    }, 1500);
  };

  const renderProjectCard = ({ item, index }: { item: typeof residentialProjects[0], index: number }) => {
    return (
      <Animatable.View
        animation="fadeInUp"
        delay={index * 100}
        duration={800}
        useNativeDriver
      >
        <Pressable
          style={({ pressed }) => [
            styles.projectCard,
            pressed && { transform: [{ scale: 0.98 }] },
          ]}
          onPress={() => setSelectedProject(item)}
        >
          <View style={styles.projectImageContainer}>
            <Image source={item.image} style={styles.projectImage} />
            <LinearGradient
              colors={["rgba(0,0,0,0)", "transparent"]}
              style={styles.imageGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 0.6 }}
            />
            <View style={styles.projectBadge}>
              <Text style={styles.projectBadgeText}>{item.status}</Text>
            </View>
            {item.rating && (
              <View style={styles.ratingBadge}>
                <Text style={styles.ratingText}>★ {item.rating}</Text>
              </View>
            )}
          </View>
          <View style={styles.projectInfo}>
            <Text style={styles.projectTitle}>{item.name}</Text>
            <View style={styles.locationContainer}>
              <Text style={styles.projectLocation}>📍 {item.location}</Text>
              {item.price && (
                <Text style={styles.projectPrice}>{item.price}</Text>
              )}
            </View>
            {item.possession && (
              <Text style={styles.projectPossession}>
                🗓️ Possession: {item.possession}
              </Text>
            )}
            <View style={styles.projectButtons}>
              <TouchableOpacity
                style={styles.viewButton}
                onPress={() => setSelectedProject(item)}
                activeOpacity={0.8}
              >
                <Text style={styles.buttonText}>View Details</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.inquiryButton}
                activeOpacity={0.8}
              >
                <Text style={styles.buttonText}>Inquiry</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Pressable>
      </Animatable.View>
    );
  };

  const renderPagination = () => {
    const projects =
      activeTab === "residential" ? residentialProjects : commercialProjects;
    const totalPages = Math.ceil(projects.length / PROJECTS_PER_PAGE);

    return (
      <Animatable.View
        animation="fadeInUp"
        duration={800}
        delay={300}
        style={styles.pagination}
      >
        {/* Previous Button */}
        <TouchableOpacity
          style={[styles.disabledPageButton]}
          onPress={() => {
            if (currentPage > 1) {
              setCurrentPage(currentPage - 1);
              if (scrollViewRef.current) {
                scrollViewRef.current.scrollTo({ y: 600, animated: true });
              }
            }
          }}
          disabled={currentPage === 1}
        >
          <Text style={[styles.pageButtonText]}>Previous</Text>
        </TouchableOpacity>

        {/* Page Number Buttons */}
        {Array.from({ length: totalPages }).map((_, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.pageButton,
              currentPage === index + 1 && styles.activePageButton,
            ]}
            onPress={() => {
              setCurrentPage(index + 1);
              if (scrollViewRef.current) {
                scrollViewRef.current.scrollTo({ y: 600, animated: true });
              }
            }}
          >
            <Text
              style={[
                styles.pageButtonText,
                currentPage === index + 1 && styles.activePageButtonText,
              ]}
            >
              {index + 1}
            </Text>
          </TouchableOpacity>
        ))}

        {/* Next Button */}
        <TouchableOpacity
          style={[styles.disabledPageButton]}
          onPress={() => {
            if (currentPage < totalPages) {
              setCurrentPage(currentPage + 1);
              if (scrollViewRef.current) {
                scrollViewRef.current.scrollTo({ y: 600, animated: true });
              }
            }
          }}
          disabled={currentPage === totalPages}
        >
          <Text style={[styles.pageButtonText]}>Next</Text>
        </TouchableOpacity>
      </Animatable.View>
    );
  };

  const scrollViewRef = useRef<ScrollView>(null);

  const FamousPlaces = () => {
    const Maharashtra = [
      "Mumbai",
      "Pune",
      "Aurangabad",
      "Nashik",
      "Nagpur",
      "Lonavala",
      "Mahabaleshwar",
      "Shirdi",
      "Kolhapur",
      "Satara",
      "Alibaug",
      "Ratnagiri",
      "Solapur",
      "Ahmednagar",
      "Khandala",
    ];

    const UttarPradesh = [
      "Agra",
      "Lucknow",
      "Varanasi",
      "Kanpur",
      "Allahabad",
      "Noida",
      "Ghaziabad",
      "Mathura",
      "Vrindavan",
      "Ayodhya",
      "Jhansi",
      "Aligarh",
      "Bareilly",
      "Meerut",
      "Fatehpur Sikri",
    ];
    const Karnataka = [
      "Bangalore",
      "Mysore",
      "Hampi",
      "Coorg",
      "Mangalore",
      "Udupi",
      "Chikmagalur",
      "Hubli",
      "Belgaum",
      "Bijapur",
      "Gokarna",
      "Dandeli",
      "Badami",
      "Shimoga",
      "Hospet",
    ];
    const Rajasthan = [
      "Jaipur",
      "Udaipur",
      "Jodhpur",
      "Jaisalmer",
      "Pushkar",
      "Mount Abu",
      "Bikaner",
      "Ajmer",
      "Chittorgarh",
      "Kota",
      "Bundi",
      "Ranthambore",
      "Alwar",
      "Sawai Madhopur",
      "Neemrana",
    ];
    const TamilNadu = [
      "Chennai",
      "Madurai",
      "Ooty",
      "Kanyakumari",
      "Coimbatore",
      "Pondicherry",
      "Rameswaram",
      "Thanjavur",
      "Trichy",
      "Velankanni",
      "Yercaud",
      "Hogenakkal",
      "Cuddalore",
      "Salem",
      "Mahabalipuram",
    ];
    const WestBengal = [
      "Kolkata",
      "Darjeeling",
      "Siliguri",
      "Kalimpong",
      "Sundarbans",
      "Digha",
      "Howrah",
      "Hooghly",
      "Malda",
      "Asansol",
      "Cooch Behar",
      "Haldia",
      "Jalpaiguri",
      "Bardhaman",
      "Medinipur",
    ];

    return (
      <Animatable.View
        animation="fadeInUp"
        duration={1000}
        delay={500}
        style={styles.famousPlacesContainer}
      >
        <LinearGradient
          colors={["rgba(26, 35, 126, 0.05)", "rgba(26, 35, 126, 0.1)"]}
          style={styles.famousPlacesGradient}
        >
          <Animatable.Text
            animation="fadeIn"
            duration={1000}
            style={styles.famousPlacesTitle}
          >
            FAMOUS PLACES IN INDIA
          </Animatable.Text>
          <Text style={styles.famousPlacesSubtitle}>
            Explore India's most famous cities, each offering unique attractions
            and cultural experiences.
          </Text>

          <View style={styles.statesContainer}>
            <View style={styles.stateRow}>
              <View style={styles.stateColumn}>
                <Text style={styles.stateName}>MAHARASHTRA</Text>
                {Maharashtra.map((city, index) => (
                  <Animatable.View
                    key={city}
                    animation="fadeInLeft"
                    delay={index * 100}
                  >
                    <TouchableOpacity
                      style={styles.cityButton}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.cityText}>{city}</Text>
                    </TouchableOpacity>
                  </Animatable.View>
                ))}
              </View>

              <View style={styles.stateColumn}>
                <Text style={styles.stateName}>UTTAR PRADESH</Text>
                {UttarPradesh.map((city, index) => (
                  <Animatable.View
                    key={city}
                    animation="fadeInRight"
                    delay={index * 100}
                  >
                    <TouchableOpacity
                      style={styles.cityButton}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.cityText}>{city}</Text>
                    </TouchableOpacity>
                  </Animatable.View>
                ))}
              </View>
            </View>
            <View style={styles.stateRow}>
              <View style={styles.stateColumn}>
                <Text style={styles.stateName}>UTTAR PRADESH</Text>
                {UttarPradesh.map((city, index) => (
                  <Animatable.View
                    key={city}
                    animation="fadeInRight"
                    delay={index * 100}
                  >
                    <TouchableOpacity
                      style={styles.cityButton}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.cityText}>{city}</Text>
                    </TouchableOpacity>
                  </Animatable.View>
                ))}
              </View>

              <View style={styles.stateColumn}>
                <Text style={styles.stateName}>KARNATAKA</Text>
                {Karnataka.map((city, index) => (
                  <Animatable.View
                    key={city}
                    animation="fadeInRight"
                    delay={index * 100}
                  >
                    <TouchableOpacity
                      style={styles.cityButton}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.cityText}>{city}</Text>
                    </TouchableOpacity>
                  </Animatable.View>
                ))}
              </View>
            </View>
            <View style={styles.stateRow}>
              <View style={styles.stateColumn}>
                <Text style={styles.stateName}>RAJASTHAN</Text>
                {Rajasthan.map((city, index) => (
                  <Animatable.View
                    key={city}
                    animation="fadeInRight"
                    delay={index * 100}
                  >
                    <TouchableOpacity
                      style={styles.cityButton}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.cityText}>{city}</Text>
                    </TouchableOpacity>
                  </Animatable.View>
                ))}
              </View>

              <View style={styles.stateColumn}>
                <Text style={styles.stateName}>TAMILNADU</Text>
                {TamilNadu.map((city, index) => (
                  <Animatable.View
                    key={city}
                    animation="fadeInRight"
                    delay={index * 100}
                  >
                    <TouchableOpacity
                      style={styles.cityButton}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.cityText}>{city}</Text>
                    </TouchableOpacity>
                  </Animatable.View>
                ))}
              </View>
            </View>
          </View>
        </LinearGradient>
      </Animatable.View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <Animated.ScrollView
        ref={scrollViewRef}
        style={styles.scrollView}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
        showsHorizontalScrollIndicator={false}
      >
        <LinearGradient
          colors={["#1a237e", "#303f9f"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.marqueeContainer}
        >
          <Animated.Text
            style={[
              styles.marqueeText,
              {
                transform: [{ translateX: marqueeAnim }],
              },
            ]}
          >
            🏡 Hot Properties Available! | Book Your Dream Home Now! | Contact
            Us for Exclusive Offers! 🏘️
          </Animated.Text>
        </LinearGradient>

        {/* Property Inquiry Form */}
        <ImageBackground
          source={require("../assets/images/newprojectspagebg.png")}
          style={styles.backgroundImage}
        >
          <Animated.View
            style={[
              styles.formWrapper,
              {
                opacity: formOpacityAnim,
                transform: [{ scale: formScaleAnim }],
              },
            ]}
          >
            <BlurView intensity={40} tint="dark" style={styles.formContainer}>
              <Animatable.Text
                animation="pulse"
                iterationCount="infinite"
                duration={2000}
                style={styles.formTitle}
              >
                PROPERTY INQUIRY
              </Animatable.Text>
              <TextInput
                style={styles.input}
                placeholder="Enter Your Name"
                placeholderTextColor="rgba(255,255,255,0.7)"
                value={formData.name}
                onChangeText={(text) =>
                  setFormData({ ...formData, name: text })
                }
              />
              <TextInput
                style={styles.input}
                placeholder="Enter Your Phone Number"
                placeholderTextColor="rgba(255,255,255,0.7)"
                keyboardType="phone-pad"
                value={formData.phone}
                onChangeText={(text) =>
                  setFormData({ ...formData, phone: text })
                }
              />
              <TextInput
                style={styles.input}
                placeholder="Enter Your Email"
                placeholderTextColor="rgba(255,255,255,0.7)"
                keyboardType="email-address"
                value={formData.email}
                onChangeText={(text) =>
                  setFormData({ ...formData, email: text })
                }
              />
              <TextInput
                style={styles.input}
                placeholder="Preferred Location"
                placeholderTextColor="rgba(255,255,255,0.7)"
                value={formData.location}
                onChangeText={(text) =>
                  setFormData({ ...formData, location: text })
                }
              />
              <TextInput
                style={styles.input}
                placeholder="Property Type"
                placeholderTextColor="rgba(255,255,255,0.7)"
                value={formData.propertyType}
                onChangeText={(text) =>
                  setFormData({ ...formData, propertyType: text })
                }
              />
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Enter a Description (e.g., specific requirements)"
                placeholderTextColor="rgba(255,255,255,0.7)"
                multiline
                numberOfLines={4}
                value={formData.description}
                onChangeText={(text) =>
                  setFormData({ ...formData, description: text })
                }
              />
              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleSubmit}
                disabled={isSubmitting}
                activeOpacity={0.8}
              >
                {isSubmitting ? (
                  <Animatable.Text
                    animation="pulse"
                    iterationCount="infinite"
                    style={styles.submitButtonText}
                  >
                    SUBMITTING...
                  </Animatable.Text>
                ) : showSuccess ? (
                  <Animatable.Text
                    animation="bounceIn"
                    style={styles.submitButtonText}
                  >
                    ✓ SUBMITTED SUCCESSFULLY
                  </Animatable.Text>
                ) : (
                  <Text style={styles.submitButtonText}>SUBMIT</Text>
                )}
              </TouchableOpacity>
            </BlurView>
          </Animated.View>
        </ImageBackground>

        {/* Projects Section */}
        <View style={styles.projectsSection}>
          <Animatable.Text
            animation="fadeIn"
            duration={1000}
            style={styles.sectionTitle}
          >
            Explore Projects
          </Animatable.Text>

          <View style={styles.tabContainer}>
            <Animated.View
              style={[
                styles.tabIndicator,
                {
                  transform: [{ translateX: tabIndicatorPosition }],
                },
              ]}
            />
            <TouchableOpacity
              style={styles.tab}
              onPress={() => setActiveTab("residential")}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === "residential" && styles.activeTabText,
                ]}
              >
                🏠 Residential Projects
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.tab}
              onPress={() => setActiveTab("commercial")}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === "commercial" && styles.activeTabText,
                ]}
              >
                🏢 Commercial Projects
              </Text>
            </TouchableOpacity>
          </View>

          <MotiView
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: "timing", duration: 500 }}
          >
            <FlatList
              data={
                activeTab === "residential"
                  ? residentialProjects.slice(
                      (currentPage - 1) * PROJECTS_PER_PAGE,
                      currentPage * PROJECTS_PER_PAGE
                    )
                  : commercialProjects.slice(
                      (currentPage - 1) * PROJECTS_PER_PAGE,
                      currentPage * PROJECTS_PER_PAGE
                    )
              }
              renderItem={renderProjectCard}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              ItemSeparatorComponent={() => <View style={{ height: 20 }} />}
            />
          </MotiView>

          {renderPagination()}
          <FamousPlaces />
        </View>
      </Animated.ScrollView>

      {/* Project Details Modal */}
      <Modal
        visible={selectedProject !== null}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setSelectedProject(null)}
      >
        <View style={styles.modalOverlay}>
          <Animatable.View
            animation="zoomIn"
            duration={400}
            style={styles.modalContent}
          >
            {selectedProject && (
              <>
                <View style={styles.modalImageContainer}>
                  <Image
                    source={selectedProject.image}
                    style={styles.modalImage}
                  />
                  <LinearGradient
                    colors={["rgba(0,0,0,0)", "transparent"]}
                    style={styles.modalImageGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 0.6 }}
                  />
                  {/* <TouchableOpacity
                    style={styles.closeButton}
                    onPress={() => setSelectedProject(null)}
                  >
                    <Text style={styles.closeButtonText}>×</Text>
                  </TouchableOpacity> */}
                </View>

                <ScrollView style={styles.modalScrollView}>
                  <Text style={styles.modalTitle}>{selectedProject.name}</Text>
                  <View style={styles.modalInfoRow}>
                    <Text style={styles.modalLocation}>
                      📍 {selectedProject.location}
                    </Text>
                    {selectedProject.rating && (
                      <Text style={styles.modalRating}>
                        ★ {selectedProject.rating}
                      </Text>
                    )}
                  </View>
                  <Text style={styles.modalStatus}>
                    {selectedProject.status}
                  </Text>

                  {selectedProject.price && (
                    <View style={styles.priceContainer}>
                      <Text style={styles.priceLabel}>Price Range:</Text>
                      <Text style={styles.priceValue}>
                        {selectedProject.price}
                      </Text>
                    </View>
                  )}

                  {selectedProject.possession && (
                    <View style={styles.possessionContainer}>
                      <Text style={styles.possessionLabel}>Possession:</Text>
                      <Text style={styles.possessionValue}>
                        {selectedProject.possession}
                      </Text>
                    </View>
                  )}

                  <Text style={styles.modalDescription}>
                    {selectedProject.description}
                  </Text>
                </ScrollView>

                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    style={styles.modalButton}
                    onPress={() => setSelectedProject(null)}
                  >
                    <Text style={styles.modalButtonCloseText}>Close</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.modalInquiryButton]}
                  >
                    <Text style={styles.modalButtonText}>Inquiry</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </Animatable.View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  marqueeContainer: {
    height: 40,
    overflow: "hidden",
    justifyContent: "center",
  },
  marqueeText: {
    width: 1000,
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    paddingVertical: 8,
  },
  scrollView: {
    flex: 1,
  },
  backgroundImage: {
    height: 700,
  },
  formWrapper: {
    margin: 20,
    borderRadius: 15,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  formContainer: {
    padding: 20,
    borderRadius: 15,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#fff",
  },
  formTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 20,
    textAlign: "center",
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
  },
  input: {
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    color: "#fff",
    fontSize: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
    tintColor: "#fff"
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  submitButton: {
    backgroundColor: "#1a237e",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  projectsSection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1a237e",
    textAlign: "center",
    marginBottom: 20,
    textShadowColor: "rgba(0, 0, 0, 0.1)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  tabContainer: {
    flexDirection: "row",
    marginBottom: 20,
    borderRadius: 10,
    backgroundColor: "#f0f0f0",
    position: "relative",
    height: 50,
    overflow: "hidden",
  },
  tabIndicator: {
    position: "absolute",
    width: 225,
    height: "100%",
    backgroundColor: "rgba(26, 35, 126, 0.1)",
    borderRadius: 10,
  },
  tab: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  tabText: {
    fontSize: 16,
    color: "#757575",
    fontWeight: "500",
  },
  activeTabText: {
    color: "#1a237e",
    fontWeight: "bold",
  },
  projectCard: {
    backgroundColor: "#fff",
    borderRadius: 15,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  projectImageContainer: {
    position: "relative",
  },
  projectImage: {
    width: "100%",
    height: 200,
  },
  imageGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 80,
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
    fontSize: 20,
    fontWeight: "bold",
    color: "#1a237e",
    marginBottom: 5,
  },
  locationContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
  projectStatus: {
    fontSize: 14,
    color: "#4CAF50",
    marginBottom: 5,
  },
  projectPossession: {
    fontSize: 14,
    color: "#757575",
    marginBottom: 10,
  },
  amenitiesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 10,
    gap: 5,
  },
  amenityBadge: {
    backgroundColor: "rgba(26, 35, 126, 0.1)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 15,
  },
  amenityText: {
    color: "#1a237e",
    fontSize: 12,
  },
  projectButtons: {
    flexDirection: "row",
    marginTop: 10,
    gap: 10,
  },
  viewButton: {
    flex: 1,
    backgroundColor: "#1a237e",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  inquiryButton: {
    flex: 1,
    backgroundColor: "#4CAF50",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  buttonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
    gap: 10,
  },
  pageButton: {
    width: 35,
    height: 35,
    borderRadius: 20,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  disabledPageButton: {
    width: 75,
    borderRadius: 20,
    paddingHorizontal: 5,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  activePageButton: {
    backgroundColor: "#1a237e",
  },
  pageButtonText: {
    color: "#757575",
    fontSize: 14,
    fontWeight: "bold",
  },
  activePageButtonText: {
    color: "#fff",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
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
  modalImageContainer: {
    position: "relative",
  },
  modalImage: {
    width: "100%",
    height: 200,
  },
  modalImageGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 100,
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  closeButtonText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  modalScrollView: {
    padding: 20,
    maxHeight: 350,
  },
  modalTitle: {
    fontSize: 24,
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
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    backgroundColor: "rgba(26, 35, 126, 0.05)",
    padding: 10,
    borderRadius: 10,
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
  possessionContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    backgroundColor: "rgba(76, 175, 80, 0.05)",
    padding: 10,
    borderRadius: 10,
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
    fontSize: 16,
    color: "#424242",
    marginBottom: 20,
    lineHeight: 24,
  },
  modalAmenitiesContainer: {
    marginBottom: 20,
  },
  amenitiesTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1a237e",
    marginBottom: 10,
  },
  modalAmenitiesList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  modalAmenityBadge: {
    backgroundColor: "rgba(26, 35, 126, 0.1)",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  modalAmenityText: {
    color: "#1a237e",
    fontSize: 14,
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
  famousPlacesContainer: {
    marginTop: 40,
    marginBottom: 20,
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 5,
  },
  famousPlacesGradient: {
    padding: 30,
  },
  famousPlacesTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1a237e",
    textAlign: "center",
    marginBottom: 10,
    textShadowColor: "rgba(26, 35, 126, 0.2)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  famousPlacesSubtitle: {
    fontSize: 16,
    color: "#757575",
    textAlign: "center",
    marginBottom: 30,
    lineHeight: 24,
  },
  statesContainer: {
    flexDirection: "column",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: 20,
  },
  stateRow: {
    flexDirection: "row",
    gap: 20,
  },
  stateColumn: {
    flex: 1,
  },
  stateName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1a237e",
    marginBottom: 15,
    paddingBottom: 10,
    borderBottomWidth: 2,
    borderBottomColor: "rgba(26, 35, 126, 0.2)",
  },
  cityButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cityText: {
    fontSize: 15,
    color: "#424242",
    fontWeight: "500",
  },
});
