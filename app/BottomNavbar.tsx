import React from "react";
import { View, TouchableOpacity, StyleSheet, Platform } from "react-native";
import Svg, { Path } from "react-native-svg";
import { FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "expo-router";

const BottomTab = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={styles.navBackground}></View>

      <View style={styles.iconContainer}>
        <TouchableOpacity
          onPress={() => navigation.navigate("Login" as never)}
        >
          <FontAwesome5 name="home" size={24} color="#232761" />
        </TouchableOpacity>
        <TouchableOpacity>
          <FontAwesome5 name="lightbulb" size={24} color="#232761" />
        </TouchableOpacity>
        <View style={{ width: 60 }} />
        <TouchableOpacity>
          <FontAwesome5 name="bell" size={24} color="#232761" />
        </TouchableOpacity>
        <TouchableOpacity>
          <FontAwesome5 name="user" size={24} color="#232761" />
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.fab}>
        <FontAwesome5 name="plus" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "sticky",
    bottom: 0,
    width: "100%",
    height: 80,
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
    // borderWidth: .1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  svgStyle: {
    position: "absolute",
    bottom: 0,
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
    width: 60,
    height: 60,
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
