"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Text,
  Animated,
  ScrollView,
  Image,
  Dimensions,
  PanResponder,
  StatusBar,
  Alert,
  RefreshControl, // Add this import
} from "react-native"
import { FontAwesome5 } from "@expo/vector-icons"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { io, type Socket } from "socket.io-client"
import { BASE_URL } from "@env"

const WINDOW_HEIGHT = Dimensions.get("window").height
const WINDOW_WIDTH = Dimensions.get("window").width
const DRAG_THRESHOLD = 50
const DEFAULT_HEIGHT = WINDOW_HEIGHT

interface Notification {
  _id: string
  text: string
  image?: string
  redirect: string
  createdAt: string
}

interface NotificationModalProps {
  visible: boolean
  onClose: () => void
}

const NotificationModal: React.FC<NotificationModalProps> = ({ visible, onClose }) => {
  const slideAnim = useRef(new Animated.Value(0)).current
  const [modalHeight, setModalHeight] = useState(DEFAULT_HEIGHT)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [activeTab, setActiveTab] = useState("Inbox")
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false) // New state for pull-to-refresh
  const socketRef = useRef<Socket | null>(null)

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => Math.abs(gestureState.dy) > 5,
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) {
          slideAnim.setValue(gestureState.dy)
        } else {
          const newHeight = Math.min(WINDOW_HEIGHT, DEFAULT_HEIGHT - gestureState.dy)
          setModalHeight(newHeight)
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        const thresholdHeight = DEFAULT_HEIGHT + (WINDOW_HEIGHT - DEFAULT_HEIGHT) / 2
        if (gestureState.dy > DRAG_THRESHOLD) {
          closeModal()
        } else if (gestureState.dy < -DRAG_THRESHOLD) {
          Animated.spring(slideAnim, {
            toValue: 0,
            useNativeDriver: false,
          }).start()
          setModalHeight(WINDOW_HEIGHT)
        } else {
          if (modalHeight >= thresholdHeight) {
            Animated.spring(slideAnim, {
              toValue: 0,
              useNativeDriver: false,
            }).start()
            setModalHeight(WINDOW_HEIGHT)
          } else {
            Animated.spring(slideAnim, {
              toValue: 0,
              useNativeDriver: false,
            }).start()
            setModalHeight(DEFAULT_HEIGHT)
          }
        }
      },
    }),
  ).current

  // Initialize Socket.IO connection
  useEffect(() => {
    const initializeSocket = async () => {
      try {
        const token = await AsyncStorage.getItem("auth")
        if (!token) return

        socketRef.current = io(BASE_URL, {
          transports: ["websocket"],
        })

        socketRef.current.emit("register", { token })

        socketRef.current.on("new-notification", (notification: Notification) => {
          setNotifications((prev) => [notification, ...prev])
        })

        socketRef.current.on("notification-read-confirmed", (updated: Notification) => {
          setNotifications((prev) => prev.filter((n) => n._id !== updated._id))
        })

        return () => {
          socketRef.current?.disconnect()
        }
      } catch (error) {
        console.error("Error initializing socket:", error)
      }
    }

    if (visible) {
      initializeSocket()
    }

    return () => {
      socketRef.current?.disconnect()
    }
  }, [visible, BASE_URL])

  // Fetch notifications from API
  const fetchNotifications = async () => {
    try {
      const token = await AsyncStorage.getItem("auth")
      if (!token) {
        console.error("No auth token found")
        return
      }

      const response = await fetch(`${BASE_URL}/api/notification`, {
        headers: {
          Authorization: token,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setNotifications(data)
      } else {
        console.error("Failed to fetch notifications")
      }
    } catch (error) {
      console.error("Error fetching notifications:", error)
    }
  }

  // Handle pull-to-refresh
  const onRefresh = async () => {
    setIsRefreshing(true)
    try {
      await fetchNotifications()
    } catch (error) {
      console.error("Refresh failed:", error)
    } finally {
      setIsRefreshing(false)
    }
  }

  // Handle marking notification as read
  const handleMarkAsRead = (notificationId: string) => {
    if (socketRef.current) {
      socketRef.current.emit("mark-notification-read", { notificationId })
    }
  }

  // Handle opening notification
  const handleOpenNotification = (notification: Notification) => {
    // Here you would typically navigate to the notification's target
    // For now, we'll show an alert
    Alert.alert("Notification", `Opening: ${notification.text}`, [
      {
        text: "OK",
        onPress: () => {
          // You can add navigation logic here
          // Example: navigation.navigate(notification.redirect);
        },
      },
    ])
  }

  useEffect(() => {
    if (visible) {
      setModalHeight(DEFAULT_HEIGHT)
      fetchNotifications()
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: false,
        tension: 65,
        friction: 11,
      }).start()
    }
  }, [visible, slideAnim])

  const closeModal = () => {
    Animated.timing(slideAnim, {
      toValue: WINDOW_HEIGHT,
      duration: 300,
      useNativeDriver: false,
    }).start(() => {
      onClose()
      setModalHeight(DEFAULT_HEIGHT)
    })
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

    if (diffInMinutes < 1) return "Just now"
    if (diffInMinutes < 60) return `${diffInMinutes} min ago`
    if (diffInMinutes < 1440)
      return `${Math.floor(diffInMinutes / 60)} hour${Math.floor(diffInMinutes / 60) > 1 ? "s" : ""} ago`
    return `${Math.floor(diffInMinutes / 1440)} day${Math.floor(diffInMinutes / 1440) > 1 ? "s" : ""} ago`
  }

  const renderNotification = (notification: Notification) => {
    return (
      <View key={notification._id} style={styles.notificationItem}>
        <Image
          source={notification.image ? { uri: notification.image } : require("../../assets/images/PersonDummy.png")}
          style={styles.avatar}
        />
        <View style={styles.notificationContent}>
          <Text style={styles.notificationText}>{notification.text}</Text>
          <Text style={styles.timeText}>{formatTime(notification.createdAt)}</Text>
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.acceptButton} onPress={() => handleOpenNotification(notification)}>
              <Text style={styles.acceptButtonText}>Open</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.declineButton} onPress={() => handleMarkAsRead(notification._id)}>
              <Text style={styles.declineButtonText}>Mark as read</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    )
  }

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={closeModal}>
      <StatusBar backgroundColor="rgba(0, 0, 0, 0.5)" barStyle="light-content" />
      <View style={styles.overlay}>
        <Animated.View
          style={[
            styles.modalContainer,
            {
              transform: [{ translateY: slideAnim }],
              height: modalHeight,
            },
          ]}
          {...panResponder.panHandlers}
        >
          <View style={styles.dragIndicator} />
          <View style={styles.header}>
            <Text style={styles.headerText}>Notifications</Text>
            <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
              <FontAwesome5 name="times" size={20} color="#232761" />
            </TouchableOpacity>
          </View>

          <View style={styles.tabContainer}>
            <TouchableOpacity
              onPress={() => setActiveTab("Inbox")}
              style={[styles.tabButton, activeTab === "Inbox" && styles.activeTab]}
            >
              <Text style={[styles.tabText, activeTab === "Inbox" && styles.activeTabText]}>
                Inbox ({notifications.length})
              </Text>
            </TouchableOpacity>
            {activeTab === "Inbox" && <View style={styles.tabUnderline} />}
          </View>

          <ScrollView
            style={styles.notificationList}
            showsVerticalScrollIndicator={false}
            refreshControl={
              // Add refreshControl prop
              <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
            }
          >
            {notifications.length > 0 ? (
              notifications.map(renderNotification)
            ) : (
              <View style={styles.emptyState}>
                <FontAwesome5 name="bell-slash" size={50} color="#9CA3AF" />
                <Text style={styles.emptyStateText}>No notifications yet</Text>
              </View>
            )}
          </ScrollView>
        </Animated.View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    width: WINDOW_WIDTH,
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingBottom: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  dragIndicator: {
    width: 40,
    height: 5,
    backgroundColor: "#E5E7EB",
    borderRadius: 3,
    alignSelf: "center",
    marginTop: 10,
    marginBottom: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  headerText: {
    fontSize: 24,
    fontWeight: "700",
    color: "#232761",
  },
  closeButton: {
    padding: 5,
  },
  tabContainer: {
    paddingVertical: 15,
  },
  tabButton: {
    paddingVertical: 5,
  },
  tabText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#9CA3AF",
  },
  activeTab: {
    // Add any active tab styling here
  },
  activeTabText: {
    color: "#232761",
  },
  tabUnderline: {
    height: 3,
    backgroundColor: "#232761",
    width: 100,
    marginTop: 8,
    borderRadius: 1.5,
  },
  notificationList: {
    flex: 1,
  },
  notificationItem: {
    flexDirection: "row",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
    borderWidth: 0.5,
    borderColor: "lightgrey",
  },
  notificationContent: {
    flex: 1,
  },
  notificationText: {
    fontSize: 16,
    color: "#4B5563",
    lineHeight: 22,
  },
  boldText: {
    fontWeight: "600",
    color: "#232761",
  },
  timeText: {
    fontSize: 14,
    color: "#9CA3AF",
    marginTop: 5,
  },
  actionButtons: {
    flexDirection: "row",
    marginTop: 10,
    gap: 10,
  },
  acceptButton: {
    backgroundColor: "#10B981",
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  acceptButtonText: {
    color: "white",
    fontWeight: "600",
  },
  declineButton: {
    backgroundColor: "#f43131",
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  declineButtonText: {
    color: "white",
    fontWeight: "600",
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 50,
  },
  emptyStateText: {
    fontSize: 16,
    color: "#9CA3AF",
    marginTop: 10,
  },
})

export default NotificationModal
