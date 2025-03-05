import React, { useState, useRef } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  Animated,
  Dimensions,
  SafeAreaView,
  StatusBar,
} from "react-native";

const { width } = Dimensions.get("window");

const tabs = [
  {
    id: "price",
    title: "Price Trends",
    content:
      "In 2024, real estate prices are rising, particularly for premium properties in urban areas, with an estimated 10% increase. Suburban homes are also seeing a price surge of 12%, driven by demand for more affordable housing.",
    image: require("../assets/images/insigntPageImg1.jpg"),
  },
  {
    id: "transaction",
    title: "Transaction Prices",
    content:
      "Transaction prices have been fluctuating, with a 5% decrease in overall transaction volume in key cities. However, luxury properties continue to perform well, showing a sharp increase in high-value transactions.",
    image: require("../assets/images/insigntPageImg2.jpg"),
  },
  {
    id: "reviews",
    title: "Reviews",
    content:
      "Reviews highlight a growing sense of transparency in real estate transactions, fueled by emerging technologies like blockchain. Buyers and agents are reporting smoother, faster, and more secure property deals.",
    image: require("../assets/images/insigntPageImg3.jpg"),
  },
  {
    id: "market",
    title: "Market Trends",
    content:
      "2024 sees a shift towards sustainable, energy-efficient homes, with an increasing demand for eco-friendly living spaces. Urban housing prices have risen by 7%, while suburban developments have surged by 15%.",
    image: require("../assets/images/insigntPageImg4.jpg"),
  },
  {
    id: "expert",
    title: "Expert Opinions",
    content:
      "Industry experts predict that 2024 will be a transformative year for real estate. With rising interest rates, buyers are moving toward smaller, affordable properties.",
    image: require("../assets/images/insigntPageImg5.jpg"),
  },
  {
    id: "investment",
    title: "Investment Tips",
    content:
      "Smart investing in real estate involves targeting emerging locations with growth potential and securing rental yields of 7%-10%. Diversifying investments across both residential and commercial properties helps mitigate risks.",
    image: require("../assets/images/insigntPageImg6.jpg"),
  },
];

export default function RealEstateApp() {
  const [activeTab, setActiveTab] = useState(0);
  const slideAnim = useRef(new Animated.Value(0)).current;
  const scrollViewRef = useRef<ScrollView>(null);

  const handleTabPress = (index: number) => {
    const direction = index > activeTab ? 1 : -1;
    slideAnim.setValue(direction * width);

    setActiveTab(index);

    scrollViewRef.current?.scrollTo({
      x: index * 130,
      animated: true,
    });

    Animated.spring(slideAnim, {
      toValue: 0,
      useNativeDriver: true,
      tension: 50,
      friction: 7,
    }).start();
  };

  const statusBarHeight = StatusBar.currentHeight || 0;

  return (
    <SafeAreaView style={[styles.container, { marginTop: statusBarHeight }]}>
      <View style={styles.header}></View>

      <View style={styles.tabWrapper}>
        <ScrollView
          ref={scrollViewRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.tabContainer}
          contentContainerStyle={styles.tabContentContainer}
        >
          {tabs.map((tab, index) => (
            <TouchableOpacity
              key={tab.id}
              style={[styles.tab, activeTab === index && styles.activeTab]}
              onPress={() => handleTabPress(index)}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === index && styles.activeTabText,
                ]}
              >
                {tab.title}
              </Text>
              {activeTab === index && <View style={styles.activeIndicator} />}
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <Animated.View
        style={[
          styles.contentContainer,
          {
            transform: [{ translateX: slideAnim }],
          },
        ]}
      >
        <View style={styles.card}>
          <Text style={styles.title}>{tabs[activeTab].title}</Text>
          <Text style={styles.content}>{tabs[activeTab].content}</Text>
          <Image
            source={tabs[activeTab].image}
            style={styles.image}
            resizeMode="cover"
          />
        </View>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    backgroundColor: "#1a237e",
    padding: 20,
    paddingTop: 40,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  headerTitle: {
    color: "#ffffff",
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
  tabWrapper: {
    backgroundColor: "#ffffff",
    marginTop: -20,
    marginHorizontal: 10,
    borderRadius: 15,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  tabContainer: {
    flexGrow: 0,
  },
  tabContentContainer: {
    paddingHorizontal: 5,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 4,
    borderRadius: 25,
    backgroundColor: "#f0f2ff",
    minWidth: 120,
    alignItems: "center",
  },
  activeTab: {
    backgroundColor: "#1a237e",
    shadowColor: "#1a237e",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 3,
  },
  tabText: {
    color: "#1a237e",
    fontSize: 14,
    fontWeight: "600",
  },
  activeTabText: {
    color: "#ffffff",
  },
  activeIndicator: {
    position: "absolute",
    bottom: -10,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#1a237e",
  },
  contentContainer: {
    flex: 1,
    padding: 20,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#1a237e",
    textAlign: "center",
  },
  content: {
    fontSize: 16,
    lineHeight: 24,
    color: "#424242",
    marginBottom: 20,
    textAlign: "center",
  },
  image: {
    width: "100%",
    height: 250,
    borderRadius: 15,
  },
});
