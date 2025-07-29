"use client"

import { useEffect, useState } from "react"
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
import FontAwesome5 from "react-native-vector-icons/FontAwesome5"
import { useNavigation } from "expo-router" // Import NavigationProp
import AsyncStorage from "@react-native-async-storage/async-storage"
import axios from "axios"
import * as ImagePicker from "expo-image-picker"
import { BASE_URL } from "@env"


interface UserProfile {
  email?: string
  phone?: string
  profile?: string // Base64 string for image
  // Add other user profile fields as needed
}

interface UserServiceData {
  district?: string
  state?: string
  subDistrict?: string
  address?: string
  accountNo?: string
  ifsccode?: string
  // Add other service profile fields as needed
}

interface UserLoginSuccessResponse {
  success: boolean
  user?: {
    // Define properties of the user object if known, e.g., id: string; name: string;
    [key: string]: any // Fallback to any if structure is unknown
  }
}

interface OtpResponse {
  otp: string
}

export default function ProfilePage() {
  const navigation = useNavigation() // Use the typed navigation

  const [userProfile, setUserProfile] = useState<UserProfile>({})
  const [checkPassword, setCheckPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [user, setUser] = useState<UserLoginSuccessResponse["user"] | null>(null) // Type for logged-in user info
  const [imageSrc, setImageSrc] = useState("https://d30y9cdsu7xlg0.cloudfront.net/png/138926-200.png")
  const [phone, setPhone] = useState("")
  const [isEditingPhone, setIsEditingPhone] = useState(false)
  const [deleteEmail, setDeleteEmail] = useState("")
  const [isEditingDeleteEmail, setIsEditingDeleteEmail] = useState(false)
  const [phoneOtp, setPhoneOtp] = useState("")
  const [otp, setOtp] = useState("")
  const [deleteOtp, setDeleteOtp] = useState("")
  const [userServiceData, setUserServiceData] = useState<UserServiceData | null>(null)
  const [loading, setLoading] = useState(false)

  const showToast = (message: string, type: "success" | "error") => {
    Alert.alert(type === "success" ? "Success" : "Error", message)
  }

  const handleUpdateProfile = async () => {
    const token = await AsyncStorage.getItem("auth")
    if (!token) {
      showToast("Authentication token not found.", "error")
      return
    }
    try {
      setLoading(true)
      await axios.put<UserProfile>(`${BASE_URL}/api/userprofile`, userProfile, {
        headers: {
          Authorization: token,
        },
      })
      showToast("Profile updated successfully", "success")
    } catch (error: any) {
      showToast("Error updating profile: " + (error.response?.data?.message || error.message), "error")
    } finally {
      setLoading(false)
    }
  }

  const handleUpdatePassword = async () => {
    if (newPassword !== confirmPassword) {
      showToast("New password and confirm password do not match!", "error")
      return
    }
    setLoading(true)
    const token = await AsyncStorage.getItem("auth")
    if (!token) {
      showToast("Authentication token not found.", "error")
      setLoading(false)
      return
    }
    try {
      await axios.put(
        `${BASE_URL}/api/updatepassword`,
        { currentPassword: checkPassword, newPassword },
        {
          headers: {
            Authorization: token,
          },
        },
      )
      showToast("Password updated successfully", "success")
      setCheckPassword("")
      setNewPassword("")
      setConfirmPassword("")
    } catch (error: any) {
      showToast("Error updating password: " + (error.response?.data?.message || error.message), "error")
    } finally {
      setLoading(false)
    }
  }

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
    if (status !== "granted") {
      Alert.alert("Permission required", "Please grant media library permissions to upload a profile picture.")
      return
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
      base64: true, // Request base64 directly
    })

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const base64Image = `data:image/jpeg;base64,${result.assets[0].base64}`
      setUserProfile({ ...userProfile, profile: base64Image })
      setImageSrc(base64Image)
    }
  }

  const gcheck = async () => {
    setLoading(true)
    try {
      const token = await AsyncStorage.getItem("auth")
      if (token) {
        const response = await axios.get<UserLoginSuccessResponse>(`${BASE_URL}/auth/login/success`, {
          headers: {
            Authorization: token,
          },
        })
        if (response.data.success) {
          setUser(response.data.user)
        } else {
          setUser(null)
        }
      } else {
        setUser(null)
      }
    } catch (error: any) {
      console.error("Error checking login status:", error)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const getUserDetail = async () => {
    setLoading(true)
    const token = await AsyncStorage.getItem("auth")
    if (!token) {
      setLoading(false)
      showToast("No auth token found", "error")
      return
    }
    try {
      const response = await axios.get<UserProfile>(`${BASE_URL}/api/userdetail`, {
        headers: {
          Authorization: token,
        },
      })
      setUserProfile(response.data)
      setPhone(response.data.phone || "")
      if (response.data.profile) {
        setImageSrc(response.data.profile)
      }
    } catch (error: any) {
      console.error("Error fetching user details:", error)
      showToast("Error fetching user details: " + (error.response?.data?.message || error.message), "error")
    } finally {
      setLoading(false)
    }
  }

  const getUserServiceDetail = async () => {
    setLoading(true)
    const token = await AsyncStorage.getItem("auth")
    if (!token) {
      setLoading(false)
      showToast("No auth token found", "error")
      return
    }
    try {
      const response = await axios.get<UserServiceData>(`${BASE_URL}/api/userservicedetail`, {
        headers: {
          Authorization: token,
        },
      })
      setUserServiceData(response.data)
    } catch (error: any) {
      console.error("Error fetching user service details:", error)
      showToast("Error fetching user service details: " + (error.response?.data?.message || error.message), "error")
    } finally {
      setLoading(false)
    }
  }

  const verifyPhone = async () => {
    setLoading(true)
    try {
      const response = await axios.post<OtpResponse>(`${BASE_URL}/api/verify-phone`, {
        phone,
      })
      setPhoneOtp(response.data.otp) // In a real app, OTP would be sent to user's phone, not returned in response
      showToast("OTP sent to your phone", "success")
    } catch (error: any) {
      showToast(error.response?.data?.error || "Failed to send OTP", "error")
    } finally {
      setLoading(false)
    }
  }

  const handlePhoneChange = async () => {
    try {
      if (otp === phoneOtp) {
        setLoading(true)
        const token = await AsyncStorage.getItem("auth")
        if (!token) {
          showToast("Authentication token not found.", "error")
          setLoading(false)
          return
        }
        await axios.put(
          `${BASE_URL}/api/userprofile`,
          { phone },
          {
            headers: {
              Authorization: token,
            },
          },
        )
        showToast("Phone number updated successfully", "success")
        setIsEditingPhone(false)
        getUserDetail()
      } else {
        showToast("OTP verification failed", "error")
      }
    } catch (error: any) {
      showToast(error.response?.data?.error || "Error updating phone", "error")
    } finally {
      setLoading(false)
    }
  }

  const glogout = async () => {
    try {
      await axios.get(`${BASE_URL}/auth/logout`) // Assuming this clears server session
      await AsyncStorage.removeItem("auth")
      await AsyncStorage.removeItem("user_id")
      setUser(null)
      showToast("Logged out successfully", "success")
      navigation.navigate("index" as never) // Navigate to a login/home page
    } catch (error: any) {
      showToast("Error logging out: " + (error.response?.data?.message || error.message), "error")
    }
  }

  const verifyDeleteEmail = async () => {
    try {
      setLoading(true)
      const token = await AsyncStorage.getItem("auth")
      if (!token) {
        showToast("Authentication token not found.", "error")
        setLoading(false)
        return
      }
      const response = await axios.post<OtpResponse>(
        `${BASE_URL}/api/verify-delete-email`,
        { email: deleteEmail },
        {
          headers: {
            Authorization: token,
          },
        },
      )
      setDeleteOtp(response.data.otp) // Again, OTP would be sent to email, not returned
      showToast("OTP sent to your email", "success")
    } catch (error: any) {
      showToast("Failed to send Email OTP: " + (error.response?.data?.message || error.message), "error")
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteEmailChange = async () => {
    try {
      if (otp === deleteOtp) {
        setLoading(true)
        const token = await AsyncStorage.getItem("auth")
        if (!token) {
          showToast("Authentication token not found.", "error")
          setLoading(false)
          return
        }
        await axios.post(
          `${BASE_URL}/api/delete-account`,
          { email: deleteEmail },
          {
            headers: {
              Authorization: token,
            },
          },
        )
        showToast("Account Deleted successfully", "success")
        await AsyncStorage.removeItem("auth")
        await AsyncStorage.removeItem("user_id")
        glogout() // Perform logout after deletion
      } else {
        showToast("OTP verification failed", "error")
      }
    } catch (error: any) {
      showToast("Error verifying OTP: " + (error.response?.data?.message || error.message), "error")
    } finally {
      setLoading(false)
    }
  }

  const handleServiceUpdate = async () => {
    const token = await AsyncStorage.getItem("auth")
    if (!token) {
      showToast("Authentication token not found.", "error")
      return
    }
    if (!userServiceData) {
      showToast("No service data to update.", "error")
      return
    }
    // Destructure to exclude image fields if they are handled separately or not sent in this update
    const {
      // vendorImage, adharImage, panImage, certificateImage, // Assuming these are not part of this update
      ...nonImageData
    } = userServiceData
    try {
      setLoading(true)
      await axios.put(`${BASE_URL}/api/update-service-profile`, nonImageData, {
        headers: {
          Authorization: token,
        },
      })
      showToast("Service details updated successfully", "success")
      getUserServiceDetail()
    } catch (error: any) {
      showToast("Error updating service details: " + (error.response?.data?.message || error.message), "error")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getUserDetail()
    getUserServiceDetail()
    gcheck()
  }, [])

  const statusBarHeight = StatusBar.currentHeight || 0;

  return (
    <ScrollView style={[styles.container, { marginTop: statusBarHeight }]} showsVerticalScrollIndicator={false}>
      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#232761" />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      ) : (
        <View style={styles.content}>
          <Text style={styles.header}>User Profile</Text>

          <View style={styles.profileSection}>
            <TouchableOpacity onPress={pickImage} activeOpacity={0.7}>
              <Image source={{ uri: imageSrc }} style={styles.profileImage} />
              <View style={styles.cameraIconContainer}>
                <FontAwesome5 name="camera" size={20} color="#fff" solid />
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleUpdateProfile} style={styles.updateButton}>
              <Text style={styles.updateButtonText}>Update Profile</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.card}>
            <View style={styles.field}>
              <Text style={styles.label}>Email:</Text>
              <TextInput style={styles.input} value={userProfile.email || ""} editable={false} />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Phone:</Text>
              {isEditingPhone ? (
                <>
                  <TextInput
                    style={styles.input}
                    value={phone}
                    onChangeText={setPhone}
                    keyboardType="phone-pad"
                    placeholder="Enter new phone number"
                  />
                  <TouchableOpacity onPress={verifyPhone} style={styles.sendOtpButton}>
                    <Text style={styles.sendOtpButtonText}>Send OTP</Text>
                  </TouchableOpacity>
                  <View style={styles.otpContainer}>
                    <Text style={styles.label}>OTP:</Text>
                    <TextInput
                      style={styles.input}
                      value={otp}
                      onChangeText={setOtp}
                      keyboardType="numeric"
                      placeholder="Enter OTP"
                    />
                    <TouchableOpacity onPress={handlePhoneChange} style={styles.verifyButton}>
                      <Text style={styles.verifyButtonText}>Verify</Text>
                    </TouchableOpacity>
                  </View>
                </>
              ) : (
                <View style={styles.phoneDisplayContainer}>
                  <TextInput style={styles.input} value={phone} editable={false} />
                  <TouchableOpacity onPress={() => setIsEditingPhone(true)} style={styles.changeNumberButton}>
                    <Text style={styles.changeNumberButtonText}>Change Number</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>

          {!user && ( // Only show password fields if not logged in via Google (assuming 'user' means Google user)
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Change Password</Text>
              <View style={styles.field}>
                <Text style={styles.label}>Current Password:</Text>
                <TextInput
                  style={styles.input}
                  secureTextEntry
                  value={checkPassword}
                  onChangeText={setCheckPassword}
                  placeholder="Enter current password"
                />
              </View>
              <View style={styles.field}>
                <Text style={styles.label}>New Password:</Text>
                <TextInput
                  style={styles.input}
                  secureTextEntry
                  value={newPassword}
                  onChangeText={setNewPassword}
                  placeholder="Enter new password"
                />
              </View>
              <View style={styles.field}>
                <Text style={styles.label}>Confirm Password:</Text>
                <TextInput
                  style={styles.input}
                  secureTextEntry
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  placeholder="Confirm new password"
                />
              </View>
              <TouchableOpacity onPress={handleUpdatePassword} style={styles.updateButton}>
                <Text style={styles.updateButtonText}>Update Password</Text>
              </TouchableOpacity>
            </View>
          )}

          {userServiceData ? (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>User Service Profile</Text>
              <View style={styles.fieldRow}>
                <View style={styles.fieldHalf}>
                  <Text style={styles.label}>District:</Text>
                  <TextInput
                    style={styles.input}
                    value={userServiceData.district || ""}
                    onChangeText={(text) => setUserServiceData({ ...userServiceData, district: text })}
                  />
                </View>
                <View style={styles.fieldHalf}>
                  <Text style={styles.label}>State:</Text>
                  <TextInput
                    style={styles.input}
                    value={userServiceData.state || ""}
                    onChangeText={(text) => setUserServiceData({ ...userServiceData, state: text })}
                  />
                </View>
              </View>
              <View style={styles.field}>
                <Text style={styles.label}>Sub-District:</Text>
                <TextInput
                  style={styles.input}
                  value={userServiceData.subDistrict || ""}
                  onChangeText={(text) => setUserServiceData({ ...userServiceData, subDistrict: text })}
                />
              </View>
              <View style={styles.field}>
                <Text style={styles.label}>Address:</Text>
                <TextInput
                  style={styles.input}
                  value={userServiceData.address || ""}
                  onChangeText={(text) => setUserServiceData({ ...userServiceData, address: text })}
                />
              </View>
              <View style={styles.fieldRow}>
                <View style={styles.fieldHalf}>
                  <Text style={styles.label}>Account No:</Text>
                  <TextInput
                    style={styles.input}
                    value={userServiceData.accountNo || ""}
                    onChangeText={(text) => setUserServiceData({ ...userServiceData, accountNo: text })}
                    keyboardType="numeric"
                  />
                </View>
                <View style={styles.fieldHalf}>
                  <Text style={styles.label}>IFSC Code:</Text>
                  <TextInput
                    style={styles.input}
                    value={userServiceData.ifsccode || ""}
                    onChangeText={(text) => setUserServiceData({ ...userServiceData, ifsccode: text })}
                  />
                </View>
              </View>
              <TouchableOpacity onPress={handleServiceUpdate} style={styles.updateButton}>
                <Text style={styles.updateButtonText}>Update Service Details</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.card}>
              <Text style={styles.noServiceProfileText}>
                You don&apos;t have a Service Profile{" "}
                <Text style={styles.linkText} onPress={() => navigation.navigate("ServiceFormPage" as never)}>
                  Click Here
                </Text>{" "}
                to activate.
              </Text>
            </View>
          )}

          <View style={[styles.card, styles.deleteAccountCard]}>
            {isEditingDeleteEmail ? (
              <>
                <Text style={styles.label}>Verify Email to Delete Account</Text>
                <TextInput
                  style={styles.input}
                  value={deleteEmail}
                  onChangeText={setDeleteEmail}
                  placeholder="Enter Account Email"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
                <TouchableOpacity onPress={verifyDeleteEmail} style={styles.sendOtpButton}>
                  <Text style={styles.sendOtpButtonText}>Send OTP</Text>
                </TouchableOpacity>
                <View style={styles.otpContainer}>
                  <Text style={styles.label}>OTP:</Text>
                  <TextInput
                    style={styles.input}
                    value={otp}
                    onChangeText={setOtp}
                    keyboardType="numeric"
                    placeholder="Confirm OTP"
                  />
                  <TouchableOpacity onPress={handleDeleteEmailChange} style={styles.confirmDeleteButton}>
                    <Text style={styles.confirmDeleteButtonText}>Confirm to Delete</Text>
                  </TouchableOpacity>
                </View>
              </>
            ) : (
              <TouchableOpacity onPress={() => setIsEditingDeleteEmail(true)} style={styles.deleteAccountButton}>
                <Text style={styles.deleteAccountButtonText}>Delete Account</Text>
              </TouchableOpacity>
            )}
          </View>

          <TouchableOpacity onPress={glogout} style={styles.logoutButton}>
            <FontAwesome5 name="sign-out-alt" size={18} color="#fff" solid />
            <Text style={styles.logoutButtonText}>Log Out</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    padding: 16,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    minHeight: 300, // Ensure it takes up some space
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#232761",
  },
  content: {
    paddingBottom: 20,
  },
  header: {
    fontSize: 28,
    fontWeight: "700",
    color: "#232761",
    marginBottom: 24,
    textAlign: "center",
  },
  profileSection: {
    alignItems: "center",
    marginBottom: 24,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: "#232761",
    marginBottom: 16,
  },
  cameraIconContainer: {
    position: "absolute",
    bottom: 10,
    right: 10,
    backgroundColor: "#232761",
    borderRadius: 20,
    padding: 8,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#232761",
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingBottom: 10,
  },
  field: {
    marginBottom: 16,
  },
  fieldRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  fieldHalf: {
    width: "48%",
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#555",
    marginBottom: 8,
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
  phoneDisplayContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  otpContainer: {
    marginTop: 10,
  },
  updateButton: {
    backgroundColor: "#232761",
    paddingVertical: 14,
    paddingHorizontal: 25,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },
  updateButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  sendOtpButton: {
    backgroundColor: "#007bff",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    alignSelf: "flex-end",
    marginTop: 10,
  },
  sendOtpButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
  },
  verifyButton: {
    backgroundColor: "#28a745",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    alignSelf: "flex-end",
    marginTop: 10,
  },
  verifyButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
  },
  changeNumberButton: {
    backgroundColor: "#6c757d",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginLeft: 10,
  },
  changeNumberButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
  },
  noServiceProfileText: {
    fontSize: 16,
    color: "#555",
    textAlign: "center",
    paddingVertical: 10,
  },
  linkText: {
    color: "#232761",
    fontWeight: "600",
    textDecorationLine: "underline",
  },
  deleteAccountCard: {
    borderColor: "#dc3545",
    borderWidth: 1,
    backgroundColor: "#fff0f0",
  },
  deleteAccountButton: {
    backgroundColor: "#dc3545",
    paddingVertical: 14,
    paddingHorizontal: 25,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },
  deleteAccountButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  confirmDeleteButton: {
    backgroundColor: "#dc3545",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    alignSelf: "flex-end",
    marginTop: 10,
  },
  confirmDeleteButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#6c757d",
    paddingVertical: 14,
    paddingHorizontal: 25,
    borderRadius: 12,
    marginTop: 20,
  },
  logoutButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 10,
  },
})
