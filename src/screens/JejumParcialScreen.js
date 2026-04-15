import React, { useState } from 'react';
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
import { TIPOS_PARCIAL, JEJUM_PARCIAL_DIAS } from '../data/jejumParcial';

const COR = '#2E7D32';
const COR_FUNDO = '#E8F5E9';

const PERIODO_ICONES = {
  Manha: 'sunny',
  'Meio-Dia': 'partly-sunny',
  Noite: 'moon',
  Encerramento: 'checkmark-done-circle',
};

export default function JejumParcialScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { jejumDias, toggleJejumDia } = useApp();
  const [tipoSelecionado, setTipoSelecionado] = useState(null);
  const [expandedDia, setExpandedDia] = useState(null);
  const [expandedOracao, setExpandedOracao] = useState(null);
  const [showTroca, setShowTroca] = useState(false);

  const diasCompletos = [1, 2, 3].filter((d) => jejumDias[`dia_${d}`]).length;
  const tipo = TIPOS_PARCIAL.find((t) => t.id === tipoSelecionado);

  const renderEscolherTipo = () => (
    <View style={styles.tipoSelectArea}>
      <Text style={styles.tipoSelectTitulo}>Do que voce vai abrir mao?</Text>
      <Text style={styles.tipoSelectSubtitulo}>
        Escolha o que abster durante os 3 dias deste jejum parcial
      </Text>

      {TIPOS_PARCIAL.map((t) => (
        <TouchableOpacity
          key={t.id}
          style={styles.tipoCard}
          onPress={() => {
            setTipoSelecionado(t.id);
            setShowTroca(false);
          }}
          activeOpacity={0.85}
        >
          <View style={[styles.tipoIconBox, { backgroundColor: t.cor }]}>
            <Ionicons name={t.icone} size={26} color="#FFF" />
          </View>
          <View style={styles.tipoContent}>
            <Text style={styles.tipoTitulo}>{t.titulo}</Text>
            <Text style={styles.tipoDescricao} numberOfLines={2}>{t.descricao}</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={COLORS.textLight} />
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderDias = () => (
    <>
      {/* Tipo escolhido */}
      <View style={[styles.tipoEscolhidoCard, { borderLeftColor: tipo.cor }]}>
        <View style={[styles.tipoEscolhidoIcon, { backgroundColor: tipo.cor }]}>
          <Ionicons name={tipo.icone} size={22} color="#FFF" />
        </View>
        <View style={styles.tipoEscolhidoContent}>
          <Text style={styles.tipoEscolhidoLabel}>Voce esta abrindo mao de</Text>
          <Text style={styles.tipoEscolhidoTitulo}>{tipo.titulo}</Text>
        </View>
        <TouchableOpacity
          style={styles.tipoTrocarBtn}
          onPress={() => setShowTroca(true)}
          activeOpacity={0.7}
        >
          <Ionicons name="swap-horizontal" size={16} color={COR} />
          <Text style={styles.tipoTrocarText}>Trocar</Text>
        </TouchableOpacity>
      </View>

      {/* Detalhes do tipo */}
      <View style={styles.detalhesCard}>
        <View style={styles.detalheRow}>
          <Ionicons name="close-circle" size={16} color="#C62828" />
          <Text style={styles.detalheLabel}>Abster:</Text>
          <Text style={styles.detalheText}>{tipo.descricao}</Text>
        </View>
        <View style={styles.detalheRow}>
          <Ionicons name="checkmark-circle" size={16} color={COR} />
          <Text style={styles.detalheLabel}>Permitido:</Text>
          <Text style={styles.detalheText}>{tipo.permitido}</Text>
        </View>
        <View style={[styles.detalheRow, { marginTop: 6 }]}>
          <Ionicons name="book-outline" size={14} color={COLORS.textLight} />
          <Text style={styles.detalheRefText}>Inspirado em {tipo.referencia}</Text>
        </View>
      </View>

      {/* Progresso */}
      <View style={styles.progressCard}>
        <View style={styles.progressHeader}>
          <Ionicons name="flame" size={20} color={COR} />
          <Text style={styles.progressTitle}>Seu progresso</Text>
          <Text style={styles.progressCount}>{diasCompletos}/3</Text>
        </View>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${(diasCompletos / 3) * 100}%` }]} />
        </View>
        <Text style={styles.progressPercent}>{Math.round((diasCompletos / 3) * 100)}% concluido</Text>
      </View>

      {/* Dias */}
      <View style={styles.diasHeader}>
        <Ionicons name="calendar" size={18} color={COR} />
        <Text style={styles.diasTitulo}>Os 3 dias</Text>
      </View>

      {JEJUM_PARCIAL_DIAS.map((dia) => {
        const key = `dia_${dia.dia}`;
        const completo = jejumDias[key];
        const isExpanded = expandedDia === dia.dia;

        return (
          <View key={dia.dia} style={[styles.diaCard, completo && styles.diaCardCompleto]}>
            <TouchableOpacity
              style={styles.diaHeader}
              onPress={() => {
                setExpandedDia(isExpanded ? null : dia.dia);
                setExpandedOracao(null);
              }}
              activeOpacity={0.85}
            >
              <View style={[styles.diaNumero, completo && styles.diaNumeroCompleto]}>
                {completo ? (
                  <Ionicons name="checkmark" size={20} color="#FFF" />
                ) : (
                  <Text style={styles.diaNumeroText}>{dia.dia}</Text>
                )}
              </View>
              <View style={styles.diaContent}>
                <Text style={styles.diaLabel}>Dia {dia.dia}</Text>
                <Text style={styles.diaTitulo}>{dia.titulo}</Text>
                <Text style={styles.diaSubtitulo}>{dia.subtitulo}</Text>
              </View>
              <Ionicons
                name={isExpanded ? 'chevron-up' : 'chevron-down'}
                size={20}
                color={COLORS.textLight}
              />
            </TouchableOpacity>

            {isExpanded && (
              <View style={styles.diaExpanded}>
                {/* Versiculo chave */}
                <View style={styles.versiculoBox}>
                  <View style={styles.versiculoHeader}>
                    <Ionicons name="book" size={14} color={COR} />
                    <Text style={styles.versiculoRef}>{dia.versiculoChave}</Text>
                  </View>
                  <Text style={styles.versiculoText}>"{dia.versiculoTexto}"</Text>
                </View>

                {/* Oracoes */}
                <Text style={styles.oracoesLabel}>Momentos de oracao do dia</Text>
                {dia.oracoes.map((oracao, idx) => {
                  const oracaoKey = `${dia.dia}_${idx}`;
                  const isOracaoExpanded = expandedOracao === oracaoKey;
                  return (
                    <TouchableOpacity
                      key={idx}
                      style={[styles.oracaoCard, isOracaoExpanded && styles.oracaoCardExpanded]}
                      onPress={() => setExpandedOracao(isOracaoExpanded ? null : oracaoKey)}
                      activeOpacity={0.85}
                    >
                      <View style={styles.oracaoHeader}>
                        <View style={[styles.oracaoIconBox, { backgroundColor: COR + '20' }]}>
                          <Ionicons
                            name={PERIODO_ICONES[oracao.periodo] || 'time'}
                            size={18}
                            color={COR}
                          />
                        </View>
                        <View style={styles.oracaoInfo}>
                          <Text style={styles.oracaoPeriodo}>{oracao.periodo}</Text>
                          <Text style={styles.oracaoTitulo}>{oracao.titulo}</Text>
                          <View style={styles.metaRow}>
                            <View style={[styles.metaPill, { backgroundColor: COR + '15' }]}>
                              <Ionicons name="time-outline" size={11} color={COR} />
                              <Text style={[styles.metaText, { color: COR }]}>{oracao.horario}</Text>
                            </View>
                            <View style={styles.metaPill}>
                              <Ionicons name="hourglass-outline" size={11} color={COLORS.textSecondary} />
                              <Text style={styles.metaText}>{oracao.duracao}</Text>
                            </View>
                          </View>
                        </View>
                        <Ionicons
                          name={isOracaoExpanded ? 'chevron-up' : 'chevron-down'}
                          size={18}
                          color={COLORS.textLight}
                        />
                      </View>

                      {isOracaoExpanded && (
                        <View style={styles.oracaoBody}>
                          <View style={styles.refBox}>
                            <Ionicons name="book-outline" size={13} color={COR} />
                            <Text style={styles.refText}>{oracao.referencia}</Text>
                          </View>
                          <Text style={styles.oracaoTexto}>{oracao.texto}</Text>
                        </View>
                      )}
                    </TouchableOpacity>
                  );
                })}

                {/* Marcar dia */}
                <TouchableOpacity
                  style={[styles.marcarButton, completo && styles.marcarButtonCompleto]}
                  onPress={() => toggleJejumDia(key)}
                  activeOpacity={0.85}
                >
                  <Ionicons
                    name={completo ? 'close-circle' : 'checkmark-circle'}
                    size={20}
                    color={completo ? '#E53935' : '#FFF'}
                  />
                  <Text style={[styles.marcarText, completo && styles.marcarTextCompleto]}>
                    {completo ? 'Desmarcar dia' : 'Marcar dia como concluido'}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        );
      })}
    </>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Jejum Parcial</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Banner */}
        <View style={styles.bannerArea}>
          <View style={styles.bannerIconCircle}>
            <Ionicons name="leaf" size={40} color="#FFF" />
          </View>
          <Text style={styles.bannerTitulo}>3 Dias</Text>
          <Text style={styles.bannerSubtitulo}>Jejum Parcial</Text>
          <Text style={styles.bannerDescricao}>Abster-se de algo especifico em consagracao</Text>
        </View>

        {tipo && !showTroca ? renderDias() : renderEscolherTipo()}

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
  bannerTitulo: { color: '#FFF', fontSize: 28, ...FONTS.extrabold, textAlign: 'center' },
  bannerSubtitulo: { color: '#FFF', fontSize: 18, ...FONTS.bold, marginTop: 2 },
  bannerDescricao: { color: 'rgba(255,255,255,0.85)', fontSize: 13, marginTop: 6, textAlign: 'center', paddingHorizontal: 20 },

  // Escolher tipo
  tipoSelectArea: { paddingTop: 24, paddingHorizontal: 16 },
  tipoSelectTitulo: { fontSize: 19, ...FONTS.bold, color: COLORS.text, paddingHorizontal: 4 },
  tipoSelectSubtitulo: {
    fontSize: 13, color: COLORS.textLight, marginTop: 4, marginBottom: 16, paddingHorizontal: 4,
  },
  tipoCard: {
    flexDirection: 'row', alignItems: 'center',
    padding: 14, marginBottom: 10,
    backgroundColor: COLORS.surface, borderRadius: 14,
    borderWidth: 1, borderColor: COLORS.borderLight, ...SHADOWS.small,
  },
  tipoIconBox: {
    width: 48, height: 48, borderRadius: 14,
    alignItems: 'center', justifyContent: 'center',
  },
  tipoContent: { flex: 1, marginLeft: 12 },
  tipoTitulo: { fontSize: 15, ...FONTS.bold, color: COLORS.text },
  tipoDescricao: { fontSize: 12, color: COLORS.textSecondary, marginTop: 2, lineHeight: 17 },

  // Tipo escolhido
  tipoEscolhidoCard: {
    flexDirection: 'row', alignItems: 'center',
    margin: 16, padding: 14, gap: 12,
    backgroundColor: COLORS.surface, borderRadius: 14,
    borderLeftWidth: 4, ...SHADOWS.small,
  },
  tipoEscolhidoIcon: {
    width: 44, height: 44, borderRadius: 12,
    alignItems: 'center', justifyContent: 'center',
  },
  tipoEscolhidoContent: { flex: 1 },
  tipoEscolhidoLabel: { fontSize: 11, color: COLORS.textLight, ...FONTS.medium, textTransform: 'uppercase' },
  tipoEscolhidoTitulo: { fontSize: 16, ...FONTS.bold, color: COLORS.text, marginTop: 2 },
  tipoTrocarBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: 10, paddingVertical: 6,
    backgroundColor: COR_FUNDO, borderRadius: 8,
  },
  tipoTrocarText: { fontSize: 12, ...FONTS.bold, color: COR },

  // Detalhes
  detalhesCard: {
    marginHorizontal: 16, padding: 14,
    backgroundColor: COR_FUNDO, borderRadius: 12,
  },
  detalheRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 6, marginBottom: 6 },
  detalheLabel: { fontSize: 12, ...FONTS.bold, color: COLORS.text },
  detalheText: { flex: 1, fontSize: 12, color: COLORS.textSecondary, lineHeight: 17 },
  detalheRefText: { flex: 1, fontSize: 11, color: COLORS.textLight, ...FONTS.medium, fontStyle: 'italic' },

  // Progresso
  progressCard: {
    margin: 16, padding: 18,
    backgroundColor: COLORS.surface, borderRadius: 16, ...SHADOWS.small,
  },
  progressHeader: {
    flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12,
  },
  progressTitle: { fontSize: 15, ...FONTS.bold, color: COLORS.text, flex: 1 },
  progressCount: { fontSize: 15, ...FONTS.bold, color: COR },
  progressBar: {
    height: 8, backgroundColor: COLORS.borderLight, borderRadius: 4, overflow: 'hidden',
  },
  progressFill: { height: '100%', backgroundColor: COR, borderRadius: 4 },
  progressPercent: {
    fontSize: 12, color: COLORS.textLight, ...FONTS.medium, marginTop: 6, textAlign: 'right',
  },

  // Dias
  diasHeader: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    paddingHorizontal: 20, marginTop: 6, marginBottom: 10,
  },
  diasTitulo: { fontSize: 17, ...FONTS.bold, color: COLORS.text },
  diaCard: {
    marginHorizontal: 16, marginBottom: 10,
    backgroundColor: COLORS.surface, borderRadius: 14,
    borderWidth: 1, borderColor: COLORS.borderLight, ...SHADOWS.small,
    overflow: 'hidden',
  },
  diaCardCompleto: {
    borderColor: COR + '60',
    backgroundColor: COR_FUNDO,
  },
  diaHeader: {
    flexDirection: 'row', alignItems: 'center', padding: 14,
  },
  diaNumero: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: COLORS.borderLight,
    alignItems: 'center', justifyContent: 'center',
  },
  diaNumeroCompleto: { backgroundColor: COR },
  diaNumeroText: { fontSize: 16, ...FONTS.bold, color: COLORS.textSecondary },
  diaContent: { flex: 1, marginLeft: 12 },
  diaLabel: { fontSize: 11, color: COR, ...FONTS.bold, textTransform: 'uppercase' },
  diaTitulo: { fontSize: 16, ...FONTS.bold, color: COLORS.text, marginTop: 1 },
  diaSubtitulo: { fontSize: 12, color: COLORS.textSecondary, marginTop: 2 },
  diaExpanded: {
    paddingHorizontal: 14, paddingBottom: 14,
    borderTopWidth: 1, borderTopColor: COLORS.borderLight,
  },

  // Versiculo chave
  versiculoBox: {
    backgroundColor: '#FFF8E1', borderRadius: 10,
    padding: 12, marginTop: 12,
    borderLeftWidth: 3, borderLeftColor: '#F9A825',
  },
  versiculoHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 },
  versiculoRef: { fontSize: 12, ...FONTS.bold, color: COR },
  versiculoText: { fontSize: 13, color: COLORS.textSecondary, lineHeight: 19, fontStyle: 'italic' },

  // Oracoes
  oracoesLabel: {
    fontSize: 12, ...FONTS.bold, color: COLORS.textLight,
    textTransform: 'uppercase', marginTop: 14, marginBottom: 8,
  },
  oracaoCard: {
    backgroundColor: '#FFF', borderRadius: 12,
    borderWidth: 1, borderColor: COLORS.borderLight,
    marginBottom: 8, overflow: 'hidden',
  },
  oracaoCardExpanded: { borderColor: COR },
  oracaoHeader: { flexDirection: 'row', alignItems: 'center', padding: 12 },
  oracaoIconBox: {
    width: 38, height: 38, borderRadius: 10,
    alignItems: 'center', justifyContent: 'center',
  },
  oracaoInfo: { flex: 1, marginLeft: 10 },
  oracaoPeriodo: { fontSize: 11, color: COLORS.textLight, ...FONTS.semibold },
  oracaoTitulo: { fontSize: 14, ...FONTS.bold, color: COLORS.text, marginTop: 1 },
  metaRow: {
    flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 5, flexWrap: 'wrap',
  },
  metaPill: {
    flexDirection: 'row', alignItems: 'center', gap: 3,
    paddingHorizontal: 7, paddingVertical: 2, borderRadius: 6,
    backgroundColor: COLORS.borderLight,
  },
  metaText: { fontSize: 11, ...FONTS.semibold, color: COLORS.textSecondary },
  oracaoBody: {
    paddingHorizontal: 12, paddingBottom: 12,
    borderTopWidth: 1, borderTopColor: COLORS.borderLight,
  },
  refBox: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: COR + '15', paddingHorizontal: 10, paddingVertical: 5,
    borderRadius: 7, alignSelf: 'flex-start', marginTop: 10, marginBottom: 8,
  },
  refText: { fontSize: 11, ...FONTS.bold, color: COR },
  oracaoTexto: {
    fontSize: 14, color: COLORS.textSecondary, lineHeight: 22, fontStyle: 'italic',
  },

  // Marcar
  marcarButton: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, marginTop: 14, paddingVertical: 12, borderRadius: 12,
    backgroundColor: COR,
  },
  marcarButtonCompleto: {
    backgroundColor: COLORS.surface, borderWidth: 1, borderColor: '#E53935',
  },
  marcarText: { fontSize: 14, ...FONTS.bold, color: '#FFF' },
  marcarTextCompleto: { color: '#E53935' },
});
