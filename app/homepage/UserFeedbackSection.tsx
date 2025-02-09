import React from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from "react-native";

// Get device width
const { width } = Dimensions.get("window");
const cardWidth = width * 0.75; // 75% of screen width

// Sample feedback data
const feedbacks = [
  {
    id: 1,
    message: "Milestono",
    user: "Vijay",
    date: "2025-01-25 T16:16:09.994Z",
  },
  {
    id: 2,
    message: "Great Service!",
    user: "Rahul",
    date: "2025-02-01 T12:30:45.123Z",
  },
  {
    id: 3,
    message: "Highly recommended!",
    user: "Sneha",
    date: "2025-02-05 T10:10:00.567Z",
  },
];

const UserFeedbackSection = () => {
  return (
    <View style={styles.container}>
      {/* Section Header */}
      <Text style={styles.heading}>User Feedbacks</Text>

      {/* Scrollable Feedback Cards */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollView}
      >
        {feedbacks.map((feedback) => (
          <View key={feedback.id} style={styles.card}>
            <Text style={styles.message}>{feedback.message}</Text>
            <View style={styles.userInfo}>
              <Image
                source={require("../../assets/images/PersonDummy.png")} // Add user image
                style={styles.avatar}
              />
              <View>
                <Text style={styles.userName}>{feedback.user}</Text>
                <Text style={styles.date}>{feedback.date}</Text>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* See More Button */}
      <TouchableOpacity>
        <Text style={styles.seeMore}>See More</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: "#F5F5F5",
    marginBottom: 20,
  },
  heading: {
    fontSize: 32,
    fontWeight: "700",
    color: "#333333",
    marginBottom: 40,
  },
  scrollView: {
    flexDirection: "row",
    paddingBottom: 10,
    gap: 8,
  },
  card: {
    width: cardWidth,
    backgroundColor: "#FFF",
    borderRadius: 15,
    padding: 15,
    marginRight: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
    minHeight: 200,
    flexDirection: "column",
    justifyContent: "space-between",
  },
  message: {
    fontSize: 16,
    color: "#222",
    marginBottom: 15,
    alignItems: "flex-start"
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "flex-end",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  userName: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#222",
  },
  date: {
    fontSize: 12,
    color: "#666",
  },
  seeMore: {
    fontSize: 16,
    color: "#4A4A9C",
    fontWeight: "500",
    marginTop: 16,
    textAlign: "right",
  },
});

export default UserFeedbackSection;
