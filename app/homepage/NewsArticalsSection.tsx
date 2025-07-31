"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
  Alert,
  ActivityIndicator,
} from "react-native"
import { router, useNavigation } from "expo-router"
import type { NavigationProp } from "@react-navigation/native"
import axios from "axios"
import { BASE_URL } from "@env"

const { width } = Dimensions.get("window")
const cardWidth = width * 0.8

interface Article {
  _id: string
  name: string
  paragraph: string
  imageSrc?: string
}

const NewsArticlesSection = () => {
  const navigation = useNavigation<NavigationProp<{ NewsDetails: { article: Article } }>>()
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const fetchingRef = useRef(false)

  const fetchArticles = useCallback(async () => {
    // Prevent multiple simultaneous fetches
    if (fetchingRef.current) {
      return
    }

    fetchingRef.current = true

    try {
      setLoading(true)

      if (!BASE_URL) {
        console.warn("BASE_URL not configured, using mock data")
        return
      }

      const response = await axios.get(`${BASE_URL}/api/articles`, {
        timeout: 10000,
      })

      if (response.data && Array.isArray(response.data)) {
        // Limit to first 5 articles
        setArticles(response.data.slice(0, 5))
      } else {
        throw new Error("Invalid response format")
      }
    } catch (e) {
      console.error("Error fetching articles:", e)
    } finally {
      setLoading(false)
      fetchingRef.current = false
    }
  }, [])

  useEffect(() => {
    fetchArticles()
  }, [fetchArticles])

  const displayed = articles.slice(0, 5) // Always limit to 5 articles

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.heading}>News & Article</Text>
        <Text style={styles.subHeading}>Read what's happening in Real Estate</Text>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#242a80" />
          <Text style={styles.loadingText}>Loading articles...</Text>
        </View>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>News & Article</Text>
      <Text style={styles.subHeading}>Read what's happening in Real Estate</Text>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollView}>
        {displayed.map((article) => (
          <View key={article._id} style={styles.card}>
            <Image
              source={article.imageSrc ? { uri: article.imageSrc } : require("../../assets/images/dummyImg.webp")}
              style={styles.image}
            />
            <View style={styles.cardContent}>
              <Text style={styles.title}>{article.name}</Text>
              <Text style={styles.description} numberOfLines={2}>
                {article.paragraph}
              </Text>
              <TouchableOpacity style={styles.button} onPress={() => router.push(`/NewsDetail?article=${encodeURIComponent(JSON.stringify(article))}`)}>
                <Text style={styles.buttonText}>Read More</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* See More Button */}
      <TouchableOpacity onPress={() => navigation.navigate("NewsArticalsPage" as never)}>
        <Text style={styles.seeMore}>See More</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    paddingTop: 25,
    backgroundColor: "#F5F5F5",
  },
  heading: {
    fontSize: 25,
    fontWeight: "700",
    color: "#333333",
  },
  subHeading: {
    fontSize: 12,
    color: "#666",
    fontWeight: "500",
    marginBottom: 20,
  },
  loadingContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  scrollView: {
    padding: 10,
    paddingLeft: 10,
    marginLeft: -10,
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
    marginRight: 10,
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
    paddingRight: 10,
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
  seeMore: {
    fontSize: 16,
    color: "#4A4A9C",
    fontWeight: "500",
    marginTop: 16,
    textAlign: "right",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 15,
  },
  toggleButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: "#FFF",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  toggleText: {
    fontSize: 12,
    color: "#4A4A9C",
    fontWeight: "500",
  },
})

export default NewsArticlesSection
