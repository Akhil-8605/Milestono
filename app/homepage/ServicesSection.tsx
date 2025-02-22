import React from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  Platform,
} from "react-native";

const services = [
  {
    id: "1",
    title: "Buying a commercial property",
    description: "Shops, offices, land, factories, warehouses and more",
    image: require("../../assets/images/exploreimg1.webp"),
  },
  {
    id: "2",
    title: "Leasing a commercial property",
    description: "Shops, offices, land, factories, warehouses and more",
    image: require("../../assets/images/exploreimg2.webp"),
  },
  {
    id: "3",
    title: "Buy Plots/Land",
    description:
      "Residential Plots, Agricultural Farm lands, Inst. Lands and more",
    image: require("../../assets/images/exploreimg3.webp"),
  },
  {
    id: "4",
    title: "Renting a home",
    description: "Apartments, builder floors, villas and more",
    image: require("../../assets/images/exploreimg4.webp"),
  },
  {
    id: "5",
    title: "PG and co-living",
    description: "Organised, owner and broker listed PGs",
    image: require("../../assets/images/exploreimg5.webp"),
  },
];

export default function ServicesSection() {
  return (
    <View style={styles.container}>
      <Text style={styles.brandName}>Milestono</Text>
      <Text style={styles.heading}>Explore our services</Text>

      <View style={styles.card}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {services.map((service) => (
            <TouchableOpacity key={service.id} style={styles.serviceItem}>
              <Image
                source={service.image}
                style={styles.serviceImage}
                resizeMode="cover"
              />
              <View style={styles.serviceContent}>
                <Text style={styles.serviceTitle}>{service.title}</Text>
                <Text style={styles.serviceDescription}>
                  {service.description}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fffbf2",
    padding: 20,
    paddingTop: 30,
    borderRadius: 16,
    position: "relative",
    height: 300,
    marginBottom: 300,
  },
  brandName: {
    fontSize: 16,
    color: "#666666",
    marginBottom: 0,
    fontWeight: "400",
  },
  heading: {
    fontSize: 30,
    fontWeight: "700",
    color: "#1E1B4B",
    marginBottom: 12,
  },
  card: {
    backgroundColor: "white",
    position: "absolute",
    borderRadius: 16,
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
    width: "95%",
    transform: [{ translateY: 100 }, { translateX: 0 }],
    marginHorizontal: 25,
  },
  scrollContent: {
    padding: 16,
  },
  serviceItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  serviceImage: {
    width: 56,
    height: 56,
    borderRadius: 8,
    marginRight: 16,
  },
  serviceContent: {
    flex: 1,
  },
  serviceTitle: {
    fontSize: 16,
    color: "#1A1A1A",
    fontWeight: "500",
    marginBottom: 4,
  },
  serviceDescription: {
    fontSize: 14,
    color: "#666666",
    lineHeight: 20,
  },
});
