import { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Animated,
  Platform,
} from "react-native";
import { useNavigation } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import Icon from "react-native-vector-icons/FontAwesome"; 
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

const { width } = Dimensions.get("window");
const cardWidth = width * 0.85;

const feedbacks = [
  {
    id: 1,
    message:
      "Milestono has transformed how we manage our projects. The interface is intuitive and the support team is exceptional.",
    user: "Vijay Kumar",
    position: "Project Manager",
    rating: 5,
    date: "2025-01-25",
    verified: true,
  },
  {
    id: 2,
    message:
      "Great Service! The team went above and beyond to ensure our needs were met. Highly satisfied with the results.",
    user: "Rahul Singh",
    position: "CEO",
    rating: 4,
    date: "2025-02-01",
    verified: true,
  },
  {
    id: 3,
    message:
      "Highly recommended! The platform is robust and reliable. It has significantly improved our workflow efficiency.",
    user: "Sneha Patel",
    position: "Tech Lead",
    rating: 5,
    date: "2025-02-05",
    verified: false,
  },
  {
    id: 1,
    message:
      "Milestono has transformed how we manage our projects. The interface is intuitive and the support team is exceptional.",
    user: "Vijay Kumar",
    position: "Project Manager",
    rating: 5,
    date: "2025-01-25",
    verified: false,
  },
  {
    id: 2,
    message:
      "Great Service! The team went above and beyond to ensure our needs were met. Highly satisfied with the results.",
    user: "Rahul Singh",
    position: "CEO",
    rating: 4,
    date: "2025-02-01",
    verified: true,
  },
  {
    id: 3,
    message:
      "Highly recommended! The platform is robust and reliable. It has significantly improved our workflow efficiency.",
    user: "Sneha Patel",
    position: "Tech Lead",
    rating: 5,
    date: "2025-02-05",
    verified: true,
  },
];

export default function UserFeedbackSection() {
  const navigation = useNavigation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;

  // Format date to a more readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays <= 7) {
      return `${diffDays} ${diffDays === 1 ? "day" : "days"} ago`;
    } else {
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    }
  };

  // Render star ratings
  const renderRating = (rating: number) => {
    return (
      <View style={styles.ratingContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
        <Icon
          key={star}
          name="star"
          size={16}
          color={star <= rating ? "#FFD700" : "#D0D0D0"}
        />
      ))}
      </View>
    );
  };

  // Auto-scroll every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex =
        currentIndex === feedbacks.length - 1 ? 0 : currentIndex + 1;
      setCurrentIndex(nextIndex);

      // Animation sequence
      Animated.parallel([
        Animated.sequence([
          Animated.timing(fadeAnim, {
            toValue: 0.4,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(scaleAnim, {
            toValue: 0.95,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
        ]),
      ]).start();
    }, 5000);
    return () => clearInterval(interval);
  }, [currentIndex, fadeAnim, scaleAnim]);

  // Initial animation
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, scaleAnim]);

  // Scroll to current index
  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({
        x: currentIndex * (cardWidth + 20),
        animated: true,
      });
    }
  }, [currentIndex]);

  // Handle manual card selection
  const handleCardPress = (index: number) => {
    if (index !== currentIndex) {
      setCurrentIndex(index);

      // Animation for manual selection
      Animated.parallel([
        Animated.sequence([
          Animated.timing(fadeAnim, {
            toValue: 0.4,
            duration: 150,
            useNativeDriver: true,
          }),
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(scaleAnim, {
            toValue: 0.97,
            duration: 150,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
        ]),
      ]).start();
    }
  };

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
            <MaterialIcons
              name="chevron-right"
              size={16}
              color="#4A4A9C"
            />
          </TouchableOpacity>
        </View>

        {/* Scrollable Feedback Cards */}
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          }}
        >
          <ScrollView
            ref={scrollViewRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.scrollView}
            snapToInterval={cardWidth + 20}
            decelerationRate="fast"
            onMomentumScrollEnd={(event) => {
              const newIndex = Math.round(
                event.nativeEvent.contentOffset.x / (cardWidth + 20)
              );
              if (newIndex >= 0 && newIndex < feedbacks.length) {
                setCurrentIndex(newIndex);
              }
            }}
          >
            {feedbacks.map((feedback, index) => (
              <TouchableOpacity
                key={feedback.id}
                activeOpacity={0.95}
                onPress={() => handleCardPress(index)}
              >
                {Platform.OS === "ios" ? (
                  <BlurView
                    intensity={index === currentIndex ? 0 : 50}
                    tint="light"
                    style={[
                      styles.card,
                      { width: cardWidth },
                      index === currentIndex && styles.activeCard,
                    ]}
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
                        backgroundColor:
                          index === currentIndex ? "#ffffff" : "#f8f8f8",
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
        </Animated.View>

        {/* Pagination Dots */}
        <View style={styles.paginationContainer}>
          {feedbacks.map((_, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => handleCardPress(index)}
              style={[
                styles.paginationDot,
                index === currentIndex && styles.activePaginationDot,
              ]}
            />
          ))}
        </View>
      </View>
    </View>
  );
}

// Separate component for card content to improve readability
function CardContent({
  feedback,
  isActive,
  formatDate,
  renderRating,
}: {
  feedback: any;
  isActive: boolean;
  formatDate: (date: string) => string;
  renderRating: (rating: number) => JSX.Element;
}) {
  return (
    <>
      <LinearGradient
        colors={
          isActive ? ["#6366F1", "#4F46E5"] : ["transparent", "transparent"]
        }
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.cardHeader}
      >
        <View style={styles.quoteIconContainer}>"</View>
        {renderRating(feedback.rating)}
      </LinearGradient>

      <View style={styles.messageContainer}>
        <Text
          style={[styles.message, isActive && styles.activeMessage]}
          numberOfLines={4}
          ellipsizeMode="tail"
        >
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
          <View
            style={[
              styles.avatarContainer,
              isActive && styles.activeAvatarContainer,
            ]}
          >
            <Image
              source={require("../../assets/images/PersonDummy.png")}
              style={styles.avatar}
            />
            {feedback.verified && (
              <View style={styles.verifiedBadge}>
                <Text style={styles.verifiedText}>✓</Text>
              </View>
            )}
          </View>
          <View style={styles.userTextContainer}>
            <Text style={[styles.userName, isActive && styles.activeUserName]}>
              {feedback.user}
            </Text>
            <Text style={styles.userPosition}>{feedback.position}</Text>
            <Text style={[styles.date, isActive && styles.activeDate]}>
              {formatDate(feedback.date)}
            </Text>
          </View>
        </View>
      </View>
    </>
  );
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
    // Pattern effect using borderRadius
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
    height: 24,
    backgroundColor: "#232761",
    borderRadius: 2,
    marginRight: 12,
  },
  heading: {
    fontSize: 22,
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
    fontSize: 14,
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
    color: "#fff"
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
    marginLeft: 15,
  },
  userName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1F2937",
    letterSpacing: -0.3,
  },
  activeUserName: {
    color: "#1F2937",
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
});