"use client"

import type React from "react"
import { useState } from "react"
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, StatusBar, ActivityIndicator } from "react-native"
import { WebView } from "react-native-webview"
import { LinearGradient } from "expo-linear-gradient"
import { Ionicons } from "@expo/vector-icons"
import { goBack } from "expo-router/build/global-state/routing"

const { width, height } = Dimensions.get("window")

interface ViewAboutVideoPageProps {
    navigation?: any
}

const ViewAboutVideoPage: React.FC<ViewAboutVideoPageProps> = ({ navigation }) => {
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)

    const videoUrl = "https://www.youtube.com/embed/QyF0oGxdG80?si=q2_PHs5qza8PFSGV"

    const handleLoadStart = () => {
        setLoading(true)
        setError(false)
    }

    const handleLoadEnd = () => {
        setLoading(false)
    }

    const handleError = () => {
        setLoading(false)
        setError(true)
    }

    const retryLoad = () => {
        setError(false)
        setLoading(true)
    }

    const statusBarHeight = StatusBar.currentHeight || 0

    return (
        <View style={[styles.container,]}>
            {/* Header */}
            <LinearGradient colors={["#667eea", "#764ba2"]} style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={goBack}>
                    <Ionicons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>
                <View style={styles.headerContent}>
                    <Text style={styles.headerTitle}>About Milestono</Text>
                    <Text style={styles.headerSubtitle}>Company Overview Video</Text>
                </View>
            </LinearGradient>

            {/* Video Section */}
            <View style={styles.videoContainer}>
                <View style={styles.videoWrapper}>
                    <Text style={styles.videoTitle}>Discover Our Journey</Text>
                    <Text style={styles.videoDescription}>
                        Learn about Milestono's mission, values, and commitment to revolutionizing the real estate industry through
                        innovation and exceptional service.
                    </Text>

                    <View style={styles.webViewContainer}>
                        {loading && (
                            <View style={styles.loadingContainer}>
                                <ActivityIndicator size="large" color="#667eea" />
                                <Text style={styles.loadingText}>Loading video...</Text>
                            </View>
                        )}

                        {error ? (
                            <View style={styles.errorContainer}>
                                <Ionicons name="alert-circle-outline" size={48} color="#e53e3e" />
                                <Text style={styles.errorTitle}>Unable to load video</Text>
                                <Text style={styles.errorText}>Please check your internet connection and try again.</Text>
                                <TouchableOpacity style={styles.retryButton} onPress={retryLoad}>
                                    <Text style={styles.retryButtonText}>Retry</Text>
                                </TouchableOpacity>
                            </View>
                        ) : (
                            <WebView
                                source={{ uri: videoUrl }}
                                style={styles.webView}
                                onLoadStart={handleLoadStart}
                                onLoadEnd={handleLoadEnd}
                                onError={handleError}
                                allowsFullscreenVideo={true}
                                mediaPlaybackRequiresUserAction={false}
                                javaScriptEnabled={true}
                                domStorageEnabled={true}
                                startInLoadingState={false}
                                scalesPageToFit={true}
                                mixedContentMode="compatibility"
                                allowsInlineMediaPlayback={true}
                            />
                        )}
                    </View>
                </View>
            </View>

            {/* Bottom Info Section */}
            <View style={styles.bottomSection}>
                <View style={styles.infoCard}>
                    <Ionicons name="information-circle-outline" size={24} color="#667eea" />
                    <View style={styles.infoContent}>
                        <Text style={styles.infoTitle}>About This Video</Text>
                        <Text style={styles.infoText}>
                            This video provides comprehensive insights into Milestono's approach to real estate, our core values, and
                            how we're transforming the property market experience.
                        </Text>
                    </View>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f8f9fa",
    },
    header: {
        paddingTop: StatusBar.currentHeight || 0,
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
    videoContainer: {
        flex: 1,
        padding: 20,
    },
    videoWrapper: {
        flex: 1,
    },
    videoTitle: {
        fontSize: 22,
        fontWeight: "bold",
        color: "#2d3748",
        textAlign: "center",
        marginBottom: 8,
    },
    videoDescription: {
        fontSize: 14,
        color: "#4a5568",
        textAlign: "center",
        lineHeight: 20,
        marginBottom: 20,
        paddingHorizontal: 10,
    },
    webViewContainer: {
        backgroundColor: "white",
        borderRadius: 12,
        overflow: "hidden",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
        minHeight: 250,
    },
    webView: {
        flex: 1,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "white",
    },
    loadingText: {
        marginTop: 12,
        fontSize: 16,
        color: "#4a5568",
    },
    errorContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "white",
        padding: 20,
    },
    errorTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#2d3748",
        marginTop: 12,
        marginBottom: 8,
    },
    errorText: {
        fontSize: 14,
        color: "#4a5568",
        textAlign: "center",
        lineHeight: 20,
        marginBottom: 20,
    },
    retryButton: {
        backgroundColor: "#667eea",
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
    },
    retryButtonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "600",
    },
    bottomSection: {
        padding: 20,
        paddingTop: 0,
    },
    infoCard: {
        backgroundColor: "white",
        padding: 16,
        borderRadius: 12,
        flexDirection: "row",
        alignItems: "flex-start",
        marginBottom: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    infoContent: {
        flex: 1,
        marginLeft: 12,
    },
    infoTitle: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#2d3748",
        marginBottom: 4,
    },
    infoText: {
        fontSize: 14,
        color: "#4a5568",
        lineHeight: 18,
    },
    contactButton: {
        borderRadius: 12,
        overflow: "hidden",
    },
    contactButtonGradient: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 16,
        gap: 8,
    },
    contactButtonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "600",
    },
})

export default ViewAboutVideoPage
