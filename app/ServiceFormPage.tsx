"use client"

import { useState, useEffect } from "react"
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  Image,
  ActivityIndicator,
  Alert,
  StatusBar,
} from "react-native"
import { Picker } from "@react-native-picker/picker"
import FontAwesome5 from "react-native-vector-icons/FontAwesome5"
import { useNavigation } from "expo-router"
import AsyncStorage from "@react-native-async-storage/async-storage"
import axios from "axios"
import * as ImagePicker from "expo-image-picker"
import * as DocumentPicker from "expo-document-picker"
import { BASE_URL } from "@env"
import { goBack } from "expo-router/build/global-state/routing"

// Define a type for file assets from ImagePicker or DocumentPicker
type FileAsset = ImagePicker.ImagePickerAsset | DocumentPicker.DocumentPickerAsset

interface FormDataState {
  vendorImage: FileAsset | null
  adharImage: FileAsset | null
  panImage: FileAsset | null
  certificateImage: FileAsset | null
  vendorName: string
  serviceRoll: string
  vendorDescription: string
  experience: string
  district: string
  state: string
  subDistrict: string
  address: string
  serviceCategory: string
  accountNo: string
  ifsccode: string
  adharNumber: string
  panNumber: string
  detailsRead: boolean
  [key: string]: any // For dynamic access to form fields
}

interface FormErrors {
  [key: string]: string
}

const steps = [
  {
    id: 1,
    title: "Profile Information",
    description: "Basic details and professional info",
    icon: "user", // FontAwesome5 icon name
    fields: ["vendorImage", "vendorName", "serviceCategory", "serviceRoll", "vendorDescription", "experience"],
  },
  {
    id: 2,
    title: "Service Location",
    description: "Where you provide services",
    icon: "map-marker-alt", // FontAwesome5 icon name
    fields: ["state", "district", "subDistrict", "address"],
  },
  {
    id: 3,
    title: "Documents & Verification",
    description: "Upload required documents",
    icon: "file-alt", // FontAwesome5 icon name
    fields: ["certificateImage", "adharImage", "panImage", "adharNumber", "panNumber"],
  },
  {
    id: 4,
    title: "Banking & Final Details",
    description: "Payment information and agreement",
    icon: "credit-card", // FontAwesome5 icon name
    fields: ["accountNo", "ifsccode", "detailsRead"],
  },
]

const serviceCategories = [
  "Property Legal",
  "Plumbing",
  "Electrician",
  "Construction",
  "Painting",
  "Cleaning",
  "Interior Designing",
  "Pest Control",
  "Appliance Repair",
  "Carpentry",
  "Landscaping",
  "Courier",
]

const experienceOptions = ["1", "2", "3", "4", "5+"]

export default function ServiceForm() {
  const navigation = useNavigation()
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<FormDataState>({
    vendorImage: null,
    adharImage: null,
    panImage: null,
    certificateImage: null,
    vendorName: "",
    serviceRoll: "",
    vendorDescription: "",
    experience: "",
    district: "",
    state: "",
    subDistrict: "",
    address: "",
    serviceCategory: "",
    accountNo: "",
    ifsccode: "",
    adharNumber: "",
    panNumber: "",
    detailsRead: false,
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [imageSrc, setImageSrc] = useState<string | null>(null)

  const showToast = (message: string, type: "success" | "error") => {
    Alert.alert(type === "success" ? "Success" : "Error", message)
  }

  const getUserServiceDetail = async () => {
    const token = await AsyncStorage.getItem("auth")
    if (!token) {
      setLoading(false)
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
      return
    }
    try {
      const response = await axios.get<FormDataState>(`${BASE_URL}/api/userservicedetail`, {
        headers: {
          Authorization: token,
        },
      })
      // Only update fields that are present in the response and match formData structure
      setFormData((prev) => ({ ...prev, ...response.data }))
      if (response.data.vendorImage && typeof response.data.vendorImage === "string") {
        setImageSrc(response.data.vendorImage)
      }
    } catch (error: any) {
      console.error("Error fetching user service details:", error)
      showToast("Error fetching user service details: " + (error.response?.data?.message || error.message), "error")
    }
  }

  useEffect(() => {
    getUserServiceDetail()
  }, [])

  const calculateProgress = () => {
    const currentStepFields = steps[currentStep - 1].fields
    const completedFields = currentStepFields.filter((field) => {
      if (field === "detailsRead") return formData[field]
      if (field === "vendorImage" || field === "adharImage" || field === "certificateImage" || field === "panImage") {
        return formData[field] !== null
      }
      return formData[field] && formData[field].toString().trim() !== ""
    })
    return Math.round((completedFields.length / currentStepFields.length) * 100)
  }

  const handleInputChange = (name: string, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const handleFileChange = async (fieldName: keyof FormDataState, type: "image" | "document") => {
    let result: ImagePicker.ImagePickerResult | DocumentPicker.DocumentPickerResult

    if (type === "image") {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
      if (status !== "granted") {
        Alert.alert("Permission required", "Please grant media library permissions to upload images.")
        return
      }
      result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
      })
    } else {
      // For documents, getDocumentAsync handles permissions on its own.
      result = await DocumentPicker.getDocumentAsync({
        type: ["image/*", "application/pdf"], // Allow images and PDFs
        copyToCacheDirectory: true,
      })
    }

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const fileAsset = result.assets[0]
      setFormData((prev) => ({ ...prev, [fieldName]: fileAsset }))

      if (fieldName === "vendorImage" && fileAsset.uri) {
        setImageSrc(fileAsset.uri)
      }
      if (errors[fieldName]) {
        setErrors((prev) => ({ ...prev, [fieldName]: "" }))
      }
    }
  }

  const validateCurrentStep = () => {
    const currentStepFields = steps[currentStep - 1].fields
    const newErrors: FormErrors = {}

    currentStepFields.forEach((field) => {
      if (field === "panImage" || field === "panNumber") return // PAN is optional

      if (field === "detailsRead") {
        if (!formData[field]) {
          newErrors[field] = "You must agree to the terms and conditions"
        }
      } else if (
        (field === "vendorImage" || field === "adharImage" || field === "certificateImage") &&
        !formData[field]
      ) {
        newErrors[field] = "This file is required"
      } else if (field === "adharNumber") {
        const adharPattern = /^\d{12}$/
        if (!formData[field] || !adharPattern.test(formData[field] as string)) {
          newErrors[field] = "Invalid Aadhar Card number (12 digits required)"
        }
      } else if (
        field !== "vendorImage" &&
        field !== "adharImage" &&
        field !== "certificateImage" &&
        field !== "detailsRead"
      ) {
        if (!formData[field] || String(formData[field]).trim() === "") {
          newErrors[field] = "This field is required"
        }
      }
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const nextStep = () => {
    if (validateCurrentStep() && currentStep < steps.length) {
      setCurrentStep((prev) => prev + 1)
    } else if (!validateCurrentStep()) {
      showToast("Please fill all required fields correctly.", "error")
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1)
    }
  }

  const handleSubmit = async () => {
    if (!validateCurrentStep()) {
      showToast("Please fill all required fields correctly before submitting.", "error")
      return
    }

    try {
      setLoading(true)
      const token = await AsyncStorage.getItem("auth")
      if (!token) {
        showToast("No auth token found", "error")
        return
      }

      const data = new FormData()

      // Append non-file data
      const nonFileData = {
        vendorName: formData.vendorName,
        serviceRoll: formData.serviceRoll,
        vendorDescription: formData.vendorDescription,
        experience: formData.experience,
        district: formData.district,
        state: formData.state,
        subDistrict: formData.subDistrict,
        address: formData.address,
        serviceCategory: formData.serviceCategory,
        accountNo: formData.accountNo,
        ifsccode: formData.ifsccode,
        adharNumber: formData.adharNumber,
        panNumber: formData.panNumber,
        detailsRead: formData.detailsRead,
      }
      data.append("formData", JSON.stringify(nonFileData))

      // Append file data
      const appendFile = (fieldName: keyof FormDataState) => {
        const fileAsset = formData[fieldName] as FileAsset | null
        if (fileAsset && fileAsset.uri) {
          let finalFileName: string | undefined
          let finalFileType: string | undefined

          // Use type guards to safely access fileName or name
          if ("fileName" in fileAsset && fileAsset.fileName) {
            finalFileName = fileAsset.fileName
          } else if ("name" in fileAsset && fileAsset.name) {
            finalFileName = fileAsset.name
          } else {
            // Fallback if neither fileName nor name is present
            finalFileName = fileAsset.uri.split("/").pop() || "file"
          }

          if (fileAsset.mimeType) {
            finalFileType = fileAsset.mimeType
          } else {
            // Generic fallback MIME type if mimeType is missing
            finalFileType = "application/octet-stream"
          }

          data.append(
            fieldName as string, // Explicitly cast fieldName to string
            {
              uri: fileAsset.uri,
              name: finalFileName,
              type: finalFileType,
            } as any, // Cast to any as RN's FormData expects a specific object structure for files
          )
        } else {
          data.append(fieldName as string, null as any) // Explicitly append null for missing files, cast fieldName to string
        }
      }

      appendFile("vendorImage")
      appendFile("adharImage")
      appendFile("panImage")
      appendFile("certificateImage")

      await axios.post(`${BASE_URL}/api/vendors`, data, {
        headers: {
          Authorization: token,
          "Content-Type": "multipart/form-data",
        },
      })

      showToast("Vendor Data Updated successfully!", "success")
      navigation.navigate("index" as never) // Navigate to home/dashboard
    } catch (err: any) {
      showToast(err.response?.data?.message || "An error occurred", "error")
    } finally {
      setLoading(false)
    }
  }

  const FileUploadArea = ({
    fieldName,
    label,
    required = true,
    fileType = "image", // 'image' or 'document'
  }: {
    fieldName: keyof FormDataState
    label: string
    required?: boolean
    fileType?: "image" | "document"
  }) => (
    <View style={styles.fileUploadContainer}>
      <Text style={styles.label}>
        {label} {required && <Text style={styles.required}>*</Text>}
      </Text>
      <TouchableOpacity
        style={[
          styles.uploadArea,
          formData[fieldName] ? styles.uploadSuccess : {},
          errors[fieldName] ? styles.uploadError : {},
        ]}
        onPress={() => handleFileChange(fieldName, fileType)}
        activeOpacity={0.7}
      >
        <View style={styles.uploadContent}>
          {formData[fieldName] ? (
            <>
              <Text style={styles.uploadIconSuccess}>✓</Text>
              <Text style={styles.uploadFilename}>
                {(() => {
                  const currentFile = formData[fieldName] as FileAsset | null
                  if (currentFile) {
                    if ("fileName" in currentFile && currentFile.fileName) {
                      return currentFile.fileName
                    } else if ("name" in currentFile && currentFile.name) {
                      return currentFile.name
                    }
                  }
                  return "File selected" // Fallback text
                })()}
              </Text>
              <Text style={styles.uploadSuccessText}>File uploaded successfully</Text>
            </>
          ) : (
            <>
              <FontAwesome5 name="folder-open" size={24} color="#666" />
              <Text style={styles.uploadText}>Click to upload {label.toLowerCase()}</Text>
              <Text style={styles.uploadSubtext}>Supports images and PDF files</Text>
            </>
          )}
        </View>
      </TouchableOpacity>
      {errors[fieldName] && <Text style={styles.errorMessage}>{errors[fieldName]}</Text>}
    </View>
  )

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <View style={styles.stepContent}>
            <View style={styles.profileSection}>
              <TouchableOpacity onPress={() => handleFileChange("vendorImage", "image")} activeOpacity={0.7}>
                <Image
                  source={{
                    uri:
                      imageSrc ||
                      (formData.vendorImage && "uri" in formData.vendorImage ? formData.vendorImage.uri : undefined) ||
                      "https://www.nuflowerfoods.com/wp-content/uploads/2024/09/person-dummy.jpg",
                  }}
                  style={styles.profileImage}
                />
                <View style={styles.profileOverlay}>
                  <FontAwesome5 name="camera" size={20} color="#fff" solid />
                </View>
              </TouchableOpacity>
              <Text style={styles.profileText}>Click to upload profile photo</Text>
              {errors.vendorImage && <Text style={styles.errorMessage}>{errors.vendorImage}</Text>}
            </View>

            <View style={styles.grid}>
              <View style={styles.field}>
                <Text style={styles.label}>
                  Full Name <Text style={styles.required}>*</Text>
                </Text>
                <TextInput
                  placeholder="Enter your full name"
                  value={formData.vendorName}
                  onChangeText={(text) => handleInputChange("vendorName", text)}
                  style={[styles.input, errors.vendorName ? styles.inputError : {}]}
                />
                {errors.vendorName && <Text style={styles.errorMessage}>{errors.vendorName}</Text>}
              </View>

              <View style={styles.field}>
                <Text style={styles.label}>
                  Service Category <Text style={styles.required}>*</Text>
                </Text>
                <View style={[styles.pickerContainer, errors.serviceCategory ? styles.inputError : {}]}>
                  <Picker
                    selectedValue={formData.serviceCategory}
                    onValueChange={(itemValue) => handleInputChange("serviceCategory", itemValue)}
                    style={styles.picker}
                  >
                    <Picker.Item label="Select a category" value="" />
                    {serviceCategories.map((category) => (
                      <Picker.Item key={category} label={category} value={category} />
                    ))}
                  </Picker>
                </View>
                {errors.serviceCategory && <Text style={styles.errorMessage}>{errors.serviceCategory}</Text>}
              </View>
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>
                Professional Role <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                placeholder="e.g., Senior Electrician, Construction Manager"
                value={formData.serviceRoll}
                onChangeText={(text) => handleInputChange("serviceRoll", text)}
                style={[styles.input, errors.serviceRoll ? styles.inputError : {}]}
              />
              {errors.serviceRoll && <Text style={styles.errorMessage}>{errors.serviceRoll}</Text>}
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>
                Professional Description <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                placeholder="Describe your expertise, specializations, and what makes you unique..."
                value={formData.vendorDescription}
                onChangeText={(text) => handleInputChange("vendorDescription", text)}
                multiline
                numberOfLines={4}
                style={[styles.textarea, errors.vendorDescription ? styles.inputError : {}]}
              />
              {errors.vendorDescription && <Text style={styles.errorMessage}>{errors.vendorDescription}</Text>}
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>
                Years of Experience <Text style={styles.required}>*</Text>
              </Text>
              <View style={styles.experienceOptions}>
                {experienceOptions.map((value) => (
                  <TouchableOpacity
                    key={value}
                    onPress={() => handleInputChange("experience", value)}
                    style={[styles.experienceBtn, formData.experience === value ? styles.experienceBtnActive : {}]}
                  >
                    <Text
                      style={[
                        styles.experienceBtnText,
                        formData.experience === value ? styles.experienceBtnTextActive : {},
                      ]}
                    >
                      {value}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              {errors.experience && <Text style={styles.errorMessage}>{errors.experience}</Text>}
            </View>
          </View>
        )

      case 2:
        return (
          <View style={styles.stepContent}>
            <View style={styles.gridThree}>
              <View style={styles.field}>
                <Text style={styles.label}>
                  State <Text style={styles.required}>*</Text>
                </Text>
                <TextInput
                  placeholder="State"
                  value={formData.state}
                  onChangeText={(text) => handleInputChange("state", text)}
                  style={[styles.input, errors.state ? styles.inputError : {}]}
                />
                {errors.state && <Text style={styles.errorMessage}>{errors.state}</Text>}
              </View>

              <View style={styles.field}>
                <Text style={styles.label}>
                  District <Text style={styles.required}>*</Text>
                </Text>
                <TextInput
                  placeholder="District"
                  value={formData.district}
                  onChangeText={(text) => handleInputChange("district", text)}
                  style={[styles.input, errors.district ? styles.inputError : {}]}
                />
                {errors.district && <Text style={styles.errorMessage}>{errors.district}</Text>}
              </View>

              <View style={styles.field}>
                <Text style={styles.label}>
                  Sub District <Text style={styles.required}>*</Text>
                </Text>
                <TextInput
                  placeholder="Sub District"
                  value={formData.subDistrict}
                  onChangeText={(text) => handleInputChange("subDistrict", text)}
                  style={[styles.input, errors.subDistrict ? styles.inputError : {}]}
                />
                {errors.subDistrict && <Text style={styles.errorMessage}>{errors.subDistrict}</Text>}
              </View>
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>
                Complete Address <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                placeholder="Enter your complete address where you provide services"
                value={formData.address}
                onChangeText={(text) => handleInputChange("address", text)}
                multiline
                numberOfLines={3}
                style={[styles.textarea, errors.address ? styles.inputError : {}]}
              />
              {errors.address && <Text style={styles.errorMessage}>{errors.address}</Text>}
            </View>
          </View>
        )

      case 3:
        return (
          <View style={styles.stepContent}>
            <View style={styles.grid}>
              <FileUploadArea fieldName="certificateImage" label="Professional Certificate" fileType="document" />
              <FileUploadArea fieldName="adharImage" label="Aadhar Card" fileType="document" />
            </View>

            <FileUploadArea fieldName="panImage" label="GST Receipt" required={false} fileType="document" />

            <View style={styles.grid}>
              <View style={styles.field}>
                <Text style={styles.label}>
                  Aadhar Card Number <Text style={styles.required}>*</Text>
                </Text>
                <TextInput
                  placeholder="Enter 12-digit Aadhar number"
                  value={formData.adharNumber}
                  onChangeText={(text) => handleInputChange("adharNumber", text)}
                  maxLength={12}
                  keyboardType="numeric"
                  style={[styles.input, errors.adharNumber ? styles.inputError : {}]}
                />
                {errors.adharNumber && <Text style={styles.errorMessage}>{errors.adharNumber}</Text>}
              </View>

              <View style={styles.field}>
                <Text style={styles.label}>GST Number (Optional)</Text>
                <TextInput
                  placeholder="Enter GST number"
                  value={formData.panNumber}
                  onChangeText={(text) => handleInputChange("panNumber", text)}
                  style={styles.input}
                />
              </View>
            </View>
          </View>
        )

      case 4:
        return (
          <View style={styles.stepContent}>
            <View style={styles.grid}>
              <View style={styles.field}>
                <Text style={styles.label}>
                  Account Number <Text style={styles.required}>*</Text>
                </Text>
                <TextInput
                  placeholder="Enter account number"
                  value={formData.accountNo}
                  onChangeText={(text) => handleInputChange("accountNo", text)}
                  keyboardType="numeric"
                  style={[styles.input, errors.accountNo ? styles.inputError : {}]}
                />
                {errors.accountNo && <Text style={styles.errorMessage}>{errors.accountNo}</Text>}
              </View>

              <View style={styles.field}>
                <Text style={styles.label}>
                  IFSC Code <Text style={styles.required}>*</Text>
                </Text>
                <TextInput
                  placeholder="Enter IFSC code"
                  value={formData.ifsccode}
                  onChangeText={(text) => handleInputChange("ifsccode", text)}
                  autoCapitalize="characters"
                  style={[styles.input, errors.ifsccode ? styles.inputError : {}]}
                />
                {errors.ifsccode && <Text style={styles.errorMessage}>{errors.ifsccode}</Text>}
              </View>
            </View>

            <View style={styles.agreementCard}>
              <TouchableOpacity
                style={styles.checkboxContainer}
                onPress={() => handleInputChange("detailsRead", !formData.detailsRead)}
                activeOpacity={0.7}
              >
                <View
                  style={[
                    styles.checkbox,
                    formData.detailsRead ? styles.checkboxChecked : {},
                    errors.detailsRead ? styles.checkboxError : {},
                  ]}
                >
                  {formData.detailsRead && <FontAwesome5 name="check" size={12} color="#fff" />}
                </View>
                <View style={styles.checkboxContent}>
                  <Text style={styles.checkboxLabel}>I confirm that all information provided is accurate</Text>
                  <Text style={styles.checkboxDescription}>
                    By checking this box, you agree to our terms and conditions and confirm that all the information
                    provided is accurate and complete.
                  </Text>
                </View>
              </TouchableOpacity>
              {errors.detailsRead && <Text style={styles.errorMessage}>{errors.detailsRead}</Text>}
            </View>
          </View>
        )

      default:
        return null
    }
  }

  const statusBarHeight = StatusBar.currentHeight || 0;

  return (
    <ScrollView style={[styles.container, { marginTop: statusBarHeight, }]} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Service Provider Registration</Text>
        <Text style={styles.subtitle}>Join our network of trusted professionals</Text>
      </View>

      <View style={styles.layout}>
        <View style={styles.sidebar}>
          <View style={styles.sidebarCard}>
            <View style={styles.sidebarHeader}>
              <Text style={styles.sidebarTitle}>Registration Progress</Text>
              <Text style={styles.sidebarDescription}>Complete all steps to register</Text>
            </View>
            <View style={styles.steps}>
              {steps.map((step) => {
                const isActive = currentStep === step.id
                const isCompleted = currentStep > step.id

                return (
                  <TouchableOpacity
                    key={step.id}
                    style={[styles.step, isActive ? styles.stepActive : {}, isCompleted ? styles.stepCompleted : {}]}
                    onPress={() => setCurrentStep(step.id)}
                    activeOpacity={0.7}
                  >
                    <View
                      style={[
                        styles.stepIcon,
                        isActive ? styles.stepIconActive : {},
                        isCompleted ? styles.stepIconCompleted : {},
                      ]}
                    >
                      {isCompleted ? (
                        <FontAwesome5 name="check" size={14} color="#fff" />
                      ) : (
                        <Text style={styles.stepIconText}>{step.id}</Text>
                      )}
                    </View>
                    <View style={styles.stepContentText}>
                      <Text style={styles.stepTitle}>{step.title}</Text>
                      <Text style={styles.stepDescription}>{step.description}</Text>
                    </View>
                  </TouchableOpacity>
                )
              })}

              <View style={styles.progressSection}>
                <View style={styles.progressHeader}>
                  <Text style={styles.progressLabel}>Step Progress</Text>
                  <Text style={styles.progressPercentage}>{calculateProgress()}%</Text>
                </View>
                <View style={styles.progressBar}>
                  <View style={[styles.progressFill, { width: `${calculateProgress()}%` }]}></View>
                </View>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.main}>
          <View style={styles.mainCard}>
            <View style={styles.mainHeader}>
              <View style={styles.mainIcon}>
                <FontAwesome5 name={steps[currentStep - 1].icon} size={24} color="#232761" solid />
              </View>
              <View style={styles.mainTitleSection}>
                <Text style={styles.mainTitle}>
                  Step {currentStep}: {steps[currentStep - 1].title}
                </Text>
                <Text style={styles.mainDescription}>{steps[currentStep - 1].description}</Text>
              </View>
            </View>
            <View style={styles.mainContent}>{renderStepContent()}</View>
          </View>

          <View style={styles.navigationButtons}>
            <TouchableOpacity
              onPress={prevStep}
              disabled={currentStep === 1}
              style={[styles.btn, styles.btnSecondary, currentStep === 1 ? styles.btnDisabled : {}]}
            >
              <FontAwesome5 name="arrow-left" size={16} color={currentStep === 1 ? "#ccc" : "#232761"} />
              <Text style={[styles.btnText, currentStep === 1 ? styles.btnTextDisabled : styles.btnTextSecondary]}>
                Previous
              </Text>
            </TouchableOpacity>

            {currentStep === steps.length ? (
              <TouchableOpacity
                onPress={handleSubmit}
                disabled={loading}
                style={[styles.btn, styles.btnPrimary, styles.btnSubmit, loading ? styles.btnDisabled : {}]}
              >
                {loading ? (
                  <>
                    <ActivityIndicator size="small" color="#fff" style={styles.spinner} />
                    <Text style={styles.btnText}>Submitting...</Text>
                  </>
                ) : (
                  <>
                    <Text style={styles.btnText}>Update Application</Text>
                    <FontAwesome5 name="check" size={16} color="#fff" style={styles.btnIconRight} />
                  </>
                )}
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={nextStep} style={[styles.btn, styles.btnPrimary]}>
                <Text style={styles.btnText}>Next</Text>
                <FontAwesome5 name="arrow-right" size={16} color="#fff" style={styles.btnIconRight} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        <View style={styles.helpSidebar}>
          <View style={styles.helpCards}>
            <View style={styles.helpCard}>
              <View style={styles.helpHeader}>
                <FontAwesome5 name="question-circle" size={24} color="#232761" solid />
                <Text style={styles.helpTitle}>Need Help?</Text>
              </View>
              <View style={styles.helpContent}>
                <Text style={styles.helpText}>Having trouble with registration? Our support team is here to help.</Text>
                <TouchableOpacity
                  onPress={() => navigation.navigate("index" as never)} // Replace with actual contact us page route
                  style={styles.helpBtn}
                >
                  <Text style={styles.helpBtnText}>Contact Support</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.helpCard}>
              <View style={styles.helpHeader}>
                <FontAwesome5 name="star" size={24} color="#232761" solid />
                <Text style={styles.helpTitle}>Why Join Us?</Text>
              </View>
              <View style={styles.helpContent}>
                <View style={styles.benefit}>
                  <FontAwesome5 name="shield-alt" size={20} color="#28a745" />
                  <View style={styles.benefitContent}>
                    <Text style={styles.benefitTitle}>Verified Platform</Text>
                    <Text style={styles.benefitDescription}>Trusted by thousands</Text>
                  </View>
                </View>
                <View style={styles.benefit}>
                  <FontAwesome5 name="trophy" size={20} color="#ffc107" />
                  <View style={styles.benefitContent}>
                    <Text style={styles.benefitTitle}>Professional Growth</Text>
                    <Text style={styles.benefitDescription}>Expand your business</Text>
                  </View>
                </View>
                <View style={styles.benefit}>
                  <FontAwesome5 name="credit-card" size={20} color="#007bff" />
                  <View style={styles.benefitContent}>
                    <Text style={styles.benefitTitle}>Secure Payments</Text>
                    <Text style={styles.benefitDescription}>Get paid on time</Text>
                  </View>
                </View>
              </View>
            </View>

            <View style={styles.helpCard}>
              <View style={styles.helpHeader}>
                <FontAwesome5 name="lightbulb" size={24} color="#232761" solid />
                <Text style={styles.helpTitle}>Registration Tips</Text>
              </View>
              <View style={styles.helpContent}>
                <View style={styles.tips}>
                  <Text style={styles.tipItem}>• Upload clear, high-quality documents</Text>
                  <Text style={styles.tipItem}>• Provide accurate contact information</Text>
                  <Text style={styles.tipItem}>• Write a detailed service description</Text>
                  <Text style={styles.tipItem}>• Double-check all entered details</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    padding: 16,
  },
  header: {
    marginBottom: 24,
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#232761",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#6c757d",
    textAlign: "center",
    marginTop: 8,
  },
  layout: {
    flexDirection: "column", // Changed to column for better mobile layout
    gap: 20,
  },
  sidebar: {
    width: "100%", // Full width on mobile
  },
  sidebarCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  sidebarHeader: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingBottom: 15,
  },
  sidebarTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#232761",
  },
  sidebarDescription: {
    fontSize: 14,
    color: "#6c757d",
    marginTop: 4,
  },
  steps: {
    gap: 12,
  },
  step: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 10,
    backgroundColor: "#f9f9f9",
    borderWidth: 1,
    borderColor: "#f9f9f9",
  },
  stepActive: {
    backgroundColor: "#e0e7ff",
    borderColor: "#232761",
    borderLeftWidth: 4,
  },
  stepCompleted: {
    backgroundColor: "#d4edda",
    borderColor: "#28a745",
    borderLeftWidth: 4,
  },
  stepIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  stepIconText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  stepIconActive: {
    backgroundColor: "#232761",
  },
  stepIconCompleted: {
    backgroundColor: "#28a745",
  },
  stepContentText: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#232761",
  },
  stepDescription: {
    fontSize: 12,
    color: "#6c757d",
    marginTop: 2,
  },
  progressSection: {
    marginTop: 20,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#555",
  },
  progressPercentage: {
    fontSize: 14,
    fontWeight: "600",
    color: "#232761",
  },
  progressBar: {
    height: 8,
    backgroundColor: "#e9ecef",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#232761",
    borderRadius: 4,
  },
  main: {
    flex: 1,
  },
  mainCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 20,
  },
  mainHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingBottom: 15,
  },
  mainIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#e0e7ff",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  mainTitleSection: {
    flex: 1,
  },
  mainTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#232761",
  },
  mainDescription: {
    fontSize: 14,
    color: "#6c757d",
    marginTop: 4,
  },
  mainContent: {
    paddingVertical: 10,
  },
  stepContent: {
    // Styles for individual step content
  },
  profileSection: {
    alignItems: "center",
    marginBottom: 24,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: "#232761",
    marginBottom: 10,
  },
  profileOverlay: {
    position: "absolute",
    bottom: 10,
    right: 10,
    backgroundColor: "rgba(0,0,0,0.6)",
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  profileText: {
    fontSize: 14,
    color: "#6c757d",
    marginTop: 5,
  },
  grid: {
    flexDirection: "column", // Stack fields vertically on small screens
    gap: 16,
    marginBottom: 16,
  },
  gridThree: {
    flexDirection: "column", // Stack fields vertically on small screens
    gap: 16,
    marginBottom: 16,
  },
  field: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#555",
    marginBottom: 8,
  },
  required: {
    color: "#dc3545",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 15,
    fontSize: 16,
    color: "#333",
    backgroundColor: "#fefefe",
  },
  inputError: {
    borderColor: "#dc3545",
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    backgroundColor: "#fefefe",
    overflow: "hidden",
  },
  picker: {
    height: 50,
    width: "100%",
    color: "#333",
  },
  textarea: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 15,
    fontSize: 16,
    color: "#333",
    backgroundColor: "#fefefe",
    textAlignVertical: "top", // For Android
    minHeight: 100, // Minimum height for textarea
  },
  experienceOptions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  experienceBtn: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#f0f0f0",
  },
  experienceBtnActive: {
    backgroundColor: "#232761",
    borderColor: "#232761",
  },
  experienceBtnText: {
    color: "#555",
    fontSize: 14,
    fontWeight: "500",
  },
  experienceBtnTextActive: {
    color: "#fff",
  },
  fileUploadContainer: {
    marginBottom: 16,
  },
  uploadArea: {
    borderWidth: 2,
    borderColor: "#ddd",
    borderStyle: "dashed",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fefefe",
  },
  uploadSuccess: {
    borderColor: "#28a745",
    backgroundColor: "#e6ffe6",
  },
  uploadError: {
    borderColor: "#dc3545",
    backgroundColor: "#fff0f0",
  },
  uploadContent: {
    alignItems: "center",
  },
  uploadIconSuccess: {
    fontSize: 30,
    color: "#28a745",
    marginBottom: 8,
  },
  uploadFilename: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    textAlign: "center",
  },
  uploadSuccessText: {
    fontSize: 12,
    color: "#28a745",
    marginTop: 4,
  },
  uploadText: {
    fontSize: 14,
    color: "#666",
    marginTop: 8,
  },
  uploadSubtext: {
    fontSize: 12,
    color: "#999",
    marginTop: 4,
  },
  errorMessage: {
    fontSize: 12,
    color: "#dc3545",
    marginTop: 5,
    marginLeft: 5,
  },
  agreementCard: {
    backgroundColor: "#f0f4ff",
    borderRadius: 12,
    padding: 15,
    borderWidth: 1,
    borderColor: "#232761",
    marginTop: 20,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#232761",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
    marginTop: 2, // Align with text
  },
  checkboxChecked: {
    backgroundColor: "#232761",
  },
  checkboxError: {
    borderColor: "#dc3545",
  },
  checkboxContent: {
    flex: 1,
  },
  checkboxLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: "#232761",
    marginBottom: 4,
  },
  checkboxDescription: {
    fontSize: 13,
    color: "#555",
  },
  navigationButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    paddingHorizontal: 10,
  },
  btn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    paddingHorizontal: 25,
    borderRadius: 12,
    minWidth: 120,
  },
  btnPrimary: {
    backgroundColor: "#232761",
  },
  btnSecondary: {
    backgroundColor: "#e9ecef",
    borderColor: "#ccc",
    borderWidth: 1,
  },
  btnSubmit: {
    backgroundColor: "#28a745",
  },
  btnDisabled: {
    opacity: 0.6,
  },
  btnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  btnTextSecondary: {
    color: "#232761",
  },
  btnTextDisabled: {
    color: "#999",
  },
  btnIconRight: {
    marginLeft: 10,
  },
  spinner: {
    marginRight: 10,
  },
  helpSidebar: {
    width: "100%", // Full width on mobile
    marginTop: 20,
  },
  helpCards: {
    gap: 20,
  },
  helpCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  helpHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingBottom: 10,
  },
  helpTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#232761",
    marginLeft: 10,
  },
  helpContent: {
    //
  },
  helpText: {
    fontSize: 14,
    color: "#555",
    marginBottom: 15,
  },
  helpBtn: {
    backgroundColor: "#007bff",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  helpBtnText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
  },
  benefit: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  benefitContent: {
    marginLeft: 10,
  },
  benefitTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#232761",
  },
  benefitDescription: {
    fontSize: 12,
    color: "#6c757d",
  },
  tips: {
    gap: 8,
  },
  tipItem: {
    fontSize: 14,
    color: "#555",
  },
})
