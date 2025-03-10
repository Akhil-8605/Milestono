import React,{useState} from "react";
import { View, Text, TouchableOpacity, FlexAlignType } from "react-native";
import Svg, { Path } from "react-native-svg";
import UserModel from "./UserModel";
function Header() {
  const [showUserModel, setShowUserModel] = useState(false);

  return (
    <>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          <Text style={styles.headerTitlePurple}>milestono</Text>
        </Text>

        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerButton}
          onPress={() => setShowUserModel(true)}
          >
            <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <Path
                d="M4 6H20M4 12H20M4 18H20"
                stroke="#3B82F6"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          </TouchableOpacity>
        </View>
      </View>
      <UserModel
        visible={showUserModel}
        onClose={() => setShowUserModel(false)}
      />
    </>
  );
}


const styles = {
  header: {
    flexDirection: "row" as "row",
    alignItems: "center" as FlexAlignType,
    justifyContent: "space-between" as "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#FFFFFF",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    zIndex: 10,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "900" as "900",
  },
  headerTitleBlue: {
    color: "#3B82F6",
  },
  headerTitlePurple: {
    color: "#232761",
  },
  headerActions: {
    flexDirection: "row" as "row",
    alignItems: "center" as FlexAlignType | undefined,
  },
  headerButton: {
    marginLeft: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center" as "center",
    alignItems: "center" as FlexAlignType,
    backgroundColor: "rgba(59, 130, 246, 0.1)",
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingBottom: 40,
  },
};

export default Header;