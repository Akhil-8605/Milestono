import React, { useState, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Animated,
  Easing,
  Dimensions,
  StatusBar,
  ImageBackground,
  Platform,
  UIManager,
  LayoutAnimation,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import {
  Ionicons,
  MaterialCommunityIcons,
  FontAwesome5,
  MaterialIcons,
} from "@expo/vector-icons";

// Enable LayoutAnimation for Android
if (Platform.OS === "android") {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

const { width } = Dimensions.get("window");

// Tab icons and colors
const tabConfig: Record<
  TabKey,
  {
    icon: string;
    iconType: string;
    gradientColors: [string, string, ...string[]];
    lightColor: string;
  }
> = {
  "Home Loan": {
    icon: "home",
    iconType: "FontAwesome5",
    gradientColors: ["#4776E6", "#8E54E9"],
    lightColor: "#e8f0fe",
  },
  Banks: {
    icon: "building",
    iconType: "FontAwesome5",
    gradientColors: ["#11998e", "#38ef7d"],
    lightColor: "#e6f9f1",
  },
  "Loan EMI": {
    icon: "calculator",
    iconType: "FontAwesome5",
    gradientColors: ["#FF512F", "#F09819"],
    lightColor: "#fff1e6",
  },
  "Loan Eligibility": {
    icon: "check-circle",
    iconType: "FontAwesome5",
    gradientColors: ["#5C258D", "#4389A2"],
    lightColor: "#f0e6ff",
  },
};

// FAQ data organized by tabs
type TabKey = "Home Loan" | "Banks" | "Loan EMI" | "Loan Eligibility";

const faqData: Record<TabKey, { question: string; answer: string }[]> = {
  "Home Loan": [
    {
      question: "What are the types of home loan available?",
      answer: `
Home purchase loan: It is the most common type of home loan. All banks and housing finance companies offer loans for residential properties at different rates coupled with discounts and rebates. It can be availed for both resale properties and builder-allocated units.

Land/Plot loan: Banks offer such types of loans to buyers intending to purchase land parcels for constructing their residential units. About 70 percent of the total cost of the land can be availed.

Construction loan: The most common type of home loan availed by a major share of the semi-urban population to build a home meeting their requirements on a land parcel you already own. All housing finance companies and banks provide home construction loans.

Home extension/improvement loan: You can also avail loans for any sort of extension or improvement in your house, be it a new room or a new floor. Housing finance companies and banks offer loans for home improvement/renovation purposes such as painting, plumbing, electrical systems, interior designing, and waterproofing.

Home conversion loan: Such home loans are taken by people who have bought a house on a home loan but now intend to buy and move to a new house. With these loans, applicants can fund the purchase of the new house by shifting the running loan to the new unit.

NRI home loan: It is designed for NRIs who wish to construct or buy a home in India.

      `,
    },
    {
      question:
        "What is the difference between fixed rate and floating rate of interest?",
      answer:
        "Taking home loan on a fixed interest rate implies that your EMI will not be impacted during the loan tenure irrespective of any market conditions. The interest rate will be pre-determined and remain unchanged. On the flip side, home loan EMis vary periodically over the loan tenure, if taken on floating interest rate.",
    },
    {
      question: "Are there any other charges that accompany home loans?",
      answer: `
There are some hidden charges applicable while opting for a home loan.


Conversion Fees
MODT Charges (Memorandum of Deposit of Title Deed)
Document Retrieval Charges
Administrative Charges
Legal Fees
Valuation Fees / Inspection Fees
Documentation Charges
Switching Loan Package
Changing Loan Tenure
Statement of Account
        `,
    },
    {
      question: "How to calculate interest on a home loan?",
      answer: `
Calculating the monthly interest levied on your home loan is easy. Follow these steps -

Divide interest rate by the number of payments. If you are making monthly payments, divide by 12.
Multiply it by the loan amount.

Doing this will give you the amount of interest.
        `,
    },
    {
      question: "What is the home loan process?",
      answer: ` 
The process of getting a home loan is simple. But you need to be aware of all documents required before applying for the loan.

Fill loan application form with all required documents
Pay processing fee
Discussion with the bank
Valuation of the submitted documents
Loan approval process
Processing of the offer letter
Legal check
Final loan deal, signing the agreement, and disbursal
        `,
    },
  ],
  Banks: [
    {
      question: "What are the processing fees charged by the bank?",
      answer:
        "Processing fee charged while applying for home loan varies from bank to bank. Typically, the processing fee is about 0.5 percent to 1 percent of the loan amount + applicable Service Tax and Surcharge. The maximum processing fee ranges between Rs 10,000-15,000 excluding applicable taxes.",
    },
    {
      question: "Which bank has lowest interest rate for home loan?",
      answer:
        "All banks provide loan against properties at different interest rates. One of the top nationalised banks, SBI charges interest rate of 8.35 percent to 8.65 percent for general customers. The interest rates are irrespective of the loan amount. Note: If you take loan in the name of a female member, all banks offer slightly reduced interest rates.",
    },
    {
      question: "Which bank home loan is best in India?",
      answer: `
Banks and housing finance companies do offer home loan at lucrative interest rates combined with offers and incentives. If you are unable to make up your mind while choosing a bank for taking home loan, here are some of the best financial institutes granting home loan in India -

ICICI Bank
HDFC Limited
SBI
Yes Bank
Axis Bank
PNB Housing
DHFL
Indiabulls        
        `,
    },
  ],
  "Loan EMI": [
    {
      question: "What is EMI?",
      answer:
        "EMI stands for equated monthly installments. As a borrower, you need to pay the lender a fixed amount every month on a specified date. The EMI is the sum total of the principal amount and the interest amount divided over the tenure of the loan. However, your monthly value is fixed for each month, the principal amount paid and interest amount paid changes every month. For the first few years, the interest portion is higher. With time, the interest amount keeps reducing and principal amount keeps increasing. Therefore, your 70-75% interest will be paid in the first few years of the entire loan tenure.",
    },
    {
      question: "What is Home-Loan EMI?",
      answer:
        "Home loan is a loan taken from any financial institution for buying a house. The EMI that is calculated for this loan is termed as a Home loan EMI.",
    },
    {
      question: "How is the EMI calculated for a home loan?",
      answer:
        "EMI is calculated using the formula: EMI = P × r × (1 + r)^n / ((1 + r)^n - 1), where P is the principal loan amount, r is the monthly interest rate (annual rate divided by 12 and then by 100), and n is the loan tenure in months. Various online calculators can help you determine your exact EMI.",
    },
    {
      question: "What happens if I miss an EMI payment?",
      answer:
        "Missing an EMI payment can result in late payment fees, negative impact on your credit score, and potentially higher interest rates. Multiple missed payments may lead to default notices and eventually foreclosure proceedings. Always communicate with your lender if you anticipate payment difficulties.",
    },
  ],
  "Loan Eligibility": [
    {
      question: "What are the eligibility criteria for home loans?",
      answer:
        "There is an eligibility criterion that banks have before they go ahead sanctioning it. A few important of them are employment stability, age criteria, credit rating, financial stability etc.",
    },
    {
      question: "How is eligibility for home loan calculated?",
      answer: `
Some steps to calculate your home loan eligibility are:

To calculate the income level, banks will investigate your salary slips and bank statements.
Next, it calculates the amount saved assuming that 30% of your savings is from your INCOME.
If there are existing loans, the EMI is reduced from the income level.
According to the income level and savings, the bank calculates a home loan amount.
        `,
    },
    {
      question: "What is the minimum salary for home loan?",
      answer:
        "Banks usually up to 60 times your monthly net income (salary). You can calculate your home loan eligibility using the home loan eligibility calculator.",
    },
    {
      question: "Can self-employed individuals apply for home loans?",
      answer:
        "Yes, self-employed individuals can apply with additional documentation.",
    },
    {
      question:
        "What are the eligibility requirements for an NRI seeking home loan?",
      answer: `
Following are the eligibility criteria for an NRI seeking home loan:

An Indian citizen holding a valid Indian passport.
The passport should be free from NO ENTRY stamp. This stamp does not allow an NRI to enter the country.
The passport of the NRI applicant should have a valid entry visa.
Valid PIO/OCI Card copy to be documented with foreign country passport for PIO/OCI.`,
    },
  ],
};
const [activeTab, setActiveTab] = useState<TabKey>("Home Loan");
const FAQSection = () => {
  const [activeTab, setActiveTab] = useState<TabKey>("Home Loan");
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const scrollViewRef = useRef<ScrollView>(null);

  // Animation values
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const tabIndicatorPosition = useRef(new Animated.Value(0)).current;
  const rotateAnimations = useRef(
    faqData[activeTab].map(() => new Animated.Value(0))
  ).current;

  const scaleAnimations = useRef(
    faqData[activeTab].map(() => new Animated.Value(1))
  ).current;

  // Handle tab change with animations
  const handleTabPress = (tab: TabKey, index: number) => {
    if (tab === activeTab) return;

    // Fade out current content
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setActiveTab(tab);
      setExpandedIndex(null);

      // Reset rotation animations for new tab
      rotateAnimations.forEach((anim) => {
        anim.setValue(0);
      });

      // Update tab indicator position
      Animated.spring(tabIndicatorPosition, {
        toValue: index * (width / 4) - 10,
        friction: 8,
        tension: 50,
        useNativeDriver: true,
      }).start();

      // Fade in new content
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        delay: 100,
        useNativeDriver: true,
      }).start();

      // Scroll to top when changing tabs
      if (scrollViewRef.current) {
        scrollViewRef.current.scrollTo({ y: 0, animated: true });
      }
    });
  };

  // Toggle FAQ expansion with animations
  const toggleQuestion = (index: number) => {
    // Configure layout animation
    LayoutAnimation.configureNext({
      duration: 300,
      update: {
        type: LayoutAnimation.Types.spring,
        springDamping: 0.7,
      },
    });

    // Rotate animation
    Animated.timing(rotateAnimations[index], {
      toValue: expandedIndex === index ? 0 : 1,
      duration: 300,
      useNativeDriver: true,
    }).start();

    // Scale animation for pressed item
    Animated.sequence([
      Animated.timing(scaleAnimations[index], {
        toValue: 0.98,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnimations[index], {
        toValue: 1,
        friction: 4,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();

    setExpandedIndex(expandedIndex === index ? null : index);
  };

  // Render tab icon based on configuration
  const renderTabIcon = (tab: TabKey) => {
    const config = tabConfig[tab];

    if (config.iconType === "FontAwesome5") {
      return (
        <FontAwesome5
          name={config.icon}
          size={16}
          color={activeTab === tab ? "white" : config.gradientColors[0]}
        />
      );
    } else if (config.iconType === "MaterialCommunityIcons") {
      return (
        <MaterialCommunityIcons
          name={config.icon as any}
          size={16}
          color={activeTab === tab ? "white" : config.gradientColors[0]}
        />
      );
    } else if (config.iconType === "Ionicons") {
      return (
        <Ionicons
          name={config.icon as keyof typeof Ionicons.glyphMap}
          size={16}
          color={activeTab === tab ? "white" : config.gradientColors[0]}
        />
      );
    }

    return null;
  };

  // Render tabs with animations
  const renderTabs = () => {
    const tabs = Object.keys(faqData);

    return (
      <View style={styles.tabsOuterContainer}>
        {/* <Animated.View 
          style={[
            styles.tabIndicator, 
            { 
              transform: [{ translateX: tabIndicatorPosition }],
              backgroundColor: tabConfig[activeTab].gradientColors[0]
            }
          ]} 
        /> */}
        <View style={styles.tabsContainer}>
          {tabs.map((tab, index) => (
            <TouchableOpacity
              key={tab}
              style={[
                styles.tab,
                activeTab === tab && styles.activeTab,
                { width: width / 4 - 16 },
              ]}
              onPress={() => handleTabPress(tab as TabKey, index)}
            >
              <View style={styles.tabContent}>
                {renderTabIcon(tab as TabKey)}
                <Text
                  style={[
                    styles.tabText,
                    activeTab === tab && styles.activeTabText,
                  ]}
                  numberOfLines={1}
                >
                  {tab}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };

  // Render FAQ items with animations
  const renderFAQs = () => {
    return (
      <Animated.View style={{ opacity: fadeAnim }}>
        {faqData[activeTab].map((item, index) => {
          // Rotation animation for the plus/minus icon
          const rotateInterpolate = rotateAnimations[index].interpolate({
            inputRange: [0, 1],
            outputRange: ["0deg", "135deg"],
          });

          // Scale animation for the card
          const scaleInterpolate = scaleAnimations[index];

          return (
            <Animated.View
              key={index}
              style={[
                styles.faqItemContainer,
                {
                  transform: [{ scale: scaleInterpolate }],
                  backgroundColor:
                    expandedIndex === index
                      ? tabConfig[activeTab].lightColor
                      : "white",
                },
              ]}
            >
              <TouchableOpacity
                style={styles.faqItem}
                onPress={() => toggleQuestion(index)}
                activeOpacity={0.9}
              >
                <View style={styles.questionContainer}>
                  <View style={styles.questionTextContainer}>
                    <Text style={styles.questionText}>{item.question}</Text>
                  </View>
                  <Animated.View
                    style={[
                      styles.iconContainer,
                      {
                        transform: [{ rotate: rotateInterpolate }],
                        backgroundColor:
                          expandedIndex === index
                            ? tabConfig[activeTab].gradientColors[0]
                            : "#f0f2f5",
                      },
                    ]}
                  >
                    <Ionicons
                      name="add"
                      size={18}
                      color={
                        expandedIndex === index
                          ? "white"
                          : tabConfig[activeTab].gradientColors[0]
                      }
                    />
                  </Animated.View>
                </View>

                {expandedIndex === index && (
                  <Animated.View style={styles.answerContainer}>
                    <Text style={styles.answerText}>{item.answer}</Text>
                  </Animated.View>
                )}
              </TouchableOpacity>
            </Animated.View>
          );
        })}
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Header with gradient background */}
      <LinearGradient
        colors={tabConfig[activeTab].gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.headerGradient}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Frequently Asked Questions</Text>
          <Text style={styles.subtitle}>
            Everything you need to know about {activeTab.toLowerCase()}
          </Text>
        </View>
      </LinearGradient>

      {/* Tabs navigation */}
      {renderTabs()}

      {/* FAQ content */}
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.faqContainer}>{renderFAQs()}</View>

        {/* Decorative elements */}
        <View style={styles.decorativeContainer}>
          <View
            style={[
              styles.decorativeCircle,
              { backgroundColor: tabConfig[activeTab].lightColor },
            ]}
          />
          <View
            style={[
              styles.decorativeCircle,
              {
                backgroundColor: tabConfig[activeTab].gradientColors[1],
                opacity: 0.1,
                right: -20,
                bottom: -20,
              },
            ]}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  headerGradient: {
    paddingTop: Platform.OS === "ios" ? 0 : StatusBar.currentHeight,
    paddingBottom: 30,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  header: {
    padding: 20,
    paddingTop: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "white",
    marginBottom: 8,
    textShadowColor: "rgba(0, 0, 0, 0.1)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  subtitle: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.9)",
    lineHeight: 22,
  },
  tabsOuterContainer: {
    maxWidth: "95%",
    marginTop: -20,
    backgroundColor: "white",
    marginHorizontal: 16,
    borderRadius: 50,
    padding: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
    position: "relative",
    zIndex: 10,
  },
  tabIndicator: {
    position: "absolute",
    top: 8,
    left: 8,
    width: width / 4 - 16,
    height: 40,
    borderRadius: 20,
    zIndex: -1,
  },
  tabsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  tab: {
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  activeTab: {
    backgroundColor: "#4776E6", // or any color you want for the active tab
  },
  tabContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 8,
  },
  tabText: {
    fontSize: 12,
    fontWeight: "600",
    marginLeft: 4,
    color: "#64748b",
  },
  activeTabText: {
    color: "white",
  },
  scrollContainer: {
    padding: 16,
    paddingTop: 24,
    paddingBottom: 40,
  },
  faqContainer: {
    marginTop: 8,
    zIndex: 1,
  },
  faqItemContainer: {
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
    overflow: "hidden",
  },
  faqItem: {
    padding: 20,
  },
  questionContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  questionTextContainer: {
    flex: 1,
    paddingRight: 16,
  },
  questionText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1e293b",
    lineHeight: 22,
  },
  iconContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  answerContainer: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.06)",
  },
  answerText: {
    fontSize: 15,
    lineHeight: 24,
    color: "#475569",
  },
  decorativeContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1,
  },
  decorativeCircle: {
    position: "absolute",
    width: 200,
    height: 200,
    borderRadius: 100,
    right: -100,
    top: -50,
  },
});

export default FAQSection;
