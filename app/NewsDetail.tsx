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
} from "react-native";
import { useRoute, RouteProp } from "@react-navigation/native";
import { FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "expo-router";
import { tags } from "react-native-svg/lib/typescript/xmlTags";

type RouteParams = {
  params: {
    article: {
      title: string;
      date: string;
      description: string;
      image: any;
      tags: string[];
    };
  };
};

export default function NewsDetail() {
  const navigation = useNavigation();

  const route = useRoute<RouteProp<RouteParams>>();
  const { article } = route.params;

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
        `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
          url
        )}`
      );
    } catch (error) {
      console.error(error);
    }
  };

  const shareToLinkedIn = async () => {
    const url = "YOUR_ARTICLE_URL";
    try {
      await Linking.openURL(
        `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
          url
        )}`
      );
    } catch (error) {
      console.error(error);
    }
  };

  const copyLink = async () => {
    const url = "YOUR_ARTICLE_URL";
    try {
      await Share.share({
        message: url,
      });
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

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>{article.title}</Text>
        <Text style={styles.tags}>
          {article.tags.map((tag, index) => (
            <Text key={index} style={styles.tag}>#{tag}</Text>
          ))}
        </Text>
        <View style={styles.metaContainer}>
          <Text style={styles.date}>
            {formatDate(article.date || new Date().toString())}
          </Text>
          <View style={styles.socialIcons}>
            <TouchableOpacity style={[styles.socialButton]}>
              <FontAwesome name="twitter" size={18} color="#1DA1F2" />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.socialButton]}>
              <FontAwesome name="whatsapp" size={18} color="#1DA1F2" />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.socialButton]}>
              <FontAwesome name="facebook" size={18} color="#4267B2" />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.socialButton]}>
              <FontAwesome name="linkedin" size={18} color="#0077B5" />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.socialButton]}>
              <FontAwesome name="link" size={18} color="#666" />
            </TouchableOpacity>
          </View>
        </View>
        <Text style={styles.description}>{article.description}</Text>
        <Image source={article.image} style={styles.image} resizeMode="cover" />
        <TouchableOpacity
          style={styles.seeMoreButton}
          onPress={() => {
            navigation.navigate("NewsArticalsPage" as never);
          }}
        >
          <Text style={styles.seeMoreButtonText}>See More</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
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
    fontSize: 24,
    fontWeight: "bold",
    color: "#242a80",
    marginBottom: 10,
  },
  tags: {
    marginTop: 10,
    marginBottom: 25,
  },
  tag: {
    color: "#007bff",
    fontSize: 14,
    marginRight: 10,
    backgroundColor: "#f1f1f1",
    padding: 5,
    borderRadius: 19,
  },
  metaContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
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
    width: 36,
    height: 36,
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
    fontSize: 16,
    lineHeight: 24,
    color: "#333",
    marginBottom: 20,
  },
  linkedinButton: {
    backgroundColor: "#0077B5",
  },
  twitterButton: {
    backgroundColor: "#1DA1F2",
  },
  facebookButton: {
    backgroundColor: "#4267B2",
  },
  image: {
    width: "100%",
    height: 250,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "lightgrey",
    marginBottom: 20,
  },
  linkButton: {
    backgroundColor: "#666",
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
