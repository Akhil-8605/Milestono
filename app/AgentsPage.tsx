// App.js
import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  Modal,
  Pressable,
  Dimensions,
} from "react-native";

const ITEMS_PER_PAGE_OPTIONS: (number | "All")[] = [4, 10, 20, 25, "All"];

type Agent = {
  id: string;
  name: string;
  company: string;
  operatingSince: string;
  logo?: any;
  address: string;
};

const agents: Agent[] = [
  {
    id: "1",
    name: "Sri Sai Builders",
    company: "Sri Sai Associates",
    operatingSince: "2009",
    logo: require("../assets/images/agentsdummy.png"),
    address: "adress address address",
  },
  {
    id: "1",
    name: "Sri Sai Builders",
    company: "Sri Sai Associates",
    operatingSince: "2009",
    address: "adress address address",
  },
  {
    id: "1",
    name: "Sri Sai Builders",
    company: "Sri Sai Associates",
    operatingSince: "2009",
    logo: require("../assets/images/agentsdummy.png"),
    address: "adress address address",
  },
  {
    id: "1",
    name: "Sri Sai Builders",
    company: "Sri Sai Associates",
    operatingSince: "2009",
    address: "adress address address",
  },
  {
    id: "1",
    name: "Sri Sai Builders",
    company: "Sri Sai Associates",
    operatingSince: "2009",
    address: "adress address address",
  },
  {
    id: "1",
    name: "Sri Sai Builders",
    company: "Sri Sai Associates",
    operatingSince: "2009",
    address: "adress address address",
  },
  {
    id: "1",
    name: "Sri Sai Builders",
    company: "Sri Sai Associates",
    operatingSince: "2009",
    address: "adress address address",
  },
  {
    id: "1",
    name: "Sri Sai Builders",
    company: "Sri Sai Associates",
    operatingSince: "2009",
    address: "adress address address",
  },
  {
    id: "1",
    name: "Sri Sai Builders",
    company: "Sri Sai Associates",
    operatingSince: "2009",
    address: "adress address address",
  },
  {
    id: "1",
    name: "Sri Sai Builders",
    company: "Sri Sai Associates",
    operatingSince: "2009",
    address: "adress address address",
  },
  {
    id: "1",
    name: "Sri Sai Builders",
    company: "Sri Sai Associates",
    operatingSince: "2009",
    address: "adress address address",
  },
  {
    id: "1",
    name: "Sri Sai Builders",
    company: "Sri Sai Associates",
    operatingSince: "2009",
    address: "adress address address",
  },
  {
    id: "1",
    name: "Sri Sai Builders",
    company: "Sri Sai Associates",
    operatingSince: "2009",
    address: "adress address address",
  },
  {
    id: "1",
    name: "Sri Sai Builders",
    company: "Sri Sai Associates",
    operatingSince: "2009",
    address: "adress address address",
  },
  {
    id: "1",
    name: "Sri Sai Builders",
    company: "Sri Sai Associates",
    operatingSince: "2009",
    address: "adress address address",
  },
  {
    id: "1",
    name: "Sri Sai Builders",
    company: "Sri Sai Associates",
    operatingSince: "2009",
    address: "adress address address",
  },
  {
    id: "1",
    name: "Sri Sai Builders",
    company: "Sri Sai Associates",
    operatingSince: "2009",
    address: "adress address address",
  },
  {
    id: "1",
    name: "Sri Sai Builders",
    company: "Sri Sai Associates",
    operatingSince: "2009",
    address: "adress address address",
  },

  // Add more agents as needed
];

const AgentCard = ({ item }: { item: Agent }) => (
  <View key={item.id} style={styles.card}>
    <View style={styles.cardContent}>
      <View style={styles.logoContainer}>
        <Image
          {...item.logo ? { source: item.logo }: { source: require("../assets/images/PersonDummy.png") }}
          style={styles.logo}
          resizeMode="cover"
        />
        <View style={styles.DataContainer}>
          <Text>{item.name}</Text>
          <Text style={styles.companyName}>{item.company}</Text>
        </View>
      </View>

      <View style={styles.infoContainer}>
        <View style={styles.operatingContainer}>
          <Text style={styles.operatingLabel}>Operating Since</Text>
          <Text style={styles.operatingYear}>{item.operatingSince}</Text>
        </View>

        <View style={styles.addressContainer}>
          <Text style={styles.addressLabel}>Address</Text>
          <Text style={styles.addressDetail}>{item.address}</Text>
        </View>
      </View>
    </View>
  </View>
);

export default function Agents() {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState<number | "All">(4);
  const [showModal, setShowModal] = useState(false);

  const totalPages =
    itemsPerPage === "All"
      ? 1
      : Math.ceil(agents.length / Number(itemsPerPage));

  const getCurrentData = () => {
    if (itemsPerPage === "All") {
      return agents;
    }

    const begin = (currentPage - 1) * Number(itemsPerPage);
    const end = begin + Number(itemsPerPage);
    return agents.slice(begin, end);
  };

  const renderPaginationButtons = () => {
    const buttons = [];
    for (let i = 1; i <= totalPages; i++) {
      buttons.push(
        <TouchableOpacity
          key={i}
          style={[
            styles.pageButton,
            currentPage === i && styles.activePageButton,
          ]}
          onPress={() => setCurrentPage(i)}
        >
          <Text
            style={[
              styles.pageButtonText,
              currentPage === i && styles.activePageButtonText,
            ]}
          >
            {i}
          </Text>
        </TouchableOpacity>
      );
    }
    return buttons;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Milestone Preferred Agents</Text>
        <TouchableOpacity
          style={styles.dropdown}
          onPress={() => setShowModal(true)}
        >
          <Text>{itemsPerPage}</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={getCurrentData()}
        renderItem={({ item }) => <AgentCard item={item} />}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsHorizontalScrollIndicator={false}
      />

      <View style={styles.pagination}>
        <TouchableOpacity
          style={styles.pageButton}
          disabled={currentPage === 1}
          onPress={() => setCurrentPage((prev) => prev - 1)}
        >
          <Text style={styles.pageButtonText}>Prev</Text>
        </TouchableOpacity>

        {renderPaginationButtons()}

        <TouchableOpacity
          style={styles.pageButton}
          disabled={currentPage === totalPages}
          onPress={() => setCurrentPage((prev) => prev + 1)}
        >
          <Text style={styles.pageButtonText}>Next</Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={showModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowModal(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setShowModal(false)}
        >
          <View style={styles.modalContent}>
            {ITEMS_PER_PAGE_OPTIONS.map((option) => (
              <TouchableOpacity
                key={option}
                style={styles.modalItem}
                onPress={() => {
                  setItemsPerPage(option);
                  setCurrentPage(1);
                  setShowModal(false);
                }}
              >
                <Text style={styles.modalItemText}>{option}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 30,
    gap: 10,
  },
  title: {
    fontSize: 25,
    fontWeight: "700",
    color: "#333333",
    maxWidth: "85%",
  },
  dropdown: {
    padding: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 4,
    minWidth: 50,
    alignItems: "center",
  },
  listContainer: {
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 16,
    paddingVertical: 10,
    marginHorizontal: "auto"
  },
  card: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginRight: 16,
    width: width * 0.85,
    margin: "auto",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 5,
    elevation: 10,
  },
  cardContent: {
    justifyContent: "center",
    marginHorizontal: 15,
    // marginHorizontal: "auto",
    marginVertical: 15,
    // marginVertical: "auto",
  },
  logoContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 12,
  },
  logo: {
    width: 56,
    height: 56,
    borderWidth: 1,
    borderRadius: 28,
  },
  DataContainer: {
    flexDirection: "column",
  },
  agentName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 0,
  },
  companyName: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 16,
  },
  infoContainer: {
    flexDirection: "row",
    gap: 20,
  },
  operatingContainer: {
    backgroundColor: "#EEF2FF",
    padding: 8,
    borderRadius: 6,
  },
  operatingLabel: {
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 2,
  },
  operatingYear: {
    fontSize: 16,
    fontWeight: "600",
    color: "#4F46E5",
  },
  addressContainer: {
    padding: 8,
    backgroundColor: "#ecfdf5",
    borderRadius: 6,
  },
  addressLabel: {
    fontSize: 12,
    color: "#10B981",
  },
  addressDetail: {
    fontSize: 12,
    flexWrap: "wrap",
    marginTop: 2,
    width: 125,
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16,
    gap: 8,
  },
  pageButton: {
    padding: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 4,
    minWidth: 40,
    alignItems: "center",
  },
  activePageButton: {
    backgroundColor: "#242a80",
    borderColor: "#2563eb",
  },
  pageButtonText: {
    color: "#666",
  },
  activePageButtonText: {
    color: "white",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 8,
    minWidth: 150,
  },
  modalItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  modalItemText: {
    fontSize: 16,
  },
});
