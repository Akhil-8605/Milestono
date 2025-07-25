"use client"

import { useState, useEffect } from "react"
import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet, Dimensions, Alert } from "react-native"
import { useNavigation } from "expo-router"
import { NavigationProp } from "@react-navigation/native";
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
  const navigation = useNavigation<NavigationProp<{ NewsDetails: { article: Article } }>>();
  const [articles, setArticles] = useState<Article[]>([])
  const [showAll, setShowAll] = useState(false)

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const resp = await axios.get(`${BASE_URL}/api/articles`)
        setArticles(resp.data as Article[])
      } catch (e) {
        console.error("Error fetching articles:", e)
        Alert.alert("Error", "Unable to load articles.")
      }
    }
    fetchArticles()
  }, [])

  const displayed = showAll ? articles : articles.slice(0, 3)

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
              <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate("NewsDetails", { article })}
              >
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
  scrollView: {
    padding: 10,
    paddingLeft: 6,
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
