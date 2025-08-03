"use client"

import type React from "react"
import { useState } from "react"
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    Dimensions,
    StatusBar,
    Alert,
    KeyboardAvoidingView,
    Platform,
} from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { Ionicons } from "@expo/vector-icons"
import { goBack } from "expo-router/build/global-state/routing"

const { width } = Dimensions.get("window")

interface ContactUsPageProps {
    navigation?: any
}

const ContactUsPage: React.FC<ContactUsPageProps> = ({ navigation }) => {
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phone: "",
        message: "",
    })
    const [loading, setLoading] = useState(false)

    const handleInputChange = (field: string, value: string) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }))
    }

    const validateForm = () => {
        if (!formData.fullName.trim()) {
            Alert.alert("Validation Error", "Please enter your full name")
            return false
        }
        if (!formData.email.trim() || !formData.email.includes("@")) {
            Alert.alert("Validation Error", "Please enter a valid email address")
            return false
        }
        if (!formData.phone.trim()) {
            Alert.alert("Validation Error", "Please enter your phone number")
            return false
        }
        if (!formData.message.trim()) {
            Alert.alert("Validation Error", "Please enter your message")
            return false
        }
        return true
    }

    const handleSubmit = async () => {
        if (!validateForm()) return

        setLoading(true)
        try {
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 2000))
            Alert.alert("Success", "Your message has been sent successfully! We'll get back to you soon.", [
                {
                    text: "OK",
                    onPress: () => {
                        setFormData({ fullName: "", email: "", phone: "", message: "" })
                    },
                },
            ])
        } catch (error) {
            Alert.alert("Error", "Failed to send message. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    const contactInfo = [
        {
            icon: "mail-outline",
            title: "Email Us",
            value: "milestono8@gmail.com",
            action: "mailto:milestono8@gmail.com",
        },
        {
            icon: "call-outline",
            title: "Call Us",
            value: "+91 XXXXX XXXXX",
            action: "tel:+91XXXXXXXXX",
        },
        {
            icon: "location-outline",
            title: "Visit Our Office",
            value: "Mahavir Enclave, Palam\nNew Delhi-110045",
            action: null,
        },
    ]

    return (
        <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : "height"}>
            <StatusBar barStyle="light-content" backgroundColor="#667eea" />

            {/* Header */}
            <LinearGradient colors={["#667eea", "#764ba2"]} style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={goBack}>
                    <Ionicons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>
                <View style={styles.headerContent}>
                    <Text style={styles.headerTitle}>Get in Touch</Text>
                    <Text style={styles.headerSubtitle}>We're Here to Help!</Text>
                </View>
            </LinearGradient>

            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                {/* Hero Section */}
                <View style={styles.heroSection}>
                    <Ionicons name="chatbubbles-outline" size={64} color="#667eea" />
                    <Text style={styles.heroTitle}>Contact Milestono</Text>
                    <Text style={styles.heroDescription}>
                        Have questions about our services? Need assistance with property inquiries? We're here to provide you with
                        the support you need.
                    </Text>
                </View>

                {/* Contact Information */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Reach Us</Text>
                    <View style={styles.contactInfoContainer}>
                        {contactInfo.map((info, index) => (
                            <TouchableOpacity
                                key={index}
                                style={styles.contactInfoCard}
                                onPress={() => info.action && Alert.alert("Contact", `Opening ${info.action}`)}
                            >
                                <View style={styles.contactIconContainer}>
                                    <Ionicons name={info.icon as any} size={24} color="#667eea" />
                                </View>
                                <View style={styles.contactInfoContent}>
                                    <Text style={styles.contactInfoTitle}>{info.title}</Text>
                                    <Text style={styles.contactInfoValue}>{info.value}</Text>
                                </View>
                                {info.action && <Ionicons name="chevron-forward" size={20} color="#a0aec0" />}
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Contact Form */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Send Us a Message</Text>
                    <View style={styles.formContainer}>
                        <View style={styles.formRow}>
                            <View style={styles.inputContainer}>
                                <Text style={styles.inputLabel}>Full Name *</Text>
                                <TextInput
                                    style={styles.textInput}
                                    placeholder="Enter your full name"
                                    value={formData.fullName}
                                    onChangeText={(value) => handleInputChange("fullName", value)}
                                    placeholderTextColor="#a0aec0"
                                />
                            </View>
                        </View>

                        <View style={styles.formRow}>
                            <View style={styles.inputContainer}>
                                <Text style={styles.inputLabel}>Email Address *</Text>
                                <TextInput
                                    style={styles.textInput}
                                    placeholder="Enter your email"
                                    value={formData.email}
                                    onChangeText={(value) => handleInputChange("email", value)}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    placeholderTextColor="#a0aec0"
                                />
                            </View>
                        </View>

                        <View style={styles.formRow}>
                            <View style={styles.inputContainer}>
                                <Text style={styles.inputLabel}>Phone Number *</Text>
                                <TextInput
                                    style={styles.textInput}
                                    placeholder="Enter your phone number"
                                    value={formData.phone}
                                    onChangeText={(value) => handleInputChange("phone", value)}
                                    keyboardType="phone-pad"
                                    placeholderTextColor="#a0aec0"
                                />
                            </View>
                        </View>

                        <View style={styles.inputContainer}>
                            <Text style={styles.inputLabel}>Message *</Text>
                            <TextInput
                                style={[styles.textInput, styles.textArea]}
                                placeholder="Please provide all pertinent details about your inquiry"
                                value={formData.message}
                                onChangeText={(value) => handleInputChange("message", value)}
                                multiline
                                numberOfLines={4}
                                textAlignVertical="top"
                                placeholderTextColor="#a0aec0"
                            />
                        </View>

                        <TouchableOpacity
                            style={[styles.submitButton, loading && styles.submitButtonDisabled]}
                            onPress={handleSubmit}
                            disabled={loading}
                        >
                            <LinearGradient
                                colors={loading ? ["#a0aec0", "#a0aec0"] : ["#667eea", "#764ba2"]}
                                style={styles.submitButtonGradient}
                            >
                                {loading ? (
                                    <Text style={styles.submitButtonText}>Sending...</Text>
                                ) : (
                                    <>
                                        <Ionicons name="send" size={20} color="white" />
                                        <Text style={styles.submitButtonText}>Send Message</Text>
                                    </>
                                )}
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Additional Info */}
                <View style={styles.section}>
                    <View style={styles.additionalInfoCard}>
                        <Ionicons name="time-outline" size={24} color="#667eea" />
                        <View style={styles.additionalInfoContent}>
                            <Text style={styles.additionalInfoTitle}>Response Time</Text>
                            <Text style={styles.additionalInfoText}>
                                We typically respond to all inquiries within 24 hours during business days.
                            </Text>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
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
    contactInfoContainer: {
        gap: 12,
    },
    contactInfoCard: {
        backgroundColor: "white",
        padding: 16,
        borderRadius: 12,
        flexDirection: "row",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    contactIconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: "rgba(102, 126, 234, 0.1)",
        alignItems: "center",
        justifyContent: "center",
        marginRight: 16,
    },
    contactInfoContent: {
        flex: 1,
    },
    contactInfoTitle: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#2d3748",
        marginBottom: 4,
    },
    contactInfoValue: {
        fontSize: 14,
        color: "#4a5568",
        lineHeight: 18,
    },
    formContainer: {
        backgroundColor: "white",
        padding: 20,
        borderRadius: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
    },
    formRow: {
        marginBottom: 16,
    },
    inputContainer: {
        marginBottom: 16,
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: "600",
        color: "#2d3748",
        marginBottom: 8,
    },
    textInput: {
        borderWidth: 1,
        borderColor: "#e2e8f0",
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        color: "#2d3748",
        backgroundColor: "#f8f9fa",
    },
    textArea: {
        height: 100,
        textAlignVertical: "top",
    },
    submitButton: {
        borderRadius: 12,
        overflow: "hidden",
        marginTop: 8,
    },
    submitButtonDisabled: {
        opacity: 0.7,
    },
    submitButtonGradient: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 16,
        gap: 8,
    },
    submitButtonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "600",
    },
    additionalInfoCard: {
        backgroundColor: "white",
        padding: 16,
        borderRadius: 12,
        flexDirection: "row",
        alignItems: "flex-start",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    additionalInfoContent: {
        flex: 1,
        marginLeft: 12,
    },
    additionalInfoTitle: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#2d3748",
        marginBottom: 4,
    },
    additionalInfoText: {
        fontSize: 14,
        color: "#4a5568",
        lineHeight: 18,
    },
})

export default ContactUsPage
