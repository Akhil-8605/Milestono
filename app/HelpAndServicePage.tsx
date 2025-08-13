import type React from "react"
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Dimensions, StatusBar } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { Ionicons } from "@expo/vector-icons"
import { goBack } from "expo-router/build/global-state/routing"
import { useNavigation } from "expo-router"

const { width } = Dimensions.get("window")

interface HelpAndServicePageProps {
    navigation?: any
}

const HelpAndServicePage: React.FC<HelpAndServicePageProps> = () => {

    const navigation = useNavigation()

    const helpCategories = [
        {
            icon: "home-outline",
            title: "Property Search",
            description: "Find your dream property with our advanced search tools and expert guidance.",
            items: ["Property listings", "Search filters", "Property details", "Virtual tours"],
        },
        {
            icon: "document-text-outline",
            title: "Documentation",
            description: "Get assistance with all property-related documentation and legal processes.",
            items: ["Legal verification", "Document preparation", "Registration process", "Loan assistance"],
        },
        {
            icon: "cash-outline",
            title: "Pricing & Valuation",
            description: "Understand property pricing, market trends, and get accurate valuations.",
            items: ["Market analysis", "Property valuation", "Price negotiation", "Investment advice"],
        },
        {
            icon: "construct-outline",
            title: "Property Management",
            description: "Comprehensive property management services for owners and tenants.",
            items: ["Maintenance services", "Tenant management", "Rent collection", "Property inspection"],
        },
    ]

    const faqs = [
        {
            question: "How do I start my property search?",
            answer:
                "Begin by defining your requirements, budget, and preferred location. Our team will help you find suitable options.",
        },
        {
            question: "What documents do I need for property purchase?",
            answer:
                "You'll need identity proof, address proof, income documents, and bank statements. We'll guide you through the complete list.",
        },
        {
            question: "How long does the property buying process take?",
            answer: "Typically 30-45 days from offer acceptance to completion, depending on documentation and loan approval.",
        },
        {
            question: "Do you provide post-purchase support?",
            answer:
                "Yes, we offer comprehensive post-purchase support including property management and maintenance services.",
        },
    ]

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#667eea" />

            {/* Header */}
            <LinearGradient colors={["#667eea", "#764ba2"]} style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={goBack}>
                    <Ionicons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>
                <View style={styles.headerContent}>
                    <Text style={styles.headerTitle}>Help & Support</Text>
                    <Text style={styles.headerSubtitle}>We're here to assist you</Text>
                </View>
            </LinearGradient>

            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                {/* Hero Section */}
                <View style={styles.heroSection}>
                    <Ionicons name="help-circle-outline" size={64} color="#667eea" />
                    <Text style={styles.heroTitle}>How Can We Help You?</Text>
                    <Text style={styles.heroDescription}>
                        At Milestono, we're committed to providing exceptional support throughout your real estate journey. Whether
                        you're buying, selling, or managing properties, our expert team is here to guide you every step of the way.
                    </Text>
                </View>

                {/* About Milestono Support */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>About Milestono Support</Text>
                    <View style={styles.aboutCard}>
                        <Text style={styles.aboutText}>
                            Our dedicated support team combines years of real estate expertise with a commitment to customer
                            satisfaction. We understand that property transactions can be complex, and we're here to simplify the
                            process for you.
                        </Text>
                        <View style={styles.supportStats}>
                            <View style={styles.statItem}>
                                <Text style={styles.statNumber}>24/7</Text>
                                <Text style={styles.statLabel}>Support Available</Text>
                            </View>
                            <View style={styles.statItem}>
                                <Text style={styles.statNumber}>500+</Text>
                                <Text style={styles.statLabel}>Happy Clients</Text>
                            </View>
                            <View style={styles.statItem}>
                                <Text style={styles.statNumber}>98%</Text>
                                <Text style={styles.statLabel}>Satisfaction Rate</Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Help Categories */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>What Do You Need Help With?</Text>
                    <View style={styles.categoriesContainer}>
                        {helpCategories.map((category, index) => (
                            <View key={index} style={styles.categoryCard}>
                                <View style={styles.categoryHeader}>
                                    <View style={styles.categoryIconContainer}>
                                        <Ionicons name={category.icon as any} size={28} color="#667eea" />
                                    </View>
                                    <View style={styles.categoryHeaderContent}>
                                        <Text style={styles.categoryTitle}>{category.title}</Text>
                                        <Text style={styles.categoryDescription}>{category.description}</Text>
                                    </View>
                                </View>
                                <View style={styles.categoryItems}>
                                    {category.items.map((item, itemIndex) => (
                                        <View key={itemIndex} style={styles.categoryItem}>
                                            <Ionicons name="checkmark-circle" size={16} color="#48bb78" />
                                            <Text style={styles.categoryItemText}>{item}</Text>
                                        </View>
                                    ))}
                                </View>
                            </View>
                        ))}
                    </View>
                </View>

                {/* FAQ Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
                    <View style={styles.faqContainer}>
                        {faqs.map((faq, index) => (
                            <View key={index} style={styles.faqCard}>
                                <View style={styles.faqQuestion}>
                                    <Ionicons name="help-circle" size={20} color="#667eea" />
                                    <Text style={styles.faqQuestionText}>{faq.question}</Text>
                                </View>
                                <Text style={styles.faqAnswer}>{faq.answer}</Text>
                            </View>
                        ))}
                    </View>
                </View>

                {/* Contact Section */}
                <View style={styles.section}>
                    <View style={styles.contactSection}>
                        <Ionicons name="chatbubbles-outline" size={48} color="#667eea" />
                        <Text style={styles.contactSectionTitle}>Still Need Help?</Text>
                        <Text style={styles.contactSectionText}>
                            Can't find what you're looking for? Our support team is ready to provide personalized assistance for all
                            your real estate needs.
                        </Text>
                        <TouchableOpacity style={styles.contactButton} onPress={() => { navigation.navigate("ContactUsPage" as never) }}>
                            <LinearGradient colors={["#667eea", "#764ba2"]} style={styles.contactButtonGradient}>
                                <Ionicons name="mail" size={20} color="white" />
                                <Text style={styles.contactButtonText}>Contact Us Now</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Emergency Contact */}
                <View style={styles.section}>
                    <View style={styles.emergencyCard}>
                        <Ionicons name="warning-outline" size={24} color="#e53e3e" />
                        <View style={styles.emergencyContent}>
                            <Text style={styles.emergencyTitle}>Emergency Support</Text>
                            <Text style={styles.emergencyText}>
                                For urgent property-related issues, call our emergency hotline available 24/7.
                            </Text>
                            <Text style={styles.emergencyNumber}>Emergency: +91 92125 85873</Text>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f8f9fa",
    },
    header: {
        paddingTop: StatusBar.currentHeight || 44,
        paddingBottom: 20,
        paddingHorizontal: 20,
        flexDirection: "row",
        alignItems: "center",
    },
    backButton: {
        padding: 8,
        marginRight: 12,
    },
    headerContent: {
        flex: 1,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: "bold",
        color: "white",
        marginBottom: 4,
    },
    headerSubtitle: {
        fontSize: 14,
        color: "rgba(255, 255, 255, 0.8)",
    },
    scrollView: {
        flex: 1,
    },
    heroSection: {
        padding: 32,
        alignItems: "center",
        backgroundColor: "white",
        marginHorizontal: 20,
        marginTop: 20,
        borderRadius: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
    },
    heroTitle: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#2d3748",
        marginTop: 16,
        marginBottom: 8,
    },
    heroDescription: {
        fontSize: 14,
        color: "#4a5568",
        textAlign: "center",
        lineHeight: 20,
    },
    section: {
        padding: 20,
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: "bold",
        color: "#2d3748",
        marginBottom: 16,
        textAlign: "center",
    },
    aboutCard: {
        backgroundColor: "white",
        padding: 20,
        borderRadius: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
    },
    aboutText: {
        fontSize: 14,
        color: "#4a5568",
        lineHeight: 20,
        marginBottom: 20,
        textAlign: "center",
    },
    supportStats: {
        flexDirection: "row",
        justifyContent: "space-around",
    },
    statItem: {
        alignItems: "center",
    },
    statNumber: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#667eea",
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 12,
        color: "#4a5568",
        textAlign: "center",
    },
    categoriesContainer: {
        gap: 16,
    },
    categoryCard: {
        backgroundColor: "white",
        padding: 20,
        borderRadius: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    categoryHeader: {
        flexDirection: "row",
        alignItems: "flex-start",
        marginBottom: 16,
    },
    categoryIconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: "rgba(102, 126, 234, 0.1)",
        alignItems: "center",
        justifyContent: "center",
        marginRight: 16,
    },
    categoryHeaderContent: {
        flex: 1,
    },
    categoryTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#2d3748",
        marginBottom: 4,
    },
    categoryDescription: {
        fontSize: 14,
        color: "#4a5568",
        lineHeight: 18,
    },
    categoryItems: {
        gap: 8,
    },
    categoryItem: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    categoryItemText: {
        fontSize: 14,
        color: "#4a5568",
    },
    faqContainer: {
        gap: 12,
    },
    faqCard: {
        backgroundColor: "white",
        padding: 16,
        borderRadius: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    faqQuestion: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        marginBottom: 8,
    },
    faqQuestionText: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#2d3748",
        flex: 1,
    },
    faqAnswer: {
        fontSize: 14,
        color: "#4a5568",
        lineHeight: 18,
        marginLeft: 28,
    },
    contactSection: {
        backgroundColor: "white",
        padding: 24,
        borderRadius: 16,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
    },
    contactSectionTitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#2d3748",
        marginTop: 12,
        marginBottom: 8,
    },
    contactSectionText: {
        fontSize: 14,
        color: "#4a5568",
        textAlign: "center",
        lineHeight: 20,
        marginBottom: 20,
    },
    contactButton: {
        borderRadius: 25,
        overflow: "hidden",
    },
    contactButtonGradient: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 24,
        paddingVertical: 12,
        gap: 8,
    },
    contactButtonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "600",
    },
    emergencyCard: {
        backgroundColor: "#fed7d7",
        padding: 16,
        borderRadius: 12,
        flexDirection: "row",
        alignItems: "flex-start",
        borderLeftWidth: 4,
        borderLeftColor: "#e53e3e",
    },
    emergencyContent: {
        flex: 1,
        marginLeft: 12,
    },
    emergencyTitle: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#c53030",
        marginBottom: 4,
    },
    emergencyText: {
        fontSize: 14,
        color: "#742a2a",
        lineHeight: 18,
        marginBottom: 8,
    },
    emergencyNumber: {
        fontSize: 14,
        fontWeight: "bold",
        color: "#c53030",
    },
})

export default HelpAndServicePage
