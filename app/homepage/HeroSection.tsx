"use client"

import type React from "react"
import { useEffect, useState, useRef } from "react"
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
  Alert,
  type ImageSourcePropType,
} from "react-native"
import Svg, { G, Path } from "react-native-svg"
import MenuModal from "../components/HeroModel"
import { useNavigation, useRouter } from "expo-router"
import AsyncStorage from "@react-native-async-storage/async-storage"
import axios from "axios"
import * as Location from "expo-location"
import { LinearGradient } from "expo-linear-gradient"
import { BASE_URL, GOOGLE_API_KEY } from "@env"

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
]

interface UserData {
  premiumEndDate: string
  userFullName: string
}

const OVERLAY_COLOR = "rgba(35, 39, 97, 0.6)"
const OVERLAY_SOLID = "rgba(35, 39, 97, 1)"

const HeroSection: React.FC = () => {
  const navigation = useNavigation()
  const router = useRouter()

  const [isMenuVisible, setIsMenuVisible] = useState<boolean>(false)
  const [index, setIndex] = useState<number>(0)
  const [city, setCity] = useState<string>("Loading...")
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const [userData, setUserData] = useState<UserData>({ premiumEndDate: "", userFullName: "" })
  const [latLong, setLatLong] = useState<[number, number]>([18.52097398044019, 73.86017831259551])

  const [images, setImages] = useState<string[]>([])
  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null)
  const rotateIndexRef = useRef(0)

  const translateY = useRef(new Animated.Value(0)).current

  useEffect(() => {
    getCityName(latLong[0], latLong[1])
  }, [])

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

  const authenticateUser = async () => {
    try {
      const token = await AsyncStorage.getItem("auth")
      if (!token) {
        setIsAuthenticated(false)
        setUserData({ premiumEndDate: "", userFullName: "" })
        return
      }
      const response = await axios.get(`${BASE_URL}/api/authenticate`, {
        headers: { Authorization: token },
      })
      const data = response.data as { role?: string }
      setIsAuthenticated(data.role === "user")
    } catch (error) {
      console.error("Authentication error:", error)
      setIsAuthenticated(false)
      setUserData({ premiumEndDate: "", userFullName: "" })
    }
  }

  const getUserData = async () => {
    try {
      const token = await AsyncStorage.getItem("auth")
      if (!token) return
      const response = await axios.get(`${BASE_URL}/api/user-data`, {
        headers: { Authorization: token },
      })
      setUserData(response.data as UserData)
    } catch (error) {
      console.error("Error fetching user data:", error)
      setUserData({ premiumEndDate: "", userFullName: "" })
    }
  }

  const getCityName = async (latitude: number, longitude: number) => {
    const apiKey = GOOGLE_API_KEY
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`

    try {
      const response = await fetch(url)
      const data = await response.json()
      if (data.status === "OK" && data.results.length > 0) {
        const cityComponent = data.results[0].address_components.find((component: any) =>
          component.types.includes("locality"),
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

  const getAreaName = async () => {
    const apiKey = GOOGLE_API_KEY
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latLong[0]},${latLong[1]}&key=${apiKey}`

    try {
      const response = await fetch(url)
      const data = await response.json()
      const addressComponents = data.results[0]?.address_components || []

      const areaComponent =
        addressComponents.find((c: any) => c.types.includes("sublocality_level_1")) ||
        addressComponents.find((c: any) => c.types.includes("locality"))

      const location = areaComponent?.long_name || "Pune"
      router.push({ pathname: "/SearchPage", params: { location } })
    } catch (error) {
      console.error("Error fetching area name", error)
      router.push({ pathname: "/SearchPage", params: { location: "Pune" } })
    }
  }

  const handleLogout = async () => {
    try {
      await AsyncStorage.multiRemove(["auth", "user_id"])
      setIsAuthenticated(false)
      setUserData({ premiumEndDate: "", userFullName: "" })
      Alert.alert("Success", "Logged out successfully")
      // Optionally navigate to home or login page after logout
      // navigation.navigate("HomePage" as never);
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  const handleLogin = () => {
    // Navigate to your login page
    navigation.navigate("LoginPage" as never) // Replace "LoginPage" with your actual login route
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
        setIndex((prevIndex) => (prevIndex + 1) % cities.length)
      })
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    // This useEffect is redundant as getCityName is called in the first useEffect
    // getCityName(latLong[0], latLong[1])
  }, [])

  useEffect(() => {
    authenticateUser()
    getUserData()
  }, [])

  useEffect(() => {
    let isMounted = true
    let rotateTimer: ReturnType<typeof setInterval> | null = null

    const fetchImages = async () => {
      try {
        const screenWidth = Dimensions.get("window").width
        const endpoint = screenWidth > 768 ? `${BASE_URL}/api/gallery` : `${BASE_URL}/api/mob-gallery`

        const res = await axios.get(endpoint, { timeout: 10000 })
        const data = res.data as Array<{ image?: string } | string>

        const urls: string[] = Array.isArray(data)
          ? data.map((item) => (typeof item === "string" ? item : item?.image)).filter((u): u is string => !!u)
          : []

        if (!isMounted) return

        if (urls.length) {
          setImages(urls)
          rotateIndexRef.current = 0
          setCurrentImageUrl(urls[0])

          // rotate every 3s like the web version
          rotateTimer && clearInterval(rotateTimer)
          rotateTimer = setInterval(() => {
            rotateIndexRef.current = (rotateIndexRef.current + 1) % urls.length
            setCurrentImageUrl(urls[rotateIndexRef.current])
          }, 3000)
        } else {
          setImages([])
          setCurrentImageUrl(null)
        }
      } catch (e) {
        console.error("Failed to fetch hero gallery:", e)
        if (isMounted) {
          setImages([])
          setCurrentImageUrl(null)
        }
      }
    }

    fetchImages()

    // clean up on unmount
    return () => {
      isMounted = false
      if (rotateTimer) clearInterval(rotateTimer)
    }
  }, [])

  const backgroundSource: ImageSourcePropType = currentImageUrl
    ? { uri: currentImageUrl }
    : require("../../assets/images/homebg.jpg")

  return (
    <View style={stylesHero.container}>
      <StatusBar translucent backgroundColor="transparent" />
      <ImageBackground source={backgroundSource} style={stylesHero.backgroundImage} resizeMode="cover">
        <View style={stylesHero.overlay} />

        {/* Right-to-left fade overlay using LinearGradient.
            Opaque on the right, smoothly fading to transparent on the left. */}
        <LinearGradient
          colors={[OVERLAY_SOLID, "rgba(35, 39, 97, 0.5)", "rgba(255, 255, 255, 0)"]}
          start={{ x: 1, y: 0 }}
          end={{ x: 0, y: 0 }}
          style={stylesHero.fadeOverlay}
          pointerEvents="none"
        />

        <View style={stylesHero.header}>
          <Text style={stylesHero.logo}>milestono</Text>
          <View style={stylesHero.buyButton}>
            <Text style={stylesHero.buyLink}>Buy in {city}</Text>
          </View>
          <TouchableOpacity style={stylesHero.menuButton} onPress={() => setIsMenuVisible(true)}>
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
              <Text style={stylesHero.mainTitle}>Milestono</Text> is an online platform offering properties in every
              city, perfect for sellers to reach more buyers and get the best deals.
            </Text>
          </View>

          <View style={stylesHero.searchWrapper}>
            <View style={stylesHero.tabContainer}>
              <TouchableOpacity style={stylesHero.activeTab}>
                <Text style={stylesHero.activeTabText}>Real Estate</Text>
              </TouchableOpacity>
              <TouchableOpacity style={stylesHero.inactiveTab} onPress={() => router.push("/ServicePage")}>
                <Text style={stylesHero.inactiveTabText}>Services</Text>
              </TouchableOpacity>
            </View>

            <Pressable style={stylesHero.searchContainer} onPress={() => router.push("/SearchPage")}>
              <Animated.Text style={[stylesHero.searchInput]}>{`Search "${cities[index]}"`}</Animated.Text>
              <TouchableOpacity onPress={getAreaName}>
                <Svg width="20" height="20" viewBox="0 0 24 24" fill="#232761" style={stylesHero.searchIcon}>
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
              </TouchableOpacity>
              <TouchableOpacity style={stylesHero.searchButton} onPress={() => router.push("/SearchPage")}>
                <Text style={stylesHero.searchButtonText}>Search</Text>
              </TouchableOpacity>
            </Pressable>
          </View>
        </View>
      </ImageBackground>

      <MenuModal isVisible={isMenuVisible} onClose={() => setIsMenuVisible(false)} />
    </View>
  )
}

const { width, height } = Dimensions.get("window")
const stylesHero = StyleSheet.create({
  container: {
    marginBottom: 5,
  },
  backgroundImage: {
    width: "100%",
    height: 325,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: OVERLAY_COLOR,
  },
  fadeOverlay: {
    ...StyleSheet.absoluteFillObject,
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
  searchContainer: {
    flexDirection: "row",
    backgroundColor: "white",
    borderRadius: 8,
    overflow: "hidden",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 10,
    color: "#333",
    paddingVertical: 10,
  },
  searchButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#232761",
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 6,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchButtonText: {
    color: "white",
    fontSize: 8,
    fontWeight: "bold",
  },
})

export default HeroSection