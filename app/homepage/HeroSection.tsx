import React from "react";
import {
  StyleSheet,
  View,
  Text,
  ImageBackground,
  TextInput,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  ScrollView,
  Image,
} from "react-native";
import { useNavigation } from "expo-router";

const HeroSection= () => {
  const navigation = useNavigation();
  return (
    <View style={stylesHero.container}>
      <StatusBar translucent backgroundColor="transparent" />
      <ImageBackground
        source={require("../../assets/images/homebg.jpg")}
        style={stylesHero.backgroundImage}
        resizeMode="cover"
      >
        <View style={stylesHero.overlay} />

        <TouchableOpacity style={stylesHero.header}>
          <Text style={stylesHero.logo}>milestono</Text>
          <TouchableOpacity style={stylesHero.buyButton}>
            <Text style={stylesHero.buyLink}>Buy in Nashik</Text>
          </TouchableOpacity>
          <TouchableOpacity style={stylesHero.menuButton}>
            <svg
              width="35px"
              height="35px"
              viewBox="0 0 24 24"
              fill="white"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M4 5C3.44772 5 3 5.44772 3 6C3 6.55228 3.44772 7 4 7H20C20.5523 7 21 6.55228 21 6C21 5.44772 20.5523 5 20 5H4ZM7 12C7 11.4477 7.44772 11 8 11H20C20.5523 11 21 11.4477 21 12C21 12.5523 20.5523 13 20 13H8C7.44772 13 7 12.5523 7 12ZM13 18C13 17.4477 13.4477 17 14 17H20C20.5523 17 21 17.4477 21 18C21 18.5523 20.5523 19 20 19H14C13.4477 19 13 18.5523 13 18Z"
                fill="white"
              ></path>
            </svg>
          </TouchableOpacity>
        </TouchableOpacity>

        <View style={stylesHero.content}>
          <View style={stylesHero.textWrapper}>
            <Text style={stylesHero.mainTitle}>
              Milestono <Text style={stylesHero.description}>is an online</Text>
            </Text>
            <Text style={stylesHero.description}>
              platform offering properties in every city, perfect for sellers to
              reach more buyers and get the best deals.
            </Text>
          </View>

          <View style={stylesHero.searchWrapper}>
            <View style={stylesHero.tabContainer}>
              <TouchableOpacity style={stylesHero.activeTab}>
                <Text style={stylesHero.activeTabText}>Real Estate</Text>
              </TouchableOpacity>
              <TouchableOpacity style={stylesHero.inactiveTab}>
                <Text style={stylesHero.inactiveTabText}>Services</Text>
              </TouchableOpacity>
            </View>

            <View style={stylesHero.searchContainer}>
              <TextInput
                style={stylesHero.searchInput}
                placeholder="Search 'Delhi'"
                placeholderTextColor="#666"
              />
              <TouchableOpacity>
              <svg
                width="30px"
                height="30px"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                fill="#232761"
                style={stylesHero.searchIcon}
              >
                <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                <g
                  id="SVGRepo_tracerCarrier"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ></g>
                <g id="SVGRepo_iconCarrier">
                  {" "}
                  <g>
                    {" "}
                    <path fill="none" d="M0 0h24v24H0z"></path>{" "}
                    <path
                      fill-rule="nonzero"
                      d="M13 1l.001 3.062A8.004 8.004 0 0 1 19.938 11H23v2l-3.062.001a8.004 8.004 0 0 1-6.937 6.937L13 23h-2v-3.062a8.004 8.004 0 0 1-6.938-6.937L1 13v-2h3.062A8.004 8.004 0 0 1 11 4.062V1h2zm-1 5a6 6 0 1 0 0 12 6 6 0 0 0 0-12zm0 4a2 2 0 1 1 0 4 2 2 0 0 1 0-4z"
                    ></path>{" "}
                  </g>{" "}
                </g>
              </svg>
              </TouchableOpacity>
              <TouchableOpacity style={stylesHero.searchButton}>
                <Text
                  style={stylesHero.searchButtonText}
                  onPress={() => navigation.navigate("SearchResults" as never)}
                >
                  Search
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ImageBackground>
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
    height: height * 0.6,
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
    left: 205,
    top: 25,
  },
  buyLink: {
    color: "white",
    fontSize: 14,
    fontWeight: "500",
  },
  menuButton: {
    padding: 10,
    cursor: "pointer",
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
    width: "100%",
    paddingHorizontal: 20,
    flexWrap: "wrap",
    maxWidth: 500,
  },
  mainTitle: {
    color: "white",
    fontSize: 38,
    fontWeight: "600",
    textAlign: "left",
    width: "60%",
  },
  boldText: {
    fontWeight: "bold",
  },
  description: {
    color: "white",
    fontSize: 16,
    lineHeight: 24,
    textAlign: "left",
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

export default HeroSection
