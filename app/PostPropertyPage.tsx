"use client"

import { useState, useEffect } from "react"
import { View, StyleSheet, StatusBar, Alert, ScrollView } from "react-native"
import Form1 from "./postproperty/PropertyForm1"
import Form2 from "./postproperty/PropertyForm2"
import Form3 from "./postproperty/PropertyForm3"
import Header from "./components/Header"
import axios from "axios"
import { BASE_URL } from "@env"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { useNavigation } from "expo-router"
import { goBack } from "expo-router/build/global-state/routing"
interface PhotoFile {
  uri: string
  name: string
  type: string
}

interface FormData {
  heading: string
  sellType: string
  propertyCategory: string
  oldProperty: string
  propertyContains: string[]
  amenities: string[]
  furnitures: string[]
  city: string
  landmark: string
  bedrooms: string
  bathrooms: string
  balconies: string
  ownership: string
  expectedPrice: string
  pricePerSqFt: string
  deposite: string
  pricePerMonth: string
  isAllInclusive: boolean
  isPriceNegotiable: boolean
  isTaxchargeExc: boolean
  uniqueFeatures: string
  areaSqft: string
  latitude: number
  longitude: number
  sellerType: string
  reservedParking: string
  selectedFurnishing: string
  selectedRoom: string[]
}

const PostProperty = () => {
  const [currentStep, setCurrentStep] = useState(1)
  const [disabled, setDisabled] = useState(true)
  const [uploadedPhotos, setUploadedPhotos] = useState<PhotoFile[]>([])

  const navigation = useNavigation();

  useEffect(() => {
    checkEligibility(); // Check eligibility on mount 
  })

  const [formData, setFormData] = useState<FormData>({
    heading: "",
    sellType: "",
    propertyCategory: "",
    oldProperty: "",
    propertyContains: [],
    amenities: [],
    furnitures: [],
    city: "",
    landmark: "",
    bedrooms: "",
    bathrooms: "",
    balconies: "",
    ownership: "",
    expectedPrice: "",
    pricePerSqFt: "",
    deposite: "",
    pricePerMonth: "",
    isAllInclusive: false,
    isPriceNegotiable: false,
    isTaxchargeExc: false,
    uniqueFeatures: "",
    areaSqft: "",
    latitude: 18.52097398044019,
    longitude: 73.86017831259551,
    sellerType: "",
    reservedParking: "",
    selectedFurnishing: "",
    selectedRoom: [],
  })

  const updateFormData = (data: Partial<FormData>) => {
    setFormData((prev) => ({ ...prev, ...data }))
  }

  const handleNext = () => setCurrentStep((prev) => prev + 1)
  const handleBack = () => setCurrentStep((prev) => prev - 1)

  const checkEligibility = async () => {
    try {
      const token = await AsyncStorage.getItem("auth")
      if (!token) {
        return Alert.alert(
          "Error",
          "Login is required to post a property.",
          [
            {
              text: "Exit",
              style: "cancel",
              onPress: () => goBack(),
            },
            {
              text: "Login",
              onPress: () => navigation.navigate("LoginPage" as never),
            },
          ],
          { cancelable: true }
        );
      }

      const res = await axios.get(`${BASE_URL}/api/check-num-of-properties`, {
        headers: { Authorization: token },
      })
      setDisabled(!(res.data as any).canPost)
    } catch (err) {
      console.error("Eligibility check failed", err)
    }
  }

  const handleSubmit = async () => {
    if (disabled) {
      return Alert.alert("Exceed Post Limit. Purchase Premium Account")
    }

    try {
      const token = await AsyncStorage.getItem("auth")
      if (!token) {
        Alert.alert("Error", "Authentication token not found")
        return
      }

      const formDataObj = new FormData()
      formDataObj.append("formData", JSON.stringify(formData))

      for (let i = 0; i < uploadedPhotos.length; i++) {
        const photo = uploadedPhotos[i]
        const fileName = photo.name || photo.uri.split("/").pop() || `image_${i}.jpg`
        const fileType = fileName.split(".").pop() || "jpg"

        formDataObj.append("images", {
          uri: photo.uri,
          name: fileName,
          type: `image/${fileType}`,
        } as any)
      }

      const res = await axios.post(`${BASE_URL}/api/property_details`, formDataObj, {
        headers: {
          Authorization: token,
          "Content-Type": "multipart/form-data",
        },
      })

      Alert.alert("Success", (res.data as any).message)
    } catch (err: any) {
      console.error("Upload Error:", err?.response?.data || err.message)
      Alert.alert("Error", "Failed to submit property.")
    }
  }

  useEffect(() => {
    checkEligibility()
  }, [])

  const statusBarHeight = StatusBar.currentHeight || 0

  return (
    <View style={[styles.container, { marginTop: statusBarHeight }]}>
      <Header />
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        {currentStep === 1 && <Form1 formData={formData} updateFormData={updateFormData} onNext={handleNext} />}
        {currentStep === 2 && (
          <Form2 formData={formData} updateFormData={updateFormData} onNext={handleNext} onBack={handleBack} />
        )}
        {currentStep === 3 && (
          <Form3
            formData={formData}
            updateFormData={updateFormData}
            uploadedPhotos={uploadedPhotos}
            setUploadedPhotos={setUploadedPhotos}
            onBack={handleBack}
            onSubmit={handleSubmit}
            disabled={disabled}
          />
        )}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
})

export default PostProperty
