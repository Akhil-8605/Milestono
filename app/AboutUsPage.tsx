import type React from "react"
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Dimensions, StatusBar } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { Foundation, Ionicons } from "@expo/vector-icons"
import { FontAwesome5 } from "@expo/vector-icons"

const { width } = Dimensions.get("window")

interface AboutUsPageProps {
    navigation?: any
}

const AboutUsPage: React.FC<AboutUsPageProps> = ({ navigation }) => {
    const navigateToVideo = () => {
        if (navigation) {
            navigation.navigate("ViewAboutVideo")
        }
    }

    const statusBarHeight = StatusBar.currentHeight || 0

    return (
        <ScrollView style={[styles.container, { marginTop: statusBarHeight }]} showsVerticalScrollIndicator={false}>
            {/* Hero Section */}
            <LinearGradient colors={["#667eea", "#764ba2"]} style={styles.heroSection}>
                <View style={styles.heroContent}>
                    <Text style={styles.heroHeading}>Welcome to Milestono</Text>
                    <Text style={styles.heroSubheading}>
                        Your trusted partner in real estate solutions. At Milestono, we bring your property dreams to life.
                    </Text>
                </View>
            </LinearGradient>

            {/* Who We Are Section */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Who We Are</Text>
                <Text style={styles.infoText}>
                    Milestono is committed to revolutionizing the real estate landscape with innovative solutions and personalized
                    service. We offer a wide range of services, from luxury property sales to affordable rentals, ensuring every
                    client finds their perfect match.
                </Text>
            </View>

            {/* Mission & Vision */}
            <View style={styles.section}>
                <View style={styles.missionVisionContainer}>
                    <View style={styles.missionCard}>
                        <Foundation name="target" size={32} color="#667eea" />
                        <Text style={styles.cardTitle}>Our Mission</Text>
                        <Text style={styles.cardText}>
                            To provide seamless and innovative real estate experiences by combining cutting-edge technology with a
                            deep understanding of the market.
                        </Text>
                    </View>
                    <View style={styles.visionCard}>
                        <Ionicons name="eye-outline" size={32} color="#764ba2" />
                        <Text style={styles.cardTitle}>Our Vision</Text>
                        <Text style={styles.cardText}>
                            To be the most trusted and innovative real estate partner, helping clients achieve their milestones while
                            creating long-term value.
                        </Text>
                    </View>
                </View>
            </View>

            {/* Why Choose Us */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Why Choose Milestono?</Text>
                <View style={styles.whyChooseGrid}>
                    <View style={styles.whyCard}>
                        <Ionicons name="star-outline" size={24} color="#667eea" />
                        <Text style={styles.whyCardTitle}>Expertise</Text>
                        <Text style={styles.whyCardText}>
                            Decades of combined experience make us your go-to experts in real estate.
                        </Text>
                    </View>
                    <View style={styles.whyCard}>
                        <Ionicons name="people-outline" size={24} color="#667eea" />
                        <Text style={styles.whyCardTitle}>Customer Focus</Text>
                        <Text style={styles.whyCardText}>
                            We prioritize your needs, ensuring tailored solutions for every client.
                        </Text>
                    </View>
                    <View style={styles.whyCard}>
                        <Ionicons name="phone-portrait-outline" size={24} color="#667eea" />
                        <Text style={styles.whyCardTitle}>Innovative Technology</Text>
                        <Text style={styles.whyCardText}>
                            Leveraging advanced tools to simplify the buying and selling process.
                        </Text>
                    </View>
                    <View style={styles.whyCard}>
                        <Ionicons name="shield-checkmark-outline" size={24} color="#667eea" />
                        <Text style={styles.whyCardTitle}>Trust & Transparency</Text>
                        <Text style={styles.whyCardText}>
                            Integrity is at the core of our operations, ensuring a stress-free journey.
                        </Text>
                    </View>
                </View>
            </View>

            {/* Services */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Our Services</Text>
                <View style={styles.servicesGrid}>
                    {[
                        "Luxury Property Sales",
                        "Affordable Rentals",
                        "Commercial Spaces",
                        "Property Management",
                        "Legal Assistance",
                        "Market Analysis",
                    ].map((service, index) => (
                        <View key={index} style={styles.serviceCard}>
                            <Text style={styles.serviceText}>{service}</Text>
                        </View>
                    ))}
                </View>
            </View>

            {/* Video Section */}
            <View style={styles.section}>
                <View style={styles.videoSection}>
                    <Ionicons name="play-circle-outline" size={48} color="#667eea" />
                    <Text style={styles.videoSectionTitle}>Learn More About Milestono</Text>
                    <Text style={styles.videoSectionText}>
                        For more detailed information about our journey, values, and commitment to excellence, watch our
                        comprehensive video.
                    </Text>
                    <TouchableOpacity style={styles.videoButton} onPress={navigateToVideo}>
                        <LinearGradient colors={["#667eea", "#764ba2"]} style={styles.videoButtonGradient}>
                            <Ionicons name="play" size={20} color="white" />
                            <Text style={styles.videoButtonText}>View Milestono Video</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Help & Support Section */}
            <View style={styles.section}>
                <View style={styles.helpSection}>
                    <Ionicons name="help-circle-outline" size={48} color="#667eea" />
                    <Text style={styles.helpSectionTitle}>Need Help or Have Questions?</Text>
                    <Text style={styles.helpSectionText}>
                        Our dedicated support team is here to assist you with any inquiries about our services, properties, or
                        processes.
                    </Text>
                    <TouchableOpacity style={styles.helpButton} onPress={() => navigation?.navigate("HelpAndService")}>
                        <LinearGradient colors={["#667eea", "#764ba2"]} style={styles.helpButtonGradient}>
                            <FontAwesome5 name="info-circle" size={20} color="white" />
                            <Text style={styles.helpButtonText}>Get Help & Support</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Testimonials */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>What Our Clients Say</Text>
                <View style={styles.testimonialsContainer}>
                    <View style={styles.testimonialCard}>
                        <Foundation name="quote" size={24} color="#667eea" />
                        <Text style={styles.testimonialText}>
                            "Milestono guided us every step of the way. Their professionalism and personalized service are second to
                            none."
                        </Text>
                        <Text style={styles.testimonialAuthor}>- Elvish Y.</Text>
                    </View>
                    <View style={styles.testimonialCard}>
                        <Foundation name="quote" size={24} color="#667eea" />
                        <Text style={styles.testimonialText}>
                            "Selling my property was so easy with Milestono. Their expertise and transparency are truly commendable."
                        </Text>
                        <Text style={styles.testimonialAuthor}>- Rajat D.</Text>
                    </View>
                </View>
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f8f9fa",
    },
    heroSection: {
        paddingVertical: 60,
        paddingHorizontal: 20,
        alignItems: "center",
    },
    heroContent: {
        alignItems: "center",
        maxWidth: width - 40,
    },
    heroHeading: {
        fontSize: 32,
        fontWeight: "bold",
        color: "white",
        textAlign: "center",
        marginBottom: 16,
    },
    heroSubheading: {
        fontSize: 16,
        color: "rgba(255, 255, 255, 0.9)",
        textAlign: "center",
        lineHeight: 24,
    },
    section: {
        paddingHorizontal: 20,
        paddingVertical: 24,
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#2d3748",
        marginBottom: 16,
        textAlign: "center",
    },
    infoText: {
        fontSize: 16,
        color: "#4a5568",
        lineHeight: 24,
        textAlign: "center",
    },
    missionVisionContainer: {
        gap: 16,
    },
    missionCard: {
        backgroundColor: "white",
        padding: 24,
        borderRadius: 12,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    visionCard: {
        backgroundColor: "white",
        padding: 24,
        borderRadius: 12,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#2d3748",
        marginTop: 12,
        marginBottom: 8,
    },
    cardText: {
        fontSize: 14,
        color: "#4a5568",
        textAlign: "center",
        lineHeight: 20,
    },
    whyChooseGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 12,
        justifyContent: "space-between",
    },
    whyCard: {
        backgroundColor: "white",
        padding: 16,
        borderRadius: 12,
        width: (width - 52) / 2,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    whyCardTitle: {
        fontSize: 14,
        fontWeight: "bold",
        color: "#2d3748",
        marginTop: 8,
        marginBottom: 4,
        textAlign: "center",
    },
    whyCardText: {
        fontSize: 12,
        color: "#4a5568",
        textAlign: "center",
        lineHeight: 16,
    },
    servicesGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 12,
        justifyContent: "space-between",
    },
    serviceCard: {
        backgroundColor: "white",
        padding: 16,
        borderRadius: 12,
        width: (width - 52) / 2,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    serviceText: {
        fontSize: 14,
        fontWeight: "600",
        color: "#2d3748",
        textAlign: "center",
    },
    videoSection: {
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
    videoSectionTitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#2d3748",
        marginTop: 12,
        marginBottom: 8,
        textAlign: "center",
    },
    videoSectionText: {
        fontSize: 14,
        color: "#4a5568",
        textAlign: "center",
        lineHeight: 20,
        marginBottom: 20,
    },
    videoButton: {
        borderRadius: 25,
        overflow: "hidden",
    },
    videoButtonGradient: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 24,
        paddingVertical: 12,
        gap: 8,
    },
    videoButtonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "600",
    },
    testimonialsContainer: {
        gap: 16,
    },
    testimonialCard: {
        backgroundColor: "white",
        padding: 20,
        borderRadius: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    testimonialText: {
        fontSize: 14,
        color: "#4a5568",
        fontStyle: "italic",
        lineHeight: 20,
        marginTop: 8,
        marginBottom: 12,
    },
    testimonialAuthor: {
        fontSize: 14,
        fontWeight: "bold",
        color: "#667eea",
    },
    helpSection: {
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
    helpSectionTitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#2d3748",
        marginTop: 12,
        marginBottom: 8,
        textAlign: "center",
    },
    helpSectionText: {
        fontSize: 14,
        color: "#4a5568",
        textAlign: "center",
        lineHeight: 20,
        marginBottom: 20,
    },
    helpButton: {
        borderRadius: 25,
        overflow: "hidden",
    },
    helpButtonGradient: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 24,
        paddingVertical: 12,
        gap: 8,
    },
    helpButtonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "600",
    },
})

export default AboutUsPage
