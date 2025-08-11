import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Dimensions, ActivityIndicator } from "react-native";
import { WebView } from "react-native-webview";
import axios from "axios";
import { BASE_URL } from "@env";

const { width } = Dimensions.get("window");

const MilestonoVideoSection = () => {
  const [adLink, setAdLink] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchAdLink = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/advertise`);
      setAdLink(response.data.ad || null);
    } catch (error) {
      console.error("Error fetching ad link:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdLink();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Watch Video About MILESTONO</Text>
      <Text style={styles.subHeading}>Watch the video what is Milestono</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#1a237e" />
      ) : adLink ? (
        <View style={styles.videoContainer}>
          <WebView
            style={styles.video}
            javaScriptEnabled
            source={{ uri: adLink }}
            allowsFullscreenVideo
          />
        </View>
      ) : (
        <Text style={{ textAlign: "center", color: "#999" }}>
          No video available
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F5F5F5",
    paddingHorizontal: 15,
    paddingVertical: 20,
  },
  heading: {
    fontSize: 26,
    fontWeight: "700",
    color: "#333333",
    marginBottom: 5,
  },
  subHeading: {
    fontSize: 12,
    fontWeight: "600",
    color: "#666",
    marginBottom: 15,
  },
  videoContainer: {
    width: width * 0.9,
    height: (width * 0.9 * 9) / 16,
    borderRadius: 10,
    overflow: "hidden",
    alignSelf: "center",
    backgroundColor: "#000",
  },
  video: {
    flex: 1,
  },
});

export default MilestonoVideoSection;
