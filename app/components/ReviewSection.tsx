"use client"

import type React from "react"
import { useState, useRef } from "react"
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  TextInput,
  StyleSheet,
  Animated,
  Dimensions,
  Linking,
  Image,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native"
import axios from "axios"

const { height } = Dimensions.get("window")

type FeedbackOption = "problem" | "question" | "suggestion" | "other"

const FeedbackComponent: React.FC = () => {
  const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL || "your-api-base-url"

  const [showPositiveModal, setShowPositiveModal] = useState(false)
  const [showNegativeModal, setShowNegativeModal] = useState(false)
  const [selectedOption, setSelectedOption] = useState<FeedbackOption>("problem")
  const [feedbackText, setFeedbackText] = useState("")
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [loading, setLoading] = useState(false)

  const positiveSlideAnim = useRef(new Animated.Value(height)).current
  const negativeSlideAnim = useRef(new Animated.Value(height)).current

  const openPositiveModal = () => {
    setShowPositiveModal(true)
    Animated.timing(positiveSlideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start()
  }

  const closePositiveModal = () => {
    Animated.timing(positiveSlideAnim, {
      toValue: height,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setShowPositiveModal(false)
    })
  }

  const openNegativeModal = () => {
    setShowNegativeModal(true)
    Animated.timing(negativeSlideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start()
  }

  const closeNegativeModal = () => {
    Animated.timing(negativeSlideAnim, {
      toValue: height,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setShowNegativeModal(false)
      // Reset form fields
      setEmail("")
      setName("")
      setFeedbackText("")
      setSelectedOption("problem")
    })
  }

  const handleGoToPlayStore = () => {
    // Replace with actual Play Store URL
    Linking.openURL("https://play.google.com/store/apps/details?id=com.99acres.app")
    closePositiveModal()
  }

  const validateForm = () => {
    if (!name.trim()) {
      Alert.alert("Validation Error", "Please enter your name")
      return false
    }
    if (!email.trim()) {
      Alert.alert("Validation Error", "Please enter your email")
      return false
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      Alert.alert("Validation Error", "Please enter a valid email address")
      return false
    }
    if (!feedbackText.trim()) {
      Alert.alert("Validation Error", "Please enter your feedback")
      return false
    }
    return true
  }

  const handleSubmitFeedback = async () => {
    if (!validateForm()) {
      return
    }

    try {
      setLoading(true)

      const feedbackData = {
        name: name.trim(),
        email: email.trim(),
        feedback: `${selectedOption.toUpperCase()}: ${feedbackText.trim()}`,
        type: selectedOption,
      }

      await axios.post(`${BASE_URL}/api/feedback`, feedbackData, {
        timeout: 10000, // 10 second timeout
        headers: {
          "Content-Type": "application/json",
        },
      })

      Alert.alert(
        "Success",
        "Thank you for your feedback! We appreciate your input and will use it to improve Milestono.",
        [
          {
            text: "OK",
            onPress: () => closeNegativeModal(),
          },
        ],
      )
    } catch (error: any) {
      console.error("Error submitting feedback:", error)

      let errorMessage = "Failed to submit feedback. Please try again."

      // Handle different error scenarios
      if (error?.code === "ECONNABORTED" || error?.message?.includes("timeout")) {
        errorMessage = "Request timed out. Please check your internet connection and try again."
      } else if (error?.response?.status) {
        const status = error.response.status
        switch (status) {
          case 400:
            errorMessage = "Invalid data submitted. Please check your inputs."
            break
          case 404:
            errorMessage = "Service not found. Please contact support."
            break
          case 500:
          case 502:
          case 503:
            errorMessage = "Server error. Please try again later."
            break
          default:
            errorMessage = `Server error (${status}). Please try again later.`
        }
      } else if (error?.request || error?.message?.includes("Network")) {
        errorMessage = "Network error. Please check your internet connection."
      } else if (error?.message) {
        errorMessage = `Connection error: ${error.message}`
      }

      Alert.alert("Error", errorMessage, [
        {
          text: "Retry",
          onPress: () => handleSubmitFeedback(),
        },
        {
          text: "Cancel",
          style: "cancel",
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  const renderOptionButton = (option: FeedbackOption, label: string, isSelected: boolean) => (
    <TouchableOpacity
      style={[styles.optionButton, isSelected && styles.selectedOptionButton]}
      onPress={() => setSelectedOption(option)}
      disabled={loading}
    >
      {isSelected ? (
        <View style={styles.checkmarkContainer}>
          <Text style={styles.checkmark}>✓</Text>
        </View>
      ) : (
        <View style={styles.plusContainer}>
          <Text style={styles.plus}>+</Text>
        </View>
      )}
      <Text style={styles.optionText}>{label}</Text>
    </TouchableOpacity>
  )

  return (
    <View style={styles.rootContainer}>
      <View style={styles.feedbackContainer}>
        <Text style={styles.title}>Are you finding us helpful?</Text>
        <Text style={styles.subtitle}>Your feedback will help us make Milestono the best.</Text>

        <View style={styles.optionsContainer}>
          <TouchableOpacity style={styles.optionCard} onPress={openPositiveModal}>
            <Image
              source={{
                uri: "https://emojipedia-us.s3.amazonaws.com/source/skype/289/smiling-face-with-smiling-eyes_1f60a.png",
              }}
              style={styles.emojiImage}
            />
            <Text style={styles.optionCardText}>Yes, Loving it</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.optionCard} onPress={openNegativeModal}>
            <Image
              source={{
                uri: "https://emojipedia-us.s3.amazonaws.com/source/skype/289/slightly-frowning-face_1f641.png",
              }}
              style={styles.emojiImage}
            />
            <Text style={styles.optionCardText}>No, Not really</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Positive Feedback Modal */}
      <Modal visible={showPositiveModal} transparent={true} animationType="none" onRequestClose={closePositiveModal}>
        <View style={styles.modalOverlay}>
          <Animated.View style={[styles.modalContent, { transform: [{ translateY: positiveSlideAnim }] }]}>
            <View style={styles.positiveModalContainer}>
              <Image source={require("../../assets/images/feedbacksectionmobile.png")} style={styles.ratingImage} />
              <Text style={styles.modalTitle}>Review Milestono now!</Text>
              <Text style={styles.modalSubtitle}>
                Rate us <Text style={styles.boldText}>5 star</Text> and help others discover Milestono easily.
              </Text>

              <TouchableOpacity style={styles.playStoreButton} onPress={handleGoToPlayStore}>
                <Text style={styles.playStoreButtonText}>Go to Play Store</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={closePositiveModal}>
                <Text style={styles.remindLaterText}>Remind me later</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </Modal>

      {/* Negative Feedback Modal */}
      <Modal visible={showNegativeModal} transparent={true} animationType="none" onRequestClose={closeNegativeModal}>
        <View style={styles.modalOverlay}>
          <Animated.View style={[styles.modalContent, { transform: [{ translateY: negativeSlideAnim }] }]}>
            <ScrollView style={styles.negativeModalContainer}>
              {loading && (
                <View style={styles.loadingOverlay}>
                  <ActivityIndicator size="large" color="#0078d4" />
                  <Text style={styles.loadingText}>Submitting feedback...</Text>
                </View>
              )}

              <View style={styles.feedbackHeaderContainer}>
                <View>
                  <Text style={styles.modalTitle}>What can we Improve?</Text>
                  <Text style={styles.modalSubtitle}>How can we make Milestono better for you?</Text>
                </View>
                <Image
                  source={{
                    uri: "https://img.icons8.com/color/96/000000/edit.png",
                  }}
                  style={styles.pencilImage}
                />
              </View>

              <View style={styles.formContainer}>
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>
                    <Text style={styles.required}>*</Text> Name:
                  </Text>
                  <TextInput
                    style={[styles.textInput, loading && styles.disabledInput]}
                    placeholder="Enter your name"
                    placeholderTextColor="#999"
                    value={name}
                    onChangeText={setName}
                    editable={!loading}
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>
                    <Text style={styles.required}>*</Text> Email:
                  </Text>
                  <TextInput
                    style={[styles.textInput, loading && styles.disabledInput]}
                    placeholder="Enter your email"
                    placeholderTextColor="#999"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    editable={!loading}
                  />
                </View>

                <Text style={styles.categoryLabel}>
                  <Text style={styles.required}>*</Text> Category:
                </Text>
                <View style={styles.optionsRow}>
                  {renderOptionButton("problem", "Reporting a Problem", selectedOption === "problem")}
                  {renderOptionButton("question", "Asking us a Que", selectedOption === "question")}
                </View>

                <View style={styles.optionsRow}>
                  {renderOptionButton("suggestion", "Suggestion/Improvement", selectedOption === "suggestion")}
                  {renderOptionButton("other", "Others", selectedOption === "other")}
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>
                    <Text style={styles.required}>*</Text> Feedback:
                  </Text>
                  <TextInput
                    style={[styles.feedbackInput, loading && styles.disabledInput]}
                    placeholder="Please describe your feedback here..."
                    placeholderTextColor="#999"
                    multiline={true}
                    numberOfLines={5}
                    value={feedbackText}
                    onChangeText={setFeedbackText}
                    maxLength={1000}
                    editable={!loading}
                  />
                  <Text style={styles.characterCount}>{feedbackText.length}/1000</Text>
                </View>

                <TouchableOpacity
                  style={[styles.submitButton, loading && styles.disabledButton]}
                  onPress={handleSubmitFeedback}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator size="small" color="white" />
                  ) : (
                    <Text style={styles.submitButtonText}>Submit Feedback</Text>
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.cancelButton, loading && styles.disabledButton]}
                  onPress={closeNegativeModal}
                  disabled={loading}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </Animated.View>
        </View>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  rootContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    marginBottom: 30,
  },
  feedbackContainer: {
    width: "95%",
    padding: 20,
    backgroundColor: "#e6f3fa",
    borderRadius: 10,
    alignItems: "center",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#0e2a47",
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 12,
    color: "#555",
    textAlign: "center",
    marginBottom: 30,
  },
  optionsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 25,
    width: "100%",
    marginTop: 10,
  },
  optionCard: {
    backgroundColor: "white",
    borderRadius: 15,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    width: "35%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  emojiImage: {
    width: 40,
    height: 40,
    marginBottom: 15,
  },
  optionCardText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#0078d4",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "90%",
  },
  positiveModalContainer: {
    padding: 25,
    alignItems: "center",
  },
  negativeModalContainer: {
    padding: 25,
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#0078d4",
    fontWeight: "500",
  },
  feedbackHeaderContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#0e2a47",
    marginBottom: 10,
  },
  modalSubtitle: {
    fontSize: 16,
    color: "#555",
    marginBottom: 25,
  },
  boldText: {
    fontWeight: "bold",
  },
  ratingImage: {
    width: 150,
    height: 180,
    marginBottom: 20,
  },
  pencilImage: {
    width: 50,
    height: 50,
  },
  playStoreButton: {
    backgroundColor: "#0078d4",
    borderRadius: 5,
    paddingVertical: 15,
    paddingHorizontal: 20,
    width: "100%",
    alignItems: "center",
    marginBottom: 15,
  },
  playStoreButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  remindLaterText: {
    color: "#666",
    fontSize: 16,
    marginTop: 10,
    textDecorationLine: "underline",
  },
  formContainer: {
    marginTop: 10,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    marginBottom: 8,
  },
  required: {
    color: "red",
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    padding: 12,
    fontSize: 16,
    backgroundColor: "white",
  },
  disabledInput: {
    backgroundColor: "#f5f5f5",
    color: "#999",
  },
  categoryLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    marginBottom: 15,
  },
  optionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  optionButton: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 25,
    paddingVertical: 10,
    paddingHorizontal: 15,
    flex: 1,
    marginHorizontal: 5,
  },
  selectedOptionButton: {
    borderColor: "#0078d4",
    backgroundColor: "#f0f7ff",
  },
  checkmarkContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#0078d4",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  checkmark: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
  plusContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#999",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  plus: {
    color: "#999",
    fontSize: 18,
    lineHeight: 22,
  },
  optionText: {
    fontSize: 14,
    color: "#333",
  },
  feedbackInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    padding: 15,
    height: 120,
    textAlignVertical: "top",
    fontSize: 16,
    backgroundColor: "white",
  },
  characterCount: {
    textAlign: "right",
    fontSize: 12,
    color: "#999",
    marginTop: 5,
  },
  submitButton: {
    backgroundColor: "#0078d4",
    borderRadius: 5,
    paddingVertical: 15,
    paddingHorizontal: 20,
    width: "100%",
    alignItems: "center",
    marginBottom: 15,
  },
  submitButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  cancelButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    paddingVertical: 15,
    paddingHorizontal: 20,
    width: "100%",
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#666",
    fontSize: 16,
    fontWeight: "500",
  },
  disabledButton: {
    opacity: 0.6,
  },
})

export default FeedbackComponent
