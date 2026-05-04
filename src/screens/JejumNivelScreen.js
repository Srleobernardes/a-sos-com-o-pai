import React from 'react';
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

const NIVEL_META = {
  '12h': { icone: 'flame-outline', oracoes: 4, badge: 'Básico' },
  '24h': { icone: 'flame', oracoes: 6, badge: 'Intermediário' },
  '36h': { icone: 'bonfire', oracoes: 8, badge: 'Avançado' },
};

export default function JejumNivelScreen({ route, navigation }) {
  const insets = useSafeAreaInsets();
  const jejum = route.params?.jejum;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>{jejum.titulo}</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Banner */}
        <View style={[styles.bannerArea, { backgroundColor: jejum.cor }]}>
          <View style={styles.bannerIconCircle}>
            <Ionicons name={jejum.icone} size={40} color="#FFF" />
          </View>
          <Text style={styles.bannerTitulo}>{jejum.titulo}</Text>
          <Text style={styles.bannerSubtitulo}>{jejum.subtitulo}</Text>
        </View>

        {/* Description */}
        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <Ionicons name="information-circle" size={20} color={COLORS.primary} />
            <Text style={styles.sectionTitle}>Sobre este propósito</Text>
          </View>
          <Text style={styles.bodyText}>{jejum.descricao}</Text>
        </View>

        {/* Benefits */}
        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <Ionicons name="star" size={20} color={COLORS.primary} />
            <Text style={styles.sectionTitle}>No que ajuda</Text>
          </View>
          {jejum.beneficios.map((b, i) => (
            <View key={i} style={styles.beneficioRow}>
              <Ionicons name="checkmark-circle" size={18} color={COLORS.success} />
              <Text style={styles.beneficioText}>{b}</Text>
            </View>
          ))}
        </View>

        {/* Level selection */}
        <View style={styles.niveisHeader}>
          <Ionicons name="layers" size={22} color={COLORS.primary} />
          <Text style={styles.niveisTitle}>Escolha o Nível</Text>
        </View>
        <Text style={styles.niveisSubtitle}>
          Cada nível tem duração e intensidade diferentes
        </Text>

        {jejum.niveis.map((nivel) => {
          const meta = NIVEL_META[nivel.id];
          return (
            <TouchableOpacity
              key={nivel.id}
              style={styles.nivelCard}
              onPress={() => navigation.navigate('JejumDetalhe', { nivel, jejum })}
              activeOpacity={0.8}
            >
              <View style={[styles.nivelIconArea, { backgroundColor: jejum.cor + '18' }]}>
                <Ionicons name={meta.icone} size={28} color={jejum.cor} />
              </View>
              <View style={styles.nivelContent}>
                <View style={styles.nivelTopRow}>
                  <Text style={styles.nivelTitulo}>{nivel.titulo}</Text>
                  <View style={[styles.nivelBadge, { backgroundColor: jejum.cor + '20' }]}>
                    <Text style={[styles.nivelBadgeText, { color: jejum.cor }]}>{meta.badge}</Text>
                  </View>
                </View>
                <Text style={styles.nivelSubtitulo}>{nivel.subtitulo}</Text>
                <View style={styles.nivelInfoRow}>
                  <View style={styles.nivelInfoItem}>
                    <Ionicons name="time-outline" size={14} color={COLORS.textLight} />
                    <Text style={styles.nivelInfoText}>{nivel.duracao}</Text>
                  </View>
                  <View style={styles.nivelInfoItem}>
                    <Ionicons name="hand-left-outline" size={14} color={COLORS.textLight} />
                    <Text style={styles.nivelInfoText}>{meta.oracoes} orações</Text>
                  </View>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color={COLORS.textLight} />
            </TouchableOpacity>
          );
        })}

        <View style={{ height: 40 }} />
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
  headerTitle: { fontSize: 17, ...FONTS.bold, color: COLORS.text, flex: 1, textAlign: 'center' },
  scrollContent: { paddingBottom: 40 },
  bannerArea: {
    paddingVertical: 32, paddingHorizontal: 20,
    alignItems: 'center',
  },
  bannerIconCircle: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center', justifyContent: 'center', marginBottom: 12,
  },
  bannerTitulo: {
    color: '#FFF', fontSize: 22, ...FONTS.bold, textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.3)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 4,
  },
  bannerSubtitulo: {
    color: 'rgba(255,255,255,0.85)', fontSize: 14, marginTop: 6, textAlign: 'center',
  },
  card: {
    margin: 16, marginBottom: 0, padding: 20,
    backgroundColor: COLORS.surface, borderRadius: 16, ...SHADOWS.small,
  },
  sectionHeader: {
    flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12,
  },
  sectionTitle: { fontSize: 17, ...FONTS.bold, color: COLORS.text },
  bodyText: { fontSize: 14, color: COLORS.textSecondary, lineHeight: 22 },
  beneficioRow: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: 10,
  },
  beneficioText: { fontSize: 14, color: COLORS.textSecondary, lineHeight: 20, flex: 1 },
  niveisHeader: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    paddingHorizontal: 20, marginTop: 24, marginBottom: 4,
  },
  niveisTitle: { fontSize: 20, ...FONTS.bold, color: COLORS.text },
  niveisSubtitle: {
    fontSize: 13, color: COLORS.textLight, paddingHorizontal: 20, marginBottom: 14,
  },
  nivelCard: {
    flexDirection: 'row', alignItems: 'center',
    marginHorizontal: 16, marginBottom: 12, padding: 16,
    backgroundColor: COLORS.surface, borderRadius: 16,
    borderWidth: 1, borderColor: COLORS.borderLight, ...SHADOWS.small,
  },
  nivelIconArea: {
    width: 56, height: 56, borderRadius: 16,
    alignItems: 'center', justifyContent: 'center',
  },
  nivelContent: {
    flex: 1, marginLeft: 14,
  },
  nivelTopRow: {
    flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 2,
  },
  nivelTitulo: {
    fontSize: 15, ...FONTS.bold, color: COLORS.text, flex: 1,
  },
  nivelBadge: {
    paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6,
  },
  nivelBadgeText: {
    fontSize: 10, ...FONTS.bold,
  },
  nivelSubtitulo: {
    fontSize: 13, color: COLORS.textSecondary, marginBottom: 6,
  },
  nivelInfoRow: {
    flexDirection: 'row', gap: 14,
  },
  nivelInfoItem: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
  },
  nivelInfoText: {
    fontSize: 11, color: COLORS.textLight, ...FONTS.medium,
  },
});
