"use client"

import { View, Text, TouchableOpacity, StyleSheet } from "react-native"

export default function PropertyRegistration() {
  const stats = [
    { number: "04", label: "Property Listings" },
    { number: "05", label: "Projects" },
    { number: "27", label: "Total Users" },
  ]

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>SELL OR RENT YOUR PROPERTY</Text>

      <Text style={styles.title}>Register to post your property</Text>

      <Text style={styles.subtitle}>Post your residential / commercial property</Text>

      <View style={styles.statsContainer}>
        {stats.map((stat, index) => (
          <View key={index} style={styles.statItem}>
            <Text style={styles.statNumber}>{stat.number}</Text>
            <Text style={styles.statLabel}>{stat.label}</Text>
          </View>
        ))}
      </View>

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Post your property</Text>
      </TouchableOpacity>

      <Text style={styles.footerText}>
        Or post via <Text style={styles.whatsappText}>Whatsapp, send a "hi" to</Text>
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fffbf2",
    padding: 24,
    alignItems: "center",
    width: "100%",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOpacity: .1,
    shadowRadius: 10,
    marginBottom: 24,
  },
  headerText: {
    color: "#6B7280",
    fontSize: 14,
    marginBottom: 16,
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#1E1B4B",
    textAlign: "center",
    marginBottom: 12,
    lineHeight: 40,
  },
  subtitle: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 32,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginBottom: 32,
  },
  statItem: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1E1B4B",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: "#6B7280",
  },
  button: {
    backgroundColor: "#1E1B4B",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 6,
    marginBottom: 24,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  footerText: {
    fontSize: 14,
    color: "#6B7280",
  },
  whatsappText: {
    color: "#6B7280",
  },
})

