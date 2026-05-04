import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, SHADOWS, FONTS } from '../theme/colors';
import { useApp } from '../context/AppContext';
import { getOracaoGuiadaDoDia } from '../data/oracaoGuiada';

export default function OracaoGuiadaScreen({ route, navigation }) {
  const insets = useSafeAreaInsets();
  const { completeTask, uncompleteTask, isTaskCompleted } = useApp();
  const taskId = route.params?.taskId;
  const [currentStep, setCurrentStep] = useState(0);
  const completed = isTaskCompleted(taskId);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const PASSOS = getOracaoGuiadaDoDia().passos;

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: (currentStep + 1) / PASSOS.length,
      duration: 400,
      useNativeDriver: false,
    }).start();
  }, [currentStep]);

  const animateStep = (next) => {
    Animated.sequence([
      Animated.timing(fadeAnim, { toValue: 0, duration: 150, useNativeDriver: true }),
      Animated.timing(fadeAnim, { toValue: 1, duration: 150, useNativeDriver: true }),
    ]).start();
    setTimeout(() => setCurrentStep(next), 150);
  };

  const handleNext = () => {
    if (currentStep < PASSOS.length - 1) {
      animateStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      animateStep(currentStep - 1);
    }
  };

  const handleToggle = () => {
    if (completed) {
      uncompleteTask(taskId);
    } else {
      completeTask(taskId);
      setTimeout(() => navigation.goBack(), 400);
    }
  };

  const passo = PASSOS[currentStep];
  const isLast = currentStep === PASSOS.length - 1;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Oração Guiada</Text>
        <Text style={styles.stepCount}>{currentStep + 1}/{PASSOS.length}</Text>
      </View>

      {/* Progress bar */}
      <View style={styles.progressContainer}>
        <Animated.View
          style={[
            styles.progressFill,
            {
              width: progressAnim.interpolate({
                inputRange: [0, 1],
                outputRange: ['0%', '100%'],
              }),
            },
          ]}
        />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* BANNER: 360x180px - Imagem de maos em oracao */}
        <View style={styles.bannerArea}>
          <Ionicons name="hand-left" size={50} color="rgba(255,255,255,0.5)" />
          <Text style={styles.bannerText}>Oração Guiada</Text>
        </View>

        {/* Step content */}
        <Animated.View style={[styles.stepCard, { opacity: fadeAnim }]}>
          <View style={styles.stepIconCircle}>
            <Ionicons name={passo.icone} size={32} color={COLORS.primary} />
          </View>
          <Text style={styles.stepTitulo}>{passo.titulo}</Text>
          <Text style={styles.stepDuracao}>{passo.duracao}</Text>
          <Text style={styles.stepTexto}>{passo.texto}</Text>
        </Animated.View>

        {/* Steps indicator */}
        <View style={styles.stepsRow}>
          {PASSOS.map((p, i) => (
            <TouchableOpacity
              key={i}
              style={[
                styles.stepDot,
                i === currentStep && styles.stepDotActive,
                i < currentStep && styles.stepDotDone,
              ]}
              onPress={() => animateStep(i)}
            >
              {i < currentStep ? (
                <Ionicons name="checkmark" size={12} color="#FFF" />
              ) : (
                <Text
                  style={[
                    styles.stepDotText,
                    i === currentStep && styles.stepDotTextActive,
                  ]}
                >
                  {i + 1}
                </Text>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Navigation */}
        <View style={styles.navRow}>
          <TouchableOpacity
            style={[styles.navButton, currentStep === 0 && styles.navButtonDisabled]}
            onPress={handlePrev}
            disabled={currentStep === 0}
          >
            <Ionicons name="arrow-back" size={20} color={currentStep === 0 ? COLORS.textLight : COLORS.primary} />
            <Text style={[styles.navText, currentStep === 0 && styles.navTextDisabled]}>Anterior</Text>
          </TouchableOpacity>

          {completed ? (
            <TouchableOpacity style={styles.completedButton} onPress={handleToggle}>
              <Ionicons name="close-circle" size={20} color="#FFF" />
              <Text style={styles.completeText}>Desmarcar</Text>
            </TouchableOpacity>
          ) : isLast ? (
            <TouchableOpacity style={styles.completeButton} onPress={handleToggle}>
              <Ionicons name="checkmark" size={20} color="#FFF" />
              <Text style={styles.completeText}>Concluir</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
              <Text style={styles.nextText}>Próximo</Text>
              <Ionicons name="arrow-forward" size={20} color="#FFF" />
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 12,
  },
  backButton: {
    width: 40, height: 40, borderRadius: 20,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: COLORS.surface, ...SHADOWS.small,
  },
  headerTitle: { fontSize: 17, ...FONTS.bold, color: COLORS.text },
  stepCount: { fontSize: 14, ...FONTS.semibold, color: COLORS.textSecondary, width: 40, textAlign: 'right' },
  progressContainer: {
    height: 4, backgroundColor: '#F0F0F0',
    marginHorizontal: 20, borderRadius: 2, overflow: 'hidden',
  },
  progressFill: { height: '100%', backgroundColor: COLORS.primary, borderRadius: 2 },
  scrollContent: { paddingBottom: 40 },
  bannerArea: {
    height: 180, backgroundColor: '#0D1B3E',
    alignItems: 'center', justifyContent: 'center',
    marginTop: 12,
  },
  bannerText: {
    color: '#FFF', fontSize: 20, ...FONTS.bold, marginTop: 8,
    textShadowColor: 'rgba(0,0,0,0.3)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 4,
  },
  stepCard: {
    margin: 20, padding: 28, backgroundColor: COLORS.surface,
    borderRadius: 20, ...SHADOWS.medium, alignItems: 'center',
  },
  stepIconCircle: {
    width: 72, height: 72, borderRadius: 36,
    backgroundColor: COLORS.primaryLight + '25',
    alignItems: 'center', justifyContent: 'center', marginBottom: 16,
  },
  stepTitulo: { fontSize: 24, ...FONTS.bold, color: COLORS.text, marginBottom: 4 },
  stepDuracao: { fontSize: 13, color: COLORS.textLight, marginBottom: 16 },
  stepTexto: { fontSize: 16, color: COLORS.textSecondary, lineHeight: 26, textAlign: 'center' },
  stepsRow: {
    flexDirection: 'row', justifyContent: 'center', gap: 12,
    marginBottom: 24,
  },
  stepDot: {
    width: 32, height: 32, borderRadius: 16,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#F0F0F0', borderWidth: 2, borderColor: '#E0E0E0',
  },
  stepDotActive: { borderColor: COLORS.primary, backgroundColor: COLORS.primaryLight + '30' },
  stepDotDone: { backgroundColor: COLORS.success, borderColor: COLORS.success },
  stepDotText: { fontSize: 13, ...FONTS.bold, color: COLORS.textLight },
  stepDotTextActive: { color: COLORS.primary },
  audioButton: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    marginHorizontal: 20, marginBottom: 24, paddingVertical: 14,
    backgroundColor: COLORS.surface, borderRadius: 14,
    gap: 10, ...SHADOWS.small, borderWidth: 1, borderColor: COLORS.borderLight,
  },
  audioLabel: { fontSize: 14, ...FONTS.semibold, color: COLORS.primary },
  navRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    paddingHorizontal: 20, gap: 12,
  },
  navButton: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingVertical: 14, paddingHorizontal: 20,
  },
  navButtonDisabled: { opacity: 0.4 },
  navText: { fontSize: 15, ...FONTS.semibold, color: COLORS.primary },
  navTextDisabled: { color: COLORS.textLight },
  nextButton: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: COLORS.primary, paddingVertical: 14, paddingHorizontal: 28,
    borderRadius: 30, ...SHADOWS.small,
  },
  nextText: { color: '#FFF', fontSize: 15, ...FONTS.bold },
  completeButton: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: COLORS.primary, paddingVertical: 14, paddingHorizontal: 28,
    borderRadius: 30, ...SHADOWS.small,
  },
  completedButton: { backgroundColor: COLORS.success },
  completeText: { color: '#FFF', fontSize: 15, ...FONTS.bold },
});
