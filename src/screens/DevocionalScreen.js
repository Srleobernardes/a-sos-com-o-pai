import React, { useState } from 'react';
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
import { getDevocionalDoDia } from '../data/devocional';

export default function DevocionalScreen({ route, navigation }) {
  const insets = useSafeAreaInsets();
  const { completeTask, uncompleteTask, isTaskCompleted, incrementDevocionais } = useApp();
  const taskId = route.params?.taskId;
  const completed = isTaskCompleted(taskId);
  const devocional = getDevocionalDoDia();
  const scaleAnim = useState(new Animated.Value(1))[0];

  const handleToggle = () => {
    Animated.sequence([
      Animated.spring(scaleAnim, { toValue: 1.15, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true }),
    ]).start();
    if (completed) {
      uncompleteTask(taskId);
    } else {
      completeTask(taskId);
      incrementDevocionais(devocional.titulo);
      setTimeout(() => navigation.goBack(), 400);
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Devoção Diária</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* BANNER: 360x180px - Imagem de pena e pergaminho */}
        <View style={styles.bannerArea}>
          <Ionicons name="create" size={50} color="rgba(255,255,255,0.5)" />
          <Text style={styles.bannerTitle}>{devocional.titulo}</Text>
          <Text style={styles.bannerDia}>Dia {devocional.dia}</Text>
        </View>

        {/* Verse card */}
        <View style={styles.verseCard}>
          <Ionicons name="book-outline" size={20} color={COLORS.primary} />
          <Text style={styles.verseRef}>{devocional.versiculo}</Text>
          <Text style={styles.verseText}>"{devocional.textoVersiculo}"</Text>
        </View>

        {/* Reflection */}
        <View style={styles.contentCard}>
          <Text style={styles.sectionTitle}>Reflexão</Text>
          <Text style={styles.bodyText}>{devocional.reflexao}</Text>
        </View>

        {/* Prayer */}
        <View style={styles.prayerCard}>
          <View style={styles.prayerHeader}>
            <Ionicons name="hand-left" size={20} color={COLORS.primary} />
            <Text style={styles.prayerTitle}>Oração</Text>
          </View>
          <Text style={styles.prayerText}>{devocional.oracao}</Text>
        </View>

        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
          <TouchableOpacity
            style={[styles.completeButton, completed && styles.completedButton]}
            onPress={handleToggle}
          >
            <Ionicons name={completed ? 'close-circle' : 'checkmark'} size={22} color="#FFF" />
            <Text style={styles.completeText}>
              {completed ? 'Desmarcar' : 'Marcar como concluído'}
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 12,
    borderBottomWidth: 1, borderBottomColor: COLORS.borderLight,
  },
  backButton: {
    width: 40, height: 40, borderRadius: 20,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: COLORS.surface, ...SHADOWS.small,
  },
  headerTitle: { fontSize: 17, ...FONTS.bold, color: COLORS.text },
  scrollContent: { paddingBottom: 40 },
  bannerArea: {
    height: 180, backgroundColor: '#2A4D7A',
    alignItems: 'center', justifyContent: 'center',
  },
  bannerTitle: {
    color: '#FFF', fontSize: 22, ...FONTS.bold, marginTop: 8,
    textShadowColor: 'rgba(0,0,0,0.3)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 4,
  },
  bannerDia: { color: 'rgba(255,255,255,0.7)', fontSize: 14, marginTop: 4 },
  verseCard: {
    margin: 20, marginBottom: 0, padding: 20, backgroundColor: COLORS.primaryLight + '20',
    borderRadius: 16, borderWidth: 1, borderColor: COLORS.primaryLight + '40', alignItems: 'center',
  },
  verseRef: { fontSize: 14, ...FONTS.bold, color: COLORS.primaryDark, marginTop: 8 },
  verseText: {
    fontSize: 15, color: COLORS.text, fontStyle: 'italic', textAlign: 'center',
    lineHeight: 24, marginTop: 8,
  },
  contentCard: {
    margin: 20, padding: 24, backgroundColor: COLORS.surface,
    borderRadius: 20, ...SHADOWS.small,
  },
  sectionTitle: { fontSize: 18, ...FONTS.bold, color: COLORS.text, marginBottom: 14 },
  bodyText: { fontSize: 15, color: COLORS.textSecondary, lineHeight: 26 },
  prayerCard: {
    marginHorizontal: 20, marginBottom: 20, padding: 20,
    backgroundColor: COLORS.surfaceWarm, borderRadius: 16,
    borderWidth: 1, borderColor: COLORS.borderLight,
  },
  prayerHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  prayerTitle: { fontSize: 16, ...FONTS.bold, color: COLORS.text },
  prayerText: { fontSize: 14, color: COLORS.textSecondary, lineHeight: 22, fontStyle: 'italic' },
  audioArea: { marginHorizontal: 20, marginBottom: 24 },
  audioButton: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    paddingVertical: 14, backgroundColor: COLORS.surface, borderRadius: 14,
    gap: 10, ...SHADOWS.small, borderWidth: 1, borderColor: COLORS.borderLight,
  },
  audioLabel: { fontSize: 14, ...FONTS.semibold, color: COLORS.primary },
  completeButton: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    marginHorizontal: 20, paddingVertical: 16, backgroundColor: COLORS.primary,
    borderRadius: 30, gap: 10, ...SHADOWS.medium,
  },
  completedButton: { backgroundColor: COLORS.success },
  completeText: { color: '#FFF', fontSize: 16, ...FONTS.bold },
});
