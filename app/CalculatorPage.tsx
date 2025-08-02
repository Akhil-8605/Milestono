"use client"

import { useState, useMemo } from "react"
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Alert, StatusBar } from "react-native"
import Slider from "@react-native-community/slider"
import { LinearGradient } from "expo-linear-gradient"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { PieChart, BarChart, LineChart } from "react-native-chart-kit" // Import chart components

const { width, height } = Dimensions.get("window")

const PropertyCalculatorPage = () => {
    // Default Values
    const DEFAULTS = {
        propertyValue: 500000,
        downPaymentPercentage: 20,
        loanTerm: 20,
        interestRate: 8.5,
        propertyTaxRate: 1.3,
        appreciationRate: 6,
        maintenanceRate: 1,
        insuranceRate: 0.5,
        rentalYield: 3,
        activeTab: "breakdown",
    }

    // Input States
    const [propertyValue, setPropertyValue] = useState(DEFAULTS.propertyValue)
    const [downPaymentPercentage, setDownPaymentPercentage] = useState(DEFAULTS.downPaymentPercentage)
    const [loanTerm, setLoanTerm] = useState(DEFAULTS.loanTerm)
    const [interestRate, setInterestRate] = useState(DEFAULTS.interestRate)
    const [propertyTaxRate, setPropertyTaxRate] = useState(DEFAULTS.propertyTaxRate)
    const [appreciationRate, setAppreciationRate] = useState(DEFAULTS.appreciationRate)
    const [maintenanceRate, setMaintenanceRate] = useState(DEFAULTS.maintenanceRate)
    const [insuranceRate, setInsuranceRate] = useState(DEFAULTS.insuranceRate)
    const [rentalYield, setRentalYield] = useState(DEFAULTS.rentalYield)
    const [activeTab, setActiveTab] = useState(DEFAULTS.activeTab)

    // Reset handler
    const handleReset = () => {
        Alert.alert("Reset", "All inputs have been reset to default values!", [{ text: "OK" }])

        setPropertyValue(DEFAULTS.propertyValue)
        setDownPaymentPercentage(DEFAULTS.downPaymentPercentage)
        setLoanTerm(DEFAULTS.loanTerm)
        setInterestRate(DEFAULTS.interestRate)
        setPropertyTaxRate(DEFAULTS.propertyTaxRate)
        setAppreciationRate(DEFAULTS.appreciationRate)
        setMaintenanceRate(DEFAULTS.maintenanceRate)
        setInsuranceRate(DEFAULTS.insuranceRate)
        setRentalYield(DEFAULTS.rentalYield)
        setActiveTab(DEFAULTS.activeTab)
    }

    // Export PDF handler (placeholder)
    const handleExport = async () => {
        Alert.alert(
            "Export Report",
            "PDF export functionality needs to be implemented using Expo Print and Expo Sharing. This may take some time to generate.",
            [{ text: "OK" }],
        )
    }

    // Calculated Values
    const calculations = useMemo(() => {
        const downPayment = (propertyValue * downPaymentPercentage) / 100
        const loanAmount = propertyValue - downPayment
        const monthlyInterestRate = interestRate / 1200
        const totalMonths = loanTerm * 12

        const emi =
            loanAmount > 0
                ? (loanAmount * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, totalMonths)) /
                (Math.pow(1 + monthlyInterestRate, totalMonths) - 1)
                : 0

        const annualPropertyTax = (propertyValue * propertyTaxRate) / 100
        const annualMaintenance = (propertyValue * maintenanceRate) / 100
        const annualInsurance = (propertyValue * insuranceRate) / 100
        const monthlyPropertyTax = annualPropertyTax / 12
        const monthlyMaintenance = annualMaintenance / 12
        const monthlyInsurance = annualInsurance / 12

        const totalMonthlyPayment = emi + monthlyPropertyTax + monthlyMaintenance + monthlyInsurance

        const totalInterestPaid = emi * totalMonths - loanAmount

        const monthlyRentalIncome = (propertyValue * rentalYield) / 1200

        const monthlyCashFlow = monthlyRentalIncome - totalMonthlyPayment

        const futureValue = propertyValue * Math.pow(1 + appreciationRate / 100, loanTerm)
        const totalAppreciation = futureValue - propertyValue

        const totalInvestment = downPayment + totalMonthlyPayment * totalMonths
        const totalReturns = futureValue + monthlyRentalIncome * totalMonths
        const roi = totalInvestment > 0 ? ((totalReturns - totalInvestment) / totalInvestment) * 100 : 0

        return {
            propertyValue,
            downPayment,
            loanAmount,
            emi,
            monthlyPropertyTax,
            monthlyMaintenance,
            monthlyInsurance,
            totalMonthlyPayment,
            totalInterestPaid,
            monthlyRentalIncome,
            monthlyCashFlow,
            futureValue,
            totalAppreciation,
            roi,
            annualPropertyTax,
            annualMaintenance,
            annualInsurance,
        }
    }, [
        propertyValue,
        downPaymentPercentage,
        loanTerm,
        interestRate,
        propertyTaxRate,
        appreciationRate,
        maintenanceRate,
        insuranceRate,
        rentalYield,
    ])

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0,
        }).format(amount)
    }

    // Chart Data for react-native-chart-kit
    const paymentBreakdownData = [
        { name: "P&I", population: calculations.emi, color: "#8b5cf6", legendFontColor: "#7F7F7F", legendFontSize: 15 },
        {
            name: "Tax",
            population: calculations.monthlyPropertyTax,
            color: "#06b6d4",
            legendFontColor: "#7F7F7F",
            legendFontSize: 15,
        },
        {
            name: "Maint.",
            population: calculations.monthlyMaintenance,
            color: "#10b981",
            legendFontColor: "#7F7F7F",
            legendFontSize: 15,
        },
        {
            name: "Ins.",
            population: calculations.monthlyInsurance,
            color: "#f59e0b",
            legendFontColor: "#7F7F7F",
            legendFontSize: 15,
        },
    ]

    const amortizationData = useMemo(() => {
        const data = []
        let remainingBalance = calculations.loanAmount
        const monthlyRate = interestRate / 1200

        const years = Math.min(loanTerm, 10) // Show first 10 years for readability

        for (let year = 1; year <= years; year++) {
            let yearlyPrincipal = 0
            let yearlyInterest = 0

            for (let month = 1; month <= 12; month++) {
                if (remainingBalance > 0) {
                    const interestPayment = remainingBalance * monthlyRate
                    const principalPayment = calculations.emi - interestPayment

                    yearlyPrincipal += principalPayment
                    yearlyInterest += interestPayment
                    remainingBalance -= principalPayment
                }
            }

            data.push({
                year: `Year ${year}`,
                principal: Math.round(yearlyPrincipal),
                interest: Math.round(yearlyInterest),
            })
        }

        return {
            labels: data.map((d) => d.year),
            datasets: [
                {
                    data: data.map((d) => d.principal),
                    color: (opacity = 1) => `rgba(139, 92, 246, ${opacity})`, // Violet
                    strokeWidth: 2,
                    name: "Principal",
                },
                {
                    data: data.map((d) => d.interest),
                    color: (opacity = 1) => `rgba(6, 182, 212, ${opacity})`, // Cyan
                    strokeWidth: 2,
                    name: "Interest",
                },
            ],
        }
    }, [calculations.loanAmount, calculations.emi, interestRate, loanTerm])

    const propertyGrowthData = useMemo(() => {
        const data = []
        const years = Math.min(loanTerm, 10) // Show first 10 years for readability

        for (let year = 0; year <= years; year++) {
            const value = propertyValue * Math.pow(1 + appreciationRate / 100, year)
            const equity =
                year === 0
                    ? calculations.downPayment
                    : Math.round(
                        value - calculations.loanAmount * Math.pow(1 - (calculations.emi * 12) / calculations.loanAmount, year),
                    ) // Simplified equity calculation for chart
            data.push({
                year: `Year ${year}`,
                value: Math.round(value),
                equity: Math.round(equity),
            })
        }

        return {
            labels: data.map((d) => d.year),
            datasets: [
                {
                    data: data.map((d) => d.value),
                    color: (opacity = 1) => `rgba(16, 185, 129, ${opacity})`, // Emerald
                    strokeWidth: 2,
                    name: "Property Value",
                },
                {
                    data: data.map((d) => d.equity),
                    color: (opacity = 1) => `rgba(139, 92, 246, ${opacity})`, // Violet
                    strokeWidth: 2,
                    name: "Equity",
                },
            ],
        }
    }, [propertyValue, appreciationRate, loanTerm, calculations])

    const chartConfig = {
        backgroundGradientFrom: "#ffffff",
        backgroundGradientTo: "#ffffff",
        decimalPlaces: 0, // optional, defaults to 2dp
        color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        strokeWidth: 2, // optional, default 3
        barPercentage: 0.5,
        useShadowColorFromDataset: false, // optional
        propsForDots: {
            r: "6",
            strokeWidth: "2",
            stroke: "#ffa726",
        },
        // Added for yAxisLabel and yAxisSuffix
        formatYLabel: (yLabel: string) => formatCurrency(Number(yLabel)),
    }

    const styles = StyleSheet.create({
        calculatorWrapper: {
            flex: 1,
            backgroundColor: "#f1f5f9", // Light grey background
            paddingHorizontal: width > 768 ? 32 : 16,
            paddingVertical: 16,
        },
        calculatorContainer: {
            flexGrow: 1,
            alignSelf: "center",
            gap: 24,
        },
        headerSection: {
            alignItems: "center",
            paddingVertical: 32,
        },
        headerContent: {
            maxWidth: 800,
            alignItems: "center",
            gap: 16,
        },
        titleWrapper: {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 12,
            flexWrap: "wrap",
        },
        titleIcon: {
            padding: 12,
            borderRadius: 9999,
            alignItems: "center",
            justifyContent: "center",
        },
        calculatorIcon: {
            width: 32,
            height: 32,
            color: "#7c3aed",
        },
        mainTitle: {
            fontSize: width > 768 ? 40 : width > 480 ? 32 : 28,
            fontWeight: "700",
            color: "#7c3aed",
            textAlign: "center",
        },
        subtitle: {
            fontSize: 18,
            color: "#64748b",
            maxWidth: 600,
            textAlign: "center",
        },
        mainContentArea: {
            flexDirection: width > 1200 ? "row" : "column",
            gap: 24,
        },
        inputPanel: {
            flex: 1,
            flexDirection: "column",
            gap: 24,
            padding: 10
        },
        resultsPanel: {
            flex: 1,
            flexDirection: "column",
            gap: 24,
        },
        card: {
            backgroundColor: "white",
            borderRadius: 16,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 5, // For Android shadow
            overflow: "hidden",
        },
        cardHeader: {
            paddingHorizontal: 24,
            paddingVertical: 16,
            borderBottomWidth: 1,
            borderBottomColor: "#e2e8f0",
        },
        cardTitle: {
            flexDirection: "row",
            alignItems: "center",
            gap: 20,
            fontSize: 16,
            fontWeight: "600",
            color: "#1e293b",
        },
        icon: {
            width: 20,
            height: 20,
            color: "#7c3aed",
        },
        cardContent: {
            padding: 24,
            flexDirection: "column",
            gap: 24,
        },
        inputGroup: {
            flexDirection: "column",
            gap: 8,
        },
        inputLabel: {
            fontSize: 14,
            fontWeight: "500",
            color: "#475569",
        },
        numberInput: {
            paddingHorizontal: 16,
            paddingVertical: 12,
            borderWidth: 1,
            borderColor: "#d1d5db",
            borderRadius: 8,
            fontSize: 18,
            fontWeight: "600",
            backgroundColor: "white",
            color: "#1e293b",
        },
        inputHelper: {
            fontSize: 14,
            color: "#64748b",
        },
        sliderGroup: {
            flexDirection: "column",
            gap: 12,
        },
        sliderLabel: {
            fontSize: 14,
            fontWeight: "500",
            color: "#475569",
        },
        slider: {
            width: "100%",
            height: 40,
        },
        sliderRange: {
            flexDirection: "row",
            justifyContent: "space-between",
            fontSize: 12,
            color: "#64748b",
        },
        sliderValue: {
            fontWeight: "500",
        },
        metricsGrid: {
            gridTemplateRows: "1fr 1fr",
            gap: 16,
            justifyContent: "center",
        },
        metricCard: {
            borderRadius: 16,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 5,
            flex: 1,
            padding: 20,
            alignContent: "center",
            alignItems: "center",
        },
        metricContent: {
            flexDirection: "column",
            gap: 8,
        },
        metricHeader: {
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
        },
        metricIcon: {
            width: 18,
            height: 18,
            color: "white",
        },
        metricLabel: {
            fontSize: 14,
            fontWeight: "500",
            opacity: 0.9,
            color: "white",
        },
        metricValue: {
            fontSize: width > 480 ? 24 : 20,
            fontWeight: "700",
            color: "white",
        },
        positiveValue: {
            color: "#dcfce7",
        },
        negativeValue: {
            color: "#fecaca",
        },
        chartsSection: {
            marginTop: 24,
            overflow: "scroll",
            marginBottom: 100
        },
        tabsContainer: {
            backgroundColor: "white",
            borderRadius: 16,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 5,
            overflow: "hidden",
        },
        tabsList: {
            flexDirection: width > 768 ? "row" : "column",
            backgroundColor: "white",
            borderBottomWidth: 1,
            borderBottomColor: "#e2e8f0",
        },
        tabButton: {
            flex: 1,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            paddingVertical: width > 480 ? 12 : 16,
            paddingHorizontal: 16,
            backgroundColor: "transparent",
            borderBottomWidth: 2,
            borderBottomColor: "transparent",
        },
        tabButtonActive: {
            color: "#7c3aed",
            borderBottomColor: "#7c3aed",
            backgroundColor: "#faf5ff",
        },
        tabButtonText: {
            color: "#64748b",
            fontWeight: "500",
        },
        tabButtonTextActive: {
            color: "#7c3aed",
        },
        tabIcon: {
            width: 16,
            height: 16,
            color: "#64748b",
        },
        tabIconActive: {
            color: "#7c3aed",
        },
        tabContent: {
            padding: 24,
        },
        chartCard: {
            flexDirection: "column",
            gap: 24,
        },
        chartHeader: {
            alignItems: "center",
        },
        chartTitle: {
            fontSize: 18,
            fontWeight: "600",
            color: "#1e293b",
            textAlign: "center",
            marginBottom: 16,
        },
        chartContainer: {
            width: "100%",
            height: width > 480 ? 400 : 300,
            alignSelf: "center",
        },
        legendGrid: {
            flexDirection: width > 768 ? "row" : "column",
            flexWrap: "wrap",
            gap: 16,
            marginTop: 24,
        },
        legendItem: {
            flexDirection: "row",
            alignItems: "center",
            gap: 12,
            flex: 1,
        },
        legendColor: {
            width: 16,
            height: 16,
            borderRadius: 9999,
        },
        legendContent: {
            flexDirection: "column",
        },
        legendName: {
            fontSize: 14,
            color: "#64748b",
        },
        legendValue: {
            fontWeight: "600",
            color: "#1e293b",
        },
        summaryContent: {
            flexDirection: "column",
            gap: 24,
        },
        summaryCard: {
            flexDirection: "column",
            gap: 24,
        },
        summaryHeader: {
            alignItems: "center",
        },
        summaryTitle: {
            fontSize: 18,
            fontWeight: "600",
            color: "#1e293b",
            textAlign: "center",
        },
        summaryGrid: {
            flexDirection: "row",
            flexWrap: "wrap",
            gap: 24,
            justifyContent: "center",
        },
        summarySection: {
            backgroundColor: "#f8fafc",
            padding: 20,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: "#e2e8f0",
            minWidth: 280,
            flexGrow: 1,
        },
        sectionTitle: {
            fontSize: 16,
            fontWeight: "600",
            color: "#1e293b",
            marginBottom: 12,
            paddingBottom: 8,
            borderBottomWidth: 2,
            borderBottomColor: "#e2e8f0",
        },
        summaryItems: {
            flexDirection: "column",
            gap: 8,
        },
        summaryItem: {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingVertical: 8,
            fontSize: 14,
            borderBottomWidth: 1,
            borderBottomColor: "#e2e8f0",
        },
        lastSummaryItem: {
            borderBottomWidth: 0,
        },
        totalSummaryItem: {
            fontWeight: "600",
            color: "#1e293b",
            borderTopWidth: 2,
            borderTopColor: "#3b82f6",
            marginTop: 10,
            paddingTop: 15,
        },
        summarySeparator: {
            height: 1,
            backgroundColor: "#e2e8f0",
            marginVertical: 10,
        },
        itemLabel: {
            color: "#64748b",
        },
        itemValue: {
            fontWeight: "500",
            color: "#1e293b",
        },
        itemPositive: {
            color: "#059669",
        },
        itemNegative: {
            color: "#dc2626",
        },
        itemViolet: {
            color: "#7c3aed",
        },
        badgesSection: {
            paddingTop: 16,
            borderTopWidth: 1,
            borderTopColor: "#e2e8f0",
        },
        badgeList: {
            flexDirection: "row",
            flexWrap: "wrap",
            gap: 8,
        },
        badge: {
            paddingVertical: 6,
            paddingHorizontal: 12,
            borderRadius: 9999,
            fontSize: 12,
            fontWeight: "600",
            textTransform: "uppercase",
            letterSpacing: 0.5,
        },
        badgeViolet: {
            backgroundColor: "#f3e8ff",
            color: "#6d28d9",
        },
        badgeCyan: {
            backgroundColor: "#cffafe",
            color: "#0891b2",
        },
        badgeEmerald: {
            backgroundColor: "#d1fae5",
            color: "#059669",
        },
        badgeAmber: {
            backgroundColor: "#fef3c7",
            color: "#d97706",
        },
        actionsSection: {
            justifyContent: "center",
            paddingVertical: 24,
            alignItems: "center",
        },
        actionButtons: {
            flexDirection: width > 768 ? "row" : "column",
            gap: 16,
            alignItems: "center",
        },
        actionBtn: {
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
            paddingVertical: 12,
            paddingHorizontal: 24,
            borderRadius: 9999,
            fontWeight: "600",
            fontSize: 15,
            minWidth: width <= 768 ? 200 : "auto",
            justifyContent: "center",
        },
        primaryBtn: {
            backgroundColor: "#7c3aed",
            color: "white",
            shadowColor: "#7c3aed",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 12,
            elevation: 6,
        },
        secondaryBtn: {
            backgroundColor: "white",
            color: "#475569",
            borderWidth: 1,
            borderColor: "#e2e8f0",
        },
        btnIcon: {
            width: 16,
            height: 16,
            color: "white",
        },
        secondaryBtnIcon: {
            color: "#475569",
        },
    })

    const statusBarHeight = StatusBar.currentHeight || 0

    return (
        <LinearGradient
            colors={["#f1f5f9", "#e2e8f0"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.calculatorWrapper, { marginTop: statusBarHeight }]}
        >
            <ScrollView contentContainerStyle={styles.calculatorContainer}>
                {/* Header */}
                <View style={styles.headerSection}>
                    <View style={styles.headerContent}>
                        <View style={styles.titleWrapper}>
                            <LinearGradient
                                colors={["#f3e8ff", "#e9d5ff"]}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                                style={styles.titleIcon}
                            >
                                <MaterialCommunityIcons name="calculator" size={32} style={styles.calculatorIcon} />
                            </LinearGradient>
                            <Text style={styles.mainTitle}>Advanced Real Estate Calculator</Text>
                        </View>
                        <Text style={styles.subtitle}>
                            Comprehensive financial analysis for your property investment with interactive charts and detailed
                            projections
                        </Text>
                    </View>
                </View>

                <View style={styles.mainContentArea}>
                    {/* Input Panel */}
                    <View style={styles.inputPanel}>
                        <View style={styles.card}>
                            <View style={styles.cardHeader}>
                                <Text style={styles.cardTitle}>
                                    <MaterialCommunityIcons name="home" size={20} style={styles.icon} />
                                    <View style={{ width: 5 }}></View>
                                    Property Details
                                </Text>
                            </View>
                            <View style={styles.cardContent}>
                                <View style={styles.inputGroup}>
                                    <Text style={styles.inputLabel}>Property Value</Text>
                                    <TextInput
                                        style={styles.numberInput}
                                        keyboardType="numeric"
                                        value={String(propertyValue)}
                                        onChangeText={(text) => setPropertyValue(Number(text))}
                                    />
                                    <Text style={styles.inputHelper}>{formatCurrency(propertyValue)}</Text>
                                </View>

                                <View style={styles.sliderGroup}>
                                    <Text style={styles.sliderLabel}>Down Payment: {downPaymentPercentage}%</Text>
                                    <Slider
                                        style={styles.slider}
                                        minimumValue={10}
                                        maximumValue={50}
                                        step={1}
                                        value={downPaymentPercentage}
                                        onValueChange={setDownPaymentPercentage}
                                        minimumTrackTintColor="#7c3aed"
                                        maximumTrackTintColor="#e2e8f0"
                                        thumbTintColor="#7c3aed"
                                    />
                                    <View style={styles.sliderRange}>
                                        <Text style={styles.inputHelper}>10%</Text>
                                        <Text style={[styles.inputHelper, styles.sliderValue]}>
                                            {formatCurrency(calculations.downPayment)}
                                        </Text>
                                        <Text style={styles.inputHelper}>50%</Text>
                                    </View>
                                </View>

                                <View style={styles.sliderGroup}>
                                    <Text style={styles.sliderLabel}>Loan Term: {loanTerm} years</Text>
                                    <Slider
                                        style={styles.slider}
                                        minimumValue={5}
                                        maximumValue={30}
                                        step={1}
                                        value={loanTerm}
                                        onValueChange={setLoanTerm}
                                        minimumTrackTintColor="#7c3aed"
                                        maximumTrackTintColor="#e2e8f0"
                                        thumbTintColor="#7c3aed"
                                    />
                                    <View style={styles.sliderRange}>
                                        <Text style={styles.inputHelper}>5 years</Text>
                                        <Text style={styles.inputHelper}>30 years</Text>
                                    </View>
                                </View>

                                <View style={styles.sliderGroup}>
                                    <Text style={styles.sliderLabel}>Interest Rate: {interestRate}%</Text>
                                    <Slider
                                        style={styles.slider}
                                        minimumValue={6}
                                        maximumValue={15}
                                        step={0.1}
                                        value={interestRate}
                                        onValueChange={setInterestRate}
                                        minimumTrackTintColor="#7c3aed"
                                        maximumTrackTintColor="#e2e8f0"
                                        thumbTintColor="#7c3aed"
                                    />
                                    <View style={styles.sliderRange}>
                                        <Text style={styles.inputHelper}>6%</Text>
                                        <Text style={styles.inputHelper}>15%</Text>
                                    </View>
                                </View>
                            </View>
                        </View>

                        <View style={styles.card}>
                            <View style={styles.cardHeader}>
                                <Text style={styles.cardTitle}>
                                    <MaterialCommunityIcons name="clock-outline" size={20} style={styles.icon} />
                                    <View style={{ width: 5 }}></View>
                                    Additional Parameters
                                </Text>
                            </View>
                            <View style={styles.cardContent}>
                                <View style={styles.sliderGroup}>
                                    <Text style={styles.sliderLabel}>Property Tax: {propertyTaxRate}%</Text>
                                    <Slider
                                        style={styles.slider}
                                        minimumValue={0.5}
                                        maximumValue={3}
                                        step={0.1}
                                        value={propertyTaxRate}
                                        onValueChange={setPropertyTaxRate}
                                        minimumTrackTintColor="#7c3aed"
                                        maximumTrackTintColor="#e2e8f0"
                                        thumbTintColor="#7c3aed"
                                    />
                                </View>

                                <View style={styles.sliderGroup}>
                                    <Text style={styles.sliderLabel}>Appreciation Rate: {appreciationRate}%</Text>
                                    <Slider
                                        style={styles.slider}
                                        minimumValue={3}
                                        maximumValue={12}
                                        step={0.5}
                                        value={appreciationRate}
                                        onValueChange={setAppreciationRate}
                                        minimumTrackTintColor="#7c3aed"
                                        maximumTrackTintColor="#e2e8f0"
                                        thumbTintColor="#7c3aed"
                                    />
                                </View>

                                <View style={styles.sliderGroup}>
                                    <Text style={styles.sliderLabel}>Maintenance: {maintenanceRate}%</Text>
                                    <Slider
                                        style={styles.slider}
                                        minimumValue={0.5}
                                        maximumValue={3}
                                        step={0.1}
                                        value={maintenanceRate}
                                        onValueChange={setMaintenanceRate}
                                        minimumTrackTintColor="#7c3aed"
                                        maximumTrackTintColor="#e2e8f0"
                                        thumbTintColor="#7c3aed"
                                    />
                                </View>

                                <View style={styles.sliderGroup}>
                                    <Text style={styles.sliderLabel}>Rental Yield: {rentalYield}%</Text>
                                    <Slider
                                        style={styles.slider}
                                        minimumValue={1}
                                        maximumValue={8}
                                        step={0.1}
                                        value={rentalYield}
                                        onValueChange={setRentalYield}
                                        minimumTrackTintColor="#7c3aed"
                                        maximumTrackTintColor="#e2e8f0"
                                        thumbTintColor="#7c3aed"
                                    />
                                </View>
                            </View>
                        </View>
                    </View>

                    {/* Results Panel */}
                    <View style={styles.resultsPanel}>
                        {/* Key Metrics */}
                        <View style={styles.metricsGrid}>
                            <LinearGradient
                                colors={["#7c3aed", "#6d28d9"]}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                                style={styles.metricCard}
                            >
                                <View style={styles.metricContent}>
                                    <View style={styles.metricHeader}>
                                        <MaterialCommunityIcons name="currency-inr" size={18} style={styles.metricIcon} />
                                        <Text style={styles.metricLabel}>Monthly EMI</Text>
                                    </View>
                                    <Text style={styles.metricValue}>{formatCurrency(calculations.emi)}</Text>
                                </View>
                            </LinearGradient>

                            <LinearGradient
                                colors={["#06b6d4", "#0891b2"]}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                                style={styles.metricCard}
                            >
                                <View style={styles.metricContent}>
                                    <View style={styles.metricHeader}>
                                        <MaterialCommunityIcons name="chart-line" size={18} style={styles.metricIcon} />
                                        <Text style={styles.metricLabel}>Cash Flow</Text>
                                    </View>
                                    <Text
                                        style={[
                                            styles.metricValue,
                                            calculations.monthlyCashFlow >= 0 ? styles.positiveValue : styles.negativeValue,
                                        ]}
                                    >
                                        {formatCurrency(calculations.monthlyCashFlow)}
                                    </Text>
                                </View>
                            </LinearGradient>

                            <LinearGradient
                                colors={["#10b981", "#059669"]}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                                style={styles.metricCard}
                            >
                                <View style={styles.metricContent}>
                                    <View style={styles.metricHeader}>
                                        <MaterialCommunityIcons name="percent" size={18} style={styles.metricIcon} />
                                        <Text style={styles.metricLabel}>ROI</Text>
                                    </View>
                                    <Text style={styles.metricValue}>{calculations.roi.toFixed(1)}%</Text>
                                </View>
                            </LinearGradient>

                            <LinearGradient
                                colors={["#f59e0b", "#d97706"]}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                                style={styles.metricCard}
                            >
                                <View style={styles.metricContent}>
                                    <View style={styles.metricHeader}>
                                        <MaterialCommunityIcons name="home-analytics" size={18} style={styles.metricIcon} />
                                        <Text style={styles.metricLabel}>Future Value</Text>
                                    </View>
                                    <Text style={styles.metricValue}>{formatCurrency(calculations.futureValue)}</Text>
                                </View>
                            </LinearGradient>
                        </View>

                        {/* Charts Section */}
                        <View style={styles.chartsSection}>
                            <View style={styles.tabsContainer}>
                                <View style={styles.tabsList}>
                                    <TouchableOpacity
                                        style={[styles.tabButton, activeTab === "breakdown" && styles.tabButtonActive]}
                                        onPress={() => setActiveTab("breakdown")}
                                    >
                                        <MaterialCommunityIcons
                                            name="chart-pie"
                                            style={[styles.tabIcon, activeTab === "breakdown" && styles.tabIconActive]}
                                        />
                                        <Text style={[styles.tabButtonText, activeTab === "breakdown" && styles.tabButtonTextActive]}>
                                            Breakdown
                                        </Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={[styles.tabButton, activeTab === "amortization" && styles.tabButtonActive]}
                                        onPress={() => setActiveTab("amortization")}
                                    >
                                        <MaterialCommunityIcons
                                            name="chart-bar"
                                            style={[styles.tabIcon, activeTab === "amortization" && styles.tabIconActive]}
                                        />
                                        <Text style={[styles.tabButtonText, activeTab === "amortization" && styles.tabButtonTextActive]}>
                                            Amortization
                                        </Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={[styles.tabButton, activeTab === "growth" && styles.tabButtonActive]}
                                        onPress={() => setActiveTab("growth")}
                                    >
                                        <MaterialCommunityIcons
                                            name="chart-areaspline"
                                            style={[styles.tabIcon, activeTab === "growth" && styles.tabIconActive]}
                                        />
                                        <Text style={[styles.tabButtonText, activeTab === "growth" && styles.tabButtonTextActive]}>
                                            Growth
                                        </Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={[styles.tabButton, activeTab === "summary" && styles.tabButtonActive]}
                                        onPress={() => setActiveTab("summary")}
                                    >
                                        <MaterialCommunityIcons
                                            name="file-document-outline"
                                            style={[styles.tabIcon, activeTab === "summary" && styles.tabIconActive]}
                                        />
                                        <Text style={[styles.tabButtonText, activeTab === "summary" && styles.tabButtonTextActive]}>
                                            Summary
                                        </Text>
                                    </TouchableOpacity>
                                </View>

                                <View style={styles.tabContent}>
                                    {activeTab === "breakdown" && (
                                        <View style={styles.chartCard}>
                                            <View style={styles.chartHeader}>
                                                <Text style={styles.chartTitle}>Monthly Payment Breakdown</Text>
                                            </View>
                                            <View style={styles.chartContainer}>
                                                <PieChart
                                                    data={paymentBreakdownData}
                                                    width={width * 0.8} // Adjust width based on screen size
                                                    height={220}
                                                    chartConfig={chartConfig}
                                                    accessor="population"
                                                    backgroundColor="transparent"
                                                    paddingLeft="15"
                                                    absolute // Show absolute values in tooltip
                                                />
                                            </View>
                                            <View style={styles.legendGrid}>
                                                {paymentBreakdownData.map((item, index) => (
                                                    <View key={index} style={styles.legendItem}>
                                                        <View style={[styles.legendColor, { backgroundColor: item.color }]} />
                                                        <View style={styles.legendContent}>
                                                            <Text style={styles.legendName}>{item.name}</Text>
                                                            <Text style={styles.legendValue}>{formatCurrency(item.population)}</Text>
                                                        </View>
                                                    </View>
                                                ))}
                                            </View>
                                        </View>
                                    )}

                                    {activeTab === "amortization" && (
                                        <View style={styles.chartCard}>
                                            <View style={styles.chartHeader}>
                                                <Text style={styles.chartTitle}>
                                                    Loan Amortization Schedule (First {Math.min(loanTerm, 10)} Years)
                                                </Text>
                                            </View>
                                            <View style={styles.chartContainer}>
                                                <BarChart
                                                    data={amortizationData}
                                                    width={width * 0.8}
                                                    height={220}
                                                    chartConfig={chartConfig}
                                                    verticalLabelRotation={30}
                                                    fromZero
                                                    yAxisLabel="" // Added to resolve error
                                                    yAxisSuffix="₹" // Added to resolve error
                                                />
                                            </View>
                                        </View>
                                    )}

                                    {activeTab === "growth" && (
                                        <View style={styles.chartCard}>
                                            <View style={styles.chartHeader}>
                                                <Text style={styles.chartTitle}>
                                                    Property Value & Equity Growth (First {Math.min(loanTerm, 10)} Years)
                                                </Text>
                                            </View>
                                            <View style={styles.chartContainer}>
                                                <LineChart
                                                    data={propertyGrowthData}
                                                    width={width * 0.8}
                                                    height={220}
                                                    chartConfig={chartConfig}
                                                    bezier // For smooth curves
                                                    fromZero
                                                    yAxisLabel="" // Added to resolve error
                                                    yAxisSuffix="₹" // Added to resolve error
                                                />
                                            </View>
                                        </View>
                                    )}

                                    {activeTab === "summary" && (
                                        <View style={styles.summaryContent}>
                                            <View style={styles.summaryCard}>
                                                <View style={styles.summaryHeader}>
                                                    <Text style={styles.summaryTitle}>Financial Summary</Text>
                                                </View>
                                                <View style={styles.summaryGrid}>
                                                    <View style={styles.summarySection}>
                                                        <Text style={styles.sectionTitle}>Initial Investment</Text>
                                                        <View style={styles.summaryItems}>
                                                            <View style={styles.summaryItem}>
                                                                <Text style={styles.itemLabel}>Property Value:</Text>
                                                                <Text style={styles.itemValue}>{formatCurrency(calculations.propertyValue)}</Text>
                                                            </View>
                                                            <View style={styles.summaryItem}>
                                                                <Text style={styles.itemLabel}>Down Payment:</Text>
                                                                <Text style={styles.itemValue}>{formatCurrency(calculations.downPayment)}</Text>
                                                            </View>
                                                            <View style={[styles.summaryItem, styles.lastSummaryItem]}>
                                                                <Text style={styles.itemLabel}>Loan Amount:</Text>
                                                                <Text style={styles.itemValue}>{formatCurrency(calculations.loanAmount)}</Text>
                                                            </View>
                                                        </View>
                                                    </View>

                                                    <View style={styles.summarySection}>
                                                        <Text style={styles.sectionTitle}>Monthly Expenses Breakdown</Text>
                                                        <View style={styles.summaryItems}>
                                                            <View style={styles.summaryItem}>
                                                                <Text style={styles.itemLabel}>EMI (P&I):</Text>
                                                                <Text style={styles.itemValue}>{formatCurrency(calculations.emi)}</Text>
                                                            </View>
                                                            <View style={styles.summaryItem}>
                                                                <Text style={styles.itemLabel}>Property Tax:</Text>
                                                                <Text style={styles.itemValue}>{formatCurrency(calculations.monthlyPropertyTax)}</Text>
                                                            </View>
                                                            <View style={styles.summaryItem}>
                                                                <Text style={styles.itemLabel}>Maintenance:</Text>
                                                                <Text style={styles.itemValue}>{formatCurrency(calculations.monthlyMaintenance)}</Text>
                                                            </View>
                                                            <View style={styles.summaryItem}>
                                                                <Text style={styles.itemLabel}>Insurance:</Text>
                                                                <Text style={styles.itemValue}>{formatCurrency(calculations.monthlyInsurance)}</Text>
                                                            </View>
                                                            <View style={styles.summarySeparator}></View>
                                                            <View style={[styles.summaryItem, styles.totalSummaryItem, styles.lastSummaryItem]}>
                                                                <Text style={styles.itemLabel}>Total Monthly:</Text>
                                                                <Text style={styles.itemValue}>{formatCurrency(calculations.totalMonthlyPayment)}</Text>
                                                            </View>
                                                        </View>
                                                    </View>

                                                    <View style={styles.summarySection}>
                                                        <Text style={styles.sectionTitle}>Rental Income & Cash Flow</Text>
                                                        <View style={styles.summaryItems}>
                                                            <View style={styles.summaryItem}>
                                                                <Text style={styles.itemLabel}>Monthly Rental:</Text>
                                                                <Text style={styles.itemValue}>{formatCurrency(calculations.monthlyRentalIncome)}</Text>
                                                            </View>
                                                            <View style={[styles.summaryItem, styles.lastSummaryItem]}>
                                                                <Text style={styles.itemLabel}>Annual Rental:</Text>
                                                                <Text style={styles.itemValue}>
                                                                    {formatCurrency(calculations.monthlyRentalIncome * 12)}
                                                                </Text>
                                                            </View>
                                                            <View style={[styles.summaryItem, styles.totalSummaryItem, styles.lastSummaryItem]}>
                                                                <Text style={styles.itemLabel}>Net Cash Flow:</Text>
                                                                <Text
                                                                    style={[
                                                                        styles.itemValue,
                                                                        calculations.monthlyCashFlow >= 0 ? styles.itemPositive : styles.itemNegative,
                                                                    ]}
                                                                >
                                                                    {formatCurrency(calculations.monthlyCashFlow)}
                                                                </Text>
                                                            </View>
                                                        </View>
                                                    </View>

                                                    <View style={styles.summarySection}>
                                                        <Text style={styles.sectionTitle}>Long-term Projections</Text>
                                                        <View style={styles.summaryItems}>
                                                            <View style={styles.summaryItem}>
                                                                <Text style={styles.itemLabel}>Future Property Value:</Text>
                                                                <Text style={styles.itemValue}>{formatCurrency(calculations.futureValue)}</Text>
                                                            </View>
                                                            <View style={styles.summaryItem}>
                                                                <Text style={styles.itemLabel}>Total Appreciation:</Text>
                                                                <Text style={[styles.itemValue, styles.itemPositive]}>
                                                                    {formatCurrency(calculations.totalAppreciation)}
                                                                </Text>
                                                            </View>
                                                            <View style={styles.summaryItem}>
                                                                <Text style={styles.itemLabel}>Total Interest Paid:</Text>
                                                                <Text style={[styles.itemValue, styles.itemNegative]}>
                                                                    {formatCurrency(calculations.totalInterestPaid)}
                                                                </Text>
                                                            </View>
                                                            <View style={[styles.summaryItem, styles.totalSummaryItem, styles.lastSummaryItem]}>
                                                                <Text style={styles.itemLabel}>Expected ROI:</Text>
                                                                <Text style={[styles.itemValue, styles.itemViolet]}>
                                                                    {calculations.roi.toFixed(1)}%
                                                                </Text>
                                                            </View>
                                                        </View>
                                                    </View>
                                                </View>

                                                <View style={styles.badgesSection}>
                                                    <View style={styles.badgeList}>
                                                        <Text style={[styles.badge, styles.badgeViolet]}>{loanTerm} Year Investment</Text>
                                                        <Text style={[styles.badge, styles.badgeCyan]}>{interestRate}% Interest Rate</Text>
                                                        <Text style={[styles.badge, styles.badgeEmerald]}>
                                                            {appreciationRate}% Annual Appreciation
                                                        </Text>
                                                        <Text style={[styles.badge, styles.badgeAmber]}>{rentalYield}% Rental Yield</Text>
                                                    </View>
                                                </View>
                                            </View>
                                        </View>
                                    )}
                                </View>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Action Buttons */}
                <View style={styles.actionsSection}>
                    <View style={styles.actionButtons}>
                        <TouchableOpacity style={[styles.actionBtn, styles.secondaryBtn]} onPress={handleReset}>
                            <MaterialCommunityIcons name="refresh" style={[styles.btnIcon, styles.secondaryBtnIcon]} />
                            <Text style={styles.secondaryBtnIcon}>Reset Calculator</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.actionBtn, styles.primaryBtn]} onPress={handleExport}>
                            <MaterialCommunityIcons name="file-export-outline" style={styles.btnIcon} />
                            <Text style={styles.btnIcon}>Export Report</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </LinearGradient>
    )
}

export default PropertyCalculatorPage
