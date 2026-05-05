import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Animated,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, SHADOWS, FONTS } from '../theme/colors';
import { useApp } from '../context/AppContext';
import DailyCard from '../components/DailyCard';
import MedalhaAnimacao from '../components/MedalhaAnimacao';

const STORAGE_NAME_KEY = '@perfil_nome';
const STORAGE_LAST_GREETING_KEY = '@ultima_saudacao_dia';

function getSaudacao(nome) {
  const hora = new Date().getHours();
  const primeiro = nome === 'Servo do Senhor' ? 'Servo do Senhor' : nome.split(' ')[0];
  if (hora >= 5 && hora < 12) {
    return {
      icone: 'cafe',
      cor: '#D4A017',
      titulo: `Hora do café com o A Sós! ☕`,
      mensagem: `Bom dia, ${primeiro}! Que este momento de comunhão com o Pai ilumine o seu dia.`,
    };
  }
  if (hora >= 12 && hora < 18) {
    return {
      icone: 'sunny',
      cor: '#FF9800',
      titulo: `Boa tarde, ${primeiro}!`,
      mensagem: 'A presença de Deus está com você em cada momento deste dia. Continue firme!',
    };
  }
  if (hora >= 18 && hora < 24) {
    return {
      icone: 'moon',
      cor: '#7B68EE',
      titulo: `Bem-vindo de volta, ${primeiro}!`,
      mensagem: 'Que linda a fidelidade de quem busca a Deus até a noite. Sua chama está acesa!',
    };
  }
  return {
    icone: 'star',
    cor: '#1E3A5F',
    titulo: `Que fé, ${primeiro}!`,
    mensagem: 'Mesmo na madrugada você busca a Deus. O Senhor vê e honra sua dedicação.',
  };
}

const bannerConexao = require('../../assets/banners/conexao.png');
const bannerVersiculo = require('../../assets/banners/versiculo.png');
const bannerDevocional = require('../../assets/banners/devocional.png');
const bannerOracao = require('../../assets/banners/oracao-guiada.png');

export default function HojeScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { streak, getWeekDays, isTaskCompleted, completeTask, newMedalUnlocked, clearNewMedal } = useApp();
  const weekDays = getWeekDays();

  const [saudacaoVisible, setSaudacaoVisible] = useState(false);
  const [saudacao, setSaudacao] = useState(null);
  const scaleAnim = useState(new Animated.Value(0.85))[0];

  useEffect(() => {
    async function verificarSaudacao() {
      const hoje = new Date().toDateString();
      const ultimoDia = await AsyncStorage.getItem(STORAGE_LAST_GREETING_KEY);
      if (ultimoDia === hoje) return;

      const nome = (await AsyncStorage.getItem(STORAGE_NAME_KEY)) || 'Servo do Senhor';
      setSaudacao(getSaudacao(nome));
      setSaudacaoVisible(true);
      await AsyncStorage.setItem(STORAGE_LAST_GREETING_KEY, hoje);

      Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, bounciness: 12 }).start();
    }
    verificarSaudacao();
  }, []);

  const tarefas = [
    {
      id: 'conexao',
      titulo: 'Conexão Diária',
      duracao: '1 min',
      icone: 'heart',
      cor: '#1E3A5F',
      screen: 'ConexaoDiaria',
      banner: bannerConexao,
    },
    {
      id: 'versiculo',
      titulo: 'Versículo Diário',
      duracao: '1 min',
      icone: 'book',
      cor: '#D4A017',
      screen: 'Versiculo',
      banner: bannerVersiculo,
    },
    {
      id: 'devocional',
      titulo: 'Devoção Diária',
      duracao: '3 min',
      icone: 'create',
      cor: '#2A4D7A',
      screen: 'Devocional',
      banner: bannerDevocional,
    },
    {
      id: 'oracao_guiada',
      titulo: 'Oração Guiada',
      duracao: '5 min',
      icone: 'hand-left',
      cor: '#0D1B3E',
      screen: 'OracaoGuiada',
      banner: bannerOracao,
    },
  ];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.titulo}>Plano Diário</Text>
          <View style={styles.headerRight}>
            <View style={styles.proBadge}>
              <Text style={styles.proText}>PRO</Text>
            </View>
            <View style={styles.streakBadge}>
              <Ionicons name="add" size={16} color={COLORS.primary} />
              <Text style={styles.streakText}>{streak}</Text>
              <Ionicons name="flame" size={16} color={COLORS.streak} />
            </View>
          </View>
        </View>

        {/* Week days */}
        <View style={styles.weekRow}>
          {weekDays.map((day) => (
            <View key={day.dateStr} style={styles.dayColumn}>
              <Text style={[styles.dayLabel, day.isToday && styles.dayLabelActive]}>
                {day.label}.
              </Text>
              <View
                style={[
                  styles.dayCircle,
                  day.isToday && styles.dayCircleToday,
                  day.isCompleted && styles.dayCircleCompleted,
                  day.isPast && !day.isCompleted && styles.dayCircleLocked,
                ]}
              >
                {day.isPast && !day.isCompleted && !day.isToday ? (
                  <Ionicons name="lock-closed" size={14} color={COLORS.locked} />
                ) : (
                  <Text
                    style={[
                      styles.dayNumber,
                      day.isToday && styles.dayNumberToday,
                      day.isCompleted && styles.dayNumberCompleted,
                    ]}
                  >
                    {day.date}
                  </Text>
                )}
              </View>
            </View>
          ))}
        </View>

        {/* Separator */}
        <View style={styles.separator} />

        {/* Task cards */}
        {tarefas.map((tarefa) => (
          <DailyCard
            key={tarefa.id}
            titulo={tarefa.titulo}
            duracao={tarefa.duracao}
            icone={tarefa.icone}
            cor={tarefa.cor}
            banner={tarefa.banner}
            concluido={isTaskCompleted(tarefa.id)}
            onPress={() =>
              navigation.navigate(tarefa.screen, {
                taskId: tarefa.id,
              })
            }
          />
        ))}

        {/* New content banner */}
        <TouchableOpacity style={styles.newContentCard}>
          {/* BANNER: 360x100px - Banner de novo conteudo */}
          <View style={styles.newContentInner}>
            <View style={styles.newContentIcon}>
              <Ionicons name="play-circle" size={44} color={COLORS.primary} />
            </View>
            <View style={styles.newContentText}>
              <Text style={styles.newContentTitle}>Novo conteúdo</Text>
              <Text style={styles.newContentTitle}>já disponível!</Text>
            </View>
          </View>
        </TouchableOpacity>
      </ScrollView>

      <MedalhaAnimacao
        medalha={newMedalUnlocked}
        visible={!!newMedalUnlocked}
        onClose={clearNewMedal}
      />

      {saudacao && (
        <Modal visible={saudacaoVisible} transparent animationType="fade">
          <View style={styles.saudacaoOverlay}>
            <Animated.View style={[styles.saudacaoCard, { transform: [{ scale: scaleAnim }] }]}>
              <View style={[styles.saudacaoIconCircle, { backgroundColor: saudacao.cor + '25' }]}>
                <Ionicons name={saudacao.icone} size={48} color={saudacao.cor} />
              </View>
              <Text style={styles.saudacaoTitulo}>{saudacao.titulo}</Text>
              <Text style={styles.saudacaoMensagem}>{saudacao.mensagem}</Text>
              <TouchableOpacity
                style={[styles.saudacaoBtn, { backgroundColor: saudacao.cor }]}
                onPress={() => setSaudacaoVisible(false)}
              >
                <Ionicons name="heart" size={18} color="#FFF" />
                <Text style={styles.saudacaoBtnText}>Começar o dia!</Text>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </Modal>
      )}
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
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  proBadge: {
    backgroundColor: '#1E3A5F',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  proText: {
    color: '#FFF',
    fontSize: 12,
    ...FONTS.extrabold,
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
    gap: 4,
  },
  streakText: {
    fontSize: 14,
    ...FONTS.bold,
    color: COLORS.text,
  },
  weekRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 12,
    marginBottom: 8,
  },
  dayColumn: {
    alignItems: 'center',
    gap: 6,
  },
  dayLabel: {
    fontSize: 13,
    color: COLORS.textSecondary,
    ...FONTS.medium,
  },
  dayLabelActive: {
    color: COLORS.text,
    ...FONTS.bold,
  },
  dayCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.surface,
    borderWidth: 1.5,
    borderColor: COLORS.borderLight,
  },
  dayCircleToday: {
    backgroundColor: COLORS.primaryLight + '40',
    borderColor: COLORS.primary,
  },
  dayCircleCompleted: {
    backgroundColor: COLORS.success,
    borderColor: COLORS.success,
  },
  dayCircleLocked: {
    backgroundColor: '#F5F5F5',
    borderColor: '#E0E0E0',
  },
  dayNumber: {
    fontSize: 15,
    ...FONTS.semibold,
    color: COLORS.textSecondary,
  },
  dayNumberToday: {
    color: COLORS.primaryDark,
    ...FONTS.bold,
  },
  dayNumberCompleted: {
    color: '#FFF',
  },
  separator: {
    height: 1,
    backgroundColor: COLORS.borderLight,
    marginHorizontal: 20,
    marginVertical: 16,
  },
  newContentCard: {
    marginHorizontal: 20,
    marginTop: 4,
    borderRadius: 16,
    backgroundColor: COLORS.surfaceWarm,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    overflow: 'hidden',
    ...SHADOWS.small,
  },
  newContentInner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 14,
  },
  newContentIcon: {
    width: 60,
    height: 60,
    borderRadius: 14,
    backgroundColor: COLORS.primaryLight + '30',
    alignItems: 'center',
    justifyContent: 'center',
  },
  newContentText: {
    flex: 1,
  },
  newContentTitle: {
    fontSize: 15,
    ...FONTS.bold,
    color: COLORS.primary,
  },
  saudacaoOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
  },
  saudacaoCard: {
    backgroundColor: COLORS.background,
    borderRadius: 28,
    padding: 32,
    alignItems: 'center',
    width: '100%',
    ...SHADOWS.large,
  },
  saudacaoIconCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  saudacaoTitulo: {
    fontSize: 22,
    ...FONTS.extrabold,
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 12,
  },
  saudacaoMensagem: {
    fontSize: 15,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 28,
  },
  saudacaoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 30,
    gap: 8,
    ...SHADOWS.medium,
  },
  saudacaoBtnText: {
    color: '#FFF',
    fontSize: 16,
    ...FONTS.bold,
  },
});
