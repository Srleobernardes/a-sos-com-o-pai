import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, SHADOWS, FONTS } from '../theme/colors';
import { useApp } from '../context/AppContext';
import { getConexaoDoDia } from '../data/conexao';

export default function ConexaoDiariaScreen({ route, navigation }) {
  const insets = useSafeAreaInsets();
  const { completeTask, uncompleteTask, isTaskCompleted } = useApp();
  const taskId = route.params?.taskId;
  const completed = isTaskCompleted(taskId);
  const conexao = getConexaoDoDia();
  const scaleAnim = useState(new Animated.Value(1))[0];

  const handleToggle = () => {
    Animated.sequence([
      Animated.spring(scaleAnim, { toValue: 1.15, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true }),
    ]).start();
    if (completed) {
      uncompleteTask(taskId);
    } else {
      completeTask(taskId);
      setTimeout(() => navigation.goBack(), 400);
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Conexão Diária</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.bannerArea}>
          <Ionicons name="heart" size={60} color="rgba(255,255,255,0.8)" />
          <Text style={styles.bannerText}>{conexao.titulo}</Text>
        </View>

        <View style={styles.contentCard}>
          <Text style={styles.sectionTitle}>Momento de Conexão</Text>
          {conexao.corpo.map((paragrafo, i) => (
            <Text key={i} style={styles.bodyText}>{paragrafo}</Text>
          ))}
          <View style={styles.quoteBox}>
            <Text style={styles.quoteText}>{conexao.frase}</Text>
          </View>
          <Text style={styles.bodyText}>
            Agora abra seus olhos. Você acabou de se conectar com o Criador do universo. Leve essa paz para o seu dia.
          </Text>
        </View>

        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
          <TouchableOpacity
            style={[styles.completeButton, completed && styles.completedButton]}
            onPress={handleToggle}
          >
            <Ionicons
              name={completed ? 'close-circle' : 'checkmark'}
              size={22}
              color="#FFF"
            />
            <Text style={styles.completeText}>
              {completed ? 'Desmarcar' : 'Marcar como concluído'}
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  backButton: {
    width: 40, height: 40, borderRadius: 20,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: COLORS.surface, ...SHADOWS.small,
  },
  headerTitle: { fontSize: 17, ...FONTS.bold, color: COLORS.text },
  scrollContent: { paddingBottom: 40 },
  bannerArea: {
    height: 200, backgroundColor: '#1E3A5F',
    alignItems: 'center', justifyContent: 'center',
  },
  bannerText: {
    color: '#FFF', fontSize: 20, ...FONTS.bold, marginTop: 10,
    textShadowColor: 'rgba(0,0,0,0.3)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 4,
  },
  contentCard: {
    margin: 20, padding: 24, backgroundColor: COLORS.surface,
    borderRadius: 20, ...SHADOWS.small,
  },
  sectionTitle: { fontSize: 20, ...FONTS.bold, color: COLORS.text, marginBottom: 16 },
  bodyText: { fontSize: 15, color: COLORS.textSecondary, lineHeight: 24, marginBottom: 12 },
  quoteBox: {
    backgroundColor: COLORS.primaryLight + '20', borderLeftWidth: 4,
    borderLeftColor: COLORS.primary, padding: 16, borderRadius: 8, marginVertical: 12,
  },
  quoteText: { fontSize: 16, color: COLORS.text, lineHeight: 26, fontStyle: 'italic', ...FONTS.medium },
  completeButton: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    marginHorizontal: 20, paddingVertical: 16, backgroundColor: COLORS.primary,
    borderRadius: 30, gap: 10, ...SHADOWS.medium,
  },
  completedButton: { backgroundColor: COLORS.success },
  completeText: { color: '#FFF', fontSize: 16, ...FONTS.bold },
});
