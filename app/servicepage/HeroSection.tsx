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
  Linking,
  Alert,
} from "react-native";
import Svg, { G, Path } from "react-native-svg";
import { useNavigation } from "expo-router";
import MenuModal from "../components/HeroModel";
import * as Location from "expo-location";

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
  const [city, setCity] = useState("Loading...");
  const [latLong, setLatLong] = useState([18.52097398044019, 73.86017831259551]);
  const translateY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    getCityName(latLong[0], latLong[1])
  }, [latLong])

  useEffect(() => {
    const getLocation = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync()
        if (status !== "granted") {
          Alert.alert("Permission Denied", "Location permission is required to show city.")
          setCity("Pune")
          return
        }

        const location = await Location.getCurrentPositionAsync({})
        const latitude = location.coords.latitude
        const longitude = location.coords.longitude

        setLatLong([latitude, longitude])
        getCityName(latitude, longitude)
      } catch (error) {
        console.error("Error getting location", error)
        setCity("Pune")
      }
    }

    getLocation()
  }, [])

  const getCityName = async (latitude: number, longitude: number) => {
    const apiKey = "AIzaSyCd2I5FCBPa4-W9Ms1VQxhuKm4LeAF-Iiw"
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`

    try {
      const response = await fetch(url)
      const data = await response.json()
      if (data.status === "OK" && data.results.length > 0) {
        const cityComponent = data.results[0].address_components.find(
          (component: any) => component.types.includes("locality")
        )
        setCity(cityComponent ? cityComponent.long_name : "Unknown Location")
      } else {
        setCity("Pune")
      }
    } catch (error) {
      console.error("Error fetching city name", error)
      setCity("Pune")
    }
  }

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

  useEffect(() => {
    getCityName(latLong[0], latLong[1]);
  }, []);

  const ServiceForm = async () => {
    try {
      await Linking.openURL(`https://milestono.com/serviceform`);
    } catch (error) {
      console.error(error);
    }
  };

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
            <Text style={stylesHero.buyLink}>Buy in {city}</Text>
          </View>
          <TouchableOpacity
            style={stylesHero.menuButton}
            onPress={() => setIsMenuVisible(true)}
          >
            <Svg width="30" height="30" viewBox="0 0 24 24" fill="white">
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
              <Text style={stylesHero.mainTitle}>Milestono Services</Text> connects you with trusted service providers across every city. From home repairs to professional services, find the right expert for your needs.
            </Text>
          </View>

          <View style={stylesHero.searchWrapper}>
            <View style={stylesHero.tabContainer}>
              <TouchableOpacity
                style={stylesHero.inactiveTab}
                onPress={() => navigation.navigate("index" as never)}
              >
                <Text style={stylesHero.inactiveTabText}>Real Estate</Text>
              </TouchableOpacity>
              <TouchableOpacity style={stylesHero.activeTab}>
                <Text style={stylesHero.activeTabText}>Services</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[stylesHero.tabContainer, { padding: 12 }]}
              onPress={() => { ServiceForm() }}
            >
              <Text style={stylesHero.ServiceTitle}>
                Are you a Service Provider?
                <Text style={{ fontWeight: "700" }}> Post your service here.</Text>
              </Text>
            </TouchableOpacity>
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
    height: 300,
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
    fontSize: 28,
    fontWeight: "bold",
  },
  buyButton: {
    position: "absolute",
    left: 155,
    top: 25,
  },
  buyLink: {
    color: "white",
    fontSize: 10,
    fontWeight: "500",
  },
  menuButton: {
    padding: 10,
  },
  content: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    paddingBottom: 20,
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
    fontSize: 24,
    fontWeight: "600",
  },
  description: {
    color: "white",
    fontSize: 12,
    textAlign: "left",
    justifyContent: "flex-end",
    fontWeight: "400",
    maxWidth: "80%",
    width: "60%",
  },
  searchWrapper: {
    width: "80%",
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
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 6,
  },
  inactiveTab: {
    paddingVertical: 8,
    paddingHorizontal: 20,
  },
  activeTabText: {
    color: "#000",
    fontSize: 12,
    fontWeight: "bold",
  },
  inactiveTabText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  ServiceTitle: {
    color: "white",
    fontSize: 12,
    textAlign: "center",
  },
});

export default HeroSection;