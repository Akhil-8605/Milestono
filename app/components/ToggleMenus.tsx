import { useNavigation } from "expo-router";
import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { NavigationProp } from "@react-navigation/native";

const menuItems = {
  "My Activities": {
    icon: "tasks",
    items: [
      { 
        title: "Recently Viewed", 
        icon: "eye", 
        linkto: "MyActivityPage",
        tabParam: "viewed" // Add tab parameter
      },
      { 
        title: "Posted Property", 
        icon: "building", 
        linkto: "MyActivityPage",
        tabParam: "posted" // Add tab parameter
      },
      { 
        title: "Shortlisted", 
        icon: "bookmark", 
        linkto: "MyActivityPage",
        tabParam: "shortlisted" // Add tab parameter
      },
      { 
        title: "Contacted", 
        icon: "phone-alt", 
        linkto: "MyActivityPage",
        tabParam: "contacted" // Add tab parameter
      },
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
          { title: "Builder Floors", icon: "hammer", linkto: "SearchPage" },
          { title: "Independent House", icon: "home", linkto: "SearchPage" },
          {
            title: "Plots in Pune",
            icon: "map-marked-alt",
            linkto: "SearchPage",
          },
          { title: "Serviced Apartments", icon: "hotel", linkto: "SearchPage" },
          { title: "Houses", icon: "house-user", linkto: "SearchPage" },
        ],
      },
      {
        title: "Popular Areas",
        icon: "map-marked-alt",
        linkto: "PopularAreasPage",
        subItems: [
          { title: "Property in Kharadi", icon: "", linkto: "SearchPage" },
          { title: "Property in Baner", icon: "", linkto: "SearchPage" },
          { title: "Property in Hinjewadi", icon: "", linkto: "SearchPage" },
          { title: "Property in Wakad", icon: "", linkto: "SearchPage" },
          { title: "Property in Ravet", icon: "", linkto: "SearchPage" },
          { title: "Property in Punawale", icon: "", linkto: "SearchPage" },
          { title: "Property in Wagholi", icon: "", linkto: "SearchPage" },
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
      {
        title: "About Milestono",
        icon: "info-circle",
        linkto: "AboutUsPage",
      },
      { title: "View Properties", icon: "eye", linkto: "SearchPage" },
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
        title: "Explore our Projects",
        icon: "search-plus",
        linkto: "NewProjectsPage",
      },
      {
        title: "Register to Property",
        icon: "clipboard-check",
        linkto: "PostPropertyPage",
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
      { title: "Delhi Overview", icon: "location-arrow", linkto: "SearchPage" },
      { title: "Mumbai Overview", icon: "landmark", linkto: "SearchPage" },
      { title: "Pune Road Overview", icon: "road", linkto: "SearchPage" },
      { title: "Hydrabad Overview", icon: "city", linkto: "SearchPage" },
      { title: "Kolkata Overview", icon: "search-plus", linkto: "SearchPage" },
      { title: "Bangalore Overview", icon: "building", linkto: "SearchPage" },
    ],
  },
};

interface ToggledMenusProps {
  onClose: () => void;
}

const ToggledMenus: React.FC<ToggledMenusProps> = ({ onClose }) => {
  const navigation = useNavigation<NavigationProp<any>>();
  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >({});
  const [expandedSubSections, setExpandedSubSections] = useState<
    Record<string, boolean>
  >({});

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const toggleSubSection = (subSection: string) => {
    setExpandedSubSections((prev) => ({
      ...prev,
      [subSection]: !prev[subSection],
    }));
  };

  // Helper function to handle navigation with parameters
  const handleNavigation = (item: any) => {
    onClose();
    if (item.linkto === "MyActivityPage" && item.tabParam) {
      // Navigate with tab parameter for MyActivityPage
      navigation.navigate(item.linkto, { initialTab: item.tabParam });
    } else {
      // Regular navigation for other pages
      navigation.navigate(item.linkto);
    }
  };

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
                                  onClose();
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
                  onPress={item.linkto ? () => handleNavigation(item) : undefined}
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

  return (
    <ScrollView style={styles.container}>
      {Object.entries(menuItems).map(([title, section]) =>
        renderMenuItem(title, section)
      )}
      <View style={[styles.menuSection, { gap: 12 }]}>
        <TouchableOpacity
          style={[styles.menuHeader]}
          activeOpacity={0.7}
         onPress={() => {
            onClose();
            navigation.navigate("ProfilePage" as never);
          }}
        >
          <View style={styles.menuTitleContainer}>
            <FontAwesome5
              name={"user-circle"}
              size={18}
              color="#232761"
              solid
            />
            <Text style={styles.menuTitle}>Profile</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.menuHeader]}
          activeOpacity={0.7}
         onPress={() => {
            onClose();
            navigation.navigate("MyActivityPage" as never);
          }}
        >
          <View style={styles.menuTitleContainer}>
            <FontAwesome5
              name={"building"}
              size={18}
              color="#232761"
              solid
            />
            <Text style={styles.menuTitle}>My Property</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.menuHeader]}
          activeOpacity={0.7}
         onPress={() => {
            onClose();
            navigation.navigate("MyServicesPage" as never);
          }}
        >
          <View style={styles.menuTitleContainer}>
            <FontAwesome5
              name={"tools"}
              size={18}
              color="#232761"
              solid
            />
            <Text style={styles.menuTitle}>My Services</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.menuHeader]}
          activeOpacity={0.7}
          onPress={() => { onClose(); navigation.navigate("PremiumAccountPage" as never) }}
        >
          <View style={styles.menuTitleContainer}>
            <FontAwesome5
              name={"gem"}
              size={18}
              color="#232761"
              solid
            />
            <Text style={styles.menuTitle}>Premium Account</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.menuHeader]}
          activeOpacity={0.7}
          onPress={() => { }}
        >
          <View style={styles.menuTitleContainer}>
            <FontAwesome5 name={"envelope"} size={18} color="#232761" solid />
            <Text style={styles.menuTitle}>Contact Us</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.menuHeader]}
          activeOpacity={0.7}
          onPress={() => { }}
        >
          <View style={styles.menuTitleContainer}>
            <FontAwesome5
              name={"question-circle"}
              size={18}
              color="#232761"
              solid
            />
            <Text style={styles.menuTitle}>Help & Support</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.menuHeader]}
          activeOpacity={0.7}
          onPress={() => {
            onClose();
            navigation.navigate("NewsArticalsPage" as never);
          }}
        >
          <View style={styles.menuTitleContainer}>
            <FontAwesome5 name={"newspaper"} size={18} color="#232761" solid />
            <Text style={styles.menuTitle}>News & Articles</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.menuHeader]}
          activeOpacity={0.7}
          onPress={() => {
            onClose();
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
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
});

export default ToggledMenus;
