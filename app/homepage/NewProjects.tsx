import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  Modal,
  Dimensions,
  Platform,
} from "react-native";

const projects = [
  {
    id: "1",
    title: "Project 1",
    image: require("../../assets/images/newproject1.png"),
    location: "New Delhi",
    status: "Construction Completed",
    description: "We are launching a new project, please check properly",
  },
  {
    id: "2",
    title: "Project 2",
    image: require("../../assets/images/newproject2.png"),
    location: "New Delhi",
    status: "Construction Completed",
    description: "We are launching a new project, please check properly",
  },
  {
    id: "3",
    title: "Project 3",
    image: require("../../assets/images/newproject3.png"),
    location: "New Delhi",
    status: "Construction Completed",
    description: "We are launching a new project, please check properly",
  },
  {
    id: "4",
    title: "Project 4",
    image: require("../../assets/images/newproject4.png"),
    location: "New Delhi",
    status: "Construction Completed",
    description: "We are launching a new project, please check properly",
  },
];

export default function ProjectsSection() {
  const [selectedProject, setSelectedProject] = useState(null);

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Explore our Projects</Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {projects.map((project) => (
          <TouchableOpacity
            key={project.id}
            style={styles.card}
            onPress={() => setSelectedProject(project)}
          >
            <Image
              source={project.image}
              style={styles.projectImage}
              resizeMode="cover"
            />
            <Text style={styles.projectTitle}>{project.title}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <TouchableOpacity>
        <Text style={styles.seeMore}>See More</Text>
      </TouchableOpacity>

      <Modal
        visible={selectedProject !== null}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setSelectedProject(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setSelectedProject(null)}
            >
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity> */}

            {selectedProject && (
              <>
                <Image
                  source={selectedProject.image}
                  style={styles.modalImage}
                  resizeMode="cover"
                />
                <Text style={styles.modalTitle}>{selectedProject.title}</Text>
                <Text style={styles.modalDescription}>
                  {selectedProject.description}
                </Text>
                <Text style={styles.modalLocation}>
                  {selectedProject.location}
                </Text>
                <Text style={styles.modalStatus}>{selectedProject.status}</Text>

                <View style={{ flexDirection: "row", gap: 10 }}>
                  <TouchableOpacity
                    style={styles.inquiryButton}
                    onPress={() => setSelectedProject(null)}
                  >
                    <Text style={styles.inquiryButtonText}>Close</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.inquiryButton}>
                    <Text style={styles.inquiryButtonText}>Inquiry</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  heading: {
    fontSize: 32,
    fontWeight: "700",
    marginBottom: 25,
    color: "#333333",
  },
  scrollContent: {
    paddingRight: 20,
  },
  card: {
    marginRight: 16,
    backgroundColor: "white",
    borderRadius: 16,
    width: width * 0.75,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
    borderWidth: 1,
    borderColor: "lightgrey",
  },
  projectImage: {
    width: "100%",
    height: width * 0.5,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  projectTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#1A1A1A",
    textAlign: "center",
    marginVertical: 12,
  },
  seeMore: {
    fontSize: 16,
    color: "#4A4A9C",
    fontWeight: "500",
    marginTop: 16,
    textAlign: "right",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    width: "100%",
    maxWidth: 400,
  },
  closeButton: {
    position: "absolute",
    right: 16,
    top: 16,
    zIndex: 1,
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  closeButtonText: {
    fontSize: 20,
    color: "#1A1A1A",
    fontWeight: "500",
  },
  modalImage: {
    width: "100%",
    height: 200,
    borderRadius: 12,
    marginBottom: 16,
    margin: "auto",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1A1A1A",
    marginBottom: 8,
  },
  modalDescription: {
    fontSize: 14,
    color: "#666666",
    marginBottom: 12,
    lineHeight: 20,
  },
  modalLocation: {
    fontSize: 14,
    color: "#1A1A1A",
    marginBottom: 4,
  },
  modalStatus: {
    fontSize: 14,
    color: "#4A90E2",
    marginBottom: 16,
  },
  inquiryButton: {
    backgroundColor: "#1A1A4C",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  inquiryButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "500",
  },
});
