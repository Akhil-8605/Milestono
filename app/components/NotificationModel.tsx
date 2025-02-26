import React, { useState, useEffect, useRef } from "react";
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
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";

const WINDOW_HEIGHT = Dimensions.get("window").height;
const WINDOW_WIDTH = Dimensions.get("window").width;
const DRAG_THRESHOLD = 50;
const DEFAULT_HEIGHT = WINDOW_HEIGHT * 0.8;

interface NotificationModalProps {
  visible: boolean;
  onClose: () => void;
}

const NotificationModal: React.FC<NotificationModalProps> = ({
  visible,
  onClose,
}) => {
  const slideAnim = useRef(new Animated.Value(0)).current;
  const [modalHeight, setModalHeight] = useState(DEFAULT_HEIGHT);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) =>
        Math.abs(gestureState.dy) > 5,
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) {
          // Dragging down—animate the modal downwards
          slideAnim.setValue(gestureState.dy);
        } else {
          // Dragging upward—calculate new height starting at default height
          // and clamp it so it does not exceed full screen height.
          const newHeight = Math.min(
            WINDOW_HEIGHT,
            DEFAULT_HEIGHT - gestureState.dy
          );
          setModalHeight(newHeight);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        // Define a threshold between default and full screen.
        const thresholdHeight =
          DEFAULT_HEIGHT + (WINDOW_HEIGHT - DEFAULT_HEIGHT) / 2;
        if (gestureState.dy > DRAG_THRESHOLD) {
          // If dragged downward enough, close the modal.
          closeModal();
        } else if (gestureState.dy < -DRAG_THRESHOLD) {
          // If dragged upward significantly, snap to full screen.
          Animated.spring(slideAnim, {
            toValue: 0,
            useNativeDriver: false,
          }).start();
          setModalHeight(WINDOW_HEIGHT);
        } else {
          // Snap to the nearest state based on current modal height.
          if (modalHeight >= thresholdHeight) {
            Animated.spring(slideAnim, {
              toValue: 0,
              useNativeDriver: false,
            }).start();
            setModalHeight(WINDOW_HEIGHT);
          } else {
            Animated.spring(slideAnim, {
              toValue: 0,
              useNativeDriver: false,
            }).start();
            setModalHeight(DEFAULT_HEIGHT);
          }
        }
      },
    })
  ).current;

  useEffect(() => {
    if (visible) {
      setModalHeight(DEFAULT_HEIGHT);
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: false,
        tension: 65,
        friction: 11,
      }).start();
    }
  }, [visible, slideAnim]);

  const closeModal = () => {
    Animated.timing(slideAnim, {
      toValue: WINDOW_HEIGHT,
      duration: 300,
      useNativeDriver: false,
    }).start(() => {
      onClose();
      setModalHeight(DEFAULT_HEIGHT);
    });
  };

  const notifications = [
    {
      id: 1,
      avatar: require("../../assets/images/PersonDummy.png"),
      name: "Hailey Garza",
      action: "added new tags",
      target: "🔥 Ease Design System",
      time: "1 min ago",
    },
    {
      id: 2,
      avatar: require("../../assets/images/PersonDummy.png"),
      name: "Emily",
      action: "asked to join",
      target: "🔥 Ease Design System",
      time: "1 hour ago",
    },
    {
      id: 3,
      avatar: require("../../assets/images/PersonDummy.png"),
      name: "Kamron",
      action: "asked to join",
      target: "🔥 Ease Design System",
      time: "1 hour ago",
    },
    // Additional notifications for scrolling
    ...Array(10)
      .fill(0)
      .map((_, i) => ({
        id: i + 4,
        avatar: require("../../assets/images/PersonDummy.png"),
        name: `User ${i + 1}`,
        action: "performed an action",
        target: "🔥 Ease Design System",
        time: `${i + 2} hours ago`,
      })),
  ];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={closeModal}
    >
      <StatusBar
        backgroundColor="rgba(0, 0, 0, 0.5)"
        barStyle="light-content"
      />
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
            <Text style={styles.tabText}>Inbox ({notifications.length})</Text>
            <View style={styles.tabUnderline} />
          </View>

          <ScrollView
            style={styles.notificationList}
            showsVerticalScrollIndicator={false}
          >
            {notifications.map((notification) => (
              <View key={notification.id} style={styles.notificationItem}>
                <Image source={notification.avatar} style={styles.avatar} />
                <View style={styles.notificationContent}>
                  <Text style={styles.notificationText}>
                    <Text style={styles.boldText}>{notification.name}</Text>{" "}
                    {notification.action} to{" "}
                    <Text style={styles.boldText}>{notification.target}</Text>
                  </Text>
                  <Text style={styles.timeText}>{notification.time}</Text>
                  <View style={styles.actionButtons}>
                    <TouchableOpacity style={styles.acceptButton}>
                      <Text style={styles.acceptButtonText}>Accept</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.declineButton}>
                      <Text style={styles.declineButtonText}>Decline</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))}
          </ScrollView>
        </Animated.View>
      </View>
    </Modal>
  );
};

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
  tabText: {
    fontSize: 18,
    fontWeight: "600",
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
});

export default NotificationModal;
