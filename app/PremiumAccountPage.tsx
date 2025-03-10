import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Dimensions,
  SafeAreaView,
  Easing,
  Platform,
  StatusBar,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Modal,
  TouchableWithoutFeedback,
} from "react-native";
import { SvgXml } from "react-native-svg";
import { BlurView } from "expo-blur";

const { width, height } = Dimensions.get("window");

interface Plan {
  name: string;
  price: number;
  ogprice: number;
  period: string;
  pricePerMonth: string;
  subtitle: string;
  color: "basic" | "silver" | "gold";
  responseText: string;
  features: string[];
  benefits: string[];
}

const PLANS: { [key: string]: Plan } = {
  basic: {
    name: "Basic",
    price: 3489,
    ogprice: 1459,
    period: "Monthly",
    pricePerMonth:
      "₹2,000–₹3,500 per month (or ₹22,000–₹42,000 annually with discounts)",
    subtitle: "Entry Level",
    color: "basic",
    responseText: "Start your journey",
    features: [
      "15-30 property listings",
      "Basic visibility",
      "Standard leads access",
    ],
    benefits: [
      "Limited listing slots (15-30 properties)",
      "Basic visibility",
      "Access to standard leads only",
    ],
  },
  silver: {
    name: "Silver",
    price: 7489,
    ogprice: 5479,
    period: "Monthly",
    pricePerMonth:
      "₹5,000–₹7,500 per month (or ₹50,000–₹75,000 annually with discounts)",
    subtitle: "Professional",
    color: "silver",
    responseText: "Enhanced visibility & leads",
    features: [
      "32-78 property listings",
      "Verified dealer/agent tag",
      "Call tracking (15 calls/month)",
    ],
    benefits: [
      "32-78 property listing slots",
      "Verified dealer/agent tag",
      "Basic performance analytics (views and inquiries)",
      "Access to detailed lead information",
      "Visibility boost for up to 6 properties",
      "Call tracking (15 calls per month): Agents can view interested users' contact details, including phone numbers and email addresses.",
    ],
  },
  gold: {
    name: "Gold",
    price: 11489,
    ogprice: 8459,
    period: "Monthly",
    pricePerMonth:
      "₹12,000–₹15,000 per month (or ₹1,20,000–₹1,50,000 annually).",
    subtitle: "Enterprise",
    color: "gold",
    responseText: "Maximum exposure & features",
    features: [
      "Unlimited property listings",
      "High visibility in search",
      "Advanced analytics",
      "Bulk upload feature",
      "Multi-location support",
    ],
    benefits: [
      "Unlimited property listings",
      "High visibility in search results",
      "Advanced performance analytics and reporting",
      "Bulk upload feature <br/>How it works: Dealers can use an Excel template or similar format provided by the platform to upload multiple property details (location, price, size, etc.) all at once",
      "Sponsored listings for 10 days per month",
      "Video and virtual tour uploads for all properties",
      "Multi-location listing support",
      "Priority lead access and support",
    ],
  },
};

const checkmarkSvg = `
<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M9 16.17L4.83 12L3.41 13.41L9 19L21 7L19.59 5.59L9 16.17Z" fill="currentColor"/>
</svg>
`;

const patternSvg = `
<svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M10 10L90 90M30 10L90 70M50 10L90 50M70 10L90 30M10 30L70 90M10 50L50 90M10 70L30 90" stroke="currentColor" strokeWidth="0.5" strokeLinecap="round"/>
</svg>
`;

// New crown icon for premium features
const crownSvg = `
<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="currentColor"/>
</svg>
`;

// New shield icon for security features
const shieldSvg = `
<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M12 1L3 5V11C3 16.55 6.84 21.74 12 23C17.16 21.74 21 16.55 21 11V5L12 1ZM12 11.99H19C18.47 16.11 15.72 19.78 12 20.93V12H5V6.3L12 3.19V11.99Z" fill="currentColor"/>
</svg>
`;

const PricingPage: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<"monthly" | "yearly">(
    "monthly"
  );
  const [activePlanIndex, setActivePlanIndex] = useState<number>(0); // Default to Basic plan
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const scrollX = useRef(new Animated.Value(0)).current;
  const scrollViewRef = useRef<ScrollView | null>(null);
  const planKeys = Object.keys(PLANS);

  // Modal animation values
  const modalSlideAnim = useRef(new Animated.Value(height)).current;
  const modalBackdropAnim = useRef(new Animated.Value(0)).current;

  // Animation values
  const headerAnimation = useRef(new Animated.Value(0)).current;
  const cardAnims = useRef<Animated.Value[]>(
    planKeys.map(() => new Animated.Value(0))
  ).current;

  // FIX: Initialize feature animations per plan using each plan's own features array.
  const featureAnimations = useRef(
    planKeys.map((planKey) =>
      PLANS[planKey].features.map(() => new Animated.Value(0))
    )
  ).current;

  // Parallax effect for background
  const backgroundTranslateX = scrollX.interpolate({
    inputRange: [0, width * planKeys.length],
    outputRange: [0, -width * 0.2],
    extrapolate: "clamp",
  });

  useEffect(() => {
    // Animate header
    Animated.timing(headerAnimation, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
      easing: Easing.out(Easing.cubic),
    }).start();

    // Animate cards sequentially
    const animations = cardAnims.map((anim, index) =>
      Animated.timing(anim, {
        toValue: 1,
        duration: 600,
        delay: 200 + 150 * index,
        useNativeDriver: true,
        easing: Easing.out(Easing.back(1.5)),
      })
    );
    Animated.stagger(150, animations).start();

    // Animate features with staggered delay for each plan
    planKeys.forEach((_, planIndex) => {
      const featureAnims = featureAnimations[planIndex];
      const anims = featureAnims.map((anim, idx) =>
        Animated.timing(anim, {
          toValue: 1,
          duration: 400,
          delay: 800 + 100 * idx,
          useNativeDriver: true,
          easing: Easing.out(Easing.cubic),
        })
      );
      Animated.stagger(80, anims).start();
    });

    // Scroll to the active plan after a short delay
    setTimeout(() => {
      scrollViewRef.current?.scrollTo({
        x: activePlanIndex * (width * 0.8 + 20),
        animated: true,
      });
    }, 500);
  }, [
    activePlanIndex,
    cardAnims,
    featureAnimations,
    headerAnimation,
    planKeys,
    scrollX,
  ]);

  useEffect(() => {
    const autoScrollInterval = setInterval(() => {
      setActivePlanIndex((prevIndex) => {
        const newIndex = (prevIndex + 1) % planKeys.length;
        scrollViewRef.current?.scrollTo({
          x: newIndex * (width * 0.8 + 20),
          animated: true,
        });
        return newIndex;
      });
    }, 10000);

    return () => clearInterval(autoScrollInterval);
  }, [planKeys.length]);

  const getCardColor = (color: string) => {
    switch (color) {
      case "basic":
        return {
          bg: "#f0f9ff",
          header: "#0c4a6e",
          accent: "#0ea5e9",
          border: "#e0f2fe",
          gradient: ["#f0f9ff", "#e0f2fe"],
          pattern: "rgba(14, 165, 233, 0.05)",
          modalBg: "#f0f9ff",
          modalHeader: "#0284c7",
        };
      case "silver":
        return {
          bg: "#f5f3ff",
          header: "#5b21b6",
          accent: "#8b5cf6",
          border: "#ede9fe",
          gradient: ["#f5f3ff", "#ede9fe"],
          pattern: "rgba(139, 92, 246, 0.05)",
          modalBg: "#f5f3ff",
          modalHeader: "#7c3aed",
        };
      case "gold":
        return {
          bg: "#fffbeb",
          header: "#92400e",
          accent: "#f59e0b",
          border: "#fef3c7",
          gradient: ["#fffbeb", "#fef3c7"],
          pattern: "rgba(245, 158, 11, 0.05)",
          modalBg: "#fffbeb",
          modalHeader: "#d97706",
        };
      default:
        return {
          bg: "#f0f9ff",
          header: "#0c4a6e",
          accent: "#0ea5e9",
          border: "#e0f2fe",
          gradient: ["#f0f9ff", "#e0f2fe"],
          pattern: "rgba(14, 165, 233, 0.05)",
          modalBg: "#f0f9ff",
          modalHeader: "#0284c7",
        };
    }
  };

  const buttonScale = useRef(new Animated.Value(1)).current;
  const buyNowScale = useRef(new Animated.Value(1)).current;

  const handlePressIn = (buttonRef: Animated.Value) => {
    Animated.spring(buttonRef, {
      toValue: 0.95,
      friction: 5,
      tension: 300,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = (buttonRef: Animated.Value) => {
    Animated.spring(buttonRef, {
      toValue: 1,
      friction: 3,
      tension: 400,
      useNativeDriver: true,
    }).start();
  };

  const openModal = (plan: string) => {
    setSelectedPlan(plan);
    setModalVisible(true);

    // Reset the animation values
    modalSlideAnim.setValue(height);
    modalBackdropAnim.setValue(0);

    // Animate the modal in
    Animated.parallel([
      Animated.timing(modalBackdropAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }),
      Animated.spring(modalSlideAnim, {
        toValue: 0,
        friction: 8,
        tension: 65,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const closeModal = () => {
    // Animate the modal out
    Animated.parallel([
      Animated.timing(modalBackdropAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
        easing: Easing.in(Easing.cubic),
      }),
      Animated.timing(modalSlideAnim, {
        toValue: height,
        duration: 300,
        useNativeDriver: true,
        easing: Easing.in(Easing.cubic),
      }),
    ]).start(() => {
      setModalVisible(false);
      setSelectedPlan(null);
    });
  };

  const renderPricingCard = (plan: string, index: number) => {
    const planData = PLANS[plan];
    const colors = getCardColor(planData.color);

    const inputRange = [
      (index - 1) * width * 0.8,
      index * width * 0.8,
      (index + 1) * width * 0.8,
    ];

    const scale = scrollX.interpolate({
      inputRange,
      outputRange: [0.9, 1, 0.9],
      extrapolate: "clamp",
    });

    const opacity = scrollX.interpolate({
      inputRange,
      outputRange: [0.7, 1, 0.7],
      extrapolate: "clamp",
    });

    const translateY = scrollX.interpolate({
      inputRange,
      outputRange: [10, 0, 10],
      extrapolate: "clamp",
    });

    const animatedStyle = {
      opacity: cardAnims[index],
      transform: [
        {
          translateY: cardAnims[index].interpolate({
            inputRange: [0, 1],
            outputRange: [100, 0],
          }),
        },
        { scale },
      ],
    };

    const rotate = scrollX.interpolate({
      inputRange,
      outputRange: ["0deg", "0deg", "0deg"],
      extrapolate: "clamp",
    });

    return (
      <Animated.View
        key={plan}
        style={[
          styles.card,
          {
            backgroundColor: colors.bg,
            borderColor: colors.border,
            marginLeft: index === 0 ? 20 : 10,
            marginRight: index === planKeys.length - 1 ? 20 : 10,
            width: width * 0.82,
            transform: [...animatedStyle.transform, { translateY }, { rotate }],
            opacity: Animated.multiply(animatedStyle.opacity, opacity),
          },
        ]}
      >
        {/* Background pattern */}
        <View style={styles.patternContainer}>
          <SvgXml
            xml={patternSvg}
            width={width * 0.8}
            height="100%"
            color={colors.pattern}
            style={styles.patternSvg}
          />
        </View>

        {/* Popular tag for Silver plan */}
        {plan === "silver" && (
          <View style={[styles.popularTag, { backgroundColor: colors.accent }]}>
            <Text style={styles.popularTagText}>POPULAR</Text>
          </View>
        )}

        <View style={styles.cardHeader}>
          <Text style={[styles.planName, { color: colors.header }]}>
            {planData.name}
          </Text>
          <Text style={[styles.planSubtitle, { color: colors.header }]}>
            {planData.subtitle}
          </Text>
        </View>

        <Text style={[styles.responseText, { color: colors.accent }]}>
          {planData.responseText}
        </Text>

        <View style={styles.featuresContainer}>
          {planData.features.map((feature, idx) => (
            <Animated.View
              key={idx}
              style={[
                styles.featureRow,
                {
                  opacity: featureAnimations[index][idx],
                  transform: [
                    {
                      translateX: featureAnimations[index][idx].interpolate({
                        inputRange: [0, 1],
                        outputRange: [-20, 0],
                      }),
                    },
                  ],
                },
              ]}
            >
              <SvgXml
                xml={checkmarkSvg}
                width={20}
                height={20}
                color={colors.accent}
                style={styles.checkmark}
              />
              <Text style={styles.featureText}>{feature}</Text>
            </Animated.View>
          ))}
        </View>

        <View style={styles.pricingContainer}>
          <View
            style={[styles.periodSelector, { backgroundColor: colors.border }]}
          >
            <TouchableOpacity
              style={[
                styles.periodOption,
                selectedPeriod === "monthly" && {
                  backgroundColor: colors.accent,
                  borderRadius: 20,
                },
              ]}
              onPress={() => setSelectedPeriod("monthly")}
            >
              <Text
                style={[
                  styles.periodText,
                  selectedPeriod === "monthly" && { color: "white" },
                ]}
              >
                Monthly
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.periodOption,
                selectedPeriod === "yearly" && {
                  backgroundColor: colors.accent,
                  borderRadius: 20,
                },
              ]}
              onPress={() => setSelectedPeriod("yearly")}
            >
              <Text
                style={[
                  styles.periodText,
                  selectedPeriod === "yearly" && { color: "white" },
                ]}
              >
                Yearly
                <Text style={styles.savingsText}> (Save 20%)</Text>
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.priceDisplay}>
            {selectedPeriod === "yearly" && (
              <Text style={styles.originalPrice}>
                ₹
                {(planData.price * 12)
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
              </Text>
            )}
            <Text style={styles.currencySymbol}>₹</Text>
            <Text style={styles.priceAmount}>
              {selectedPeriod === "monthly"
                ? planData.price
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                : Math.round(planData.price * 12 * 0.8)
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
            </Text>
            <Text style={styles.periodLabel}>
              /{selectedPeriod === "monthly" ? "mo" : "yr"}
            </Text>
          </View>

          <Text style={styles.priceSubtext}>{planData.pricePerMonth}</Text>

          <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
            <TouchableOpacity
              style={[styles.ctaButton, { backgroundColor: colors.accent }]}
              onPressIn={() => handlePressIn(buttonScale)}
              onPressOut={() => handlePressOut(buttonScale)}
              activeOpacity={0.9}
              onPress={() => openModal(plan)}
            >
              <Text style={styles.ctaButtonText}>Get Started</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Animated.View>
    );
  };

  const renderModal = () => {
    if (!selectedPlan) return null;

    const planData = PLANS[selectedPlan];
    const colors = getCardColor(planData.color);

    return (
      <Modal
        transparent={true}
        visible={modalVisible}
        animationType="none"
        onRequestClose={closeModal}
      >
        <TouchableWithoutFeedback onPress={closeModal}>
          <Animated.View
            style={[styles.modalOverlay, { opacity: modalBackdropAnim }]}
          >
            <TouchableWithoutFeedback>
              <Animated.View
                style={[
                  styles.modalContainer,
                  {
                    transform: [{ translateY: modalSlideAnim }],
                    backgroundColor: colors.modalBg,
                    borderColor: colors.border,
                  },
                ]}
              >
                {/* Modal Header */}
                <View
                  style={[
                    styles.modalHeader,
                    { backgroundColor: colors.modalHeader },
                  ]}
                >
                  <Text style={styles.modalTitle}>
                    {planData.name} Plan Details
                  </Text>
                  <TouchableOpacity
                    onPress={closeModal}
                    style={styles.closeButton}
                  >
                    <Text style={styles.closeButtonText}>×</Text>
                  </TouchableOpacity>
                </View>

                {/* Modal Content */}
                <ScrollView style={styles.modalContent}>
                  <View style={styles.modalSection}>
                    <Text style={styles.modalSectionTitle}>Plan Overview</Text>
                    <Text style={styles.modalDescription}>
                      The {planData.name} plan is designed for{" "}
                      {planData.subtitle.toLowerCase()} real estate
                      professionals who want to{" "}
                      {planData.responseText.toLowerCase()}.
                    </Text>
                  </View>

                  <View style={styles.modalPriceSection}>
                    <Text style={styles.modalPriceLabel}>
                      {selectedPeriod === "monthly"
                        ? "Monthly Price"
                        : "Annual Price (20% off)"}
                    </Text>
                    <View style={styles.modalPriceContainer}>
                      {selectedPeriod === "yearly" && (
                        <Text style={styles.modalOriginalPrice}>
                          ₹
                          {(planData.price * 12)
                            .toString()
                            .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                        </Text>
                      )}
                      <Text style={styles.modalCurrencySymbol}>₹</Text>
                      <Text style={styles.modalPriceAmount}>
                        {selectedPeriod === "monthly"
                          ? planData.price
                              .toString()
                              .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                          : Math.round(planData.price * 12 * 0.8)
                              .toString()
                              .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                      </Text>
                      <Text style={styles.modalPeriodLabel}>
                        /{selectedPeriod === "monthly" ? "mo" : "yr"}
                      </Text>
                    </View>
                    <Text style={styles.modalPriceSubtext}>
                      {planData.pricePerMonth}
                    </Text>
                  </View>

                  <View style={styles.modalSection}>
                    <Text style={styles.modalSectionTitle}>All Benefits</Text>
                    {planData.benefits.map((benefit, idx) => (
                      <View key={idx} style={styles.modalBenefitRow}>
                        <SvgXml
                          xml={
                            idx % 3 === 0
                              ? crownSvg
                              : idx % 2 === 0
                                ? shieldSvg
                                : checkmarkSvg
                          }
                          width={24}
                          height={24}
                          color={colors.accent}
                          style={styles.modalBenefitIcon}
                        />
                        <Text style={styles.modalBenefitText}>
                          {benefit.replace(/<br\/>.*?:/g, "\n")}
                        </Text>
                      </View>
                    ))}
                  </View>

                  <View style={styles.modalSection}>
                    <Text style={styles.modalSectionTitle}>
                      Billing Details
                    </Text>
                    <Text style={styles.modalBillingText}>
                      • You will be billed{" "}
                      {selectedPeriod === "monthly" ? "monthly" : "annually"}.
                    </Text>
                    <Text style={styles.modalBillingText}>
                      • Cancel anytime. No hidden fees.
                    </Text>
                    <Text style={styles.modalBillingText}>
                      • Automatic renewal unless canceled.
                    </Text>
                    <Text style={styles.modalBillingText}>
                      • 7-day money-back guarantee.
                    </Text>
                  </View>

                  <View style={styles.modalButtonContainer}>
                    <Animated.View
                      style={{
                        transform: [{ scale: buyNowScale }],
                        width: "100%",
                      }}
                    >
                      <TouchableOpacity
                        style={[
                          styles.buyNowButton,
                          { backgroundColor: colors.accent },
                        ]}
                        onPressIn={() => handlePressIn(buyNowScale)}
                        onPressOut={() => handlePressOut(buyNowScale)}
                        activeOpacity={0.9}
                      >
                        <Text style={styles.buyNowButtonText}>Buy Now</Text>
                      </TouchableOpacity>
                    </Animated.View>

                    <TouchableOpacity style={styles.termsButton}>
                      <Text
                        style={[
                          styles.termsButtonText,
                          { color: colors.accent },
                        ]}
                      >
                        Terms & Conditions
                      </Text>
                    </TouchableOpacity>
                  </View>
                </ScrollView>
              </Animated.View>
            </TouchableWithoutFeedback>
          </Animated.View>
        </TouchableWithoutFeedback>
      </Modal>
    );
  };

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    { useNativeDriver: false }
  );

  const handleScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const position = event.nativeEvent.contentOffset.x;
    const index = Math.round(position / (width * 0.8 + 20));
    setActivePlanIndex(index);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Animated background */}
      <Animated.View
        style={[
          styles.backgroundPattern,
          {
            transform: [{ translateX: backgroundTranslateX }],
          },
        ]}
      >
        <SvgXml
          xml={patternSvg}
          width={width * 2}
          height={height}
          color="rgba(0, 0, 0, 0.02)"
        />
      </Animated.View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <Animated.View
          style={[
            styles.header,
            {
              opacity: headerAnimation,
              transform: [
                {
                  translateY: headerAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-20, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <Text style={styles.headerTitle}>Premium Plans</Text>
          <Text style={styles.headerSubtitle}>
            Choose the perfect plan for your real estate business
          </Text>
        </Animated.View>

        <Animated.ScrollView
          ref={scrollViewRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollViewContent}
          decelerationRate="fast"
          snapToInterval={width * 0.8 + 20}
          snapToAlignment="center"
          onScroll={handleScroll}
          onMomentumScrollEnd={handleScrollEnd}
          scrollEventThrottle={16}
        >
          {planKeys.map((plan, index) => renderPricingCard(plan, index))}
        </Animated.ScrollView>

        <View style={styles.pagination}>
          {planKeys.map((plan, i) => {
            const dotOpacity = scrollX.interpolate({
              inputRange: [
                (i - 1) * width * 0.8,
                i * width * 0.8,
                (i + 1) * width * 0.8,
              ],
              outputRange: [0.3, 1, 0.3],
              extrapolate: "clamp",
            });

            const dotScale = scrollX.interpolate({
              inputRange: [
                (i - 1) * width * 0.8,
                i * width * 0.8,
                (i + 1) * width * 0.8,
              ],
              outputRange: [0.8, 1.4, 0.8],
              extrapolate: "clamp",
            });

            const colors = getCardColor(PLANS[plan].color);

            return (
              <TouchableOpacity
                key={i}
                onPress={() => {
                  scrollViewRef.current?.scrollTo({
                    x: i * (width * 0.8 + 20),
                    animated: true,
                  });
                }}
              >
                <Animated.View
                  style={[
                    styles.paginationDot,
                    {
                      opacity: dotOpacity,
                      transform: [{ scale: dotScale }],
                      backgroundColor: colors.accent,
                    },
                  ]}
                />
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Bottom gradient */}
        {Platform.OS === "ios" ? (
          <BlurView style={styles.bottomGradient} intensity={20} tint="light" />
        ) : (
          <View style={styles.bottomGradient} />
        )}
      </ScrollView>

      {/* Modal */}
      {renderModal()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  backgroundPattern: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.5,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#64748b",
    lineHeight: 22,
  },
  scrollViewContent: {
    paddingVertical: 20,
    paddingBottom: 40,
    paddingRight: 30,
  },
  card: {
    borderRadius: 24,
    padding: 24,
    marginVertical: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
    borderWidth: 1,
    overflow: "hidden",
  },
  patternContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.5,
    overflow: "hidden",
  },
  patternSvg: {
    position: "absolute",
    top: 0,
    left: 0,
  },
  popularTag: {
    position: "absolute",
    top: 16,
    right: -30,
    backgroundColor: "#8b5cf6",
    paddingHorizontal: 30,
    paddingVertical: 6,
    transform: [{ rotate: "45deg" }],
    zIndex: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  popularTagText: {
    color: "white",
    fontSize: 10,
    fontWeight: "bold",
    letterSpacing: 1,
  },
  cardHeader: {
    marginBottom: 15,
  },
  planName: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 2,
  },
  planSubtitle: {
    fontSize: 16,
    opacity: 0.8,
  },
  responseText: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 24,
  },
  featuresContainer: {
    marginBottom: 24,
  },
  featureRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  checkmark: {
    marginRight: 12,
  },
  featureText: {
    fontSize: 16,
    color: "#4b5563",
    flex: 1,
    lineHeight: 22,
  },
  pricingContainer: {
    marginTop: 10,
  },
  periodSelector: {
    flexDirection: "row",
    marginBottom: 20,
    alignSelf: "center",
    borderRadius: 24,
    overflow: "hidden",
    padding: 4,
    backgroundColor: "#f1f5f9",
  },
  periodOption: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    minWidth: 100,
    alignItems: "center",
  },
  periodText: {
    fontSize: 14,
    fontWeight: "600",
  },
  savingsText: {
    fontSize: 12,
    fontWeight: "normal",
  },
  priceDisplay: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "center",
    marginBottom: 8,
    position: "relative",
  },
  originalPrice: {
    position: "absolute",
    top: -16,
    right: "30%",
    fontSize: 16,
    fontWeight: "500",
    color: "#94a3b8",
    textDecorationLine: "line-through",
  },
  currencySymbol: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 6,
    color: "#1e293b",
  },
  priceAmount: {
    fontSize: 42,
    fontWeight: "bold",
    color: "#1e293b",
    letterSpacing: -1,
  },
  periodLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: "#64748b",
    marginBottom: 6,
    marginLeft: 2,
  },
  priceSubtext: {
    fontSize: 13,
    color: "#64748b",
    marginBottom: 24,
    lineHeight: 18,
    textAlign: "center",
  },
  ctaButton: {
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  ctaButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "700",
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 30,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 6,
  },
  bottomGradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 40,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    height: height * 0.85,
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderWidth: 1,
    borderBottomWidth: 0,
    overflow: "hidden",
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0, 0, 0, 0.1)",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  closeButtonText: {
    fontSize: 24,
    color: "white",
    lineHeight: 28,
  },
  modalContent: {
    padding: 20,
  },
  modalSection: {
    marginBottom: 24,
  },
  modalSectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: 12,
  },
  modalDescription: {
    fontSize: 16,
    color: "#4b5563",
    lineHeight: 24,
  },
  modalPriceSection: {
    backgroundColor: "rgba(0, 0, 0, 0.03)",
    padding: 16,
    borderRadius: 16,
    marginBottom: 24,
  },
  modalPriceLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: 8,
    textAlign: "center",
  },
  modalPriceContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "center",
    marginBottom: 8,
    position: "relative",
  },
  modalOriginalPrice: {
    position: "absolute",
    top: -16,
    right: "30%",
    fontSize: 16,
    fontWeight: "500",
    color: "#94a3b8",
    textDecorationLine: "line-through",
  },
  modalCurrencySymbol: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 6,
    color: "#1e293b",
  },
  modalPriceAmount: {
    fontSize: 42,
    fontWeight: "bold",
    color: "#1e293b",
    letterSpacing: -1,
  },
  modalPeriodLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: "#64748b",
    marginBottom: 6,
    marginLeft: 2,
  },
  modalPriceSubtext: {
    fontSize: 13,
    color: "#64748b",
    textAlign: "center",
  },
  modalBenefitRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  modalBenefitIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  modalBenefitText: {
    fontSize: 16,
    color: "#4b5563",
    flex: 1,
    lineHeight: 24,
  },
  modalBillingText: {
    fontSize: 15,
    color: "#4b5563",
    marginBottom: 8,
    lineHeight: 22,
  },
  modalButtonContainer: {
    marginTop: 16,
    marginBottom: 40,
    alignItems: "center",
  },
  buyNowButton: {
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
    width: "100%",
    marginBottom: 16,
  },
  buyNowButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "700",
  },
  termsButton: {
    paddingVertical: 8,
  },
  termsButtonText: {
    fontSize: 14,
    fontWeight: "500",
    textDecorationLine: "underline",
  },
});

export default PricingPage;
