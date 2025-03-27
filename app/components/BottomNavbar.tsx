import React, { useState } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { useNavigation } from "expo-router";
import NotificationModal from "./NotificationModel";
import UserModel from "./UserModel";

const BottomTab = () => {
  const navigation = useNavigation();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserModel, setShowUserModel] = useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.navBackground}></View>

      <View style={styles.iconContainer}>
        <TouchableOpacity onPress={() => navigation.navigate("index" as never)}>
          <FontAwesome5 name="home" size={24} color="#232761" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate("InsightPage" as never)}
        >
          <FontAwesome5 name="lightbulb" size={24} color="#232761" />
        </TouchableOpacity>
        <View style={{ width: 60 }} />
        <TouchableOpacity onPress={() => setShowNotifications(true)}>
          <FontAwesome5 name="bell" size={24} color="#232761" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setShowUserModel(true)}>
          <FontAwesome5 name="user" size={24} color="#232761" />
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate("PostPropertyPage" as never)}
      >
        <FontAwesome5 name="plus" size={24} color="white" />
      </TouchableOpacity>

      <NotificationModal 
        visible={showNotifications}
        onClose={() => setShowNotifications(false)}
      />

      <UserModel
        visible={showUserModel}
        onClose={() => setShowUserModel(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 100000000,
    elevation: 10,
    width: "100%",
    height: 70,
    alignItems: "center",
    backgroundColor: "transparent",
  },
  navBackground: {
    position: "absolute",
    width: "100%",
    height: 80,
    backgroundColor: "#fff",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
  },
  iconContainer: {
    flexDirection: "row",
    width: "90%",
    justifyContent: "space-between",
    position: "absolute",
    bottom: 25,
  },
  fab: {
    position: "absolute",
    backgroundColor: "#232761",
    top: 10,
    width: 50,
    height: 50,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
});

export default BottomTab;