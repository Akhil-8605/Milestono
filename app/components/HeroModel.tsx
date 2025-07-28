import React, { useState, useRef, useEffect } from "react";
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
} from "react-native";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { useNavigation } from "expo-router";
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

interface MenuModalProps {
  isVisible: boolean;
  onClose: () => void;
  isAuthenticated: boolean;
  userFullName: string;
  onLogout: () => void;
  onLogin: () => void;
}

const MenuModal: React.FC<MenuModalProps> = ({
  isVisible,
  onClose,
  isAuthenticated,
  userFullName,
  onLogout,
  onLogin,
}) => {
  const navigation = useNavigation();
  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >({});
  const [expandedSubSections, setExpandedSubSections] = useState<
    Record<string, boolean>
  >({});

  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;

  // Disable body scroll for web when modal is visible
  useEffect(() => {
    if (Platform.OS === "web") {
      if (isVisible) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "";
      }
    }
    return () => {
      if (Platform.OS === "web") {
        document.body.style.overflow = "";
      }
    };
  }, [isVisible]);

  // Handle opening animation
  useEffect(() => {
    if (isVisible) {
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 50,
        friction: 8,
      }).start();
    }
  }, [isVisible]);

  // New function to handle close animation (up-to-down)
  const handleClose = () => {
    Animated.timing(slideAnim, {
      toValue: SCREEN_HEIGHT,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      onClose();
    });
  };

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // Menu data structure with icons
  const menuItems = {
    "My Activities": {
      icon: "tasks",
      items: [
        { title: "Recently Viewed", icon: "eye", linkto: "MyActivityPage" },
        {
          title: "Posted Property",
          icon: "building",
          linkto: "MyActivityPage",
        },
        { title: "Shortlisted", icon: "bookmark", linkto: "MyActivityPage" },
        { title: "Contacted", icon: "phone-alt", linkto: "MyActivityPage" },
      ],
    },
    "For Buyers": {
      icon: "home",
      items: [
        {
          title: "Buy a Home",
          icon: "home",
          linkto: "BuyAHomePage",
          subItems: [
            { title: "Flats", icon: "building", linkto: "SearchPage" },
            {
              title: "Builder Floors",
              icon: "hammer",
              linkto: "SearchPage",
            },
            {
              title: "Independent House",
              icon: "home",
              linkto: "SearchPage",
            },
            {
              title: "Plots in Pune",
              icon: "map-marked-alt",
              linkto: "SearchPage",
            },
            {
              title: "Serviced Apartments",
              icon: "hotel",
              linkto: "SearchPage",
            },
            { title: "Houses", icon: "house-user", linkto: "SearchPage" },
          ],
        },
        {
          title: "Popular Areas",
          icon: "map-marked-alt",
          linkto: "PopularAreasPage",
          subItems: [
            {
              title: "Property in Kharadi",
              icon: "",
              linkto: "SearchPage"
            },
            {
              title: "Property in Baner",
              icon: "",
              linkto: "SearchPage"
            },
            {
              title: "Property in Hinjewadi",
              icon: "",
              linkto: "SearchPage"
            },
            {
              title: "Property in Wakad",
              icon: "",
              linkto: "SearchPage"
            },
            {
              title: "Property in Ravet",
              icon: "",
              linkto: "SearchPage"
            },
            {
              title: "Property in Punawale",
              icon: "",
              linkto: "SearchPage"
            },
            {
              title: "Property in Wagholi",
              icon: "",
              linkto: "SearchPage"
            },
          ],
        },
        { title: "Home Loan", icon: "money-check", linkto: "HomeLoanPage" },
        { title: "Insights", icon: "lightbulb", linkto: "InsightPage" },
        {
          title: "Articles & News",
          icon: "newspaper",
          linkto: "NewsArticalsPage",
        },
      ],
    },
    "For Owners": {
      icon: "building",
      items: [
        { title: "Post Property", icon: "pen", linkto: "PostPropertyPage" },
        { title: "Owner Services", icon: "tools", linkto: "OwnerServicesPage" },
        {
          title: "About Milestono",
          icon: "info-circle",
          linkto: "AboutMilestonoPage",
        },
        { title: "View Properties", icon: "eye", linkto: "ViewPropertiesPage" },
        { title: "About Us", icon: "user", linkto: "AboutUsPage" },
      ],
    },
    "For Dealers / Builders": {
      icon: "briefcase",
      items: [
        {
          title: "Property Calculator",
          icon: "calculator",
          linkto: "PropertyCalculatorPage",
        },
        {
          title: "Explore our Service",
          icon: "search-plus",
          linkto: "ExploreServicePage",
        },
        {
          title: "Register to Property",
          icon: "clipboard-check",
          linkto: "RegisterPropertyPage",
        },
        {
          title: "View Video about Milestono",
          icon: "play-circle",
          linkto: "MilestonoVideoPage",
        },
      ],
    },
    Insight: {
      icon: "chart-bar",
      items: [
        {
          title: "Delhi Overview",
          icon: "location-arrow",
          linkto: "SearchPage",
        },
        {
          title: "Mumbai Overview",
          icon: "landmark",
          linkto: "SearchPage",
        },
        {
          title: "Pune Road Overview",
          icon: "road",
          linkto: "SearchPage",
        },
        {
          title: "Hydrabad Overview",
          icon: "city",
          linkto: "SearchPage",
        },
        {
          title: "Kolkata Overview",
          icon: "search-plus",
          linkto: "SearchPage",
        },
        {
          title: "Bangalore Overview",
          icon: "building",
          linkto: "SearchPage",
        },
      ],
    },
  };

  // Render menu item with expandable sections
  const renderMenuItem = (title: string, section: any) => {
    return (
      <View key={title} style={styles.menuSection}>
        {/* Top-level header toggle */}
        <TouchableOpacity
          style={[
            styles.menuHeader,
            expandedSections[title] && styles.menuHeaderActive,
          ]}
          onPress={() => toggleSection(title)}
          activeOpacity={0.7}
        >
          <View style={styles.menuTitleContainer}>
            <FontAwesome5 name={section.icon} size={18} color="#232761" solid />
            <Text style={styles.menuTitle}>{title}</Text>
          </View>
          {section.items.length > 0 &&
            (expandedSections[title] ? (
              <FontAwesome5 name="chevron-up" size={16} color="#232761" />
            ) : (
              <FontAwesome5 name="chevron-down" size={16} color="#232761" />
            ))}
        </TouchableOpacity>

        {/* Render sub-items if expanded */}
        {expandedSections[title] && section.items.length > 0 && (
          <View style={styles.submenu}>
            {section.items.map((item: any, index: number) => {
              if (item.subItems && item.subItems.length) {
                return (
                  <View key={index} style={styles.menuSection}>
                    <TouchableOpacity
                      style={[
                        styles.menuHeader,
                        expandedSubSections[item.title] &&
                          styles.menuHeaderActive,
                      ]}
                      onPress={() =>
                        setExpandedSubSections((prev) => ({
                          ...prev,
                          [item.title]: !prev[item.title],
                        }))
                      }
                      activeOpacity={0.7}
                    >
                      <View style={styles.menuTitleContainer}>
                        <FontAwesome5
                          name={item.icon}
                          size={14}
                          color="#666"
                          solid
                        />
                        <View style={{ marginLeft: 14 }}>
                          <Text style={styles.submenuText}>{item.title}</Text>
                          {item.subtitle && (
                            <Text
                              style={[
                                styles.submenuText,
                                { fontSize: 13, color: "#999" },
                              ]}
                            >
                              {item.subtitle}
                            </Text>
                          )}
                        </View>
                      </View>
                      {expandedSubSections[item.title] ? (
                        <FontAwesome5
                          name="chevron-up"
                          size={16}
                          color="#232761"
                        />
                      ) : (
                        <FontAwesome5
                          name="chevron-down"
                          size={16}
                          color="#232761"
                        />
                      )}
                    </TouchableOpacity>

                    {expandedSubSections[item.title] && (
                      <View style={styles.submenu}>
                        {item.subItems.map((subItem: any, subIndex: number) => (
                          <TouchableOpacity
                            key={subIndex}
                            style={styles.submenuItem}
                            activeOpacity={0.6}
                            onPress={
                              subItem.linkto
                                ? () => {
                                    handleClose();
                                    navigation.navigate(
                                      subItem.linkto as never
                                    );
                                  }
                                : undefined
                            }
                          >
                            <FontAwesome5
                              name={subItem.icon}
                              size={14}
                              color="#666"
                              solid
                            />
                            <Text style={styles.submenuText}>
                              {subItem.title}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    )}
                  </View>
                );
              }

              return (
                <TouchableOpacity
                  key={index}
                  style={styles.submenuItem}
                  activeOpacity={0.6}
                  onPress={
                    item.linkto
                      ? () => {
                          handleClose();
                          navigation.navigate(item.linkto as never);
                        }
                      : undefined
                  }
                >
                  <FontAwesome5 name={item.icon} size={14} color="#666" solid />
                  <Text style={styles.submenuText}>{item.title}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </View>
    );
  };

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
      linkto: "",
    },
    {
      title: "Use Service",
      subtitle: "Browse and use available services",
      icon: "tools",
      color: "#fce4ec",
      iconBg: "#c2185b",
      linkto: "",
    },
  ];

  return (
    <Modal
      animationType="none"
      transparent
      visible={isVisible}
      onRequestClose={handleClose}
    >
      <View style={styles.rootContainer}>
        <Pressable style={styles.backdrop} onPress={handleClose} />
        <Animated.View
          style={[
            styles.modalContainer,
            { transform: [{ translateY: slideAnim }] },
          ]}
        >
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
                <Text style={styles.greeting}>
                  {isAuthenticated ? `Hello ${userFullName} 👋` : "Hello User 👋"}
                </Text>
                {isAuthenticated ? (
                  <TouchableOpacity
                    style={styles.loginButton}
                    activeOpacity={0.7}
                    onPress={() => {
                      handleClose();
                      onLogout();
                    }}
                  >
                    <FontAwesome5 name="sign-out-alt" size={14} color="#232761" />
                    <Text style={styles.loginText}>Logout</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={styles.loginButton}
                    activeOpacity={0.7}
                    onPress={() => {
                      handleClose();
                      onLogin();
                    }}
                  >
                    <FontAwesome5 name="sign-in-alt" size={14} color="#232761" />
                    <Text style={styles.loginText}>Login</Text>
                  </TouchableOpacity>
                )}
              </View>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={handleClose}
                activeOpacity={0.7}
              >
                <FontAwesome5 name="times" size={22} color="#666" />
              </TouchableOpacity>
            </View>
          </View>
          <ScrollView
            style={styles.scrollView}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollViewContent}
          >
            <View style={styles.actionButtons}>
              {actionButtons.map((action, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.actionButton,
                    { backgroundColor: action.color },
                  ]}
                  activeOpacity={0.8}
                  onPress={() => {
                    handleClose();
                    navigation.navigate(action.linkto as never);
                  }}
                >
                  <View
                    style={[
                      styles.actionIcon,
                      { backgroundColor: action.iconBg },
                    ]}
                  >
                    <FontAwesome5
                      name={action.icon}
                      size={18}
                      color="white"
                      solid
                    />
                  </View>
                  <View style={styles.actionTextContainer}>
                    <Text style={styles.actionTitle}>{action.title}</Text>
                    <Text style={styles.actionSubtitle}>{action.subtitle}</Text>
                  </View>
                  <FontAwesome5 name="chevron-right" size={14} color="#999" />
                </TouchableOpacity>
              ))}
            </View>
            <View style={styles.menuContainer}>
              {Object.entries(menuItems).map(([title, section]) =>
                renderMenuItem(title, section)
              )}
              <TouchableOpacity
                style={[styles.menuHeader]}
                activeOpacity={0.7}
                onPress={() => {
                  handleClose();
                  navigation.navigate("FaqsPage" as never);
                }}
              >
                <View style={styles.menuTitleContainer}>
                  <FontAwesome5
                    name={"question-circle"}
                    size={18}
                    color="#232761"
                    solid
                  />
                  <Text style={styles.menuTitle}>FAQs</Text>
                </View>
              </TouchableOpacity>
            </View>
            <View style={styles.footer}>
              <Text style={styles.footerText}>
                © 2024 Milestono. All rights reserved.
              </Text>
            </View>
          </ScrollView>
        </Animated.View>
      </View>
    </Modal>
  );
};

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
  menuContainer: {
    padding: 16,
  },
  menuSection: {
    marginBottom: 12,
  },
  menuHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: "#f9f9f9",
  },
  menuHeaderActive: {
    backgroundColor: "#f0f4ff",
    borderLeftWidth: 4,
    borderLeftColor: "#232761",
  },
  menuTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#232761",
    marginLeft: 14,
  },
  submenu: {
    paddingLeft: 16,
    marginTop: 6,
    marginBottom: 6,
    borderLeftWidth: 1,
    borderLeftColor: "#e0e0e0",
    marginLeft: 16,
  },
  submenuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  submenuText: {
    fontSize: 14,
    color: "#444",
    marginLeft: 14,
  },
  footer: {
    padding: 16,
    alignItems: "center",
  },
  footerText: {
    fontSize: 12,
    color: "#999",
  },
});

export default MenuModal;
