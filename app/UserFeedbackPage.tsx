"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  Pressable,
  StatusBar,
  Image,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { Star } from "react-native-feather"
import * as Animatable from "react-native-animatable"
import axios from "axios"
import Header from "./components/Header"
import { BASE_URL } from "@env"

type Feedback = {
  _id: string
  id?: number
  message: string
  user: string
  position: string
  rating: number
  date: string
  verified: boolean
}

const ITEMS_PER_PAGE_OPTIONS: (number | "All")[] = [4, 10, 20, "All"]

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffTime = Math.abs(now.getTime() - date.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays <= 7) {
    return `${diffDays} ${diffDays === 1 ? "day" : "days"} ago`
  } else {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }
}

const renderRating = (rating: number) => {
  return (
    <View style={styles.ratingContainer}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          fill={star <= rating ? "#FFD700" : "none"}
          stroke={star <= rating ? "#FFD700" : "#D0D0D0"}
          width={16}
          height={16}
          strokeWidth={1.5}
        />
      ))}
    </View>
  )
}

function CardContent({ feedback, index }: { feedback: Feedback; index: number }) {
  const [expanded, setExpanded] = useState(false)
  const shouldShowReadMore = feedback.message.length > 120

  return (
    <Animatable.View animation="fadeInUp" delay={index * 100} duration={600} style={styles.card}>
      <LinearGradient
        colors={["#6366F1", "#4F46E5"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.cardHeader}
      >
        <View style={styles.quoteIconContainer}>
          <Text style={styles.quoteIconText}>"</Text>
        </View>
        {renderRating(feedback.rating)}
      </LinearGradient>

      <View style={styles.messageContainer}>
        <Text style={styles.message} numberOfLines={expanded ? undefined : 4} ellipsizeMode="tail">
          {feedback.message}
        </Text>
        {shouldShowReadMore && (
          <TouchableOpacity style={styles.readMoreButton} onPress={() => setExpanded(!expanded)} activeOpacity={0.7}>
            <Text style={styles.readMoreText}>{expanded ? "Read less" : "Read more"}</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.cardFooter}>
        <View style={styles.userInfo}>
          <View style={styles.avatarContainer}>
            <Image source={require("../assets/images/PersonDummy.png")} style={styles.avatar} />
            {feedback.verified && (
              <View style={styles.verifiedBadge}>
                <Text style={styles.verifiedText}>✓</Text>
              </View>
            )}
          </View>
          <View style={styles.userTextContainer}>
            <Text style={styles.userName}>{feedback.user}</Text>
            <Text style={styles.userPosition}>{feedback.position}</Text>
            <Text style={styles.date}>{formatDate(feedback.date)}</Text>
          </View>
        </View>
      </View>
    </Animatable.View>
  )
}

const UserFeedbackPage = () => {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState<number | "All">(4)
  const [showModal, setShowModal] = useState(false)
  const fetchingRef = useRef(false)

  // Mock data as fallback
  const mockFeedbacks: Feedback[] = [
    {
      _id: "1",
      message:
        "Milestono has transformed how we manage our projects. The interface is intuitive and the support team is exceptional.",
      user: "Vijay Kumar",
      position: "Project Manager",
      rating: 5,
      date: "2025-01-25",
      verified: true,
    },
    {
      _id: "2",
      message:
        "Great Service! The team went above and beyond to ensure our needs were met. Highly satisfied with the results.",
      user: "Rahul Singh",
      position: "CEO",
      rating: 4,
      date: "2025-02-01",
      verified: true,
    },
    {
      _id: "3",
      message:
        "Highly recommended! The platform is robust and reliable. It has significantly improved our workflow efficiency.",
      user: "Sneha Patel",
      position: "Tech Lead",
      rating: 5,
      date: "2025-02-05",
      verified: false,
    },
    {
      _id: "4",
      message: "The user interface is clean and easy to navigate. I appreciate the detailed analytics provided.",
      user: "Arjun Mehta",
      position: "Data Analyst",
      rating: 4,
      date: "2025-02-10",
      verified: true,
    },
    {
      _id: "5",
      message: "Customer support was prompt and very helpful. It really made a difference.",
      user: "Priya Sharma",
      position: "Operations Manager",
      rating: 5,
      date: "2025-02-12",
      verified: true,
    },
  ]

  const fetchFeedbacks = useCallback(async (showLoading = true) => {
    // Prevent multiple simultaneous fetches
    if (fetchingRef.current) {
      return
    }

    fetchingRef.current = true

    try {
      if (showLoading) {
        setLoading(true)
      }

      if (!BASE_URL) {
        console.warn("BASE_URL not configured, using mock data")
        setFeedbacks(mockFeedbacks)
        return
      }

      const response = await axios.get(`${BASE_URL}/api/feedback`, {
        timeout: 10000,
      })

      if (response.data && Array.isArray(response.data)) {
        setFeedbacks(response.data)
      } else {
        throw new Error("Invalid response format")
      }
    } catch (error) {
      console.error("Error fetching feedbacks:", error)

      // Use mock data as fallback
      setFeedbacks(mockFeedbacks)

      if (showLoading) {
        Alert.alert("Connection Issue", "Unable to load latest feedbacks. Showing cached data.", [
          {
            text: "Retry",
            onPress: () => fetchFeedbacks(true),
          },
          { text: "OK", style: "cancel" },
        ])
      }
    } finally {
      setLoading(false)
      setRefreshing(false)
      fetchingRef.current = false
    }
  }, [])

  useEffect(() => {
    fetchFeedbacks()
  }, [fetchFeedbacks])

  const onRefresh = useCallback(() => {
    setRefreshing(true)
    setLoading(true)
    fetchFeedbacks(false)
  }, [fetchFeedbacks])

  const totalPages = itemsPerPage === "All" ? 1 : Math.ceil(feedbacks.length / Number(itemsPerPage))

  const getCurrentData = () => {
    if (itemsPerPage === "All") return feedbacks
    const begin = (currentPage - 1) * Number(itemsPerPage)
    const end = begin + Number(itemsPerPage)
    return feedbacks.slice(begin, end)
  }

  const renderPaginationButtons = () => {
    const buttons = []
    const maxVisiblePages = 5
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2))
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1)
    }

    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <TouchableOpacity
          key={i}
          style={[styles.pageButton, currentPage === i && styles.activePageButton]}
          onPress={() => setCurrentPage(i)}
          activeOpacity={0.7}
        >
          <Text style={[styles.pageButtonText, currentPage === i && styles.activePageButtonText]}>{i}</Text>
        </TouchableOpacity>,
      )
    }
    return buttons
  }

  const handleItemsPerPageChange = (option: number | "All") => {
    setItemsPerPage(option)
    setCurrentPage(1)
    setShowModal(false)
  }

  const statusBarHeight = StatusBar.currentHeight || 0

  if (loading) {
    return (
      <View style={{ flex: 1, marginTop: statusBarHeight }}>
        <Header />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6366F1" />
          <Text style={styles.loadingText}>Loading feedbacks...</Text>
        </View>
      </View>
    )
  }

  return (
    <View style={{ flex: 1, marginTop: statusBarHeight }}>
      <Header />
      <View style={styles.container}>
        <Animatable.View animation="fadeInDown" duration={600} style={styles.header}>
          <LinearGradient
            colors={["#6366F1", "#4F46E5"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.headerGradient}
          >
            <Text style={styles.title}>Client Feedbacks</Text>
            <View style={styles.statsContainer}>
              <Text style={styles.statsText}>{feedbacks.length} Total Reviews</Text>
              <Text style={styles.statsText}>
                ⭐ {(feedbacks.reduce((acc, f) => acc + f.rating, 0) / feedbacks.length || 0).toFixed(1)} Average
              </Text>
            </View>
          </LinearGradient>

          <TouchableOpacity style={styles.dropdown} onPress={() => setShowModal(true)} activeOpacity={0.7}>
            <Text style={styles.dropdownText}>{itemsPerPage === "All" ? "All" : itemsPerPage}</Text>
            <Text style={styles.dropdownArrow}>▼</Text>
          </TouchableOpacity>
        </Animatable.View>

        {feedbacks.length === 0 ? (
          <Animatable.View animation="fadeIn" style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No feedbacks available</Text>
            <TouchableOpacity style={styles.retryButton} onPress={() => fetchFeedbacks()} activeOpacity={0.7}>
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </Animatable.View>
        ) : (
          <FlatList
            data={getCurrentData()}
            renderItem={({ item, index }) => <CardContent feedback={item} index={index} />}
            keyExtractor={(item) => item._id || item.id?.toString() || Math.random().toString()}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#6366F1"]} tintColor="#6366F1" />
            }
          />
        )}

        {feedbacks.length > 0 && totalPages > 1 && (
          <Animatable.View animation="fadeInUp" delay={300} style={styles.pagination}>
            <TouchableOpacity
              style={[styles.pageButton, currentPage === 1 && styles.disabledButton]}
              disabled={currentPage === 1}
              onPress={() => setCurrentPage((prev) => prev - 1)}
              activeOpacity={0.7}
            >
              <Text style={[styles.pageButtonText, currentPage === 1 && styles.disabledButtonText]}>Prev</Text>
            </TouchableOpacity>

            {renderPaginationButtons()}

            <TouchableOpacity
              style={[styles.pageButton, currentPage === totalPages && styles.disabledButton]}
              disabled={currentPage === totalPages}
              onPress={() => setCurrentPage((prev) => prev + 1)}
              activeOpacity={0.7}
            >
              <Text style={[styles.pageButtonText, currentPage === totalPages && styles.disabledButtonText]}>Next</Text>
            </TouchableOpacity>
          </Animatable.View>
        )}

        <Modal visible={showModal} transparent={true} animationType="fade" onRequestClose={() => setShowModal(false)}>
          <Pressable style={styles.modalOverlay} onPress={() => setShowModal(false)}>
            <Animatable.View animation="zoomIn" duration={300} style={styles.modalContent}>
              <Text style={styles.modalTitle}>Items per page</Text>
              {ITEMS_PER_PAGE_OPTIONS.map((option) => (
                <TouchableOpacity
                  key={option.toString()}
                  style={[styles.modalItem, itemsPerPage === option && styles.selectedModalItem]}
                  onPress={() => handleItemsPerPageChange(option)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.modalItemText, itemsPerPage === option && styles.selectedModalItemText]}>
                    {option}
                  </Text>
                  {itemsPerPage === option && <Text style={styles.checkmark}>✓</Text>}
                </TouchableOpacity>
              ))}
            </Animatable.View>
          </Pressable>
        </Modal>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8fafc",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#6B7280",
    fontWeight: "500",
  },
  header: {
    marginBottom: 20,
    borderRadius: 20,
    margin: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 5,
  },
  headerGradient: {
    padding: 20,
    paddingBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#ffffff",
    marginBottom: 8,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statsText: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.9)",
    fontWeight: "500",
  },
  dropdown: {
    position: "absolute",
    top: 20,
    right: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  dropdownText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#ffffff",
    marginRight: 4,
  },
  dropdownArrow: {
    fontSize: 10,
    color: "#ffffff",
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  card: {
    borderRadius: 16,
    marginBottom: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 5 },
    elevation: 5,
    backgroundColor: "#ffffff",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  quoteIconContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  quoteIconText: {
    fontSize: 24,
    color: "#fff",
    fontWeight: "bold",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  messageContainer: {
    padding: 20,
    paddingBottom: 10,
  },
  message: {
    fontSize: 16,
    fontWeight: "400",
    color: "#4B5563",
    lineHeight: 24,
    letterSpacing: 0.1,
  },
  readMoreButton: {
    alignSelf: "flex-start",
    marginTop: 8,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
    backgroundColor: "rgba(79, 70, 229, 0.1)",
  },
  readMoreText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#4F46E5",
  },
  cardFooter: {
    padding: 20,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.03)",
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatarContainer: {
    position: "relative",
    borderWidth: 2,
    borderColor: "#E5E7EB",
    borderRadius: 30,
    padding: 2,
    backgroundColor: "#ffffff",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    marginRight: 15,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  verifiedBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#10B981",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#ffffff",
  },
  verifiedText: {
    color: "#ffffff",
    fontSize: 10,
    fontWeight: "bold",
  },
  userTextContainer: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1F2937",
    letterSpacing: -0.3,
  },
  userPosition: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 2,
  },
  date: {
    fontSize: 12,
    color: "#9CA3AF",
    marginTop: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 18,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: "#6366F1",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16,
    marginBottom: 20,
    paddingHorizontal: 16,
  },
  pageButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 6,
    minWidth: 40,
    alignItems: "center",
    marginHorizontal: 2,
    backgroundColor: "#ffffff",
  },
  activePageButton: {
    backgroundColor: "#6366F1",
    borderColor: "#6366F1",
  },
  disabledButton: {
    backgroundColor: "#F3F4F6",
    borderColor: "#E5E7EB",
  },
  pageButtonText: {
    color: "#374151",
    fontSize: 14,
    fontWeight: "500",
  },
  activePageButtonText: {
    color: "#ffffff",
    fontWeight: "600",
  },
  disabledButtonText: {
    color: "#9CA3AF",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    minWidth: 200,
    maxWidth: 300,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 16,
    textAlign: "center",
  },
  modalItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 4,
  },
  selectedModalItem: {
    backgroundColor: "rgba(99, 102, 241, 0.1)",
  },
  modalItemText: {
    fontSize: 16,
    color: "#374151",
  },
  selectedModalItemText: {
    color: "#6366F1",
    fontWeight: "600",
  },
  checkmark: {
    fontSize: 16,
    color: "#6366F1",
    fontWeight: "bold",
  },
})

export default UserFeedbackPage
