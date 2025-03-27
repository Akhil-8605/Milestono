import React, { useState, useRef } from "react";
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
} from "react-native";

const { height } = Dimensions.get("window");

type FeedbackOption = "problem" | "question" | "suggestion" | "other";

// Namespace for the component to avoid style conflicts
const COMPONENT_PREFIX = "feedback_";

const FeedbackComponent: React.FC = () => {
  const [showPositiveModal, setShowPositiveModal] = useState(false);
  const [showNegativeModal, setShowNegativeModal] = useState(false);
  const [selectedOption, setSelectedOption] =
    useState<FeedbackOption>("problem");
  const [feedbackText, setFeedbackText] = useState("");

  const positiveSlideAnim = useRef(new Animated.Value(height)).current;
  const negativeSlideAnim = useRef(new Animated.Value(height)).current;

  const openPositiveModal = () => {
    setShowPositiveModal(true);
    Animated.timing(positiveSlideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const closePositiveModal = () => {
    Animated.timing(positiveSlideAnim, {
      toValue: height,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setShowPositiveModal(false);
    });
  };

  const openNegativeModal = () => {
    setShowNegativeModal(true);
    Animated.timing(negativeSlideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const closeNegativeModal = () => {
    Animated.timing(negativeSlideAnim, {
      toValue: height,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setShowNegativeModal(false);
    });
  };

  const handleGoToPlayStore = () => {
    // Replace with actual Play Store URL
    Linking.openURL(
      "https://play.google.com/store/apps/details?id=com.99acres.app"
    );
    closePositiveModal();
  };

  const handleSubmitFeedback = () => {
    // Handle feedback submission logic here
    console.log("Feedback submitted:", { selectedOption, feedbackText });
    closeNegativeModal();
    setFeedbackText("");
  };

  const renderOptionButton = (
    option: FeedbackOption,
    label: string,
    isSelected: boolean
  ) => (
    <TouchableOpacity
      style={[styles.optionButton, isSelected && styles.selectedOptionButton]}
      onPress={() => setSelectedOption(option)}
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
  );

  return (
    <View style={styles.rootContainer}>
      <View style={styles.feedbackContainer}>
        <Text style={styles.title}>Are you finding us helpful?</Text>
        <Text style={styles.subtitle}>
          Your feedback will help us make Milestono the best.
        </Text>

        <View style={styles.optionsContainer}>
          <TouchableOpacity
            style={styles.optionCard}
            onPress={openPositiveModal}
          >
            <Image
              source={{
                uri: "https://emojipedia-us.s3.amazonaws.com/source/skype/289/smiling-face-with-smiling-eyes_1f60a.png",
              }}
              style={styles.emojiImage}
            />
            <Text style={styles.optionCardText}>Yes, Loving it</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.optionCard}
            onPress={openNegativeModal}
          >
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
      <Modal
        visible={showPositiveModal}
        transparent={true}
        animationType="none"
        onRequestClose={closePositiveModal}
      >
        <View style={styles.modalOverlay}>
          <Animated.View
            style={[
              styles.modalContent,
              { transform: [{ translateY: positiveSlideAnim }] },
            ]}
          >
            <View style={styles.positiveModalContainer}>
              <Image
                source={require("../../assets/images/feedbacksectionmobile.png")}
                style={styles.ratingImage}
              />
              <Text style={styles.modalTitle}>Review Milestono now!</Text>
              <Text style={styles.modalSubtitle}>
                Rate us <Text style={styles.boldText}>5 star</Text> and help
                others discover Milestono easily.
              </Text>

              <TouchableOpacity
                style={styles.playStoreButton}
                onPress={handleGoToPlayStore}
              >
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
      <Modal
        visible={showNegativeModal}
        transparent={true}
        animationType="none"
        onRequestClose={closeNegativeModal}
      >
        <View style={styles.modalOverlay}>
          <Animated.View
            style={[
              styles.modalContent,
              { transform: [{ translateY: negativeSlideAnim }] },
            ]}
          >
            <ScrollView style={styles.negativeModalContainer}>
              <View style={styles.feedbackHeaderContainer}>
                <View>
                  <Text style={styles.modalTitle}>What can we Improve?</Text>
                  <Text style={styles.modalSubtitle}>
                    How can we make Milestono better for you?
                  </Text>
                </View>
                <Image
                  source={{
                    uri: "https://img.icons8.com/color/96/000000/edit.png",
                  }}
                  style={styles.pencilImage}
                />
              </View>

              <View style={styles.optionsRow}>
                {renderOptionButton(
                  "problem",
                  "Reporting a Problem",
                  selectedOption === "problem"
                )}
                {renderOptionButton(
                  "question",
                  "Asking us a Que",
                  selectedOption === "question"
                )}
              </View>

              <View style={styles.optionsRow}>
                {renderOptionButton(
                  "suggestion",
                  "Suggestion/Improvement",
                  selectedOption === "suggestion"
                )}
                {renderOptionButton(
                  "other",
                  "Others",
                  selectedOption === "other"
                )}
              </View>

              <TextInput
                style={styles.feedbackInput}
                placeholder="Please describe your feedback here..."
                placeholderTextColor="#999"
                multiline={true}
                numberOfLines={5}
                value={feedbackText}
                onChangeText={setFeedbackText}
              />

              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleSubmitFeedback}
              >
                <Text style={styles.submitButtonText}>Submit Feedback</Text>
              </TouchableOpacity>
            </ScrollView>
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
};

// Create a separate StyleSheet with namespaced style names
const styles = StyleSheet.create({
  rootContainer: {
    // Using a specific name to avoid conflicts
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
    height: 150,
    textAlignVertical: "top",
    marginBottom: 20,
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
});

export default FeedbackComponent;
