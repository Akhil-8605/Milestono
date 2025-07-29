"use client"

import type React from "react"
import { useState, useEffect, useCallback } from "react"
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  StatusBar,
  ActivityIndicator,
  Alert,
  RefreshControl,
  Modal,
} from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { useRoute, type RouteProp } from "@react-navigation/native"
import { BASE_URL } from "@env"

// Local image imports - you'll need to add these to your assets
const serviceRequestImage = require("../assets/images/serviceRequest.jpg")

const TABS = [
  { id: "requested", title: "Requested Services" },
  { id: "provided", title: "Provided Services" },
]

// Define route params type
type RouteParams = {
  MyServicesPage: {
    initialTab?: string
  }
}

interface Service {
  _id: string
  name: string
  category: string
  description: string
  price?: number
  status: string
  landmark: string
  image?: string
  customerPhone?: string
  vendorPhone?: string
  otp?: string
  expectedPrice?: number
}

interface ServiceCardProps {
  item: Service
  onPress: (service: Service) => void
  isProvided?: boolean
}

const RequestedServiceCard = ({ item, onPress }: ServiceCardProps) => {
  const getStatusColor = (status: string) => {
    const normalizedStatus = status.toLowerCase()
    switch (normalizedStatus) {
      case "requested":
        return "#f0ad4e"
      case "quoted":
        return "#fc7d7d"
      case "paid":
        return "#0275d8"
      case "completed":
      case "done":
        return "#5cb85c"
      default:
        return "#d9534f"
    }
  }

  const mapStatusLabel = (status: string) => {
    const normalizedStatus = status.toLowerCase()
    switch (normalizedStatus) {
      case "requested":
        return "Requested"
      case "quoted":
        return "Quoted"
      case "paid":
        return "Paid"
      case "completed":
      case "done":
        return "Completed"
      default:
        return "Requested"
    }
  }

  return (
    <TouchableOpacity style={styles.serviceCard} onPress={() => onPress(item)}>
      <View style={styles.cardHeader}>
        <View style={styles.serviceInfo}>
          <Text style={styles.serviceName}>{item.name}</Text>
          <Text style={styles.serviceCategory}>{item.category}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Text style={styles.statusText}>{mapStatusLabel(item.status)}</Text>
        </View>
      </View>

      <Text style={styles.serviceDescription} numberOfLines={2}>
        {item.description}
      </Text>

      <View style={styles.cardFooter}>
        <Text style={styles.locationText}>📍 {item.landmark}</Text>
        {item.price && <Text style={styles.priceText}>₹{item.price}</Text>}
      </View>
    </TouchableOpacity>
  )
}

const ProvidedServiceCard = ({ item, onPress }: ServiceCardProps) => {
  const getStatusColor = (status: string) => {
    const normalizedStatus = status.toLowerCase()
    switch (normalizedStatus) {
      case "requested":
      case "vendorreview":
        return "#f0ad4e"
      case "accepted":
      case "adminreview":
        return "#0275d8"
      case "paid":
        return "#ff7f50"
      case "verified":
        return "#5cb85c"
      case "done":
        return "#fc7d7d"
      case "completed":
        return "#5cb85c"
      default:
        return "#d9534f"
    }
  }

  const mapStatusLabel = (status: string) => {
    const normalizedStatus = status.toLowerCase()
    switch (normalizedStatus) {
      case "completed":
        return "Completed"
      case "done":
        return "Paid to you"
      default:
        return "Accepted"
    }
  }

  return (
    <TouchableOpacity style={styles.serviceCard} onPress={() => onPress(item)}>
      <View style={styles.cardHeader}>
        <View style={styles.serviceInfo}>
          <Text style={styles.serviceName}>{item.name}</Text>
          <Text style={styles.serviceCategory}>{item.category}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Text style={styles.statusText}>{mapStatusLabel(item.status)}</Text>
        </View>
      </View>

      <Text style={styles.serviceDescription} numberOfLines={2}>
        {item.description}
      </Text>

      <View style={styles.cardFooter}>
        <Text style={styles.locationText}>📍 {item.landmark}</Text>
        <Text style={styles.customerPhone}>📞 {item.customerPhone}</Text>
      </View>

      {item.price && (
        <View style={styles.priceContainer}>
          <Text style={styles.priceText}>₹{item.price}</Text>
        </View>
      )}
    </TouchableOpacity>
  )
}

const ServiceDetailModal = ({
  visible,
  service,
  onClose,
  isProvided,
}: {
  visible: boolean
  service: Service | null
  onClose: () => void
  isProvided: boolean
}) => {
  if (!service) return null

  const getStatusColor = (status: string) => {
    const normalizedStatus = status.toLowerCase()
    if (isProvided) {
      switch (normalizedStatus) {
        case "requested":
        case "vendorreview":
          return "#f0ad4e"
        case "accepted":
        case "adminreview":
          return "#0275d8"
        case "paid":
          return "#ff7f50"
        case "verified":
          return "#5cb85c"
        case "done":
          return "#fc7d7d"
        case "completed":
          return "#5cb85c"
        default:
          return "#d9534f"
      }
    } else {
      switch (normalizedStatus) {
        case "requested":
          return "#f0ad4e"
        case "quoted":
          return "#fc7d7d"
        case "paid":
          return "#0275d8"
        case "completed":
        case "done":
          return "#5cb85c"
        default:
          return "#d9534f"
      }
    }
  }

  const mapStatusLabel = (status: string) => {
    const normalizedStatus = status.toLowerCase()
    if (isProvided) {
      switch (normalizedStatus) {
        case "completed":
          return "Completed"
        case "done":
          return "Paid to you"
        default:
          return "Accepted"
      }
    } else {
      switch (normalizedStatus) {
        case "requested":
          return "Requested"
        case "quoted":
          return "Quoted"
        case "paid":
          return "Paid"
        case "completed":
        case "done":
          return "Completed"
        default:
          return "Requested"
      }
    }
  }

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Service Details</Text>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
          {service.image && <Image source={{ uri: service.image }} style={styles.modalImage} />}

          <View style={[styles.modalStatusBadge, { backgroundColor: getStatusColor(service.status) }]}>
            <Text style={styles.modalStatusText}>{mapStatusLabel(service.status)}</Text>
          </View>

          <View style={styles.detailsContainer}>
            <DetailRow label="Service Name" value={service.name} />
            <DetailRow label="Category" value={service.category} />
            <DetailRow label="Description" value={service.description} />
            <DetailRow label="Location" value={service.landmark} />

            {isProvided ? (
              <DetailRow label="Customer Phone" value={service.customerPhone || "N/A"} />
            ) : (
              <DetailRow label="Vendor Phone" value={service.vendorPhone || "N/A"} />
            )}

            {service.price && <DetailRow label="Price" value={`₹${service.price}`} />}

            {service.otp && <DetailRow label="OTP" value={service.otp} />}
          </View>

          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonText}>{isProvided ? "Go To Request ➡️" : "Go To Request ➡️"}</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  )
}

const DetailRow = ({ label, value }: { label: string; value: string }) => (
  <View style={styles.detailRow}>
    <Text style={styles.detailLabel}>{label}:</Text>
    <Text style={styles.detailValue}>{value}</Text>
  </View>
)

export default function MyServicesPage() {
  const route = useRoute<RouteProp<RouteParams, "MyServicesPage">>()
  const initialTab = route.params?.initialTab || "requested"

  const [activeTab, setActiveTab] = useState(initialTab)
  const [loading, setLoading] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [requestedServices, setRequestedServices] = useState<Service[]>([])
  const [providedServices, setProvidedServices] = useState<Service[]>([])
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [modalVisible, setModalVisible] = useState(false)

  // Update active tab when route params change
  useEffect(() => {
    if (route.params?.initialTab) {
      setActiveTab(route.params.initialTab)
    }
  }, [route.params?.initialTab])

  const fetchData = useCallback(async (endpoint: string, setter: React.Dispatch<React.SetStateAction<Service[]>>) => {
    setLoading(true)
    const token = await AsyncStorage.getItem("auth")
    if (!token) {
      console.error("No auth token found")
      setLoading(false)
      setRefreshing(false)
      Alert.alert("Authentication Required", "Please log in to view your services.")
      return
    }

    try {
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        headers: {
          Authorization: token,
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      setter(data || [])
    } catch (error) {
      console.error(`Error fetching data from ${endpoint}:`, error)
      Alert.alert("Error", "Failed to load services. Please check your network and try again.")
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  const onRefresh = useCallback(() => {
    setRefreshing(true)
    switch (activeTab) {
      case "requested":
        fetchData("/api/services-requests", setRequestedServices)
        break
      case "provided":
        fetchData("/api/services-vendor", setProvidedServices)
        break
      default:
        setRefreshing(false)
        break
    }
  }, [activeTab, fetchData])

  useEffect(() => {
    onRefresh()
  }, [activeTab, onRefresh])

  const handleServicePress = (service: Service) => {
    setSelectedService(service)
    setModalVisible(true)
  }

  const renderTabContent = () => {
    const NoServicesFound = ({
      imageSource,
      title,
      description,
    }: {
      imageSource: any
      title: string
      description: string
    }) => (
      <View style={styles.noFoundContainer}>
        <Image source={imageSource} style={styles.noFoundImage} />
        <Text style={styles.noFoundTitle}>{title}</Text>
        <Text style={styles.noFoundDescription}>{description}</Text>
      </View>
    )

    const commonFlatListProps = {
      keyExtractor: (item: Service) => item._id,
      showsVerticalScrollIndicator: false,
      refreshControl: <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#232761" />,
      contentContainerStyle: { paddingBottom: 20 },
    }

    switch (activeTab) {
      case "requested":
        return (
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Requested Services</Text>
            <Text style={styles.sectionSubtitle}>Track your service requests and their status</Text>
            {requestedServices.length > 0 ? (
              <FlatList
                data={requestedServices}
                renderItem={({ item }) => <RequestedServiceCard item={item} onPress={handleServicePress} />}
                {...commonFlatListProps}
              />
            ) : (
              <NoServicesFound
                imageSource={serviceRequestImage}
                title="No service requests yet!"
                description="When you request services, they will appear here. Start exploring services in your area."
              />
            )}
          </View>
        )
      case "provided":
        return (
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Provided Services</Text>
            <Text style={styles.sectionSubtitle}>Manage services you're providing to customers</Text>
            {providedServices.length > 0 ? (
              <FlatList
                data={providedServices}
                renderItem={({ item }) => <ProvidedServiceCard item={item} onPress={handleServicePress} />}
                {...commonFlatListProps}
              />
            ) : (
              <NoServicesFound
                imageSource={serviceRequestImage}
                title="No services provided yet!"
                description="When customers request your services, they will appear here. Make sure your profile is complete."
              />
            )}
          </View>
        )
      default:
        return null
    }
  }

  const statusBarHeight = StatusBar.currentHeight || 0

  return (
    <SafeAreaView style={[styles.container, { marginTop: statusBarHeight }]}>
      <View style={styles.tabContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabScroll}>
          {TABS.map((tab) => (
            <TouchableOpacity
              key={tab.id}
              style={[styles.tab, activeTab === tab.id && styles.activeTab]}
              onPress={() => setActiveTab(tab.id)}
            >
              <Text style={[styles.tabText, activeTab === tab.id && styles.activeTabText]}>
                {tab.title} ({tab.id === "requested" ? requestedServices.length : providedServices.length})
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.content}>
        {loading && !refreshing ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#232761" />
            <Text style={styles.loadingText}>Loading services...</Text>
          </View>
        ) : (
          renderTabContent()
        )}
      </View>

      <ServiceDetailModal
        visible={modalVisible}
        service={selectedService}
        onClose={() => {
          setModalVisible(false)
          setSelectedService(null)
        }}
        isProvided={activeTab === "provided"}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f2f5",
  },
  tabContainer: {
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  tabScroll: {
    paddingHorizontal: 16,
    alignItems: "center",
  },
  tab: {
    paddingVertical: 14,
    paddingHorizontal: 18,
    marginRight: 12,
  },
  activeTab: {
    borderBottomWidth: 3,
    borderBottomColor: "#232761",
  },
  tabText: {
    fontSize: 13,
    color: "#666666",
    fontWeight: "500",
  },
  activeTabText: {
    color: "#232761",
    fontWeight: "600",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  sectionContainer: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#333333",
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: "#666666",
    fontWeight: "400",
    marginBottom: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666666",
  },
  noFoundContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#ffffff",
    borderRadius: 12,
    marginTop: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  noFoundImage: {
    width: 250,
    height: 250,
    resizeMode: "contain",
    marginBottom: 20,
  },
  noFoundTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333333",
    textAlign: "center",
    marginBottom: 10,
  },
  noFoundDescription: {
    fontSize: 14,
    color: "#666666",
    textAlign: "center",
    lineHeight: 20,
  },
  serviceCard: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    marginBottom: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  serviceInfo: {
    flex: 1,
    marginRight: 12,
  },
  serviceName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333333",
    marginBottom: 4,
  },
  serviceCategory: {
    fontSize: 13,
    color: "#666666",
    fontWeight: "500",
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    minWidth: 80,
    alignItems: "center",
  },
  statusText: {
    fontSize: 12,
    color: "#ffffff",
    fontWeight: "600",
  },
  serviceDescription: {
    fontSize: 14,
    color: "#555555",
    lineHeight: 20,
    marginBottom: 12,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  locationText: {
    fontSize: 12,
    color: "#666666",
    flex: 1,
  },
  customerPhone: {
    fontSize: 12,
    color: "#666666",
    marginLeft: 12,
  },
  priceText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#232761",
  },
  priceContainer: {
    marginTop: 8,
    alignItems: "flex-end",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333333",
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
  },
  closeButtonText: {
    fontSize: 16,
    color: "#666666",
    fontWeight: "600",
  },
  modalContent: {
    flex: 1,
    padding: 16,
  },
  modalImage: {
    width: "100%",
    height: 200,
    borderRadius: 12,
    marginBottom: 16,
    resizeMode: "cover",
  },
  modalStatusBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: "flex-start",
    marginBottom: 20,
  },
  modalStatusText: {
    fontSize: 14,
    color: "#ffffff",
    fontWeight: "600",
  },
  detailsContainer: {
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  detailRow: {
    flexDirection: "row",
    marginBottom: 12,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333333",
    width: 120,
  },
  detailValue: {
    fontSize: 14,
    color: "#555555",
    flex: 1,
  },
  actionButton: {
    backgroundColor: "#232761",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 20,
  },
  actionButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
})
