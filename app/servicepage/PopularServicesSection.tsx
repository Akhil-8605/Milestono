"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Dimensions, Modal, Pressable } from "react-native"
import { Feather } from "@expo/vector-icons"
import * as Haptics from "expo-haptics"
import { LinearGradient } from "expo-linear-gradient"
import Animated, {
    useAnimatedStyle,
    interpolate,
    Extrapolate,
    useSharedValue,
    withTiming,
    withDelay,
} from "react-native-reanimated"
import { BlurView } from "expo-blur"

const { width } = Dimensions.get("window")

interface SuggestionCard {
    title: string
    description: string
    icon: string
    color: string
    detailedDescription?: string
}

interface PopularServicesSectionProps {
    fadeIn?: Animated.SharedValue<number>
    cardAnimValues?: Animated.SharedValue<number>[]
}

const PopularServicesSection: React.FC<PopularServicesSectionProps> = ({
    fadeIn: externalFadeIn,
    cardAnimValues: externalCardAnimValues,
}) => {
    const [selectedService, setSelectedService] = useState<SuggestionCard | null>(null)
    const [modalVisible, setModalVisible] = useState(false)

    const internalFadeIn = useSharedValue(0)
    const internalCardAnimValues = [useSharedValue(50), useSharedValue(50), useSharedValue(50)]

    const fadeIn = externalFadeIn || internalFadeIn
    const cardAnimValues = externalCardAnimValues || internalCardAnimValues

    useEffect(() => {
        if (!externalFadeIn) {
            internalFadeIn.value = withTiming(1, { duration: 800 })
        }
        if (!externalCardAnimValues) {
            internalCardAnimValues.forEach((value, index) => {
                value.value = withDelay(index * 100, withTiming(0, { duration: 600 }))
            })
        }
    }, [])

    const suggestionCards: SuggestionCard[] = [
        {
            title: "Home Service",
            description: "Professional home maintenance and repair services",
            icon: "home",
            color: "#10b981",
            detailedDescription:
                "Milestono provides comprehensive home service solutions including plumbing, electrical work, HVAC maintenance, and general repairs. Our certified professionals ensure your home stays in perfect condition with 24/7 support and guaranteed quality workmanship.",
        },
        {
            title: "Appliance Repair",
            description: "Expert repair for all household appliances",
            icon: "settings",
            color: "#8b5cf6",
            detailedDescription:
                "Milestono offers expert appliance repair services for all major brands and models. From refrigerators and washing machines to dishwashers and ovens, our skilled technicians provide fast, reliable repairs with genuine parts and comprehensive warranties.",
        },
        {
            title: "Emergency Service",
            description: "24/7 emergency repair and maintenance",
            icon: "alert-circle",
            color: "#ec4899",
            detailedDescription:
                "Milestono provides round-the-clock emergency services for urgent repairs and maintenance issues. Our rapid response team is available 24/7 to handle plumbing emergencies, electrical failures, heating/cooling issues, and other critical home problems.",
        },
    ]

    const cardAnimStyle0 = useAnimatedStyle(() => {
        return {
            transform: [
                {
                    translateY: cardAnimValues[0]?.value || 0,
                },
                {
                    scale: interpolate(fadeIn.value, [0, 1], [0.95, 1], Extrapolate.CLAMP),
                },
            ],
        }
    })

    const cardAnimStyle1 = useAnimatedStyle(() => {
        return {
            transform: [
                {
                    translateY: cardAnimValues[1]?.value || 0,
                },
                {
                    scale: interpolate(fadeIn.value, [0, 1], [0.95, 1], Extrapolate.CLAMP),
                },
            ],
        }
    })

    const cardAnimStyle2 = useAnimatedStyle(() => {
        return {
            transform: [
                {
                    translateY: cardAnimValues[2]?.value || 0,
                },
                {
                    scale: interpolate(fadeIn.value, [0, 1], [0.95, 1], Extrapolate.CLAMP),
                },
            ],
        }
    })

    const cardAnimStyles = [cardAnimStyle0, cardAnimStyle1, cardAnimStyle2]

    const lightenColor = (color: string, percent: number): string => {
        const num = Number.parseInt(color.replace("#", ""), 16)
        const amt = Math.round(2.55 * percent)
        const R = (num >> 16) + amt
        const G = ((num >> 8) & 0x00ff) + amt
        const B = (num & 0x0000ff) + amt
        return (
            "#" +
            (
                0x1000000 +
                (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
                (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
                (B < 255 ? (B < 1 ? 0 : B) : 255)
            )
                .toString(16)
                .slice(1)
        )
    }

    const darkenColor = (color: string, percent: number): string => {
        const num = Number.parseInt(color.replace("#", ""), 16)
        const amt = Math.round(2.55 * percent)
        const R = (num >> 16) - amt
        const G = ((num >> 8) & 0x00ff) - amt
        const B = (num & 0x0000ff) - amt
        return (
            "#" +
            (
                0x1000000 +
                (R > 255 ? 255 : R < 0 ? 0 : R) * 0x10000 +
                (G > 255 ? 255 : G < 0 ? 0 : G) * 0x100 +
                (B > 255 ? 255 : B < 0 ? 0 : B)
            )
                .toString(16)
                .slice(1)
        )
    }

    const handleViewDetails = (card: SuggestionCard) => {
        setSelectedService(card)
        setModalVisible(true)
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    }

    const closeModal = () => {
        setModalVisible(false)
        setSelectedService(null)
    }

    return (
        <>
            <View style={styles.suggestionsContainer}>
                <View style={styles.suggestionsHeader}>
                    <Text style={styles.suggestionsTitle}>Popular Services</Text>
                    <View style={styles.badge}>
                        <Text style={styles.badgeText}>Recommended</Text>
                    </View>
                </View>

                <ScrollView
                    horizontal={width < 768}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.cardsContainer}
                >
                    {suggestionCards.map((card, index) => {
                        return (
                            <Animated.View key={index} style={[styles.card, cardAnimStyles[index]]}>
                                <LinearGradient
                                    colors={[card.color, darkenColor(card.color, 10)]}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                    style={styles.cardAccent}
                                />
                                <View style={styles.cardContent}>
                                    <View style={styles.cardTitleContainer}>
                                        <View style={styles.cardTitleWithIcon}>
                                            <View
                                                style={[
                                                    styles.cardIconContainer,
                                                    {
                                                        backgroundColor: lightenColor(card.color, 40),
                                                    },
                                                ]}
                                            >
                                                <Feather name={card.icon as any} size={16} color={card.color} />
                                            </View>
                                            <Text style={styles.cardTitle}>{card.title}</Text>
                                        </View>
                                        <Feather name="chevron-right" size={16} color={card.color} />
                                    </View>
                                    <Text style={styles.cardDescription}>{card.description}</Text>
                                    <TouchableOpacity
                                        style={[styles.detailsButton, { borderColor: lightenColor(card.color, 30) }]}
                                        activeOpacity={0.7}
                                        onPress={() => handleViewDetails(card)}
                                    >
                                        <Text style={[styles.detailsButtonText, { color: card.color }]}>View Details</Text>
                                        <Feather name="arrow-right" size={12} color={card.color} />
                                    </TouchableOpacity>
                                </View>
                            </Animated.View>
                        )
                    })}
                </ScrollView>
            </View>

            {/* Service Details Modal */}
            <Modal animationType="fade" transparent={true} visible={modalVisible} onRequestClose={closeModal}>
                <Pressable style={styles.modalOverlay} onPress={closeModal}>
                    <BlurView intensity={20} style={styles.modalOverlay}>
                        <Pressable style={styles.modalContent} onPress={(e) => e.stopPropagation()}>
                            <View style={styles.modalHeader}>
                                <View style={styles.modalTitleContainer}>
                                    {selectedService && (
                                        <View
                                            style={[styles.modalIconContainer, { backgroundColor: lightenColor(selectedService.color, 40) }]}
                                        >
                                            <Feather name={selectedService.icon as any} size={24} color={selectedService.color} />
                                        </View>
                                    )}
                                    <Text style={styles.modalTitle}>{selectedService?.title}</Text>
                                </View>
                                <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
                                    <Feather name="x" size={24} color="#666" />
                                </TouchableOpacity>
                            </View>

                            <View style={styles.modalBody}>
                                <Text style={styles.modalDescription}>{selectedService?.detailedDescription}</Text>

                                <View style={styles.modalFeatures}>
                                    <Text style={styles.featuresTitle}>What's Included:</Text>
                                    <View style={styles.featureItem}>
                                        <Feather name="check-circle" size={16} color="#10b981" />
                                        <Text style={styles.featureText}>Professional certified technicians</Text>
                                    </View>
                                    <View style={styles.featureItem}>
                                        <Feather name="check-circle" size={16} color="#10b981" />
                                        <Text style={styles.featureText}>Quality guarantee on all work</Text>
                                    </View>
                                    <View style={styles.featureItem}>
                                        <Feather name="check-circle" size={16} color="#10b981" />
                                        <Text style={styles.featureText}>Transparent pricing with no hidden fees</Text>
                                    </View>
                                    <View style={styles.featureItem}>
                                        <Feather name="check-circle" size={16} color="#10b981" />
                                        <Text style={styles.featureText}>24/7 customer support</Text>
                                    </View>
                                </View>
                            </View>

                            <TouchableOpacity
                                style={[styles.modalButton, { backgroundColor: selectedService?.color }]}
                                onPress={closeModal}
                            >
                                <Text style={styles.modalButtonText}>Request This Service</Text>
                            </TouchableOpacity>
                        </Pressable>
                    </BlurView>
                </Pressable>
            </Modal>
        </>
    )
}

const styles = StyleSheet.create({
    suggestionsContainer: {
        marginBottom: 32,
    },
    suggestionsHeader: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 20,
    },
    suggestionsTitle: {
        fontSize: 20,
        fontWeight: "700",
        color: "#1f2937",
    },
    badge: {
        backgroundColor: "#dbeafe",
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
    },
    badgeText: {
        fontSize: 12,
        fontWeight: "600",
        color: "#1d4ed8",
    },
    cardsContainer: {
        paddingRight: width < 768 ? 20 : 0,
        gap: 16,
        flexDirection: width < 768 ? "row" : "column",
    },
    card: {
        backgroundColor: "#ffffff",
        borderRadius: 16,
        padding: 20,
        marginBottom: width < 768 ? 0 : 16,
        width: width < 768 ? 280 : "100%",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
        borderWidth: 1,
        borderColor: "#f3f4f6",
        position: "relative",
        overflow: "hidden",
    },
    cardAccent: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: 4,
    },
    cardContent: {
        flex: 1,
    },
    cardTitleContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 8,
    },
    cardTitleWithIcon: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
    },
    cardIconContainer: {
        width: 32,
        height: 32,
        borderRadius: 8,
        alignItems: "center",
        justifyContent: "center",
        marginRight: 12,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: "600",
        color: "#1f2937",
        flex: 1,
    },
    cardDescription: {
        fontSize: 14,
        color: "#6b7280",
        lineHeight: 20,
        marginBottom: 16,
    },
    detailsButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 8,
        borderWidth: 1,
        gap: 6,
    },
    detailsButtonText: {
        fontSize: 14,
        fontWeight: "600",
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    modalContent: {
        backgroundColor: "#ffffff",
        borderRadius: 20,
        padding: 24,
        width: "100%",
        maxWidth: 400,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 10,
        },
        shadowOpacity: 0.25,
        shadowRadius: 20,
        elevation: 10,
    },
    modalHeader: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 20,
    },
    modalTitleContainer: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
    },
    modalIconContainer: {
        width: 48,
        height: 48,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
        marginRight: 16,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: "700",
        color: "#1f2937",
        flex: 1,
    },
    closeButton: {
        padding: 8,
    },
    modalBody: {
        marginBottom: 24,
    },
    modalDescription: {
        fontSize: 16,
        color: "#4b5563",
        lineHeight: 24,
        marginBottom: 20,
    },
    modalFeatures: {
        gap: 12,
    },
    featuresTitle: {
        fontSize: 16,
        fontWeight: "600",
        color: "#1f2937",
        marginBottom: 8,
    },
    featureItem: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },
    featureText: {
        fontSize: 14,
        color: "#6b7280",
        flex: 1,
    },
    modalButton: {
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: "center",
    },
    modalButtonText: {
        fontSize: 16,
        fontWeight: "600",
        color: "#ffffff",
    },
})

export default PopularServicesSection
