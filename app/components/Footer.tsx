import React from "react";
import { View, Text, StyleSheet, Linking } from "react-native";
import { FontAwesome, Entypo } from "@expo/vector-icons";

const MilestonoFooter = () => {
  return (
    <View style={styles.footer}>
      {/* Brand Name */}
      <Text style={styles.brand}>
        MILESTONO<Text style={{ color: "#fff" }}>.COM</Text>
      </Text>

      <View style={styles.row}>
        {/* Address Section */}
        <View style={styles.section}>
          <Text style={styles.heading}>Address</Text>
          <Text style={styles.text}>📍 Dwarka, New Delhi</Text>
          <Text
            style={styles.text}
            onPress={() => Linking.openURL("mailto:milestono8@gmail.com")}
          >
            📧 milestono8@gmail.com
          </Text>
        </View>

        {/* Quick Links */}
        <View style={styles.section}>
          <Text style={styles.heading}>Quick Links</Text>
          {["Home", "Services", "Properties", "Contact Us", "FAQs"].map(
            (item) => (
              <Text key={item} style={styles.link}>
                {item}
              </Text>
            )
          )}
        </View>
      </View>

      <View style={styles.row}>
        {/* Legals */}
        <View style={styles.section}>
          <Text style={styles.heading}>Legals</Text>
          {[
            "Privacy Policy",
            "Terms of Service",
            "Terms and Conditions",
            "Delivery Timeline",
            "Disclaimer",
            "Refund and Cancellation Policy",
          ].map((item) => (
            <Text key={item} style={styles.link}>
              {item}
            </Text>
          ))}
        </View>

        {/* Follow Us */}
        <View style={styles.section}>
          <Text style={styles.heading}>Follow Us</Text>
          <View style={styles.socialIcons}>
            <FontAwesome name="twitter" size={18} color="white" />
            <Entypo name="linkedin" size={18} color="white" />
            <FontAwesome name="instagram" size={18} color="white" />
            <FontAwesome name="facebook" size={18} color="white" />
            <Entypo name="paper-plane" size={18} color="white" />
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    backgroundColor: "#111",
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
  brand: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 15,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
  },
  section: {
    width: "45%", // Adjusts for responsiveness
    marginBottom: 20,
  },
  heading: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 10,
  },
  text: {
    fontSize: 14,
    color: "#ccc",
    marginBottom: 5,
  },
  link: {
    fontSize: 14,
    color: "#bbb",
    marginBottom: 5,
  },
  socialIcons: {
    flexDirection: "row",
    gap: 15,
    marginTop: 5,
  },
});

export default MilestonoFooter;
