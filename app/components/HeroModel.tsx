"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  StyleSheet,
  Dimensions,
  ScrollView,
  Pressable,
  Platform,
  Modal,
} from "react-native"
import FontAwesome5 from "react-native-vector-icons/FontAwesome5"
import { useNavigation } from "expo-router"
import ToggledMenus from "./ToggleMenus"
import axios from "axios"
import * as SecureStore from "expo-secure-store"

const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL || "http://localhost:3000"

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window")

interface MenuModalProps {
  isVisible: boolean
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

const MenuModal: React.FC<MenuModalProps> = ({ isVisible, onClose }) => {
  const navigation = useNavigation()

  // Authentication and user data states
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const [crmAccess, setCrmAccess] = useState<boolean>(false)
  const [userData, setUserData] = useState<IUserData>({
    userFullName: "",
    premiumEndDate: "",
    countOfContactedProperty: 0,
    countOfSavedProperty: 0,
    countOfPostedProperty: 0,
    countOfRequestedService: 0,
    countOfProvidedService: 0,
  })
  const [loading, setLoading] = useState<boolean>(false)

  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current

  // Authentication function
  const authenticateUser = async (): Promise<void> => {
    try {
      const token = await SecureStore.getItemAsync("auth")
      if (!token) {
        setIsAuthenticated(false)
        return
      }

      const response = await axios.get(`${BASE_URL}/api/authenticate`, {
        headers: { Authorization: token },
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
        setCrmAccess(false)
        return
      }

      const response = await axios.get(`${BASE_URL}/api/crm-access`, {
        headers: { Authorization: token },
      }) as any

      setCrmAccess(response.data.crmAccess === true)
    } catch (error) {
      console.error("CRM access check error:", error)
      setCrmAccess(false)
    }
  }

  // Fetch user data
  const getUserData = async (): Promise<void> => {
    try {
      const token = await SecureStore.getItemAsync("auth")
      if (!token) return

      const response = await axios.get(`${BASE_URL}/api/user-data`, {
        headers: { Authorization: token },
      })

      setUserData(response.data as IUserData)
    } catch (error) {
      console.error("Error fetching user data:", error)
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
  const handleLogout = async (): Promise<void> => {
    try {
      setLoading(true)

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
      handleClose()
      navigation.navigate("index" as never)
    } catch (error) {
      console.error("Logout error:", error)
    } finally {
      setLoading(false)
    }
  }

  // Handle login navigation
  const handleLogin = (): void => {
    handleClose()
    navigation.navigate("LoginPage" as never)
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

  // Disable body scroll for web when modal is visible
  useEffect(() => {
    if (Platform.OS === "web") {
      if (isVisible) {
        document.body.style.overflow = "hidden"
      } else {
        document.body.style.overflow = ""
      }
    }
    return () => {
      if (Platform.OS === "web") {
        document.body.style.overflow = ""
      }
    }
  }, [isVisible])

  // Handle opening animation and data initialization
  useEffect(() => {
    if (isVisible) {
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 50,
        friction: 8,
      }).start()
      initializeData()
    }
  }, [isVisible])

  // Handle close animation
  const handleClose = () => {
    Animated.timing(slideAnim, {
      toValue: SCREEN_HEIGHT,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      onClose()
    })
  }

  // Action buttons data
  const actionButtons = [
    {
      title: "Post property",
      subtitle: "Sell/Rent faster with Milestono",
      icon: "building",
      color: "#e3f2fd",
      iconBg: "#1565c0",
      linkto: "PostPropertyPage",
    },
    {
      title: "Saved Property",
      subtitle: "Saved Properties here, click to see",
      icon: "bookmark",
      color: "#fff3e0",
      iconBg: "#e65100",
      linkto: "MyActivityPage",
    },
    {
      title: "Post Service",
      subtitle: "List your services here",
      icon: "plus-circle",
      color: "#e8f5e9",
      iconBg: "#2e7d32",
      linkto: "PostService",
    },
    {
      title: "Use Service",
      subtitle: "Browse and use available services",
      icon: "tools",
      color: "#fce4ec",
      iconBg: "#c2185b",
      linkto: "RequestServiceForm",
    },
  ]

  // Get display name for greeting
  const getDisplayName = (): string => {
    if (!isAuthenticated || !userData.userFullName) {
      return "User"
    }
    return userData.userFullName.split(" ")[0]
  }

  return (
    <Modal animationType="none" transparent visible={isVisible} onRequestClose={handleClose}>
      <View style={styles.rootContainer}>
        <Pressable style={styles.backdrop} onPress={handleClose} />
        <Animated.View style={[styles.modalContainer, { transform: [{ translateY: slideAnim }] }]}>
          <View style={styles.handleBarContainer}>
            <View style={styles.handleBar} />
          </View>

          <View style={styles.header}>
            <View style={styles.profileSection}>
              <View style={styles.avatarContainer}>
                <View style={styles.avatar}>
                  <FontAwesome5 name="user-alt" size={18} color="#999" />
                </View>
              </View>
              <View style={styles.headerText}>
                <Text style={styles.greeting}>Hello {getDisplayName()} 👋</Text>
                {isAuthenticated ? (
                  <TouchableOpacity
                    style={styles.loginButton}
                    activeOpacity={0.7}
                    onPress={handleLogout}
                    disabled={loading}
                  >
                    <FontAwesome5 name="sign-out-alt" size={14} color="#232761" />
                    <Text style={styles.loginText}>{loading ? "Logging out..." : "Logout"}</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity style={styles.loginButton} activeOpacity={0.7} onPress={handleLogin}>
                    <FontAwesome5 name="sign-in-alt" size={14} color="#232761" />
                    <Text style={styles.loginText}>Login</Text>
                  </TouchableOpacity>
                )}
              </View>
              <TouchableOpacity style={styles.closeButton} onPress={handleClose} activeOpacity={0.7}>
                <FontAwesome5 name="times" size={22} color="#666" />
              </TouchableOpacity>
            </View>
          </View>

          <ScrollView
            style={styles.scrollView}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollViewContent}
          >
            {/* Display user stats if authenticated */}
            {isAuthenticated && (
              <View style={styles.userStatsContainer}>
                <View style={styles.statsRow}>
                  <View style={styles.statItem}>
                    <Text style={styles.statNumber}>{userData.countOfSavedProperty}</Text>
                    <Text style={styles.statLabel}>Saved</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Text style={styles.statNumber}>{userData.countOfContactedProperty}</Text>
                    <Text style={styles.statLabel}>Contacted</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Text style={styles.statNumber}>{userData.countOfPostedProperty}</Text>
                    <Text style={styles.statLabel}>Posted</Text>
                  </View>
                </View>
                <View style={styles.statsRow}>
                  <View style={styles.statItem}>
                    <Text style={styles.statNumber}>{userData.countOfRequestedService}</Text>
                    <Text style={styles.statLabel}>Used Services</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Text style={styles.statNumber}>{userData.countOfProvidedService}</Text>
                    <Text style={styles.statLabel}>Provided Services</Text>
                  </View>
                </View>
              </View>
            )}

            <View style={styles.actionButtons}>
              {actionButtons.map((action, index) => (
                <TouchableOpacity
                  key={index}
                  style={[styles.actionButton, { backgroundColor: action.color }]}
                  activeOpacity={0.8}
                  onPress={() => {
                    if (
                      action.linkto === "PostPropertyPage" ||
                      action.linkto === "MyActivityPage" ||
                      action.linkto === "RequestServiceForm"
                    ) {
                      if (!isAuthenticated) {
                        handleLogin()
                        return
                      }
                    }
                    handleClose()
                    navigation.navigate(action.linkto as never)
                  }}
                >
                  <View style={[styles.actionIcon, { backgroundColor: action.iconBg }]}>
                    <FontAwesome5 name={action.icon} size={18} color="white" solid />
                  </View>
                  <View style={styles.actionTextContainer}>
                    <Text style={styles.actionTitle}>{action.title}</Text>
                    <Text style={styles.actionSubtitle}>{action.subtitle}</Text>
                  </View>
                  <FontAwesome5 name="chevron-right" size={14} color="#999" />
                </TouchableOpacity>
              ))}
            </View>

            <ToggledMenus onClose={onClose} />

            <View style={styles.footer}>
              <Text style={styles.footerText}>© 2024 Milestono. All rights reserved.</Text>
            </View>
          </ScrollView>
        </Animated.View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  rootContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    zIndex: 9999,
    elevation: 9999,
    ...Platform.select({
      web: {
        position: "fixed",
      },
    }),
  },
  backdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  modalContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "white",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: "90%",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    ...Platform.select({
      web: {
        position: "fixed",
      },
    }),
  },
  handleBarContainer: {
    width: "100%",
    alignItems: "center",
    paddingVertical: 12,
  },
  handleBar: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#e0e0e0",
  },
  scrollView: {
    maxHeight: "90%",
  },
  scrollViewContent: {
    paddingBottom: 30,
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatarContainer: {
    marginRight: 15,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  headerText: {
    flex: 1,
  },
  greeting: {
    fontSize: 18,
    fontWeight: "700",
    color: "#232761",
    marginBottom: 4,
  },
  loginButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  loginText: {
    color: "#232761",
    fontSize: 16,
    marginLeft: 8,
    fontWeight: "500",
  },
  closeButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: "#f5f5f5",
  },
  userStatsContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#f8f9fa",
    marginBottom: 10,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 10,
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: "700",
    color: "#232761",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
  },
  actionButtons: {
    padding: 16,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 14,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  actionIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },
  actionTextContainer: {
    flex: 1,
    marginLeft: 16,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#232761",
    marginBottom: 4,
  },
  actionSubtitle: {
    fontSize: 13,
    color: "#666",
  },
  footer: {
    padding: 16,
    alignItems: "center",
  },
  footerText: {
    fontSize: 12,
    color: "#999",
  },
})

export default MenuModal
