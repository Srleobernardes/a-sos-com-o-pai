import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Animated,
  Linking,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SHADOWS } from '../theme/colors';
import { gerarCodigoRef } from '../lib/referral';

const { width } = Dimensions.get('window');
const APP_URL = 'https://appasoscomopai.com.br';

export default function CompartilharModal({ visible, totalDevocionais, email, onClose }) {
  const scaleAnim   = useRef(new Animated.Value(0.88)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      scaleAnim.setValue(0.88);
      opacityAnim.setValue(0);
      Animated.parallel([
        Animated.timing(opacityAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
        Animated.spring(scaleAnim, { toValue: 1, friction: 7, tension: 70, useNativeDriver: true }),
      ]).start();
    }
  }, [visible]);

  const handleCompartilhar = () => {
    const codigo = gerarCodigoRef(email);
    const link = `${APP_URL}?ref=${codigo}`;
    const msg =
      `Oi! 🙏 Uso o *A Sós com o Pai* há ${totalDevocionais} devocionais e ` +
      `tem transformado minha vida de oração.\n\n` +
      `Quero te dar 7 dias grátis para você experimentar também:\n${link}`;
    Linking.openURL(`https://wa.me/?text=${encodeURIComponent(msg)}`);
    onClose();
  };

  return (
    <Modal transparent visible={visible} animationType="none" statusBarTranslucent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <Animated.View style={[styles.card, { opacity: opacityAnim, transform: [{ scale: scaleAnim }] }]}>

          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Ionicons name="close" size={20} color={COLORS.textLight} />
          </TouchableOpacity>

          {/* Ícone */}
          <View style={styles.iconCircle}>
            <Text style={styles.iconEmoji}>🌟</Text>
          </View>

          {/* Título */}
          <Text style={styles.titulo}>Compartilhe esta bênção!</Text>
          <Text style={styles.subtitulo}>
            Você já completou{' '}
            <Text style={styles.destaque}>{totalDevocionais} devocionais</Text>.{'\n'}
            Que tal presentear quem você ama?
          </Text>

          {/* 4 corações */}
          <View style={styles.coracoesRow}>
            {['❤️', '❤️', '❤️', '❤️'].map((e, i) => (
              <View key={i} style={styles.coracaoCircle}>
                <Text style={styles.coracaoEmoji}>{e}</Text>
              </View>
            ))}
          </View>

          {/* Info */}
          <View style={styles.infoBadge}>
            <Ionicons name="gift-outline" size={15} color={COLORS.primary} />
            <Text style={styles.infoText}>Cada pessoa recebe 7 dias grátis</Text>
          </View>

          {/* Botão WhatsApp */}
          <TouchableOpacity style={styles.btnZap} onPress={handleCompartilhar} activeOpacity={0.85}>
            <Ionicons name="logo-whatsapp" size={20} color="#FFF" />
            <Text style={styles.btnZapText}>Compartilhar no WhatsApp</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={onClose} style={styles.depoisBtn}>
            <Text style={styles.depoisText}>Lembrar daqui 10 dias</Text>
          </TouchableOpacity>

        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  card: {
    width: Math.min(width - 48, 380),
    backgroundColor: COLORS.surface,
    borderRadius: 28,
    padding: 28,
    alignItems: 'center',
    ...SHADOWS.large,
  },
  closeBtn: {
    position: 'absolute',
    top: 14,
    right: 16,
    padding: 6,
  },

  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: COLORS.primaryLight + '25',
    borderWidth: 1.5,
    borderColor: COLORS.primaryLight + '60',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
    marginTop: 8,
  },
  iconEmoji: {
    fontSize: 36,
  },

  titulo: {
    fontSize: 22,
    ...FONTS.extrabold,
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitulo: {
    fontSize: 15,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 22,
  },
  destaque: {
    color: COLORS.primary,
    ...FONTS.bold,
  },

  coracoesRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 18,
  },
  coracaoCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#FFF0F0',
    borderWidth: 1.5,
    borderColor: '#FFCCCC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  coracaoEmoji: {
    fontSize: 22,
  },

  infoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: COLORS.primaryLight + '18',
    borderWidth: 1,
    borderColor: COLORS.primaryLight + '40',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginBottom: 22,
  },
  infoText: {
    fontSize: 13,
    color: COLORS.primaryDark,
    ...FONTS.medium,
  },

  btnZap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: '#25D366',
    borderRadius: 16,
    height: 54,
    width: '100%',
    marginBottom: 12,
    shadowColor: '#25D366',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  btnZapText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFF',
  },

  depoisBtn: {
    paddingVertical: 8,
  },
  depoisText: {
    fontSize: 13,
    color: COLORS.textLight,
    ...FONTS.medium,
  },
});
