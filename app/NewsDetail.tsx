"use client"
import { useState, useCallback } from "react"
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  Share,
  Linking,
  ScrollView,
  StatusBar,
  RefreshControl,
} from "react-native"
import { FontAwesome } from "@expo/vector-icons"
import { useRouter, useLocalSearchParams } from "expo-router"
import Header from "./components/Header"
import Advertisement from "./propertydetails/NewProjectsSection"
import UserFeedbackSection from "./propertydetails/UserFeedbackSection"

interface Article {
  _id: string
  name: string
  paragraph: string
  imageSrc?: string
}

export default function NewsDetail() {
  const router = useRouter()
  const { article: articleParam } = useLocalSearchParams() as {
    article: string
  }

  const [refreshing, setRefreshing] = useState(false)
  const [article, setArticle] = useState<Article | null>(null)

  const onRefresh = useCallback(async () => {
    setRefreshing(true)
    // Simulate refresh delay - you can add actual data refetch logic here if needed
    setTimeout(() => {
      setRefreshing(false)
    }, 1000)
  }, [])

  const getArticleUrl = () => `http://milestono.com/news-details?id=${article?._id}`

  const shareToTwitter = async () => {
    const url = getArticleUrl()
    const message = `${article?.name}\n\n${url}`
    try {
      await Linking.openURL(`https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}`)
    } catch (error) {
      console.error("Error sharing to Twitter:", error)
    }
  }

  const shareToFacebook = async () => {
    const url = getArticleUrl()
    try {
      await Linking.openURL(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`)
    } catch (error) {
      console.error("Error sharing to Facebook:", error)
    }
  }

  const shareToLinkedIn = async () => {
    const url = getArticleUrl()
    const title = encodeURIComponent(article?.name || "")
    const summary = encodeURIComponent(article?.paragraph.substring(0, 200) + "...")
    try {
      await Linking.openURL(
        `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}&title=${title}&summary=${summary}`,
      )
    } catch (error) {
      console.error("Error sharing to LinkedIn:", error)
    }
  }

  const copyLink = async () => {
    const url = getArticleUrl()
    try {
      await Share.share({
        message: url,
        title: article?.name || "",
        url: url,
      })
    } catch (error) {
      console.error("Error copying link:", error)
    }
  }

  const shareToWhatsApp = async () => {
    const url = getArticleUrl()
    const message = `*${article?.name}*\n\n${article?.paragraph.substring(0, 100)}...\n\nRead more: ${url}`
    try {
      await Linking.openURL(`https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`)
    } catch (error) {
      console.error("Error sharing to WhatsApp:", error)
    }
  }

  const shareArticle = async () => {
    const url = getArticleUrl()
    try {
      const result = await Share.share({
        message: `${article?.name}\n\n${article?.paragraph.substring(0, 150)}...\n\nRead more: ${url}`,
        title: article?.name || "",
        url: url,
      })
    } catch (error) {
      console.error("Error sharing article:", error)
    }
  }

  const formatDate = (dateString?: string) => {
    const date = new Date(dateString || new Date())
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
  }

  const statusBarHeight = StatusBar.currentHeight || 0

  useState(() => {
    try {
      setArticle(JSON.parse(articleParam))
    } catch (error) {
      console.error("Error parsing article data", error)
    }
  })

  if (!article) {
    return (
      <View style={styles.container}>
        <Header />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Error loading article details.</Text>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  return (
    <View style={{ flex: 1, marginTop: statusBarHeight }}>
      <Header />
      <ScrollView
        style={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#242a80"]} tintColor="#242a80" />
        }
      >
        <View style={styles.content}>
          <Text style={styles.title}>{article.name}</Text>
          <View style={styles.metaContainer}>
            <Text style={styles.date}>{formatDate()}</Text>
            <View style={styles.socialIcons}>
              <TouchableOpacity style={styles.socialButton} onPress={shareToTwitter}>
                <FontAwesome name="twitter" size={15} color="#1DA1F2" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialButton} onPress={shareToWhatsApp}>
                <FontAwesome name="whatsapp" size={15} color="#25D366" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialButton} onPress={shareToFacebook}>
                <FontAwesome name="facebook" size={15} color="#4267B2" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialButton} onPress={shareToLinkedIn}>
                <FontAwesome name="linkedin" size={15} color="#0077B5" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialButton} onPress={shareArticle}>
                <FontAwesome name="share-alt" size={15} color="#28a745" />
              </TouchableOpacity>
            </View>
          </View>

          <Image
            source={article.imageSrc ? { uri: article.imageSrc } : require("../assets/images/dummyImg.webp")}
            style={styles.image}
            resizeMode="cover"
          />

          <Text style={styles.description}>{article.paragraph}</Text>

          <TouchableOpacity style={styles.seeMoreButton} onPress={() => router.push("/NewsArticalsPage")}>
            <Text style={styles.seeMoreButtonText}>See More Articles</Text>
          </TouchableOpacity>
        </View>
        <Advertisement />
        <UserFeedbackSection />
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#242a80",
    marginBottom: 16,
    lineHeight: 32,
  },
  metaContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f3f4",
  },
  date: {
    fontSize: 14,
    color: "#6c757d",
    fontWeight: "500",
  },
  socialIcons: {
    flexDirection: "row",
    gap: 12,
  },
  socialButton: {
    width: 32,
    height: 32,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e9ecef",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    width: "100%",
    height: 220,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#f1f3f4",
    marginBottom: 24,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: "#495057",
    marginBottom: 32,
    textAlign: "justify",
  },
  seeMoreButton: {
    backgroundColor: "#242a80",
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignSelf: "center",
    shadowColor: "#242a80",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  seeMoreButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: "#dc3545",
    textAlign: "center",
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: "#242a80",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  backButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
})
