import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, SHADOWS, FONTS } from '../theme/colors';
import { useApp } from '../context/AppContext';
import { MEDALHAS } from '../data/medalhas';
import MedalhaCard from '../components/MedalhaCard';

export default function PerfilScreen() {
  const insets = useSafeAreaInsets();
  const {
    streak,
    maxStreak,
    totalOracoes,
    totalDevocionais,
    oracoesLidas,
    unlockedMedals,
    resetData,
  } = useApp();

  const handleReset = () => {
    Alert.alert(
      'Resetar progresso',
      'Tem certeza que deseja apagar todos os seus dados? Esta acao nao pode ser desfeita.',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Sim, resetar', style: 'destructive', onPress: resetData },
      ]
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.titulo}>Perfil</Text>
          <TouchableOpacity style={styles.settingsButton}>
            <Ionicons name="settings-outline" size={24} color={COLORS.text} />
          </TouchableOpacity>
        </View>

        {/* User info */}
        <View style={styles.userCard}>
          <View style={styles.avatarCircle}>
            <Ionicons name="person" size={40} color={COLORS.textLight} />
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>Servo do Senhor</Text>
            <TouchableOpacity style={styles.editNameBtn}>
              <Ionicons name="pencil" size={14} color={COLORS.textSecondary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Widget banner */}
        <View style={styles.widgetBanner}>
          <View style={styles.widgetIcon}>
            <Ionicons name="grid" size={24} color={COLORS.primary} />
          </View>
          <View style={styles.widgetContent}>
            <Text style={styles.widgetTitle}>Adicione um Widget para a Biblia Diaria</Text>
            <Text style={styles.widgetDesc}>
              Personalize sua tela inicial com versiculos biblicos diarios nas Configuracoes.
            </Text>
            <Text style={styles.widgetLink}>Veja como adicionar</Text>
          </View>
          <TouchableOpacity style={styles.widgetClose}>
            <Ionicons name="close" size={18} color={COLORS.textLight} />
          </TouchableOpacity>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <View style={[styles.statIconCircle, { backgroundColor: COLORS.streakLight }]}>
              <Ionicons name="flame" size={24} color={COLORS.streak} />
            </View>
            <Text style={styles.statValue}>{streak}</Text>
            <Text style={styles.statLabel}>Sequencia</Text>
          </View>
          <View style={styles.statCard}>
            <View style={[styles.statIconCircle, { backgroundColor: '#E3F2FD' }]}>
              <Ionicons name="trophy" size={24} color="#2196F3" />
            </View>
            <Text style={styles.statValue}>{maxStreak}</Text>
            <Text style={styles.statLabel}>Recorde</Text>
          </View>
          <View style={styles.statCard}>
            <View style={[styles.statIconCircle, { backgroundColor: '#F3E5F5' }]}>
              <Ionicons name="book" size={24} color="#9C27B0" />
            </View>
            <Text style={styles.statValue}>{totalDevocionais}</Text>
            <Text style={styles.statLabel}>Devocionais</Text>
          </View>
          <View style={styles.statCard}>
            <View style={[styles.statIconCircle, { backgroundColor: '#E8F5E9' }]}>
              <Ionicons name="hand-left" size={24} color={COLORS.success} />
            </View>
            <Text style={styles.statValue}>{oracoesLidas.length}</Text>
            <Text style={styles.statLabel}>Oracoes</Text>
          </View>
        </View>

        {/* Conquistas */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Conquistas</Text>
          <TouchableOpacity style={styles.verTudoBtn}>
            <Text style={styles.verTudoText}>Ver Tudo</Text>
            <Ionicons name="chevron-forward" size={16} color={COLORS.textSecondary} />
          </TouchableOpacity>
        </View>

        <FlatList
          data={MEDALHAS}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.medalhasRow}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <MedalhaCard
              medalha={item}
              conquistada={(unlockedMedals || []).includes(item.id)}
            />
          )}
        />

        {/* Preferences */}
        <Text style={styles.prefTitle}>Preferencias</Text>

        <TouchableOpacity style={styles.prefItem}>
          <Text style={styles.prefEmoji}>✍️</Text>
          <Text style={styles.prefText}>Solicitar recurso</Text>
          <View style={styles.novoBadge}>
            <Text style={styles.novoText}>NOVO</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={COLORS.textLight} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.prefItem}>
          <Ionicons name="notifications-outline" size={22} color={COLORS.text} />
          <Text style={styles.prefText}>Notificacoes</Text>
          <Ionicons name="chevron-forward" size={18} color={COLORS.textLight} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.prefItem}>
          <Ionicons name="moon-outline" size={22} color={COLORS.text} />
          <Text style={styles.prefText}>Tema</Text>
          <Ionicons name="chevron-forward" size={18} color={COLORS.textLight} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.prefItem}>
          <Ionicons name="share-social-outline" size={22} color={COLORS.text} />
          <Text style={styles.prefText}>Compartilhar app</Text>
          <Ionicons name="chevron-forward" size={18} color={COLORS.textLight} />
        </TouchableOpacity>

        {/* Reset */}
        <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
          <Ionicons name="refresh" size={18} color={COLORS.error} />
          <Text style={styles.resetText}>Resetar progresso</Text>
        </TouchableOpacity>

        <Text style={styles.versionText}>A sos com o Pai v1.0.0</Text>
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
  settingsButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: 14,
  },
  avatarCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#F0F0F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  userName: {
    fontSize: 22,
    ...FONTS.bold,
    color: COLORS.text,
  },
  editNameBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#F0F0F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  widgetBanner: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 24,
    padding: 16,
    backgroundColor: '#FFF9E6',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F0E6C0',
    gap: 12,
  },
  widgetIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: COLORS.primaryLight + '40',
    alignItems: 'center',
    justifyContent: 'center',
  },
  widgetContent: {
    flex: 1,
  },
  widgetTitle: {
    fontSize: 15,
    ...FONTS.bold,
    color: COLORS.text,
    marginBottom: 4,
  },
  widgetDesc: {
    fontSize: 12,
    color: COLORS.textSecondary,
    lineHeight: 17,
    marginBottom: 6,
  },
  widgetLink: {
    fontSize: 13,
    ...FONTS.bold,
    color: COLORS.text,
  },
  widgetClose: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 28,
    gap: 8,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    padding: 12,
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    ...SHADOWS.small,
  },
  statIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 20,
    ...FONTS.extrabold,
    color: COLORS.text,
  },
  statLabel: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 18,
    ...FONTS.bold,
    color: COLORS.text,
  },
  verTudoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  verTudoText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    ...FONTS.medium,
  },
  medalhasRow: {
    paddingHorizontal: 20,
    paddingBottom: 4,
  },
  prefTitle: {
    fontSize: 16,
    ...FONTS.semibold,
    color: COLORS.textSecondary,
    paddingHorizontal: 20,
    marginTop: 28,
    marginBottom: 12,
  },
  prefItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 8,
    padding: 16,
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    gap: 12,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  prefEmoji: {
    fontSize: 20,
  },
  prefText: {
    flex: 1,
    fontSize: 15,
    ...FONTS.semibold,
    color: COLORS.text,
  },
  novoBadge: {
    backgroundColor: '#E8F5E9',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  novoText: {
    fontSize: 11,
    ...FONTS.bold,
    color: COLORS.success,
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20,
    marginTop: 24,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.error + '30',
    gap: 8,
  },
  resetText: {
    fontSize: 14,
    ...FONTS.semibold,
    color: COLORS.error,
  },
  versionText: {
    textAlign: 'center',
    fontSize: 12,
    color: COLORS.textLight,
    marginTop: 16,
  },
});
