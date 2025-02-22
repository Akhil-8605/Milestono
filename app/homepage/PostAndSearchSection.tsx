import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons"; // Make sure to install expo/vector-icons
import { FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "expo-router";

export default function PropertySearch() {
  const options = [
    { id: 1, title: "Buy", icon: "home", linkTo: "SearchPage" },
    { id: 2, title: "Rent", icon: "key", linkTo: "SearchPage" },
    { id: 3, title: "PG", icon: "bed", linkTo: "SearchPage" },
    { id: 4, title: "Commercial", icon: "building", linkTo: "SearchPage" },
    {
      id: 5,
      title: "Post",
      icon: "pen",
      linkTo: "PostPropertyPage",
    },
  ];
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>
          Post and search your{" "}
          <Text style={styles.highlightText}>Dream Home</Text>.
        </Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        {options.map((option) => (
          <TouchableOpacity
            key={option.id}
            style={styles.card}
            onPress={() => navigation.navigate(option.linkTo as never)}
          >
            <View style={styles.iconContainer}>
              <FontAwesome5 name={option.icon} size={24} color="#2E3192" />
            </View>
            <Text style={styles.cardText}>{option.title}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "transparent",
    padding: 20,
  },
  headerContainer: {
    marginBottom: 8,
  },
  headerText: {
    fontSize: 24,
    color: "#333",
    fontWeight: "500",
    textAlign: "left",
  },
  highlightText: {
    color: "#2E3192",
    fontWeight: "600",
  },
  scrollContainer: {
    paddingRight: 0,
    paddingLeft: 5,
    paddingTop: 10,
    paddingBottom: 10,
  },
  card: {
    alignItems: "center",
    marginRight: 16,
    backgroundColor: "#f5f5f5",
    padding: 16,
    borderRadius: 12,
    width: 150,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  iconContainer: {
    width: 70,
    height: 70,
    borderRadius: 50,
    backgroundColor: "#E8E8FF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  cardText: {
    fontSize: 18,
    color: "#333",
    fontWeight: "500",
  },
  newLaunchContainer: {
    marginTop: 32,
  },
  newLaunchTitle: {
    fontSize: 22,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  newLaunchSubtitle: {
    fontSize: 14,
    color: "#666",
  },
});
