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

export default function JejumConcluidoAnimacao({ visible, onClose }) {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;
  const bounceAnim = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0.2)).current;
  const starsAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      scaleAnim.setValue(0);
      opacityAnim.setValue(0);
      slideAnim.setValue(40);
      bounceAnim.setValue(0);
      glowAnim.setValue(0.2);
      starsAnim.setValue(0);

      Animated.sequence([
        // Fundo aparece
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        // Troféu entra com spring
        Animated.parallel([
          Animated.spring(scaleAnim, {
            toValue: 1,
            friction: 4,
            tension: 50,
            useNativeDriver: true,
          }),
          Animated.timing(starsAnim, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
        ]),
        // Texto sobe
        Animated.parallel([
          Animated.spring(slideAnim, {
            toValue: 0,
            friction: 7,
            tension: 50,
            useNativeDriver: true,
          }),
          // Glow pulsa
          Animated.loop(
            Animated.sequence([
              Animated.timing(glowAnim, { toValue: 1, duration: 900, useNativeDriver: true }),
              Animated.timing(glowAnim, { toValue: 0.2, duration: 900, useNativeDriver: true }),
            ])
          ),
        ]),
      ]).start();

      // Bounce suave do troféu após entrada
      setTimeout(() => {
        Animated.loop(
          Animated.sequence([
            Animated.timing(bounceAnim, { toValue: -10, duration: 700, useNativeDriver: true }),
            Animated.timing(bounceAnim, { toValue: 0, duration: 700, useNativeDriver: true }),
          ])
        ).start();
      }, 800);
    }
  }, [visible]);

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      <Animated.View style={[styles.overlay, { opacity: opacityAnim }]}>
        <View style={styles.content}>

          {/* Estrelas decorativas */}
          <Animated.View style={[styles.starsContainer, { opacity: starsAnim }]}>
            {[
              { top: 10, left: 20, size: 18, color: '#FFD700' },
              { top: 0, right: 30, size: 14, color: '#FFA500' },
              { top: 30, right: 10, size: 10, color: '#FFD700' },
              { top: 20, left: 50, size: 10, color: '#FFA500' },
            ].map((s, i) => (
              <Ionicons
                key={i}
                name="star"
                size={s.size}
                color={s.color}
                style={{ position: 'absolute', top: s.top, left: s.left, right: s.right }}
              />
            ))}
          </Animated.View>

          {/* Glow */}
          <Animated.View style={[styles.glowCircle, { opacity: glowAnim }]} />

          {/* Troféu */}
          <Animated.View
            style={[
              styles.trofeuCircle,
              {
                transform: [
                  { scale: scaleAnim },
                  { translateY: bounceAnim },
                ],
              },
            ]}
          >
            <Ionicons name="trophy" size={72} color="#FFD700" />
          </Animated.View>

          {/* Textos */}
          <Animated.View
            style={{
              opacity: opacityAnim,
              transform: [{ translateY: slideAnim }],
              alignItems: 'center',
            }}
          >
            <Text style={styles.label}>PARABÉNS!</Text>
            <Text style={styles.titulo}>Jejum Finalizado</Text>
            <Text style={styles.descricao}>
              Você completou seu jejum com fidelidade.{'\n'}
              Que Deus honre cada momento de consagração.
            </Text>

            <View style={styles.badgeRow}>
              <Ionicons name="moon" size={18} color="#FF9800" />
              <Text style={styles.badgeText}>+1 Jejum concluído</Text>
            </View>
          </Animated.View>

          {/* Botão */}
          <Animated.View style={{ opacity: opacityAnim, transform: [{ translateY: slideAnim }] }}>
            <TouchableOpacity style={styles.button} onPress={onClose}>
              <Ionicons name="checkmark-circle" size={22} color="#FFF" />
              <Text style={styles.buttonText}>Continuar</Text>
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
    backgroundColor: 'rgba(0,0,0,0.75)',
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
    overflow: 'visible',
  },
  starsContainer: {
    position: 'absolute',
    top: -10,
    left: 0,
    right: 0,
    height: 60,
  },
  glowCircle: {
    position: 'absolute',
    top: 16,
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: '#FFD70030',
    borderWidth: 3,
    borderColor: '#FFD70050',
  },
  trofeuCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#FFF8E1',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: '#FFD700',
    marginBottom: 24,
    ...SHADOWS.medium,
  },
  label: {
    fontSize: 13,
    color: COLORS.textSecondary,
    ...FONTS.semibold,
    letterSpacing: 2.5,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  titulo: {
    fontSize: 28,
    ...FONTS.extrabold,
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 10,
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
    backgroundColor: '#FFF3E0',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 28,
  },
  badgeText: {
    fontSize: 14,
    ...FONTS.bold,
    color: '#FF9800',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 48,
    borderRadius: 30,
    backgroundColor: '#FFD700',
    gap: 8,
    ...SHADOWS.small,
  },
  buttonText: {
    color: '#0D1B3E',
    fontSize: 16,
    ...FONTS.bold,
  },
});
