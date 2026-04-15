import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Share,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, SHADOWS, FONTS } from '../theme/colors';
import { useApp } from '../context/AppContext';
import { getVersiculoDoDia } from '../data/versiculos';

export default function VersiculoScreen({ route, navigation }) {
  const insets = useSafeAreaInsets();
  const { completeTask, uncompleteTask, isTaskCompleted } = useApp();
  const taskId = route.params?.taskId;
  const completed = isTaskCompleted(taskId);
  const versiculo = getVersiculoDoDia();
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
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `"${versiculo.texto}"\n\n- ${versiculo.referencia}\n\nEnviado pelo app A sos com o Pai`,
      });
    } catch (e) {}
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Versiculo Diario</Text>
        <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
          <Ionicons name="share-outline" size={22} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* BANNER: 360x200px - Imagem de biblia aberta */}
        <View style={styles.bannerArea}>
          <Ionicons name="book" size={50} color="rgba(255,255,255,0.6)" />
        </View>

        <View style={styles.versiculoCard}>
          <Ionicons name="bookmark" size={28} color={COLORS.primary} style={styles.bookmark} />
          <Text style={styles.versiculoTexto}>"{versiculo.texto}"</Text>
          <View style={styles.referenciaRow}>
            <View style={styles.referenciaBadge}>
              <Text style={styles.referenciaText}>{versiculo.referencia}</Text>
            </View>
          </View>
        </View>

        <View style={styles.reflexaoCard}>
          <Text style={styles.reflexaoTitle}>Reflexao do dia</Text>
          <Text style={styles.reflexaoText}>
            Medite neste versiculo hoje. Deixe que a Palavra de Deus transforme seu dia, suas decisoes e sua perspectiva. Carregue este versiculo no coracao.
          </Text>
        </View>

        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
          <TouchableOpacity
            style={[styles.completeButton, completed && styles.completedButton]}
            onPress={handleToggle}
          >
            <Ionicons name={completed ? 'close-circle' : 'checkmark'} size={22} color="#FFF" />
            <Text style={styles.completeText}>
              {completed ? 'Desmarcar' : 'Marcar como concluido'}
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
  shareButton: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  scrollContent: { paddingBottom: 40 },
  bannerArea: {
    height: 200, backgroundColor: '#D4A017',
    alignItems: 'center', justifyContent: 'center',
  },
  versiculoCard: {
    margin: 20, padding: 28, backgroundColor: COLORS.surface,
    borderRadius: 20, ...SHADOWS.medium, alignItems: 'center',
  },
  bookmark: { marginBottom: 16 },
  versiculoTexto: {
    fontSize: 20, color: COLORS.text, lineHeight: 32,
    textAlign: 'center', fontStyle: 'italic', ...FONTS.medium,
  },
  referenciaRow: { marginTop: 20 },
  referenciaBadge: {
    backgroundColor: COLORS.primaryLight + '30', paddingHorizontal: 16,
    paddingVertical: 6, borderRadius: 20,
  },
  referenciaText: { fontSize: 14, ...FONTS.bold, color: COLORS.primaryDark },
  reflexaoCard: {
    marginHorizontal: 20, marginBottom: 24, padding: 20,
    backgroundColor: COLORS.surfaceWarm, borderRadius: 16,
    borderWidth: 1, borderColor: COLORS.borderLight,
  },
  reflexaoTitle: { fontSize: 16, ...FONTS.bold, color: COLORS.text, marginBottom: 8 },
  reflexaoText: { fontSize: 14, color: COLORS.textSecondary, lineHeight: 22 },
  completeButton: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    marginHorizontal: 20, paddingVertical: 16, backgroundColor: COLORS.primary,
    borderRadius: 30, gap: 10, ...SHADOWS.medium,
  },
  completedButton: { backgroundColor: COLORS.success },
  completeText: { color: '#FFF', fontSize: 16, ...FONTS.bold },
});
