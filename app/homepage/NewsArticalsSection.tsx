import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
} from "react-native";
import { useNavigation } from "expo-router";

const { width } = Dimensions.get("window");
const cardWidth = width * 0.8;

const newsArticles = [
  {
    id: 1,
    title: "Outlook of Real Estate in 2025",
    description: "Real estate 2025 outlook: Here's what to expect.",
    image: require("../../assets/images/dummyImg.webp"),
  },
  {
    id: 2,
    title: "Shriram Properties plans to double holdings",
    description: "Real estate giant expands investment portfolio.",
    image: require("../../assets/images/dummyImg.webp"),
  },
  {
    id: 3,
    title: "Green Homes: The Future of Housing",
    description: "How sustainable homes are shaping the market.",
    image: require("../../assets/images/dummyImg.webp"),
  },
];

const NewsArticlesSection = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      {/* Section Header */}
      <Text style={styles.heading}>News & Article</Text>
      <Text style={styles.subHeading}>
        Read what's happening in Real Estate
      </Text>

      {/* Vertically Scrollable News Cards */}
      <ScrollView
        horizontal
        style={[styles.scrollView]}
        showsVerticalScrollIndicator={false}
      >
        {newsArticles.map((article) => (
          <View key={article.id} style={styles.card}>
            <Image source={article.image} style={styles.image} />
            <View style={styles.cardContent}>
              <Text style={styles.title}>{article.title}</Text>
              <Text style={styles.description} numberOfLines={2}>
                {article.description}
              </Text>
              <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>Read More</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* See More Button */}
      <TouchableOpacity
        onPress={() => navigation.navigate("NewsArticalsPage" as never)}
      >
        <Text style={styles.seeMore}>See More</Text>
      </TouchableOpacity>
    </View>
  );
};

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
    // marginHorizontal: -10
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
    marginRight: 10
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
});

export default NewsArticlesSection;
