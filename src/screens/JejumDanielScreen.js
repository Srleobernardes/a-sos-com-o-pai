import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, SHADOWS, FONTS } from '../theme/colors';
import { useApp } from '../context/AppContext';
import {
  JEJUM_DANIEL_MEDITACOES,
  JEJUM_DANIEL_SEMANAS,
  REGRAS_JEJUM_DANIEL,
} from '../data/jejumDaniel';

const COR_DANIEL = '#B8860B';
const COR_DANIEL_FUNDO = '#FDF6E3';

export default function JejumDanielScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { jejumDias, toggleJejumDia, startJejum, jejumAtivo } = useApp();
  const [expandedDia, setExpandedDia] = useState(null);
  const [showRegras, setShowRegras] = useState(false);

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
          <Text style={styles.bannerDescricao}>Devocional Diário Completo</Text>
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

        {/* Regras do Jejum */}
        <TouchableOpacity
          style={styles.regrasCard}
          onPress={() => setShowRegras(!showRegras)}
          activeOpacity={0.8}
        >
          <View style={styles.regrasHeader}>
            <View style={styles.regrasIconWrap}>
              <Ionicons name="leaf" size={18} color={COR_DANIEL} />
            </View>
            <Text style={styles.regrasTitulo}>O que posso comer?</Text>
            <Ionicons
              name={showRegras ? 'chevron-up' : 'chevron-down'}
              size={18}
              color={COLORS.textLight}
            />
          </View>
          {showRegras && (
            <View style={styles.regrasBody}>
              <Text style={styles.regrasSecaoTitulo}>✅ Permitido</Text>
              {REGRAS_JEJUM_DANIEL.permitidos.map((item, i) => (
                <View key={i} style={styles.regrasItem}>
                  <Text style={styles.regrasBullet}>•</Text>
                  <Text style={styles.regrasItemText}>{item}</Text>
                </View>
              ))}
              <Text style={[styles.regrasSecaoTitulo, { marginTop: 12 }]}>❌ Não permitido</Text>
              {REGRAS_JEJUM_DANIEL.proibidos.map((item, i) => (
                <View key={i} style={styles.regrasItem}>
                  <Text style={styles.regrasBullet}>•</Text>
                  <Text style={styles.regrasItemText}>{item}</Text>
                </View>
              ))}
              <View style={styles.regrasObs}>
                <Ionicons name="information-circle-outline" size={14} color={COR_DANIEL} />
                <Text style={styles.regrasObsText}>{REGRAS_JEJUM_DANIEL.observacao}</Text>
              </View>
            </View>
          )}
        </TouchableOpacity>

        {/* Semanas */}
        {JEJUM_DANIEL_SEMANAS.map((semana) => (
          <View key={semana.numero}>
            <View style={styles.semanaHeader}>
              <View style={styles.semanaIconWrap}>
                <Ionicons name="calendar" size={16} color={COR_DANIEL} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.semanaTitulo}>{semana.titulo} • Dias {semana.inicio}–{semana.fim}</Text>
                <Text style={styles.semanaTemaTitulo}>{semana.tema}</Text>
              </View>
            </View>

            {JEJUM_DANIEL_MEDITACOES.filter(m => m.semana === semana.numero).map((med) => {
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
                      <Text style={styles.diaTema}>{med.tema}</Text>
                      <Text style={styles.diaVersiculo}>{med.versiculoChave}</Text>
                    </View>
                    <Ionicons
                      name={isExpanded ? 'chevron-up' : 'chevron-down'}
                      size={18}
                      color={COLORS.textLight}
                    />
                  </TouchableOpacity>

                  {isExpanded && (
                    <View style={styles.diaExpanded}>
                      {/* Versículo */}
                      <View style={styles.versiculoBox}>
                        <View style={styles.versiculoRef}>
                          <Ionicons name="book-outline" size={13} color={COR_DANIEL} />
                          <Text style={styles.versiculoRefText}>{med.versiculoChave}</Text>
                        </View>
                        <Text style={styles.versiculoTexto}>"{med.textoVersiculo}"</Text>
                      </View>

                      {/* Leitura */}
                      <View style={styles.leituraRow}>
                        <Ionicons name="bookmark-outline" size={13} color={COLORS.textLight} />
                        <Text style={styles.leituraText}>Leitura: {med.leituraBiblica}</Text>
                      </View>

                      {/* Reflexão */}
                      <View style={styles.secaoBloco}>
                        <View style={styles.secaoHeader}>
                          <Ionicons name="bulb-outline" size={15} color={COR_DANIEL} />
                          <Text style={styles.secaoTitulo}>Reflexão</Text>
                        </View>
                        {med.reflexao.split('\n\n').map((p, i) => (
                          <Text key={i} style={styles.reflexaoTexto}>{p}</Text>
                        ))}
                      </View>

                      {/* Oração Guiada */}
                      <View style={[styles.secaoBloco, styles.oracaoBloco]}>
                        <View style={styles.secaoHeader}>
                          <Ionicons name="hand-left-outline" size={15} color={COR_DANIEL} />
                          <Text style={styles.secaoTitulo}>Oração Guiada</Text>
                        </View>
                        {med.oracaoGuiada.split('\n\n').map((p, i) => (
                          <Text key={i} style={styles.oracaoTexto}>{p}</Text>
                        ))}
                      </View>

                      {/* Desafio Prático */}
                      <View style={styles.desafioBloco}>
                        <Ionicons name="checkmark-done-outline" size={15} color="#FFF" />
                        <View style={{ flex: 1 }}>
                          <Text style={styles.desafioTitulo}>Desafio do Dia</Text>
                          <Text style={styles.desafioTexto}>{med.desafioPratico}</Text>
                        </View>
                      </View>

                      {/* Botão Marcar */}
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

  // Banner
  bannerArea: {
    paddingVertical: 32, paddingHorizontal: 20,
    alignItems: 'center', backgroundColor: COR_DANIEL,
  },
  bannerIconCircle: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center', justifyContent: 'center', marginBottom: 12,
  },
  bannerTitulo: { color: '#FFF', fontSize: 28, ...FONTS.extrabold, textAlign: 'center' },
  bannerSubtitulo: { color: '#FFF', fontSize: 18, ...FONTS.bold, marginTop: 2 },
  bannerDescricao: { color: 'rgba(255,255,255,0.8)', fontSize: 14, marginTop: 6 },

  // Progress
  progressCard: {
    margin: 16, padding: 18,
    backgroundColor: COLORS.surface, borderRadius: 16, ...SHADOWS.small,
  },
  progressHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  progressTitle: { fontSize: 15, ...FONTS.bold, color: COLORS.text, flex: 1 },
  progressCount: { fontSize: 15, ...FONTS.bold, color: COR_DANIEL },
  progressBar: { height: 8, backgroundColor: COLORS.borderLight, borderRadius: 4, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: COR_DANIEL, borderRadius: 4 },
  progressPercent: { fontSize: 12, color: COLORS.textLight, ...FONTS.medium, marginTop: 6, textAlign: 'right' },

  // Iniciar
  iniciarButton: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 10, marginHorizontal: 16, marginTop: 4, marginBottom: 8,
    paddingVertical: 16, borderRadius: 14, backgroundColor: COR_DANIEL,
    shadowColor: COR_DANIEL, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 8, elevation: 6,
  },
  iniciarButtonAtivo: { backgroundColor: '#388E3C' },
  iniciarButtonText: { fontSize: 17, ...FONTS.bold, color: '#FFF' },

  // Regras
  regrasCard: {
    marginHorizontal: 16, marginBottom: 8,
    backgroundColor: COLORS.surface, borderRadius: 14,
    borderWidth: 1, borderColor: COLORS.borderLight, ...SHADOWS.small,
    overflow: 'hidden',
  },
  regrasHeader: {
    flexDirection: 'row', alignItems: 'center', gap: 10, padding: 14,
  },
  regrasIconWrap: {
    width: 32, height: 32, borderRadius: 8,
    backgroundColor: COR_DANIEL + '18',
    alignItems: 'center', justifyContent: 'center',
  },
  regrasTitulo: { flex: 1, fontSize: 15, ...FONTS.bold, color: COLORS.text },
  regrasBody: { paddingHorizontal: 14, paddingBottom: 14 },
  regrasSecaoTitulo: { fontSize: 13, ...FONTS.bold, color: COLORS.text, marginBottom: 6 },
  regrasItem: { flexDirection: 'row', gap: 6, marginBottom: 4, alignItems: 'flex-start' },
  regrasBullet: { color: COR_DANIEL, fontSize: 14, lineHeight: 20 },
  regrasItemText: { flex: 1, fontSize: 13, color: COLORS.textSecondary, lineHeight: 20 },
  regrasObs: {
    flexDirection: 'row', gap: 6, marginTop: 14,
    backgroundColor: COR_DANIEL + '12', padding: 10, borderRadius: 8,
    alignItems: 'flex-start',
  },
  regrasObsText: { flex: 1, fontSize: 12, color: COLORS.textSecondary, lineHeight: 18, fontStyle: 'italic' },

  // Semana
  semanaHeader: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 10,
    paddingHorizontal: 20, marginTop: 22, marginBottom: 10,
  },
  semanaIconWrap: {
    width: 28, height: 28, borderRadius: 8,
    backgroundColor: COR_DANIEL + '18',
    alignItems: 'center', justifyContent: 'center', marginTop: 2,
  },
  semanaTitulo: { fontSize: 13, ...FONTS.bold, color: COR_DANIEL, textTransform: 'uppercase', letterSpacing: 0.5 },
  semanaTemaTitulo: { fontSize: 15, ...FONTS.bold, color: COLORS.text, marginTop: 1 },

  // Dia Card
  diaCard: {
    marginHorizontal: 16, marginBottom: 8,
    backgroundColor: COLORS.surface, borderRadius: 14,
    borderWidth: 1, borderColor: COLORS.borderLight, ...SHADOWS.small,
    overflow: 'hidden',
  },
  diaCardCompleto: { borderColor: COR_DANIEL + '40', backgroundColor: COR_DANIEL_FUNDO },
  diaHeader: { flexDirection: 'row', alignItems: 'center', padding: 14 },
  diaNumero: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: COLORS.borderLight,
    alignItems: 'center', justifyContent: 'center',
  },
  diaNumeroCompleto: { backgroundColor: COR_DANIEL },
  diaNumeroText: { fontSize: 15, ...FONTS.bold, color: COLORS.textSecondary },
  diaContent: { flex: 1, marginLeft: 12 },
  diaTema: { fontSize: 15, ...FONTS.bold, color: COLORS.text },
  diaVersiculo: { fontSize: 12, color: COR_DANIEL, ...FONTS.semibold, marginTop: 2 },

  // Expanded
  diaExpanded: {
    paddingHorizontal: 14, paddingBottom: 16,
    borderTopWidth: 1, borderTopColor: COLORS.borderLight,
  },

  // Versículo box
  versiculoBox: {
    backgroundColor: COR_DANIEL + '12', borderRadius: 10,
    padding: 12, marginTop: 14, marginBottom: 10,
  },
  versiculoRef: { flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: 6 },
  versiculoRefText: { fontSize: 11, ...FONTS.bold, color: COR_DANIEL, textTransform: 'uppercase' },
  versiculoTexto: { fontSize: 14, color: COLORS.text, lineHeight: 22, fontStyle: 'italic' },

  // Leitura
  leituraRow: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    marginBottom: 14, paddingHorizontal: 2,
  },
  leituraText: { fontSize: 12, color: COLORS.textLight, ...FONTS.medium },

  // Seção (Reflexão / Oração)
  secaoBloco: {
    marginBottom: 12,
    backgroundColor: COLORS.background, borderRadius: 10, padding: 12,
    borderWidth: 1, borderColor: COLORS.borderLight,
  },
  oracaoBloco: {
    backgroundColor: COR_DANIEL + '08',
    borderColor: COR_DANIEL + '30',
  },
  secaoHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 },
  secaoTitulo: { fontSize: 13, ...FONTS.bold, color: COR_DANIEL, textTransform: 'uppercase', letterSpacing: 0.4 },
  reflexaoTexto: { fontSize: 14, color: COLORS.textSecondary, lineHeight: 23, marginBottom: 8 },
  oracaoTexto: { fontSize: 14, color: COLORS.textSecondary, lineHeight: 23, fontStyle: 'italic', marginBottom: 8 },

  // Desafio
  desafioBloco: {
    flexDirection: 'row', gap: 10, alignItems: 'flex-start',
    backgroundColor: COR_DANIEL, borderRadius: 10, padding: 12, marginBottom: 14,
  },
  desafioTitulo: { fontSize: 12, ...FONTS.bold, color: '#FFF', textTransform: 'uppercase', marginBottom: 3 },
  desafioTexto: { fontSize: 13, color: 'rgba(255,255,255,0.9)', lineHeight: 20 },

  // Marcar
  marcarButton: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, paddingVertical: 12, borderRadius: 12, backgroundColor: COR_DANIEL,
  },
  marcarButtonCompleto: {
    backgroundColor: COLORS.surface, borderWidth: 1, borderColor: '#E53935',
  },
  marcarText: { fontSize: 14, ...FONTS.bold, color: '#FFF' },
  marcarTextCompleto: { color: '#E53935' },
});
