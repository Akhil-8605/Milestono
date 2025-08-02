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
  Alert,
} from "react-native"
import { useNavigation } from "expo-router"
import Icon from "react-native-vector-icons/MaterialCommunityIcons"
import { LinearGradient } from "expo-linear-gradient"
import Toast from "react-native-toast-message"
import axios from "axios"
import { BASE_URL } from "@env"
import AsyncStorage from "@react-native-async-storage/async-storage"

const { width } = Dimensions.get("window")
const cardWidth = width * 0.75
const cardGap = 15

interface Project {
  _id: string
  name: string
  address: string
  status?: string
  images?: string[]
  description?: string
  minPrice?: string
  maxPrice?: string
  possession?: string
  rating?: number
}

export default function RecommendedProjectsSection() {
  const navigation = useNavigation()
  const [projects, setProjects] = useState<Project[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [inquiryModalVisible, setInquiryModalVisible] = useState(false)
  const scrollRef = useRef<ScrollView>(null)
  const scrollX = useRef(new Animated.Value(0)).current

  // Fetch projects from API
  const fetchProjects = async () => {
    try {
      const resp = await axios.get(`${BASE_URL}/api/projects`)
      setProjects(resp.data as Project[])
    } catch (e) {
      console.error("Error fetching projects:", e)
      Toast.show({ type: "error", text1: "Failed to load projects." })
    }
  }

  useEffect(() => {
    fetchProjects()
  }, [])

  // Auto-scroll every 5 seconds
  useEffect(() => {
    const iv = setInterval(() => {
      setCurrentIndex((idx) => (idx < projects.length - 1 ? idx + 1 : 0))
    }, 5000)
    return () => clearInterval(iv)
  }, [projects.length])

  // Scroll to current index
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        x: currentIndex * (cardWidth + cardGap),
        animated: true,
      })
    }
  }, [currentIndex])

  // Handle scroll event
  const handleScroll = Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], { useNativeDriver: false })

  // Snap to index
  const handleMomentumScrollEnd = (e: any) => {
    const newIndex = Math.round(e.nativeEvent.contentOffset.x / (cardWidth + cardGap))
    setCurrentIndex(newIndex)
  }

  // Inquiry handler
  const handleInquiryClick = async (projectId: string) => {
    try {
      const token = await AsyncStorage.getItem("auth")
      if (!token) {
        Alert.alert("Login Required", "Please log in to send an inquiry.")
        return
      }

      await axios.post(
        `${BASE_URL}/api/project-enquiry`,
        { project_id: projectId },
        { headers: { Authorization: token } },
      )
      Toast.show({
        type: "success",
        text1: "Inquiry sent to agent successfully.",
      })
    } catch (e) {
      console.error("Enquiry error:", e)
      Toast.show({
        type: "error",
        text1: "Error submitting enquiry.",
      })
    }
  }

  const renderCard = (proj: Project) => (
    <View key={proj._id} style={[styles.projectCard, { width: cardWidth }]}>
      <View style={styles.projectImageContainer}>
        <Image
          source={proj.images?.[0] ? { uri: proj.images[0] } : require("../../assets/images/dummyImg.webp")}
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
        <Text style={styles.projectTitle}>{proj.name}</Text>
        <View style={styles.locationContainer}>
          <Text style={styles.projectLocation}>📍 {proj.address}</Text>
          {proj.minPrice && proj.maxPrice && (
            <Text style={styles.projectPrice}>
              {proj.minPrice}-{proj.maxPrice}
            </Text>
          )}
        </View>
        {proj.possession && (
          <Text style={styles.projectPossession}>
            🗓️ Possession:{" "}
            {new Date(proj.possession).toLocaleString("default", {
              month: "long",
              year: "numeric",
            })}
          </Text>
        )}
        <View style={styles.projectButtons}>
          <TouchableOpacity style={styles.viewButton} onPress={() => setSelectedProject(proj)} activeOpacity={0.8}>
            <Text style={styles.buttonText}>View Details</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.inquiryButton}
            onPress={() => handleInquiryClick(proj._id)}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>Inquiry</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Recommended Projects</Text>

      <Animated.ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollView}
        snapToInterval={cardWidth + cardGap}
        decelerationRate="fast"
        onScroll={handleScroll}
        onMomentumScrollEnd={handleMomentumScrollEnd}
      >
        {projects.map(renderCard)}
      </Animated.ScrollView>

      <View style={styles.paginationContainer}>
        {projects.map((_, idx) => {
          const inputRange = [
            (idx - 1) * (cardWidth + cardGap),
            idx * (cardWidth + cardGap),
            (idx + 1) * (cardWidth + cardGap),
          ]
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
          return <Animated.View key={idx} style={[styles.paginationDot, { width: dotWidth, opacity }]} />
        })}
      </View>

      <TouchableOpacity onPress={() => navigation.navigate("NewProjectsPage" as never)}>
        <Text style={styles.seeMore}>See More</Text>
      </TouchableOpacity>

      {/* Details Modal */}
      <Modal
        visible={!!selectedProject}
        animationType="fade"
        transparent
        onRequestClose={() => setSelectedProject(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <TouchableOpacity style={styles.closeButton} onPress={() => setSelectedProject(null)}>
              <Icon name="close" size={24} color="#fff" />
            </TouchableOpacity>
            {selectedProject && (
              <>
                <Image
                  source={
                    selectedProject.images?.[0]
                      ? { uri: selectedProject.images[0] }
                      : require("../../assets/images/dummyImg.webp")
                  }
                  style={styles.modalImage}
                />
                <ScrollView style={styles.modalScrollView}>
                  <Text style={styles.modalTitle}>{selectedProject.name}</Text>
                  <View style={styles.modalInfoRow}>
                    <Text style={styles.modalLocation}>📍 {selectedProject.address}</Text>
                    {selectedProject.rating && <Text style={styles.modalRating}>★ {selectedProject.rating}</Text>}
                  </View>
                  {selectedProject.status && <Text style={styles.modalStatus}>{selectedProject.status}</Text>}
                  {selectedProject.minPrice && selectedProject.maxPrice && (
                    <View style={styles.priceContainer}>
                      <Text style={styles.priceLabel}>Price Range:</Text>
                      <Text style={styles.priceValue}>
                        {selectedProject.minPrice}-{selectedProject.maxPrice}
                      </Text>
                    </View>
                  )}
                  {selectedProject.possession && (
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
                  {selectedProject.description && (
                    <Text style={styles.modalDescription}>{selectedProject.description}</Text>
                  )}
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
          </View>
        </View>
      </Modal>

      {/* Inquiry Toast Handler */}
      <Toast />
    </View>
  )
}

/* ---------- STYLES ---------- */
const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 15,
    paddingVertical: 20,
    backgroundColor: "#F5F5F5",
    marginTop: 10,
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
    marginBottom: 25,
    color: "#333333",
  },
  scrollView: {
    flexDirection: "row",
    paddingBottom: 10,
  },
  /* Card Styles */
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
  /* Pagination */
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
  /* "See More" Button */
  seeMore: {
    fontSize: 16,
    color: "#4A4A9C",
    fontWeight: "500",
    marginTop: 16,
    textAlign: "right",
  },
  /* Modal */
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
})
