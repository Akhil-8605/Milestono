"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
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
  type FlatList,
  Alert,
  ActivityIndicator,
} from "react-native"
import { Svg, Path } from "react-native-svg"
import axios from "axios"
import { BASE_URL } from "@env"

import Header from "./components/Header"
import HomeLoanFaq from "./faqs/homeloanfaq"

// Get screen dimensions
const { width, height } = Dimensions.get("window")

// Types
interface Bank {
  id: string
  bankName: string
  bankImage: string
  interestRate: number
  processingFees: string
  emi: string
  maxLoanAmount: string
  featured?: boolean
}

interface LoanFormData {
  propertyIdentified: string
  propertyCity: string
  propertyCost: string
  employmentType: string
  income: string
  currentEmi: string
  fullName: string
  email: string
  loanAmount: string
  tenure: string
  age: string
  mobile: string
  acceptTerms: boolean
}

const CustomInput: React.FC<{
  label?: string
  value: string
  onChangeText: (text: string) => void
  placeholder?: string
  keyboardType?: "default" | "numeric" | "email-address" | "phone-pad"
  prefix?: string
  suffix?: string
  style?: object
  error?: string
  containerStyle?: object
}> = ({
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
    const [isFocused, setIsFocused] = useState(false)

    const borderColor = error ? "#EF4444" : isFocused ? "#3B82F6" : "#E5E7EB"

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
            style={[styles.input, prefix ? { paddingLeft: 30 } : {}, suffix ? { paddingRight: 60 } : {}]}
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
    )
  }

const CustomButton: React.FC<{
  title: string
  onPress: () => void
  primary?: boolean
  style?: object
  disabled?: boolean
  loading?: boolean
}> = ({ title, onPress, primary = true, style = {}, disabled = false, loading = false }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current

  const handlePressIn = () => {
    if (!disabled && !loading) {
      Animated.spring(scaleAnim, {
        toValue: 0.97,
        friction: 8,
        tension: 100,
        useNativeDriver: true,
      }).start()
    }
  }

  const handlePressOut = () => {
    if (!disabled && !loading) {
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 5,
        tension: 40,
        useNativeDriver: true,
      }).start()
    }
  }

  return (
    <Animated.View
      style={[styles.buttonContainer, { transform: [{ scale: scaleAnim }], opacity: disabled || loading ? 0.6 : 1 }]}
    >
      <TouchableOpacity
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.9}
        disabled={disabled || loading}
        style={[styles.button, primary ? styles.primaryButton : styles.secondaryButton, style]}
      >
        <View style={styles.buttonContent}>
          {loading && <ActivityIndicator size="small" color="white" style={{ marginRight: 8 }} />}
          <Text style={[styles.buttonText, primary ? styles.primaryButtonText : styles.secondaryButtonText]}>
            {loading ? "Loading..." : title}
          </Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  )
}

const CustomDropdown: React.FC<{
  label?: string
  value: string
  onValueChange: (value: string) => void
  options: string[]
  style?: object
  error?: string
  containerStyle?: object
  placeholder?: string
}> = ({ label, value, onValueChange, options, style = {}, error, containerStyle = {}, placeholder = "Select" }) => {
  const [isOpen, setIsOpen] = useState(false)
  const rotateAnim = useRef(new Animated.Value(0)).current
  const heightAnim = useRef(new Animated.Value(0)).current

  useEffect(() => {
    Animated.timing(rotateAnim, {
      toValue: isOpen ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start()

    Animated.timing(heightAnim, {
      toValue: isOpen ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start()
  }, [isOpen])

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  })

  const menuHeight = heightAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, Math.min(options.length * 50, 200)],
  })

  const borderColor = error ? "#EF4444" : isOpen ? "#3B82F6" : "#E5E7EB"

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
        <Text style={[styles.dropdownButtonText, !value && styles.dropdownPlaceholder, isOpen && { color: "#3B82F6" }]}>
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
                style={[styles.dropdownItem, index === options.length - 1 && { borderBottomWidth: 0 }]}
                onPress={() => {
                  onValueChange(option)
                  setIsOpen(false)
                }}
              >
                <Text style={[styles.dropdownItemText, value === option && styles.dropdownItemTextSelected]}>
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
  )
}

const CustomCheckbox: React.FC<{
  checked: boolean
  onPress: () => void
  label?: React.ReactNode
  style?: object
}> = ({ checked, onPress, label, style = {} }) => {
  const scaleAnim = useRef(new Animated.Value(checked ? 1 : 0)).current

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: checked ? 1 : 0,
      friction: 8,
      tension: 300,
      useNativeDriver: true,
    }).start()
  }, [checked])

  return (
    <TouchableOpacity style={[styles.checkboxContainer, style]} onPress={onPress} activeOpacity={0.8}>
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
              <Path d="M5 13L9 17L19 7" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            </Svg>
          </Animated.View>
        </View>
      </View>

      {label && <Text style={styles.checkboxLabel}>{label}</Text>}
    </TouchableOpacity>
  )
}

// Loan Calculator Component
const LoanCalculator: React.FC<{
  onCalculate: (results: { loanAmount: string; tenure: string }) => void
}> = ({ onCalculate }) => {
  const [age, setAge] = useState("35")
  const [occupation, setOccupation] = useState("Salaried")
  const [income, setIncome] = useState("100000")
  const [existingEmi, setExistingEmi] = useState("10000")
  const [interestRate, setInterestRate] = useState("8.5")
  const [tenure, setTenure] = useState("20")

  const [maxLoanAmount, setMaxLoanAmount] = useState("₹0")
  const [totalPayable, setTotalPayable] = useState("₹0")
  const [monthlyEmi, setMonthlyEmi] = useState("₹0")
  const [isCalculating, setIsCalculating] = useState(false)
  const [showResults, setShowResults] = useState(false)

  const calculateLoan = () => {
    setIsCalculating(true)

    setTimeout(() => {
      const incomeNum = Number.parseFloat(income.replace(/,/g, ""))
      const emiNum = Number.parseFloat(existingEmi.replace(/,/g, ""))
      const rateNum = Number.parseFloat(interestRate)
      const tenureNum = Number.parseFloat(tenure)

      if (isNaN(incomeNum) || isNaN(emiNum) || isNaN(rateNum) || isNaN(tenureNum)) {
        Alert.alert("Error", "Please enter valid numbers for all fields")
        setIsCalculating(false)
        return
      }

      const eligibleIncome = incomeNum - emiNum
      const eligibleLoanMultiplier = 50 - Number.parseFloat(age) / 10
      const maxLoan = eligibleIncome * eligibleLoanMultiplier

      const monthlyRate = rateNum / 12 / 100
      const totalMonths = tenureNum * 12
      const emi =
        (maxLoan * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / (Math.pow(1 + monthlyRate, totalMonths) - 1)
      const totalPayableAmount = emi * totalMonths

      const formatCurrency = (amount: number) => {
        if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(1)} Cr`
        if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)} L`
        return `₹${Math.round(amount).toLocaleString()}`
      }

      setMaxLoanAmount(formatCurrency(maxLoan))
      setTotalPayable(formatCurrency(totalPayableAmount))
      setMonthlyEmi(formatCurrency(emi))
      setShowResults(true)
      setIsCalculating(false)

      if (onCalculate) {
        onCalculate({
          loanAmount: maxLoan.toString(),
          tenure,
        })
      }
    }, 1000)
  }

  return (
    <View style={styles.calculatorSection}>
      <View style={styles.calculatorHeader}>
        <Text style={styles.calculatorTitle}>Calculate housing loan eligibility</Text>
        <Text style={styles.calculatorSubtitle}>
          Calculate your borrowing eligibility by submitting your details below
        </Text>
      </View>

      <View style={styles.calculatorCard}>
        <View style={styles.calculatorForm}>
          <CustomInput label="Your Age" value={age} onChangeText={setAge} keyboardType="numeric" />

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

          <CustomButton title="Calculate" onPress={calculateLoan} style={{ marginTop: 16 }} loading={isCalculating} />
        </View>

        {showResults && (
          <View style={styles.calculatorResults}>
            <View style={styles.resultsRow}>
              <View style={styles.resultItem}>
                <Text style={styles.resultLabel}>You could borrow up to:</Text>
                <Text style={styles.resultValue}>{maxLoanAmount}</Text>
              </View>

              <View style={styles.resultItem}>
                <Text style={styles.resultLabelGreen}>Total Payable Amount:</Text>
                <Text style={styles.resultValueGreen}>{totalPayable}</Text>
              </View>
            </View>

            <View style={styles.emiContainer}>
              <Text style={styles.emiLabel}>Monthly EMI:</Text>
              <Text style={styles.emiValue}>{monthlyEmi}</Text>
            </View>

            <CustomButton
              title="Apply for Loan"
              onPress={() => Alert.alert("Success", "Loan application initiated!")}
              style={{ backgroundColor: "#10B981" }}
            />
          </View>
        )}
      </View>
    </View>
  )
}

// Banks Table Component
const BanksTable: React.FC<{
  banks: Bank[]
  onGetDeal: (bankName: string) => void
  loading: boolean
}> = ({ banks, onGetDeal, loading }) => {
  const scrollX = useRef(new Animated.Value(0)).current
  const [activeIndex, setActiveIndex] = useState(0)
  const flatListRef = useRef<FlatList>(null)

  useEffect(() => {
    const listener = scrollX.addListener(({ value }) => {
      const index = Math.round(value / width)
      setActiveIndex(index)
    })

    return () => {
      scrollX.removeListener(listener)
    }
  }, [])

  const renderBankCard = ({ item, index }: { item: Bank; index: number }) => {
    const inputRange = [(index - 1) * width, index * width, (index + 1) * width]

    const scale = scrollX.interpolate({
      inputRange,
      outputRange: [0.9, 1, 0.9],
      extrapolate: "clamp",
    })

    const opacity = scrollX.interpolate({
      inputRange,
      outputRange: [0.6, 1, 0.6],
      extrapolate: "clamp",
    })

    return (
      <Animated.View
        style={[
          styles.bankCardContainer,
          {
            transform: [{ scale }],
            opacity,
          },
        ]}
      >
        <View style={styles.bankCard}>
          <View style={styles.bankCardContent}>
            {item.featured && (
              <View style={styles.featuredBadge}>
                <Text style={styles.featuredBadgeText}>FEATURED</Text>
              </View>
            )}

            <View style={styles.bankCardHeader}>
              <View style={styles.bankLogoContainer}>
                <Image source={{ uri: item.bankImage }} style={styles.bankLogo} />
              </View>
              <Text style={styles.bankName}>{item.bankName}</Text>
            </View>

            <View style={styles.bankDetailsGrid}>
              <View style={styles.bankDetailItem}>
                <Text style={styles.bankDetailLabel}>Rate of interest</Text>
                <Text style={[styles.bankDetailValue, { color: "#3B82F6" }]}>{item.interestRate}%</Text>
              </View>

              <View style={styles.bankDetailItem}>
                <Text style={styles.bankDetailLabel}>Processing fees</Text>
                <Text style={styles.bankDetailValue}>{item.processingFees}</Text>
              </View>

              <View style={styles.bankDetailItem}>
                <Text style={styles.bankDetailLabel}>EMI</Text>
                <Text style={[styles.bankDetailValue, { color: "#3B82F6" }]}>{item.emi}</Text>
              </View>

              <View style={styles.bankDetailItem}>
                <Text style={styles.bankDetailLabel}>Max. loan amount</Text>
                <View>
                  <Text style={[styles.bankDetailValue, { color: "#3B82F6" }]}>{item.maxLoanAmount}</Text>
                  <Text style={styles.bankDetailSubtext}>Loan to value ratio</Text>
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
                onPress={() => onGetDeal(item.bankName)}
                style={{ backgroundColor: "#3B82F6", flex: 1, marginLeft: 8 }}
              />
            </View>
          </View>
        </View>
      </Animated.View>
    )
  }

  if (loading) {
    return (
      <View style={styles.banksSection}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text style={styles.loadingText}>Loading bank offers...</Text>
        </View>
      </View>
    )
  }

  return (
    <View style={styles.banksSection}>
      <View style={styles.banksSectionHeader}>
        <Text style={styles.banksSectionTitle}>
          Hi! We have <Text style={{ color: "#3B82F6" }}>{banks.length} offers</Text> for you to compare and choose the
          best
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
                  })
                }
              }}
            >
              <Animated.View
                style={[
                  styles.paginationDot,
                  {
                    backgroundColor: activeIndex === index ? "#3B82F6" : "#D1D5DB",
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
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], {
          useNativeDriver: true,
        })}
        scrollEventThrottle={16}
        contentContainerStyle={styles.banksList}
      />
    </View>
  )
}

// Main Component
const HomeLoanPage: React.FC = () => {

  const [banks, setBanks] = useState<Bank[]>([])
  const [banksLoading, setBanksLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [loanAmount, setLoanAmount] = useState("300000")
  const [tenure, setTenure] = useState("20")
  const [age, setAge] = useState("35")
  const [selectedBank, setSelectedBank] = useState<string | null>(null)
  const [formSubmitting, setFormSubmitting] = useState(false)

  // Form state for modal
  const [formData, setFormData] = useState<LoanFormData>({
    propertyIdentified: "",
    propertyCity: "Delhi",
    propertyCost: "37,50,000",
    employmentType: "Salaried",
    income: "1,00,000",
    currentEmi: "10,000",
    fullName: "",
    email: "",
    loanAmount: "",
    tenure: "",
    age: "",
    mobile: "",
    acceptTerms: false,
  })

  const scrollY = useRef(new Animated.Value(0)).current
  const modalScaleAnim = useRef(new Animated.Value(0)).current
  const modalBackdropAnim = useRef(new Animated.Value(0)).current

  // Fetch banks data
  const fetchBanks = async () => {
    try {
      setBanksLoading(true)
      const response = await axios.get(`${BASE_URL}/api/bank`)

      if (response.data && Array.isArray(response.data)) {
        setBanks(response.data)
      } else {
        throw new Error("Invalid response format")
      }
    } catch (error) {
      console.error("Error fetching banks:", error)
      Alert.alert("Error", "Failed to load bank offers. Please try again later.")
      // Fallback to mock data
    } finally {
      setBanksLoading(false)
    }
  }

  useEffect(() => {
    fetchBanks()
  }, [])

  // Animated values for hero section
  const heroOpacity = scrollY.interpolate({
    inputRange: [0, 200],
    outputRange: [1, 0.3],
    extrapolate: "clamp",
  })

  const heroScale = scrollY.interpolate({
    inputRange: [0, 200],
    outputRange: [1, 0.95],
    extrapolate: "clamp",
  })

  const heroTranslateY = scrollY.interpolate({
    inputRange: [0, 200],
    outputRange: [0, -30],
    extrapolate: "clamp",
  })

  const handleGetStarted = () => {
    setFormData({
      ...formData,
      loanAmount,
      tenure,
      age,
    })
    setIsModalOpen(true)
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
    ]).start()
  }

  const handleGetDeal = (bankName: string) => {
    setSelectedBank(bankName)
    setFormData({
      ...formData,
      loanAmount,
      tenure,
      age,
    })
    setIsModalOpen(true)
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
    ]).start()
  }

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
      setIsModalOpen(false)
      setSelectedBank(null)
    })
  }

  const handleSubmit = async () => {
    try {
      if (!formData.acceptTerms) {
        Alert.alert("Error", "You must accept the terms and conditions.")
        return
      }

      if (!formData.fullName || !formData.email || !formData.mobile) {
        Alert.alert("Error", "Please fill in all required fields.")
        return
      }

      setFormSubmitting(true)
      await axios.post(`${BASE_URL}/api/bank-users`, formData)

      Alert.alert("Success", "Form submitted successfully!", [
        {
          text: "OK",
          onPress: () => {
            setFormData({
              propertyIdentified: "",
              propertyCity: "Delhi",
              propertyCost: "37,50,000",
              employmentType: "Salaried",
              income: "1,00,000",
              currentEmi: "10,000",
              fullName: "",
              email: "",
              loanAmount: "",
              tenure: "",
              age: "",
              mobile: "",
              acceptTerms: false,
            })
            closeModal()
          },
        },
      ])
    } catch (error) {
      console.error("Error submitting form:", error)
      Alert.alert("Error", "An error occurred while submitting the form. Please try again later.")
    } finally {
      setFormSubmitting(false)
    }
  }

  const handleCalculatorResults = (results: { loanAmount: string; tenure: string }) => {
    if (results && results.loanAmount) {
      setLoanAmount(results.loanAmount)
    }
    if (results && results.tenure) {
      setTenure(results.tenure)
    }
  }

  const statusBarHeight = StatusBar.currentHeight || 0

  return (
    <SafeAreaView style={[styles.container, { marginTop: statusBarHeight }]}>
      <StatusBar barStyle="dark-content" backgroundColor="#f5f7fa" />

      {/* Add Header here */}
      <Header />

      <Animated.ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContent}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
          useNativeDriver: true,
        })}
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
          <View style={styles.heroContent}>
            <View style={styles.heroTextContainer}>
              <Text style={styles.heroTitle}>
                Let's find you the best{"\n"}
                <Text style={styles.heroTitleHighlight}>home loan</Text> deal.
              </Text>
              <Text style={styles.heroSubtitle}>Compare rates from top banks and find your perfect match</Text>
            </View>

            <View style={styles.heroFormCard}>
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

                <CustomInput label="Your Age" value={age} onChangeText={setAge} keyboardType="numeric" suffix="Years" />

                <CustomButton title="Let's get started" onPress={handleGetStarted} style={{ marginTop: 16 }} />
              </View>
            </View>
          </View>
        </Animated.View>

        {/* Banks Section */}
        <BanksTable banks={banks} onGetDeal={handleGetDeal} loading={banksLoading} />

        {/* Loan Calculator Section */}
        <LoanCalculator onCalculate={handleCalculatorResults} />

        {/* FAQ Section - Replace <FAQSection /> with: */}
        <HomeLoanFaq />
      </Animated.ScrollView>

      {/* Modal */}
      <Modal visible={isModalOpen} transparent={true} animationType="none" onRequestClose={closeModal}>
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.modalContainer}>
          <Animated.View style={[styles.modalOverlay, { opacity: modalBackdropAnim }]}>
            <TouchableOpacity style={{ flex: 1 }} activeOpacity={1} onPress={closeModal} />
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
                We just need a few details to match you with the right home loan product
                {selectedBank && ` from ${selectedBank}`}
              </Text>
              <TouchableOpacity style={styles.modalCloseButton} onPress={closeModal} activeOpacity={0.8}>
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

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.modalBodyContent}>
              <View style={styles.modalFormGrid}>
                <CustomInput
                  label="Loan amount"
                  value={formData.loanAmount}
                  onChangeText={(text) => setFormData({ ...formData, loanAmount: text })}
                  keyboardType="numeric"
                  prefix="₹"
                  containerStyle={styles.modalFormItem}
                />

                <CustomInput
                  label="Tenure"
                  value={formData.tenure}
                  onChangeText={(text) => setFormData({ ...formData, tenure: text })}
                  keyboardType="numeric"
                  suffix="Years"
                  containerStyle={styles.modalFormItem}
                />

                <CustomInput
                  label="Your Age"
                  value={formData.age}
                  onChangeText={(text) => setFormData({ ...formData, age: text })}
                  keyboardType="numeric"
                  suffix="Years"
                  containerStyle={styles.modalFormItem}
                />

                <CustomDropdown
                  label="Is your property identified"
                  value={formData.propertyIdentified}
                  onValueChange={(value) => setFormData({ ...formData, propertyIdentified: value })}
                  options={["Yes", "No"]}
                  containerStyle={styles.modalFormItem}
                />

                <CustomInput
                  label="Property city"
                  value={formData.propertyCity}
                  onChangeText={(text) => setFormData({ ...formData, propertyCity: text })}
                  containerStyle={styles.modalFormItem}
                />

                <CustomInput
                  label="Property Cost"
                  value={formData.propertyCost}
                  onChangeText={(text) => setFormData({ ...formData, propertyCost: text })}
                  prefix="₹"
                  keyboardType="numeric"
                  containerStyle={styles.modalFormItem}
                />

                <CustomDropdown
                  label="How are you currently employed"
                  value={formData.employmentType}
                  onValueChange={(value) => setFormData({ ...formData, employmentType: value })}
                  options={["Salaried", "Self Employed", "Business"]}
                  containerStyle={styles.modalFormItem}
                />

                <CustomInput
                  label="Your income"
                  value={formData.income}
                  onChangeText={(text) => setFormData({ ...formData, income: text })}
                  prefix="₹"
                  keyboardType="numeric"
                  suffix="Monthly"
                  containerStyle={styles.modalFormItem}
                />

                <CustomInput
                  label="Current total EMI"
                  value={formData.currentEmi}
                  onChangeText={(text) => setFormData({ ...formData, currentEmi: text })}
                  prefix="₹"
                  keyboardType="numeric"
                  suffix="Monthly"
                  containerStyle={styles.modalFormItem}
                />

                <CustomInput
                  label="Full Name (as per PAN)"
                  value={formData.fullName}
                  onChangeText={(text) => setFormData({ ...formData, fullName: text })}
                  containerStyle={styles.modalFormItemFull}
                />

                <CustomInput
                  label="Your Email Id"
                  value={formData.email}
                  onChangeText={(text) => setFormData({ ...formData, email: text })}
                  keyboardType="email-address"
                  containerStyle={styles.modalFormItemFull}
                />

                <CustomInput
                  label="Mobile Number(OTP verification req)"
                  value={formData.mobile}
                  onChangeText={(text) => setFormData({ ...formData, mobile: text })}
                  keyboardType="phone-pad"
                  containerStyle={styles.modalFormItemFull}
                />
              </View>

              <View style={styles.termsContainer}>
                <CustomCheckbox
                  checked={formData.acceptTerms}
                  onPress={() => setFormData({ ...formData, acceptTerms: !formData.acceptTerms })}
                  label={
                    <Text style={styles.termsText}>
                      I authorize Milestono.com relevant loan providers and their representatives to call, SMS or email
                      me with reference to the application & accept Milestono "
                      <Text style={styles.termsLink}>Terms & Conditions</Text>". This consent shall override any
                      DNC/NDNC registration.
                    </Text>
                  }
                />
              </View>

              <CustomButton
                title="Submit Details"
                style={styles.submitButton}
                onPress={handleSubmit}
                loading={formSubmitting}
              />

              <Text style={styles.privacyText}>
                *Please note that our <Text style={styles.privacyLink}>privacy policy</Text> does not govern the use of
                your data by financial institutions once it is shared. For more information, please refer the privacy
                policy of related concerned bank.
              </Text>
            </ScrollView>
          </Animated.View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f7fa",
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingBottom: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#6B7280",
  },

  // Hero Section
  heroSection: {
    backgroundColor: "#F3F4F6",
    paddingTop: 30,
    paddingBottom: 40,
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
    backgroundColor: "white",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  heroForm: {
    padding: 20,
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
  bankCard: {
    backgroundColor: "white",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  bankCardContent: {
    padding: 16,
  },
  featuredBadge: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: "#3B82F6",
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
    borderWidth: 1,
    borderColor: "#E5E7EB",
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
  calculatorCard: {
    backgroundColor: "white",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  calculatorForm: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  twoColumnInputs: {
    flexDirection: "row",
    marginTop: 16,
  },
  calculatorResults: {
    padding: 16,
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
})

export default HomeLoanPage;