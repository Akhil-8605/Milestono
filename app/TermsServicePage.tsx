"use client"

import type React from "react"
import { useState } from "react"
import { View, Text, ScrollView, StyleSheet, TouchableOpacity , StatusBar} from "react-native"

const TermsService: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false)

    const toggleDropdown = () => {
        setIsOpen(!isOpen)
    }

    const statusBarHeight = StatusBar.currentHeight || 0;

    return (
        <ScrollView style={[styles.container, { marginTop: statusBarHeight }]}>
            <View style={styles.content}>
                <View style={styles.header}>
                    <Text style={styles.title}>TERMS OF SERVICE</Text>
                    <Text style={styles.lastUpdated}>Last updated December 26, 2024</Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Introduction</Text>
                    <Text style={styles.text}>
                        Welcome to Milestono.com! These Terms of Service ("Terms") govern your access to and use of our website,
                        platform, services, and associated tools (collectively referred to as the "Services"). By accessing or using
                        our Services, you agree to comply with and be bound by these Terms. If you do not agree to these Terms, you
                        must not use our Services. Our mission is to provide a seamless and user-friendly experience for all our
                        users. Whether you are exploring our platform for personal use or business purposes, we strive to ensure
                        that your journey with Milestono.com is secure, efficient, and rewarding. These Terms outline your rights
                        and responsibilities as a user of our platform, including your obligations, the scope of permissible use,
                        and the limitations of liability. Additionally, we have detailed the processes related to payments, content
                        submissions, and account management to ensure transparency and clarity. Please take the time to read these
                        Terms carefully. Your use of the Services signifies your acceptance and understanding of all provisions
                        outlined here. If you have any questions, feel free to reach out to us at [Insert Contact Information].
                        Thank you for choosing Milestono.com! We look forward to serving your needs and helping you achieve your
                        goals.
                    </Text>
                </View>

                <View style={[styles.section, styles.tableOfContentsSection]}>
                    <TouchableOpacity
                        style={[styles.dropdownHeader, isOpen && styles.dropdownHeaderOpen]}
                        onPress={toggleDropdown}
                    >
                        <Text style={styles.tableOfContentsTitle}>Contents {isOpen ? "▲" : "▼"}</Text>
                    </TouchableOpacity>
                    {isOpen && (
                        <View style={styles.tableOfContents}>
                            <Text style={styles.tocItem}>1. Definitions</Text>
                            <Text style={styles.tocItem}>2. Eligibility and Registration</Text>
                            <Text style={styles.tocItem}>3. User Accounts</Text>
                            <Text style={styles.tocItem}>4. Payment Terms</Text>
                            <Text style={styles.tocItem}>5. Refunds and Cancellations</Text>
                            <Text style={styles.tocItem}>6. Vendor Responsibilities</Text>
                            <Text style={styles.tocItem}>7. Platform Rights</Text>
                            <Text style={styles.tocItem}>8. Limitations of Liability</Text>
                            <Text style={styles.tocItem}>9. Governing Law and Jurisdiction</Text>
                        </View>
                    )}
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>1. Definition</Text>
                    <Text style={styles.text}>
                        Platform: Refers to Milestono.com, including its website and mobile applications.{"\n"}
                        User: Includes any individual or entity registering on Milestono.com, including Real Estate Premium Users,
                        Service Users, and Vendors.{"\n"}
                        Vendor: Service providers registered on the platform to offer services to users.{"\n"}
                        Premium Account: A paid membership offering enhanced features in the Real Estate section.{"\n"}
                        Service Charges: Fees paid by Service Users for engaging vendors.
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>2. Eligibility and Registration</Text>
                    <Text style={styles.text}>
                        <Text style={styles.bold}>2.1 General Eligibility:</Text>
                        {"\n"}
                        Milestono.com is open to all users, including vendors, real estate users, and service seekers.{"\n\n"}
                        <Text style={styles.bold}>2.2 Vendor Registration:</Text>
                        {"\n"}
                        To register as a vendor, you must:{"\n"}
                        Provide your full name, contact information, and service details.
                        {"\n"}
                        Upload clear images of your PAN card and Aadhaar card for identity verification and security purposes.{"\n"}
                        Provide your PAN card and Aadhaar card numbers during the registration process.{"\n"}
                        Consent to the verification of your documents by Milestono.com for security and compliance purposes.{"\n"}
                        Failure to provide accurate and verifiable information may result in rejection or suspension of your vendor
                        account.
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>3. User Accounts</Text>
                    <Text style={styles.text}>
                        <Text style={styles.bold}>3.1 Account Registration:</Text>
                        {"\n"}
                        Users must provide accurate information during registration and update their details when required.{"\n"}
                        All accounts are personal and non-transferable.{"\n\n"}
                        <Text style={styles.bold}>3.2 Account Security:</Text>
                        {"\n"}
                        Users are responsible for keeping their account credentials secure.
                        {"\n"}
                        Notify Milestono.com immediately if you suspect unauthorized account activity.{"\n\n"}
                        <Text style={styles.bold}>3.3 Termination of Accounts:</Text>
                        {"\n"}
                        Milestono.com reserves the right to suspend or terminate accounts for policy violations or fraudulent
                        activities.
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>4. Payment Terms</Text>
                    <Text style={styles.text}>
                        <Text style={styles.bold}>4.1 Payment Methods:</Text>
                        {"\n"}
                        UPI Payments Only: All transactions on Milestono.com are conducted through UPI payment systems.{"\n\n"}
                        <Text style={styles.bold}>4.2 Service Charges:</Text>
                        {"\n"}
                        Service Users must pay service fees to the platform when engaging vendors.{"\n"}
                        Payments are held in escrow until service completion or mutual agreement.{"\n\n"}
                        <Text style={styles.bold}>4.3 Vendor Payments:</Text>
                        {"\n"}
                        Vendors receive service payments after service verification by the user or as per the platform's payout
                        schedule (manual or automatic).
                        {"\n\n"}
                        <Text style={styles.bold}>4.4 Premium Account Plans:</Text>
                        {"\n"}
                        Premium accounts in the Real Estate section require full upfront payment.{"\n"}
                        Refunds for premium accounts are not permitted under any circumstances.
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>5. Refunds and Cancellations</Text>
                    <Text style={styles.text}>
                        <Text style={styles.bold}>5.1 Real Estate Premium Accounts:</Text>
                        {"\n"}
                        Payments for premium accounts are final and non-refundable.{"\n\n"}
                        <Text style={styles.bold}>5.2 Services Section:</Text>
                        {"\n"}
                        Once a Service User accepts a vendor's cost proposal, the service charge becomes non-refundable.{"\n"}
                        Refunds will only be processed in cases of verified fraud or significant service discrepancies.{"\n\n"}
                        <Text style={styles.bold}>5.3 Dispute Resolution:</Text>
                        {"\n"}
                        Users must raise disputes within 3 days of service completion.
                        {"\n"}
                        Milestono.com will review disputes and make final decisions.
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>6. Vendor Responsibilities</Text>
                    <Text style={styles.text}>
                        Vendors must provide accurate service details and maintain the quality of services offered.{"\n"}
                        Vendors are required to upload valid PAN card and Aadhaar card images and numbers for account verification.
                        {"\n"}
                        Vendors must comply with all applicable legal and tax regulations.
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>7. Platform Rights</Text>
                    <Text style={styles.text}>
                        Milestono.com reserves the right to modify or discontinue services without prior notice.{"\n"}
                        The platform may update these terms as needed. Users will be notified of significant updates.
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>8. Limitations of Liability</Text>
                    <Text style={styles.text}>
                        Milestono.com is not responsible for disputes or disagreements between users and vendors.{"\n"}
                        The platform is not liable for losses caused by technical issues, unauthorized access, or external factors
                        beyond its control.
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>9. Governing Law and Jurisdiction</Text>
                    <Text style={styles.text}>
                        These terms are governed by the laws of India and fall under the jurisdiction of courts in Solapur.
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>10. Contact Information</Text>
                    <Text style={styles.text}>
                        For questions or concerns, please contact us:{"\n"}
                        Phone:
                    </Text>
                </View>
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#ffffff",
    },
    content: {
        maxWidth: 800,
        alignSelf: "center",
        padding: 20,
        backgroundColor: "#ffffff",
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 4,
    },
    header: {
        alignItems: "center",
        marginBottom: 30,
    },
    title: {
        fontSize: 28,
        fontWeight: "600",
        color: "#333333",
        marginBottom: 8,
        letterSpacing: 0.5,
        textAlign: "center",
    },
    lastUpdated: {
        fontSize: 16,
        color: "#777777",
        fontStyle: "italic",
        letterSpacing: 0.5,
    },
    section: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: "600",
        color: "#333333",
        marginBottom: 16,
        borderBottomWidth: 2,
        borderBottomColor: "#e0e0e0",
        paddingBottom: 8,
    },
    text: {
        fontSize: 16,
        color: "#777777",
        lineHeight: 24,
        marginBottom: 20,
    },
    bold: {
        fontWeight: "600",
        color: "#333333",
    },
    tableOfContentsSection: {
        backgroundColor: "#f4f5f7",
        padding: 16,
        marginBottom: 30,
        borderRadius: 19,
    },
    dropdownHeader: {
        paddingVertical: 16,
        paddingHorizontal: 0,
    },
    dropdownHeaderOpen: {
        paddingBottom: 8,
    },
    tableOfContentsTitle: {
        fontSize: 20,
        fontWeight: "600",
        color: "#333333",
        textAlign: "center",
    },
    tableOfContents: {
        paddingBottom: 16,
    },
    tocItem: {
        fontSize: 16,
        color: "#0d6efd",
        fontWeight: "500",
        marginBottom: 8,
        paddingLeft: 16,
    },
})

export default TermsService
