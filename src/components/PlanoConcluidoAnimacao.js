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

// Partículas que explodem do centro
const PARTICULAS = [
  { angle: 0,   color: '#D4A017', size: 10 },
  { angle: 45,  color: '#1E3A5F', size: 8  },
  { angle: 90,  color: '#D4A017', size: 12 },
  { angle: 135, color: '#4CAF50', size: 8  },
  { angle: 180, color: '#D4A017', size: 10 },
  { angle: 225, color: '#1E3A5F', size: 8  },
  { angle: 270, color: '#D4A017', size: 12 },
  { angle: 315, color: '#4CAF50', size: 8  },
];

function Particula({ angle, color, size, explodeAnim }) {
  const rad = (angle * Math.PI) / 180;
  const distancia = 80;
  return (
    <Animated.View
      style={{
        position: 'absolute',
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: color,
        opacity: explodeAnim.interpolate({ inputRange: [0, 0.4, 1], outputRange: [0, 1, 0] }),
        transform: [
          {
            translateX: explodeAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0, Math.cos(rad) * distancia],
            }),
          },
          {
            translateY: explodeAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0, Math.sin(rad) * distancia],
            }),
          },
        ],
      }}
    />
  );
}

export default function PlanoConcluidoAnimacao({ visible, onClose }) {
  const scaleAnim   = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const slideAnim   = useRef(new Animated.Value(50)).current;
  const explodeAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim  = useRef(new Animated.Value(0)).current;
  const pulseAnim   = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (visible) {
      scaleAnim.setValue(0);
      opacityAnim.setValue(0);
      slideAnim.setValue(50);
      explodeAnim.setValue(0);
      rotateAnim.setValue(0);
      pulseAnim.setValue(1);

      Animated.sequence([
        // Overlay aparece
        Animated.timing(opacityAnim, { toValue: 1, duration: 250, useNativeDriver: true }),
        // Ícone explode para dentro com escala
        Animated.parallel([
          Animated.spring(scaleAnim, { toValue: 1, friction: 3, tension: 80, useNativeDriver: true }),
          Animated.timing(rotateAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
          Animated.timing(explodeAnim, { toValue: 1, duration: 700, useNativeDriver: true }),
        ]),
        // Texto sobe
        Animated.spring(slideAnim, { toValue: 0, friction: 8, tension: 60, useNativeDriver: true }),
      ]).start(() => {
        // Pulso suave contínuo no ícone
        Animated.loop(
          Animated.sequence([
            Animated.timing(pulseAnim, { toValue: 1.08, duration: 800, useNativeDriver: true }),
            Animated.timing(pulseAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
          ])
        ).start();
      });
    }
  }, [visible]);

  const spin = rotateAnim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '20deg'] });

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      <Animated.View style={[styles.overlay, { opacity: opacityAnim }]}>
        <View style={styles.content}>

          {/* Ícone central + partículas */}
          <View style={styles.iconArea}>
            {PARTICULAS.map((p, i) => (
              <Particula key={i} {...p} explodeAnim={explodeAnim} />
            ))}
            <Animated.View
              style={[
                styles.iconCircle,
                {
                  transform: [
                    { scale: Animated.multiply(scaleAnim, pulseAnim) },
                    { rotate: spin },
                  ],
                },
              ]}
            >
              <Ionicons name="checkmark-circle" size={72} color="#4CAF50" />
            </Animated.View>
          </View>

          {/* Textos */}
          <Animated.View
            style={{
              opacity: opacityAnim,
              transform: [{ translateY: slideAnim }],
              alignItems: 'center',
            }}
          >
            <Text style={styles.label}>DIA COMPLETO</Text>
            <Text style={styles.titulo}>Plano Diário{'\n'}Concluído!</Text>
            <Text style={styles.descricao}>
              Você dedicou seu dia a Deus.{'\n'}
              Que cada passo seja abençoado.
            </Text>

            <View style={styles.badgeRow}>
              <Ionicons name="flame" size={18} color={COLORS.primary} />
              <Text style={styles.badgeText}>Sequência mantida!</Text>
            </View>
          </Animated.View>

          {/* Botão */}
          <Animated.View style={{ opacity: opacityAnim, transform: [{ translateY: slideAnim }] }}>
            <TouchableOpacity style={styles.button} onPress={onClose}>
              <Ionicons name="sunny" size={20} color="#FFF" />
              <Text style={styles.buttonText}>Que bênção!</Text>
            </TouchableOpacity>
          </Animated.View>

        </View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.72)',
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
  iconArea: {
    width: 140,
    height: 140,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  iconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#E8F5E9',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: '#4CAF50',
    ...SHADOWS.medium,
  },
  label: {
    fontSize: 12,
    color: COLORS.textSecondary,
    ...FONTS.semibold,
    letterSpacing: 3,
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  titulo: {
    fontSize: 28,
    ...FONTS.extrabold,
    color: COLORS.text,
    textAlign: 'center',
    lineHeight: 36,
    marginBottom: 12,
  },
  descricao: {
    fontSize: 15,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 23,
    marginBottom: 18,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.primaryLight + '25',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 28,
  },
  badgeText: {
    fontSize: 14,
    ...FONTS.bold,
    color: COLORS.primaryDark,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 48,
    borderRadius: 30,
    backgroundColor: COLORS.primary,
    gap: 8,
    ...SHADOWS.small,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    ...FONTS.bold,
  },
});
