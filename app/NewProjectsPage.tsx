"use client"

import { useState, useRef, useEffect } from "react"
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
  StatusBar,
  Pressable,
  Alert,
  ActivityIndicator,
} from "react-native"
import { BlurView } from "expo-blur"
import { LinearGradient } from "expo-linear-gradient"
import { MotiView } from "moti"
import * as Animatable from "react-native-animatable"
import Icon from "react-native-vector-icons/MaterialIcons"
import axios from "axios"
import { BASE_URL } from "@env"

const { width, height } = Dimensions.get("window")

const COLORS = {
  cardBackground: "#fff",
  text: "#1a237e",
  textLight: "#757575",
  primary: "#1a237e",
  success: "#4CAF50",
  error: "#f44336",
}

const PROJECTS_PER_PAGE = 5

// Cities data
const cities = {
  Maharashtra: [
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
  ],
  UttarPradesh: [
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
  ],
  Karnataka: [
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
  ],
  Rajasthan: [
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
  ],
  TamilNadu: [
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
  ],
  WestBengal: [
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
  ],
}

interface Project {
  _id: string
  title: string
  address: string
  description: string
  images: string[]
  type: "residential" | "commercial"
  status: string
  possession: string
  price?: string
  rating?: number
}

interface FormData {
  name: string
  phone: string
  email: string
  location: string
  propertyType: string
  description: string
}

export default function NewProjectsPage() {
  const [activeTab, setActiveTab] = useState<"residential" | "commercial">("residential")
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [inquiryModalVisible, setInquiryModalVisible] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingProjects, setIsLoadingProjects] = useState(false)

  // Projects state
  const [allProjects, setAllProjects] = useState<Project[]>([])
  const [residentialProjects, setResidentialProjects] = useState<Project[]>([])
  const [commercialProjects, setCommercialProjects] = useState<Project[]>([])

  // Form state
  const [formData, setFormData] = useState<FormData>({
    name: "",
    phone: "",
    email: "",
    location: "",
    propertyType: "",
    description: "",
  })

  // Animation refs
  const scrollY = useRef(new Animated.Value(0)).current
  const marqueeAnim = useRef(new Animated.Value(width)).current
  const formScaleAnim = useRef(new Animated.Value(0.95)).current
  const formOpacityAnim = useRef(new Animated.Value(0)).current
  const tabIndicatorPosition = useRef(new Animated.Value(activeTab === "residential" ? 0 : 225)).current

  // Fetch projects from API
  const fetchProjects = async () => {
    try {
      setIsLoadingProjects(true)
      const response = await axios.get(`${BASE_URL}/api/projects`)

      if (response.data && Array.isArray(response.data)) {
        setAllProjects(response.data)
        setResidentialProjects(response.data.filter((project: Project) => project.type === "residential"))
        setCommercialProjects(response.data.filter((project: Project) => project.type === "commercial"))
      } else {
        throw new Error("Invalid data format received")
      }
    } catch (error) {
      console.error("Error fetching projects:", error)
      Alert.alert("Error", "Failed to load projects. Please check your internet connection and try again.", [
        {
          text: "Retry",
          onPress: fetchProjects,
        },
        {
          text: "Cancel",
          style: "cancel",
        },
      ])

      // Fallback to mock data
      const mockResidential = [
        {
          _id: "1",
          title: "Project Launch",
          address: "New Delhi",
          status: "Construction Completed",
          images: [require("../assets/images/newproject1.png")],
          description:
            "We are launching a new project, please check properly. Luxury apartments with modern amenities including swimming pool, gym, and 24/7 security.",
          type: "residential" as const,
          possession: "2024-12-01",
          price: "₹ 75L - 1.2Cr",
          rating: 4.8,
        },
        {
          _id: "2",
          title: "Green Valley",
          address: "Bangalore",
          status: "Under Construction",
          images: [require("../assets/images/newproject2.png")],
          description:
            "Eco-friendly residential complex with sustainable features and green spaces throughout the property.",
          type: "residential" as const,
          possession: "2025-12-01",
          price: "₹ 85L - 1.5Cr",
          rating: 4.5,
        },
      ]

      const mockCommercial = [
        {
          _id: "3",
          title: "Tech Hub",
          address: "Bangalore",
          status: "Ready to Move",
          images: [require("../assets/images/newproject2.png")],
          description: "Modern office spaces designed for tech companies with advanced infrastructure.",
          type: "commercial" as const,
          possession: "2024-01-01",
          price: "₹ 2Cr - 4Cr",
          rating: 4.8,
        },
      ]

      setResidentialProjects(mockResidential)
      setCommercialProjects(mockCommercial)
      setAllProjects([...mockResidential, ...mockCommercial])
    } finally {
      setIsLoadingProjects(false)
      setIsLoading(false)
    }
  }

  // Handle form submission
  const handleSubmit = async () => {
    // Validate form
    if (!formData.name.trim() || !formData.phone.trim() || !formData.email.trim()) {
      Alert.alert("Validation Error", "Please fill in all required fields (Name, Phone, Email).")
      return
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      Alert.alert("Validation Error", "Please enter a valid email address.")
      return
    }

    // Validate phone number
    const phoneRegex = /^[0-9]{10}$/
    if (!phoneRegex.test(formData.phone.replace(/\D/g, ""))) {
      Alert.alert("Validation Error", "Please enter a valid 10-digit phone number.")
      return
    }

    try {
      setIsSubmitting(true)

      await axios.post(`${BASE_URL}/api/enquiries`, formData)

      Alert.alert("Success!", "Your enquiry has been submitted successfully. We will contact you soon.", [
        {
          text: "OK",
          onPress: () => {
            setFormData({
              name: "",
              phone: "",
              email: "",
              location: "",
              propertyType: "",
              description: "",
            })
          },
        },
      ])
    } catch (error) {
      console.error("Error submitting enquiry:", error)
      Alert.alert("Submission Failed", "Failed to submit your enquiry. Please try again later.", [
        {
          text: "Retry",
          onPress: handleSubmit,
        },
        {
          text: "Cancel",
          style: "cancel",
        },
      ])
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle project inquiry
  const handleInquiryClick = async (projectId: string) => {
    try {
      // Check if user is logged in (you can implement your auth logic here)
      // const token = await AsyncStorage.getItem('auth');
      // if (!token) {
      //   Alert.alert('Login Required', 'Please log in to send a project enquiry.');
      //   return;
      // }

      await axios.post(
        `${BASE_URL}/api/project-enquiry`,
        { project_id: projectId },
        // { headers: { Authorization: token } }
      )

      Alert.alert("Success!", "Project enquiry submitted to agent successfully.")
    } catch (error) {
      console.error("Error submitting project enquiry:", error)
      Alert.alert("Error", "Failed to submit project enquiry. Please try again.")
    }
  }

  // Initialize animations and fetch data
  useEffect(() => {
    fetchProjects()

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
    ]).start()

    const runAnimation = () => {
      Animated.timing(marqueeAnim, {
        toValue: -width * 1.5,
        duration: 15000,
        useNativeDriver: true,
        easing: Easing.linear,
      }).start(() => {
        marqueeAnim.setValue(width)
        runAnimation()
      })
    }
    runAnimation()
  }, [])

  useEffect(() => {
    Animated.spring(tabIndicatorPosition, {
      toValue: activeTab === "residential" ? 0 : 175,
      useNativeDriver: true,
      friction: 8,
      tension: 50,
    }).start()
  }, [activeTab])

  const renderProjectCard = ({ item, index }: { item: Project; index: number }) => {
    const isUnderConstruction = new Date(item.possession) > new Date()
    const possessionDate = new Date(item.possession).toLocaleString("default", {
      month: "long",
      year: "numeric",
    })

    return (
      <Animatable.View animation="fadeInUp" delay={index * 100} duration={800} useNativeDriver>
        <Pressable
          style={({ pressed }) => [styles.projectCard, pressed && { transform: [{ scale: 0.98 }] }]}
          onPress={() => setSelectedProject(item)}
        >
          <View style={styles.projectImageContainer}>
            <Image
              source={
                typeof item.images[0] === "string"
                  ? { uri: item.images[0] }
                  : item.images[0] || require("../assets/images/newproject1.png")
              }
              style={styles.projectImage}
            />
            <LinearGradient
              colors={["rgba(0,0,0,0)", "transparent"]}
              style={styles.imageGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 0.6 }}
            />
            <View style={[styles.projectBadge, { backgroundColor: isUnderConstruction ? "#FF9800" : "#4CAF50" }]}>
              <Text style={styles.projectBadgeText}>
                {isUnderConstruction ? "Under Construction" : "Construction Completed"}
              </Text>
            </View>
            {item.rating && (
              <View style={styles.ratingBadge}>
                <Text style={styles.ratingText}>★ {item.rating}</Text>
              </View>
            )}
          </View>
          <View style={styles.projectInfo}>
            <Text style={styles.projectTitle}>{item.title}</Text>
            <View style={styles.locationContainer}>
              <Text style={styles.projectLocation}>📍 {item.address}</Text>
              {item.price && <Text style={styles.projectPrice}>{item.price}</Text>}
            </View>
            {isUnderConstruction && <Text style={styles.projectPossession}>🗓️ Possession: {possessionDate}</Text>}
            <View style={styles.projectButtons}>
              <TouchableOpacity style={styles.viewButton} onPress={() => setSelectedProject(item)} activeOpacity={0.8}>
                <Text style={styles.buttonText}>View Details</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.inquiryButton}
                activeOpacity={0.8}
                onPress={() => handleInquiryClick(item._id)}
              >
                <Text style={styles.buttonText}>Inquiry</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Pressable>
      </Animatable.View>
    )
  }

  const renderPagination = () => {
    const projects = activeTab === "residential" ? residentialProjects : commercialProjects
    const totalPages = Math.ceil(projects.length / PROJECTS_PER_PAGE)

    if (totalPages <= 1) return null

    return (
      <Animatable.View animation="fadeInUp" duration={800} delay={300} style={styles.pagination}>
        <TouchableOpacity
          style={[styles.disabledPageButton, currentPage === 1 && styles.disabledButton]}
          onPress={() => {
            if (currentPage > 1) {
              setCurrentPage(currentPage - 1)
              scrollViewRef.current?.scrollTo({ y: 600, animated: true })
            }
          }}
          disabled={currentPage === 1}
        >
          <Text style={[styles.pageButtonText, currentPage === 1 && styles.disabledText]}>Previous</Text>
        </TouchableOpacity>

        {Array.from({ length: totalPages }).map((_, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.pageButton, currentPage === index + 1 && styles.activePageButton]}
            onPress={() => {
              setCurrentPage(index + 1)
              scrollViewRef.current?.scrollTo({ y: 600, animated: true })
            }}
          >
            <Text style={[styles.pageButtonText, currentPage === index + 1 && styles.activePageButtonText]}>
              {index + 1}
            </Text>
          </TouchableOpacity>
        ))}

        <TouchableOpacity
          style={[styles.disabledPageButton, currentPage === totalPages && styles.disabledButton]}
          onPress={() => {
            if (currentPage < totalPages) {
              setCurrentPage(currentPage + 1)
              scrollViewRef.current?.scrollTo({ y: 600, animated: true })
            }
          }}
          disabled={currentPage === totalPages}
        >
          <Text style={[styles.pageButtonText, currentPage === totalPages && styles.disabledText]}>Next</Text>
        </TouchableOpacity>
      </Animatable.View>
    )
  }

  const scrollViewRef = useRef<ScrollView>(null)

  const FamousPlaces = () => {
    return (
      <Animatable.View animation="fadeInUp" duration={1000} delay={500} style={styles.famousPlacesContainer}>
        <LinearGradient
          colors={["rgba(26, 35, 126, 0.05)", "rgba(26, 35, 126, 0.1)"]}
          style={styles.famousPlacesGradient}
        >
          <Animatable.Text animation="fadeIn" duration={1000} style={styles.famousPlacesTitle}>
            FAMOUS PLACES IN INDIA
          </Animatable.Text>
          <Text style={styles.famousPlacesSubtitle}>
            Explore India's most famous cities, each offering unique attractions and cultural experiences.
          </Text>

          <View style={styles.statesContainer}>
            {Object.entries(cities).map(([state, cityList]) => (
              <View key={state} style={styles.stateColumn}>
                <Text style={styles.stateName}>{state.toUpperCase()}</Text>
                {cityList.slice(0, 8).map((city, index) => (
                  <Animatable.View key={city} animation="fadeInLeft" delay={index * 50}>
                    <TouchableOpacity style={styles.cityButton} activeOpacity={0.7}>
                      <Text style={styles.cityText}>{city}</Text>
                    </TouchableOpacity>
                  </Animatable.View>
                ))}
              </View>
            ))}
          </View>
        </LinearGradient>
      </Animatable.View>
    )
  }

  const statusBarHeight = StatusBar.currentHeight || 0

  if (isLoading) {
    return (
      <View style={[styles.container, styles.loadingContainer, { marginTop: statusBarHeight }]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Loading projects...</Text>
      </View>
    )
  }

  return (
    <View style={[styles.container, { marginTop: statusBarHeight }]}>
      <Animated.ScrollView
        ref={scrollViewRef}
        style={styles.scrollView}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: true })}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
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
            🏡 Hot Properties Available! | Book Your Dream Home Now! | Contact Us for Exclusive Offers! 🏘️
          </Animated.Text>
        </LinearGradient>

        <ImageBackground source={require("../assets/images/newprojectspagebg.png")} style={styles.backgroundImage}>
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
              <Animatable.Text animation="pulse" iterationCount="infinite" duration={2000} style={styles.formTitle}>
                PROPERTY INQUIRY
              </Animatable.Text>

              <TextInput
                style={styles.input}
                placeholder="Enter Your Name *"
                placeholderTextColor="rgba(255,255,255,0.7)"
                value={formData.name}
                onChangeText={(text) => setFormData({ ...formData, name: text })}
              />

              <TextInput
                style={styles.input}
                placeholder="Enter Your Phone Number *"
                placeholderTextColor="rgba(255,255,255,0.7)"
                keyboardType="phone-pad"
                value={formData.phone}
                onChangeText={(text) => setFormData({ ...formData, phone: text })}
              />

              <TextInput
                style={styles.input}
                placeholder="Enter Your Email *"
                placeholderTextColor="rgba(255,255,255,0.7)"
                keyboardType="email-address"
                value={formData.email}
                onChangeText={(text) => setFormData({ ...formData, email: text })}
              />

              <TextInput
                style={styles.input}
                placeholder="Preferred Location"
                placeholderTextColor="rgba(255,255,255,0.7)"
                value={formData.location}
                onChangeText={(text) => setFormData({ ...formData, location: text })}
              />

              <TextInput
                style={styles.input}
                placeholder="Property Type (Apartment/Villa/Plot)"
                placeholderTextColor="rgba(255,255,255,0.7)"
                value={formData.propertyType}
                onChangeText={(text) => setFormData({ ...formData, propertyType: text })}
              />

              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Enter a Description (e.g., specific requirements)"
                placeholderTextColor="rgba(255,255,255,0.7)"
                multiline
                numberOfLines={4}
                value={formData.description}
                onChangeText={(text) => setFormData({ ...formData, description: text })}
              />

              <TouchableOpacity
                style={[styles.submitButton, isSubmitting && styles.disabledButton]}
                onPress={handleSubmit}
                disabled={isSubmitting}
                activeOpacity={0.8}
              >
                {isSubmitting ? (
                  <View style={styles.loadingButtonContent}>
                    <ActivityIndicator size="small" color="#fff" />
                    <Text style={styles.submitButtonText}>SUBMITTING...</Text>
                  </View>
                ) : (
                  <Text style={styles.submitButtonText}>SUBMIT</Text>
                )}
              </TouchableOpacity>
            </BlurView>
          </Animated.View>
        </ImageBackground>

        <View style={styles.projectsSection}>
          <Animatable.Text animation="fadeIn" duration={1000} style={styles.sectionTitle}>
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
              onPress={() => {
                setActiveTab("residential")
                setCurrentPage(1)
              }}
              activeOpacity={0.7}
            >
              <Text style={[styles.tabText, activeTab === "residential" && styles.activeTabText]}>
                🏠 Residential Projects
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.tab}
              onPress={() => {
                setActiveTab("commercial")
                setCurrentPage(1)
              }}
              activeOpacity={0.7}
            >
              <Text style={[styles.tabText, activeTab === "commercial" && styles.activeTabText]}>
                🏢 Commercial Projects
              </Text>
            </TouchableOpacity>
          </View>

          {isLoadingProjects ? (
            <View style={styles.projectsLoadingContainer}>
              <ActivityIndicator size="large" color={COLORS.primary} />
              <Text style={styles.loadingText}>Loading projects...</Text>
            </View>
          ) : (
            <MotiView
              from={{ opacity: 0, translateY: 20 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ type: "timing", duration: 500 }}
            >
              <FlatList
                data={
                  activeTab === "residential"
                    ? residentialProjects.slice((currentPage - 1) * PROJECTS_PER_PAGE, currentPage * PROJECTS_PER_PAGE)
                    : commercialProjects.slice((currentPage - 1) * PROJECTS_PER_PAGE, currentPage * PROJECTS_PER_PAGE)
                }
                renderItem={renderProjectCard}
                keyExtractor={(item) => item._id}
                scrollEnabled={false}
                ItemSeparatorComponent={() => <View style={{ height: 20 }} />}
                ListEmptyComponent={() => (
                  <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>No {activeTab} projects available at the moment.</Text>
                  </View>
                )}
              />
            </MotiView>
          )}

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
          <Animatable.View animation="zoomIn" duration={400} style={styles.modalContent}>
            {selectedProject && (
              <>
                <View style={styles.modalImageContainer}>
                  <Image
                    source={
                      typeof selectedProject.images[0] === "string"
                        ? { uri: selectedProject.images[0] }
                        : selectedProject.images[0] || require("../assets/images/newproject1.png")
                    }
                    style={styles.modalImage}
                  />
                  <LinearGradient
                    colors={["rgba(0,0,0,0)", "transparent"]}
                    style={styles.modalImageGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 0.6 }}
                  />
                </View>

                <ScrollView style={styles.modalScrollView}>
                  <Text style={styles.modalTitle}>{selectedProject.title}</Text>
                  <View style={styles.modalInfoRow}>
                    <Text style={styles.modalLocation}>📍 {selectedProject.address}</Text>
                    {selectedProject.rating && <Text style={styles.modalRating}>★ {selectedProject.rating}</Text>}
                  </View>

                  <View style={styles.statusContainer}>
                    <Text
                      style={[
                        styles.modalStatus,
                        {
                          color: new Date(selectedProject.possession) > new Date() ? "#FF9800" : "#4CAF50",
                        },
                      ]}
                    >
                      {new Date(selectedProject.possession) > new Date()
                        ? "Under Construction"
                        : "Construction Completed"}
                    </Text>
                  </View>

                  {selectedProject.price && (
                    <View style={styles.priceContainer}>
                      <Text style={styles.priceLabel}>Price Range:</Text>
                      <Text style={styles.priceValue}>{selectedProject.price}</Text>
                    </View>
                  )}

                  {new Date(selectedProject.possession) > new Date() && (
                    <View style={styles.possessionContainer}>
                      <Text style={styles.possessionLabel}>Possession:</Text>
                      <Text style={styles.possessionValue}>
                        {new Date(selectedProject.possession).toLocaleString("default", {
                          month: "long",
                          year: "numeric",
                        })}
                      </Text>
                    </View>
                  )}

                  <Text style={styles.modalDescription}>{selectedProject.description}</Text>
                </ScrollView>

                <View style={styles.modalButtons}>
                  <TouchableOpacity style={styles.modalButton} onPress={() => setSelectedProject(null)}>
                    <Text style={styles.modalButtonCloseText}>Close</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.modalInquiryButton]}
                    onPress={() => {
                      handleInquiryClick(selectedProject._id)
                      setSelectedProject(null)
                    }}
                  >
                    <Text style={styles.modalButtonText}>Inquiry</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </Animatable.View>
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
            <TouchableOpacity style={styles.inquiryModalCloseButton} onPress={() => setInquiryModalVisible(false)}>
              <Icon name="close" size={30} color={COLORS.text} />
            </TouchableOpacity>

            <Text style={styles.inquiryModalTitle}>Contact for Inquiry</Text>

            <View style={styles.inquiryModalDetails}>
              <Text style={styles.inquiryModalLabel}>CONTACT DETAILS:</Text>
              <TouchableOpacity onPress={() => Alert.alert("Email", "admin@sample.com")} style={styles.contactButton}>
                <Text style={styles.inquiryModalValue}>📧 admin@sample.com</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => Alert.alert("Phone", "1234567890")} style={styles.contactButton}>
                <Text style={styles.inquiryModalValue}>📞 1234567890</Text>
              </TouchableOpacity>

              <View style={styles.divider} />

              <Text style={styles.inquiryModalNote}>
                Our team will contact you within 24 hours to discuss your requirements.
              </Text>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: COLORS.textLight,
  },
  marqueeContainer: {
    height: 35,
    overflow: "hidden",
    justifyContent: "center",
  },
  marqueeText: {
    width: 1000,
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
    paddingVertical: 8,
  },
  scrollView: {
    flex: 1,
  },
  backgroundImage: {
    height: 600,
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
    fontSize: 22,
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
    padding: 12,
    marginBottom: 15,
    color: "#fff",
    fontSize: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  submitButton: {
    backgroundColor: COLORS.primary,
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  disabledButton: {
    opacity: 0.6,
  },
  loadingButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  projectsSection: {
    padding: 20,
  },
  projectsLoadingContainer: {
    padding: 40,
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: COLORS.primary,
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
    width: 175,
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
    fontSize: 14,
    color: "#757575",
    fontWeight: "500",
  },
  activeTabText: {
    color: COLORS.primary,
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
    height: 175,
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
    fontSize: 10,
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
    fontSize: 10,
    fontWeight: "bold",
  },
  projectInfo: {
    padding: 15,
  },
  projectTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.primary,
    marginBottom: 5,
  },
  locationContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },
  projectLocation: {
    fontSize: 12,
    color: "#757575",
  },
  projectPrice: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: "bold",
  },
  projectPossession: {
    fontSize: 12,
    color: "#757575",
    marginBottom: 10,
  },
  projectButtons: {
    flexDirection: "row",
    marginTop: 10,
    gap: 10,
  },
  viewButton: {
    flex: 1,
    backgroundColor: COLORS.primary,
    padding: 10,
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
    padding: 10,
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
    fontSize: 12,
    fontWeight: "bold",
  },
  emptyContainer: {
    padding: 40,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.textLight,
    textAlign: "center",
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
    backgroundColor: COLORS.primary,
  },
  pageButtonText: {
    color: "#757575",
    fontSize: 14,
    fontWeight: "bold",
  },
  disabledText: {
    color: "#ccc",
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
  modalScrollView: {
    padding: 20,
    maxHeight: 350,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: COLORS.primary,
    marginBottom: 10,
  },
  modalInfoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },
  modalLocation: {
    fontSize: 14,
    color: "#757575",
  },
  modalRating: {
    fontSize: 14,
    color: "#FFC107",
    fontWeight: "bold",
  },
  statusContainer: {
    marginBottom: 15,
  },
  modalStatus: {
    fontSize: 14,
    fontWeight: "bold",
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
    fontSize: 12,
    color: "#757575",
    marginRight: 5,
  },
  priceValue: {
    fontSize: 14,
    color: COLORS.primary,
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
    fontSize: 12,
    color: "#757575",
    marginRight: 5,
  },
  possessionValue: {
    fontSize: 14,
    color: "#4CAF50",
    fontWeight: "bold",
  },
  modalDescription: {
    fontSize: 14,
    color: "#424242",
    marginBottom: 20,
    lineHeight: 24,
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
    color: COLORS.text,
    fontSize: 14,
    fontWeight: "bold",
  },
  modalInquiryButton: {
    backgroundColor: COLORS.primary,
  },
  modalButtonText: {
    color: "#fff",
    fontSize: 14,
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
    fontSize: 22,
    fontWeight: "bold",
    color: COLORS.primary,
    textAlign: "center",
    marginBottom: 10,
    textShadowColor: "rgba(26, 35, 126, 0.2)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  famousPlacesSubtitle: {
    fontSize: 14,
    color: "#757575",
    textAlign: "center",
    marginBottom: 30,
    lineHeight: 24,
  },
  statesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 20,
  },
  stateColumn: {
    flex: 1,
    minWidth: "45%",
  },
  stateName: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.primary,
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
    fontSize: 12,
    color: "#424242",
    fontWeight: "500",
  },
  // Inquiry Modal Styles
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
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 20,
    color: COLORS.text,
    textAlign: "center",
  },
  inquiryModalDetails: {
    width: "100%",
    marginBottom: 20,
  },
  inquiryModalLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.textLight,
    marginBottom: 10,
  },
  contactButton: {
    padding: 12,
    backgroundColor: "rgba(26, 35, 126, 0.05)",
    borderRadius: 8,
    marginBottom: 10,
  },
  inquiryModalValue: {
    fontSize: 16,
    color: COLORS.text,
    fontWeight: "500",
  },
  divider: {
    height: 1,
    backgroundColor: "#DDD",
    marginVertical: 16,
  },
  inquiryModalNote: {
    fontSize: 12,
    color: COLORS.textLight,
    textAlign: "center",
    fontStyle: "italic",
  },
})
