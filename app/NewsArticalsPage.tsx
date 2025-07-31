"use client"

import { useState, useEffect, useCallback } from "react"
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
  Alert,
  ActivityIndicator,
  RefreshControl,
} from "react-native"
import { FontAwesome } from "@expo/vector-icons"
import { useRouter } from "expo-router"
import axios from "axios"
import { BASE_URL } from "@env"
import Header from "./components/Header"

const { width } = Dimensions.get("window")
const cardWidth = width - 32 // Accounting for container padding
const ITEMS_PER_PAGE_OPTIONS = [4, 10, 20, 25, "All"]

interface Article {
  _id: string
  name: string
  paragraph: string
  imageSrc?: string
}

const ArticleCard = ({ article }: { article: Article }) => {
  const router = useRouter()

  return (
    <View style={styles.card}>
      <Image
        source={article.imageSrc ? { uri: article.imageSrc } : require("../assets/images/dummyImg.webp")}
        style={styles.image}
      />
      <View style={styles.cardContent}>
        <Text style={styles.title}>{article.name}</Text>
        <Text style={styles.description} numberOfLines={2}>
          {article.paragraph}
        </Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push(`/NewsDetail?article=${encodeURIComponent(JSON.stringify(article))}`)}
        >
          <Text style={styles.buttonText}>Read More</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const statusBarHeight = StatusBar.currentHeight || 0

export default function NewsAndArticles() {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState<string | number>(4)
  const [showModal, setShowModal] = useState(false)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true)
        const resp = await axios.get(`${BASE_URL}/api/articles`)
        setArticles(resp.data as Article[])
      } catch (e) {
        console.error("Error fetching articles:", e)
        Alert.alert("Error", "Unable to load articles. Please try again later.")
      } finally {
        setLoading(false)
      }
    }
    fetchArticles()
  }, [])

  const totalPages = String(itemsPerPage) === "All" ? 1 : Math.ceil(articles.length / Number(itemsPerPage))

  const getCurrentData = () => {
    if (String(itemsPerPage) === "All") return articles
    const begin = (currentPage - 1) * Number(itemsPerPage)
    const end = begin + Number(itemsPerPage)
    return articles.slice(begin, end)
  }

  const onRefresh = useCallback(async () => {
    setRefreshing(true)
    try {
      setLoading(true)
      const resp = await axios.get(`${BASE_URL}/api/articles`)
      setArticles(resp.data as Article[])
    } catch (e) {
      console.error("Error fetching articles:", e)
      Alert.alert("Error", "Unable to refresh articles. Please try again later.")
    } finally {
      setRefreshing(false)
    }
  }, [])

  const renderPaginationButtons = () => {
    if (String(itemsPerPage) === "All" || totalPages <= 1) return null

    const buttons = []
    for (let i = 1; i <= totalPages; i++) {
      buttons.push(
        <TouchableOpacity
          key={i.toString()}
          style={[styles.pageButton, currentPage === i && styles.activePageButton]}
          onPress={() => setCurrentPage(i)}
        >
          <Text style={[styles.pageButtonText, currentPage === i && styles.activePageButtonText]}>{i}</Text>
        </TouchableOpacity>,
      )
    }
    return buttons
  }

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyStateText}>No articles available at the moment.</Text>
      <TouchableOpacity
        style={styles.retryButton}
        onPress={() => {
          const fetchArticles = async () => {
            try {
              setLoading(true)
              const resp = await axios.get(`${BASE_URL}/api/articles`)
              setArticles(resp.data as Article[])
            } catch (e) {
              console.error("Error fetching articles:", e)
              Alert.alert("Error", "Unable to load articles. Please try again later.")
            } finally {
              setLoading(false)
            }
          }
          fetchArticles()
        }}
      >
        <Text style={styles.retryButtonText}>Retry</Text>
      </TouchableOpacity>
    </View>
  )

  if (loading) {
    return (
      <View style={{ flex: 1, marginTop: statusBarHeight }}>
        <Header />
        <View style={[styles.container, styles.loadingContainer]}>
          <ActivityIndicator size="large" color="#242a80" />
          <Text style={styles.loadingText}>Loading articles...</Text>
        </View>
      </View>
    )
  }

  return (
    <View style={{ flex: 1, marginTop: statusBarHeight }}>
      <Header />
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>All Real Estate News & Articles</Text>
          <View style={{ width: "100%", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
            <Text style={styles.headerSubtitle}>
              {articles.length} article{articles.length !== 1 ? "s" : ""} available
            </Text>
            <TouchableOpacity style={styles.dropdown} onPress={() => setShowModal(true)}>
              <Text style={styles.dropdownText}>{itemsPerPage}</Text>
              <Text style={styles.dropdownArrow}><FontAwesome name="chevron-down" size={15} color="#666" /></Text>
            </TouchableOpacity>
          </View>
        </View>

        {articles.length === 0 ? (
          renderEmptyState()
        ) : (
          <>
            <FlatList
              data={getCurrentData()}
              renderItem={({ item }) => <ArticleCard article={item} />}
              keyExtractor={(item) => item._id}
              contentContainerStyle={styles.listContainer}
              showsVerticalScrollIndicator={false}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                  colors={["#242a80"]}
                  tintColor="#242a80"
                />
              }
            />

            {String(itemsPerPage) !== "All" && totalPages > 1 && (
              <View style={styles.pagination}>
                <TouchableOpacity
                  style={[styles.pageButton, currentPage === 1 && styles.disabledButton]}
                  disabled={currentPage === 1}
                  onPress={() => setCurrentPage((prev) => prev - 1)}
                >
                  <Text style={[styles.pageButtonText, currentPage === 1 && styles.disabledButtonText]}>Prev</Text>
                </TouchableOpacity>

                {renderPaginationButtons()}

                <TouchableOpacity
                  style={[styles.pageButton, currentPage === totalPages && styles.disabledButton]}
                  disabled={currentPage === totalPages}
                  onPress={() => setCurrentPage((prev) => prev + 1)}
                >
                  <Text style={[styles.pageButtonText, currentPage === totalPages && styles.disabledButtonText]}>
                    Next
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </>
        )}

        <Modal visible={showModal} transparent={true} animationType="fade" onRequestClose={() => setShowModal(false)}>
          <Pressable style={styles.modalOverlay} onPress={() => setShowModal(false)}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Items per page</Text>
              {ITEMS_PER_PAGE_OPTIONS.map((option) => (
                <TouchableOpacity
                  key={option.toString()}
                  style={[styles.modalItem, itemsPerPage === option && styles.selectedModalItem]}
                  onPress={() => {
                    setItemsPerPage(option)
                    setCurrentPage(1)
                    setShowModal(false)
                  }}
                >
                  <Text style={[styles.modalItemText, itemsPerPage === option && styles.selectedModalItemText]}>
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </Pressable>
        </Modal>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    padding: 16,
  },
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#666",
  },
  header: {
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e9ecef",
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#242a80",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#6c757d",
    fontWeight: "500",
  },
  dropdown: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderWidth: 1,
    borderColor: "#dee2e6",
    borderRadius: 8,
    backgroundColor: "#fff",
    minWidth: 70,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  dropdownText: {
    fontSize: 14,
    color: "#242a80",
    fontWeight: "600",
    marginRight: 8,
  },
  dropdownArrow: {
    fontSize: 10,
    color: "#6c757d",
  },
  listContainer: {
    gap: 16,
    paddingBottom: 16,
  },
  card: {
    width: cardWidth,
    backgroundColor: "#fff",
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
    borderWidth: 1,
    borderColor: "#f1f3f4",
  },
  image: {
    width: 125,
    height: 125,
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
  },
  cardContent: {
    flex: 1,
    paddingLeft: 16,
    paddingRight: 12,
    paddingVertical: 12,
  },
  title: {
    fontSize: 15,
    fontWeight: "700",
    color: "#212529",
    marginBottom: 6,
    lineHeight: 20,
  },
  description: {
    fontSize: 12,
    color: "#6c757d",
    marginBottom: 12,
    lineHeight: 16,
  },
  button: {
    backgroundColor: "#fff",
    borderWidth: 1.5,
    borderColor: "#242a80",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignSelf: "flex-start",
  },
  buttonText: {
    color: "#242a80",
    fontSize: 11,
    fontWeight: "700",
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    gap: 8,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#e9ecef",
  },
  pageButton: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: "#dee2e6",
    borderRadius: 8,
    minWidth: 44,
    alignItems: "center",
    backgroundColor: "#fff",
  },
  activePageButton: {
    backgroundColor: "#242a80",
    borderColor: "#242a80",
  },
  disabledButton: {
    borderColor: "#e9ecef",
    backgroundColor: "#f8f9fa",
  },
  pageButtonText: {
    color: "#242a80",
    fontSize: 14,
    fontWeight: "600",
  },
  activePageButtonText: {
    color: "white",
  },
  disabledButtonText: {
    color: "#adb5bd",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 12,
    minWidth: 180,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#242a80",
    marginBottom: 16,
    textAlign: "center",
  },
  modalItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 4,
  },
  selectedModalItem: {
    backgroundColor: "#f8f9ff",
  },
  modalItemText: {
    fontSize: 15,
    color: "#495057",
    textAlign: "center",
    fontWeight: "500",
  },
  selectedModalItemText: {
    color: "#242a80",
    fontWeight: "700",
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 16,
    color: "#6c757d",
    textAlign: "center",
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: "#242a80",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
  },
})
