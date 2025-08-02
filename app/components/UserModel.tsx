"use client"

import type React from "react"
import { useRef, useEffect, useState } from "react"
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  Platform,
  ScrollView,
  Alert,
} from "react-native"
import { FontAwesome5 } from "@expo/vector-icons"
import ToggleMenus from "./ToggleMenus"
import type { NavigationProp } from "@react-navigation/native"
import { useNavigation } from "expo-router"
import axios from "axios"
import * as SecureStore from "expo-secure-store"
import { BASE_URL } from "@env"

const { width } = Dimensions.get("window")

interface UserModelProps {
  visible: boolean
  onClose: () => void
}

interface IUserData {
  userFullName: string
  premiumEndDate: string
  countOfContactedProperty: number
  countOfSavedProperty: number
  countOfPostedProperty: number
  countOfRequestedService: number
  countOfProvidedService: number
}

const UserModel: React.FC<UserModelProps> = ({ visible, onClose }) => {
  const navigation = useNavigation<NavigationProp<any>>()
  const [showModal, setShowModal] = useState(visible)
  const slideAnim = useRef(new Animated.Value(width)).current

  // Authentication and user data states
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const [crmAccess, setCrmAccess] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(true)
  const [userData, setUserData] = useState<IUserData>({
    userFullName: "",
    premiumEndDate: "",
    countOfContactedProperty: 0,
    countOfSavedProperty: 0,
    countOfPostedProperty: 0,
    countOfRequestedService: 0,
    countOfProvidedService: 0,
  })

  // Authentication function
  const authenticateUser = async (): Promise<void> => {
    try {
      const token = await SecureStore.getItemAsync("auth")
      if (!token) {
        console.log("No auth token found")
        setIsAuthenticated(false)
        return
      }

      const response = await axios.get(`${BASE_URL}/api/authenticate`, {
        headers: {
          Authorization: token,
        },
      }) as any

      setIsAuthenticated(response.data.role === "user")
    } catch (error) {
      console.error("Authentication error:", error)
      setIsAuthenticated(false)
    }
  }

  // Agent/CRM access check
  const authenticateAgent = async (): Promise<void> => {
    try {
      const token = await SecureStore.getItemAsync("auth")
      if (!token) {
        console.log("No auth token found for CRM access")
        setCrmAccess(false)
        return
      }

      const response = await axios.get(`${BASE_URL}/api/crm-access`, {
        headers: {
          Authorization: token,
        },
      }) as any

      setCrmAccess(response.data.crmAccess === true)
    } catch (error) {
      console.error("CRM access check error:", error)
      setCrmAccess(false)
    }
  }

  // Fetch user data including all counts
  const getUserData = async (): Promise<void> => {
    try {
      const token = await SecureStore.getItemAsync("auth")
      if (!token) {
        console.log("No auth token found for user data")
        return
      }

      const response = await axios.get(`${BASE_URL}/api/user-data`, {
        headers: {
          Authorization: token,
        },
      })

      setUserData(response.data as IUserData)
    } catch (error) {
      console.error("Error fetching user data:", error)
      // Set default values on error
      setUserData({
        userFullName: "",
        premiumEndDate: "",
        countOfContactedProperty: 0,
        countOfSavedProperty: 0,
        countOfPostedProperty: 0,
        countOfRequestedService: 0,
        countOfProvidedService: 0,
      })
    }
  }

  // Google logout function
  const handleGoogleLogout = async (): Promise<void> => {
    try {
      await axios.get(`${BASE_URL}/auth/logout`)
    } catch (error) {
      console.error("Google logout error:", error)
    }
  }

  // Complete logout function
  const logout = async (): Promise<void> => {
    try {
      // Remove local tokens
      await SecureStore.deleteItemAsync("auth")
      await SecureStore.deleteItemAsync("user_id")

      // Call Google logout
      await handleGoogleLogout()

      // Reset states
      setIsAuthenticated(false)
      setCrmAccess(false)
      setUserData({
        userFullName: "",
        premiumEndDate: "",
        countOfContactedProperty: 0,
        countOfSavedProperty: 0,
        countOfPostedProperty: 0,
        countOfRequestedService: 0,
        countOfProvidedService: 0,
      })

      // Close modal and navigate
      onClose()
      navigation.navigate("index")

      Alert.alert("Success", "Logged out successfully")
    } catch (error) {
      console.error("Logout error:", error)
      Alert.alert("Error", "Failed to logout completely")
    }
  }

  // Initialize data when modal opens
  const initializeData = async (): Promise<void> => {
    setLoading(true)
    try {
      await Promise.all([authenticateUser(), authenticateAgent(), getUserData()])
    } catch (error) {
      console.error("Failed to initialize data:", error)
    } finally {
      setLoading(false)
    }
  }

  // Handle navigation to authenticated routes
  const navigateToRoute = (route: string): void => {
    if (isAuthenticated) {
      onClose()
      navigation.navigate(route)
    } else {
      Alert.alert("Authentication Required", "Please login to access this feature", [
        { text: "Cancel", style: "cancel" },
        {
          text: "Login",
          onPress: () => {
            onClose()
            navigation.navigate("LoginPage")
          },
        },
      ])
    }
  }

  // Animation effects
  useEffect(() => {
    if (visible) {
      setShowModal(true)
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start()
      initializeData()
    } else {
      Animated.timing(slideAnim, {
        toValue: width,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setShowModal(false))
    }
  }, [visible])

  if (!showModal) return null

  const firstName = userData.userFullName ? userData.userFullName.split(" ")[0] : ""
  const isPremiumActive = userData.premiumEndDate && new Date(userData.premiumEndDate) > new Date()

  return (
    <Modal visible transparent animationType="none" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <Animated.View style={[styles.modal, { transform: [{ translateX: slideAnim }] }]}>
          <ScrollView
            style={styles.scrollView}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollViewContent}
          >
            {/* Header with greeting and login/logout */}
            <View style={styles.header}>
              <View style={styles.headerContent}>
                <Text style={styles.greeting}>Hello {firstName || "User"} 👋</Text>
                {isAuthenticated ? (
                  <TouchableOpacity style={styles.loginButton} onPress={logout}>
                    <Text style={styles.loginText}>Logout</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={styles.loginButton}
                    onPress={() => {
                      onClose()
                      navigation.navigate("LoginPage")
                    }}
                  >
                    <Text style={styles.loginText}>Login</Text>
                  </TouchableOpacity>
                )}
              </View>
              <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                <FontAwesome5 name="times" size={24} color="#fff" />
              </TouchableOpacity>
            </View>

            {/* Premium status */}
            {isPremiumActive && (
              <Text style={styles.premiumLabel}>
                Premium Account Active up to {new Date(userData.premiumEndDate).toLocaleDateString()}
              </Text>
            )}

            {/* My Property Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>My Property</Text>
              <View style={styles.divider} />

              <View style={styles.statsContainer}>
                <View style={styles.statBox}>
                  <Text style={styles.statTitle}>Saved Properties</Text>
                  <Text style={styles.statNumber}>{userData.countOfSavedProperty}</Text>
                </View>
                <View style={styles.statBox}>
                  <Text style={styles.statTitle}>Contacted Properties</Text>
                  <Text style={styles.statNumber}>{userData.countOfContactedProperty}</Text>
                </View>
                <View style={styles.statBox}>
                  <Text style={styles.statTitle}>Posted Properties</Text>
                  <Text style={styles.statNumber}>{userData.countOfPostedProperty}</Text>
                </View>
              </View>

              {/* Property Actions */}
              <View style={styles.actionContainer}>
                <TouchableOpacity
                  style={[styles.actionBox, { backgroundColor: "#E3F2FD" }]}
                  onPress={() => {
                    onClose()
                    navigation.navigate("SearchPropertyPage")
                  }}
                >
                  <FontAwesome5 name="search" size={24} color="#1976D2" />
                  <Text style={styles.actionText}>Search Property</Text>
                </TouchableOpacity>

                <Text style={styles.orText}>Or</Text>

                <TouchableOpacity
                  style={[styles.actionBox, { backgroundColor: "#E8F5E8" }]}
                  onPress={() => navigation.navigate("PostPropertyPage")}
                >
                  <FontAwesome5 name="plus" size={24} color="#388E3C" />
                  <Text style={styles.actionText}>Post your property</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* My Service Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>My Service</Text>
              <View style={styles.divider} />

              <View style={styles.statsContainer}>
                <View style={styles.statBox}>
                  <Text style={styles.statTitle}>Used Services</Text>
                  <Text style={styles.statNumber}>{userData.countOfRequestedService}</Text>
                </View>
                <View style={styles.statBox}>
                  <Text style={styles.statTitle}>Provided Services</Text>
                  <Text style={styles.statNumber}>{userData.countOfProvidedService}</Text>
                </View>
              </View>

              {/* Service Actions */}
              <View style={styles.actionContainer}>
                <TouchableOpacity
                  style={[styles.actionBox, { backgroundColor: "#FFF3E0" }]}
                  onPress={() => navigateToRoute("RequestServiceForm")}
                >
                  <FontAwesome5 name="hands-helping" size={24} color="#F57C00" />
                  <Text style={styles.actionText}>Use Service</Text>
                </TouchableOpacity>

                <Text style={styles.orText}>Or</Text>

                <TouchableOpacity
                  style={[styles.actionBox, { backgroundColor: "#FCE4EC" }]}
                  onPress={() => navigateToRoute("ReceivedServiceRequests")}
                >
                  <FontAwesome5 name="cogs" size={24} color="#C2185B" />
                  <Text style={styles.actionText}>Received Service Requests</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Additional Menu Items */}
            {isAuthenticated && (
              <View style={styles.menuSection}>
                <TouchableOpacity style={styles.menuItem} onPress={() => navigateToRoute("MyProperty")}>
                  <FontAwesome5 name="building" size={20} color="#666" />
                  <Text style={styles.menuText}>My Property</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.menuItem} onPress={() => navigateToRoute("MyService")}>
                  <FontAwesome5 name="wrench" size={20} color="#666" />
                  <Text style={styles.menuText}>My Service</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.menuItem} onPress={() => navigateToRoute("Premium")}>
                  <FontAwesome5 name="gem" size={20} color="#666" />
                  <Text style={styles.menuText}>Premium Account</Text>
                </TouchableOpacity>

                {crmAccess && (
                  <TouchableOpacity style={styles.menuItem} onPress={() => navigateToRoute("AgentDashboard")}>
                    <FontAwesome5 name="user-secret" size={20} color="#666" />
                    <Text style={styles.menuText}>Agent Dashboard</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}

            {/* Toggle Menus Component */}
            <ToggleMenus onClose={onClose} />
          </ScrollView>
        </Animated.View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modal: {
    flex: 1,
    backgroundColor: "#fff",
    width: "100%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "ios" ? 50 : 30,
    paddingBottom: 20,
    backgroundColor: "#232761",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerContent: {
    flex: 1,
  },
  greeting: {
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 10,
    color: "#fff",
  },
  premiumLabel: {
    paddingHorizontal: 20,
    marginTop: 10,
    marginBottom: 10,
    color: "#ffd700",
    fontWeight: "500",
    fontSize: 14,
    textAlign: "center",
  },
  loginButton: {
    backgroundColor: "#fff",
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 10,
    alignSelf: "flex-start",
  },
  loginText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#232761",
  },
  closeButton: {
    padding: 5,
    borderRadius: 20,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingBottom: 40,
  },
  section: {
    paddingHorizontal: 20,
    marginTop: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
    color: "#666",
  },
  divider: {
    height: 1,
    backgroundColor: "#e0e0e0",
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  statBox: {
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    padding: 15,
    flex: 1,
    marginHorizontal: 5,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
  },
  statTitle: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
    marginBottom: 5,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "700",
    color: "#333",
  },
  actionContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 10,
  },
  actionBox: {
    flex: 1,
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    height: 100,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
  },
  actionText: {
    marginTop: 10,
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
    color: "#333",
  },
  orText: {
    marginHorizontal: 15,
    fontSize: 16,
    fontWeight: "600",
    color: "#666",
  },
  menuSection: {
    paddingHorizontal: 20,
    marginTop: 30,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  menuText: {
    marginLeft: 15,
    fontSize: 16,
    color: "#333",
  },
})

export default UserModel
