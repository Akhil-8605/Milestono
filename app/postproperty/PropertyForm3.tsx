import React, { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
} from "react-native";
import {
  ImagePickerResponse,
  launchImageLibrary,
} from "react-native-image-picker";

interface Form3Props {
  onBack: () => void;
  onSubmit?: () => void;
}

const Form3: React.FC<Form3Props> = ({ onBack, onSubmit }) => {
  const [photos, setPhotos] = useState<string[]>([]);
  const [otherRooms, setOtherRooms] = useState<string[]>([]);
  const [furnishing, setFurnishing] = useState<string>("");
  const [parking, setParking] = useState<string[]>([]);
  const [errors, setErrors] = useState<{ photos?: string }>({});

  const validateForm = () => {
    const newErrors: { photos?: string } = {};
    if (photos.length === 0) {
      newErrors.photos = "Please add at least one photo";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFormSubmit = () => {
    if (validateForm()) {
      console.log("Form data submitted:", {
        photos,
        otherRooms,
        furnishing,
        parking,
      });
      if (onSubmit) {
        onSubmit();
      }
    } else {
      Alert.alert("Error", "Please fill in all required fields");
    }
  };

  const handleImagePicker = () => {
    launchImageLibrary(
      {
        mediaType: "photo",
        selectionLimit: 10,
      },
      (response: ImagePickerResponse) => {
        if (response.assets) {
          const newPhotos = response.assets.map((asset) => asset.uri || "");
          setPhotos([...photos, ...newPhotos]);
        }
      }
    );
  };

  const SelectionButton = ({ title, selected, onPress }: any) => (
    <TouchableOpacity
      style={[styles.selectionButton, selected && styles.selectedButton]}
      onPress={onPress}
    >
      <Text style={[styles.selectionText, selected && styles.selectedText]}>
        {title}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Fixed Header */}

      {/* Scrollable Content */}
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onBack}>
            <Text style={styles.arrow}>←</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => console.log("Post Via WhatsApp pressed (Form3)")}
          >
            {/* <Text style={styles.whatsapp}>Post Via WhatsApp</Text> */}
          </TouchableOpacity>
        </View>
        <Text style={styles.title}>Basic Details of Your Property</Text>
        <Text style={styles.subtitle}>Step 3 of 3</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Add Photos & Other Details</Text>
          <TouchableOpacity
            style={styles.uploadContainer}
            onPress={handleImagePicker}
          >
            <Text style={styles.uploadText}>+ Add Photos</Text>
            <Text style={styles.uploadSubtext}>
              Click or drag and drop photos here
            </Text>
          </TouchableOpacity>
          {errors.photos && (
            <Text style={styles.errorText}>{errors.photos}</Text>
          )}

          <View style={styles.photoGrid}>
            {photos.map((photo, index) => (
              <Image
                key={index}
                source={{ uri: photo }}
                style={styles.photoThumbnail}
              />
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Other Rooms (Optional)</Text>
          <View style={styles.optionsContainer}>
            {["Pooja Room", "Servant Room", "Study Room", "Others"].map(
              (room) => (
                <SelectionButton
                  key={room}
                  title={room}
                  selected={otherRooms.includes(room)}
                  onPress={() => {
                    setOtherRooms(
                      otherRooms.includes(room)
                        ? otherRooms.filter((r) => r !== room)
                        : [...otherRooms, room]
                    );
                  }}
                />
              )
            )}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Furnishing (Optional)</Text>
          <View style={styles.optionsContainer}>
            {["Unfurnished", "Semi-Furnished", "Furnished"].map((option) => (
              <SelectionButton
                key={option}
                title={option}
                selected={furnishing === option}
                onPress={() => setFurnishing(option)}
              />
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Reserved Parking (Optional)</Text>
          <View style={styles.optionsContainer}>
            {["Covered Parking", "Open Parking"].map((option) => (
              <SelectionButton
                key={option}
                title={option}
                selected={parking.includes(option)}
                onPress={() => {
                  setParking(
                    parking.includes(option)
                      ? parking.filter((p) => p !== option)
                      : [...parking, option]
                  );
                }}
              />
            ))}
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Fixed Bottom Bar */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.bottomButton}
          onPress={handleFormSubmit}
        >
          <Text style={styles.bottomButtonText}>Submit</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Form3;

/* --- STYLES --- */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  /* HEADER */
  header: {
    backgroundColor: "#fff",
    zIndex: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 0, // to avoid overlap with header
    paddingBottom: 25,
  },
  arrow: {
    fontSize: 24,
    color: "#333",
  },
  whatsapp: {
    fontSize: 16,
    color: "#0066CC",
    fontWeight: "600",
  },

  /* SCROLL CONTENT */
  scrollContent: {
    paddingTop: 16, // offset for header
    paddingHorizontal: 16,
    paddingBottom: 60, // offset for bottom bar
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 25,
  },
  uploadContainer: {
    borderWidth: 2,
    borderColor: "#ddd",
    borderStyle: "dashed",
    borderRadius: 8,
    padding: 24,
    paddingVertical: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  uploadText: {
    fontSize: 18,
    color: "#242a80",
    fontWeight: "600",
    marginBottom: 8,
  },
  uploadSubtext: {
    fontSize: 14,
    color: "#666",
  },
  photoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 16,
  },
  photoThumbnail: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  errorText: {
    color: "#ff0000",
    fontSize: 14,
    marginTop: 4,
  },

  /* SELECTION BUTTONS */
  optionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  selectionButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
  },
  selectedButton: {
    backgroundColor: "#242a80",
    borderColor: "#0066CC",
  },
  selectionText: {
    color: "#333",
    fontSize: 16,
  },
  selectedText: {
    color: "#ffffff",
  },

  /* BOTTOM BAR */
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  bottomButton: {
    backgroundColor: "#242a80",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    width: '80%',
  },
  bottomButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});
