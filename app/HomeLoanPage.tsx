import React, { useState, useRef, useEffect, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
  Modal,
  SafeAreaView,
  StatusBar,
  Dimensions,
  Animated,
  Platform,
  KeyboardAvoidingView,
  Easing,
  FlatList,
  Pressable,
  LayoutChangeEvent,
} from "react-native";
import {
  Svg,
  Path,
  Defs,
  LinearGradient as SvgGradient,
  Stop,
  Circle,
  Rect,
} from "react-native-svg";
import Header from "./components/Header";
import HomeLoanFaq from "./faqs/homeloanfaq";
// Get screen dimensions
const { width, height } = Dimensions.get("window");

// Custom Input Component
interface CustomInputProps {
  label?: React.ReactNode;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  keyboardType?: "default" | "numeric" | "email-address" | "phone-pad";
  prefix?: string;
  suffix?: string;
  style?: object;
  error?: string;
  containerStyle?: object;
}

const CustomInput: React.FC<CustomInputProps> = ({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType = "default",
  prefix,
  suffix,
  style = {},
  error,
  containerStyle = {},
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: isFocused || value ? 1 : 0,
      duration: 150,
      useNativeDriver: false,
    }).start();
  }, [isFocused, value]);

  const labelStyle = {
    top: animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [16, -8],
    }),
    fontSize: animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [16, 12],
    }),
    color: animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: ["#6B7280", "#3B82F6"],
    }),
  };

  const borderColor = error ? "#EF4444" : isFocused ? "#3B82F6" : "#E5E7EB";

  return (
    <View style={[styles.inputContainer, containerStyle]}>
      {label && <Text style={styles.inputLabelStatic}>{label}</Text>}
      <View
        style={[
          styles.inputWrapper,
          {
            borderColor,
            borderWidth: 1,
            backgroundColor: isFocused ? "rgba(59, 130, 246, 0.05)" : "white",
          },
          style,
        ]}
      >
        {prefix && <Text style={styles.inputPrefix}>{prefix}</Text>}

        <TextInput
          style={[
            styles.input,
            prefix ? { paddingLeft: 30 } : {},
            suffix ? { paddingRight: 60 } : {},
          ]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#9CA3AF"
          keyboardType={keyboardType}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />

        {suffix && <Text style={styles.inputSuffix}>{suffix}</Text>}
      </View>

      {error && <Text style={styles.inputError}>{error}</Text>}
    </View>
  );
};

// Custom Button Component
interface CustomButtonProps {
  title: string;
  onPress: () => void;
  primary?: boolean;
  icon?: React.ReactNode;
  style?: object;
  disabled?: boolean;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  title,
  onPress,
  primary = true,
  icon,
  style = {},
  disabled = false,
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.97,
      friction: 8,
      tension: 100,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 5,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View
      style={[
        styles.buttonContainer,
        { transform: [{ scale: scaleAnim }], opacity: disabled ? 0.6 : 1 },
      ]}
    >
      <TouchableOpacity
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.9}
        disabled={disabled}
        style={[
          styles.button,
          primary ? styles.primaryButton : styles.secondaryButton,
          style,
        ]}
      >
        <View style={styles.buttonContent}>
          {icon && <View style={styles.buttonIcon}>{icon}</View>}
          <Text
            style={[
              styles.buttonText,
              primary ? styles.primaryButtonText : styles.secondaryButtonText,
            ]}
          >
            {title}
          </Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

// Custom Dropdown Component
interface CustomDropdownProps {
  label?: string;
  value: string;
  onValueChange: (value: string) => void;
  options: string[];
  style?: object;
  error?: string;
  containerStyle?: object;
  placeholder?: string;
}

const CustomDropdown: React.FC<CustomDropdownProps> = ({
  label,
  value,
  onValueChange,
  options,
  style = {},
  error,
  containerStyle = {},
  placeholder = "Select",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const heightAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(rotateAnim, {
      toValue: isOpen ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();

    Animated.timing(heightAnim, {
      toValue: isOpen ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [isOpen]);

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  });

  const menuHeight = heightAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, Math.min(options.length * 50, 200)],
  });

  const borderColor = error ? "#EF4444" : isOpen ? "#3B82F6" : "#E5E7EB";

  return (
    <View style={[styles.dropdownContainer, containerStyle]}>
      {label && <Text style={styles.dropdownLabelStatic}>{label}</Text>}

      <TouchableOpacity
        style={[
          styles.dropdownButton,
          {
            borderColor,
            borderWidth: 1,
            backgroundColor: isOpen ? "rgba(59, 130, 246, 0.05)" : "white",
          },
          style,
        ]}
        onPress={() => setIsOpen(!isOpen)}
        activeOpacity={0.9}
      >
        <Text
          style={[
            styles.dropdownButtonText,
            !value && styles.dropdownPlaceholder,
            isOpen && { color: "#3B82F6" },
          ]}
        >
          {value || placeholder}
        </Text>

        <Animated.View style={{ transform: [{ rotate }] }}>
          <Svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <Path
              d="M6 9L12 15L18 9"
              stroke={isOpen ? "#3B82F6" : "#6B7280"}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
        </Animated.View>
      </TouchableOpacity>

      {isOpen && (
        <Animated.View style={[styles.dropdownMenu, { height: menuHeight }]}>
          <ScrollView nestedScrollEnabled={true}>
            {options.map((option, index) => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.dropdownItem,
                  index === options.length - 1 && { borderBottomWidth: 0 },
                ]}
                onPress={() => {
                  onValueChange(option);
                  setIsOpen(false);
                }}
              >
                <Text
                  style={[
                    styles.dropdownItemText,
                    value === option && styles.dropdownItemTextSelected,
                  ]}
                >
                  {option}
                </Text>

                {value === option && (
                  <Svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <Path
                      d="M5 13L9 17L19 7"
                      stroke="#3B82F6"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </Svg>
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Animated.View>
      )}

      {error && <Text style={styles.inputError}>{error}</Text>}
    </View>
  );
};

// Custom Checkbox Component
interface CustomCheckboxProps {
  checked: boolean;
  onPress: () => void;
  label?: React.ReactNode;
  style?: object;
}

const CustomCheckbox: React.FC<CustomCheckboxProps> = ({
  checked,
  onPress,
  label,
  style = {},
}) => {
  const scaleAnim = useRef(new Animated.Value(checked ? 1 : 0)).current;

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: checked ? 1 : 0,
      friction: 8,
      tension: 300,
      useNativeDriver: true,
    }).start();
  }, [checked]);

  return (
    <TouchableOpacity
      style={[styles.checkboxContainer, style]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.checkboxWrapper}>
        <View
          style={[
            styles.checkbox,
            checked && {
              borderColor: "#3B82F6",
              backgroundColor: "rgba(59, 130, 246, 0.1)",
            },
          ]}
        >
          <Animated.View
            style={[
              styles.checkboxInner,
              {
                opacity: scaleAnim,
                transform: [{ scale: scaleAnim }],
              },
            ]}
          >
            <Svg width="12" height="12" viewBox="0 0 24 24" fill="none">
              <Path
                d="M5 13L9 17L19 7"
                stroke="white"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          </Animated.View>
        </View>
      </View>

      {label && <Text style={styles.checkboxLabel}>{label}</Text>}
    </TouchableOpacity>
  );
};

// Custom Card Component
interface CustomCardProps {
  children: React.ReactNode;
  style?: object;
  onPress?: () => void;
}

const CustomCard: React.FC<CustomCardProps> = ({
  children,
  style = {},
  onPress,
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.timing(scaleAnim, {
      toValue: 0.98,
      duration: 100,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 5,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const CardContent = () => <View style={styles.card}>{children}</View>;

  if (onPress) {
    return (
      <Animated.View
        style={[
          styles.cardShadow,
          { transform: [{ scale: scaleAnim }] },
          style,
        ]}
      >
        <TouchableOpacity
          activeOpacity={0.95}
          onPress={onPress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
        >
          <CardContent />
        </TouchableOpacity>
      </Animated.View>
    );
  }

  return (
    <View style={[styles.cardShadow, style]}>
      <CardContent />
    </View>
  );
};

// Banks Table Component
const BanksTable = ({
  onGetDeal,
  loanAmount,
  tenure,
}: {
  onGetDeal: (bankName: string) => void;
  loanAmount: string;
  tenure: string;
}) => {
  const scrollX = useRef(new Animated.Value(0)).current;
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const banks = [
    {
      id: "sbi",
      name: "SBI",
      logo: require("../assets/images/SBIBank.png"),
      interestRate: 8.5,
      processingFees: "₹3 + GST",
      emi: calculateEMI(loanAmount, 8.5, tenure),
      maxLoanAmount: "2000000",
      featured: true,
      color: "#EC4899",
    },
    {
      id: "bank-of-india",
      name: "Bank Of India",
      logo: require("../assets/images/BOI.png"),
      interestRate: 10,
      processingFees: "₹10 + GST",
      emi: calculateEMI(loanAmount, 10, tenure),
      maxLoanAmount: "99985",
      color: "#3B82F6",
    },
    {
      id: "hdfc",
      name: "HDFC Bank",
      logo: require("../assets/images/hdfcbank.png"),
      interestRate: 8.5,
      processingFees: "₹15 + GST",
      emi: calculateEMI(loanAmount, 8.5, tenure),
      maxLoanAmount: "1500000",
      color: "#8B5CF6",
    },
    {
      id: "icici",
      name: "ICICI Bank",
      logo: require("../assets/images/ICICIBank.png"),
      interestRate: 9,
      processingFees: "₹12 + GST",
      emi: calculateEMI(loanAmount, 9, tenure),
      maxLoanAmount: "1800000",
      color: "#6366F1",
    },
    {
      id: "axis",
      name: "Axis Bank",
      logo: require("../assets/images/AXISBank.png"),
      interestRate: 8.75,
      processingFees: "₹8 + GST",
      emi: calculateEMI(loanAmount, 8.75, tenure),
      maxLoanAmount: "1600000",
      color: "#0EA5E9",
    },
  ];

  function calculateEMI(
    principal: string,
    rate: number,
    years: string
  ): string {
    if (!principal || !rate || !years) return "₹0";

    const p = parseFloat(principal.replace(/,/g, ""));
    const r = parseFloat(rate.toString()) / 12 / 100;
    const n = parseFloat(years) * 12;

    if (isNaN(p) || isNaN(r) || isNaN(n) || r === 0 || n === 0) return "₹0";

    const emi = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    return `₹${Math.round(emi).toLocaleString()}`;
  }

  // Auto scroll banks every 5 seconds
  useEffect(() => {
    const listener = scrollX.addListener(({ value }) => {
      const index = Math.round(value / width);
      setActiveIndex(index);
    });

    const autoScrollInterval = setInterval(() => {
      if (flatListRef.current) {
        const nextIndex = (activeIndex + 1) % banks.length;
        flatListRef.current.scrollToIndex({
          index: nextIndex,
          animated: true,
        });
      }
    }, 5000);

    return () => {
      scrollX.removeListener(listener);
      clearInterval(autoScrollInterval);
    };
  }, [activeIndex, banks.length]);

  const renderBankCard = ({
    item,
    index,
  }: {
    item: (typeof banks)[0];
    index: number;
  }) => {
    const inputRange = [
      (index - 1) * width,
      index * width,
      (index + 1) * width,
    ];

    const scale = scrollX.interpolate({
      inputRange,
      outputRange: [0.9, 1, 0.9],
      extrapolate: "clamp",
    });

    const opacity = scrollX.interpolate({
      inputRange,
      outputRange: [0.6, 1, 0.6],
      extrapolate: "clamp",
    });

    const translateY = scrollX.interpolate({
      inputRange,
      outputRange: [20, 0, 20],
      extrapolate: "clamp",
    });

    return (
      <Animated.View
        style={[
          styles.bankCardContainer,
          {
            transform: [{ scale }, { translateY }],
            opacity,
          },
        ]}
      >
        <CustomCard>
          <View style={styles.bankCardContent}>
            {item.featured && (
              <View
                style={[styles.featuredBadge, { backgroundColor: "#3B82F6" }]}
              >
                <Text style={styles.featuredBadgeText}>FEATURED</Text>
              </View>
            )}

            <View style={styles.bankCardHeader}>
              <View
                style={[styles.bankLogoContainer, { borderColor: "#3B82F6" }]}
              >
                <Image source={item.logo} style={styles.bankLogo} />
              </View>
              <Text style={styles.bankName}>{item.name}</Text>
            </View>

            <View style={styles.bankDetailsGrid}>
              <View style={styles.bankDetailItem}>
                <Text style={styles.bankDetailLabel}>Rate of interest</Text>
                <Text style={[styles.bankDetailValue, { color: "#3B82F6" }]}>
                  {item.interestRate}%
                </Text>
              </View>

              <View style={styles.bankDetailItem}>
                <Text style={styles.bankDetailLabel}>Processing fees</Text>
                <Text style={styles.bankDetailValue}>
                  {item.processingFees}
                </Text>
              </View>

              <View style={styles.bankDetailItem}>
                <Text style={styles.bankDetailLabel}>EMI</Text>
                <Text style={[styles.bankDetailValue, { color: "#3B82F6" }]}>
                  {item.emi}
                </Text>
              </View>

              <View style={styles.bankDetailItem}>
                <Text style={styles.bankDetailLabel}>Max. loan amount</Text>
                <View>
                  <Text style={[styles.bankDetailValue, { color: "#3B82F6" }]}>
                    ₹{parseInt(item.maxLoanAmount).toLocaleString()}
                  </Text>
                  <Text style={styles.bankDetailSubtext}>
                    Loan to value ratio
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.bankCardActions}>
              <TouchableOpacity style={styles.emailButton} activeOpacity={0.8}>
                <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <Path
                    d="M3 8L10.89 13.26C11.2187 13.4793 11.6049 13.5963 12 13.5963C12.3951 13.5963 12.7813 13.4793 13.11 13.26L21 8M5 19H19C19.5304 19 20.0391 18.7893 20.4142 18.4142C20.7893 18.0391 21 17.5304 21 17V7C21 6.46957 20.7893 5.96086 20.4142 5.58579C20.0391 5.21071 19.5304 5 19 5H5C4.46957 5 3.96086 5.21071 3.58579 5.58579C3.21071 5.96086 3 6.46957 3 7V17C3 17.5304 3.21071 18.0391 3.58579 18.4142C3.96086 18.7893 4.46957 19 5 19Z"
                    stroke="#3B82F6"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </Svg>
                <Text style={styles.emailButtonText}>Email me</Text>
              </TouchableOpacity>

              <CustomButton
                title="Get me this deal"
                onPress={() => onGetDeal(item.name)}
                style={{ backgroundColor: "#3B82F6" }}
              />
            </View>
          </View>
        </CustomCard>
      </Animated.View>
    );
  };

  const onScrollToIndexFailed = (info: {
    index: number;
    highestMeasuredFrameIndex: number;
    averageItemLength: number;
  }) => {
    const wait = new Promise((resolve) => setTimeout(resolve, 500));
    wait.then(() => {
      if (flatListRef.current) {
        flatListRef.current.scrollToIndex({
          index: info.index,
          animated: true,
        });
      }
    });
  };

  return (
    <View style={styles.banksSection}>
      <View style={styles.banksSectionHeader}>
        <Text style={styles.banksSectionTitle}>
          Hi! We have{" "}
          <Text style={{ color: "#3B82F6" }}>{banks.length} offers</Text> for
          you to compare and choose the best
        </Text>

        <View style={styles.pagination}>
          {banks.map((_, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => {
                if (flatListRef.current) {
                  flatListRef.current.scrollToIndex({
                    index,
                    animated: true,
                  });
                }
              }}
            >
              <Animated.View
                style={[
                  styles.paginationDot,
                  {
                    backgroundColor:
                      activeIndex === index ? "#3B82F6" : "#D1D5DB",
                    width: activeIndex === index ? 20 : 8,
                  },
                ]}
              />
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <Animated.FlatList
        ref={flatListRef}
        data={banks}
        keyExtractor={(item) => item.id}
        renderItem={renderBankCard}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
        contentContainerStyle={styles.banksList}
        onScrollToIndexFailed={onScrollToIndexFailed}
      />
    </View>
  );
};

// Loan Calculator Component with Dynamic Chart
interface LoanCalculatorProps {
  onCalculate: (results: { loanAmount: string; tenure: string }) => void;
}

const LoanCalculator: React.FC<LoanCalculatorProps> = ({ onCalculate }) => {
  const [age, setAge] = useState("35");
  const [occupation, setOccupation] = useState("Salaried");
  const [income, setIncome] = useState("100000");
  const [existingEmi, setExistingEmi] = useState("10000");
  const [interestRate, setInterestRate] = useState("8.5");
  const [tenure, setTenure] = useState("20");

  const [maxLoanAmount, setMaxLoanAmount] = useState("₹0");
  const [totalPayable, setTotalPayable] = useState("₹0");
  const [monthlyEmi, setMonthlyEmi] = useState("₹0");
  interface ChartData {
    year: number;
    amount: number;
    principal: number;
    interest: number;
  }

  const [chartData, setChartData] = useState<ChartData[]>([]);

  const [isCalculating, setIsCalculating] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const resultsAnim = useRef(new Animated.Value(0)).current;
  const chartAnim = useRef(new Animated.Value(0)).current;

  // Calculate loan whenever form values change
  useEffect(() => {
    if (showResults) {
      calculateLoan();
    }
  }, [interestRate, tenure]);

  const calculateLoan = () => {
    setIsCalculating(true);

    if (showResults) {
      // If already showing results, just update without animation
      updateCalculations();
      setIsCalculating(false);
      return;
    }

    // First time calculation with animation
    setShowResults(false);

    Animated.timing(resultsAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();

    // Simulate calculation delay
    setTimeout(() => {
      updateCalculations();

      setShowResults(true);

      Animated.parallel([
        Animated.timing(resultsAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(chartAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: false,
        }),
      ]).start();

      setIsCalculating(false);

      // Notify parent component
      if (onCalculate) {
        onCalculate({
          loanAmount: maxLoanAmount.replace("₹", "").replace(/,/g, ""),
          tenure,
        });
      }
    }, 800);
  };

  const updateCalculations = () => {
    const incomeNum = parseFloat(income.replace(/,/g, ""));
    const emiNum = parseFloat(existingEmi.replace(/,/g, ""));
    const rateNum = parseFloat(interestRate);
    const tenureNum = parseFloat(tenure);

    if (
      isNaN(incomeNum) ||
      isNaN(emiNum) ||
      isNaN(rateNum) ||
      isNaN(tenureNum)
    ) {
      return;
    }

    const eligibleIncome = incomeNum - emiNum;
    const eligibleLoanMultiplier = 50 - parseFloat(age) / 10;
    const maxLoan = eligibleIncome * eligibleLoanMultiplier;

    const monthlyRate = rateNum / 12 / 100;
    const totalMonths = tenureNum * 12;
    const emi =
      (maxLoan * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) /
      (Math.pow(1 + monthlyRate, totalMonths) - 1);
    const totalPayableAmount = emi * totalMonths;

    // Format currency values
    const formattedMaxLoan =
      maxLoan >= 10000000
        ? `₹${(maxLoan / 10000000).toFixed(1)} Cr`
        : `₹${Math.round(maxLoan).toLocaleString()}`;

    const formattedTotalPayable =
      totalPayableAmount >= 10000000
        ? `₹${(totalPayableAmount / 10000000).toFixed(1)} Cr`
        : `₹${Math.round(totalPayableAmount).toLocaleString()}`;

    const formattedEmi =
      emi >= 100000
        ? `₹${(emi / 100000).toFixed(1)} L`
        : `₹${Math.round(emi).toLocaleString()}`;

    setMaxLoanAmount(formattedMaxLoan);
    setTotalPayable(formattedTotalPayable);
    setMonthlyEmi(formattedEmi);

    // Generate chart data
    generateChartData(maxLoan, totalPayableAmount, tenureNum);
  };

  const generateChartData = (
    principal: number,
    totalAmount: number,
    years: number
  ) => {
    const interestAmount = totalAmount - principal;
    const newChartData = [];

    // Create data points for the chart
    for (
      let year = 0;
      year <= years;
      year += Math.max(1, Math.floor(years / 8))
    ) {
      const progress = year / years;
      const remainingPrincipal = principal * (1 - progress);
      const remainingInterest = interestAmount * (1 - Math.pow(progress, 1.5));
      const totalRemaining = remainingPrincipal + remainingInterest;

      newChartData.push({
        year,
        amount: totalRemaining / 1000000, // Convert to millions for better display
        principal: remainingPrincipal / 1000000,
        interest: remainingInterest / 1000000,
      });
    }

    // Ensure the last point is at exactly the final year
    if (newChartData[newChartData.length - 1].year !== years) {
      newChartData.push({
        year: years,
        amount: 0,
        principal: 0,
        interest: 0,
      });
    }

    setChartData(newChartData);
  };

  // Create path for chart
  const createPath = () => {
    if (chartData.length === 0) return "";

    const maxAmount = Math.max(...chartData.map((d) => d.amount)) * 1.1;
    let path = `M0,${200 - (chartData[0].amount * 200) / maxAmount}`;

    chartData.forEach((point, index) => {
      const x = (index * width * 0.9) / (chartData.length - 1);
      const y = 200 - (point.amount * 200) / maxAmount;
      path += ` L${x},${y}`;
    });

    return path;
  };

  // Create area path for chart
  const createAreaPath = () => {
    if (chartData.length === 0) return "";
    let path = createPath();
    path += ` L${width * 0.9},200 L0,200 Z`;
    return path;
  };

  // Create principal area path
  const createPrincipalPath = () => {
    if (chartData.length === 0) return "";

    const maxAmount = Math.max(...chartData.map((d) => d.amount)) * 1.1;
    let path = `M0,${200 - (chartData[0].principal * 200) / maxAmount}`;

    chartData.forEach((point, index) => {
      const x = (index * width * 0.9) / (chartData.length - 1);
      const y = 200 - (point.principal * 200) / maxAmount;
      path += ` L${x},${y}`;
    });

    path += ` L${width * 0.9},200 L0,200 Z`;
    return path;
  };

  const pathLength = useRef(0);
  const setPathLength = (event: LayoutChangeEvent) => {
    pathLength.current = event.nativeEvent.layout.width;
  };

  const animatedPathLength = chartAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  return (
    <View style={styles.calculatorSection}>
      <View style={styles.calculatorHeader}>
        <Text style={styles.calculatorTitle}>
          Calculate housing loan eligibility
        </Text>
        <Text style={styles.calculatorSubtitle}>
          Calculate your borrowing eligibility by submitting your details below
        </Text>
      </View>

      <CustomCard>
        <View style={styles.calculatorContent}>
          <View style={styles.calculatorForm}>
            <CustomInput
              label="Your Age"
              value={age}
              onChangeText={setAge}
              keyboardType="numeric"
            />

            <CustomDropdown
              label="Occupation"
              value={occupation}
              onValueChange={setOccupation}
              options={["Salaried", "Self-employed", "Business"]}
            />

            <CustomInput
              label="Net Income (₹)"
              value={income}
              onChangeText={setIncome}
              keyboardType="numeric"
              prefix="₹"
            />

            <CustomInput
              label="Existing Monthly EMI (₹)"
              value={existingEmi}
              onChangeText={setExistingEmi}
              keyboardType="numeric"
              prefix="₹"
            />

            <View style={styles.twoColumnInputs}>
              <CustomInput
                label="Rate of Interest (%)"
                value={interestRate}
                onChangeText={setInterestRate}
                keyboardType="numeric"
                style={{ flex: 1, marginRight: 8 }}
              />

              <CustomInput
                label="Tenure (Years)"
                value={tenure}
                onChangeText={setTenure}
                keyboardType="numeric"
                style={{ flex: 1, marginLeft: 8 }}
              />
            </View>

            <CustomButton
              title={isCalculating ? "Calculating..." : "Calculate"}
              onPress={calculateLoan}
              style={{ marginTop: 16 }}
              disabled={isCalculating}
            />
          </View>

          <View style={styles.calculatorResults}>
            <View style={styles.chartContainer}>
              <Svg height="200" width="100%" onLayout={setPathLength}>
                <Defs>
                  <SvgGradient
                    id="principalGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <Stop offset="0%" stopColor="rgba(59, 130, 246, 0.8)" />
                    <Stop offset="100%" stopColor="rgba(59, 130, 246, 0.2)" />
                  </SvgGradient>
                  <SvgGradient
                    id="interestGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <Stop offset="0%" stopColor="rgba(236, 72, 153, 0.6)" />
                    <Stop offset="100%" stopColor="rgba(236, 72, 153, 0.1)" />
                  </SvgGradient>
                </Defs>

                {/* Principal area */}
                <Path
                  d={createPrincipalPath()}
                  fill="url(#principalGradient)"
                  opacity={
                    chartAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, 1],
                    }) as unknown as number
                  }
                />

                {/* Total area */}
                <Path
                  d={createAreaPath()}
                  fill="url(#interestGradient)"
                  opacity={chartAnim as unknown as number}
                />

                {/* Chart line */}
                <Path
                  d={createPath()}
                  stroke="#3B82F6"
                  strokeWidth="3"
                  fill="none"
                  strokeDasharray={pathLength.current}
                  strokeDashoffset={
                    animatedPathLength.interpolate({
                      inputRange: [0, 1],
                      outputRange: [pathLength.current, 0],
                    }) as unknown as number
                  }
                />

                {/* Data points */}
                {chartData.map((point, index) => {
                  const maxAmount =
                    Math.max(...chartData.map((d) => d.amount)) * 1.1;
                  const x = (index * width * 0.9) / (chartData.length - 1);
                  const y = 200 - (point.amount * 200) / maxAmount;

                  return (
                    <Circle
                      key={index}
                      cx={x}
                      cy={y}
                      r={4}
                      fill="white"
                      stroke="#3B82F6"
                      strokeWidth="2"
                      opacity={chartAnim as unknown as number}
                    />
                  );
                })}
              </Svg>

              {/* X-axis labels */}
              <View style={styles.chartXAxis}>
                {chartData.length > 0 &&
                  chartData
                    .filter((_, i) => i % 2 === 0 || i === chartData.length - 1)
                    .map((point, index) => (
                      <Animated.Text
                        key={index}
                        style={[styles.chartXLabel, { opacity: chartAnim }]}
                      >
                        {point.year} yrs
                      </Animated.Text>
                    ))}
              </View>

              {/* Chart legend */}
              {showResults && (
                <View style={styles.chartLegend}>
                  <View style={styles.legendItem}>
                    <View
                      style={[
                        styles.legendColor,
                        { backgroundColor: "#3B82F6" },
                      ]}
                    />
                    <Text style={styles.legendText}>Principal</Text>
                  </View>
                  <View style={styles.legendItem}>
                    <View
                      style={[
                        styles.legendColor,
                        { backgroundColor: "#EC4899" },
                      ]}
                    />
                    <Text style={styles.legendText}>Interest</Text>
                  </View>
                </View>
              )}
            </View>

            <Animated.View
              style={[
                styles.resultsContainer,
                {
                  opacity: resultsAnim,
                  transform: [
                    {
                      translateY: resultsAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [20, 0],
                      }),
                    },
                  ],
                },
              ]}
            >
              <View style={styles.resultsRow}>
                <View style={styles.resultItem}>
                  <Text style={styles.resultLabel}>
                    You could borrow up to:
                  </Text>
                  <Text style={styles.resultValue}>{maxLoanAmount}</Text>
                </View>

                <View style={styles.resultItem}>
                  <Text style={styles.resultLabelGreen}>
                    Total Payable Amount:
                  </Text>
                  <Text style={styles.resultValueGreen}>{totalPayable}</Text>
                </View>
              </View>

              <View style={styles.emiContainer}>
                <Text style={styles.emiLabel}>Monthly EMI:</Text>
                <Text style={styles.emiValue}>{monthlyEmi}</Text>
              </View>

              <CustomButton
                title="Apply for Loan"
                onPress={() => {}}
                style={{ backgroundColor: "#10B981" }}
              />
            </Animated.View>
          </View>
        </View>
      </CustomCard>
    </View>
  );
};

// Main Component
const HomeLoanPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loanAmount, setLoanAmount] = useState("300000");
  const [tenure, setTenure] = useState("20");
  const [age, setAge] = useState("35");
  const [selectedBank, setSelectedBank] = useState<string | null>(null);
  const [termsAccepted, setTermsAccepted] = useState(true);

  // Form state for modal
  const [propertyIdentified, setPropertyIdentified] = useState("");
  const [propertyCity, setPropertyCity] = useState("Delhi");
  const [propertyCost, setPropertyCost] = useState("37,50,000");
  const [employment, setEmployment] = useState("Salaried");
  const [income, setIncome] = useState("1,00,000");
  const [currentEmi, setCurrentEmi] = useState("10,000");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");

  const scrollY = useRef(new Animated.Value(0)).current;
  const modalScaleAnim = useRef(new Animated.Value(0)).current;
  const modalBackdropAnim = useRef(new Animated.Value(0)).current;

  // Animated values for hero section
  const heroOpacity = scrollY.interpolate({
    inputRange: [0, 200],
    outputRange: [1, 0.3],
    extrapolate: "clamp",
  });

  const heroScale = scrollY.interpolate({
    inputRange: [0, 200],
    outputRange: [1, 0.95],
    extrapolate: "clamp",
  });

  const heroTranslateY = scrollY.interpolate({
    inputRange: [0, 200],
    outputRange: [0, -30],
    extrapolate: "clamp",
  });

  const handleGetStarted = () => {
    setIsModalOpen(true);
    Animated.parallel([
      Animated.spring(modalScaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.timing(modalBackdropAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleGetDeal = (bankName: string) => {
    setSelectedBank(bankName);
    setIsModalOpen(true);
    Animated.parallel([
      Animated.spring(modalScaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.timing(modalBackdropAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const closeModal = () => {
    Animated.parallel([
      Animated.timing(modalScaleAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(modalBackdropAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setIsModalOpen(false);
    });
  };

  const handleCalculatorResults = (results: {
    loanAmount: string;
    tenure: string;
  }) => {
    if (results && results.loanAmount) {
      setLoanAmount(results.loanAmount);
    }
    if (results && results.tenure) {
      setTenure(results.tenure);
    }
  };

  const statusBarHeight = StatusBar.currentHeight || 0;

  return (
    <SafeAreaView style={[styles.container, {marginTop: statusBarHeight }]}>
      {/* Header */}
      <Header />

      <Animated.ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContent}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
      >
        {/* Hero Section */}
        <Animated.View
          style={[
            styles.heroSection,
            {
              opacity: heroOpacity,
              transform: [{ scale: heroScale }, { translateY: heroTranslateY }],
            },
          ]}
        >
          <View style={styles.heroGradient}>
            <View style={styles.heroContent}>
              <View style={styles.heroTextContainer}>
                <Text style={styles.heroTitle}>
                  Let's find you the best{"\n"}
                  <Text style={styles.heroTitleHighlight}>home loan</Text> deal.
                </Text>
                <Text style={styles.heroSubtitle}>
                  Compare rates from top banks and find your perfect match
                </Text>
              </View>

              <CustomCard style={styles.heroFormCard}>
                <View style={styles.heroForm}>
                  <CustomInput
                    label="Loan amount"
                    value={loanAmount}
                    onChangeText={setLoanAmount}
                    keyboardType="numeric"
                    prefix="₹"
                  />

                  <CustomInput
                    label="Tenure"
                    value={tenure}
                    onChangeText={setTenure}
                    keyboardType="numeric"
                    suffix="Years"
                  />

                  <CustomInput
                    label="Your Age"
                    value={age}
                    onChangeText={setAge}
                    keyboardType="numeric"
                    suffix="Years"
                  />

                  <CustomButton
                    title="Let's get started"
                    onPress={handleGetStarted}
                    style={{ marginTop: 16 }}
                  />
                </View>
              </CustomCard>
            </View>
          </View>
        </Animated.View>

        {/* Banks Section */}
        <BanksTable
          onGetDeal={handleGetDeal}
          loanAmount={loanAmount}
          tenure={tenure}
        />

        {/* Loan Calculator Section */}
        <LoanCalculator onCalculate={handleCalculatorResults} />
        <HomeLoanFaq />
      </Animated.ScrollView>

      {/* Modal */}
      <Modal
        visible={isModalOpen}
        transparent={true}
        animationType="none"
        onRequestClose={closeModal}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.modalContainer}
        >
          <Animated.View
            style={[styles.modalOverlay, { opacity: modalBackdropAnim }]}
          >
            <TouchableOpacity
              style={{ flex: 1 }}
              activeOpacity={1}
              onPress={closeModal}
            />
          </Animated.View>

          <Animated.View
            style={[
              styles.modalContent,
              {
                transform: [
                  { scale: modalScaleAnim },
                  {
                    translateY: modalScaleAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [100, 0],
                    }),
                  },
                ],
              },
            ]}
          >
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                We just need a few details to match you with the right home loan
                product
              </Text>
              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={closeModal}
                activeOpacity={0.8}
              >
                <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <Path
                    d="M18 6L6 18M6 6L18 18"
                    stroke="#6B7280"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </Svg>
              </TouchableOpacity>
            </View>

            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.modalBodyContent}
            >
              <View style={styles.modalFormGrid}>
                <CustomInput
                  label="Loan amount"
                  value={loanAmount}
                  onChangeText={setLoanAmount}
                  keyboardType="numeric"
                  prefix="₹"
                  containerStyle={styles.modalFormItem}
                  placeholder=""
                />

                <CustomInput
                  label="Tenure"
                  value={tenure}
                  onChangeText={setTenure}
                  keyboardType="numeric"
                  suffix="Years"
                  containerStyle={styles.modalFormItem}
                  placeholder=""
                />

                <CustomInput
                  label="Your Age"
                  value={age}
                  onChangeText={setAge}
                  keyboardType="numeric"
                  suffix="Years"
                  containerStyle={styles.modalFormItem}
                  placeholder=""
                />

                <CustomDropdown
                  label="Is your property identified"
                  value={propertyIdentified}
                  onValueChange={setPropertyIdentified}
                  options={["Yes", "No"]}
                  containerStyle={styles.modalFormItem}
                  placeholder="Select"
                />

                <CustomInput
                  label="Property city"
                  value={propertyCity}
                  onChangeText={setPropertyCity}
                  containerStyle={styles.modalFormItem}
                  placeholder="Delhi"
                />

                <CustomInput
                  label="Property Cost"
                  value={propertyCost}
                  onChangeText={setPropertyCost}
                  prefix="₹"
                  keyboardType="numeric"
                  containerStyle={styles.modalFormItem}
                  placeholder="37,50,000"
                />

                <CustomDropdown
                  label="How are you currently employed"
                  value={employment}
                  onValueChange={setEmployment}
                  options={["Salaried", "Self Employed", "Business"]}
                  containerStyle={styles.modalFormItem}
                  placeholder="Salaried"
                />

                <CustomInput
                  label="Your income"
                  value={income}
                  onChangeText={setIncome}
                  prefix="₹"
                  keyboardType="numeric"
                  suffix="Monthly"
                  containerStyle={styles.modalFormItem}
                  placeholder="1,00,000"
                />

                <CustomInput
                  label="Current total EMI"
                  value={currentEmi}
                  onChangeText={setCurrentEmi}
                  prefix="₹"
                  keyboardType="numeric"
                  suffix="Monthly"
                  containerStyle={styles.modalFormItem}
                  placeholder="10,000"
                />

                <CustomInput
                  label="Full Name (as per PAN)"
                  value={fullName}
                  onChangeText={setFullName}
                  containerStyle={styles.modalFormItemFull}
                  placeholder="Enter your full name"
                />

                <CustomInput
                  label="Your Email Id"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  containerStyle={styles.modalFormItemFull}
                  placeholder="Enter your email"
                />

                <CustomInput
                  label="Mobile Number(OTP verification req)"
                  value={mobile}
                  onChangeText={setMobile}
                  keyboardType="phone-pad"
                  containerStyle={styles.modalFormItemFull}
                  placeholder="Enter your mobile number"
                />
              </View>

              <View style={styles.termsContainer}>
                <CustomCheckbox
                  checked={termsAccepted}
                  onPress={() => setTermsAccepted(!termsAccepted)}
                  label={
                    <Text style={styles.termsText}>
                      I authorize Milestono.com relevant loan providers and
                      their representatives to call, SMS or email me with
                      reference to the application & accept Milestono "
                      <Text style={styles.termsLink}>Terms & Conditions</Text>
                      ". This consent shall override any DNC/NDNC registration.
                    </Text>
                  }
                />
              </View>

              <CustomButton
                title="Submit Details"
                style={styles.submitButton}
                onPress={() => {
                  closeModal();
                }}
              />

              <Text style={styles.privacyText}>
                *Please note that our{" "}
                <Text style={styles.privacyLink}>privacy policy</Text> does not
                govern the use of your data by financial institutions once it is
                shared. For more information, please refer the privacy policy of
                related concerned bank.
              </Text>
            </ScrollView>
          </Animated.View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f7fa",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#FFFFFF",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    zIndex: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
  },
  headerTitleBlue: {
    color: "#3B82F6",
  },
  headerTitlePurple: {
    color: "#8B5CF6",
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerButton: {
    marginLeft: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(59, 130, 246, 0.1)",
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingBottom: 40,
  },
  // Hero Section
  heroSection: {
    width: "100%",
    backgroundColor: "#F3F4F6",
  },
  heroGradient: {
    paddingTop: 30,
    paddingBottom: 40,
    position: "relative",
  },
  heroContent: {
    paddingHorizontal: 16,
  },
  heroTextContainer: {
    marginBottom: 24,
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#1F2937",
    lineHeight: 40,
    marginBottom: 8,
  },
  heroTitleHighlight: {
    color: "#3B82F6",
    fontWeight: "bold",
  },
  heroSubtitle: {
    fontSize: 16,
    color: "#6B7280",
    lineHeight: 24,
  },
  heroFormCard: {
    borderRadius: 16,
    overflow: "hidden",
  },
  heroForm: {
    padding: 20,
  },
  heroImageContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  heroImage: {
    width: width * 0.9,
    height: 200,
  },

  // Banks Section
  banksSection: {
    padding: 16,
    backgroundColor: "#f5f7fa",
  },
  banksSectionHeader: {
    alignItems: "center",
    marginBottom: 24,
  },
  banksSectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1F2937",
    textAlign: "center",
    marginBottom: 16,
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  paginationDot: {
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  banksList: {
    paddingVertical: 8,
  },
  bankCardContainer: {
    width: width * 0.9,
    paddingHorizontal: 10,
  },
  bankCardContent: {
    padding: 16,
  },
  featuredBadge: {
    position: "absolute",
    top: 12,
    right: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  featuredBadgeText: {
    color: "white",
    fontSize: 10,
    fontWeight: "bold",
  },
  bankCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  bankLogoContainer: {
    width: 50,
    height: 30,
    marginRight: 12,
    backgroundColor: "white",
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  bankLogo: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  bankName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1F2937",
  },
  bankDetailsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 16,
  },
  bankDetailItem: {
    width: "50%",
    paddingVertical: 8,
    paddingRight: 8,
  },
  bankDetailLabel: {
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 4,
  },
  bankDetailValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1F2937",
  },
  bankDetailSubtext: {
    fontSize: 10,
    color: "#9CA3AF",
  },
  bankCardActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  emailButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
  },
  emailButtonText: {
    marginLeft: 6,
    color: "#3B82F6",
    fontWeight: "500",
  },

  // Calculator Section
  calculatorSection: {
    padding: 16,
    backgroundColor: "#f5f7fa",
  },
  calculatorHeader: {
    marginBottom: 20,
  },
  calculatorTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 4,
  },
  calculatorSubtitle: {
    fontSize: 14,
    color: "#6B7280",
  },
  calculatorContent: {
    borderRadius: 16,
    overflow: "hidden",
  },
  calculatorForm: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    backgroundColor: "#FFFFFF",
  },
  twoColumnInputs: {
    flexDirection: "row",
    marginTop: 16,
  },
  calculatorResults: {
    padding: 16,
    backgroundColor: "#FFFFFF",
  },
  chartContainer: {
    height: 200,
    marginBottom: 20,
  },
  chartXAxis: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  chartXLabel: {
    fontSize: 10,
    color: "#6B7280",
  },
  chartLegend: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 8,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 8,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 4,
  },
  legendText: {
    fontSize: 12,
    color: "#6B7280",
  },
  resultsContainer: {
    marginTop: 16,
  },
  resultsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  resultItem: {
    flex: 1,
  },
  resultLabel: {
    fontSize: 12,
    color: "#3B82F6",
    fontWeight: "500",
    marginBottom: 4,
  },
  resultValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#3B82F6",
  },
  resultLabelGreen: {
    fontSize: 12,
    color: "#10B981",
    fontWeight: "500",
    marginBottom: 4,
  },
  resultValueGreen: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#10B981",
  },
  emiContainer: {
    alignItems: "center",
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    marginBottom: 16,
  },
  emiLabel: {
    fontSize: 14,
    color: "#3B82F6",
    fontWeight: "500",
    marginBottom: 4,
  },
  emiValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#3B82F6",
  },

  // Card Components
  cardShadow: {
    borderRadius: 16,
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  card: {
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#FFFFFF",
  },

  // Input Components
  inputContainer: {
    marginBottom: 16,
  },
  inputLabelStatic: {
    fontSize: 14,
    fontWeight: "500",
    color: "#374151",
    marginBottom: 6,
  },
  inputWrapper: {
    position: "relative",
    height: 48,
    borderRadius: 8,
    justifyContent: "center",
  },
  input: {
    height: 48,
    paddingHorizontal: 12,
    fontSize: 16,
    color: "#1F2937",
  },
  inputPrefix: {
    position: "absolute",
    left: 12,
    top: 14,
    fontSize: 16,
    color: "#6B7280",
    zIndex: 1,
  },
  inputSuffix: {
    position: "absolute",
    right: 12,
    top: 14,
    fontSize: 14,
    color: "#6B7280",
  },
  inputError: {
    fontSize: 12,
    color: "#EF4444",
    marginTop: 4,
    marginLeft: 4,
  },

  // Dropdown Components
  dropdownContainer: {
    marginBottom: 16,
    zIndex: 10,
  },
  dropdownLabelStatic: {
    fontSize: 14,
    fontWeight: "500",
    color: "#374151",
    marginBottom: 6,
  },
  dropdownButton: {
    height: 48,
    borderRadius: 8,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  dropdownButtonText: {
    fontSize: 16,
    color: "#1F2937",
  },
  dropdownPlaceholder: {
    color: "#9CA3AF",
  },
  dropdownMenu: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    marginTop: 4,
    overflow: "hidden",
    zIndex: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  dropdownItemText: {
    fontSize: 16,
    color: "#1F2937",
  },
  dropdownItemTextSelected: {
    color: "#3B82F6",
    fontWeight: "500",
  },

  // Button Components
  buttonContainer: {
    borderRadius: 8,
    overflow: "hidden",
  },
  button: {
    height: 48,
    borderRadius: 8,
    overflow: "hidden",
  },
  buttonContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  primaryButton: {
    backgroundColor: "#3B82F6",
  },
  secondaryButton: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#D1D5DB",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  primaryButtonText: {
    color: "white",
  },
  secondaryButtonText: {
    color: "#374151",
  },
  buttonIcon: {
    marginRight: 8,
  },

  // Checkbox Components
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  checkboxWrapper: {
    marginRight: 8,
    marginTop: 2,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#D1D5DB",
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxInner: {
    width: 18,
    height: 18,
    borderRadius: 4,
    backgroundColor: "#3B82F6",
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxLabel: {
    flex: 1,
    fontSize: 14,
    color: "#4B5563",
    lineHeight: 20,
  },

  // Modal
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "90%",
    maxHeight: "80%",
    borderRadius: 24,
    overflow: "hidden",
    backgroundColor: "#FFFFFF",
  },
  modalHeader: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    flexDirection: "row",
    alignItems: "flex-start",
  },
  modalTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: "bold",
    color: "#1F2937",
    paddingRight: 24,
  },
  modalCloseButton: {
    padding: 4,
  },
  modalBody: {
    flex: 1,
  },
  modalBodyContent: {
    padding: 16,
  },
  modalFormGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: -8,
  },
  modalFormItem: {
    width: "50%",
    paddingHorizontal: 8,
  },
  modalFormItemFull: {
    width: "100%",
    paddingHorizontal: 8,
  },
  termsContainer: {
    marginTop: 16,
    marginBottom: 24,
  },
  termsText: {
    fontSize: 12,
    color: "#4B5563",
    lineHeight: 18,
  },
  termsLink: {
    color: "#3B82F6",
    textDecorationLine: "underline",
  },
  submitButton: {
    backgroundColor: "#3B82F6",
    marginBottom: 16,
  },
  privacyText: {
    fontSize: 10,
    color: "#9CA3AF",
    textAlign: "center",
    marginBottom: 16,
    lineHeight: 14,
  },
  privacyLink: {
    color: "#3B82F6",
    textDecorationLine: "underline",
  },
});

export default HomeLoanPage;
