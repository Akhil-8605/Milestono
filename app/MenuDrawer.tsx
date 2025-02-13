import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Animated,
  ScrollView,
  Dimensions,
} from "react-native";
import { useNavigation } from "expo-router";
import Icon from "react-native-vector-icons/FontAwesome5";

const { height } = Dimensions.get("window");

const MenuDrawer = ({ menuOpen, toggleMenu, userData, isAuthenticated }: { menuOpen: boolean; toggleMenu: () => void; userData: any; isAuthenticated: boolean }) => {
  const navigation = useNavigation();
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const translateY = React.useRef(new Animated.Value(height)).current;

  React.useEffect(() => {
    Animated.timing(translateY, {
      toValue: menuOpen ? 0 : height,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [menuOpen]);

  const toggleSubmenu = (menu: string) => {
    setActiveMenu(activeMenu === menu ? null : menu);
  };

  const menuItems = [
    {
      title: "Home",
      subtitle: "Go to homepage",
      screen: "homepage",
      image: require("../assets/images/PersonDummy.png"),
    },
    {
      title: "Services",
      subtitle: "View our services",
      screen: "ServicesSection",
      image: require("../assets/images/PersonDummy.png"),
    },
    // Add more menu items as needed
  ];

  return (
    <Animated.View style={[styles.menuDrawer, { transform: [{ translateY }] }]}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.menuDrawerTop}>
          <View style={styles.topHeader}>
            <View style={styles.userInfo}>
              <Image
                source={require("../assets/images/PersonDummy.png")}
                style={styles.userImage}
              />
              <Text style={styles.greeting}>
                Hello
                {userData?.userFullName
                  ? ` ${userData.userFullName.split(" ")[0]},`
                  : ""}{" "}
                👋
              </Text>
            </View>
            <TouchableOpacity onPress={toggleMenu} style={styles.closeButton}>
              <Text style={styles.closeIcon}>×</Text>
            </TouchableOpacity>
          </View>

          {isAuthenticated ? (
            <TouchableOpacity
              style={styles.authButton}
              onPress={() => {
                /* Handle logout */
              }}
            >
              <Text style={styles.authButtonText}>Logout</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.authButton}
              onPress={() => navigation.navigate("Login" as never)}
            >
              <Text style={styles.authButtonText}>Login</Text>
            </TouchableOpacity>
          )}

          {userData?.userFullName &&
            new Date(userData.premiumEndDate) > new Date() && (
              <View style={styles.premiumBadge}>
                <Text style={styles.premiumText}>
                  Premium Active until{" "}
                  {new Date(userData.premiumEndDate).toLocaleDateString()}
                </Text>
              </View>
            )}
        </View>

        <View style={styles.menuCards}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.menuCard}
              onPress={() => navigation.navigate('' as never)}
            >
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.cardSubtitle}>{item.subtitle}</Text>
              </View>
              <Image source={item.image} style={styles.cardImage} />
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.menuList}>
          {/* For Buyers Section */}
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => toggleSubmenu("buyers")}
          >
            <View style={styles.menuItemHeader}>
              <Icon name="home" size={20} color="#1a237e" />
              <Text style={styles.menuItemTitle}>For Buyers</Text>
              <Icon
                name={activeMenu === "buyers" ? "chevron-up" : "chevron-down"}
                size={16}
                color="#1a237e"
              />
            </View>
          </TouchableOpacity>

          {activeMenu === "buyers" && (
            <View style={styles.submenu}>
              {/* Add submenu items */}
              <TouchableOpacity style={styles.submenuItem}>
                <Icon name="building" size={16} color="#666" />
                <Text style={styles.submenuText}>Buy a Home</Text>
              </TouchableOpacity>
              {/* Add more submenu items */}
            </View>
          )}

          {/* Repeat for other menu sections */}
        </View>
      </ScrollView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
   menuDrawer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: Dimensions.get('window').height * 0.95, // Use percentage-based height
    backgroundColor: '#fff',
    borderTopLeftRadius: 19,
    borderTopRightRadius: 19,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 14,
    padding: 20,
    zIndex: 9999,
  },
  scrollContainer: {
    paddingBottom: 40,
  },
  menuDrawerTop: {
    backgroundColor: "#1a237e",
    borderRadius: 19,
    padding: 20,
    margin: -20,
    marginBottom: 20,
  },
  topHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 25,
  },
  userImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  greeting: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#fff",
  },
  closeButton: {
    padding: 5,
  },
  closeIcon: {
    fontSize: 32,
    color: "#fff",
  },
  authButton: {
    backgroundColor: "#fff",
    borderRadius: 9,
    padding: 12,
    alignItems: "center",
  },
  authButtonText: {
    color: "#1a237e",
    fontSize: 20,
    fontWeight: "bold",
  },
  premiumBadge: {
    backgroundColor: "#4CAF50",
    borderRadius: 4,
    padding: 8,
    marginTop: 15,
    alignSelf: "flex-start",
  },
  premiumText: {
    color: "#fff",
    fontSize: 12,
  },
  menuCards: {
    gap: 15,
    marginVertical: 20,
  },
  menuCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 5,
    padding: 10,
    height: 75,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 15,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 20,
    color: "#000",
    fontWeight: "bold",
  },
  cardSubtitle: {
    fontSize: 15,
    color: "#666",
  },
  cardImage: {
    width: 60,
    height: 60,
    resizeMode: "contain",
  },
  menuList: {
    marginTop: 20,
  },
  menuItem: {
    marginVertical: 15,
  },
  menuItemHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  menuItemTitle: {
    fontSize: 18,
    color: "#1a237e",
    fontWeight: "bold",
    flex: 1,
  },
  submenu: {
    marginLeft: 40,
    marginTop: 10,
  },
  submenuItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginVertical: 12,
  },
  submenuText: {
    fontSize: 16,
    color: "#666",
  },
});

export default MenuDrawer;
