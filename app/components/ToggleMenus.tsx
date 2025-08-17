"use client"

import { useNavigation } from "expo-router"
import type React from "react"
import { useState } from "react"
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native"
import FontAwesome5 from "react-native-vector-icons/FontAwesome5"
import type { NavigationProp } from "@react-navigation/native"

const menuItems = {
  "My Activities": {
    icon: "tasks",
    items: [
      {
        title: "Recently Viewed",
        icon: "eye",
        linkto: "MyActivityPage",
        tabParam: "viewed", // Add tab parameter
      },
      {
        title: "Posted Property",
        icon: "building",
        linkto: "MyActivityPage",
        tabParam: "posted", // Add tab parameter
      },
      {
        title: "Shortlisted",
        icon: "bookmark",
        linkto: "MyActivityPage",
        tabParam: "shortlisted", // Add tab parameter
      },
      {
        title: "Contacted",
        icon: "phone-alt",
        linkto: "MyActivityPage",
        tabParam: "contacted", // Add tab parameter
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
            cityName: "Pune", // Added cityName param
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
          { title: "Property in Kharadi", icon: "", linkto: "SearchPage", cityName: "Kharadi" }, // Added cityName param
          { title: "Property in Baner", icon: "", linkto: "SearchPage", cityName: "Baner" }, // Added cityName param
          { title: "Property in Hinjewadi", icon: "", linkto: "SearchPage", cityName: "Hinjewadi" }, // Added cityName param
          { title: "Property in Wakad", icon: "", linkto: "SearchPage", cityName: "Wakad" }, // Added cityName param
          { title: "Property in Ravet", icon: "", linkto: "SearchPage", cityName: "Ravet" }, // Added cityName param
          { title: "Property in Punawale", icon: "", linkto: "SearchPage", cityName: "Punawale" }, // Added cityName param
          { title: "Property in Wagholi", icon: "", linkto: "SearchPage", cityName: "Wagholi" }, // Added cityName param
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
        linkto: "ViewVideoPage",
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
        linkto: "CalculatorPage",
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
        linkto: "ViewVideoPage",
      },
    ],
  },
  Insight: {
    icon: "chart-bar",
    items: [
      { title: "Delhi Overview", icon: "location-arrow", linkto: "SearchPage", cityName: "Delhi" }, // Added cityName param
      { title: "Mumbai Overview", icon: "landmark", linkto: "SearchPage", cityName: "Mumbai" }, // Added cityName param
      { title: "Pune Road Overview", icon: "road", linkto: "SearchPage", cityName: "Pune" }, // Added cityName param
      { title: "Hydrabad Overview", icon: "city", linkto: "SearchPage", cityName: "Hyderabad" }, // Added cityName param
      { title: "Kolkata Overview", icon: "search-plus", linkto: "SearchPage", cityName: "Kolkata" }, // Added cityName param
      { title: "Bangalore Overview", icon: "building", linkto: "SearchPage", cityName: "Bangalore" }, // Added cityName param
    ],
  },
  "Privacy Policy": {
    icon: "shield-alt",
    items: [
      { title: "Privacy Policy", icon: "shield-alt", linkto: "PrivacyPolicyPage" },
      { title: "Terms and Conditions", icon: "file-contract", linkto: "TermsConditionsPage" },
      { title: "Terms of Service", icon: "file-alt", linkto: "TermsOfServicePage" },
      { title: "Refund Policy", icon: "undo", linkto: "RefundPolicyPage" },
      { title: "Disclaimer", icon: "exclamation-circle", linkto: "DisclaimerPage" },
      { title: "Delivery Timeline", icon: "clock", linkto: "DeliveryTimelinePage" }
    ]
  },
}

interface ToggledMenusProps {
  onClose: () => void
}

const ToggledMenus: React.FC<ToggledMenusProps> = ({ onClose }) => {
  const navigation = useNavigation<NavigationProp<any>>()
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({})
  const [expandedSubSections, setExpandedSubSections] = useState<Record<string, boolean>>({})

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  const toggleSubSection = (subSection: string) => {
    setExpandedSubSections((prev) => ({
      ...prev,
      [subSection]: !prev[subSection],
    }))
  }

  // Helper function to handle navigation with parameters
  const handleNavigation = (item: any) => {
    onClose()
    if (item.linkto === "MyActivityPage" && item.tabParam) {
      // Navigate with tab parameter for MyActivityPage
      navigation.navigate(item.linkto, { initialTab: item.tabParam })
    } else if (item.linkto === "SearchPage" && item.cityName) {
      // Navigate to SearchPage with cityName parameter
      navigation.navigate(item.linkto, { cityName: item.cityName })
    } else {
      // Regular navigation for other pages or SearchPage without specific city
      navigation.navigate(item.linkto)
    }
  }

  const renderMenuItem = (title: string, section: any) => {
    return (
      <View key={title} style={styles.menuSection}>
        {/* Top-level header toggle */}
        <TouchableOpacity
          style={[styles.menuHeader, expandedSections[title] && styles.menuHeaderActive]}
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
                      style={[styles.menuHeader, expandedSubSections[item.title] && styles.menuHeaderActive]}
                      onPress={() =>
                        setExpandedSubSections((prev) => ({
                          ...prev,
                          [item.title]: !prev[item.title],
                        }))
                      }
                      activeOpacity={0.7}
                    >
                      <View style={styles.menuTitleContainer}>
                        <FontAwesome5 name={item.icon} size={14} color="#666" solid />
                        <View style={{ marginLeft: 14 }}>
                          <Text style={styles.submenuText}>{item.title}</Text>
                          {item.subtitle && (
                            <Text style={[styles.submenuText, { fontSize: 13, color: "#999" }]}>{item.subtitle}</Text>
                          )}
                        </View>
                      </View>
                      {expandedSubSections[item.title] ? (
                        <FontAwesome5 name="chevron-up" size={16} color="#232761" />
                      ) : (
                        <FontAwesome5 name="chevron-down" size={16} color="#232761" />
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
                                  onClose()
                                  if (subItem.linkto === "SearchPage" && subItem.cityName) {
                                    navigation.navigate(subItem.linkto, { cityName: subItem.cityName })
                                  } else {
                                    navigation.navigate(subItem.linkto as never)
                                  }
                                }
                                : undefined
                            }
                          >
                            <FontAwesome5 name={subItem.icon} size={14} color="#666" solid />
                            <Text style={styles.submenuText}>{subItem.title}</Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    )}
                  </View>
                )
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
              )
            })}
          </View>
        )}
      </View>
    )
  }

  return (
    <ScrollView style={styles.container}>
      {Object.entries(menuItems).map(([title, section]) => renderMenuItem(title, section))}
      <View style={[styles.menuSection, { gap: 12 }]}>
        <TouchableOpacity
          style={[styles.menuHeader]}
          activeOpacity={0.7}
          onPress={() => {
            onClose()
            navigation.navigate("ProfilePage" as never)
          }}
        >
          <View style={styles.menuTitleContainer}>
            <FontAwesome5 name={"user-circle"} size={18} color="#232761" solid />
            <Text style={styles.menuTitle}>Profile</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.menuHeader]}
          activeOpacity={0.7}
          onPress={() => {
            onClose()
            navigation.navigate("MyActivityPage" as never)
          }}
        >
          <View style={styles.menuTitleContainer}>
            <FontAwesome5 name={"building"} size={18} color="#232761" solid />
            <Text style={styles.menuTitle}>My Property</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.menuHeader]}
          activeOpacity={0.7}
          onPress={() => {
            onClose()
            navigation.navigate("MyServicesPage" as never)
          }}
        >
          <View style={styles.menuTitleContainer}>
            <FontAwesome5 name={"tools"} size={18} color="#232761" solid />
            <Text style={styles.menuTitle}>My Services</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.menuHeader]}
          activeOpacity={0.7}
          onPress={() => {
            onClose()
            navigation.navigate("PremiumAccountPage" as never)
          }}
        >
          <View style={styles.menuTitleContainer}>
            <FontAwesome5 name={"gem"} size={18} color="#232761" solid />
            <Text style={styles.menuTitle}>Premium Account</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.menuHeader]} activeOpacity={0.7} onPress={() => { navigation.navigate("ContactUsPage") }}>
          <View style={styles.menuTitleContainer}>
            <FontAwesome5 name={"envelope"} size={18} color="#232761" solid />
            <Text style={styles.menuTitle}>Contact Us</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.menuHeader]} activeOpacity={0.7} onPress={() => { navigation.navigate("HelpAndServicePage") }}>
          <View style={styles.menuTitleContainer}>
            <FontAwesome5 name={"question-circle"} size={18} color="#232761" solid />
            <Text style={styles.menuTitle}>Help & Support</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.menuHeader]}
          activeOpacity={0.7}
          onPress={() => {
            onClose()
            navigation.navigate("NewsArticalsPage" as never)
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
            onClose()
            navigation.navigate("FaqsPage" as never)
          }}
        >
          <View style={styles.menuTitleContainer}>
            <FontAwesome5 name={"question-circle"} size={18} color="#232761" solid />
            <Text style={styles.menuTitle}>FAQs</Text>
          </View>
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}

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
})

export default ToggledMenus
