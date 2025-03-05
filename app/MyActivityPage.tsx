import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  Dimensions,
  StatusBar,
} from "react-native";

const { width } = Dimensions.get("window");

const TABS = [
  { id: "viewed", title: "Recently Viewed" },
  { id: "posted", title: "Posted Properties" },
  { id: "shortlisted", title: "Shortlisted" },
  { id: "contacted", title: "Contacted" },
];

const dummyViewedProperties = [
  {
    id: "1",
    image: require("../assets/images/dummyImg.webp"),
    heading: "Luxury Apartment",
    landmark: "Near Park",
    city: "New York",
  },
  {
    id: "2",
    image: require("../assets/images/dummyImg.webp"),
    heading: "Cozy Studio",
    landmark: "Downtown",
    city: "Los Angeles",
  },
  {
    id: "3",
    image: require("../assets/images/dummyImg.webp"),
    heading: "Spacious Villa",
    landmark: "Beachfront",
    city: "Miami",
  },
];

const dummyPostedProperties = [
  {
    id: "4",
    image: require("../assets/images/dummyImg.webp"),
    bedrooms: "2",
    sellType: "Sale",
    city: "Chicago",
    uniqueFeatures: "Modern design",
    areaSqft: 1200,
    pricePerSqFt: 250,
    expectedPrice: 300000,
    propertyCategory: "Apartment",
  },
  {
    id: "5",
    image: require("../assets/images/dummyImg.webp"),
    bedrooms: "1RK",
    sellType: "Rent",
    city: "San Francisco",
    uniqueFeatures: "Great location",
    areaSqft: 600,
    pricePerSqFt: 50,
    expectedPrice: 30000,
    propertyCategory: "Studio",
  },
  {
    id: "6",
    image: require("../assets/images/dummyImg.webp"),
    bedrooms: "3",
    sellType: "Sale",
    city: "Houston",
    uniqueFeatures: "Large garden",
    areaSqft: 2000,
    pricePerSqFt: 150,
    expectedPrice: 300000,
    propertyCategory: "House",
  },
];

const dummyShortlistedProperties = [
  {
    id: "7",
    image: require("../assets/images/dummyImg.webp"),
    heading: "Charming Cottage",
    city: "Boston",
    date: new Date(),
    expectedPrice: 250000,
  },
  {
    id: "8",
    image: require("../assets/images/dummyImg.webp"),
    heading: "Elegant Townhouse",
    city: "Philadelphia",
    date: new Date(),
    expectedPrice: 400000,
  },
  {
    id: "9",
    image: require("../assets/images/dummyImg.webp"),
    heading: "Rustic Cabin",
    city: "Denver",
    date: new Date(),
    expectedPrice: 180000,
  },
];

const dummyContactedProperties = [
  {
    id: "10",
    image: require("../assets/images/dummyImg.webp"),
    heading: "Seaside Condo",
    city: "Seattle",
    dateContacted: new Date(),
  },
  {
    id: "11",
    image: require("../assets/images/dummyImg.webp"),
    heading: "Mountain View Home",
    city: "Phoenix",
    dateContacted: new Date(),
  },
  {
    id: "12",
    image: require("../assets/images/dummyImg.webp"),
    heading: "Lakefront Estate",
    city: "Austin",
    dateContacted: new Date(),
  },
];

interface ViewedProperty {
  id: string;
  image: any;
  heading: string;
  landmark: string;
  city: string;
}

const ViewedPropertyCard = ({ item }: { item: ViewedProperty }) => (
  <TouchableOpacity style={styles.viewedCard}>
    <Image source={item.image} style={styles.viewedImage} />
    <View style={styles.viewedContent}>
      <Text style={styles.viewedTitle}>{item.heading}</Text>
      <Text style={styles.viewedLocation}>
        {item.landmark} | {item.city}
      </Text>
    </View>
  </TouchableOpacity>
);

interface PostedProperty {
  id: string;
  image: any;
  bedrooms: string;
  sellType: string;
  city: string;
  uniqueFeatures: string;
  areaSqft: number;
  pricePerSqFt: number;
  expectedPrice: number;
  propertyCategory: string;
}

const PostedPropertyCard = ({ item }: { item: PostedProperty }) => (
  <View style={styles.postedCard}>
    <Image source={item.image} style={styles.postedImage} />
    <View style={styles.postedContent}>
      <Text style={styles.postedTitle}>
        {item.bedrooms}
        {item.bedrooms !== "1RK" ? "BHK" : ""} Flat for {item.sellType} in{" "}
        {item.city}
      </Text>
      <Text style={styles.postedDescription}>{item.uniqueFeatures}</Text>
      <View style={styles.tagContainer}>
        {[
          item.city,
          item.propertyCategory,
          `Built-up Area: ${item.areaSqft} sq.ft`,
          `₹${item.pricePerSqFt}/sq.ft`,
        ].map((tag, index) => (
          <View key={index} style={styles.tag}>
            <Text style={styles.tagText}>{tag}</Text>
          </View>
        ))}
      </View>
      <Text style={styles.price}>Price: ₹{item.expectedPrice}</Text>
      <TouchableOpacity style={styles.viewButton}>
        <Text style={styles.viewButtonText}>View Details</Text>
      </TouchableOpacity>
    </View>
  </View>
);

const ShortlistedPropertyCard = ({
  item,
  onRemove,
}: {
  item: any;
  onRemove: (id: string) => void;
}) => (
  <View style={styles.shortlistedCard}>
    <Image source={item.image} style={styles.shortlistedImage} />
    <View style={styles.shortlistedContent}>
      <Text style={styles.shortlistedTitle}>{item.heading}</Text>
      <Text style={styles.shortlistedLocation}>{item.city}</Text>
      <Text style={styles.dateText}>
        Added on: {new Date(item.date).toLocaleDateString("en-GB")}
      </Text>
      <Text style={styles.shortlistedPrice}>₹{item.expectedPrice}</Text>
      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.viewButton}>
          <Text style={styles.viewButtonText}>View Details</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => onRemove(item.id)}
        >
          <Text style={styles.removeButtonText}>Remove</Text>
        </TouchableOpacity>
      </View>
    </View>
  </View>
);

interface ContactedProperty {
  id: string;
  image: any;
  heading: string;
  city: string;
  dateContacted: Date;
}

const ContactedPropertyCard = ({ item }: { item: ContactedProperty }) => (
  <View style={styles.contactedCard}>
    <Image source={item.image} style={styles.contactedImage} />
    <View style={styles.contactedContent}>
      <Text style={styles.contactedTitle}>{item.heading}</Text>
      <Text style={styles.contactedLocation}>{item.city}</Text>
      <Text style={styles.dateText}>
        Contacted on: {new Date(item.dateContacted).toLocaleDateString("en-GB")}
      </Text>
      <Text style={styles.contactedStatus}>Contacted</Text>
      <TouchableOpacity style={styles.viewButton}>
        <Text style={styles.viewButtonText}>View Details</Text>
      </TouchableOpacity>
    </View>
  </View>
);

export default function PropertyActivities() {
  const [activeTab, setActiveTab] = useState("viewed");

  const renderTabContent = () => {
    switch (activeTab) {
      case "viewed":
        return (
          <View style={styles.sectionContainer}>
            <Text style={{ fontSize: 28, fontWeight: 700, color: "#333333" }}>
              Viewed Properties
            </Text>
            <Text style={styles.sectionSubtitle}>
              Contact now to close the deal
            </Text>
            <FlatList
              data={dummyViewedProperties}
              renderItem={({ item }) => <ViewedPropertyCard item={item} />}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
            />
          </View>
        );
      case "posted":
        return (
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Posted Properties</Text>
            <FlatList
              data={dummyPostedProperties}
              renderItem={({ item }) => <PostedPropertyCard item={item} />}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
            />
          </View>
        );
      case "shortlisted":
        return (
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Shortlisted Properties</Text>
            <FlatList
              data={dummyShortlistedProperties}
              renderItem={({ item }) => (
                <ShortlistedPropertyCard
                  item={item}
                  onRemove={(id) => console.log("Remove:", id)}
                />
              )}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
            />
          </View>
        );
      case "contacted":
        return (
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Contacted Properties</Text>
            <FlatList
              data={dummyContactedProperties}
              renderItem={({ item }) => <ContactedPropertyCard item={item} />}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
            />
          </View>
        );
      default:
        return null;
    }
  };

  const statusBarHeight = StatusBar.currentHeight || 0;

  return (
    <SafeAreaView style={[styles.container,{marginTop: statusBarHeight}]}>
      <View style={styles.tabContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabScroll}
        >
          {TABS.map((tab) => (
            <TouchableOpacity
              key={tab.id}
              style={[styles.tab, activeTab === tab.id && styles.activeTab]}
              onPress={() => setActiveTab(tab.id)}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === tab.id && styles.activeTabText,
                ]}
              >
                {tab.title}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      <View style={styles.content}>{renderTabContent()}</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  tabContainer: {
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  tabScroll: {
    paddingHorizontal: 16,
  },
  tab: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginRight: 16,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: "#2563eb",
  },
  tabText: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  activeTabText: {
    color: "#2563eb",
    fontWeight: "600",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  sectionContainer: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: 700,
    color: "#333333",
    marginBottom: 16,
  },
  sectionSubtitle: {
    fontSize: 15,
    color: "#666",
    fontWeight: "500",
    marginBottom: 16,
  },
  // Viewed Property Card Styles
  viewedCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 16,
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: "lightgrey",
  },
  viewedImage: {
    width: "100%",
    height: 200,
    borderBottomWidth: 1,
    borderColor: "lightgrey",
  },
  viewedContent: {
    padding: 16,
  },
  viewedTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  viewedLocation: {
    fontSize: 14,
    color: "#666",
  },
  // Posted Property Card Styles
  postedCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 16,
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: "lightgrey",
  },
  postedImage: {
    width: "100%",
    height: 200,
    borderBottomWidth: 1,
    borderColor: "lightgrey",
  },
  postedContent: {
    padding: 16,
  },
  postedTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },
  postedDescription: {
    fontSize: 14,
    color: "#666",
    marginBottom: 12,
  },
  tagContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 12,
  },
  tag: {
    backgroundColor: "#f3f4f6",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    fontSize: 12,
    color: "#666",
  },
  price: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },
  // Shortlisted Property Card Styles
  shortlistedCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 16,
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: "lightgrey",
  },
  shortlistedImage: {
    width: "100%",
    height: 200,
    borderBottomWidth: 1,
    borderColor: "lightgrey",
  },
  shortlistedContent: {
    padding: 16,
  },
  shortlistedTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 4,
  },
  shortlistedLocation: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  shortlistedPrice: {
    fontSize: 20,
    fontWeight: "700",
    marginVertical: 8,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 12,
  },
  // Contacted Property Card Styles
  contactedCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 16,
    padding: 16,
    flexDirection: "row",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  contactedImage: {
    width: 120,
    height: "100%",
    borderRadius: 8,
  },
  contactedContent: {
    flex: 1,
    marginLeft: 16,
  },
  contactedTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  contactedLocation: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  contactedStatus: {
    color: "#10b981",
    fontSize: 14,
    fontWeight: "500",
    marginVertical: 4,
  },
  dateText: {
    fontSize: 14,
    color: "#666",
    marginVertical: 4,
  },
  // Common Button Styles
  viewButton: {
    backgroundColor: "#232761",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignItems: "center",
    flex: 1,
  },
  viewButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
  },
  removeButton: {
    backgroundColor: "#ef4444",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignItems: "center",
    flex: 1,
  },
  removeButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
  },
});
