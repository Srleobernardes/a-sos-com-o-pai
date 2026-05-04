import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Alert,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, SHADOWS, FONTS } from '../theme/colors';
import { useApp } from '../context/AppContext';
import { JEJUM_DANIEL_MEDITACOES } from '../data/jejumDaniel';

const COR_DANIEL = '#B8860B';
const COR_DANIEL_FUNDO = '#FDF6E3';

const SEMANA_LABELS = [
  { inicio: 1, fim: 7, titulo: 'Semana 1', subtitulo: 'Dias 1-7' },
  { inicio: 8, fim: 14, titulo: 'Semana 2', subtitulo: 'Dias 8-14' },
  { inicio: 15, fim: 21, titulo: 'Semana 3', subtitulo: 'Dias 15-21' },
];

export default function JejumDanielScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { jejumDias, toggleJejumDia, startJejum, jejumAtivo } = useApp();
  const [expandedDia, setExpandedDia] = useState(null);

  const diasCompletos = Object.values(jejumDias).filter(Boolean).length;
  const isEsteJejumAtivo = jejumAtivo?.tipo === 'daniel';

  const handleIniciarJejum = () => {
    if (isEsteJejumAtivo) {
      navigation.navigate('JejumMain');
      return;
    }
    const doStart = () => {
      startJejum('daniel');
      navigation.navigate('JejumMain');
    };
    if (!jejumAtivo) {
      doStart();
      return;
    }
    if (Platform.OS === 'web') {
      if (window.confirm('Você já tem um jejum ativo. Deseja iniciar um novo?')) doStart();
    } else {
      Alert.alert(
        'Jejum em andamento',
        'Você já tem um jejum ativo. Deseja iniciar um novo?',
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Sim, iniciar novo', onPress: doStart },
        ]
      );
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Jejum de Daniel</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Banner */}
        <View style={styles.bannerArea}>
          <View style={styles.bannerIconCircle}>
            <Ionicons name="nutrition" size={40} color="#FFF" />
          </View>
          <Text style={styles.bannerTitulo}>21 Dias</Text>
          <Text style={styles.bannerSubtitulo}>Jejum de Daniel</Text>
          <Text style={styles.bannerDescricao}>Meditações Diárias</Text>
        </View>

        {/* Progress */}
        <View style={styles.progressCard}>
          <View style={styles.progressHeader}>
            <Ionicons name="flame" size={20} color={COR_DANIEL} />
            <Text style={styles.progressTitle}>Seu progresso</Text>
            <Text style={styles.progressCount}>{diasCompletos}/21</Text>
          </View>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${Math.min((diasCompletos / 21) * 100, 100)}%` }]} />
          </View>
          <Text style={styles.progressPercent}>{Math.round((diasCompletos / 21) * 100)}% concluído</Text>
        </View>

        {/* Iniciar Jejum */}
        <TouchableOpacity
          style={[styles.iniciarButton, isEsteJejumAtivo && styles.iniciarButtonAtivo]}
          onPress={handleIniciarJejum}
          activeOpacity={0.85}
        >
          <Ionicons
            name={isEsteJejumAtivo ? 'checkmark-circle' : 'play-circle'}
            size={24}
            color="#FFF"
          />
          <Text style={styles.iniciarButtonText}>
            {isEsteJejumAtivo ? 'Jejum em Andamento' : 'Iniciar Jejum de Daniel'}
          </Text>
        </TouchableOpacity>

        {/* Weeks */}
        {SEMANA_LABELS.map((semana) => (
          <View key={semana.titulo}>
            <View style={styles.semanaHeader}>
              <Ionicons name="calendar" size={18} color={COR_DANIEL} />
              <Text style={styles.semanaTitulo}>{semana.titulo}</Text>
              <Text style={styles.semanaSubtitulo}>{semana.subtitulo}</Text>
            </View>

            {JEJUM_DANIEL_MEDITACOES.filter(m => m.dia >= semana.inicio && m.dia <= semana.fim).map((med) => {
              const key = `dia_${med.dia}`;
              const completo = jejumDias[key];
              const isExpanded = expandedDia === med.dia;

              return (
                <View key={med.dia} style={[styles.diaCard, completo && styles.diaCardCompleto]}>
                  <TouchableOpacity
                    style={styles.diaHeader}
                    onPress={() => setExpandedDia(isExpanded ? null : med.dia)}
                    activeOpacity={0.8}
                  >
                    <View style={[styles.diaNumero, completo && styles.diaNumeroCompleto]}>
                      {completo ? (
                        <Ionicons name="checkmark" size={18} color="#FFF" />
                      ) : (
                        <Text style={styles.diaNumeroText}>{med.dia}</Text>
                      )}
                    </View>
                    <View style={styles.diaContent}>
                      <Text style={styles.diaSalmo}>{med.salmo}</Text>
                      <Text style={styles.diaTitulo}>{med.titulo}</Text>
                      {(med.horario || med.duracao) && (
                        <View style={styles.metaRow}>
                          {med.horario && (
                            <View style={[styles.metaPill, { backgroundColor: COR_DANIEL + '15' }]}>
                              <Ionicons name="time-outline" size={11} color={COR_DANIEL} />
                              <Text style={[styles.metaText, { color: COR_DANIEL }]}>{med.horario}</Text>
                            </View>
                          )}
                          {med.duracao && (
                            <View style={styles.metaPill}>
                              <Ionicons name="hourglass-outline" size={11} color={COLORS.textSecondary} />
                              <Text style={styles.metaText}>{med.duracao}</Text>
                            </View>
                          )}
                        </View>
                      )}
                    </View>
                    <Ionicons
                      name={isExpanded ? 'chevron-up' : 'chevron-down'}
                      size={18}
                      color={COLORS.textLight}
                    />
                  </TouchableOpacity>

                  {isExpanded && (
                    <View style={styles.diaExpanded}>
                      <View style={styles.referenciaBox}>
                        <Ionicons name="book-outline" size={14} color={COR_DANIEL} />
                        <Text style={styles.referenciaText}>{med.referencia}</Text>
                      </View>
                      <Text style={styles.diaDescricao}>{med.descricao}</Text>

                      <TouchableOpacity
                        style={[styles.marcarButton, completo && styles.marcarButtonCompleto]}
                        onPress={() => toggleJejumDia(key)}
                        activeOpacity={0.8}
                      >
                        <Ionicons
                          name={completo ? 'close-circle' : 'checkmark-circle'}
                          size={20}
                          color={completo ? '#E53935' : '#FFF'}
                        />
                        <Text style={[styles.marcarText, completo && styles.marcarTextCompleto]}>
                          {completo ? 'Desmarcar dia' : 'Marcar como concluído'}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              );
            })}
          </View>
        ))}

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
  headerTitle: { fontSize: 17, ...FONTS.bold, color: COLORS.text },
  scrollContent: { paddingBottom: 40 },
  bannerArea: {
    paddingVertical: 32, paddingHorizontal: 20,
    alignItems: 'center', backgroundColor: COR_DANIEL,
  },
  bannerIconCircle: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center', justifyContent: 'center', marginBottom: 12,
  },
  bannerTitulo: {
    color: '#FFF', fontSize: 28, ...FONTS.extrabold, textAlign: 'center',
  },
  bannerSubtitulo: {
    color: '#FFF', fontSize: 18, ...FONTS.bold, marginTop: 2,
  },
  bannerDescricao: {
    color: 'rgba(255,255,255,0.8)', fontSize: 14, marginTop: 6,
  },
  progressCard: {
    margin: 16, padding: 18,
    backgroundColor: COLORS.surface, borderRadius: 16, ...SHADOWS.small,
  },
  progressHeader: {
    flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12,
  },
  progressTitle: { fontSize: 15, ...FONTS.bold, color: COLORS.text, flex: 1 },
  progressCount: { fontSize: 15, ...FONTS.bold, color: COR_DANIEL },
  progressBar: {
    height: 8, backgroundColor: COLORS.borderLight, borderRadius: 4, overflow: 'hidden',
  },
  progressFill: {
    height: '100%', backgroundColor: COR_DANIEL, borderRadius: 4,
  },
  progressPercent: {
    fontSize: 12, color: COLORS.textLight, ...FONTS.medium, marginTop: 6, textAlign: 'right',
  },
  semanaHeader: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    paddingHorizontal: 20, marginTop: 20, marginBottom: 10,
  },
  semanaTitulo: { fontSize: 17, ...FONTS.bold, color: COLORS.text },
  semanaSubtitulo: { fontSize: 13, color: COLORS.textLight, ...FONTS.medium },
  diaCard: {
    marginHorizontal: 16, marginBottom: 8,
    backgroundColor: COLORS.surface, borderRadius: 14,
    borderWidth: 1, borderColor: COLORS.borderLight, ...SHADOWS.small,
    overflow: 'hidden',
  },
  diaCardCompleto: {
    borderColor: COR_DANIEL + '40',
    backgroundColor: COR_DANIEL_FUNDO,
  },
  diaHeader: {
    flexDirection: 'row', alignItems: 'center', padding: 14,
  },
  diaNumero: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: COLORS.borderLight,
    alignItems: 'center', justifyContent: 'center',
  },
  diaNumeroCompleto: {
    backgroundColor: COR_DANIEL,
  },
  diaNumeroText: {
    fontSize: 15, ...FONTS.bold, color: COLORS.textSecondary,
  },
  diaContent: { flex: 1, marginLeft: 12 },
  diaSalmo: { fontSize: 11, color: COR_DANIEL, ...FONTS.bold, textTransform: 'uppercase' },
  diaTitulo: { fontSize: 15, ...FONTS.bold, color: COLORS.text, marginTop: 1 },
  metaRow: {
    flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 6, flexWrap: 'wrap',
  },
  metaPill: {
    flexDirection: 'row', alignItems: 'center', gap: 3,
    paddingHorizontal: 7, paddingVertical: 2, borderRadius: 6,
    backgroundColor: COLORS.borderLight,
  },
  metaText: { fontSize: 11, ...FONTS.semibold, color: COLORS.textSecondary },
  diaExpanded: {
    paddingHorizontal: 14, paddingBottom: 14,
    borderTopWidth: 1, borderTopColor: COLORS.borderLight,
  },
  referenciaBox: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: COR_DANIEL + '15', paddingHorizontal: 12,
    paddingVertical: 6, borderRadius: 8, alignSelf: 'flex-start',
    marginTop: 12, marginBottom: 10,
  },
  referenciaText: { fontSize: 12, ...FONTS.bold, color: COR_DANIEL },
  diaDescricao: {
    fontSize: 15, color: COLORS.textSecondary, lineHeight: 24, fontStyle: 'italic',
  },
  marcarButton: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, marginTop: 14, paddingVertical: 12, borderRadius: 12,
    backgroundColor: COR_DANIEL,
  },
  marcarButtonCompleto: {
    backgroundColor: COLORS.surface, borderWidth: 1, borderColor: '#E53935',
  },
  marcarText: { fontSize: 14, ...FONTS.bold, color: '#FFF' },
  marcarTextCompleto: { color: '#E53935' },
  iniciarButton: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 10, marginHorizontal: 16, marginTop: 4, marginBottom: 8,
    paddingVertical: 16, borderRadius: 14, backgroundColor: COR_DANIEL,
    shadowColor: COR_DANIEL, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 8, elevation: 6,
  },
  iniciarButtonAtivo: { backgroundColor: '#388E3C' },
  iniciarButtonText: { fontSize: 17, ...FONTS.bold, color: '#FFF' },
});
