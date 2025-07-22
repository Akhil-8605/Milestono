import React, { useState, useEffect } from "react";
import { View, StyleSheet, StatusBar, Alert, ScrollView } from "react-native";
import Form1 from "./postproperty/PropertyForm1";
import Form2 from "./postproperty/PropertyForm2";
import Form3 from "./postproperty/PropertyForm3";
import Header from "./components/Header";
import axios from "axios";
import { BASE_URL } from "@env";
import AsyncStorage from "@react-native-async-storage/async-storage";

const PostProperty = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [disabled, setDisabled] = useState(true);
  const [uploadedPhotos, setUploadedPhotos] = useState<File[]>([]);

  const [formData, setFormData] = useState({
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
  });

  const updateFormData = (data: any) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const handleNext = () => setCurrentStep((prev) => prev + 1);
  const handleBack = () => setCurrentStep((prev) => prev - 1);

  const checkEligibility = async () => {
    const token = await AsyncStorage.getItem("auth");
    try {
      const res = await axios.get(`${BASE_URL}/api/check-num-of-properties`, {
        headers: { Authorization: token },
      });
      setDisabled(!res.data.canPost);
    } catch (err) {
      console.error("Eligibility check failed", err);
    }
  };

const handleSubmit = async () => {
  if (disabled) { return Alert.alert("Exceed Post Limit. Purchase Premium Account");}
  const token = await AsyncStorage.getItem("auth");
  const formDataObj = new FormData();

  formDataObj.append("formData", JSON.stringify(formData));

  for (let i = 0; i < uploadedPhotos.length; i++) {
    const photoUri = uploadedPhotos[i].uri;

    const fileName = photoUri.split('/').pop();
    const fileType = fileName.split('.').pop();
    console.log(fileName,fileType)
    formDataObj.append("images", {
      uri: photoUri,
      name: fileName,
      type: `image/${fileType}`,
    });
  }

  try {
    const res = await axios.post(`${BASE_URL}/api/property_details`, formDataObj, {
      headers: {
        Authorization: token,
        'Content-Type': 'multipart/form-data',
      },
    });

    Alert.alert("Success", res.data.message);
  } catch (err) {
    console.error("Upload Error:", err?.response?.data || err.message);
    Alert.alert("Error", "Failed to submit property.");
  }
};

  useEffect(() => {
    checkEligibility();
  }, []);

  const statusBarHeight = StatusBar.currentHeight || 0;

  return (
    <View style={[styles.container, { marginTop: statusBarHeight }]}>
      <Header />
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        {currentStep === 1 && (
          <Form1
            formData={formData}
            updateFormData={updateFormData}
            onNext={handleNext}
          />
        )}
        {currentStep === 2 && (
          <Form2
            formData={formData}
            updateFormData={updateFormData}
            onNext={handleNext}
            onBack={handleBack}
          />
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
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});

export default PostProperty;
