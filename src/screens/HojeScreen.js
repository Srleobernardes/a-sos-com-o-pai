import React from 'react';
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
import DailyCard from '../components/DailyCard';
import MedalhaAnimacao from '../components/MedalhaAnimacao';

const bannerConexao = require('../../assets/banners/conexao.png');
const bannerVersiculo = require('../../assets/banners/versiculo.png');
const bannerDevocional = require('../../assets/banners/devocional.png');
const bannerOracao = require('../../assets/banners/oracao-guiada.png');

export default function HojeScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { streak, getWeekDays, isTaskCompleted, completeTask, newMedalUnlocked, clearNewMedal } = useApp();
  const weekDays = getWeekDays();

  const tarefas = [
    {
      id: 'conexao',
      titulo: 'Conexao Diaria',
      duracao: '1 min',
      icone: 'heart',
      cor: '#1E3A5F',
      screen: 'ConexaoDiaria',
      banner: bannerConexao,
    },
    {
      id: 'versiculo',
      titulo: 'Versiculo Diario',
      duracao: '1 min',
      icone: 'book',
      cor: '#D4A017',
      screen: 'Versiculo',
      banner: bannerVersiculo,
    },
    {
      id: 'devocional',
      titulo: 'Devoção Diaria',
      duracao: '3 min',
      icone: 'create',
      cor: '#2A4D7A',
      screen: 'Devocional',
      banner: bannerDevocional,
    },
    {
      id: 'oracao_guiada',
      titulo: 'Oracao Guiada',
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
          <Text style={styles.titulo}>Plano Diario</Text>
          <View style={styles.headerRight}>
            <View style={styles.proBadge}>
              <Text style={styles.proText}>PRO</Text>
            </View>
            <View style={styles.streakBadge}>
              <Ionicons name="cross" size={16} color={COLORS.primary} />
              <Text style={styles.streakText}>{streak}</Text>
              <Ionicons name="calendar" size={16} color={COLORS.textSecondary} />
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
              <Text style={styles.newContentTitle}>Novo conteudo de</Text>
              <Text style={styles.newContentTitle}>assistir ja disponivel!</Text>
            </View>
          </View>
        </TouchableOpacity>
      </ScrollView>

      <MedalhaAnimacao
        medalha={newMedalUnlocked}
        visible={!!newMedalUnlocked}
        onClose={clearNewMedal}
      />
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
});
