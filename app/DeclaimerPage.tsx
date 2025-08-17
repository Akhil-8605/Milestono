"use client"

import type React from "react"
import { useState } from "react"
import { View, Text, ScrollView, StyleSheet , StatusBar} from "react-native"

const Disclaimer: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false)

    const toggleDropdown = () => {
        setIsOpen(!isOpen)
    }

    const statusBarHeight = StatusBar.currentHeight || 0;

    return (
        <ScrollView style={[styles.container, { marginTop: statusBarHeight }]}>
            <View style={styles.content}>
                <View style={styles.header}>
                    <Text style={styles.title}>Disclaimer</Text>
                    <Text style={styles.lastUpdated}>Last updated December 26, 2024</Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Introduction</Text>
                    <Text style={styles.text}>
                        Welcome to Milestono.com (referred to as the "Platform"). By accessing or using the Platform, you
                        acknowledge and agree to the terms outlined in this Disclaimer. This Disclaimer applies to all users,
                        including property buyers, renters, vendors, brokers, service providers, and service users.{"\n\n"}
                        Milestono.com serves as an online marketplace facilitating real estate transactions and service connections.
                        While we strive to ensure the quality and accuracy of information, the Platform operates on an "as-is" basis
                        and does not guarantee the reliability, legality, or quality of any content, service, or transaction
                        conducted through the Platform.
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>1. General Disclaimer</Text>
                    <Text style={styles.text}>
                        The information and services provided on the Platform are for general informational purposes only. While
                        Milestono.com makes every effort to maintain accurate and updated information, it does not warrant or
                        guarantee the completeness, reliability, or suitability of any property listing, vendor service, or
                        transaction available on the Platform.{"\n\n"}
                        Any reliance placed on the information provided is strictly at the user's own risk.
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>2. Real Estate-Specific Disclaimer</Text>
                    <Text style={styles.subsectionTitle}>2.1 Property Listings</Text>
                    <Text style={styles.text}>
                        Property listings are created and managed by third-party users, including dealers, brokers, and property
                        owners. Milestono.com does not verify the accuracy, authenticity, or legality of the property details or
                        documents provided.{"\n\n"}
                        Users are solely responsible for conducting due diligence before entering into any agreements or
                        transactions. This includes verifying ownership, property conditions, and legal compliance.
                        {"\n\n"}
                    </Text>
                    <Text style={styles.subsectionTitle}>2.2 Property Transactions</Text>
                    <Text style={styles.text}>
                        The Platform is a facilitator and does not mediate or participate in property transactions. All disputes
                        related to property dealings must be resolved between the concerned parties without involving Milestono.com.
                        {"\n\n"}
                        Milestono.com is not liable for any loss, damages, fraud, or breach of contract arising out of property
                        transactions.
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>3. Services-Specific Disclaimer</Text>
                    <Text style={styles.subsectionTitle}>3.1 Vendor and Service User Interactions</Text>
                    <Text style={styles.text}>
                        The Platform connects vendors and service users but does not endorse or verify the quality, reliability, or
                        suitability of services offered by vendors. Users are responsible for verifying the credentials,
                        authenticity, and capabilities of vendors before availing their services.{"\n\n"}
                    </Text>
                    <Text style={styles.subsectionTitle}>3.2 Payment and Refunds</Text>
                    <Text style={styles.text}>
                        Service users are required to make payments through the Platform's payment gateway. Payments are transferred
                        to vendors either manually or through an automated system. Once a vendor accepts the service cost, payments
                        are final and non-refundable.{"\n\n"}
                    </Text>
                    <Text style={styles.subsectionTitle}>3.3 Vendor Registration</Text>
                    <Text style={styles.text}>
                        Vendors must provide valid identification, including PAN Card and Aadhaar Card, during registration. The
                        Platform reserves the right to verify and approve vendor accounts at its discretion.
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>4. Payments and Financial Transactions</Text>
                    <Text style={styles.text}>
                        Payments made through the Platform are processed via a third-party payment gateway (e.g., Razorpay).
                        Milestono.com does not store sensitive payment information such as UPI IDs or card details. Users must
                        review the terms of the payment gateway provider to understand their policies on refunds, chargebacks, and
                        disputes.
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>5. Account and Data Management</Text>
                    <Text style={styles.subsectionTitle}>5.1 Account Deletion</Text>
                    <Text style={styles.text}>
                        Users can delete their accounts at any time through the "Account Settings" section. Deleted accounts cannot
                        be recovered. Upon deletion, personal data will be permanently removed from active systems, except as
                        required for legal or regulatory compliance.{"\n\n"}
                    </Text>
                    <Text style={styles.subsectionTitle}>5.2 Property Deletion</Text>
                    <Text style={styles.text}>
                        Users can delete property listings they have added to the Platform. Deleted listings will no longer be
                        visible publicly but may be retained in archived form for legal or audit purposes.
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>6. Third-Party Links and Tools</Text>
                    <Text style={styles.text}>
                        The Platform may include links to third-party websites, applications, or tools for payment, verification, or
                        additional services. Milestono.com does not control or endorse these external services and shall not be
                        responsible for their performance, content, or security.
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>7. Limitation of Liability</Text>
                    <Text style={styles.text}>
                        Milestono.com, its affiliates, employees, and partners shall not be liable for any direct, indirect,
                        incidental, or consequential damages, including but not limited to:{"\n\n"}• Loss of data or business
                        opportunities.{"\n"}• Fraud, disputes, or misrepresentation in transactions.{"\n"}• Technical errors,
                        service disruptions, or unauthorized access.
                        {"\n\n"}
                        The total liability of Milestono.com for any claims arising from Platform use shall not exceed the amount
                        paid by the user for accessing premium features or services.
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>8. Platform Modifications</Text>
                    <Text style={styles.text}>
                        Milestono.com reserves the right to modify, suspend, or discontinue any part of the Platform or its services
                        at any time without prior notice.
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>9. Legal Compliance</Text>
                    <Text style={styles.text}>
                        Users must comply with all applicable laws, regulations, and guidelines while using the Platform. Any
                        unlawful activities, including fraudulent property listings, fake service registrations, or unauthorized
                        financial transactions, will be reported to the appropriate authorities.
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>10. No Guarantees or Endorsements</Text>
                    <Text style={styles.text}>
                        Milestono.com does not endorse or guarantee the accuracy, authenticity, or legality of any content, property
                        listing, or service offered on the Platform. Users acknowledge that the Platform merely facilitates
                        interactions and does not mediate or guarantee outcomes.
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>11. Updates to This Disclaimer</Text>
                    <Text style={styles.text}>
                        Milestono.com reserves the right to update or modify this Disclaimer at any time. Users are encouraged to
                        review this Disclaimer periodically to stay informed about the terms governing their use of the Platform.
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>12. Contact Information</Text>
                    <Text style={styles.text}>
                        For questions or concerns regarding this Disclaimer, please contact us:{"\n\n"}• Phone:
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
    subsectionTitle: {
        fontSize: 18,
        fontWeight: "500",
        color: "#333333",
        marginBottom: 12,
        marginTop: 8,
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
})

export default Disclaimer
