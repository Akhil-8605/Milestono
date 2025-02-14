import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  Modal,
  Pressable,
  Dimensions,
} from "react-native";

const ITEMS_PER_PAGE_OPTIONS: (number | "All")[] = [4, 10, 20, 25, "All"];

type Feedback = {
  id: number;
  message: string;
  user: string;
  date: string;
};

const feedbacks: Feedback[] = [
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
  // Add more feedback items if needed...
];

const FeedbackCard = ({ feedback }: { feedback: Feedback }) => (
  <View key={feedback.id} style={styles.card}>
    <Text style={styles.message}>{feedback.message}</Text>
    <View style={styles.userInfo}>
      <Image
        source={require("../assets/images/PersonDummy.png")}
        style={styles.avatar}
      />
      <View>
        <Text style={styles.userName}>{feedback.user}</Text>
        <Text style={styles.date}>{feedback.date}</Text>
      </View>
    </View>
  </View>
);

const FeedbackPage = () => {
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

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Feedbacks</Text>
        <TouchableOpacity
          style={styles.dropdown}
          onPress={() => setShowModal(true)}
        >
          <Text>{itemsPerPage}</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={getCurrentData()}
        renderItem={({ item }) => <FeedbackCard feedback={item} />}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        showsHorizontalScrollIndicator={false}
      />

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

const { width } = Dimensions.get("window");

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
    fontSize: 25,
    fontWeight: "700",
    color: "#333333",
  },
  dropdown: {
    padding: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 4,
    minWidth: 50,
    alignItems: "center",
  },
  listContainer: {
    paddingBottom: 20,
  },
  card: {
    width: width * 0.9,
    backgroundColor: "#FFF",
    borderRadius: 15,
    padding: 15,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
    minHeight: 200,
    flexDirection: "column",
    justifyContent: "space-between",
    marginHorizontal: "auto",
  },
  message: {
    fontSize: 16,
    color: "#222",
    marginBottom: 15,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
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
    backgroundColor: "#242a80",
    borderColor: "#2563eb",
  },
  pageButtonText: {
    color: "#666",
  },
  activePageButtonText: {
    color: "white",
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

export default FeedbackPage;
