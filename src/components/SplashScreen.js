import React, { useEffect, useRef } from 'react';
import { View, Image, Animated, StyleSheet, Text } from 'react-native';

const logo = require('../../assets/icons/logo.png');

export default function SplashScreen() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.92)).current;
  const textFade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Logo entra com fade + leve escala
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 900,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 6,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Texto aparece depois da logo
      Animated.timing(textFade, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }).start();

      // Pulso suave e contínuo
      Animated.loop(
        Animated.sequence([
          Animated.timing(scaleAnim, {
            toValue: 1.04,
            duration: 1800,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 1800,
            useNativeDriver: true,
          }),
        ])
      ).start();
    });
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.logoWrapper,
          { opacity: fadeAnim, transform: [{ scale: scaleAnim }] },
        ]}
      >
        <Image source={logo} style={styles.logo} resizeMode="contain" />
      </Animated.View>

      <Animated.View style={[styles.textWrapper, { opacity: textFade }]}>
        <Text style={styles.titulo}>A Sós com o Pai</Text>
        <Text style={styles.subtitulo}>Sua jornada espiritual diária</Text>
      </Animated.View>

      <Animated.View style={[styles.dotsWrapper, { opacity: textFade }]}>
        <View style={styles.dot} />
        <View style={[styles.dot, styles.dotMid]} />
        <View style={styles.dot} />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D1B3E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },
  logo: {
    width: 120,
    height: 120,
  },
  textWrapper: {
    alignItems: 'center',
    gap: 6,
  },
  titulo: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  subtitulo: {
    color: 'rgba(255,255,255,0.45)',
    fontSize: 13,
    fontWeight: '400',
    letterSpacing: 0.3,
  },
  dotsWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 48,
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: 'rgba(212,160,23,0.4)',
  },
  dotMid: {
    backgroundColor: '#D4A017',
    width: 6,
    height: 6,
  },
});
