"use client"

import { useState, useEffect, useRef } from "react"
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Image,
  Modal,
  Dimensions,
  ScrollView,
  type NativeSyntheticEvent,
  type NativeScrollEvent,
  ActivityIndicator,
  Alert,
} from "react-native"
import { useNavigation } from "expo-router"
import Icon from "react-native-vector-icons/MaterialCommunityIcons"
import { LinearGradient } from "expo-linear-gradient"
import AsyncStorage from "@react-native-async-storage/async-storage"
import axios from "axios"
import { BASE_URL } from "@env"

const { width } = Dimensions.get("window")
const cardWidth = width * 0.85

interface Project {
  _id: string
  name: string
  title: string
  address: string
  status: string
  images: string[]
  description: string
  minPrice: string
  maxPrice: string
  possession: string
  rating?: number
}

export default function RecommendedProjectsSection() {
  const navigation = useNavigation()

  // State management
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [inquiryModalVisible, setInquiryModalVisible] = useState(false)
  const [inquiryLoading, setInquiryLoading] = useState(false)

  const scrollRef = useRef<ScrollView>(null)
  const scrollX = useRef(new Animated.Value(0)).current

  // Fetch projects from API
  const fetchProjects = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await axios.get(`${BASE_URL}/api/projects`) as any
      setProjects(response.data)
    } catch (error) {
      console.error("Error fetching projects:", error)
      setError("Failed to load projects. Please try again.")
      // Show alert for user feedback
      Alert.alert("Error", "Failed to load projects. Please check your internet connection and try again.", [
        { text: "OK" },
      ])
    } finally {
      setLoading(false)
    }
  }

  // Handle project inquiry
  const handleInquiryClick = async (projectId: string) => {
    try {
      setInquiryLoading(true)

      // Check if user is authenticated
      const token = await AsyncStorage.getItem("auth")

      if (!token) {
        Alert.alert("Authentication Required", "You must be logged in to send a project enquiry.", [{ text: "OK" }])
        return
      }

      // Send inquiry request
      await axios.post(
        `${BASE_URL}/api/project-enquiry`,
        { project_id: projectId },
        { headers: { Authorization: token } },
      )

      // Show success message
      Alert.alert("Success", "Project enquiry submitted to agent successfully.", [{ text: "OK" }])

      setInquiryModalVisible(false)
    } catch (error) {
      console.error("Error submitting project enquiry:", error)
      Alert.alert("Error", "Failed to submit enquiry. Please try again.", [{ text: "OK" }])
    } finally {
      setInquiryLoading(false)
    }
  }

  // Initial data fetch
  useEffect(() => {
    fetchProjects()
  }, [])

  // Auto-scroll functionality
  useEffect(() => {
    if (projects.length === 0) return

    const interval = setInterval(() => {
      if (currentIndex < projects.length - 1) {
        setCurrentIndex(currentIndex + 1)
      } else {
        setCurrentIndex(0)
      }
    }, 5000)
    return () => clearInterval(interval)
  }, [currentIndex, projects.length])

  // Scroll to current index
  useEffect(() => {
    if (scrollRef.current && projects.length > 0) {
      scrollRef.current.scrollTo({
        x: currentIndex * (cardWidth + 15),
        animated: true,
      })
    }
  }, [currentIndex])

  // Handle scroll events
  const handleScroll = Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], { useNativeDriver: false })

  const handleMomentumScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const newIndex = Math.round(event.nativeEvent.contentOffset.x / (cardWidth + 15))
    setCurrentIndex(newIndex)
  }

  // Format date for possession
  const formatPossessionDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    } catch {
      return dateString
    }
  }

  // Render project card
  const renderCard = (proj: Project) => (
    <View key={proj._id} style={[styles.projectCard, { width: cardWidth }]}>
      <View style={styles.projectImageContainer}>
        <Image
          source={proj.images?.[0] ? {
            uri: proj.images?.[0],
          } : require("../../assets/images/dummyImg.webp")}
          style={styles.projectImage}
          defaultSource={require("../../assets/images/dummyImg.webp")}
        />
        <LinearGradient
          colors={["rgba(0,0,0,0)", "transparent"]}
          style={styles.imageGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 0.6 }}
        />
        {proj.status && (
          <View style={styles.projectBadge}>
            <Text style={styles.projectBadgeText}>{proj.status}</Text>
          </View>
        )}
        {proj.rating && (
          <View style={styles.ratingBadge}>
            <Text style={styles.ratingText}>★ {proj.rating}</Text>
          </View>
        )}
      </View>
      <View style={styles.projectInfo}>
        <Text style={styles.projectTitle}>{proj.name || proj.title}</Text>
        <View style={styles.locationContainer}>
          <Text style={styles.projectLocation}>📍 {proj.address}</Text>
          {proj.minPrice && proj.maxPrice && (
            <Text style={styles.projectPrice}>
              {proj.minPrice} - {proj.maxPrice}
            </Text>
          )}
        </View>
        {proj.possession && (
          <Text style={styles.projectPossession}>🗓️ Possession: {formatPossessionDate(proj.possession)}</Text>
        )}

        <View style={styles.projectButtons}>
          <TouchableOpacity style={styles.viewButton} onPress={() => setSelectedProject(proj)} activeOpacity={0.8}>
            <Text style={styles.buttonText}>View Details</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.inquiryButton}
            activeOpacity={0.8}
            onPress={() => handleInquiryClick(proj._id)}
            disabled={inquiryLoading}
          >
            {inquiryLoading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Inquiry</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )

  // Loading state
  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#4F46E5" />
        <Text style={styles.loadingText}>Loading projects...</Text>
      </View>
    )
  }

  // Error state
  if (error && projects.length === 0) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Icon name="alert-circle-outline" size={48} color="#EF4444" />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchProjects}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    )
  }

  // Empty state
  if (projects.length === 0) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Icon name="home-search-outline" size={48} color="#9CA3AF" />
        <Text style={styles.emptyText}>No projects available</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <View style={styles.headerLeftSection}>
          <View style={styles.headerAccent} />
          <Text style={styles.heading}>Recommended Projects</Text>
        </View>
      </View>

      {/* Projects scroll view */}
      <Animated.ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollView}
        snapToInterval={cardWidth + 15}
        decelerationRate="fast"
        onScroll={handleScroll}
        onMomentumScrollEnd={handleMomentumScrollEnd}
      >
        {projects.map((proj) => renderCard(proj))}
      </Animated.ScrollView>

      {/* Pagination dots */}
      <View style={styles.paginationContainer}>
        {projects.map((_, index) => {
          const inputRange = [(index - 1) * (cardWidth + 15), index * (cardWidth + 15), (index + 1) * (cardWidth + 15)]

          const dotWidth = scrollX.interpolate({
            inputRange,
            outputRange: [8, 16, 8],
            extrapolate: "clamp",
          })

          const opacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.3, 1, 0.3],
            extrapolate: "clamp",
          })

          return <Animated.View key={index} style={[styles.paginationDot, { width: dotWidth, opacity }]} />
        })}
      </View>

      {/* See More Button */}
      <TouchableOpacity
        onPress={() => {
          navigation.navigate("NewProjectsPage" as never)
        }}
      >
        <Text style={styles.seeMore}>See More</Text>
      </TouchableOpacity>

      {/* Project Details Modal */}
      <Modal
        visible={!!selectedProject}
        animationType="fade"
        transparent
        onRequestClose={() => setSelectedProject(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            {selectedProject && (
              <>
                <TouchableOpacity style={styles.closeButton} onPress={() => setSelectedProject(null)}>
                  <Icon name="close" size={24} color="#FFF" />
                </TouchableOpacity>

                <Image
                  source={selectedProject.images?.[0] ? {
                    uri: selectedProject.images?.[0]
                  } : require("../../assets/images/dummyImg.webp")}
                  style={styles.modalImage}
                  defaultSource={require("../../assets/images/dummyImg.webp")}
                />

                <ScrollView style={styles.modalScrollView}>
                  <Text style={styles.modalTitle}>{selectedProject.name || selectedProject.title}</Text>
                  <View style={styles.modalInfoRow}>
                    <Text style={styles.modalLocation}>📍 {selectedProject.address}</Text>
                    {selectedProject.rating && <Text style={styles.modalRating}>★ {selectedProject.rating}</Text>}
                  </View>
                  <Text style={styles.modalStatus}>{selectedProject.status}</Text>

                  {selectedProject.minPrice && selectedProject.maxPrice && (
                    <View style={styles.priceContainer}>
                      <Text style={styles.priceLabel}>Price Range:</Text>
                      <Text style={styles.priceValue}>
                        {selectedProject.minPrice} - {selectedProject.maxPrice}
                      </Text>
                    </View>
                  )}

                  {selectedProject.possession && (
                    <View style={styles.possessionContainer}>
                      <Text style={styles.possessionLabel}>Possession:</Text>
                      <Text style={styles.possessionValue}>{formatPossessionDate(selectedProject.possession)}</Text>
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
                    onPress={() => handleInquiryClick(selectedProject._id)}
                    disabled={inquiryLoading}
                  >
                    {inquiryLoading ? (
                      <ActivityIndicator size="small" color="#fff" />
                    ) : (
                      <Text style={styles.modalButtonText}>Inquiry</Text>
                    )}
                  </TouchableOpacity>
                </View>
              </>
            )}
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
            <TouchableOpacity style={styles.inquiryModalCloseButton} onPress={() => setInquiryModalVisible(false)}>
              <Icon name="close" size={30} color="#232761" />
            </TouchableOpacity>

            <Text style={styles.inquiryModalTitle}>You are requesting to view advertiser details</Text>

            <View style={styles.inquiryModalDetails}>
              <Text style={styles.inquiryModalLabel}>POSTED BY AGENT:</Text>
              <Text style={styles.inquiryModalValue}>+91 988** **** | i********@gmail.com</Text>
              <Text style={styles.inquiryModalValue}>VISHAL KATE</Text>

              <View style={styles.divider} />

              <Text style={styles.inquiryModalLabel}>POSTED ON 17th DEC, 2024</Text>
              <Text style={styles.inquiryModalValue}>₹ 15 Lac | Phule Nagar Akkuj</Text>
              <Text style={styles.inquiryModalValue}>2 Guntha | Residential Land</Text>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 15,
    paddingVertical: 20,
    backgroundColor: "#F5F5F5",
    marginTop: 10,
  },
  centerContent: {
    justifyContent: "center",
    alignItems: "center",
    minHeight: 200,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 25,
  },
  headerLeftSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerAccent: {
    width: 4,
    height: 24,
    backgroundColor: "#4F46E5",
    borderRadius: 2,
    marginRight: 12,
  },
  heading: {
    fontSize: 25,
    fontWeight: "700",
    color: "#1F2937",
    letterSpacing: -0.5,
  },
  scrollView: {
    flexDirection: "row",
    paddingBottom: 10,
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
    width: "100%",
    height: 160,
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
    fontSize: 16,
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
    fontSize: 12,
    color: "#757575",
    flex: 1,
  },
  projectPrice: {
    fontSize: 12,
    color: "#1a237e",
    fontWeight: "bold",
  },
  projectPossession: {
    fontSize: 12,
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
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  paginationDot: {
    height: 8,
    borderRadius: 4,
    backgroundColor: "#1E3A8A",
    marginHorizontal: 4,
  },
  seeMore: {
    fontSize: 16,
    color: "#4A4A9C",
    fontWeight: "500",
    marginTop: 16,
    textAlign: "right",
  },
  // Loading states
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#6B7280",
  },
  errorText: {
    marginTop: 10,
    fontSize: 16,
    color: "#EF4444",
    textAlign: "center",
  },
  emptyText: {
    marginTop: 10,
    fontSize: 16,
    color: "#9CA3AF",
  },
  retryButton: {
    marginTop: 15,
    backgroundColor: "#4F46E5",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  // Modal styles (keeping existing styles)
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 15,
    overflow: "hidden",
    elevation: 10,
    maxHeight: "80%",
  },
  closeButton: {
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
  modalImage: {
    width: "100%",
    height: 200,
  },
  modalScrollView: {
    padding: 15,
    maxHeight: 280,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1a237e",
    marginBottom: 6,
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
    flex: 1,
  },
  modalRating: {
    fontSize: 14,
    color: "#FFC107",
    fontWeight: "bold",
  },
  modalStatus: {
    fontSize: 14,
    color: "#4CAF50",
    marginBottom: 10,
  },
  priceContainer: {
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
  possessionContainer: {
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
  // Inquiry modal styles (keeping existing)
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
