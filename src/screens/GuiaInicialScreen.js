import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, SHADOWS, FONTS } from '../theme/colors';
import { useApp } from '../context/AppContext';

const { width } = Dimensions.get('window');

export default function GuiaInicialScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { primeiroAcesso, finishOnboarding } = useApp();
  const [currentStep, setCurrentStep] = useState(0);
  const fadeAnim = useState(new Animated.Value(1))[0];

  const steps = [
    {
      icone: 'heart',
      cor: '#D4A017',
      titulo: 'Bem-vindo a\nA sos com o Pai',
      descricao:
        'Sua jornada espiritual comeca aqui. Vamos te ajudar a desenvolver disciplina na oracao, devocional e jejum.',
    },
    {
      icone: 'today',
      cor: COLORS.primary,
      titulo: 'Plano Diario',
      descricao:
        'Todo dia voce tera atividades espirituais para completar: conexao com Deus, versiculo, devocional e oracao guiada.',
    },
    {
      icone: 'restaurant',
      cor: '#FF9800',
      titulo: 'Jejum Espiritual',
      descricao:
        'Acompanhe seu jejum com nosso sistema de marcacao. Escolha o tipo de jejum e marque os dias concluidos.',
    },
    {
      icone: 'book',
      cor: '#7B68EE',
      titulo: 'Oracoes Sagradas',
      descricao:
        'Acesse uma biblioteca de oracoes poderosas para cada momento da sua vida. Leia, ouca e assista.',
    },
    {
      icone: 'trophy',
      cor: '#FFD700',
      titulo: 'Conquistas',
      descricao:
        'Ganhe medalhas conforme sua sequencia de oracoes cresce. Mantenha sua chama espiritual acesa!',
    },
  ];

  const animateTransition = (nextStep) => {
    Animated.sequence([
      Animated.timing(fadeAnim, { toValue: 0, duration: 150, useNativeDriver: true }),
      Animated.timing(fadeAnim, { toValue: 1, duration: 150, useNativeDriver: true }),
    ]).start();
    setTimeout(() => setCurrentStep(nextStep), 150);
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      animateTransition(currentStep + 1);
    }
  };

  const handleStart = () => {
    finishOnboarding();
    navigation.navigate('HojeTab');
  };

  const step = steps[currentStep];
  const isLast = currentStep === steps.length - 1;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.appName}>A sos com o Pai</Text>
          <View style={styles.proBadge}>
            <Ionicons name="cross" size={14} color="#FFF" />
          </View>
        </View>

        {/* Video placeholder area */}
        <View style={styles.videoArea}>
          {/* VIDEO: 360x220px - Coloque seu video explicativo aqui */}
          <View style={styles.videoPlaceholder}>
            <View style={styles.playButton}>
              <Ionicons name="play" size={40} color="#FFF" />
            </View>
            <Text style={styles.videoLabel}>Video: Como usar o app</Text>
            <Text style={styles.videoSub}>Toque para assistir</Text>
          </View>
        </View>

        {/* Onboarding Steps */}
        <Animated.View style={[styles.stepCard, { opacity: fadeAnim }]}>
          <View style={[styles.stepIconCircle, { backgroundColor: step.cor + '20' }]}>
            <Ionicons name={step.icone} size={44} color={step.cor} />
          </View>
          <Text style={styles.stepTitulo}>{step.titulo}</Text>
          <Text style={styles.stepDescricao}>{step.descricao}</Text>
        </Animated.View>

        {/* Dots */}
        <View style={styles.dotsRow}>
          {steps.map((_, i) => (
            <View
              key={i}
              style={[styles.dot, i === currentStep && styles.dotActive]}
            />
          ))}
        </View>

        {/* Features list */}
        <View style={styles.featuresSection}>
          <Text style={styles.featuresTitle}>O que voce vai encontrar:</Text>
          {[
            { icon: 'checkmark-circle', text: 'Plano diario personalizado', cor: COLORS.success },
            { icon: 'flame', text: 'Sistema de sequencia (streak)', cor: COLORS.streak },
            { icon: 'medal', text: 'Medalhas e conquistas', cor: COLORS.gold },
            { icon: 'book', text: 'Devocionais inspiradores', cor: '#7B68EE' },
            { icon: 'musical-notes', text: 'Audios e videos de oracao', cor: '#E53935' },
          ].map((item, i) => (
            <View key={i} style={styles.featureRow}>
              <View style={[styles.featureIcon, { backgroundColor: item.cor + '15' }]}>
                <Ionicons name={item.icon} size={20} color={item.cor} />
              </View>
              <Text style={styles.featureText}>{item.text}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Bottom buttons */}
      <View style={[styles.bottomBar, { paddingBottom: insets.bottom + 12 }]}>
        {!isLast ? (
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.skipButton} onPress={handleStart}>
              <Text style={styles.skipText}>Pular</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
              <Text style={styles.nextText}>Proximo</Text>
              <Ionicons name="arrow-forward" size={18} color="#FFF" />
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity style={styles.startButton} onPress={handleStart}>
            <Ionicons name="cross" size={22} color="#FFF" />
            <Text style={styles.startText}>Comecar Jornada Espiritual</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    paddingBottom: 120,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 10,
  },
  appName: {
    fontSize: 24,
    ...FONTS.extrabold,
    color: COLORS.text,
  },
  proBadge: {
    backgroundColor: COLORS.primary,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  videoArea: {
    marginHorizontal: 20,
    marginBottom: 24,
  },
  videoPlaceholder: {
    height: 220,
    borderRadius: 20,
    backgroundColor: '#1a1a2e',
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.large,
  },
  playButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    ...SHADOWS.medium,
  },
  videoLabel: {
    color: '#FFF',
    fontSize: 16,
    ...FONTS.bold,
  },
  videoSub: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 12,
    marginTop: 4,
  },
  stepCard: {
    alignItems: 'center',
    paddingHorizontal: 32,
    marginBottom: 24,
  },
  stepIconCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  stepTitulo: {
    fontSize: 24,
    ...FONTS.bold,
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 10,
  },
  stepDescricao: {
    fontSize: 15,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 32,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.border,
  },
  dotActive: {
    width: 24,
    backgroundColor: COLORS.primary,
  },
  featuresSection: {
    paddingHorizontal: 24,
  },
  featuresTitle: {
    fontSize: 18,
    ...FONTS.bold,
    color: COLORS.text,
    marginBottom: 16,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
    gap: 14,
  },
  featureIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureText: {
    fontSize: 15,
    color: COLORS.text,
    ...FONTS.medium,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingTop: 12,
    backgroundColor: COLORS.background,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  skipButton: {
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  skipText: {
    fontSize: 15,
    color: COLORS.textSecondary,
    ...FONTS.medium,
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 30,
    gap: 8,
    ...SHADOWS.small,
  },
  nextText: {
    color: '#FFF',
    fontSize: 16,
    ...FONTS.bold,
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    borderRadius: 30,
    gap: 10,
    ...SHADOWS.medium,
  },
  startText: {
    color: '#FFF',
    fontSize: 17,
    ...FONTS.bold,
  },
});
