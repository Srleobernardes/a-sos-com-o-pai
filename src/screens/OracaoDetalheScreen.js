import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, SHADOWS, FONTS } from '../theme/colors';
import { useApp } from '../context/AppContext';

export default function OracaoDetalheScreen({ route, navigation }) {
  const insets = useSafeAreaInsets();
  const { oracao } = route.params;
  const { markOracaoLida } = useApp();

  useEffect(() => {
    markOracaoLida(oracao.id);
  }, []);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {oracao.titulo}
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Banner area */}
        {/* BANNER: 360x200px - Imagem tematica da oracao */}
        <View style={[styles.bannerArea, { backgroundColor: oracao.cor }]}>
          <Ionicons name={oracao.icone} size={60} color="rgba(255,255,255,0.3)" />
          <Text style={styles.bannerTitle}>{oracao.titulo}</Text>
          <Text style={styles.bannerSubtitle}>{oracao.subtitulo}</Text>
        </View>

        {/* Media buttons */}
        <View style={styles.mediaRow}>
          <TouchableOpacity style={styles.mediaButton}>
            {/* AUDIO: Conecte ao arquivo em assets/audio/ */}
            <Ionicons name="headset" size={22} color={COLORS.primary} />
            <Text style={styles.mediaLabel}>Ouvir Audio</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.mediaButton}>
            {/* VIDEO: Conecte ao arquivo em assets/video/ */}
            <Ionicons name="videocam" size={22} color={COLORS.primary} />
            <Text style={styles.mediaLabel}>Assistir Video</Text>
          </TouchableOpacity>
        </View>

        {/* Prayer text */}
        <View style={styles.textCard}>
          <Text style={styles.prayerText}>{oracao.texto}</Text>
        </View>

        {/* Duration badge */}
        <View style={styles.durationBadge}>
          <Ionicons name="time-outline" size={16} color={COLORS.textSecondary} />
          <Text style={styles.durationText}>Tempo estimado: {oracao.duracao}</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.surface,
    ...SHADOWS.small,
  },
  headerTitle: {
    fontSize: 17,
    ...FONTS.bold,
    color: COLORS.text,
    flex: 1,
    textAlign: 'center',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  bannerArea: {
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  bannerTitle: {
    fontSize: 26,
    ...FONTS.extrabold,
    color: '#FFF',
    marginTop: 10,
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  bannerSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.85)',
    marginTop: 6,
    textAlign: 'center',
  },
  mediaRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
  },
  mediaButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    gap: 8,
    ...SHADOWS.small,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  mediaLabel: {
    fontSize: 14,
    ...FONTS.semibold,
    color: COLORS.primary,
  },
  textCard: {
    marginHorizontal: 20,
    padding: 24,
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    ...SHADOWS.small,
  },
  prayerText: {
    fontSize: 16,
    color: COLORS.text,
    lineHeight: 28,
    ...FONTS.regular,
  },
  durationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    gap: 6,
  },
  durationText: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
});
