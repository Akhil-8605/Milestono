import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  Pressable,
  Dimensions,
  StatusBar,
  Image,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import Icon from "react-native-vector-icons/FontAwesome"; 

type Feedback = {
  id: number;
  message: string;
  user: string;
  position: string;
  rating: number;
  date: string;
  verified: boolean;
};

const feedbacks: Feedback[] = [
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
    id: 4,
    message:
      "The user interface is clean and easy to navigate. I appreciate the detailed analytics provided.",
    user: "Arjun Mehta",
    position: "Data Analyst",
    rating: 4,
    date: "2025-02-10",
    verified: true,
  },
  {
    id: 5,
    message:
      "Customer support was prompt and very helpful. It really made a difference.",
    user: "Priya Sharma",
    position: "Operations Manager",
    rating: 5,
    date: "2025-02-12",
    verified: true,
  },
  {
    id: 6,
    message:
      "I have seen a noticeable improvement in our project timelines since we started using Milestono.",
    user: "Rahul Verma",
    position: "Team Lead",
    rating: 4,
    date: "2025-02-15",
    verified: false,
  },
  {
    id: 7,
    message:
      "The integration with our existing tools was seamless. Kudos to the development team!",
    user: "Anita Desai",
    position: "CTO",
    rating: 5,
    date: "2025-02-18",
    verified: true,
  },
  {
    id: 8,
    message:
      "A game changer for our company. It simplifies complex workflows effortlessly.",
    user: "Suresh Nair",
    position: "Project Coordinator",
    rating: 5,
    date: "2025-02-20",
    verified: false,
  },
  {
    id: 9,
    message:
      "The app's performance is smooth even with heavy usage. Highly commendable!",
    user: "Deepa Iyer",
    position: "Software Engineer",
    rating: 4,
    date: "2025-02-22",
    verified: true,
  },
  {
    id: 10,
    message:
      "I love the intuitive design and how it keeps our team on track with their tasks.",
    user: "Karan Kapoor",
    position: "Product Manager",
    rating: 5,
    date: "2025-02-25",
    verified: true,
  },
  {
    id: 11,
    message:
      "The update really improved the navigation and overall user experience.",
    user: "Neha Gupta",
    position: "UX Designer",
    rating: 4,
    date: "2025-03-01",
    verified: true,
  },
  {
    id: 12,
    message:
      "Great app with excellent features. It really stands out in the market.",
    user: "Rohit Singh",
    position: "Marketing Head",
    rating: 5,
    date: "2025-03-03",
    verified: false,
  },
  {
    id: 13,
    message:
      "The system is reliable and has drastically reduced our project delays.",
    user: "Manisha Rao",
    position: "Operations Director",
    rating: 5,
    date: "2025-03-05",
    verified: true,
  },
  {
    id: 14,
    message:
      "I appreciate the regular updates and new features being added consistently.",
    user: "Amitabh Joshi",
    position: "CTO",
    rating: 4,
    date: "2025-03-07",
    verified: true,
  },
  {
    id: 15,
    message:
      "A very user-friendly platform that simplifies project management.",
    user: "Shalini Kapoor",
    position: "Project Coordinator",
    rating: 4,
    date: "2025-03-09",
    verified: false,
  },
  {
    id: 16,
    message:
      "The analytics dashboard provides insights that are critical for decision-making.",
    user: "Rakesh Kumar",
    position: "Data Scientist",
    rating: 5,
    date: "2025-03-10",
    verified: true,
  },
  {
    id: 17,
    message:
      "Our team productivity has seen a significant boost thanks to this platform.",
    user: "Simran Kaur",
    position: "Team Lead",
    rating: 5,
    date: "2025-03-12",
    verified: true,
  },
  {
    id: 18,
    message:
      "The platform is very intuitive, and the learning curve was minimal.",
    user: "Vikram Singh",
    position: "Senior Developer",
    rating: 4,
    date: "2025-03-14",
    verified: true,
  },
  {
    id: 19,
    message:
      "Impressive customer service and the platform works flawlessly.",
    user: "Pooja Patel",
    position: "Operations Manager",
    rating: 5,
    date: "2025-03-15",
    verified: true,
  },
  {
    id: 20,
    message:
      "It has become an essential tool for our daily operations. Highly recommended!",
    user: "Aditya Verma",
    position: "CEO",
    rating: 5,
    date: "2025-03-17",
    verified: true,
  },
];

const ITEMS_PER_PAGE_OPTIONS: (number | "All")[] = [4, 10, 20, "All"];

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

function CardContent({ feedback }: { feedback: Feedback }) {
  return (
    <>
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
        <Text style={styles.message} numberOfLines={4} ellipsizeMode="tail">
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
          <View style={styles.avatarContainer}>
            <Image
              source={require("../assets/images/PersonDummy.png")}
              style={styles.avatar}
            />
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
    </>
  );
}

const UserFeedbackPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState<number | "All">(4);
  const [showModal, setShowModal] = useState(false);

  const totalPages =
    itemsPerPage === "All"
      ? 1
      : Math.ceil(feedbacks.length / Number(itemsPerPage));

  const getCurrentData = () => {
    if (itemsPerPage === "All") return feedbacks;
    const begin = (currentPage - 1) * Number(itemsPerPage);
    const end = begin + Number(itemsPerPage);
    return feedbacks.slice(begin, end);
  };

  const renderPaginationButtons = () => {
    const buttons = [];
    for (let i = 1; i <= totalPages; i++) {
      buttons.push(
        <TouchableOpacity
          key={i}
          style={[
            styles.pageButton,
            currentPage === i && styles.activePageButton,
          ]}
          onPress={() => setCurrentPage(i)}
        >
          <Text
            style={[
              styles.pageButtonText,
              currentPage === i && styles.activePageButtonText,
            ]}
          >
            {i}
          </Text>
        </TouchableOpacity>
      );
    }
    return buttons;
  };

  const statusBarHeight = StatusBar.currentHeight || 0;

  return (
    <View style={[styles.container, { marginTop: statusBarHeight }]}>
      {/* Header with title and items-per-page dropdown */}
      <View style={styles.header}>
        <Text style={styles.title}>Client Testimonials</Text>
        <TouchableOpacity
          style={styles.dropdown}
          onPress={() => setShowModal(true)}
        >
          <Text style={styles.dropdownText}>
            {itemsPerPage === "All" ? "All" : itemsPerPage}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Feedback Cards List */}
      <FlatList
        data={getCurrentData()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <CardContent feedback={item} />
          </View>
        )}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />

      {/* Pagination Controls */}
      <View style={styles.pagination}>
        <TouchableOpacity
          style={styles.pageButton}
          disabled={currentPage === 1}
          onPress={() => setCurrentPage((prev) => prev - 1)}
        >
          <Text style={styles.pageButtonText}>Prev</Text>
        </TouchableOpacity>

        {renderPaginationButtons()}

        <TouchableOpacity
          style={styles.pageButton}
          disabled={currentPage === totalPages}
          onPress={() => setCurrentPage((prev) => prev + 1)}
        >
          <Text style={styles.pageButtonText}>Next</Text>
        </TouchableOpacity>
      </View>

      {/* Modal for selecting items per page */}
      <Modal
        visible={showModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowModal(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setShowModal(false)}
        >
          <View style={styles.modalContent}>
            {ITEMS_PER_PAGE_OPTIONS.map((option) => (
              <TouchableOpacity
                key={option.toString()}
                style={styles.modalItem}
                onPress={() => {
                  setItemsPerPage(option);
                  setCurrentPage(1);
                  setShowModal(false);
                }}
              >
                <Text style={styles.modalItemText}>{option}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Pressable>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 30,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1F2937",
  },
  dropdown: {
    padding: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 4,
    minWidth: 50,
    alignItems: "center",
  },
  dropdownText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#4A4A9C",
  },
  listContainer: {
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
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.05)",
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
    marginRight: 10,
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
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16,
  },
  pageButton: {
    padding: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 4,
    minWidth: 40,
    alignItems: "center",
    marginHorizontal: 4,
  },
  activePageButton: {
    backgroundColor: "#232761",
    borderColor: "#232761",
  },
  pageButtonText: {
    color: "#666",
  },
  activePageButtonText: {
    color: "#fff",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 8,
    minWidth: 150,
  },
  modalItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  modalItemText: {
    fontSize: 16,
  },
});

export default UserFeedbackPage;
