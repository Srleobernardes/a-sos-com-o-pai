import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SHADOWS, FONTS } from '../theme/colors';

const { width } = Dimensions.get('window');

export default function MedalhaAnimacao({ medalha, visible, onClose }) {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0.3)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    if (visible && medalha) {
      scaleAnim.setValue(0);
      opacityAnim.setValue(0);
      rotateAnim.setValue(0);
      glowAnim.setValue(0.3);
      slideAnim.setValue(30);

      Animated.sequence([
        Animated.parallel([
          Animated.spring(scaleAnim, {
            toValue: 1,
            friction: 4,
            tension: 60,
            useNativeDriver: true,
          }),
          Animated.timing(opacityAnim, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(rotateAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(slideAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.loop(
            Animated.sequence([
              Animated.timing(glowAnim, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true,
              }),
              Animated.timing(glowAnim, {
                toValue: 0.3,
                duration: 1000,
                useNativeDriver: true,
              }),
            ])
          ),
        ]),
      ]).start();
    }
  }, [visible, medalha]);

  if (!medalha) return null;

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.content}>
          {/* Glow effect */}
          <Animated.View
            style={[
              styles.glowCircle,
              {
                opacity: glowAnim,
                backgroundColor: medalha.cor + '30',
                borderColor: medalha.cor + '50',
              },
            ]}
          />

          {/* Medal icon */}
          <Animated.View
            style={[
              styles.medalCircle,
              {
                backgroundColor: medalha.corFundo,
                borderColor: medalha.cor,
                transform: [{ scale: scaleAnim }, { rotate: spin }],
                opacity: opacityAnim,
              },
            ]}
          >
            <Ionicons name={medalha.icone} size={60} color={medalha.cor} />
          </Animated.View>

          {/* Title and description */}
          <Animated.View
            style={{
              opacity: opacityAnim,
              transform: [{ translateY: slideAnim }],
              alignItems: 'center',
            }}
          >
            <Text style={styles.parabens}>Nova Conquista!</Text>
            <Text style={styles.titulo}>{medalha.titulo}</Text>
            <Text style={styles.descricao}>{medalha.descricao}</Text>

            <View style={styles.streakRow}>
              <Ionicons name="flame" size={20} color="#FF9800" />
              <Text style={styles.streakText}>
                {medalha.diasNecessarios} dias seguidos!
              </Text>
            </View>
          </Animated.View>

          {/* Close button */}
          <Animated.View style={{ opacity: opacityAnim, transform: [{ translateY: slideAnim }] }}>
            <TouchableOpacity style={[styles.button, { backgroundColor: medalha.cor }]} onPress={onClose}>
              <Ionicons name="checkmark-circle" size={22} color="#FFF" />
              <Text style={styles.buttonText}>Continuar</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    width: width * 0.85,
    backgroundColor: COLORS.surface,
    borderRadius: 28,
    padding: 32,
    alignItems: 'center',
    ...SHADOWS.large,
  },
  glowCircle: {
    position: 'absolute',
    top: 20,
    width: 180,
    height: 180,
    borderRadius: 90,
    borderWidth: 3,
  },
  medalCircle: {
    width: 130,
    height: 130,
    borderRadius: 65,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    marginBottom: 24,
    ...SHADOWS.medium,
  },
  parabens: {
    fontSize: 14,
    color: COLORS.textSecondary,
    ...FONTS.semibold,
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: 8,
  },
  titulo: {
    fontSize: 26,
    ...FONTS.extrabold,
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  descricao: {
    fontSize: 15,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 16,
  },
  streakRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFF3E0',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 24,
  },
  streakText: {
    fontSize: 15,
    ...FONTS.bold,
    color: '#FF9800',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 30,
    gap: 8,
    ...SHADOWS.small,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    ...FONTS.bold,
  },
});
