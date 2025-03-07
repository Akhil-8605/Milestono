import React, { useRef, useEffect, useState } from "react";
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
  StatusBar,
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import ToggledMenus from "./ToggleMenus";
import { useNavigation } from "expo-router";

const { width, height } = Dimensions.get("window");

interface UserModalProps {
  visible: boolean;
  onClose: () => void;
}

const UserModal: React.FC<UserModalProps> = ({ visible, onClose }) => {
  const navigation = useNavigation();
  const [showModal, setShowModal] = useState(visible);
  const slideAnim = useRef(new Animated.Value(width)).current;

  useEffect(() => {
    if (visible) {
      // When opening, ensure the modal is rendered and slide it in.
      setShowModal(true);
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      // When closing, animate the slide and then hide the modal.
      Animated.timing(slideAnim, {
        toValue: width,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setShowModal(false);
      });
    }
  }, [visible]);

  if (!showModal) return null;

  return (
    <Modal
      visible={showModal} // Use showModal here instead of the parent's visible prop.
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <StatusBar barStyle="light-content" backgroundColor="rgba(0,0,0,0.5)" />
      <View style={styles.overlay}>
        <BlurView intensity={100} style={StyleSheet.absoluteFill} />
        <Animated.View
          style={[styles.modal, { transform: [{ translateX: slideAnim }] }]}
        >
          <ScrollView
            style={styles.scrollView}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollViewContent}
          >
            <View style={styles.header}>
              <View style={styles.headerContent}>
                <Text style={styles.greeting}>Hello User👋</Text>
                <TouchableOpacity
                  style={styles.loginButton}
                  onPress={() => {
                    onClose()
                    navigation.navigate("LoginPage" as never);
                  }}
                >
                  <Text style={styles.loginText}>Login</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                <FontAwesome5 name="times" size={24} color="#fff" />
              </TouchableOpacity>
            </View>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>My Property</Text>
              <View style={styles.statsContainer}>
                <View style={styles.statBox}>
                  <Text style={styles.statTitle}>Saved Properties</Text>
                  <Text style={styles.statNumber}>0</Text>
                </View>
                <View style={styles.statBox}>
                  <Text style={styles.statTitle}>Contacted Properties</Text>
                  <Text style={styles.statNumber}>0</Text>
                </View>
                <View style={styles.statBox}>
                  <Text style={styles.statTitle}>Posted Properties</Text>
                  <Text style={styles.statNumber}>0</Text>
                </View>
              </View>
              <View style={styles.actionContainer}>
                <TouchableOpacity
                  style={[styles.actionBox, { backgroundColor: "#E6E6FF" }]}
                >
                  <FontAwesome5 name="search" size={24} color="#4B4BFF" />
                  <Text style={styles.actionText}>Search Property</Text>
                </TouchableOpacity>
                <Text style={styles.orText}>Or</Text>
                <TouchableOpacity
                  style={[styles.actionBox, { backgroundColor: "#FFE6D9" }]}
                >
                  <FontAwesome5 name="plus" size={24} color="#FF6B2C" />
                  <Text style={styles.actionText}>Post your property</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>My Service</Text>
              <View style={styles.statsContainer}>
                <View style={styles.statBox}>
                  <Text style={styles.statTitle}>Used Services</Text>
                  <Text style={styles.statNumber}>0</Text>
                </View>
                <View style={styles.statBox}>
                  <Text style={styles.statTitle}>Provided Services</Text>
                  <Text style={styles.statNumber}>0</Text>
                </View>
              </View>
              <View style={styles.actionContainer}>
                <TouchableOpacity
                  style={[styles.actionBox, { backgroundColor: "#E6FFE6" }]}
                >
                  <FontAwesome5 name="handshake" size={24} color="#00B300" />
                  <Text style={styles.actionText}>Use Service</Text>
                </TouchableOpacity>
                <Text style={styles.orText}>Or</Text>
                <TouchableOpacity
                  style={[styles.actionBox, { backgroundColor: "#FFE6FF" }]}
                >
                  <FontAwesome5 name="cog" size={24} color="#FF00FF" />
                  <Text style={styles.actionText}>Add Service</Text>
                </TouchableOpacity>
              </View>
            </View>
            <ToggledMenus onClose={onClose} />
          </ScrollView>
        </Animated.View>
      </View>
    </Modal>
  );
};

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
    marginBottom: 5,
    color: "#fff",
  },
  username: {
    fontSize: 32,
    fontWeight: "700",
    marginBottom: 15,
    color: "#fff",
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
    color: "#4B4BFF",
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
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 20,
    color: "#333",
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
    fontSize: 14,
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
  },
  actionBox: {
    flex: 1,
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    height: 130,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
  },
  actionText: {
    marginTop: 10,
    fontSize: 16,
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
});

export default UserModal;
