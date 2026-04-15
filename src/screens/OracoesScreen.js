import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, FONTS } from '../theme/colors';
import { useApp } from '../context/AppContext';
import { ORACOES } from '../data/oracoes';
import OracaoCard from '../components/OracaoCard';

export default function OracoesScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { oracoesLidas } = useApp();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.titulo}>Oracoes Sagradas</Text>
          <Text style={styles.subtitulo}>
            {oracoesLidas.length} de {ORACOES.length} oracoes lidas
          </Text>
        </View>

        {/* Progress */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${(oracoesLidas.length / ORACOES.length) * 100}%`,
                },
              ]}
            />
          </View>
        </View>

        {ORACOES.map((oracao) => (
          <OracaoCard
            key={oracao.id}
            oracao={oracao}
            lida={oracoesLidas.includes(oracao.id)}
            onPress={() => navigation.navigate('OracaoDetalhe', { oracao })}
          />
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
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
  },
  titulo: {
    fontSize: 28,
    ...FONTS.extrabold,
    color: COLORS.text,
  },
  subtitulo: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  progressContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
    marginTop: 8,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#F0F0F0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 3,
  },
});
