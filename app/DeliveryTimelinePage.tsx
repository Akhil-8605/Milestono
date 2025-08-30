import type React from "react"
import { View, Text, ScrollView, StyleSheet , StatusBar} from "react-native"

const DeliveryTimeline: React.FC = () => {
    const statusBarHeight = StatusBar.currentHeight || 0;
    return (
        <ScrollView style={[styles.container, { marginTop: statusBarHeight }]}>
            <View style={styles.content}>
                <View style={styles.header}>
                    <Text style={styles.title}>Delivery Timeline</Text>
                    <Text style={styles.lastUpdated}>Last updated 1 January, 2025</Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Service Vendor Shipping Time Policy</Text>

                    <Text style={styles.subsectionTitle}>Introduction</Text>
                    <Text style={styles.text}>
                        This policy outlines the service delivery expectations for vendors registered on our platform. It ensures
                        transparency and accountability in fulfilling user service requests within the stipulated timeline.
                    </Text>

                    <Text style={styles.subsectionTitle}>Delivery Timeline</Text>
                    <Text style={styles.text}>
                        • <Text style={styles.bold}>Standard Delivery Window:</Text> Service vendors are expected to fulfill
                        requests within 4 hours to 48 hours of assignment.
                    </Text>

                    <Text style={styles.subsectionTitle}>Key Points</Text>
                    <Text style={styles.text}>
                        • <Text style={styles.bold}>Initial Confirmation:</Text>
                        {"\n"}• Vendors must confirm their availability for the service request immediately upon assignment.{"\n"}•
                        Estimated delivery time must be communicated to the admin.
                        {"\n\n"}• <Text style={styles.bold}>Service Fulfillment:</Text>
                        {"\n"}• All service requests should be initiated within 4 hours of confirmation.{"\n"}• Completion of
                        service should not exceed 48 hours unless explicitly approved by the admin.{"\n\n"}•{" "}
                        <Text style={styles.bold}>Communication:</Text>
                        {"\n"}• Vendors must update the admin on the progress of the service.
                        {"\n"}• Delays or unforeseen issues should be reported promptly to arrange alternatives.
                    </Text>

                    <Text style={styles.subsectionTitle}>Responsibilities of Vendors</Text>
                    <Text style={styles.text}>
                        • <Text style={styles.bold}>Punctuality:</Text> Adhere to the assigned delivery timeline.{"\n"}•{" "}
                        <Text style={styles.bold}>Transparency:</Text> Provide accurate updates regarding service progress.{"\n"}•{" "}
                        <Text style={styles.bold}>Accountability:</Text> Ensure high-quality service delivery within the agreed time
                        frame.
                    </Text>

                    <Text style={styles.subsectionTitle}>Admin Oversight</Text>
                    <Text style={styles.text}>
                        • The admin reserves the right to reassign service requests if vendors fail to confirm availability or meet
                        the delivery deadlines.{"\n"}• Performance of vendors will be periodically reviewed based on adherence to
                        the shipping policy.
                    </Text>

                    <Text style={styles.subsectionTitle}>Consequences of Non-Compliance</Text>
                    <Text style={styles.text}>
                        • <Text style={styles.bold}>First Instance:</Text> Warning issued to the vendor.
                        {"\n"}• <Text style={styles.bold}>Repeated Instances:</Text> Temporary suspension or permanent removal from
                        the platform.
                    </Text>

                    <Text style={styles.subsectionTitle}>Contact for Queries</Text>
                    <Text style={styles.text}>
                        • If vendors have questions or concerns about this shipping policy, they may contact:{"\n"}•{" "}
                        <Text style={styles.bold}>Support Email:</Text>
                        {"\n"}• <Text style={styles.bold}>Support Phone:</Text> info@milestono.in
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
        marginTop: 16,
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

export default DeliveryTimeline
