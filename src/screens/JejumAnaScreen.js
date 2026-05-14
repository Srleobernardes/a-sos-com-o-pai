import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, SHADOWS, FONTS } from '../theme/colors';
import { useApp } from '../context/AppContext';
import { JEJUM_ANA } from '../data/jejumAna';

const COR = JEJUM_ANA.cor;

const PERIODO_ICONES = {
  'Início': 'sunny-outline',
  'Meio-Dia': 'sunny',
  'Tarde': 'cloudy',
  'Noite': 'moon',
  'Encerramento': 'checkmark-done-circle',
};

export default function JejumAnaScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { jejumDias, toggleJejumDia, startJejum, jejumAtivo } = useApp();
  const [expandedDia, setExpandedDia] = useState(null);
  const [expandedOracao, setExpandedOracao] = useState(null);

  const totalDias = JEJUM_ANA.dias.length;
  const diasCompletos = Array.from({ length: totalDias }, (_, i) => jejumDias[`dia_${i + 1}`]).filter(Boolean).length;
  const isEsteJejumAtivo = jejumAtivo?.tipo === 'ana';

  const handleIniciarJejum = () => {
    if (isEsteJejumAtivo) {
      navigation.navigate('JejumMain');
      return;
    }
    const doStart = () => {
      startJejum('ana');
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
        <Text style={styles.headerTitle}>Jejum de Ana</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Banner */}
        <View style={styles.bannerArea}>
          <View style={styles.bannerIconCircle}>
            <Ionicons name="heart-circle" size={40} color="#FFF" />
          </View>
          <Text style={styles.bannerTitulo}>7 Dias</Text>
          <Text style={styles.bannerSubtitulo}>Jejum de Ana</Text>
          <Text style={styles.bannerDescricao}>Orações Diárias</Text>
        </View>

        {/* Descrição */}
        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <Ionicons name="information-circle" size={20} color={COR} />
            <Text style={styles.sectionTitle}>Sobre este jejum</Text>
          </View>
          <Text style={styles.bodyText}>{JEJUM_ANA.descricao}</Text>
        </View>

        {/* Benefícios */}
        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <Ionicons name="star" size={20} color={COR} />
            <Text style={styles.sectionTitle}>No que ajuda</Text>
          </View>
          {JEJUM_ANA.beneficios.map((b, i) => (
            <View key={i} style={styles.beneficioRow}>
              <Ionicons name="checkmark-circle" size={18} color={COLORS.success} />
              <Text style={styles.beneficioText}>{b}</Text>
            </View>
          ))}
        </View>

        {/* Progresso */}
        <View style={styles.card}>
          <View style={styles.progressHeader}>
            <Ionicons name="flame" size={20} color={COR} />
            <Text style={styles.sectionTitle}>Seu progresso</Text>
            <Text style={styles.progressCount}>{Math.min(diasCompletos, totalDias)}/{totalDias}</Text>
          </View>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${Math.min((diasCompletos / totalDias) * 100, 100)}%` }]} />
          </View>
          <Text style={styles.progressLabel}>{Math.round(Math.min((diasCompletos / totalDias) * 100, 100))}% concluído</Text>
        </View>

        {/* Botão Iniciar */}
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
            {isEsteJejumAtivo ? 'Jejum em Andamento' : 'Iniciar Jejum de Ana'}
          </Text>
        </TouchableOpacity>

        {/* Cabeçalho dos dias */}
        <View style={styles.semanaHeader}>
          <View style={styles.semanaHeaderLeft}>
            <Ionicons name="calendar" size={22} color={COR} />
            <Text style={styles.semanaTitle}>Semana 1</Text>
          </View>
          <View style={styles.semanaTag}>
            <Text style={styles.semanaTagText}>Dias 1-7</Text>
          </View>
        </View>

        {JEJUM_ANA.dias.map((diaData) => {
          const key = `dia_${diaData.dia}`;
          const completo = jejumDias[key];
          const isExpanded = expandedDia === diaData.dia;

          return (
            <View key={diaData.dia} style={[styles.diaCard, isExpanded && styles.diaCardExpanded]}>
              {/* Cabeçalho do dia */}
              <TouchableOpacity
                style={styles.diaHeader}
                onPress={() => {
                  setExpandedDia(isExpanded ? null : diaData.dia);
                  setExpandedOracao(null);
                }}
                activeOpacity={0.8}
              >
                <View style={[styles.diaNumero, completo && styles.diaNumeroCompleto]}>
                  {completo ? (
                    <Ionicons name="checkmark" size={20} color="#FFF" />
                  ) : (
                    <Text style={styles.diaNumeroText}>{diaData.dia}</Text>
                  )}
                </View>
                <View style={styles.diaContent}>
                  <Text style={styles.diaDiaLabel}>DIA {diaData.dia}</Text>
                  <Text style={styles.diaTitulo}>{diaData.titulo}</Text>
                  <View style={styles.diaMetaRow}>
                    <View style={styles.diaMetaBadge}>
                      <Ionicons name="time-outline" size={11} color={COR} />
                      <Text style={styles.diaMetaText}>{diaData.horarioPrincipal}</Text>
                    </View>
                    <View style={styles.diaMetaBadge}>
                      <Ionicons name="hourglass-outline" size={11} color={COR} />
                      <Text style={styles.diaMetaText}>{diaData.duracao}</Text>
                    </View>
                  </View>
                </View>
                <Ionicons
                  name={isExpanded ? 'chevron-up' : 'chevron-down'}
                  size={20}
                  color={COLORS.textLight}
                />
              </TouchableOpacity>

              {/* Conteúdo expandido */}
              {isExpanded && (
                <View style={styles.diaExpanded}>
                  <Text style={styles.diaDescricao}>{diaData.descricao}</Text>

                  <Text style={styles.oracoesLabel}>
                    {diaData.oracoes.length} momentos de oração
                  </Text>

                  {diaData.oracoes.map((oracao, idx) => {
                    const oKey = `${diaData.dia}-${idx}`;
                    const isOracaoExpanded = expandedOracao === oKey;

                    return (
                      <TouchableOpacity
                        key={idx}
                        style={[styles.oracaoCard, isOracaoExpanded && styles.oracaoCardExpanded]}
                        onPress={() => setExpandedOracao(isOracaoExpanded ? null : oKey)}
                        activeOpacity={0.8}
                      >
                        <View style={styles.oracaoHeader}>
                          <View style={styles.oracaoIconCircle}>
                            <Ionicons
                              name={PERIODO_ICONES[oracao.periodo] || 'time'}
                              size={18}
                              color={COR}
                            />
                          </View>
                          <View style={styles.oracaoInfo}>
                            <Text style={styles.oracaoPeriodo}>{oracao.horario} · {oracao.periodo}</Text>
                            <Text style={styles.oracaoTitulo}>{oracao.titulo}</Text>
                          </View>
                          <Ionicons
                            name={isOracaoExpanded ? 'chevron-up' : 'chevron-down'}
                            size={16}
                            color={COLORS.textLight}
                          />
                        </View>

                        {isOracaoExpanded && (
                          <View style={styles.oracaoContent}>
                            <View style={styles.referenciaBox}>
                              <Ionicons name="book-outline" size={13} color={COR} />
                              <Text style={styles.referenciaText}>{oracao.referencia}</Text>
                            </View>
                            <Text style={styles.oracaoTexto}>{oracao.texto}</Text>
                          </View>
                        )}
                      </TouchableOpacity>
                    );
                  })}

                  {/* Botão marcar dia */}
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
                      {completo ? 'Desmarcar dia' : 'Marcar dia como concluído'}
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
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
  headerTitle: { fontSize: 17, ...FONTS.bold, color: COLORS.text },
  scrollContent: { paddingBottom: 40 },
  bannerArea: {
    paddingVertical: 32, paddingHorizontal: 20,
    alignItems: 'center', backgroundColor: COR,
  },
  bannerIconCircle: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center', justifyContent: 'center', marginBottom: 12,
  },
  bannerTitulo: { color: '#FFF', fontSize: 28, ...FONTS.extrabold },
  bannerSubtitulo: { color: '#FFF', fontSize: 18, ...FONTS.bold, marginTop: 2 },
  bannerDescricao: { color: 'rgba(255,255,255,0.85)', fontSize: 13, marginTop: 6, textAlign: 'center' },
  card: {
    margin: 16, marginBottom: 0, padding: 20,
    backgroundColor: COLORS.surface, borderRadius: 16, ...SHADOWS.small,
  },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  sectionTitle: { fontSize: 16, ...FONTS.bold, color: COLORS.text },
  bodyText: { fontSize: 14, color: COLORS.textSecondary, lineHeight: 22 },
  beneficioRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: 10 },
  beneficioText: { fontSize: 14, color: COLORS.textSecondary, lineHeight: 20, flex: 1 },
  progressHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  progressCount: { fontSize: 15, ...FONTS.bold, color: COR, marginLeft: 'auto' },
  progressBar: { height: 8, backgroundColor: COLORS.borderLight, borderRadius: 4, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: COR, borderRadius: 4 },
  progressLabel: { fontSize: 12, color: COLORS.textLight, marginTop: 6, textAlign: 'right' },
  iniciarButton: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 10, marginHorizontal: 16, marginTop: 20, marginBottom: 4,
    paddingVertical: 16, borderRadius: 14, backgroundColor: COR, ...SHADOWS.medium,
  },
  iniciarButtonAtivo: { backgroundColor: COLORS.success },
  iniciarButtonText: { fontSize: 17, ...FONTS.bold, color: '#FFF' },
  semanaHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, marginTop: 24, marginBottom: 12,
  },
  semanaHeaderLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  semanaTitle: { fontSize: 20, ...FONTS.bold, color: COLORS.text },
  semanaTag: {
    backgroundColor: COR + '20', paddingHorizontal: 10, paddingVertical: 4,
    borderRadius: 20,
  },
  semanaTagText: { fontSize: 12, ...FONTS.bold, color: COR },
  diaCard: {
    marginHorizontal: 16, marginBottom: 12,
    backgroundColor: COLORS.surface, borderRadius: 16,
    borderWidth: 1, borderColor: COLORS.borderLight, ...SHADOWS.small,
    overflow: 'hidden',
  },
  diaCardExpanded: { borderColor: COR + '50' },
  diaHeader: { flexDirection: 'row', alignItems: 'center', padding: 16 },
  diaNumero: {
    width: 48, height: 48, borderRadius: 24,
    backgroundColor: COR + '15', alignItems: 'center', justifyContent: 'center',
  },
  diaNumeroCompleto: { backgroundColor: COR },
  diaNumeroText: { fontSize: 18, ...FONTS.bold, color: COR },
  diaContent: { flex: 1, marginLeft: 14 },
  diaDiaLabel: { fontSize: 11, color: COR, ...FONTS.bold, textTransform: 'uppercase', letterSpacing: 0.5 },
  diaTitulo: { fontSize: 16, ...FONTS.bold, color: COLORS.text, marginTop: 1, marginBottom: 6 },
  diaMetaRow: { flexDirection: 'row', gap: 6 },
  diaMetaBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: COR + '15', paddingHorizontal: 8, paddingVertical: 3,
    borderRadius: 20,
  },
  diaMetaText: { fontSize: 10, color: COR, ...FONTS.semibold },
  diaExpanded: { paddingHorizontal: 16, paddingBottom: 16, borderTopWidth: 1, borderTopColor: COLORS.borderLight },
  diaDescricao: { fontSize: 14, color: COLORS.textSecondary, lineHeight: 22, marginTop: 14, marginBottom: 14 },
  oracoesLabel: { fontSize: 13, color: COLORS.textLight, ...FONTS.medium, marginBottom: 10 },
  oracaoCard: {
    marginBottom: 8, padding: 12,
    backgroundColor: COLORS.background, borderRadius: 12,
    borderWidth: 1, borderColor: COLORS.borderLight,
  },
  oracaoCardExpanded: { borderColor: COR + '40' },
  oracaoHeader: { flexDirection: 'row', alignItems: 'center' },
  oracaoIconCircle: {
    width: 36, height: 36, borderRadius: 10,
    backgroundColor: COR + '15', alignItems: 'center', justifyContent: 'center',
  },
  oracaoInfo: { flex: 1, marginLeft: 10 },
  oracaoPeriodo: { fontSize: 11, color: COLORS.textLight, ...FONTS.semibold },
  oracaoTitulo: { fontSize: 14, ...FONTS.bold, color: COLORS.text, marginTop: 1 },
  oracaoContent: { marginTop: 10, paddingTop: 10, borderTopWidth: 1, borderTopColor: COLORS.borderLight },
  referenciaBox: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: COR + '12', paddingHorizontal: 10,
    paddingVertical: 5, borderRadius: 8, alignSelf: 'flex-start', marginBottom: 10,
  },
  referenciaText: { fontSize: 11, ...FONTS.bold, color: COR },
  oracaoTexto: { fontSize: 14, color: COLORS.textSecondary, lineHeight: 23, fontStyle: 'italic' },
  marcarButton: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, marginTop: 14, paddingVertical: 13, borderRadius: 12, backgroundColor: COR,
  },
  marcarButtonCompleto: { backgroundColor: COLORS.surface, borderWidth: 1, borderColor: '#E53935' },
  marcarText: { fontSize: 14, ...FONTS.bold, color: '#FFF' },
  marcarTextCompleto: { color: '#E53935' },
});
