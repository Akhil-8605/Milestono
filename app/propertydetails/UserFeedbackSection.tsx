"use client"

import { useState, useEffect, useRef, useCallback, type JSX } from "react"
import { View, Text, Image, ScrollView, StyleSheet, Dimensions, TouchableOpacity, Platform } from "react-native"
import { useNavigation } from "expo-router"
import { LinearGradient } from "expo-linear-gradient"
import { BlurView } from "expo-blur"
import { Star, ChevronRight } from "react-native-feather"
import axios from "axios"
import { BASE_URL } from "@env"

const { width } = Dimensions.get("window")
const cardWidth = width * 0.85

interface Feedback {
  _id: string
  id?: number
  message: string
  user: string
  position: string
  rating: number
  date: string
  verified: boolean
}

export default function UserFeedbackSection() {
  const navigation = useNavigation()
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const scrollViewRef = useRef<ScrollView>(null)
  const fetchingRef = useRef(false)

  const fetchFeedbacks = useCallback(async () => {
    // Prevent multiple simultaneous fetches
    if (fetchingRef.current) {
      return
    }

    fetchingRef.current = true

    try {
      if (!BASE_URL) {
        console.warn("BASE_URL not configured, using mock data")
        return
      }

      const response = await axios.get(`${BASE_URL}/api/feedback`, {
        timeout: 8000,
      })

      if (response.data && Array.isArray(response.data)) {
        // Limit to first 5 feedbacks
        setFeedbacks(response.data.slice(0, 5))
      } else {
        throw new Error("Invalid response format")
      }
    } catch (error) {
      console.error("Error fetching feedbacks:", error)
      // Use mock data as fallback (limited to 5)
    } finally {
      setLoading(false)
      fetchingRef.current = false
    }
  }, [])

  useEffect(() => {
    fetchFeedbacks()
  }, [fetchFeedbacks])

  // Format date to a more readable format
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

  // Render star ratings
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

  // Auto-scroll every 5 seconds
  useEffect(() => {
    if (feedbacks.length === 0) return

    const interval = setInterval(() => {
      const nextIndex = currentIndex === feedbacks.length - 1 ? 0 : currentIndex + 1
      setCurrentIndex(nextIndex)
    }, 5000)
    return () => clearInterval(interval)
  }, [currentIndex, feedbacks.length])

  // Scroll to current index
  useEffect(() => {
    if (scrollViewRef.current && feedbacks.length > 0) {
      scrollViewRef.current.scrollTo({
        x: currentIndex * (cardWidth + 20),
        animated: true,
      })
    }
  }, [currentIndex, feedbacks.length])

  // Handle manual card selection
  const handleCardPress = (index: number) => {
    if (index !== currentIndex) {
      setCurrentIndex(index)
    }
  }

  return (
    <View style={styles.outerContainer}>
      <View style={styles.patternBackground} />
      <View style={styles.container}>
        {/* Section Header */}
        <View style={styles.headerContainer}>
          <View style={styles.headerLeftSection}>
            <View style={styles.headerAccent} />
            <Text style={styles.heading}>Client Testimonials</Text>
          </View>
          <TouchableOpacity
            style={styles.viewAllButton}
            onPress={() => navigation.navigate("UserFeedbackPage" as never)}
          >
            <Text style={styles.viewAllText}>View all</Text>
            <ChevronRight width={14} height={14} color="#4A4A9C" strokeWidth={2} />
          </TouchableOpacity>
        </View>

        {/* Scrollable Feedback Cards */}
        <ScrollView
          ref={scrollViewRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollView}
          snapToInterval={cardWidth + 20}
          decelerationRate="fast"
          onMomentumScrollEnd={(event) => {
            const newIndex = Math.round(event.nativeEvent.contentOffset.x / (cardWidth + 20))
            if (newIndex >= 0 && newIndex < feedbacks.length) {
              setCurrentIndex(newIndex)
            }
          }}
        >
          {feedbacks.map((feedback, index) => (
            <TouchableOpacity key={feedback._id} activeOpacity={0.95} onPress={() => handleCardPress(index)}>
              {Platform.OS === "ios" ? (
                <BlurView
                  intensity={index === currentIndex ? 0 : 50}
                  tint="light"
                  style={[styles.card, styles.activeCard]}
                >
                  <CardContent
                    feedback={feedback}
                    isActive={index === currentIndex}
                    formatDate={formatDate}
                    renderRating={renderRating}
                  />
                </BlurView>
              ) : (
                <View
                  style={[
                    styles.card,
                    { width: cardWidth },
                    index === currentIndex && styles.activeCard,
                    {
                      backgroundColor: index === currentIndex ? "#ffffff" : "#f8f8f8",
                    },
                  ]}
                >
                  <CardContent
                    feedback={feedback}
                    isActive={index === currentIndex}
                    formatDate={formatDate}
                    renderRating={renderRating}
                  />
                </View>
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Pagination Dots */}
        <View style={styles.paginationContainer}>
          {feedbacks.map((_, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => handleCardPress(index)}
              style={[styles.paginationDot, index === currentIndex && styles.activePaginationDot]}
            />
          ))}
        </View>
      </View>
    </View>
  )
}

// Separate component for card content to improve readability
function CardContent({
  feedback,
  isActive,
  formatDate,
  renderRating,
}: {
  feedback: Feedback
  isActive: boolean
  formatDate: (date: string) => string
  renderRating: (rating: number) => JSX.Element
}) {
  return (
    <>
      <LinearGradient
        colors={isActive ? ["#6366F1", "#4F46E5"] : ["transparent", "transparent"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.cardHeader}
      >
        <View style={styles.quoteIconContainer}>
          <Text style={[styles.quoteIcon, { color: isActive ? "#fff" : "#6366F1" }]}>"</Text>
        </View>
        {renderRating(feedback.rating)}
      </LinearGradient>

      <View style={styles.messageContainer}>
        <Text style={[styles.message, isActive && styles.activeMessage]} numberOfLines={4} ellipsizeMode="tail">
          {feedback.message}
        </Text>

        {feedback.message.length > 120 && (
          <TouchableOpacity style={styles.readMoreButton}>
            <Text style={styles.readMoreText}>Read more</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.cardFooter}>
        <View style={styles.userInfo}>
          <View style={[styles.avatarContainer, isActive && styles.activeAvatarContainer]}>
            <Image source={require("../../assets/images/PersonDummy.png")} style={styles.avatar} />
            {feedback.verified && (
              <View style={styles.verifiedBadge}>
                <Text style={styles.verifiedText}>✓</Text>
              </View>
            )}
          </View>
          <View style={styles.userTextContainer}>
            <Text style={[styles.userName, isActive && styles.activeUserName]}>{feedback.user}</Text>
            <Text style={styles.userPosition}>{feedback.position}</Text>
            <Text style={[styles.date, isActive && styles.activeDate]}>{formatDate(feedback.date)}</Text>
          </View>
        </View>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  outerContainer: {
    position: "relative",
    marginTop: 15,
    marginBottom: 15,
    paddingBottom: 10,
  },
  patternBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 25,
    borderColor: "rgba(230, 230, 250, 0.5)",
  },
  container: {
    paddingHorizontal: 15,
    paddingVertical: 25,
    borderRadius: 25,
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
    height: 20,
    backgroundColor: "#232761",
    borderRadius: 2,
    marginRight: 12,
  },
  heading: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1F2937",
    letterSpacing: -0.5,
  },
  viewAllButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: "rgba(74, 74, 156, 0.08)",
    borderRadius: 20,
  },
  viewAllText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#4A4A9C",
    marginRight: 4,
  },
  scrollView: {
    flexDirection: "row",
    paddingBottom: 15,
    paddingTop: 5,
    paddingHorizontal: 5,
  },
  card: {
    borderRadius: 16,
    marginRight: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 5 },
    elevation: 5,
    backgroundColor: "#ffffff",
  },
  activeCard: {
    shadowColor: "#4F46E5",
    shadowOpacity: 0.2,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
    elevation: 10,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.05)",
  },
  quoteIconContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  quoteIcon: {
    fontSize: 24,
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
    fontSize: 14,
    fontWeight: "400",
    color: "#4B5563",
    lineHeight: 24,
    letterSpacing: 0.1,
  },
  activeMessage: {
    color: "#1F2937",
  },
  readMoreButton: {
    alignSelf: "flex-start",
    marginTop: 8,
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
  },
  activeAvatarContainer: {
    borderColor: "#4F46E5",
  },
  avatar: {
    width: 40,
    height: 40,
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
    marginLeft: 15,
  },
  userName: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1F2937",
    letterSpacing: -0.3,
  },
  activeUserName: {
    color: "#1F2937",
  },
  userPosition: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 2,
  },
  date: {
    fontSize: 10,
    color: "#9CA3AF",
    marginTop: 4,
  },
  activeDate: {
    color: "#6B7280",
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 25,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#D1D5DB",
    marginHorizontal: 5,
    opacity: 0.5,
  },
  activePaginationDot: {
    width: 24,
    backgroundColor: "#232761",
    opacity: 1,
  },
})
