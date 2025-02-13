import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import Form1 from "./postproperty/PropertyForm1";
import Form2 from "./postproperty/PropertyForm2";
import Form3 from "./postproperty/PropertyForm3";

const PostProperty = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    purpose: "",
    propertyType: "",
    specificType: "",
    contact: "",
    // Add more fields as needed for other forms
  });

  const handleNext = () => {
    setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    setCurrentStep(currentStep - 1);
  };

  const updateFormData = (data: any) => {
    setFormData({ ...formData, ...data });
  };

  return (
    <View style={styles.container}>
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
          onBack={handleBack}
        />
      )}
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
