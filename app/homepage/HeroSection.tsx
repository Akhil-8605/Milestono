import React, { useEffect, useState, useRef } from "react";
import {
  StyleSheet,
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  Animated,
  Pressable,
} from "react-native";
import Svg, { G, Path } from "react-native-svg";
import { useNavigation } from "expo-router";
import MenuModal from "../components/HeroModel";

const cities = [
  "Pune",
  "Mumbai",
  "Solapur",
  "Satara",
  "Amravati",
  "Nashik",
  "Delhi",
  "Hyderabad",
  "Noida",
  "Bangalore",
  "Chennai",
  "Kolkata",
  "Ahmedabad",
];

const HeroSection = () => {
  const navigation = useNavigation();
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [index, setIndex] = useState(0);
  const translateY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const interval = setInterval(() => {
      Animated.sequence([
        Animated.timing(translateY, {
          toValue: -20,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setIndex((prevIndex) => (prevIndex + 1) % cities.length);
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <View style={stylesHero.container}>
      <StatusBar translucent backgroundColor="transparent" />
      <ImageBackground
        source={require("../../assets/images/homebg.jpg")}
        style={stylesHero.backgroundImage}
        resizeMode="cover"
      >
        <View style={stylesHero.overlay} />

        <View style={stylesHero.header}>
          <Text style={stylesHero.logo}>milestono</Text>
          <View style={stylesHero.buyButton}>
            <Text style={stylesHero.buyLink}>Buy in Nashik</Text>
          </View>
          <TouchableOpacity
            style={stylesHero.menuButton}
            onPress={() => setIsMenuVisible(true)}
          >
            <Svg width="35" height="35" viewBox="0 0 24 24" fill="white">
              <Path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M4 5C3.44772 5 3 5.44772 3 6C3 6.55228 3.44772 7 4 7H20C20.5523 7 21 6.55228 21 6C21 5.44772 20.5523 5 20 5H4ZM7 12C7 11.4477 7.44772 11 8 11H20C20.5523 11 21 11.4477 21 12C21 12.5523 20.5523 13 20 13H8C7.44772 13 7 12.5523 7 12ZM13 18C13 17.4477 13.4477 17 14 17H20C20.5523 17 21 17.4477 21 18C21 18.5523 20.5523 19 20 19H14C13.4477 19 13 18.5523 13 18Z"
                fill="white"
              />
            </Svg>
          </TouchableOpacity>
        </View>

        <View style={stylesHero.content}>
          <View style={stylesHero.textWrapper}>
            <Text style={stylesHero.description}>
              <Text style={stylesHero.mainTitle}>Milestono</Text> is an online
              platform offering properties in every city, perfect for sellers to
              reach more buyers and get the best deals.
            </Text>
          </View>

          <View style={stylesHero.searchWrapper}>
            <View style={stylesHero.tabContainer}>
              <TouchableOpacity style={stylesHero.activeTab}>
                <Text style={stylesHero.activeTabText}>Real Estate</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={stylesHero.inactiveTab}
                onPress={() => navigation.navigate("SignupPage" as never)}
              >
                <Text style={stylesHero.inactiveTabText}>Services</Text>
              </TouchableOpacity>
            </View>

            <Pressable
              style={stylesHero.searchContainer}
              onPress={() => navigation.navigate("SearchPage" as never)}
            >
              <Animated.Text style={[stylesHero.searchInput]}>
                {`Search "${cities[index]}"`}
              </Animated.Text>
              <View>
                <Svg
                  width="30"
                  height="30"
                  viewBox="0 0 24 24"
                  fill="#232761"
                  style={stylesHero.searchIcon}
                >
                  <G id="SVGRepo_iconCarrier">
                    <G>
                      <Path fill="none" d="M0 0h24v24H0z" />
                      <Path
                        fillRule="nonzero"
                        d="M13 1l.001 3.062A8.004 8.004 0 0 1 19.938 11H23v2l-3.062.001a8.004 8.004 0 0 1-6.937 6.937L13 23h-2v-3.062a8.004 8.004 0 0 1-6.938-6.937L1 13v-2h3.062A8.004 8.004 0 0 1 11 4.062V1h2zm-1 5a6 6 0 1 0 0 12 6 6 0 0 0 0-12zm0 4a2 2 0 1 1 0 4 2 2 0 0 1 0-4z"
                      />
                    </G>
                  </G>
                </Svg>
              </View>
              <View style={stylesHero.searchButton}>
                <Text style={stylesHero.searchButtonText}>Search</Text>
              </View>
            </Pressable>
          </View>
        </View>
      </ImageBackground>

      <MenuModal
        isVisible={isMenuVisible}
        onClose={() => setIsMenuVisible(false)}
      />
    </View>
  );
};

const { width, height } = Dimensions.get("window");
const stylesHero = StyleSheet.create({
  container: {
    marginBottom: 5,
  },
  backgroundImage: {
    width: "100%",
    height: 450,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(35, 39, 97, 0.6)",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    height: 80,
    position: "absolute",
    width: "100%",
  },
  logo: {
    color: "white",
    fontSize: 38,
    fontWeight: "bold",
  },
  buyButton: {
    position: "absolute",
    left: 200,
    top: 25,
  },
  buyLink: {
    color: "white",
    fontSize: 14,
    fontWeight: "500",
  },
  menuButton: {
    padding: 10,
  },
  content: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    paddingBottom: 40,
  },
  textWrapper: {
    alignItems: "flex-end",
    textAlign: "left",
    marginBottom: 30,
    paddingTop: 25,
    width: "100%",
    paddingHorizontal: 20,
    maxWidth: 600,
    maxHeight: 175,
  },
  mainTitle: {
    fontSize: 38,
    fontWeight: "600",
  },
  boldText: {
    fontWeight: "bold",
  },
  description: {
    color: "white",
    fontSize: 16,
    textAlign: "left",
    justifyContent: "flex-end",
    fontWeight: "400",
    maxWidth: "80%",
    width: "60%",
  },
  searchWrapper: {
    width: "90%",
    maxWidth: 480,
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 6,
    padding: 4,
    marginBottom: 16,
    alignSelf: "center",
  },
  activeTab: {
    backgroundColor: "white",
    paddingVertical: 10,
    paddingHorizontal: 32,
    borderRadius: 6,
  },
  inactiveTab: {
    paddingVertical: 10,
    paddingHorizontal: 32,
  },
  activeTabText: {
    color: "#000",
    fontSize: 14,
    fontWeight: "bold",
  },
  inactiveTabText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
  searchContainer: {
    flexDirection: "row",
    height: 50,
    backgroundColor: "white",
    borderRadius: 8,
    overflow: "hidden",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#333",
    paddingVertical: 10,
  },
  searchButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#232761", // Dark blue button
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
});

export default HeroSection;
