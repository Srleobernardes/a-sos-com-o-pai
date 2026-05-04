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
import { CAUSAS_JEJUM, REFEICOES, ORACOES_POR_REFEICAO } from '../data/jejumNormal';

const COR = '#1E3A5F';

const PERIODO_ICONES = {
  'Despertar': 'sunny',
  'Manhã': 'partly-sunny',
  'Meio da Manhã': 'cafe',
  'Antes do Almoço': 'leaf',
  'Meio-Dia': 'sunny',
  'Depois do Almoco': 'cloudy',
  'Início da Noite': 'moon',
  'Noite': 'moon',
  'Encerramento': 'checkmark-done-circle',
};

export default function JejumNormalScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { startJejumNormal, jejumAtivo } = useApp();
  const [causaSelecionada, setCausaSelecionada] = useState(null);
  const [refeicaoSelecionada, setRefeicaoSelecionada] = useState(null);
  const [expandedOracao, setExpandedOracao] = useState(null);

  const isEsteJejumAtivo = jejumAtivo?.tipo === 'normal';

  const confirmarInicioJejum = (causaId, refeicaoId) => {
    const doStart = () => {
      startJejumNormal(causaId, refeicaoId);
      navigation.navigate('JejumMain');
    };
    if (!jejumAtivo || isEsteJejumAtivo) {
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

  const etapa = !causaSelecionada ? 1 : !refeicaoSelecionada ? 2 : 3;

  const voltarEtapa = () => {
    if (etapa === 3) {
      setRefeicaoSelecionada(null);
      setExpandedOracao(null);
    } else if (etapa === 2) {
      setCausaSelecionada(null);
    }
  };

  const causa = CAUSAS_JEJUM.find((c) => c.id === causaSelecionada);
  const refeicao = REFEICOES.find((r) => r.id === refeicaoSelecionada);
  const oracoes = refeicaoSelecionada ? ORACOES_POR_REFEICAO[refeicaoSelecionada] : [];

  const etapaTitulos = ['Escolha sua causa', 'Escolha a refeição', 'Orações do Jejum'];
  const headerTitulo = etapa === 3 && causa ? causa.titulo : 'Jejum Normal';

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{headerTitulo}</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* ========== ETAPA 1: Escolher Causa ========== */}
        {etapa === 1 && (
          <>
            <View style={styles.bannerArea}>
              <View style={styles.bannerIconCircle}>
                <Ionicons name="restaurant" size={40} color="#FFF" />
              </View>
              <Text style={styles.bannerTitulo}>Jejum Normal</Text>
              <Text style={styles.bannerSubtitulo}>Escolha uma causa e dedique uma refeição em oração</Text>
            </View>

            <View style={styles.card}>
              <View style={styles.sectionHeader}>
                <Ionicons name="information-circle" size={20} color={COR} />
                <Text style={styles.sectionTitle}>Como funciona</Text>
              </View>
              <Text style={styles.bodyText}>
                O jejum normal é a prática de substituir uma refeição do dia por um momento de oração e busca a Deus. Escolha a causa pela qual deseja interceder, selecione a refeição que vai pular, e siga as orações guiadas no horário correspondente.
              </Text>
            </View>

            {/* Steps info */}
            <View style={styles.card}>
              <View style={styles.sectionHeader}>
                <Ionicons name="list" size={20} color={COR} />
                <Text style={styles.sectionTitle}>3 Passos</Text>
              </View>
              <View style={styles.passoRow}>
                <View style={styles.passoNumero}><Text style={styles.passoNumeroText}>1</Text></View>
                <Text style={styles.passoText}>Escolha a causa pela qual vai orar</Text>
              </View>
              <View style={styles.passoRow}>
                <View style={styles.passoNumero}><Text style={styles.passoNumeroText}>2</Text></View>
                <Text style={styles.passoText}>Selecione a refeição que vai substituir</Text>
              </View>
              <View style={styles.passoRow}>
                <View style={styles.passoNumero}><Text style={styles.passoNumeroText}>3</Text></View>
                <Text style={styles.passoText}>Siga as orações guiadas no horário</Text>
              </View>
            </View>

            <View style={styles.sectionHeaderFull}>
              <Ionicons name="heart" size={22} color={COR} />
              <Text style={styles.sectionTitleFull}>Qual é a sua causa?</Text>
            </View>

            {CAUSAS_JEJUM.map((c) => (
              <TouchableOpacity
                key={c.id}
                style={styles.causaCard}
                onPress={() => setCausaSelecionada(c.id)}
                activeOpacity={0.8}
              >
                <View style={[styles.causaIconCircle, { backgroundColor: c.cor + '18' }]}>
                  <Ionicons name={c.icone} size={24} color={c.cor} />
                </View>
                <View style={styles.causaContent}>
                  <Text style={styles.causaTitulo}>{c.titulo}</Text>
                  <Text style={styles.causaDescricao} numberOfLines={2}>{c.descricao}</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={COLORS.textLight} />
              </TouchableOpacity>
            ))}
          </>
        )}

        {/* ========== ETAPA 2: Escolher Refeicao ========== */}
        {etapa === 2 && causa && (
          <>
            <View style={[styles.bannerArea, { backgroundColor: causa.cor }]}>
              <View style={styles.bannerIconCircle}>
                <Ionicons name={causa.icone} size={40} color="#FFF" />
              </View>
              <Text style={styles.bannerTitulo}>{causa.titulo}</Text>
              <Text style={styles.bannerSubtitulo}>{causa.descricao}</Text>
            </View>

            <TouchableOpacity style={styles.trocarLink} onPress={voltarEtapa} activeOpacity={0.7}>
              <Ionicons name="chevron-back" size={16} color={COR} />
              <Text style={styles.trocarLinkText}>Trocar causa</Text>
            </TouchableOpacity>

            <View style={styles.card}>
              <View style={styles.sectionHeader}>
                <Ionicons name="restaurant-outline" size={20} color={COR} />
                <Text style={styles.sectionTitle}>Qual refeição vai pular?</Text>
              </View>
              <Text style={styles.bodyText}>
                Escolha a refeição que você vai substituir por um momento de oração e busca a Deus pela sua causa.
              </Text>
            </View>

            {REFEICOES.map((ref) => (
              <TouchableOpacity
                key={ref.id}
                style={styles.refeicaoCard}
                onPress={() => {
                  setRefeicaoSelecionada(ref.id);
                  confirmarInicioJejum(causaSelecionada, ref.id);
                }}
                activeOpacity={0.8}
              >
                <View style={[styles.refeicaoIconCircle, { backgroundColor: causa.cor + '15' }]}>
                  <Ionicons name={ref.icone} size={28} color={causa.cor} />
                </View>
                <View style={styles.refeicaoContent}>
                  <Text style={styles.refeicaoTitulo}>{ref.titulo}</Text>
                  <View style={styles.refeicaoHorarioRow}>
                    <Ionicons name="time-outline" size={14} color={COLORS.textLight} />
                    <Text style={styles.refeicaoHorario}>{ref.horario}</Text>
                  </View>
                  <Text style={styles.refeicaoDescricao}>{ref.descricao}</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={COLORS.textLight} />
              </TouchableOpacity>
            ))}
          </>
        )}

        {/* ========== ETAPA 3: Oracoes ========== */}
        {etapa === 3 && causa && refeicao && (
          <>
            <View style={[styles.bannerArea, { backgroundColor: causa.cor }]}>
              <View style={styles.bannerIconCircle}>
                <Ionicons name={causa.icone} size={40} color="#FFF" />
              </View>
              <Text style={styles.bannerTitulo}>{causa.titulo}</Text>
              <Text style={styles.bannerSubtitulo}>
                {refeicao.titulo} • {refeicao.horario}
              </Text>
            </View>

            <TouchableOpacity style={styles.trocarLink} onPress={voltarEtapa} activeOpacity={0.7}>
              <Ionicons name="chevron-back" size={16} color={COR} />
              <Text style={styles.trocarLinkText}>Trocar refeição</Text>
            </TouchableOpacity>

            {/* Info card */}
            <View style={styles.card}>
              <View style={styles.sectionHeader}>
                <Ionicons name="flame" size={20} color={causa.cor} />
                <Text style={styles.sectionTitle}>Seu jejum de hoje</Text>
              </View>
              <View style={styles.infoRow}>
                <Ionicons name="heart" size={16} color={COLORS.textLight} />
                <Text style={styles.bodyText}>Causa: {causa.titulo}</Text>
              </View>
              <View style={[styles.infoRow, { marginTop: 8 }]}>
                <Ionicons name="restaurant-outline" size={16} color={COLORS.textLight} />
                <Text style={styles.bodyText}>Refeição: {refeicao.titulo} ({refeicao.horario})</Text>
              </View>
              <View style={[styles.infoRow, { marginTop: 8 }]}>
                <Ionicons name="hand-left" size={16} color={COLORS.textLight} />
                <Text style={styles.bodyText}>{oracoes.length} momentos de oração</Text>
              </View>
            </View>

            {/* Prayers */}
            <View style={styles.sectionHeaderFull}>
              <Ionicons name="hand-left" size={22} color={causa.cor} />
              <Text style={styles.sectionTitleFull}>Orações Guiadas</Text>
            </View>
            <Text style={styles.oracoesSubtitle}>
              Siga estas orações no horário indicado ao longo do jejum
            </Text>

            {oracoes.map((oracao, index) => {
              const isExpanded = expandedOracao === index;

              return (
                <TouchableOpacity
                  key={index}
                  style={[styles.oracaoCard, isExpanded && { borderColor: causa.cor + '50' }]}
                  onPress={() => setExpandedOracao(isExpanded ? null : index)}
                  activeOpacity={0.8}
                >
                  <View style={styles.oracaoHeader}>
                    <View style={[styles.oracaoIconCircle, { backgroundColor: causa.cor + '15' }]}>
                      <Ionicons
                        name={PERIODO_ICONES[oracao.periodo] || 'time'}
                        size={20}
                        color={causa.cor}
                      />
                    </View>
                    <View style={styles.oracaoInfo}>
                      <Text style={styles.oracaoPeriodo}>{oracao.horario} - {oracao.periodo}</Text>
                      <Text style={styles.oracaoTitulo}>{oracao.titulo}</Text>
                    </View>
                    <Ionicons
                      name={isExpanded ? 'chevron-up' : 'chevron-down'}
                      size={18}
                      color={COLORS.textLight}
                    />
                  </View>

                  {isExpanded && (
                    <View style={styles.oracaoContent}>
                      <View style={[styles.referenciaBox, { backgroundColor: causa.cor + '12' }]}>
                        <Ionicons name="book-outline" size={13} color={causa.cor} />
                        <Text style={[styles.referenciaText, { color: causa.cor }]}>{oracao.referencia}</Text>
                      </View>
                      <Text style={styles.oracaoTexto}>{oracao.texto}</Text>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}

            {/* Restart button */}
            <TouchableOpacity
              style={styles.reiniciarButton}
              onPress={() => {
                setCausaSelecionada(null);
                setRefeicaoSelecionada(null);
                setExpandedOracao(null);
              }}
              activeOpacity={0.8}
            >
              <Ionicons name="refresh" size={18} color={COR} />
              <Text style={styles.reiniciarText}>Escolher outra causa ou refeição</Text>
            </TouchableOpacity>
          </>
        )}

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

  /* Banner */
  bannerArea: {
    paddingVertical: 32, paddingHorizontal: 20,
    alignItems: 'center', backgroundColor: COR,
  },
  bannerIconCircle: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center', justifyContent: 'center', marginBottom: 12,
  },
  bannerTitulo: { color: '#FFF', fontSize: 24, ...FONTS.extrabold, textAlign: 'center' },
  bannerSubtitulo: { color: 'rgba(255,255,255,0.85)', fontSize: 14, marginTop: 6, textAlign: 'center', lineHeight: 20, paddingHorizontal: 10 },

  /* Card */
  card: {
    margin: 16, marginBottom: 0, padding: 20,
    backgroundColor: COLORS.surface, borderRadius: 16, ...SHADOWS.small,
  },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  sectionTitle: { fontSize: 16, ...FONTS.bold, color: COLORS.text },
  bodyText: { fontSize: 14, color: COLORS.textSecondary, lineHeight: 22 },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },

  /* Steps */
  passoRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  passoNumero: {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: COR, alignItems: 'center', justifyContent: 'center',
  },
  passoNumeroText: { color: '#FFF', fontSize: 13, ...FONTS.bold },
  passoText: { fontSize: 14, color: COLORS.textSecondary, flex: 1, lineHeight: 20 },

  /* Section header full width */
  sectionHeaderFull: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    paddingHorizontal: 20, marginTop: 24, marginBottom: 12,
  },
  sectionTitleFull: { fontSize: 20, ...FONTS.bold, color: COLORS.text },

  /* Causa cards */
  causaCard: {
    flexDirection: 'row', alignItems: 'center',
    marginHorizontal: 16, marginBottom: 10, padding: 14,
    backgroundColor: COLORS.surface, borderRadius: 14,
    borderWidth: 1, borderColor: COLORS.borderLight, ...SHADOWS.small,
  },
  causaIconCircle: {
    width: 48, height: 48, borderRadius: 14,
    alignItems: 'center', justifyContent: 'center',
  },
  causaContent: { flex: 1, marginLeft: 12 },
  causaTitulo: { fontSize: 15, ...FONTS.bold, color: COLORS.text },
  causaDescricao: { fontSize: 12, color: COLORS.textSecondary, marginTop: 2, lineHeight: 17 },

  /* Refeicao cards */
  refeicaoCard: {
    flexDirection: 'row', alignItems: 'center',
    marginHorizontal: 16, marginBottom: 12, padding: 16,
    backgroundColor: COLORS.surface, borderRadius: 16,
    borderWidth: 1.5, borderColor: COLORS.borderLight, ...SHADOWS.medium,
  },
  refeicaoIconCircle: {
    width: 56, height: 56, borderRadius: 16,
    alignItems: 'center', justifyContent: 'center',
  },
  refeicaoContent: { flex: 1, marginLeft: 14 },
  refeicaoTitulo: { fontSize: 17, ...FONTS.bold, color: COLORS.text },
  refeicaoHorarioRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 3 },
  refeicaoHorario: { fontSize: 13, color: COLORS.textLight, ...FONTS.semibold },
  refeicaoDescricao: { fontSize: 12, color: COLORS.textSecondary, marginTop: 4, lineHeight: 17 },

  /* Oracoes */
  oracoesSubtitle: {
    fontSize: 13, color: COLORS.textLight, paddingHorizontal: 20,
    marginTop: -6, marginBottom: 14,
  },
  oracaoCard: {
    marginHorizontal: 16, marginBottom: 10, padding: 14,
    backgroundColor: COLORS.surface, borderRadius: 14,
    borderWidth: 1, borderColor: COLORS.borderLight, ...SHADOWS.small,
  },
  oracaoHeader: { flexDirection: 'row', alignItems: 'center' },
  oracaoIconCircle: {
    width: 40, height: 40, borderRadius: 12,
    alignItems: 'center', justifyContent: 'center',
  },
  oracaoInfo: { flex: 1, marginLeft: 10 },
  oracaoPeriodo: { fontSize: 11, color: COLORS.textLight, ...FONTS.semibold },
  oracaoTitulo: { fontSize: 14, ...FONTS.bold, color: COLORS.text, marginTop: 1 },
  oracaoContent: { marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: COLORS.borderLight },
  referenciaBox: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8,
    alignSelf: 'flex-start', marginBottom: 10,
  },
  referenciaText: { fontSize: 11, ...FONTS.bold },
  oracaoTexto: { fontSize: 14, color: COLORS.textSecondary, lineHeight: 23, fontStyle: 'italic' },

  /* Trocar inline link */
  trocarLink: {
    flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start',
    marginHorizontal: 16, marginTop: 12, paddingHorizontal: 12, paddingVertical: 8,
    borderRadius: 8, backgroundColor: COR + '12',
  },
  trocarLinkText: { fontSize: 13, ...FONTS.semibold, color: COR, marginLeft: 4 },

  /* Reiniciar */
  reiniciarButton: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, marginHorizontal: 16, marginTop: 20, paddingVertical: 14,
    borderRadius: 14, backgroundColor: COLORS.surface,
    borderWidth: 1.5, borderColor: COR + '30',
  },
  reiniciarText: { fontSize: 14, ...FONTS.semibold, color: COR },
  iniciarButton: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 10, marginHorizontal: 16, marginTop: 20, marginBottom: 4,
    paddingVertical: 16, borderRadius: 14, backgroundColor: COR,
    shadowColor: COR, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 8, elevation: 6,
  },
  iniciarButtonAtivo: { backgroundColor: '#388E3C' },
  iniciarButtonText: { fontSize: 17, ...FONTS.bold, color: '#FFF' },
});
