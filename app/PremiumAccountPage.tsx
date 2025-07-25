"use client"

import type React from "react"
import { useState, useEffect } from "react"
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  Platform,
  StatusBar,
  Modal,
  TouchableWithoutFeedback,
  Linking,
  Alert,
} from "react-native"
import { SvgXml } from "react-native-svg"
import { BlurView } from "expo-blur"
import Header from "./components/Header"
import { useRouter } from "expo-router"
import axios from "axios"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { handlePayment } from "./Payment"

const { width, height } = Dimensions.get("window")

interface Plan {
  name: string
  current: boolean
  price: number
  yearPrice: number
  period: string
  pricePerMonth: string
  subtitle: string
  color: "basic" | "pro" | "premium"
  responseText: string
  features: string[]
  benefits: string[]
  numOfProperties: number
  numOfContactDetails: number
  numOfImages: number
  numOfVideos: number
  numOfFeaturedProperties: number
  crmAccess: boolean
  whatsappIntegration: boolean
  exportCustomers: string
  bulkUpload: boolean
  branding: string
}

const PLANS: { [key: string]: Plan } = {
  starterRealty: {
    name: "Starter Realty",
    current: true,
    price: 0,
    yearPrice: 0,
    period: "Monthly",
    pricePerMonth: "Free",
    subtitle: "For First-Time Sellers",
    color: "basic",
    responseText: "Get Started for Free",
    features: [
      "Post up to 3 properties (buy/sell/rent)",
      "Basic listing with 5 images per property",
      "Unlock 3 Contacts",
      "Standard visibility in search results",
      "Access to basic analytics (views, inquiries)",
    ],
    benefits: [
      "Ideal for homeowners selling/renting without investment",
      "No cost to list properties",
      "Standard exposure in search results",
    ],
    numOfProperties: 3,
    numOfContactDetails: 3,
    numOfImages: 5,
    numOfVideos: 0,
    numOfFeaturedProperties: 0,
    crmAccess: false,
    whatsappIntegration: false,
    exportCustomers: "no",
    bulkUpload: false,
    branding: "no",
  },
  smartSeller: {
    name: "Smart Seller",
    current: true,
    price: 999,
    yearPrice: 8999,
    period: "Monthly",
    pricePerMonth: "₹999 per month (or ₹8,999 annually with 10% discount)",
    subtitle: "For Frequent Sellers & Small Property Managers",
    color: "basic",
    responseText: "Upgrade for Better Leads",
    features: [
      "Post up to 10 properties",
      "Enhanced listing with 10 images per property",
      "Unlock 12 Contacts",
      "WhatsApp chat integration for instant communication",
      "Basic CRM dashboard for lead management",
      "Export leads in Excel/CSV format",
      "Monthly performance report",
    ],
    benefits: [
      "Higher visibility than free listings",
      "Better lead management with CRM tools",
      "Direct WhatsApp communication for faster conversions",
    ],
    numOfProperties: 10,
    numOfContactDetails: 12,
    numOfImages: 10,
    numOfVideos: 0,
    numOfFeaturedProperties: 0,
    crmAccess: true,
    whatsappIntegration: true,
    exportCustomers: "email",
    bulkUpload: false,
    branding: "no",
  },
  eliteAgent: {
    name: "Elite Agent",
    current: true,
    price: 2499,
    yearPrice: 22499,
    period: "Monthly",
    pricePerMonth: "₹2,499 per month (or ₹22,499 annually with 20% discount)",
    subtitle: "For Professional Agents & Brokers",
    color: "pro",
    responseText: "Boost Your Real Estate Business",
    features: [
      "Post up to 50 properties",
      "Featured badge for 5 properties (highlighted in search results)",
      "Rich media support (20 images, 2 videos)",
      "Unlock 24 Contacts",
      "Verified agent profile with 'Trusted Badge'",
      "Advanced CRM dashboard with lead tracking & reminders",
      "Export leads in Excel/CSV format",
      "SEO optimization tips for better rankings",
      "Dedicated account manager for onboarding & support",
    ],
    benefits: [
      "Increased property exposure with featured listings",
      "Enhanced credibility with a verified agent profile",
      "Advanced CRM and lead management for higher conversions",
    ],
    numOfProperties: 50,
    numOfContactDetails: 24,
    numOfImages: 20,
    numOfVideos: 2,
    numOfFeaturedProperties: 5,
    crmAccess: true,
    whatsappIntegration: true,
    exportCustomers: "email",
    bulkUpload: false,
    branding: "trusted",
  },
  developerPro: {
    name: "Developer Pro",
    current: true,
    price: 4999,
    yearPrice: 44999,
    period: "Monthly",
    pricePerMonth: "₹4,999 per month (or ₹44,999 annually with 20% discount)",
    subtitle: "For Developers & Large-Scale Property Managers",
    color: "premium",
    responseText: "Maximize Your Real Estate Reach",
    features: [
      "Unlimited property listings",
      "Featured badge for 10 properties",
      "Custom branding (logo, banner) on profile",
      "Bulk upload feature for quick multiple listings",
      "Access to Milestono's exclusive developer network",
      "Advanced analytics",
      "Export leads with Contact Number in Excel/CSV format",
      "Discounted virtual staging service (₹1,999 per property)",
      "Legal assistance (₹99/month add-on available)",
      "Priority placement in locality-specific searches",
    ],
    benefits: [
      "Unlimited listings for large-scale property managers",
      "Increased brand visibility with custom branding",
      "Comprehensive analytics for data-driven decision-making",
      "Exclusive access to a premium developer network",
    ],
    numOfProperties: -1,
    numOfContactDetails: -1,
    numOfImages: -1,
    numOfVideos: -1,
    numOfFeaturedProperties: 10,
    crmAccess: true,
    whatsappIntegration: true,
    exportCustomers: "mobile",
    bulkUpload: true,
    branding: "custom",
  },
}

const checkmarkSvg = `
<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M9 16.17L4.83 12L3.41 13.41L9 19L21 7L19.59 5.59L9 16.17Z" fill="currentColor"/>
</svg>
`

const patternSvg = `
<svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M10 10L90 90M30 10L90 70M50 10L90 50M70 10L90 30M10 30L70 90M10 50L50 90M10 70L30 90" stroke="currentColor" strokeWidth="0.5" strokeLinecap="round"/>
</svg>
`

const crownSvg = `
<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="currentColor"/>
</svg>
`

const shieldSvg = `
<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M12 1L3 5V11C3 16.55 6.84 21.74 12 23C17.16 21.74 21 16.55 21 11V5L12 1ZM12 11.99H19C18.47 16.11 15.72 19.78 12 20.93V12H5V6.3L12 3.19V11.99Z" fill="currentColor"/>
</svg>
`

const PremiumAccountPage: React.FC = () => {
  const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL || "https://your-api-url.com"

  const [plans, setPlans] = useState(PLANS)
  const [selectedPeriod, setSelectedPeriod] = useState<"monthly" | "yearly">("monthly")
  const [selectedPlan, setSelectedPlan] = useState<string>("smartSeller")
  const [modalVisible, setModalVisible] = useState<boolean>(false)
  const [expandedBenefits, setExpandedBenefits] = useState<string[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)

  const planKeys = Object.keys(plans)
  const router = useRouter()

  // Check authentication on component mount
  useEffect(() => {
    checkAuthentication()
  }, [])

  const checkAuthentication = async () => {
    try {
      const token = await AsyncStorage.getItem("auth")
      if (!token) {
        Alert.alert("Authentication Required", "Please login to access premium plans", [
          {
            text: "OK",
            onPress: () => router.push("/LoginPage"),
          },
        ])
        return
      }
      setIsAuthenticated(true)
    } catch (error) {
      console.error("Error checking authentication:", error)
      Alert.alert("Error", "Authentication check failed", [
        {
          text: "OK",
          onPress: () => router.push("/LoginPage"),
        },
      ])
    }
  }

  const getCardColor = (color: string) => {
    switch (color) {
      case "basic":
        return {
          bg: "#f0f9ff",
          header: "#0c4a6e",
          accent: "#0ea5e9",
          border: "#e0f2fe",
          pattern: "rgba(14, 165, 233, 0.05)",
          modalBg: "#f0f9ff",
          modalHeader: "#0284c7",
        }
      case "pro":
        return {
          bg: "#f5f3ff",
          header: "#5b21b6",
          accent: "#8b5cf6",
          border: "#ede9fe",
          pattern: "rgba(139, 92, 246, 0.05)",
          modalBg: "#f5f3ff",
          modalHeader: "#7c3aed",
        }
      case "premium":
        return {
          bg: "#fffbeb",
          header: "#92400e",
          accent: "#f59e0b",
          border: "#fef3c7",
          pattern: "rgba(245, 158, 11, 0.05)",
          modalBg: "#fffbeb",
          modalHeader: "#d97706",
        }
      default:
        return {
          bg: "#f0f9ff",
          header: "#0c4a6e",
          accent: "#0ea5e9",
          border: "#e0f2fe",
          pattern: "rgba(14, 165, 233, 0.05)",
          modalBg: "#f0f9ff",
          modalHeader: "#0284c7",
        }
    }
  }

  const handleDurationChange = (planId: string, isMonthly: boolean) => {
    const updatedPlans = { ...plans }
    updatedPlans[planId].current = isMonthly
    setPlans(updatedPlans)
  }

  const toggleBenefits = (planId: string) => {
    setExpandedBenefits((prev) => (prev.includes(planId) ? prev.filter((p) => p !== planId) : [...prev, planId]))
  }

  const handlePlanSelect = (planId: string) => {
    setSelectedPlan(planId)
  }

  const handleBuyNow = async () => {
    const token = await AsyncStorage.getItem("auth")

    if (!token) {
      Alert.alert("Error", "Unauthorized: No token found.")
      return
    }

    const plan = plans[selectedPlan]
    const userProfile = {
      numOfProperties: plan.numOfProperties,
      numOfContactDetails: plan.numOfContactDetails,
      numOfImages: plan.numOfImages,
      numOfVideos: plan.numOfVideos,
      numOfFeaturedProperties: plan.numOfFeaturedProperties,
      crmAccess: plan.crmAccess,
      whatsappIntegration: plan.whatsappIntegration,
      exportCustomers: plan.exportCustomers,
      bulkUpload: plan.bulkUpload,
      branding: plan.branding,
      current: plan.current,
      accountName: plan.name,
      price: plan.current ? Number.parseInt(plan.price.toString()) : Number.parseInt(plan.yearPrice.toString()),
    }

    try {
      const response = await axios.post(`${BASE_URL}/api/accounts`, userProfile, {
        headers: {
          Authorization: token,
        },
      })
      Alert.alert("Success", "Account created successfully")
      setModalVisible(false)
    } catch (error) {
      console.error("Error creating account", error)
      Alert.alert("Error", "Failed to create account")
    }
  }

  const TermsPage = async () => {
    try {
      await Linking.openURL(`https://milestono.com/terms-condition`)
    } catch (error) {
      console.error(error)
    }
  }

  const openModal = (planId: string) => {
    setSelectedPlan(planId)
    setModalVisible(true)
  }

  const closeModal = () => {
    setModalVisible(false)
  }

  const renderPricingCard = (planId: string, index: number) => {
    const planData = plans[planId]
    const colors = getCardColor(planData.color)

    return (
      <View
        key={planId}
        style={[
          styles.card,
          {
            backgroundColor: colors.bg,
            borderColor: colors.border,
          },
        ]}
      >
        {/* Background pattern */}
        <View style={styles.patternContainer}>
          <SvgXml xml={patternSvg} width={width * 0.9} height="100%" color={colors.pattern} style={styles.patternSvg} />
        </View>

        {/* Popular tag for Smart Seller plan */}
        {planId === "smartSeller" && (
          <View style={[styles.popularTag, { backgroundColor: colors.accent }]}>
            <Text style={styles.popularTagText}>POPULAR</Text>
          </View>
        )}

        <View style={styles.cardHeader}>
          <Text style={[styles.planName, { color: colors.header }]}>{planData.name}</Text>
          <Text style={[styles.planSubtitle, { color: colors.header }]}>{planData.subtitle}</Text>
        </View>

        <Text style={[styles.responseText, { color: colors.accent }]}>{planData.responseText}</Text>

        <View style={styles.featuresContainer}>
          {planData.features.map((feature, idx) => (
            <View key={idx} style={styles.featureRow}>
              <SvgXml xml={checkmarkSvg} width={20} height={20} color={colors.accent} style={styles.checkmark} />
              <Text style={styles.featureText}>{feature}</Text>
            </View>
          ))}
        </View>

        <View style={styles.pricingContainer}>
          <View style={[styles.periodSelector, { backgroundColor: colors.border }]}>
            <TouchableOpacity
              style={[
                styles.periodOption,
                selectedPeriod === "monthly" && {
                  backgroundColor: colors.accent,
                  borderRadius: 20,
                },
              ]}
              onPress={() => {
                setSelectedPeriod("monthly")
                handleDurationChange(planId, true)
              }}
            >
              <Text style={[styles.periodText, selectedPeriod === "monthly" && { color: "white" }]}>Monthly</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.periodOption,
                selectedPeriod === "yearly" && {
                  backgroundColor: colors.accent,
                  borderRadius: 20,
                },
              ]}
              onPress={() => {
                setSelectedPeriod("yearly")
                handleDurationChange(planId, false)
              }}
            >
              <Text style={[styles.periodText, selectedPeriod === "yearly" && { color: "white" }]}>
                Yearly
                <Text style={styles.savingsText}> (Save 20%)</Text>
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.priceDisplay}>
            {selectedPeriod === "yearly" && planData.price > 0 && (
              <Text style={styles.originalPrice}>₹{(planData.price * 12).toLocaleString()}</Text>
            )}
            <Text style={styles.currencySymbol}>₹</Text>
            <Text style={styles.priceAmount}>
              {selectedPeriod === "monthly" ? planData.price.toLocaleString() : planData.yearPrice.toLocaleString()}
            </Text>
            <Text style={styles.periodLabel}>/{selectedPeriod === "monthly" ? "mo" : "yr"}</Text>
          </View>

          <Text style={styles.priceSubtext}>{planData.pricePerMonth}</Text>

          <TouchableOpacity
            style={[styles.ctaButton, { backgroundColor: colors.accent }]}
            onPress={() => openModal(planId)}
            disabled={loading}
          >
            <Text style={styles.ctaButtonText}>{loading ? "Processing..." : "Get Started"}</Text>
          </TouchableOpacity>
        </View>

        {/* Benefits toggle */}
        <TouchableOpacity style={styles.benefitsToggle} onPress={() => toggleBenefits(planId)}>
          <Text style={[styles.benefitsToggleText, { color: colors.accent }]}>
            ALL BENEFITS {expandedBenefits.includes(planId) ? "▲" : "▼"}
          </Text>
        </TouchableOpacity>

        {expandedBenefits.includes(planId) && (
          <View style={styles.benefitsContent}>
            {planData.benefits.map((benefit, idx) => (
              <View key={idx} style={styles.benefitRow}>
                <SvgXml xml={checkmarkSvg} width={16} height={16} color={colors.accent} style={styles.benefitIcon} />
                <Text style={styles.benefitText}>{benefit}</Text>
              </View>
            ))}
          </View>
        )}
      </View>
    )
  }

  const renderModal = () => {
    if (!selectedPlan) return null

    const planData = plans[selectedPlan]
    const colors = getCardColor(planData.color)

    return (
      <Modal transparent={true} visible={modalVisible} animationType="slide" onRequestClose={closeModal}>
        <TouchableWithoutFeedback onPress={closeModal}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View
                style={[
                  styles.modalContainer,
                  {
                    backgroundColor: colors.modalBg,
                    borderColor: colors.border,
                  },
                ]}
              >
                {/* Modal Header */}
                <View style={[styles.modalHeader, { backgroundColor: colors.modalHeader }]}>
                  <Text style={styles.modalTitle}>{planData.name} Plan Details</Text>
                  <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
                    <Text style={styles.closeButtonText}>×</Text>
                  </TouchableOpacity>
                </View>

                {/* Modal Content */}
                <ScrollView
                  style={styles.modalContent}
                  contentContainerStyle={styles.modalContentContainer}
                  showsVerticalScrollIndicator={true}
                  bounces={true}
                  scrollEventThrottle={16}
                >
                  <View style={styles.modalSection}>
                    <Text style={styles.modalSectionTitle}>Plan Overview</Text>
                    <Text style={styles.modalDescription}>
                      The {planData.name} plan is designed for {planData.subtitle.toLowerCase()} real estate
                      professionals who want to {planData.responseText.toLowerCase()}.
                    </Text>
                  </View>

                  <View style={styles.modalPriceSection}>
                    <Text style={styles.modalPriceLabel}>
                      {selectedPeriod === "monthly" ? "Monthly Price" : "Annual Price (20% off)"}
                    </Text>
                    <View style={styles.modalPriceContainer}>
                      {selectedPeriod === "yearly" && planData.price > 0 && (
                        <Text style={styles.modalOriginalPrice}>₹{(planData.price * 12).toLocaleString()}</Text>
                      )}
                      <Text style={styles.modalCurrencySymbol}>₹</Text>
                      <Text style={styles.modalPriceAmount}>
                        {selectedPeriod === "monthly"
                          ? planData.price.toLocaleString()
                          : planData.yearPrice.toLocaleString()}
                      </Text>
                      <Text style={styles.modalPeriodLabel}>/{selectedPeriod === "monthly" ? "mo" : "yr"}</Text>
                    </View>
                    <Text style={styles.modalPriceSubtext}>{planData.pricePerMonth}</Text>
                  </View>

                  <View style={styles.modalSection}>
                    <Text style={styles.modalSectionTitle}>All Benefits</Text>
                    {planData.benefits.map((benefit, idx) => (
                      <View key={idx} style={styles.modalBenefitRow}>
                        <SvgXml
                          xml={idx % 3 === 0 ? crownSvg : idx % 2 === 0 ? shieldSvg : checkmarkSvg}
                          width={20}
                          height={20}
                          color={colors.accent}
                          style={styles.modalBenefitIcon}
                        />
                        <Text style={styles.modalBenefitText}>{benefit.replace(/<br\/>.*?:/g, "\n")}</Text>
                      </View>
                    ))}
                  </View>

                  <View style={styles.modalButtonContainer}>
                    <TouchableOpacity
                      style={[styles.buyNowButton, { backgroundColor: colors.accent }]}
                      onPress={() => {
                        handlePayment({
                          amount: plans[selectedPlan].current
                            ? Number.parseInt(plans[selectedPlan].price.toString())
                            : Number.parseInt(plans[selectedPlan].yearPrice.toString()),
                          callback: () => handleBuyNow(),
                          description: "Payment for " + plans[selectedPlan].name + " Taken",
                        })
                      }}
                      disabled={loading || Number.parseInt(plans[selectedPlan].price.toString()) <= 0}
                    >
                      <Text style={styles.buyNowButtonText}>{loading ? "Processing..." : "Buy Now"}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.termsButton} onPress={TermsPage}>
                      <Text style={[styles.termsButtonText, { color: colors.accent }]}>Terms & Conditions</Text>
                    </TouchableOpacity>
                  </View>
                </ScrollView>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    )
  }

  const statusBarHeight = StatusBar.currentHeight || 0

  // Don't render the component if not authenticated
  if (!isAuthenticated) {
    return (
      <SafeAreaView style={[styles.container, { marginTop: statusBarHeight }]}>
        <View style={styles.loadingContainer}>
          <Text>Checking authentication...</Text>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={[styles.container, { marginTop: statusBarHeight }]}>
      <Header />

      {/* Background pattern */}
      <View style={styles.backgroundPattern}>
        <SvgXml xml={patternSvg} width={width * 2} height={height} color="rgba(0, 0, 0, 0.02)" />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Premium Plans</Text>
          <Text style={styles.headerSubtitle}>Choose the perfect plan for your real estate business</Text>
        </View>

        <View style={styles.cardsContainer}>{planKeys.map((planId, index) => renderPricingCard(planId, index))}</View>

        {/* Bottom gradient */}
        {Platform.OS === "ios" ? (
          <BlurView style={styles.bottomGradient} intensity={20} tint="light" />
        ) : (
          <View style={styles.bottomGradient} />
        )}
      </ScrollView>

      {/* Modal */}
      {renderModal()}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  backgroundPattern: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.5,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#64748b",
    lineHeight: 22,
  },
  cardsContainer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  card: {
    borderRadius: 24,
    padding: 24,
    marginVertical: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
    borderWidth: 1,
    overflow: "hidden",
  },
  patternContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.5,
    overflow: "hidden",
  },
  patternSvg: {
    position: "absolute",
    top: 0,
    left: 0,
  },
  popularTag: {
    position: "absolute",
    top: 16,
    right: -30,
    backgroundColor: "#8b5cf6",
    paddingHorizontal: 30,
    paddingVertical: 6,
    transform: [{ rotate: "45deg" }],
    zIndex: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  popularTagText: {
    color: "white",
    fontSize: 10,
    fontWeight: "bold",
    letterSpacing: 1,
  },
  cardHeader: {
    marginBottom: 15,
  },
  planName: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 2,
  },
  planSubtitle: {
    fontSize: 14,
    opacity: 0.8,
  },
  responseText: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 24,
  },
  featuresContainer: {
    marginBottom: 24,
  },
  featureRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  checkmark: {
    marginRight: 10,
  },
  featureText: {
    fontSize: 14,
    color: "#4b5563",
    flex: 1,
    lineHeight: 22,
  },
  pricingContainer: {
    marginTop: 10,
  },
  periodSelector: {
    flexDirection: "row",
    marginBottom: 20,
    alignSelf: "center",
    borderRadius: 24,
    overflow: "hidden",
    padding: 4,
    backgroundColor: "#f1f5f9",
  },
  periodOption: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    minWidth: 100,
    alignItems: "center",
  },
  periodText: {
    fontSize: 12,
    fontWeight: "600",
  },
  savingsText: {
    fontSize: 12,
    fontWeight: "normal",
  },
  priceDisplay: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "center",
    marginBottom: 8,
    position: "relative",
  },
  originalPrice: {
    position: "absolute",
    top: -16,
    right: "30%",
    fontSize: 14,
    fontWeight: "500",
    color: "#94a3b8",
    textDecorationLine: "line-through",
  },
  currencySymbol: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 6,
    color: "#1e293b",
  },
  priceAmount: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#1e293b",
    letterSpacing: -1,
  },
  periodLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#64748b",
    marginBottom: 6,
    marginLeft: 2,
  },
  priceSubtext: {
    fontSize: 13,
    color: "#64748b",
    marginBottom: 24,
    lineHeight: 18,
    textAlign: "center",
  },
  ctaButton: {
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
    marginBottom: 16,
  },
  ctaButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "700",
  },
  benefitsToggle: {
    alignItems: "center",
    paddingVertical: 8,
  },
  benefitsToggleText: {
    fontSize: 12,
    fontWeight: "600",
  },
  benefitsContent: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "rgba(0, 0, 0, 0.1)",
  },
  benefitRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  benefitIcon: {
    marginRight: 8,
    marginTop: 2,
  },
  benefitText: {
    fontSize: 13,
    color: "#4b5563",
    flex: 1,
    lineHeight: 20,
  },
  bottomGradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 40,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    height: height * 0.85,
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderWidth: 1,
    borderBottomWidth: 0,
    overflow: "hidden",
    flex: 1,
    maxHeight: height * 0.85,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0, 0, 0, 0.1)",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  closeButtonText: {
    fontSize: 24,
    color: "white",
    lineHeight: 28,
  },
  modalContent: {
    flex: 1,
  },
  modalContentContainer: {
    padding: 20,
    paddingBottom: 100,
    flexGrow: 1,
  },
  modalSection: {
    marginBottom: 24,
  },
  modalSectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: 12,
  },
  modalDescription: {
    fontSize: 14,
    color: "#4b5563",
    lineHeight: 24,
  },
  modalPriceSection: {
    backgroundColor: "rgba(0, 0, 0, 0.03)",
    padding: 16,
    borderRadius: 16,
    marginBottom: 24,
  },
  modalPriceLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: 8,
    textAlign: "center",
  },
  modalPriceContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "center",
    marginBottom: 8,
    position: "relative",
  },
  modalOriginalPrice: {
    position: "absolute",
    top: -10,
    right: "30%",
    fontSize: 14,
    fontWeight: "500",
    color: "#94a3b8",
    textDecorationLine: "line-through",
  },
  modalCurrencySymbol: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 6,
    color: "#1e293b",
  },
  modalPriceAmount: {
    fontSize: 35,
    fontWeight: "bold",
    color: "#1e293b",
    letterSpacing: -1,
  },
  modalPeriodLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#64748b",
    marginBottom: 6,
    marginLeft: 2,
  },
  modalPriceSubtext: {
    fontSize: 12,
    color: "#64748b",
    textAlign: "center",
  },
  modalBenefitRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  modalBenefitIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  modalBenefitText: {
    fontSize: 14,
    color: "#4b5563",
    flex: 1,
    lineHeight: 24,
  },
  modalButtonContainer: {
    marginTop: 24,
    marginBottom: 20,
    alignItems: "center",
  },
  buyNowButton: {
    paddingVertical: 15,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
    width: "100%",
    marginBottom: 16,
  },
  buyNowButtonText: {
    color: "white",
    fontSize: 15,
    fontWeight: "700",
  },
  termsButton: {
    paddingVertical: 8,
  },
  termsButtonText: {
    fontSize: 12,
    fontWeight: "500",
    textDecorationLine: "underline",
  },
})

export default PremiumAccountPage
