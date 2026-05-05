import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  ActivityIndicator, RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { supabase } from '../lib/supabase';
import { COLORS, FONTS } from '../theme/colors';

const STATUS_COLOR = { ativo: '#22c55e', trial: '#f59e0b', cancelado: '#ef4444' };
const PLANO_LABEL = { mensal: 'Mensal', semestral: 'Semestral', anual: 'Anual' };

const MESES = ['jan','fev','mar','abr','mai','jun','jul','ago','set','out','nov','dez'];
function formatarData(dateStr) {
  if (!dateStr) return 'Sem expiração';
  const d = new Date(dateStr);
  return `${d.getDate()} ${MESES[d.getMonth()]}/${d.getFullYear()}`;
}

export default function AdminScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [assinantes, setAssinantes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchAssinantes = useCallback(async () => {
    const { data } = await supabase
      .from('assinantes')
      .select('email, status, plano, assinatura_fim, created_at')
      .order('created_at', { ascending: false });
    setAssinantes(data || []);
    setLoading(false);
    setRefreshing(false);
  }, []);

  useEffect(() => { fetchAssinantes(); }, []);

  const onRefresh = () => { setRefreshing(true); fetchAssinantes(); };

  const ativos = assinantes.filter(a => a.status === 'ativo').length;
  const porPlano = assinantes.reduce((acc, a) => {
    acc[a.plano] = (acc[a.plano] || 0) + 1;
    return acc;
  }, {});

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.titulo}>Painel Admin</Text>
        <TouchableOpacity onPress={onRefresh} style={styles.backBtn}>
          <Ionicons name="refresh" size={22} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 40 }} />
      ) : (
        <ScrollView
          contentContainerStyle={styles.scroll}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />}
        >
          {/* Cards de resumo */}
          <View style={styles.resumoRow}>
            <View style={styles.resumoCard}>
              <Text style={styles.resumoNum}>{assinantes.length}</Text>
              <Text style={styles.resumoLabel}>Total</Text>
            </View>
            <View style={styles.resumoCard}>
              <Text style={[styles.resumoNum, { color: '#22c55e' }]}>{ativos}</Text>
              <Text style={styles.resumoLabel}>Ativos</Text>
            </View>
            <View style={styles.resumoCard}>
              <Text style={[styles.resumoNum, { color: COLORS.primary }]}>{porPlano.anual || 0}</Text>
              <Text style={styles.resumoLabel}>Anuais</Text>
            </View>
            <View style={styles.resumoCard}>
              <Text style={[styles.resumoNum, { color: COLORS.textSecondary }]}>{porPlano.mensal || 0}</Text>
              <Text style={styles.resumoLabel}>Mensais</Text>
            </View>
          </View>

          {/* Lista */}
          <Text style={styles.secTitle}>Assinantes ({assinantes.length})</Text>
          {assinantes.map((a, i) => (
            <View key={i} style={styles.card}>
              <View style={styles.cardTop}>
                <View style={[styles.statusDot, { backgroundColor: STATUS_COLOR[a.status] || '#999' }]} />
                <Text style={styles.email} numberOfLines={1}>{a.email}</Text>
              </View>
              <View style={styles.cardBottom}>
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{PLANO_LABEL[a.plano] || a.plano || '—'}</Text>
                </View>
                <Text style={styles.validade}>até {formatarData(a.assinatura_fim)}</Text>
              </View>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 14,
    borderBottomWidth: 1, borderBottomColor: COLORS.borderLight,
  },
  backBtn: { width: 40, alignItems: 'center' },
  titulo: { fontSize: 18, ...FONTS.bold, color: COLORS.text },
  scroll: { padding: 16, paddingBottom: 40 },
  resumoRow: { flexDirection: 'row', gap: 10, marginBottom: 24 },
  resumoCard: {
    flex: 1, backgroundColor: COLORS.surface, borderRadius: 12, padding: 12,
    alignItems: 'center',
  },
  resumoNum: { fontSize: 26, ...FONTS.bold, color: COLORS.text },
  resumoLabel: { fontSize: 11, color: COLORS.textLight, marginTop: 2, ...FONTS.regular },
  secTitle: { fontSize: 14, ...FONTS.semibold, color: COLORS.textSecondary, marginBottom: 10 },
  card: {
    backgroundColor: COLORS.surface, borderRadius: 12, padding: 14,
    marginBottom: 8,
  },
  cardTop: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  statusDot: { width: 8, height: 8, borderRadius: 4, marginRight: 8 },
  email: { fontSize: 13, ...FONTS.medium, color: COLORS.text, flex: 1 },
  cardBottom: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  badge: {
    backgroundColor: COLORS.primaryLight || '#FFF3CD', borderRadius: 6,
    paddingHorizontal: 8, paddingVertical: 3,
  },
  badgeText: { fontSize: 11, ...FONTS.semibold, color: COLORS.primary },
  validade: { fontSize: 12, color: COLORS.textLight, ...FONTS.regular },
});
