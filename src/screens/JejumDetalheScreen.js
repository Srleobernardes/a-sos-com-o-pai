import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Platform,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, SHADOWS, FONTS } from '../theme/colors';
import { useApp } from '../context/AppContext';
import { Asset } from 'expo-asset';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

const PERIODO_ICONES = {
  'Manhã': 'sunny',
  'Meio da Manhã': 'partly-sunny',
  'Meio-dia': 'sunny',
  'Meio-Dia': 'sunny',
  'Tarde': 'cloudy',
  'Noite': 'moon',
  'Início': 'play-circle',
  'Encerramento': 'checkmark-done-circle',
  'Vigilia': 'eye',
  'Madrugada': 'moon',
  'Amanhecer': 'sunny',
  'Fronteira': 'flag',
  'Resistência': 'shield',
  'Renovação': 'refresh-circle',
  'Vitória': 'trophy',
  'Consagração Final': 'star',
};

export default function JejumDetalheScreen({ route, navigation }) {
  const insets = useSafeAreaInsets();
  const nivel = route.params?.nivel;
  const jejum = route.params?.jejum;
  const [expandedOracao, setExpandedOracao] = useState(null);
  const [downloading, setDownloading] = useState(false);
  const animValues = useRef(nivel.oracoes.map(() => new Animated.Value(0))).current;
  const { startJejumProposito, jejumAtivo } = useApp();

  const isEsteJejumAtivo =
    jejumAtivo?.tipo === 'proposito' &&
    jejumAtivo?.propositoId === jejum?.id &&
    jejumAtivo?.nivelId === nivel?.id;

  const handleIniciarJejum = () => {
    if (isEsteJejumAtivo) {
      navigation.navigate('JejumMain');
      return;
    }

    const confirmar = () => {
      startJejumProposito(jejum.id, nivel.id);
      navigation.navigate('JejumMain');
    };

    if (!jejumAtivo) {
      confirmar();
      return;
    }

    if (Platform.OS === 'web') {
      if (window.confirm('Você já tem um jejum ativo. Deseja iniciar este novo? O progresso atual será perdido.')) {
        confirmar();
      }
    } else {
      Alert.alert(
        'Jejum em andamento',
        'Você já tem um jejum ativo. Deseja iniciar este novo?',
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Sim, iniciar este', onPress: confirmar },
        ]
      );
    }
  };

  const handleDownloadPdf = async () => {
    if (!nivel.pdf || downloading) return;
    setDownloading(true);
    try {
      if (Platform.OS === 'web') {
        const asset = Asset.fromModule(nivel.pdf);
        await asset.downloadAsync();
        const link = document.createElement('a');
        link.href = asset.localUri || asset.uri;
        link.download = `${nivel.titulo.replace(/[^a-zA-Z0-9]/g, '-')}.pdf`;
        link.click();
      } else {
        const asset = Asset.fromModule(nivel.pdf);
        await asset.downloadAsync();
        const localUri = asset.localUri;
        const destPath = FileSystem.documentDirectory + `${nivel.titulo.replace(/[^a-zA-Z0-9]/g, '-')}.pdf`;
        await FileSystem.copyAsync({ from: localUri, to: destPath });
        await Sharing.shareAsync(destPath, { mimeType: 'application/pdf' });
      }
    } catch (e) {
      Alert.alert('Erro', 'Não foi possível baixar o PDF. Tente novamente.');
    } finally {
      setDownloading(false);
    }
  };

  const toggleOracao = (index) => {
    const isExpanding = expandedOracao !== index;
    if (expandedOracao !== null && expandedOracao !== index) {
      Animated.timing(animValues[expandedOracao], {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }).start();
    }
    Animated.timing(animValues[index], {
      toValue: isExpanding ? 1 : 0,
      duration: 250,
      useNativeDriver: false,
    }).start();
    setExpandedOracao(isExpanding ? index : null);
  };

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
          <Text style={styles.bannerTitulo}>{nivel.titulo}</Text>
          <Text style={styles.bannerSubtitulo}>{nivel.subtitulo}</Text>
        </View>

        {/* Description */}
        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <Ionicons name="information-circle" size={20} color={COLORS.primary} />
            <Text style={styles.sectionTitle}>Sobre este nível</Text>
          </View>
          <Text style={styles.bodyText}>{nivel.descricao}</Text>
        </View>

        {/* Duration & Intensity */}
        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <Ionicons name="time" size={20} color={COLORS.primary} />
            <Text style={styles.sectionTitle}>Duração e Intensidade</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="hourglass-outline" size={16} color={COLORS.textLight} />
            <Text style={styles.bodyText}>{nivel.duracao}</Text>
          </View>
          <View style={[styles.infoRow, { marginTop: 8 }]}>
            <Ionicons name="speedometer-outline" size={16} color={COLORS.textLight} />
            <Text style={styles.bodyText}>{nivel.intensidade}</Text>
          </View>
        </View>

        {/* Video card (if available) */}
        {jejum.video && (
          <TouchableOpacity
            style={[styles.videoCard, { borderColor: jejum.cor + '40' }]}
            onPress={() => navigation.navigate('VideoOracao', { video: jejum.video, cor: jejum.cor })}
            activeOpacity={0.8}
          >
            <View style={[styles.videoPlayCircle, { backgroundColor: jejum.cor }]}>
              <Ionicons name="play" size={28} color="#FFF" />
            </View>
            <View style={styles.videoCardContent}>
              <Text style={styles.videoCardTitle}>{jejum.video.titulo}</Text>
              <Text style={styles.videoCardSubtitle}>{jejum.video.subtitulo}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={jejum.cor} />
          </TouchableOpacity>
        )}

        {/* PDF download card (if available) */}
        {nivel.pdf && (
          <TouchableOpacity
            style={[styles.videoCard, { borderColor: '#E53935' + '40' }]}
            onPress={handleDownloadPdf}
            activeOpacity={0.8}
            disabled={downloading}
          >
            <View style={[styles.videoPlayCircle, { backgroundColor: '#E53935' }]}>
              <Ionicons name={downloading ? 'hourglass' : 'document-text'} size={26} color="#FFF" />
            </View>
            <View style={styles.videoCardContent}>
              <Text style={styles.videoCardTitle}>{downloading ? 'Baixando...' : 'Baixar PDF'}</Text>
              <Text style={styles.videoCardSubtitle}>Guia completo em PDF para download</Text>
            </View>
            <Ionicons name="download-outline" size={22} color="#E53935" />
          </TouchableOpacity>
        )}

        {/* Botão Iniciar */}
        <TouchableOpacity
          style={[
            styles.iniciarButton,
            isEsteJejumAtivo && styles.iniciarButtonAtivo,
            { backgroundColor: isEsteJejumAtivo ? COLORS.success : jejum.cor },
          ]}
          onPress={handleIniciarJejum}
          activeOpacity={isEsteJejumAtivo ? 1 : 0.85}
        >
          <Ionicons
            name={isEsteJejumAtivo ? 'checkmark-circle' : 'play-circle'}
            size={24}
            color="#FFF"
          />
          <Text style={styles.iniciarButtonText}>
            {isEsteJejumAtivo ? 'Jejum em Andamento' : 'Iniciar este Jejum'}
          </Text>
        </TouchableOpacity>

        {/* Prayers section */}
        <View style={styles.oracoesHeader}>
          <Ionicons name="hand-left" size={22} color={COLORS.primary} />
          <Text style={styles.oracoesTitle}>Orações do Dia</Text>
        </View>
        <Text style={styles.oracoesSubtitle}>
          {nivel.oracoes.length} momentos de oração ao longo do jejum
        </Text>

        {nivel.oracoes.map((oracao, index) => {
          const isExpanded = expandedOracao === index;
          return (
            <TouchableOpacity
              key={index}
              style={[styles.oracaoCard, isExpanded && styles.oracaoCardExpanded]}
              onPress={() => toggleOracao(index)}
              activeOpacity={0.8}
            >
              <View style={styles.oracaoHeader}>
                <View style={[styles.oracaoPeriodoCircle, { backgroundColor: jejum.cor + '20' }]}>
                  <Ionicons
                    name={PERIODO_ICONES[oracao.periodo] || 'time'}
                    size={20}
                    color={jejum.cor}
                  />
                </View>
                <View style={styles.oracaoInfo}>
                  <Text style={styles.oracaoPeriodo}>{oracao.periodo}</Text>
                  <Text style={styles.oracaoTitulo}>{oracao.titulo}</Text>
                  {(oracao.horario || oracao.duracao) && (
                    <View style={styles.oracaoMetaRow}>
                      {oracao.horario && (
                        <View style={[styles.oracaoMetaPill, { backgroundColor: jejum.cor + '15' }]}>
                          <Ionicons name="time-outline" size={11} color={jejum.cor} />
                          <Text style={[styles.oracaoMetaText, { color: jejum.cor }]}>{oracao.horario}</Text>
                        </View>
                      )}
                      {oracao.duracao && (
                        <View style={styles.oracaoMetaPill}>
                          <Ionicons name="hourglass-outline" size={11} color={COLORS.textSecondary} />
                          <Text style={styles.oracaoMetaText}>{oracao.duracao}</Text>
                        </View>
                      )}
                    </View>
                  )}
                </View>
                <Ionicons
                  name={isExpanded ? 'chevron-up' : 'chevron-down'}
                  size={20}
                  color={COLORS.textLight}
                />
              </View>

              {isExpanded && (
                <Animated.View style={styles.oracaoContent}>
                  <View style={styles.referenciaBox}>
                    <Ionicons name="book-outline" size={14} color={COLORS.primaryDark} />
                    <Text style={styles.referenciaText}>{oracao.referencia}</Text>
                  </View>
                  <Text style={styles.oracaoTexto}>{oracao.texto}</Text>
                </Animated.View>
              )}
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
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  beneficioRow: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: 10,
  },
  beneficioText: { fontSize: 14, color: COLORS.textSecondary, lineHeight: 20, flex: 1 },
  videoCard: {
    flexDirection: 'row', alignItems: 'center',
    marginHorizontal: 16, marginTop: 20, padding: 16,
    backgroundColor: COLORS.surface, borderRadius: 16,
    borderWidth: 1.5, ...SHADOWS.medium,
  },
  videoPlayCircle: {
    width: 52, height: 52, borderRadius: 26,
    alignItems: 'center', justifyContent: 'center',
  },
  videoCardContent: { flex: 1, marginLeft: 14 },
  videoCardTitle: { fontSize: 16, ...FONTS.bold, color: COLORS.text },
  videoCardSubtitle: { fontSize: 13, color: COLORS.textSecondary, marginTop: 2 },
  oracoesHeader: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    paddingHorizontal: 20, marginTop: 24, marginBottom: 4,
  },
  oracoesTitle: { fontSize: 20, ...FONTS.bold, color: COLORS.text },
  oracoesSubtitle: {
    fontSize: 13, color: COLORS.textLight, paddingHorizontal: 20, marginBottom: 14,
  },
  oracaoCard: {
    marginHorizontal: 16, marginBottom: 10, padding: 16,
    backgroundColor: COLORS.surface, borderRadius: 14,
    borderWidth: 1, borderColor: COLORS.borderLight, ...SHADOWS.small,
  },
  oracaoCardExpanded: {
    borderColor: COLORS.primary,
  },
  oracaoHeader: {
    flexDirection: 'row', alignItems: 'center',
  },
  oracaoPeriodoCircle: {
    width: 44, height: 44, borderRadius: 12,
    alignItems: 'center', justifyContent: 'center',
  },
  oracaoInfo: { flex: 1, marginLeft: 12 },
  oracaoPeriodo: { fontSize: 12, color: COLORS.textLight, ...FONTS.semibold },
  oracaoTitulo: { fontSize: 15, ...FONTS.bold, color: COLORS.text, marginTop: 2 },
  oracaoMetaRow: {
    flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 6, flexWrap: 'wrap',
  },
  oracaoMetaPill: {
    flexDirection: 'row', alignItems: 'center', gap: 3,
    paddingHorizontal: 7, paddingVertical: 2, borderRadius: 6,
    backgroundColor: COLORS.borderLight,
  },
  oracaoMetaText: { fontSize: 11, ...FONTS.semibold, color: COLORS.textSecondary },
  oracaoContent: { marginTop: 14, paddingTop: 14, borderTopWidth: 1, borderTopColor: COLORS.borderLight },
  referenciaBox: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: COLORS.primaryLight + '20', paddingHorizontal: 12,
    paddingVertical: 6, borderRadius: 8, alignSelf: 'flex-start', marginBottom: 12,
  },
  referenciaText: { fontSize: 12, ...FONTS.bold, color: COLORS.primaryDark },
  oracaoTexto: {
    fontSize: 15, color: COLORS.textSecondary, lineHeight: 24, fontStyle: 'italic',
  },
  iniciarButton: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
    marginHorizontal: 16, marginTop: 20, marginBottom: 4, paddingVertical: 16,
    borderRadius: 14, ...SHADOWS.medium,
  },
  iniciarButtonAtivo: {
    opacity: 0.9,
  },
  iniciarButtonText: {
    fontSize: 17, ...FONTS.bold, color: '#FFF',
  },
});
