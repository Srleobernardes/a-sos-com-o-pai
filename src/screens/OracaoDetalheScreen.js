import React from 'react';
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
import { getOracaoDoDia } from '../data/oracoes';

export default function OracaoDetalheScreen({ route, navigation }) {
  const insets = useSafeAreaInsets();
  const { oracao } = route.params;
  const { oracoesLidas, markOracaoLida, unmarkOracaoLida } = useApp();
  const scaleAnim = React.useState(new Animated.Value(1))[0];

  const oracaoHoje = getOracaoDoDia(oracao);
  const lida = oracoesLidas.includes(oracao.id);

  const handleToggle = () => {
    Animated.sequence([
      Animated.spring(scaleAnim, { toValue: 1.1, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true }),
    ]).start();
    if (lida) {
      unmarkOracaoLida(oracao.id);
    } else {
      markOracaoLida(oracao.id);
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {oracaoHoje.titulo}
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={[styles.bannerArea, { backgroundColor: oracaoHoje.cor }]}>
          <Ionicons name={oracaoHoje.icone} size={60} color="rgba(255,255,255,0.3)" />
          <Text style={styles.bannerTitle}>{oracaoHoje.titulo}</Text>
          <Text style={styles.bannerSubtitle}>{oracaoHoje.subtitulo}</Text>
        </View>

        <View style={styles.textCard}>
          <Text style={styles.prayerText}>{oracaoHoje.texto}</Text>
        </View>

        <View style={styles.durationBadge}>
          <Ionicons name="time-outline" size={16} color={COLORS.textSecondary} />
          <Text style={styles.durationText}>Tempo estimado: {oracaoHoje.duracao}</Text>
        </View>

        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
          <TouchableOpacity
            style={[styles.completeButton, lida && styles.completedButton]}
            onPress={handleToggle}
          >
            <Ionicons name={lida ? 'close-circle' : 'checkmark'} size={22} color="#FFF" />
            <Text style={styles.completeText}>
              {lida ? 'Desmarcar oração' : 'Marcar como lida'}
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  backButton: {
    width: 40, height: 40, borderRadius: 20,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: COLORS.surface, ...SHADOWS.small,
  },
  headerTitle: {
    fontSize: 17, ...FONTS.bold, color: COLORS.text,
    flex: 1, textAlign: 'center',
  },
  scrollContent: { paddingBottom: 40 },
  bannerArea: {
    height: 200, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24,
  },
  bannerTitle: {
    fontSize: 26, ...FONTS.extrabold, color: '#FFF', marginTop: 10, textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.3)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 4,
  },
  bannerSubtitle: {
    fontSize: 14, color: 'rgba(255,255,255,0.85)', marginTop: 6, textAlign: 'center',
  },
  textCard: {
    marginHorizontal: 20, padding: 24, backgroundColor: COLORS.surface,
    borderRadius: 20, ...SHADOWS.small,
  },
  prayerText: { fontSize: 16, color: COLORS.text, lineHeight: 28, ...FONTS.regular },
  durationBadge: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    marginTop: 16, marginBottom: 8, gap: 6,
  },
  durationText: { fontSize: 13, color: COLORS.textSecondary },
  completeButton: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    marginHorizontal: 20, marginTop: 8, paddingVertical: 16,
    backgroundColor: COLORS.primary, borderRadius: 30, gap: 10, ...SHADOWS.medium,
  },
  completedButton: { backgroundColor: COLORS.success },
  completeText: { color: '#FFF', fontSize: 16, ...FONTS.bold },
});
