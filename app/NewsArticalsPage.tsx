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
  StatusBar,
} from "react-native";
import { useRouter } from "expo-router";
import Header from "./components/Header";

const { width } = Dimensions.get("window");
const cardWidth = width - 32; // Accounting for container padding
const ITEMS_PER_PAGE_OPTIONS = [4, 10, 20, 25, "All"];

const mockArticles = [
  {
    id: 1,
    title: "Outlook of Real Estate in 2025",
    description:
      "Real estate 2025 outlook: Here's what to expect. The market is projected to see significant changes with emerging trends in sustainable housing and smart home technology integration becoming mainstream.",
    image: require("../assets/images/dummyImg.webp"),
    date: "2025-01-01",
    tags: ["Real Estate", "2025", "Sustainable Housing"],
  },
  {
    id: 2,
    title: "Investment Opportunities in Commercial Real Estate",
    description:
      "Exploring the latest opportunities in commercial real estate sectors, from office spaces to retail properties and industrial warehouses.",
    image: require("../assets/images/dummyImg.webp"),
    date: "2025-02-15",
    tags: ["Real Estate", "2025", "Commercial"],
  },
  {
    id: 3,
    title: "Outlook of Real Estate in 2025",
    description: "Real estate 2025 outlook: Here's what to expect.",
    image: require("../assets/images/dummyImg.webp"),
    date: "2025-02-15",
    tags: ["Real Estate", "2025", "Market"],
  },
  {
    id: 4,
    title: "Shriram Properties plans to double holdings",
    description: "Real estate giant expands investment portfolio.",
    image: require("../assets/images/dummyImg.webp"),
    date: "2025-02-15",
    tags: ["Real Estate", "Investment", "Portfolio"],
  },
  {
    id: 5,
    title: "Sustainable Homes Revolution",
    description: "How sustainable homes are shaping the market.",
    image: require("../assets/images/dummyImg.webp"),
    date: "2025-02-15",
    tags: ["Real Estate", "Sustainability", "Innovation"],
  },
  // More articles can be added here
];

export type Article = {
  id: number;
  title: string;
  description: string;
  image: any;
  date: string;
  tags: string[];
};

const ArticleCard = ({ article }: { article: Article }) => {
  const router = useRouter();
  return (
    <View style={styles.card}>
      <Image source={article.image} style={styles.image} />
      <View style={styles.cardContent}>
        <Text style={styles.title}>{article.title}</Text>
        <Text style={styles.description} numberOfLines={2}>
          {article.description}
        </Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() =>
            router.push(
              `/NewsDetail?article=${encodeURIComponent(JSON.stringify(article))}`
            )
          }
        >
          <Text style={styles.buttonText}>Read More</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const statusBarHeight = StatusBar.currentHeight || 0;

export default function NewsAndArticles() {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState<string | number>(4);
  const [showModal, setShowModal] = useState(false);

  const totalPages =
    String(itemsPerPage) === "All"
      ? 1
      : Math.ceil(mockArticles.length / Number(itemsPerPage));

  const getCurrentData = () => {
    if (String(itemsPerPage) === "All") return mockArticles;
    const begin = (currentPage - 1) * Number(itemsPerPage);
    const end = begin + Number(itemsPerPage);
    return mockArticles.slice(begin, end);
  };

  const renderPaginationButtons = () => {
    const buttons = [];
    for (let i = 1; i <= totalPages; i++) {
      buttons.push(
        <TouchableOpacity
          key={i.toString()}
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
    <View style={{flex: 1, marginTop: statusBarHeight }}>
      <Header/>
      <View style={[styles.container]}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>
            All Real Estate News & Articles
          </Text>
          <TouchableOpacity
            style={styles.dropdown}
            onPress={() => setShowModal(true)}
          >
            <Text>{itemsPerPage}</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={getCurrentData()}
          renderItem={({ item }) => <ArticleCard article={item} />}
          keyExtractor={(item, index) => `${item.id}-${index}`}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />

        <View style={styles.pagination}>
          <TouchableOpacity
            style={[
              styles.pageButton,
              currentPage === 1 && styles.disabledButton,
            ]}
            disabled={currentPage === 1}
            onPress={() => setCurrentPage((prev) => prev - 1)}
          >
            <Text
              style={[
                styles.pageButtonText,
                currentPage === 1 && styles.disabledButtonText,
              ]}
            >
              Prev
            </Text>
          </TouchableOpacity>

          {renderPaginationButtons()}

          <TouchableOpacity
            style={[
              styles.pageButton,
              currentPage === totalPages && styles.disabledButton,
            ]}
            disabled={currentPage === totalPages}
            onPress={() => setCurrentPage((prev) => prev + 1)}
          >
            <Text
              style={[
                styles.pageButtonText,
                currentPage === totalPages && styles.disabledButtonText,
              ]}
            >
              Next
            </Text>
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
    </View>
  );
}

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
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#333",
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
    gap: 16,
  },
  card: {
    width: cardWidth,
    backgroundColor: "#FFF",
    borderRadius: 15,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
    borderWidth: 0.5,
    borderColor: "lightgrey",
  },
  image: {
    width: 125,
    height: 125,
    borderTopLeftRadius: 15,
    borderBottomLeftRadius: 15,
  },
  cardContent: {
    flex: 1,
    paddingLeft: 12,
  },
  title: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#222",
  },
  description: {
    fontSize: 10,
    color: "#666",
    marginVertical: 4,
  },
  button: {
    backgroundColor: "#fff",
    borderWidth: 0.5,
    marginTop: 5,
    borderColor: "#242a80",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  buttonText: {
    color: "#242a80",
    fontSize: 10,
    fontWeight: "bold",
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16,
    gap: 8,
  },
  pageButton: {
    padding: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 4,
    minWidth: 40,
    alignItems: "center",
  },
  activePageButton: {
    backgroundColor: "#242a80",
    borderColor: "#242a80",
  },
  disabledButton: {
    borderColor: "#eee",
  },
  pageButtonText: {
    color: "#242a80",
  },
  activePageButtonText: {
    color: "white",
  },
  disabledButtonText: {
    color: "#ccc",
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
    color: "#242a80",
  },
});
