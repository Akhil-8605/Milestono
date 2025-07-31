import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

type Props = {
  onFinish: () => void;
};

export default function SplashScreen1({ onFinish }: Props) {
  useEffect(() => {
    const timer = setTimeout(onFinish, 2000); // 2 seconds
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/images/favicon.png')}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.title}>Welcome!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    color: '#333333',
  },
});
