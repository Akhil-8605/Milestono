import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { WebView } from "react-native-webview";

// Get device width for responsive design
const { width } = Dimensions.get("window");

const MilestonoVideoSection = () => {
  return (
    <View style={styles.container}>
      {/* Section Heading */}
      <Text style={styles.heading}>Watch Video About MILESTONO</Text>
      <Text style={styles.subHeading}>Watch the video what is Milestono</Text>

      {/* Embedded YouTube Video */}
      <View style={styles.videoContainer}>
        <WebView
          style={{ flex: 1 }}
          javaScriptEnabled
          source={{
            uri: "https://www.youtube.com/embed/QyF0oGxdG80?si=q2_PHs5qza8PFSGV",
          }}
        />
        {/* <iframe
          width="100%"
          height="100%"
          src="https://www.youtube.com/embed/QyF0oGxdG80?si=q2_PHs5qza8PFSGV"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        ></iframe> */}
      </View>
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
  highlight: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#000",
  },
  subHeading: {
    fontSize: 12,
    fontWeight: "600",
    color: "#666",
    marginBottom: 15,
  },
  videoContainer: {
    width: width * 0.9,
    height: (width * 0.9 * 9) / 16, // Maintain 16:9 aspect ratio
    borderRadius: 10,
    overflow: "hidden",
    alignSelf: "center",
  },
  video: {
    flex: 1,
  },
});

export default MilestonoVideoSection;
