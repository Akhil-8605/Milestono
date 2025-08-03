"use client"

import { useState, useRef } from "react"
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Animated,
  StatusBar,
  Platform,
  UIManager,
  LayoutAnimation,
} from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { Ionicons } from "@expo/vector-icons"

// Enable LayoutAnimation for Android
if (Platform.OS === "android") {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true)
  }
}

const faqs = [
  {
    question: "How do I search for properties on your platform?",
    answer:
      "To search for properties, simply enter your desired location, budget, and property type in the search bar. You can further filter your search based on criteria such as the number of bedrooms, amenities, and property size.",
  },
  {
    question: "Can I list my property on the platform?",
    answer:
      "Yes, you can list your property. Create an account, fill out the property details, upload high-quality images, and set your asking price. Once submitted, your listing will be reviewed and published.",
  },
  {
    question: "How do I contact a seller or buyer?",
    answer:
      "Once you’ve found a property you're interested in, you can contact the seller or buyer directly through the messaging feature or by using the provided contact details on the listing page.",
  },
  {
    question: "Are the listings on your site verified?",
    answer:
      "We work closely with property owners and agents to ensure that all listings are legitimate. However, we recommend visiting the property in person or consulting with a verified agent to confirm the details before making any decisions.",
  },
  {
    question: "What types of properties can I find on your platform?",
    answer:
      "You can find a wide range of properties including residential homes, apartments, commercial properties, and land. We also offer options for renting and buying.",
  },
  {
    question: "Do you provide real estate agent services?",
    answer:
      "Yes, we offer access to a network of professional real estate agents who can assist you in buying, selling, or renting properties. Simply reach out to our support team for recommendations.",
  },
  {
    question: "How do I schedule a property viewing?",
    answer:
      "Once you find a property you’re interested in, you can schedule a viewing directly with the seller or agent using the 'Schedule Viewing' option on the property listing page.",
  },
  {
    question: "How can I get home loan assistance?",
    answer:
      "We partner with leading financial institutions to provide home loan assistance. You can apply for a loan through our website or contact our customer support for more details on loan eligibility and terms.",
  },
  {
    question: "Can I also find home services (e.g., maintenance, interior design) through your platform?",
    answer:
      "Yes, in addition to properties, we offer a variety of home services. You can find trusted service providers for repairs, renovations, cleaning, and interior design through our platform.",
  },
  {
    question: "Is my personal information secure on your website?",
    answer:
      "Yes, we take your privacy seriously. All personal information is stored securely and encrypted. We adhere to industry standards to ensure your data remains private and protected.",
  },
]

const FAQSection = () => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null)
  const scrollViewRef = useRef<ScrollView>(null)

  // Animation values for each FAQ item
  const rotateAnimations = useRef(faqs.map(() => new Animated.Value(0))).current
  const scaleAnimations = useRef(faqs.map(() => new Animated.Value(1))).current

  // Define fixed colors for the header and FAQ items
  const headerGradientColors: [string, string] = ["#6A11CB", "#2575FC"] // Purple to Blue
  const lightAccentColor = "#eef2ff" // Light indigo for expanded background
  const primaryAccentColor = "#4f46e5" // Indigo-600 for icons

  // Toggle FAQ expansion with animations
  const toggleQuestion = (index: number) => {
    // Configure layout animation
    LayoutAnimation.configureNext({
      duration: 300,
      update: {
        type: LayoutAnimation.Types.spring,
        springDamping: 0.7,
      },
    })

    // Rotate animation for the plus/minus icon
    Animated.timing(rotateAnimations[index], {
      toValue: expandedIndex === index ? 0 : 1,
      duration: 300,
      useNativeDriver: true,
    }).start()

    // Scale animation for pressed item
    Animated.sequence([
      Animated.timing(scaleAnimations[index], {
        toValue: 0.98,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnimations[index], {
        toValue: 1,
        friction: 4,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start()

    setExpandedIndex(expandedIndex === index ? null : index)
  }

  // Render FAQ items with animations
  const renderFAQs = () => {
    return (
      <View>
        {faqs.map((item, index) => {
          // Rotation animation for the plus/minus icon
          const rotateInterpolate = rotateAnimations[index].interpolate({
            inputRange: [0, 1],
            outputRange: ["0deg", "135deg"],
          })

          // Scale animation for the card
          const scaleInterpolate = scaleAnimations[index]

          return (
            <Animated.View
              key={index}
              style={[
                styles.faqItemContainer,
                {
                  transform: [{ scale: scaleInterpolate }],
                  backgroundColor: expandedIndex === index ? lightAccentColor : "white",
                },
              ]}
            >
              <TouchableOpacity style={styles.faqItem} onPress={() => toggleQuestion(index)} activeOpacity={0.9}>
                <View style={styles.questionContainer}>
                  <View style={styles.questionTextContainer}>
                    <Text style={styles.questionText}>{item.question}</Text>
                  </View>
                  <Animated.View
                    style={[
                      styles.iconContainer,
                      {
                        transform: [{ rotate: rotateInterpolate }],
                        backgroundColor: expandedIndex === index ? primaryAccentColor : "#e0e7ff", // Lighter indigo for non-expanded icon background
                      },
                    ]}
                  >
                    <Ionicons name="add" size={18} color={expandedIndex === index ? "white" : primaryAccentColor} />
                  </Animated.View>
                </View>

                {expandedIndex === index && (
                  <Animated.View style={styles.answerContainer}>
                    <Text style={styles.answerText}>{item.answer}</Text>
                  </Animated.View>
                )}
              </TouchableOpacity>
            </Animated.View>
          )
        })}
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Header with gradient background */}
      <LinearGradient
        colors={headerGradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.headerGradient}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Frequently Asked Questions</Text>
          <Text style={styles.subtitle}>Find answers to common questions about our platform.</Text>
        </View>
      </LinearGradient>

      {/* FAQ content */}
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.faqContainer}>{renderFAQs()}</View>

        {/* Decorative elements */}
        <View style={styles.decorativeContainer}>
          <View style={[styles.decorativeCircle, { backgroundColor: lightAccentColor }]} />
          <View
            style={[
              styles.decorativeCircle,
              {
                backgroundColor: headerGradientColors[1], // Use the end color of the header gradient
                opacity: 0.1,
                right: -20,
                bottom: -20,
              },
            ]}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  headerGradient: {
    paddingTop: Platform.OS === "ios" ? 0 : StatusBar.currentHeight,
    paddingBottom: 30,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  header: {
    padding: 20,
    paddingTop: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "white",
    marginBottom: 8,
    textShadowColor: "rgba(0, 0, 0, 0.1)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  subtitle: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.9)",
    lineHeight: 22,
  },
  scrollContainer: {
    padding: 16,
    paddingTop: 24,
    paddingBottom: 40,
  },
  faqContainer: {
    marginTop: 8,
    zIndex: 1,
  },
  faqItemContainer: {
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
    overflow: "hidden",
  },
  faqItem: {
    padding: 20,
  },
  questionContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  questionTextContainer: {
    flex: 1,
    paddingRight: 16,
  },
  questionText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1e293b",
    lineHeight: 22,
  },
  iconContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  answerContainer: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.06)",
  },
  answerText: {
    fontSize: 15,
    lineHeight: 24,
    color: "#475569",
  },
  decorativeContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1,
  },
  decorativeCircle: {
    position: "absolute",
    width: 200,
    height: 200,
    borderRadius: 100,
    right: -100,
    top: -50,
  },
})

export default FAQSection
