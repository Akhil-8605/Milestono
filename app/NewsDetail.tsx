import React from "react";
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
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import Header from "./components/Header";
import Advertisement from "./propertydetails/NewProjectsSection"
import UserFeedbackSection from "./propertydetails/UserFeedbackSection";

export type Article = {
  title: string;
  date: string;
  description: string;
  image: any;
  tags: string[];
};

export default function NewsDetail() {
  const router = useRouter();
  const { article: articleParam } = useLocalSearchParams() as {
    article: string;
  };

  let article: Article;
  try {
    article = JSON.parse(articleParam);
  } catch (error) {
    console.error("Error parsing article data", error);
    return (
      <View style={styles.container}>
        <Text>Error loading article details.</Text>
      </View>
    );
  }

  const shareToTwitter = async () => {
    const url = "YOUR_ARTICLE_URL";
    const message = `${article.title}\n\n${url}`;
    try {
      await Linking.openURL(
        `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}`
      );
    } catch (error) {
      console.error(error);
    }
  };

  const shareToFacebook = async () => {
    const url = "YOUR_ARTICLE_URL";
    try {
      await Linking.openURL(
        `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
      );
    } catch (error) {
      console.error(error);
    }
  };

  const shareToLinkedIn = async () => {
    const url = "YOUR_ARTICLE_URL";
    try {
      await Linking.openURL(
        `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
      );
    } catch (error) {
      console.error(error);
    }
  };

  const copyLink = async () => {
    const url = "YOUR_ARTICLE_URL";
    try {
      await Share.share({ message: url });
    } catch (error) {
      console.error(error);
    }
  };

  const shareToWhatsApp = async () => {
    const url = "YOUR_ARTICLE_URL";
    const message = `${article.title}\n\n${url}`;
    try {
      await Linking.openURL(
        `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`
      );
    } catch (error) {
      console.error(error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const statusBarHeight = StatusBar.currentHeight || 0;

  return (
    <View style={{ flex: 1, marginTop: statusBarHeight }}>
      <Header />
      <ScrollView style={[styles.container]}>
        <View style={styles.content}>
          <Text style={styles.title}>{article.title}</Text>
          <View style={styles.tagsContainer}>
            {article.tags.map((tag, index) => (
              <Text key={index} style={styles.tag}>
                #{tag}
              </Text>
            ))}
          </View>
          <View style={styles.metaContainer}>
            <Text style={styles.date}>
              {formatDate(article.date || new Date().toString())}
            </Text>
            <View style={styles.socialIcons}>
              <TouchableOpacity
                style={styles.socialButton}
                onPress={shareToTwitter}
              >
                <FontAwesome name="twitter" size={15} color="#1DA1F2" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.socialButton}
                onPress={shareToWhatsApp}
              >
                <FontAwesome name="whatsapp" size={15} color="#25D366" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.socialButton}
                onPress={shareToFacebook}
              >
                <FontAwesome name="facebook" size={15} color="#4267B2" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.socialButton}
                onPress={shareToLinkedIn}
              >
                <FontAwesome name="linkedin" size={15} color="#0077B5" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialButton} onPress={copyLink}>
                <FontAwesome name="link" size={15} color="#666" />
              </TouchableOpacity>
            </View>
          </View>
          <Text style={styles.description}>{article.description}</Text>
          <Image
            source={article.image}
            style={styles.image}
            resizeMode="cover"
          />
          <TouchableOpacity
            style={styles.seeMoreButton}
            onPress={() => router.push("/NewsArticalsPage")}
          >
            <Text style={styles.seeMoreButtonText}>See More</Text>
          </TouchableOpacity>
        </View>
        <Advertisement />
        <UserFeedbackSection/>
      </ScrollView>
    </View>
  );
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
    fontSize: 22,
    fontWeight: "bold",
    color: "#242a80",
    marginBottom: 10,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 10,
    marginBottom: 20,
  },
  tag: {
    color: "#007bff",
    fontSize: 10,
    marginRight: 10,
    paddingHorizontal: 10,
    backgroundColor: "#f1f1f1",
    padding: 5,
    borderRadius: 19,
    marginBottom: 5,
  },
  metaContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  date: {
    fontSize: 14,
    color: "#666",
  },
  socialIcons: {
    flexDirection: "row",
    gap: 10,
  },
  socialButton: {
    width: 28,
    height: 28,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    borderWidth: 0.5,
    borderColor: "lightgrey",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    color: "#333",
    marginBottom: 20,
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "lightgrey",
    marginBottom: 20,
  },
  seeMoreButton: {
    backgroundColor: "#242a80",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignSelf: "center",
  },
  seeMoreButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
