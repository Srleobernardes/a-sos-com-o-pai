import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, SHADOWS, FONTS } from '../theme/colors';
import { useApp } from '../context/AppContext';
import JejumConcluidoAnimacao from '../components/JejumConcluidoAnimacao';
import { JEJUM_TIPOS } from '../data/medalhas';
import { JEJUM_PROPOSITOS } from '../data/jejuns';
import { JEJUM_ESTER } from '../data/jejumEster';
import { JEJUM_DANIEL_MEDITACOES } from '../data/jejumDaniel';
import { JEJUM_PARCIAL_DIAS } from '../data/jejumParcial';
import { CAUSAS_JEJUM, REFEICOES, ORACOES_POR_REFEICAO } from '../data/jejumNormal';

// Extrai a hora numérica de strings como '06h00', '12h00 (Meio-dia)', '06h00 (Ao despertar)'
const parseHora = (horarioStr) => {
  if (!horarioStr) return 6;
  const match = horarioStr.match(/(\d{1,2})h/);
  return match ? parseInt(match[1]) : 6;
};

// Retorna o array de orações do dia correto para cada tipo de jejum
// refeicaoId é usado apenas para jejum normal (cafe | almoco | jantar)
const getOracoesParaTipo = (tipo, diaAtual, refeicaoId = null) => {
  switch (tipo) {
    case 'ester': {
      const dia = JEJUM_ESTER.dias?.[diaAtual - 1];
      return dia?.oracoes || [];
    }
    case 'daniel': {
      const med = JEJUM_DANIEL_MEDITACOES?.[diaAtual - 1];
      if (!med) return [];
      return [{
        horario: med.horario,
        periodo: 'Meditação do Dia',
        titulo: med.titulo,
        referencia: med.referencia,
        texto: `${med.descricao}\n\nLeia ${med.salmo} — ${med.duracao} de meditação.`,
      }];
    }
    case 'parcial': {
      const dia = JEJUM_PARCIAL_DIAS?.[diaAtual - 1];
      return dia?.oracoes || [];
    }
    case 'normal': {
      if (refeicaoId && ORACOES_POR_REFEICAO[refeicaoId]) {
        return ORACOES_POR_REFEICAO[refeicaoId];
      }
      return [
        ...(ORACOES_POR_REFEICAO.cafe || []),
        ...(ORACOES_POR_REFEICAO.almoco || []),
        ...(ORACOES_POR_REFEICAO.jantar || []),
      ].sort((a, b) => parseHora(a.horario) - parseHora(b.horario));
    }
    default:
      return [];
  }
};

export default function JejumScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const {
    jejumAtivo,
    jejumDias,
    jejumOracoes,
    toggleJejumDia,
    toggleJejumOracao,
    completarJejum,
    jejumConcluido,
    clearJejumConcluido,
  } = useApp();
  const [showGuia, setShowGuia] = useState(false);
  const [now, setNow] = useState(new Date());
  const [showFullOracao, setShowFullOracao] = useState(false);

  const TELA_POR_TIPO = {
    normal: 'JejumNormal',
    parcial: 'JejumParcial',
    daniel: 'JejumDaniel',
    ester: 'JejumEster',
  };

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);

  // Recolhe o texto ao trocar de oração
  useEffect(() => {
    setShowFullOracao(false);
  }, [jejumOracoes]);

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
  // Conta apenas dias do jejum ativo (dia_1, dia_2, ...) para não misturar tipos
  const diasCompletos = totalDias > 0
    ? Array.from({ length: totalDias }, (_, i) => jejumDias[`dia_${i + 1}`]).filter(Boolean).length
    : Object.values(jejumDias).filter(Boolean).length;

  // Detecta conclusão total do jejum e computa +1 jejum no perfil
  const completionRef = useRef(false);
  useEffect(() => {
    if (!jejumAtivo || completionRef.current) return;
    const tipo = jejumAtivo.tipo;

    if (tipo === 'proposito') {
      const proposito = JEJUM_PROPOSITOS.find(p => p.id === jejumAtivo.propositoId);
      const nivel = proposito?.niveis?.find(n => n.id === jejumAtivo.nivelId);
      if (!nivel) return;
      const oracoes = nivel.oracoes || [];
      if (oracoes.length === 0) return;
      const chaveBase = `proposito_${jejumAtivo.propositoId}_${jejumAtivo.nivelId}`;
      const todas = oracoes.every((_, i) => !!jejumOracoes?.[`${chaveBase}_oracao${i}`]);
      if (todas) {
        completionRef.current = true;
        completarJejum();
      }
    } else {
      if (!tipoAtivo) return;
      let diasCompletos = 0;
      for (let d = 1; d <= totalDias; d++) {
        const cb = `${tipo}_dia${d}`;
        const ors = getOracoesParaTipo(tipo, d, jejumAtivo.refeicaoId || null);
        if (ors.length > 0 && ors.every((_, i) => !!jejumOracoes?.[`${cb}_oracao${i}`])) {
          diasCompletos++;
        } else break;
      }
      if (diasCompletos === totalDias && totalDias > 0) {
        completionRef.current = true;
        completarJejum();
      }
    }
  }, [jejumOracoes]);

  // Auto-marca o dia quando todas as orações do dia atual forem concluídas
  const markingRef = useRef(false);
  useEffect(() => {
    if (!jejumAtivo || jejumAtivo.tipo === 'proposito' || !tipoAtivo) return;
    if (markingRef.current) return;

    const diaAtual = Math.min(diasCompletos + 1, totalDias);
    const diaKey = `dia_${diaAtual}`;
    if (jejumDias[diaKey]) return; // já marcado

    const chaveBase = `${jejumAtivo.tipo}_dia${diaAtual}`;
    const oracoes = getOracoesParaTipo(jejumAtivo.tipo, diaAtual, jejumAtivo.refeicaoId || null);
    if (oracoes.length === 0) return;

    const todasConcluidas = oracoes.every((_, i) => !!jejumOracoes?.[`${chaveBase}_oracao${i}`]);
    if (todasConcluidas) {
      markingRef.current = true;
      toggleJejumDia(diaKey);
      setTimeout(() => { markingRef.current = false; }, 300);
    }
  }, [jejumOracoes, jejumDias]);

  const guiaJejum = [
    {
      titulo: 'Preparação',
      texto: 'Antes de iniciar o jejum, ore pedindo direção a Deus. Reduza gradualmente a alimentação nos dias anteriores.',
      icone: 'body',
    },
    {
      titulo: 'Durante o Jejum',
      texto: 'Dedique o tempo que usaria para comer em oração e leitura bíblica. Beba bastante água.',
      icone: 'water',
    },
    {
      titulo: 'Quebrando o Jejum',
      texto: 'Quebre o jejum com alimentos leves. Agradeça a Deus pelo período de consagração.',
      icone: 'fast-food',
    },
    {
      titulo: 'Propósito',
      texto: 'O jejum bíblico é sempre acompanhado de oração. Tenha um propósito claro diante de Deus.',
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
            <Ionicons name="information-circle" size={28} color={COLORS.primary} />
          </TouchableOpacity>
        </View>

        {/* Guia do Jejum */}
        {showGuia && (
          <View style={styles.guiaSection}>
            <Text style={styles.guiaTitulo}>Guia do Jejum Cristão</Text>
            {guiaJejum.map((item, i) => (
              <View key={i} style={styles.guiaItem}>
                <View style={styles.guiaIconCircle}>
                  <Ionicons name={item.icone} size={24} color={COLORS.primary} />
                </View>
                <View style={styles.guiaContent}>
                  <Text style={styles.guiaItemTitulo}>{item.titulo}</Text>
                  <Text style={styles.guiaItemTexto}>{item.texto}</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Card: Jejum em andamento */}
        {jejumAtivo && (() => {
          const tipo = jejumAtivo.tipo;
          const isProposito = tipo === 'proposito';

          // ── Dados específicos por tipo ──────────────────────────────
          let oracoes = [];
          let nomeJejum = '';
          let progressoPct = 0;
          let progressoLabel = '';
          let navLabel = '';
          let navIcone = 'hand-left';
          let onNavPress = () => {};
          let diaAtualCalculado = 1;

          if (isProposito) {
            const proposito = JEJUM_PROPOSITOS.find(p => p.id === jejumAtivo.propositoId);
            const nivel = proposito?.niveis?.find(n => n.id === jejumAtivo.nivelId);
            if (!proposito || !nivel) return null;
            oracoes = nivel.oracoes || [];
            nomeJejum = proposito.titulo;
            navLabel = nivel.subtitulo || 'Ver Orações';
            navIcone = proposito.icone;
            onNavPress = () => navigation.navigate('JejumDetalhe', { nivel, jejum: proposito });
          } else {
            if (!tipoAtivo) return null;
            // Calcula dias completos direto de jejumOracoes (não depende de jejumDias)
            let diasCompletosReais = 0;
            for (let d = 1; d <= totalDias; d++) {
              const cb = `${tipo}_dia${d}`;
              const ors = getOracoesParaTipo(tipo, d, jejumAtivo.refeicaoId || null);
              if (ors.length > 0 && ors.every((_, i) => !!jejumOracoes?.[`${cb}_oracao${i}`])) {
                diasCompletosReais++;
              } else {
                break;
              }
            }
            diaAtualCalculado = Math.min(diasCompletosReais + 1, totalDias);
            oracoes = getOracoesParaTipo(tipo, diaAtualCalculado, jejumAtivo.refeicaoId || null);
            if (tipo === 'normal' && jejumAtivo.causaId) {
              const causa = CAUSAS_JEJUM.find(c => c.id === jejumAtivo.causaId);
              const refeicao = REFEICOES.find(r => r.id === jejumAtivo.refeicaoId);
              nomeJejum = causa
                ? `${causa.titulo}${refeicao ? ' — ' + refeicao.titulo : ''}`
                : tipoAtivo.titulo;
            } else {
              nomeJejum = tipoAtivo.titulo;
            }
            progressoPct = Math.min(Math.round((diasCompletosReais / totalDias) * 100), 100);
            progressoLabel = `${diasCompletosReais} de ${totalDias} dias completos`;
            const NAV_MAP = {
              daniel: { tela: 'JejumDaniel', icone: 'book', label: 'Ver Meditações Diárias' },
              normal: { tela: 'JejumNormal', icone: 'fast-food', label: 'Ver Orações do Jejum' },
              parcial: { tela: 'JejumParcial', icone: 'leaf', label: 'Ver Orações do Jejum' },
              ester: { tela: 'JejumEster', icone: 'star', label: 'Ver Orações e Meditações' },
            };
            const nav = NAV_MAP[tipo] || NAV_MAP.normal;
            navLabel = nav.label;
            navIcone = nav.icone;
            onNavPress = () => navigation.navigate(nav.tela);
          }

          if (oracoes.length === 0) return null;

          // ── Lógica de progresso por oração ─────────────────────────
          const diaAtualRegular = isProposito ? 1 : diaAtualCalculado;
          const chaveBase = isProposito
            ? `proposito_${jejumAtivo.propositoId}_${jejumAtivo.nivelId}`
            : `${tipo}_dia${diaAtualRegular}`;

          const isEffectivelyDone = (idx) => {
            return !!jejumOracoes?.[`${chaveBase}_oracao${idx}`];
          };

          let currentIdx = oracoes.findIndex((_, i) => !isEffectivelyDone(i));
          const dayCompleted = currentIdx === -1;
          if (dayCompleted) currentIdx = oracoes.length - 1;

          // Para propósito: % baseado em orações concluídas
          if (isProposito) {
            const donePrayers = oracoes.filter((_, i) => isEffectivelyDone(i)).length;
            progressoPct = Math.round((donePrayers / oracoes.length) * 100);
            progressoLabel = `${donePrayers} de ${oracoes.length} orações concluídas`;
          }

          const oracaoAtual = oracoes[currentIdx];
          const proximaOracao = !dayCompleted && currentIdx < oracoes.length - 1
            ? oracoes[currentIdx + 1]
            : null;
          const markKey = `${chaveBase}_oracao${currentIdx}`;
          const jaConcluidaManual = !!jejumOracoes?.[markKey];

          let tempoRestante = '';
          if (proximaOracao) {
            const nextHora = parseHora(proximaOracao.horario);
            const fim = new Date(now);
            fim.setHours(nextHora, 0, 0, 0);
            const diff = fim - now;
            if (diff > 0) {
              const h = Math.floor(diff / 3600000);
              const m = Math.floor((diff % 3600000) / 60000);
              tempoRestante = h > 0 ? `${h}h ${m}min` : `${m}min`;
            }
          }

          const oracaoNumeroLabel = tipo === 'daniel'
            ? `Dia ${diaAtualRegular} de ${totalDias} — ${oracaoAtual.horario?.split(' ')[0] || ''}`
            : `Oração ${currentIdx + 1} de ${oracoes.length} — ${oracaoAtual.horario?.split(' ')[0] || ''}`;

          return (
            <LinearGradient
              colors={['#0D1B3E', '#1A3358']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.proximoPassoCard}
            >
              {/* Topo: badge + bolinhas das orações */}
              <View style={styles.ppTopRow}>
                <View style={styles.ppBadgeRow}>
                  <View style={styles.ppDot} />
                  <Text style={styles.ppBadgeText}>JEJUM EM ANDAMENTO</Text>
                </View>
                <View style={styles.ppDotsRow}>
                  {oracoes.map((_, i) => (
                    <View
                      key={i}
                      style={[
                        styles.ppStepDot,
                        isEffectivelyDone(i) && styles.ppStepDotDone,
                        !dayCompleted && i === currentIdx && styles.ppStepDotActive,
                      ]}
                    />
                  ))}
                </View>
              </View>

              {/* Nome do jejum + % */}
              <View style={styles.ppHeaderRow}>
                <Text style={styles.ppNomeTipo} numberOfLines={2}>{nomeJejum}</Text>
                <Text style={styles.ppProgressoTexto}>{progressoPct}%</Text>
              </View>

              {/* Barra de progresso */}
              <View style={styles.ppProgressBar}>
                <View style={[styles.ppProgressFill, { width: `${progressoPct}%` }]} />
              </View>
              <Text style={styles.ppDiasTexto}>{progressoLabel}</Text>

              <View style={styles.ppSeparador} />

              {/* Tag de estado + tempo */}
              <View style={styles.ppAgoraRow}>
                <View style={[styles.ppAgoraTag, dayCompleted && styles.ppAgoraTagDone]}>
                  <Text style={[styles.ppAgoraTagText, dayCompleted && styles.ppAgoraTagTextDone]}>
                    {dayCompleted ? 'CONCLUÍDO' : 'PRÓXIMO PASSO'}
                  </Text>
                </View>
                {tempoRestante ? (
                  <Text style={styles.ppTempoStep}>{tempoRestante} até a próxima</Text>
                ) : null}
              </View>

              {/* Número da oração */}
              <Text style={styles.ppOracaoNumero}>{oracaoNumeroLabel}</Text>

              {/* Título da oração */}
              <Text style={styles.ppCurrentTitle}>{oracaoAtual.titulo}</Text>

              {/* Referência bíblica */}
              {oracaoAtual.referencia ? (
                <Text style={styles.ppCurrentVerseRef}>{oracaoAtual.referencia}</Text>
              ) : null}

              {/* Texto da oração */}
              <Text style={styles.ppCurrentDesc} numberOfLines={showFullOracao ? undefined : 5}>
                {oracaoAtual.texto}
              </Text>
              <TouchableOpacity onPress={() => setShowFullOracao(v => !v)} style={styles.ppVerMaisBtn}>
                <Text style={styles.ppVerMaisText}>
                  {showFullOracao ? 'Mostrar menos ↑' : 'Ler oração completa ↓'}
                </Text>
              </TouchableOpacity>

              {/* Botão Marcar como concluído */}
              {!dayCompleted && (
                <TouchableOpacity
                  style={[styles.ppMarcarButton, jaConcluidaManual && styles.ppMarcarButtonDone]}
                  onPress={() => toggleJejumOracao(markKey)}
                  activeOpacity={0.85}
                >
                  <Ionicons
                    name={jaConcluidaManual ? 'checkmark-circle' : 'checkmark-circle-outline'}
                    size={24}
                    color={jaConcluidaManual ? '#66BB6A' : '#FFFFFF'}
                  />
                  <Text style={[styles.ppMarcarButtonText, jaConcluidaManual && styles.ppMarcarButtonTextDone]}>
                    {jaConcluidaManual ? 'Concluído!' : 'Marcar como concluído'}
                  </Text>
                </TouchableOpacity>
              )}

              {/* Prévia da próxima oração */}
              {proximaOracao && (
                <View style={styles.ppNextRow}>
                  <Ionicons name="arrow-forward-circle" size={18} color="rgba(255,255,255,0.35)" />
                  <Text style={styles.ppNextTitle}>
                    A seguir: {proximaOracao.titulo}
                    <Text style={styles.ppNextHorario}> · {proximaOracao.horario?.split(' ')[0] || ''}</Text>
                  </Text>
                </View>
              )}

              {/* Botão de navegação */}
              <TouchableOpacity
                style={styles.ppNavButton}
                onPress={onNavPress}
                activeOpacity={0.85}
              >
                <Ionicons name={navIcone} size={18} color="#FFF" />
                <Text style={styles.ppNavButtonText}>{navLabel}</Text>
                <Ionicons name="chevron-forward" size={16} color="#FFF" />
              </TouchableOpacity>
            </LinearGradient>
          );
        })()}

        {/* Seleção de tipo de jejum */}
        <Text style={styles.sectionTitle}>
          {jejumAtivo ? 'Trocar tipo de jejum:' : 'Escolha seu tipo de jejum:'}
        </Text>

        {JEJUM_TIPOS.map((tipo) => {
          const isAtivo = jejumAtivo?.tipo === tipo.id;
          return (
            <TouchableOpacity
              key={tipo.id}
              style={[styles.tipoCard, isAtivo && styles.tipoCardActive]}
              onPress={() => navigation.navigate(TELA_POR_TIPO[tipo.id])}
              activeOpacity={0.8}
            >
              <View style={styles.tipoIconCircle}>
                <Ionicons name={tipo.icone} size={28} color={COLORS.primary} />
              </View>
              <View style={styles.tipoContent}>
                <Text style={styles.tipoTitulo}>{tipo.titulo}</Text>
                <Text style={styles.tipoDescricao}>{tipo.descricao}</Text>
                <View style={styles.tipoDuracaoRow}>
                  <Ionicons name="time-outline" size={15} color={COLORS.textLight} />
                  <Text style={styles.tipoDuracao}>{tipo.duracao}</Text>
                </View>
              </View>
              {isAtivo ? (
                <View style={styles.tipoActiveBadge}>
                  <Ionicons name="checkmark-circle" size={24} color={COLORS.success} />
                </View>
              ) : (
                <Ionicons name="chevron-forward" size={22} color={COLORS.textLight} />
              )}
            </TouchableOpacity>
          );
        })}

        {/* Propósitos de Jejum */}
        <View style={styles.propositosDivider} />
        <Text style={styles.sectionTitle}>Propósitos de Jejum</Text>
        <Text style={styles.propositosSubtitle}>
          Escolha um propósito e ore com direção ao longo do dia
        </Text>

        <JejumConcluidoAnimacao
          visible={jejumConcluido}
          onClose={clearJejumConcluido}
        />

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
                <Ionicons name="hand-left" size={14} color={COLORS.textLight} />
                <Text style={styles.propositoInfoText}>3 níveis de jejum</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={22} color={COLORS.textLight} />
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
    fontSize: 30,
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
    fontSize: 19,
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
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: COLORS.primaryLight + '30',
    alignItems: 'center',
    justifyContent: 'center',
  },
  guiaContent: {
    flex: 1,
  },
  guiaItemTitulo: {
    fontSize: 16,
    ...FONTS.bold,
    color: COLORS.text,
    marginBottom: 4,
  },
  guiaItemTexto: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 21,
  },
  sectionTitle: {
    fontSize: 19,
    ...FONTS.bold,
    color: COLORS.text,
    paddingHorizontal: 20,
    marginBottom: 14,
  },

  // ── Card Jejum em Andamento ──────────────────────────────────────────
  proximoPassoCard: {
    marginHorizontal: 20,
    marginBottom: 24,
    borderRadius: 20,
    padding: 22,
    ...SHADOWS.large,
  },
  ppTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  ppBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  ppDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF7043',
  },
  ppBadgeText: {
    fontSize: 11,
    ...FONTS.bold,
    color: 'rgba(255,255,255,0.55)',
    letterSpacing: 1.1,
  },
  ppDotsRow: {
    flexDirection: 'row',
    gap: 5,
    alignItems: 'center',
  },
  ppStepDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  ppStepDotDone: {
    backgroundColor: '#66BB6A',
  },
  ppStepDotActive: {
    width: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 4,
  },
  ppHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  ppNomeTipo: {
    fontSize: 19,
    ...FONTS.bold,
    color: '#FFFFFF',
  },
  ppProgressoTexto: {
    fontSize: 19,
    ...FONTS.extrabold,
    color: '#66BB6A',
  },
  ppProgressBar: {
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 5,
  },
  ppProgressFill: {
    height: '100%',
    backgroundColor: '#66BB6A',
    borderRadius: 3,
  },
  ppDiasTexto: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.45)',
    ...FONTS.medium,
  },
  ppSeparador: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginVertical: 16,
  },
  ppAgoraRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  ppAgoraTag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 7,
    backgroundColor: 'rgba(255,112,67,0.25)',
    borderWidth: 1,
    borderColor: 'rgba(255,112,67,0.4)',
  },
  ppAgoraTagDone: {
    backgroundColor: 'rgba(102,187,106,0.25)',
    borderColor: 'rgba(102,187,106,0.4)',
  },
  ppAgoraTagText: {
    fontSize: 11,
    ...FONTS.bold,
    color: '#FF7043',
    letterSpacing: 0.8,
  },
  ppAgoraTagTextDone: {
    color: '#66BB6A',
  },
  ppTempoStep: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.5)',
    ...FONTS.medium,
  },
  ppOracaoNumero: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.4)',
    ...FONTS.medium,
    marginBottom: 8,
  },
  ppCurrentTitle: {
    fontSize: 22,
    ...FONTS.bold,
    color: '#FFFFFF',
    marginBottom: 6,
    lineHeight: 30,
  },
  ppCurrentVerseRef: {
    fontSize: 15,
    ...FONTS.bold,
    color: '#D4A017',
    marginBottom: 10,
  },
  ppCurrentDesc: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.72)',
    lineHeight: 23,
    marginBottom: 16,
  },

  // Botão "Ler oração completa"
  ppVerMaisBtn: {
    alignSelf: 'flex-start',
    marginBottom: 16,
    marginTop: -6,
  },
  ppVerMaisText: {
    fontSize: 13,
    ...FONTS.bold,
    color: '#D4A017',
  },

  // Botão marcar concluído
  ppMarcarButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 16,
    borderRadius: 14,
    backgroundColor: '#2E7D32',
    marginBottom: 14,
    shadowColor: '#66BB6A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.45,
    shadowRadius: 10,
    elevation: 8,
  },
  ppMarcarButtonDone: {
    backgroundColor: 'rgba(102,187,106,0.18)',
    borderWidth: 1.5,
    borderColor: '#66BB6A',
    shadowOpacity: 0,
    elevation: 0,
  },
  ppMarcarButtonText: {
    fontSize: 16,
    ...FONTS.bold,
    color: '#FFFFFF',
  },
  ppMarcarButtonTextDone: {
    color: '#66BB6A',
  },

  // Prévia próxima oração
  ppNextRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.08)',
    marginBottom: 14,
  },
  ppNextTitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.5)',
    ...FONTS.medium,
    flex: 1,
  },
  ppNextHorario: {
    color: 'rgba(255,255,255,0.3)',
  },

  // Botão de navegação
  ppNavButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 13,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  ppNavButtonText: {
    fontSize: 15,
    ...FONTS.bold,
    color: '#FFFFFF',
    flex: 1,
  },

  // ── Tipos de Jejum ───────────────────────────────────────────────────
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
  tipoIconCircle: {
    width: 52,
    height: 52,
    borderRadius: 15,
    backgroundColor: COLORS.primaryLight + '25',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tipoContent: {
    flex: 1,
    marginLeft: 14,
  },
  tipoTitulo: {
    fontSize: 17,
    ...FONTS.bold,
    color: COLORS.text,
  },
  tipoDescricao: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 2,
    lineHeight: 18,
  },
  tipoDuracaoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 5,
  },
  tipoDuracao: {
    fontSize: 13,
    color: COLORS.textLight,
  },
  tipoActiveBadge: {
    marginLeft: 8,
  },

  // ── Propósitos de Jejum ──────────────────────────────────────────────
  propositosDivider: {
    height: 1,
    backgroundColor: COLORS.borderLight,
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 24,
  },
  propositosSubtitle: {
    fontSize: 14,
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
    width: 76,
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
  },
  propositoContent: {
    flex: 1,
    padding: 14,
  },
  propositoTitulo: {
    fontSize: 16,
    ...FONTS.bold,
    color: COLORS.text,
    marginBottom: 2,
  },
  propositoDescricao: {
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 18,
    marginBottom: 6,
  },
  propositoInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  propositoInfoText: {
    fontSize: 12,
    color: COLORS.textLight,
    ...FONTS.medium,
  },
});
