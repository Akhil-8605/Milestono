import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import { useEffect, useRef, useState } from "react";
import { useNavigation } from "expo-router";
import Svg, { Path } from "react-native-svg";
import { FontAwesome5, MaterialIcons } from "@expo/vector-icons";

const agents = [
  {
    id: "1",
    name: "Sri Sai Builders",
    company: "Sri Sai Associates",
    operatingSince: "2009",
    logo: require("../../assets/images/agentsdummy.png"),
    address: "address address address address",
  },
  {
    id: "2",
    name: "Sri Sai Developers",
    company: "Sri Sai Group",
    operatingSince: "2012",
    logo: require("../../assets/images/agentsdummy.png"),
    address: "address address address address",
  },
  {
    id: "3",
    name: "Sai Ventures",
    company: "Sai Associates",
    operatingSince: "2018",
    logo: require("../../assets/images/agentsdummy.png"),
    address: "address address address address",
  },
  {
    id: "4",
    name: "Sai Infra",
    company: "Sai Builders",
    operatingSince: "2020",
    logo: require("../../assets/images/agentsdummy.png"),
    address: "address address address address",
  },
];

export default function PreferredAgents() {
  const navigation = useNavigation();
  const scrollViewRef = useRef<ScrollView>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === agents.length - 1 ? 0 : prevIndex + 1
      );
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({
        x: currentIndex * 250,
        animated: true,
      });
    }
  }, [currentIndex]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Milestono Preferred Agents</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate("AgentsPage" as never)}
        >
          <Text style={styles.seeAll}>
            <Text>See all </Text>
            <FontAwesome5
              name={"chevron-right"}
              size={16}
              color="#f00"
              style={{ strokeWidth: 0 }}
            />
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        ref={scrollViewRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        scrollEventThrottle={16}
      >
        {agents.map((agent) => (
          <View key={agent.id} style={styles.card}>
            <View style={styles.logoContainer}>
              <Image
                source={agent.logo}
                style={styles.logo}
                resizeMode="cover"
              />
              <View style={styles.DataContainer}>
                <Text style={styles.agentName}>{agent.name}</Text>
                <Text style={styles.companyName}>{agent.company}</Text>
              </View>
            </View>

            <View style={styles.infoContainer}>
              <View style={styles.operatingContainer}>
                <Text style={styles.operatingLabel}>Operating Since</Text>
                <Text style={styles.operatingYear}>{agent.operatingSince}</Text>
              </View>

              <View style={styles.addressContainer}>
                <Text style={styles.addressLabel}>Address</Text>
                <Text style={styles.addressDetail}>{agent.address}</Text>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#f5f5f5",
    alignItems: "flex-start",
  },
  header: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 30,
  },
  title: {
    fontSize: 25,
    fontWeight: "700",
    color: "#333333",
    width: "70%",
  },
  seeAll: {
    fontSize: 16,
    color: "#FF4444",
    fontWeight: 600,
    marginTop: 5,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  scrollContent: {
    paddingRight: 16,
    paddingTop: 2,
    paddingBottom: 10,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginRight: 16,
    width: 250,
    margin: "auto",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    justifyContent: "center",
    shadowOpacity: 0.08,
    shadowRadius: 5,
    elevation: 10,
    alignItems: "flex-start",
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
    gap: 16,
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
    width: 100,
  },
  addressLabel: {
    fontSize: 12,
    color: "#10B981",
  },
  addressDetail: {
    fontSize: 12,
    marginTop: 2,
    width: 100,
  },
});
