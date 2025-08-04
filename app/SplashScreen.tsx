"use client"

import { useState } from "react"
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, StatusBar, Image } from "react-native"
const { width, height } = Dimensions.get("window")

interface SplashScreenProps {
  onGetStarted: () => void
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onGetStarted }) => {
  const [currentScreen, setCurrentScreen] = useState(1)
  const totalScreens = 5

  const handleSkip = () => {
    setCurrentScreen(5)
    console.log("Skip pressed")
  }

  const handleNext = () => {
    if (currentScreen < totalScreens) {
      setCurrentScreen(currentScreen + 1)
    } else {
      onGetStarted()
    }
  }

  const handlePrevious = () => {
    if (currentScreen > 1) {
      setCurrentScreen(currentScreen - 1)
    }
  }

  const renderScreen1 = () => (
    <>
      <View style={styles.topSection}>
        <View><Text style={styles.headerText}>milestono</Text></View>
        <Image
          source={require("../assets/images/splashscreen-search.png")}
          style={styles.illustration}
          resizeMode="contain"
        />
      </View>
      <View style={styles.bottomSection}>
        <View style={styles.contentContainer}>
          <Text style={styles.title}>SEARCH & EXPLORE</Text>
          <Text style={styles.description}>
            Discover amazing properties and projects in your neighborhood with our advanced search features and filters.
          </Text>
        </View>
        {renderNavigation()}
      </View>
    </>
  )

  const renderScreen2 = () => (
    <>
      <View style={styles.topSection}>
        <View><Text style={styles.headerText}>milestono</Text></View>
        <Image
          source={require("../assets/images/splashscreen-service.png")}
          style={styles.illustration}
          resizeMode="contain"
        />
      </View>
      <View style={styles.bottomSection}>
        <View style={styles.contentContainer}>
          <Text style={styles.title}>EXPLORE SERVICES</Text>
          <Text style={styles.description}>
            Access a wide range of professional services including Courier, Legal, Electrician, Construction, Painting,
            Plumbing, and many more to meet all your property needs.
          </Text>
        </View>
        {renderNavigation()}
      </View>
    </>
  )

  const renderScreen3 = () => (
    <>
      <View style={styles.topSection}>
        <View><Text style={styles.headerText}>milestono</Text></View>
        <Image
          source={require("../assets/images/splashscreen-loan.png")}
          style={styles.illustration}
          resizeMode="contain"
        />
      </View>
      <View style={styles.bottomSection}>
        <View style={styles.contentContainer}>
          <Text style={styles.title}>SMART LOAN SOLUTIONS</Text>
          <Text style={styles.description}>
            Milestone connects you with various trusted banks and financial institutions nearby to provide the best loan
            options with competitive rates tailored to your property investment needs.
          </Text>
        </View>
        {renderNavigation()}
      </View>
    </>
  )

  const renderScreen4 = () => (
    <>
      <View style={styles.topSection}>
        <View><Text style={styles.headerText}>milestono</Text></View>
        <Image
          source={require("../assets/images/splashscreen-postproperty.png")}
          style={styles.illustration}
          resizeMode="contain"
        />
      </View>
      <View style={styles.bottomSection}>
        <View style={styles.contentContainer}>
          <Text style={styles.title}>POST PROPERTY</Text>
          <Text style={styles.description}>
            List your property in just 4 simple steps and reach thousands of potential buyers instantly. Our streamlined
            process makes it easy to showcase your property professionally.
          </Text>
        </View>
        {renderNavigation()}
      </View>
    </>
  )

  const renderScreen5 = () => (
    <>
      <View style={styles.topSection}>
        <View><Text style={styles.headerText}>milestono</Text></View>
        <Image
          source={require("../assets/images/splashscreen-getstarted.png")}
          style={styles.illustration}
          resizeMode="contain"
        />
      </View>
      <View style={styles.bottomSection}>
        <View style={styles.contentContainer}>
          <Text style={styles.title}>GET STARTED TODAY</Text>
          <Text style={styles.description}>
            Login now to unlock all premium features of our platform and start your property journey with personalized
            recommendations, exclusive deals, and priority support.
          </Text>
        </View>
        {renderNavigation()}
      </View>
    </>
  )

  const renderNavigation = () => (
    <>
      <View style={styles.navigationContainer}>
        <TouchableOpacity onPress={currentScreen === 1 ? handleSkip : handlePrevious} style={styles.skipButton}>
          <Text style={styles.skipText}>{currentScreen === 1 ? "SKIP" : "BACK"}</Text>
        </TouchableOpacity>

        <View style={styles.dotsContainer}>
          {Array.from({ length: totalScreens }, (_, index) => (
            <View key={index} style={[styles.dot, index + 1 === currentScreen && styles.activeDot]} />
          ))}
        </View>

        <TouchableOpacity onPress={handleNext} style={styles.nextButton}>
          <Text style={styles.nextText}>{currentScreen === totalScreens ? "GET STARTED" : "NEXT"}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.counterContainer}>
        <Text style={styles.counterText}>
          {currentScreen} of {totalScreens}
        </Text>
      </View>
    </>
  )

  const renderCurrentScreen = () => {
    switch (currentScreen) {
      case 1:
        return renderScreen1()
      case 2:
        return renderScreen2()
      case 3:
        return renderScreen3()
      case 4:
        return renderScreen4()
      case 5:
        return renderScreen5()
      default:
        return renderScreen1()
    }
  }

  const statusBarHeight = StatusBar.currentHeight || 0

  return (
    <View style={[styles.container]}>
      {renderCurrentScreen()}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  topSection: {
    height: height * 0.5,
    width: width * 0.8,
    marginLeft: width * 0.1,
    marginBottom: 40,
    justifyContent: "center",
    borderBottomRightRadius: width * 0.4,
    borderBottomLeftRadius: width * 0.4,
    flex: 0.65,
    backgroundColor: "#232761",
  },
  illustration: {
    alignSelf: "center",
    width: width * .8,
    height: height * 0.4,
    top: height * 0.125,
  },
  // Post Property Screen Specific Styles
  headerText: {
    fontSize: 50,
    textAlign: "center",
    color: "white",
    fontWeight: "bold"
  },
  stepsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  stepRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginVertical: 20,
  },
  stepItem: {
    alignItems: "center",
    flex: 1,
    marginHorizontal: 10,
  },
  stepNumber: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  stepNumberText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2B4C7E",
  },
  stepText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
    textAlign: "center",
    lineHeight: 18,
  },
  bottomSection: {
    flex: 0.35,
    backgroundColor: "#FFFFFF",
    justifyContent: "space-between",
    paddingHorizontal: 30,
    paddingTop: 30,
    paddingBottom: 20,
  },
  contentContainer: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#000000",
    marginBottom: 15,
    letterSpacing: 0.5,
    textAlign: "center",
  },
  description: {
    fontSize: 14,
    color: "#666666",
    textAlign: "center",
    lineHeight: 22,
    paddingHorizontal: 10,
  },
  navigationContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 20,
  },
  skipButton: {
    paddingVertical: 10,
    paddingHorizontal: 5,
    minWidth: 60,
  },
  skipText: {
    fontSize: 14,
    color: "#999999",
    fontWeight: "500",
  },
  nextButton: {
    paddingVertical: 10,
    paddingHorizontal: 5,
    minWidth: 60,
  },
  nextText: {
    fontSize: 14,
    color: "#232761",
    fontWeight: "600",
    textAlign: "right",
  },
  dotsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#E0E0E0",
    marginHorizontal: 3,
  },
  activeDot: {
    backgroundColor: "#232761",
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  counterContainer: {
    alignItems: "center",
    paddingTop: 10,
  },
  counterText: {
    fontSize: 12,
    color: "#999999",
    fontWeight: "400",
  },
})

export default SplashScreen
