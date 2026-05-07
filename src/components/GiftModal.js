import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Animated,
  Dimensions,
  Linking,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { gerarCodigoRef } from '../lib/referral';

const { width } = Dimensions.get('window');
const CARD_W = Math.min(width - 40, 400);
const APP_URL = 'https://appasoscomopai.com.br';

const PARTICULAS_CONFIG = [
  { angle: 0,                   cor: '#FFD54F', dist: 100 },
  { angle: Math.PI * 0.25,      cor: '#FFFFFF', dist: 85  },
  { angle: Math.PI * 0.5,       cor: '#D4A017', dist: 115 },
  { angle: Math.PI * 0.75,      cor: '#FFE082', dist: 90  },
  { angle: Math.PI,             cor: '#F9A825', dist: 100 },
  { angle: Math.PI * 1.25,      cor: '#FFFFFF', dist: 80  },
  { angle: Math.PI * 1.5,       cor: '#D4A017', dist: 110 },
  { angle: Math.PI * 1.75,      cor: '#FFD54F', dist: 88  },
  { angle: Math.PI * 0.375,     cor: '#FFE082', dist: 95  },
  { angle: Math.PI * 1.125,     cor: '#F9A825', dist: 92  },
];

function Particula({ angle, cor, dist, ativa }) {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (ativa) {
      anim.setValue(0);
      Animated.timing(anim, { toValue: 1, duration: 900, useNativeDriver: true }).start();
    }
  }, [ativa]);

  return (
    <Animated.View
      style={[
        styles.particula,
        { backgroundColor: cor },
        {
          opacity: anim.interpolate({ inputRange: [0, 0.35, 1], outputRange: [0, 1, 0] }),
          transform: [
            { translateX: anim.interpolate({ inputRange: [0, 1], outputRange: [0, Math.cos(angle) * dist] }) },
            { translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [0, Math.sin(angle) * dist] }) },
            { scale: anim.interpolate({ inputRange: [0, 0.3, 1], outputRange: [0, 2.2, 0.6] }) },
          ],
        },
      ]}
    />
  );
}

export default function GiftModal({ visible, email, onClose }) {
  const [fase, setFase] = useState('presente');
  const [particulasAtivas, setParticulasAtivas] = useState(false);

  const backdropAnim  = useRef(new Animated.Value(0)).current;
  const cardScale     = useRef(new Animated.Value(0.82)).current;
  const cardOpacity   = useRef(new Animated.Value(0)).current;
  const floatAnim     = useRef(new Animated.Value(0)).current;
  const wiggleAnim    = useRef(new Animated.Value(0)).current;
  const giftScale     = useRef(new Animated.Value(1)).current;
  const giftOpacity   = useRef(new Animated.Value(1)).current;
  const lidAnim       = useRef(new Animated.Value(0)).current;
  const shareOpacity  = useRef(new Animated.Value(0)).current;
  const shareY        = useRef(new Animated.Value(28)).current;

  const floatLoopRef  = useRef(null);
  const wiggleTimer   = useRef(null);
  const entryTimer    = useRef(null);

  const startGiftAnims = useCallback(() => {
    floatLoopRef.current = Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, { toValue: -13, duration: 1700, useNativeDriver: true }),
        Animated.timing(floatAnim, { toValue: 0,   duration: 1700, useNativeDriver: true }),
      ])
    );
    floatLoopRef.current.start();

    const doWiggle = () => {
      Animated.sequence([
        Animated.timing(wiggleAnim, { toValue: 1,  duration: 85, useNativeDriver: true }),
        Animated.timing(wiggleAnim, { toValue: -1, duration: 85, useNativeDriver: true }),
        Animated.timing(wiggleAnim, { toValue: 0.5, duration: 85, useNativeDriver: true }),
        Animated.timing(wiggleAnim, { toValue: 0,  duration: 85, useNativeDriver: true }),
      ]).start(() => {
        wiggleTimer.current = setTimeout(doWiggle, 2800);
      });
    };
    wiggleTimer.current = setTimeout(doWiggle, 1000);
  }, [floatAnim, wiggleAnim]);

  const stopGiftAnims = useCallback(() => {
    floatLoopRef.current?.stop();
    if (wiggleTimer.current) clearTimeout(wiggleTimer.current);
  }, []);

  useEffect(() => {
    if (visible) {
      setFase('presente');
      setParticulasAtivas(false);
      giftScale.setValue(1);
      giftOpacity.setValue(1);
      lidAnim.setValue(0);
      shareOpacity.setValue(0);
      shareY.setValue(28);
      backdropAnim.setValue(0);
      cardScale.setValue(0.82);
      cardOpacity.setValue(0);

      entryTimer.current = setTimeout(() => {
        Animated.parallel([
          Animated.timing(backdropAnim, { toValue: 1, duration: 350, useNativeDriver: true }),
          Animated.spring(cardScale, { toValue: 1, friction: 7, tension: 65, useNativeDriver: true }),
          Animated.timing(cardOpacity, { toValue: 1, duration: 350, useNativeDriver: true }),
        ]).start(() => startGiftAnims());
      }, 1500);
    } else {
      clearTimeout(entryTimer.current);
      stopGiftAnims();
    }
    return () => {
      clearTimeout(entryTimer.current);
      stopGiftAnims();
    };
  }, [visible]);

  const handleAbrirPresente = () => {
    stopGiftAnims();
    Animated.timing(lidAnim, { toValue: 1, duration: 220, useNativeDriver: true }).start();
    setTimeout(() => {
      setParticulasAtivas(true);
      Animated.parallel([
        Animated.timing(giftScale,   { toValue: 1.3, duration: 220, useNativeDriver: true }),
        Animated.timing(giftOpacity, { toValue: 0,   duration: 380, useNativeDriver: true }),
      ]).start(() => {
        setFase('compartilhar');
        Animated.parallel([
          Animated.timing(shareOpacity, { toValue: 1, duration: 450, useNativeDriver: true }),
          Animated.spring(shareY,       { toValue: 0, friction: 8, tension: 60, useNativeDriver: true }),
        ]).start();
      });
    }, 160);
  };

  const handleCompartilhar = useCallback(() => {
    const codigo = gerarCodigoRef(email);
    const link = `${APP_URL}?ref=${codigo}`;
    const msg =
      `Oi! 🙏 Quero te dar um presente especial: 7 dias GRÁTIS no *A Sós com o Pai*, ` +
      `um app que tem transformado minha vida de oração.\n\n` +
      `Clica aqui para resgatar o seu presente:\n${link}`;
    Linking.openURL(`https://wa.me/?text=${encodeURIComponent(msg)}`);
  }, [email]);

  const handleFechar = useCallback(() => {
    stopGiftAnims();
    Animated.parallel([
      Animated.timing(backdropAnim, { toValue: 0, duration: 220, useNativeDriver: true }),
      Animated.timing(cardOpacity,  { toValue: 0, duration: 220, useNativeDriver: true }),
      Animated.timing(cardScale,    { toValue: 0.9, duration: 220, useNativeDriver: true }),
    ]).start(() => onClose());
  }, [onClose]);

  const giftRotate = wiggleAnim.interpolate({ inputRange: [-1, 1], outputRange: ['-6deg', '6deg'] });
  const lidY       = lidAnim.interpolate({ inputRange: [0, 1], outputRange: [0, -30] });

  if (!visible) return null;

  return (
    <Modal transparent visible animationType="none" statusBarTranslucent>
      <Animated.View style={[styles.backdrop, { opacity: backdropAnim }]}>
        <Animated.View style={[styles.card, { transform: [{ scale: cardScale }], opacity: cardOpacity }]}>

          <TouchableOpacity style={styles.closeBtn} onPress={handleFechar}>
            <Ionicons name="close" size={22} color="#8899AA" />
          </TouchableOpacity>

          {/* ── Fase 1: Presente ───────────────────────────────── */}
          {fase === 'presente' && (
            <>
              <Text style={styles.presLabel}>Você recebeu</Text>
              <Text style={styles.presTitulo}>um presente</Text>
              <Text style={styles.presSubtitulo}>do A Sós com o Pai ✨</Text>

              {/* Área da caixa + partículas */}
              <View style={styles.giftArea}>
                {PARTICULAS_CONFIG.map((p, i) => (
                  <Particula key={i} {...p} ativa={particulasAtivas} />
                ))}

                <TouchableOpacity onPress={handleAbrirPresente} activeOpacity={0.92}>
                  <Animated.View style={{
                    transform: [{ translateY: floatAnim }, { rotate: giftRotate }, { scale: giftScale }],
                    opacity: giftOpacity,
                    alignItems: 'center',
                  }}>
                    {/* Brilho atrás */}
                    <View style={styles.giftGlow} />

                    {/* Laço */}
                    <View style={styles.bowRow}>
                      <View style={[styles.bowOval, { transform: [{ rotate: '-22deg' }], marginRight: -9 }]} />
                      <View style={[styles.bowOval, { transform: [{ rotate: '22deg' }],  marginLeft: -9 }]} />
                      <View style={styles.bowKnot} />
                    </View>

                    {/* Tampa */}
                    <Animated.View style={{ transform: [{ translateY: lidY }], alignItems: 'center', zIndex: 2 }}>
                      <LinearGradient colors={['#FFE082', '#D4A017']} style={styles.giftLid}>
                        <View style={styles.faixa} />
                      </LinearGradient>
                    </Animated.View>

                    {/* Corpo */}
                    <LinearGradient colors={['#F0B429', '#B07A00']} style={styles.giftBody}>
                      <View style={styles.faixa} />
                    </LinearGradient>
                  </Animated.View>
                </TouchableOpacity>
              </View>

              <View style={styles.tapHint}>
                <Ionicons name="hand-left-outline" size={15} color="#D4A017" />
                <Text style={styles.tapText}>Toque na caixa para abrir</Text>
              </View>
            </>
          )}

          {/* ── Fase 2: Compartilhar ────────────────────────────── */}
          {fase === 'compartilhar' && (
            <Animated.View style={[styles.shareWrap, { opacity: shareOpacity, transform: [{ translateY: shareY }] }]}>
              <Text style={styles.celebEmoji}>🎉</Text>
              <Text style={styles.shareTitulo}>Espalhe o bem!</Text>
              <Text style={styles.shareDescr}>
                Dê{' '}
                <Text style={styles.hl}>7 dias grátis</Text>
                {' '}para{' '}
                <Text style={styles.hl}>3 pessoas</Text>
                {' '}que você mais ama
              </Text>

              <View style={styles.amigoRow}>
                {['❤️', '🙏', '✨'].map((emoji, i) => (
                  <View key={i} style={styles.amigoCircle}>
                    <Text style={styles.amigoEmoji}>{emoji}</Text>
                  </View>
                ))}
              </View>

              <View style={styles.recompensaBadge}>
                <Ionicons name="gift-outline" size={15} color="#D4A017" />
                <Text style={styles.recompensaText}>
                  e ganhe <Text style={styles.hl}>1 mês grátis</Text> para você
                </Text>
              </View>

              <TouchableOpacity style={styles.btnZap} onPress={handleCompartilhar} activeOpacity={0.85}>
                <Ionicons name="logo-whatsapp" size={22} color="#FFFFFF" />
                <Text style={styles.btnZapText}>Compartilhar no WhatsApp</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={handleFechar} style={styles.depoisBtn}>
                <Text style={styles.depoisText}>Lembrar depois</Text>
              </TouchableOpacity>
            </Animated.View>
          )}

        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(5, 13, 38, 0.84)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  card: {
    width: CARD_W,
    backgroundColor: '#0F2044',
    borderRadius: 28,
    borderWidth: 1.5,
    borderColor: 'rgba(212,160,23,0.3)',
    paddingHorizontal: 28,
    paddingTop: 36,
    paddingBottom: 28,
    alignItems: 'center',
  },
  closeBtn: {
    position: 'absolute',
    top: 14,
    right: 16,
    padding: 6,
    zIndex: 10,
  },

  // Fase 1 — textos
  presLabel: {
    fontSize: 16,
    color: '#8899AA',
    fontWeight: '500',
    textAlign: 'center',
  },
  presTitulo: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 2,
  },
  presSubtitulo: {
    fontSize: 14,
    color: '#D4A017',
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 20,
  },

  // Área da animação
  giftArea: {
    width: 210,
    height: 210,
    alignItems: 'center',
    justifyContent: 'center',
  },
  particula: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  giftGlow: {
    position: 'absolute',
    width: 170,
    height: 170,
    borderRadius: 85,
    backgroundColor: 'rgba(212,160,23,0.10)',
    zIndex: -1,
  },

  // Laço
  bowRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: -5,
    zIndex: 5,
  },
  bowOval: {
    width: 34,
    height: 23,
    borderRadius: 17,
    backgroundColor: '#F9A825',
    borderWidth: 1.5,
    borderColor: 'rgba(160,110,0,0.5)',
  },
  bowKnot: {
    position: 'absolute',
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#FFD54F',
    borderWidth: 1.5,
    borderColor: '#B07A00',
    zIndex: 6,
  },

  // Caixa
  giftLid: {
    width: 132,
    height: 38,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  giftBody: {
    width: 132,
    height: 86,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -1,
  },
  faixa: {
    width: 18,
    height: '100%',
    backgroundColor: 'rgba(255,255,255,0.28)',
    borderRadius: 2,
  },

  tapHint: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 14,
  },
  tapText: {
    fontSize: 13,
    color: '#D4A017',
    fontWeight: '500',
  },

  // Fase 2 — compartilhar
  shareWrap: {
    alignItems: 'center',
    width: '100%',
    paddingTop: 4,
  },
  celebEmoji: {
    fontSize: 54,
    marginBottom: 8,
  },
  shareTitulo: {
    fontSize: 26,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 12,
    textAlign: 'center',
  },
  shareDescr: {
    fontSize: 16,
    color: '#AABBCC',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 4,
  },
  hl: {
    color: '#D4A017',
    fontWeight: '700',
  },

  amigoRow: {
    flexDirection: 'row',
    gap: 16,
    marginVertical: 22,
  },
  amigoCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(212,160,23,0.10)',
    borderWidth: 1.5,
    borderColor: 'rgba(212,160,23,0.28)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  amigoEmoji: {
    fontSize: 26,
  },

  recompensaBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(212,160,23,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(212,160,23,0.22)',
    borderRadius: 20,
    paddingVertical: 9,
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  recompensaText: {
    fontSize: 14,
    color: '#AABBCC',
  },

  btnZap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: '#25D366',
    borderRadius: 16,
    height: 56,
    width: '100%',
    marginBottom: 12,
    shadowColor: '#25D366',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.28,
    shadowRadius: 8,
    elevation: 6,
  },
  btnZapText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  depoisBtn: {
    paddingVertical: 10,
  },
  depoisText: {
    fontSize: 13,
    color: '#8899AA',
    fontWeight: '500',
  },
});
