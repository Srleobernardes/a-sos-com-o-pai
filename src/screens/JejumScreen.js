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
import { JEJUM_TIPOS } from '../data/medalhas';
import { JEJUM_PROPOSITOS } from '../data/jejuns';

export default function JejumScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { jejumAtivo, jejumDias, startJejum, toggleJejumDia } = useApp();
  const [showGuia, setShowGuia] = useState(false);
  const [tipoSelecionado, setTipoSelecionado] = useState(jejumAtivo?.tipo || null);

  const getTipoAtivo = () => {
    if (!jejumAtivo) return null;
    return JEJUM_TIPOS.find((t) => t.id === jejumAtivo.tipo);
  };

  const getDuracaoDias = (tipo) => {
    const match = tipo?.duracao?.match(/(\d+)/);
    return match ? parseInt(match[1]) : 7;
  };

  const tipoAtivo = getTipoAtivo();
  const totalDias = tipoAtivo ? getDuracaoDias(tipoAtivo) : 0;
  const diasCompletos = Object.values(jejumDias).filter(Boolean).length;

  const handleSelectJejum = (tipo) => {
    setTipoSelecionado(tipo.id);
  };

  const handleIniciarJejum = (tipoId) => {
    if (jejumAtivo?.tipo === tipoId) return;

    if (!jejumAtivo) {
      startJejum(tipoId);
      return;
    }

    if (Platform.OS === 'web') {
      const ok = window.confirm(
        'Você já tem um jejum ativo. Deseja iniciar um novo? O progresso atual será perdido.'
      );
      if (ok) startJejum(tipoId);
    } else {
      Alert.alert(
        'Jejum em andamento',
        'Você já tem um jejum ativo. Deseja iniciar um novo?',
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Sim, iniciar novo', onPress: () => startJejum(tipoId) },
        ]
      );
    }
  };

  const renderJejumGrid = () => {
    const dias = [];
    for (let i = 1; i <= totalDias; i++) {
      const key = `dia_${i}`;
      const completo = jejumDias[key];
      dias.push(
        <TouchableOpacity
          key={key}
          style={[styles.gridCell, completo && styles.gridCellCompleted]}
          onPress={() => toggleJejumDia(key)}
          activeOpacity={0.7}
        >
          {completo ? (
            <Ionicons name="checkmark" size={18} color="#FFF" />
          ) : (
            <Text style={styles.gridCellText}>{i}</Text>
          )}
        </TouchableOpacity>
      );
    }
    return dias;
  };

  const guiaJejum = [
    {
      titulo: 'Preparação',
      texto: 'Antes de iniciar o jejum, ore pedindo direção a Deus. Reduza gradualmente a alimentação nos dias anteriores.',
      icone: 'fitness',
    },
    {
      titulo: 'Durante o Jejum',
      texto: 'Dedique o tempo que usaria para comer em oração e leitura bíblica. Beba bastante água.',
      icone: 'water',
    },
    {
      titulo: 'Quebrando o Jejum',
      texto: 'Quebre o jejum com alimentos leves. Agradeça a Deus pelo período de consagração.',
      icone: 'restaurant',
    },
    {
      titulo: 'Propósito',
      texto: 'O jejum bíblico e sempre acompanhado de oração. Tenha um propósito claro diante de Deus.',
      icone: 'bulb',
    },
  ];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.titulo}>Jejum Espiritual</Text>
          <TouchableOpacity
            style={styles.guiaButton}
            onPress={() => setShowGuia(!showGuia)}
          >
            <Ionicons name="information-circle" size={24} color={COLORS.primary} />
          </TouchableOpacity>
        </View>

        {/* Guide section */}
        {showGuia && (
          <View style={styles.guiaSection}>
            <Text style={styles.guiaTitulo}>Guia do Jejum Cristao</Text>
            {guiaJejum.map((item, i) => (
              <View key={i} style={styles.guiaItem}>
                <View style={styles.guiaIconCircle}>
                  <Ionicons name={item.icone} size={22} color={COLORS.primary} />
                </View>
                <View style={styles.guiaContent}>
                  <Text style={styles.guiaItemTitulo}>{item.titulo}</Text>
                  <Text style={styles.guiaItemTexto}>{item.texto}</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Active fast */}
        {jejumAtivo && tipoAtivo && (
          <View style={styles.activeCard}>
            <View style={styles.activeHeader}>
              <View style={styles.activeIconCircle}>
                <Ionicons name="flame" size={28} color="#FF5722" />
              </View>
              <View style={styles.activeInfo}>
                <Text style={styles.activeTitulo}>{tipoAtivo.titulo}</Text>
                <Text style={styles.activeSubtitulo}>
                  {diasCompletos} de {totalDias} dias completos
                </Text>
              </View>
            </View>

            {/* Progress bar */}
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${Math.min((diasCompletos / totalDias) * 100, 100)}%` },
                ]}
              />
            </View>
            <Text style={styles.progressText}>
              {Math.round((diasCompletos / totalDias) * 100)}% concluído
            </Text>

            {/* Grid */}
            <Text style={styles.gridTitle}>Marque os dias concluídos:</Text>
            <View style={styles.grid}>{renderJejumGrid()}</View>

            {/* Daniel meditation button */}
            {jejumAtivo?.tipo === 'daniel' && (
              <TouchableOpacity
                style={styles.meditacoesButton}
                onPress={() => navigation.navigate('JejumDaniel')}
                activeOpacity={0.8}
              >
                <Ionicons name="book" size={20} color="#FFF" />
                <Text style={styles.meditacoesButtonText}>Ver Meditações Diárias</Text>
                <Ionicons name="chevron-forward" size={18} color="rgba(255,255,255,0.7)" />
              </TouchableOpacity>
            )}

            {/* Normal fast button */}
            {jejumAtivo?.tipo === 'normal' && (
              <TouchableOpacity
                style={[styles.meditacoesButton, { backgroundColor: '#1E3A5F' }]}
                onPress={() => navigation.navigate('JejumNormal')}
                activeOpacity={0.8}
              >
                <Ionicons name="restaurant" size={20} color="#FFF" />
                <Text style={styles.meditacoesButtonText}>Ver Orações do Jejum</Text>
                <Ionicons name="chevron-forward" size={18} color="rgba(255,255,255,0.7)" />
              </TouchableOpacity>
            )}

            {/* Parcial button */}
            {jejumAtivo?.tipo === 'parcial' && (
              <TouchableOpacity
                style={[styles.meditacoesButton, { backgroundColor: '#2E7D32' }]}
                onPress={() => navigation.navigate('JejumParcial')}
                activeOpacity={0.8}
              >
                <Ionicons name="leaf" size={20} color="#FFF" />
                <Text style={styles.meditacoesButtonText}>Ver Orações do Jejum</Text>
                <Ionicons name="chevron-forward" size={18} color="rgba(255,255,255,0.7)" />
              </TouchableOpacity>
            )}

            {/* Ester meditation button */}
            {jejumAtivo?.tipo === 'ester' && (
              <TouchableOpacity
                style={[styles.meditacoesButton, { backgroundColor: '#7B1FA2' }]}
                onPress={() => navigation.navigate('JejumEster')}
                activeOpacity={0.8}
              >
                <Ionicons name="sparkles" size={20} color="#FFF" />
                <Text style={styles.meditacoesButtonText}>Ver Orações e Meditações</Text>
                <Ionicons name="chevron-forward" size={18} color="rgba(255,255,255,0.7)" />
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* Fast types selection */}
        <Text style={styles.sectionTitle}>
          {jejumAtivo ? 'Trocar tipo de jejum:' : 'Escolha seu tipo de jejum:'}
        </Text>

        {JEJUM_TIPOS.map((tipo) => {
          const isAtivo = jejumAtivo?.tipo === tipo.id;
          const isSelecionado = tipoSelecionado === tipo.id;
          return (
            <View key={tipo.id} style={{ marginHorizontal: 0 }}>
              <TouchableOpacity
                style={[
                  styles.tipoCard,
                  isSelecionado && styles.tipoCardSelected,
                  isAtivo && styles.tipoCardActive,
                ]}
                onPress={() => handleSelectJejum(tipo)}
                activeOpacity={0.8}
              >
                <View style={styles.tipoIconCircle}>
                  <Ionicons name={tipo.icone} size={26} color={COLORS.primary} />
                </View>
                <View style={styles.tipoContent}>
                  <Text style={styles.tipoTitulo}>{tipo.titulo}</Text>
                  <Text style={styles.tipoDescricao}>{tipo.descricao}</Text>
                  <View style={styles.tipoDuracaoRow}>
                    <Ionicons name="time-outline" size={14} color={COLORS.textLight} />
                    <Text style={styles.tipoDuracao}>{tipo.duracao}</Text>
                  </View>
                </View>
                {isAtivo && (
                  <View style={styles.tipoActiveBadge}>
                    <Ionicons name="checkmark-circle" size={22} color={COLORS.success} />
                  </View>
                )}
              </TouchableOpacity>

              {isSelecionado && !isAtivo && (
                <TouchableOpacity
                  style={styles.iniciarButton}
                  onPress={() => handleIniciarJejum(tipo.id)}
                  activeOpacity={0.85}
                >
                  <Ionicons name="play-circle" size={20} color="#FFF" />
                  <Text style={styles.iniciarButtonText}>Iniciar este jejum</Text>
                </TouchableOpacity>
              )}
            </View>
          );
        })}

        {/* Propositos de Jejum */}
        <View style={styles.propositosDivider} />
        <Text style={styles.sectionTitle}>Propositos de Jejum</Text>
        <Text style={styles.propositosSubtitle}>
          Escolha um proposito e ore com direcao ao longo do dia
        </Text>

        {JEJUM_PROPOSITOS.map((jejum) => (
          <TouchableOpacity
            key={jejum.id}
            style={styles.propositoCard}
            onPress={() => navigation.navigate('JejumNivel', { jejum })}
            activeOpacity={0.8}
          >
            <View style={[styles.propositoBanner, { backgroundColor: jejum.cor }]}>
              <Ionicons name={jejum.icone} size={32} color="#FFF" />
            </View>
            <View style={styles.propositoContent}>
              <Text style={styles.propositoTitulo}>{jejum.titulo}</Text>
              <Text style={styles.propositoDescricao} numberOfLines={2}>{jejum.subtitulo}</Text>
              <View style={styles.propositoInfo}>
                <Ionicons name="hand-left" size={13} color={COLORS.textLight} />
                <Text style={styles.propositoInfoText}>3 níveis de jejum</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color={COLORS.textLight} />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
  },
  titulo: {
    fontSize: 28,
    ...FONTS.extrabold,
    color: COLORS.text,
  },
  guiaButton: {
    padding: 4,
  },
  guiaSection: {
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    backgroundColor: COLORS.surfaceWarm,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  guiaTitulo: {
    fontSize: 18,
    ...FONTS.bold,
    color: COLORS.text,
    marginBottom: 16,
  },
  guiaItem: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 12,
  },
  guiaIconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: COLORS.primaryLight + '30',
    alignItems: 'center',
    justifyContent: 'center',
  },
  guiaContent: {
    flex: 1,
  },
  guiaItemTitulo: {
    fontSize: 15,
    ...FONTS.bold,
    color: COLORS.text,
    marginBottom: 4,
  },
  guiaItemTexto: {
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 19,
  },
  activeCard: {
    marginHorizontal: 20,
    marginBottom: 24,
    padding: 20,
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    ...SHADOWS.medium,
  },
  activeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 14,
  },
  activeIconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#FFF3E0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeInfo: {
    flex: 1,
  },
  activeTitulo: {
    fontSize: 18,
    ...FONTS.bold,
    color: COLORS.text,
  },
  activeSubtitulo: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  progressBar: {
    height: 10,
    backgroundColor: '#F0F0F0',
    borderRadius: 5,
    marginBottom: 8,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.success,
    borderRadius: 5,
  },
  progressText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: 'right',
    marginBottom: 16,
  },
  gridTitle: {
    fontSize: 14,
    ...FONTS.semibold,
    color: COLORS.text,
    marginBottom: 12,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  gridCell: {
    width: 42,
    height: 42,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5F5F5',
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  gridCellCompleted: {
    backgroundColor: COLORS.success,
    borderColor: COLORS.success,
  },
  gridCellText: {
    fontSize: 14,
    ...FONTS.semibold,
    color: COLORS.textSecondary,
  },
  meditacoesButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 16,
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: '#B8860B',
  },
  meditacoesButtonText: {
    fontSize: 15,
    ...FONTS.bold,
    color: '#FFF',
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    ...FONTS.bold,
    color: COLORS.text,
    paddingHorizontal: 20,
    marginBottom: 14,
  },
  tipoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 12,
    padding: 16,
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: COLORS.borderLight,
    ...SHADOWS.small,
  },
  tipoCardActive: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.cardGradientStart,
  },
  tipoCardSelected: {
    borderColor: COLORS.primary,
    borderWidth: 2,
  },
  iniciarButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginHorizontal: 20,
    marginTop: -4,
    marginBottom: 12,
    paddingVertical: 13,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    ...SHADOWS.small,
  },
  iniciarButtonText: {
    fontSize: 15,
    ...FONTS.bold,
    color: '#FFF',
  },
  tipoIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: COLORS.primaryLight + '25',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tipoContent: {
    flex: 1,
    marginLeft: 14,
  },
  tipoTitulo: {
    fontSize: 16,
    ...FONTS.bold,
    color: COLORS.text,
  },
  tipoDescricao: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
    lineHeight: 17,
  },
  tipoDuracaoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  tipoDuracao: {
    fontSize: 12,
    color: COLORS.textLight,
  },
  tipoActiveBadge: {
    marginLeft: 8,
  },
  propositosDivider: {
    height: 1,
    backgroundColor: COLORS.borderLight,
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 24,
  },
  propositosSubtitle: {
    fontSize: 13,
    color: COLORS.textLight,
    paddingHorizontal: 20,
    marginTop: -8,
    marginBottom: 16,
  },
  propositoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 12,
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    ...SHADOWS.small,
  },
  propositoBanner: {
    width: 72,
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
  },
  propositoContent: {
    flex: 1,
    padding: 14,
  },
  propositoTitulo: {
    fontSize: 15,
    ...FONTS.bold,
    color: COLORS.text,
    marginBottom: 2,
  },
  propositoDescricao: {
    fontSize: 12,
    color: COLORS.textSecondary,
    lineHeight: 17,
    marginBottom: 6,
  },
  propositoInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  propositoInfoText: {
    fontSize: 11,
    color: COLORS.textLight,
    ...FONTS.medium,
  },
});
