"use client"

import type React from "react"
import { useState } from "react"
import { View, Text, ScrollView, StyleSheet , StatusBar} from "react-native"

const RefundPolicy: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false)

    const toggleDropdown = () => {
        setIsOpen(!isOpen)
    }

    const statusBarHeight = StatusBar.currentHeight || 0;

    return (
        <ScrollView style={[styles.container,{marginTop: statusBarHeight}]}>
            <View style={styles.content}>
                <View style={styles.header}>
                    <Text style={styles.title}>Refund, Cancellation, and Payment Policy</Text>
                    <Text style={styles.lastUpdated}>Last updated December 26, 2024</Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Introduction</Text>
                    <Text style={styles.text}>
                        At Milestono.com, we prioritize customer satisfaction and aim to provide a seamless experience. Our payment
                        process is secure, and we accept various payment methods for your convenience. If you wish to cancel or
                        modify a booking, please notify us within 24 hours of making the reservation to ensure eligibility for a
                        full refund. Cancellations made after this time may be subject to a partial refund, depending on the service
                        provided. Refund requests will be processed within 7 business days, and payments will be refunded to the
                        original method of payment. We reserve the right to deny refunds if the service has already been fulfilled
                        or the cancellation was made under specific non-refundable terms. For any disputes or clarifications, please
                        reach out to our customer support team.
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>1. Scope</Text>
                    <Text style={styles.text}>
                        This policy governs all transactions, including payments, refunds, and cancellations, made on Milestono.com.
                        It applies to users of the Real Estate and Service sections, including premium account holders, vendors, and
                        service users.
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>2. Payment Methods</Text>
                    <Text style={styles.subsectionTitle}>2.1 Payment Modes Supported</Text>
                    <Text style={styles.text}>
                        • UPI Payments Only: All transactions on Milestono.com are processed exclusively through Unified Payments
                        Interface (UPI).{"\n"}• Users must link a valid UPI ID during payment. Other payment methods such as
                        credit/debit cards or digital wallets are not supported.{"\n\n"}
                    </Text>
                    <Text style={styles.subsectionTitle}>2.2 Payment Confirmation</Text>
                    <Text style={styles.text}>
                        • Payments are considered confirmed once successfully processed through UPI.{"\n"}• A receipt will be sent
                        to the registered email address or displayed in the user's account dashboard.{"\n\n"}
                    </Text>
                    <Text style={styles.subsectionTitle}>2.3 Taxes and Fees</Text>
                    <Text style={styles.text}>
                        • Payments are inclusive of applicable taxes as mandated by law.{"\n"}• Platform fees may apply and are
                        transparently communicated at the time of payment.
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>3. Real Estate Services</Text>
                    <Text style={styles.subsectionTitle}>3.1 Premium Account Plans</Text>
                    <Text style={styles.text}>
                        Premium account holders gain access to exclusive features, such as:{"\n"}• Enhanced property visibility
                        through highlighted listings.{"\n"}• Advanced analytics and marketing tools.{"\n"}• Priority customer
                        support for account-related queries.{"\n\n"}
                    </Text>
                    <Text style={styles.subsectionTitle}>3.2 Payment Terms</Text>
                    <Text style={styles.text}>
                        • Premium plans are charged upfront, and payment must be completed through UPI.{"\n\n"}
                    </Text>
                    <Text style={styles.subsectionTitle}>3.3 Refund and Cancellation Policy</Text>
                    <Text style={styles.text}>
                        • Once a user purchases a premium account plan, the payment is non-refundable under any circumstances.{"\n"}
                        • Users are responsible for reviewing the plan details thoroughly before making a purchase.{"\n"}•
                        Cancellation of premium accounts is allowed, but benefits will continue until the plan's expiration date.
                        {"\n\n"}
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>4. Service Transactions</Text>
                    <Text style={styles.subsectionTitle}>4.1 Workflow for Services</Text>
                    <Text style={styles.text}>
                        <Text style={styles.bold}>For Service Users:</Text>
                        {"\n"}• Service users can submit requests to vendors listed on Milestono.com.{"\n"}• Vendors respond with
                        the cost of the requested service.{"\n"}• The service user can either:{"\n"}• Accept the Cost: Make the
                        payment to the platform's account via UPI.{"\n"}• Reject the Cost: No payment is made, and the request is
                        closed.
                        {"\n\n"}
                    </Text>
                    <Text style={styles.text}>
                        <Text style={styles.bold}>For Vendors:</Text>
                        {"\n"}• Vendors are paid after the service is delivered, verified, and approved. Payments are processed:
                        {"\n"}• Manually: The admin confirms service completion and releases funds.{"\n"}• Automatically: Funds are
                        released once the service delivery is verified.{"\n\n"}
                    </Text>
                    <Text style={styles.subsectionTitle}>4.2 Refund and Cancellation Policy</Text>
                    <Text style={styles.text}>
                        • No Refund After Cost Acceptance: Once a service user accepts the vendor's quoted cost and makes the
                        payment, the amount becomes non-refundable.{"\n"}• Refund Exceptions: Refunds will only be processed under
                        the following conditions:{"\n"}• The vendor fails to provide the agreed-upon service.{"\n"}• The delivered
                        service is unsatisfactory, and valid evidence is provided.{"\n"}• Dispute Resolution: Users may raise
                        disputes within 3 days of service completion.{"\n"}• The platform will mediate and make a final decision
                        based on evidence submitted by both parties.
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>5. General Policies</Text>
                    <Text style={styles.subsectionTitle}>5.1 User Responsibility</Text>
                    <Text style={styles.text}>
                        • Users must provide accurate information during registration and payment processes.{"\n"}• Service users
                        and vendors must adhere to the platform's terms of service and ensure compliance with all applicable laws.
                        {"\n\n"}
                    </Text>
                    <Text style={styles.subsectionTitle}>5.2 Platform Responsibility</Text>
                    <Text style={styles.text}>
                        • Milestono.com ensures secure payment processing using industry-standard encryption.{"\n"}• The platform
                        holds payments in escrow until service verification to protect both parties.{"\n\n"}
                    </Text>
                    <Text style={styles.subsectionTitle}>5.3 Fraud Prevention</Text>
                    <Text style={styles.text}>
                        • Transactions flagged as suspicious may be temporarily held for review.{"\n"}• Users involved in fraudulent
                        activity will face account suspension or termination.{"\n\n"}
                    </Text>
                    <Text style={styles.subsectionTitle}>5.4 Updates to Policies</Text>
                    <Text style={styles.text}>
                        • Milestono.com reserves the right to update this policy as needed. Changes will be communicated via email
                        or notifications.{"\n"}• Continued use of the platform constitutes acceptance of the revised policy.{"\n\n"}
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>6. Legal Compliance</Text>
                    <Text style={styles.subsectionTitle}>6.1 Governing Law</Text>
                    <Text style={styles.text}>
                        • This policy complies with the laws of India and is subject to jurisdiction in Solapur.{"\n\n"}
                    </Text>
                    <Text style={styles.subsectionTitle}>6.2 Contact Information</Text>
                    <Text style={styles.text}>For inquiries or concerns, users may contact:{"\n"}• Phone Number:</Text>
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

export default RefundPolicy
