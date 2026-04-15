import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SHADOWS, FONTS } from '../theme/colors';

export default function OracaoCard({ oracao, onPress, lida }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      {/* BANNER: 360x120px - Substitua pelo seu banner */}
      <View style={[styles.iconArea, { backgroundColor: oracao.cor }]}>
        <Ionicons name={oracao.icone} size={32} color="rgba(255,255,255,0.9)" />
      </View>
      <View style={styles.content}>
        <Text style={styles.titulo}>{oracao.titulo}</Text>
        <Text style={styles.subtitulo} numberOfLines={1}>
          {oracao.subtitulo}
        </Text>
        <View style={styles.meta}>
          <Ionicons name="time-outline" size={14} color={COLORS.textLight} />
          <Text style={styles.duracao}>{oracao.duracao}</Text>
          {lida && (
            <View style={styles.lidaBadge}>
              <Ionicons name="checkmark" size={12} color="#FFF" />
            </View>
          )}
        </View>
      </View>
      <Ionicons name="chevron-forward" size={20} color={COLORS.textLight} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    marginHorizontal: 20,
    marginBottom: 12,
    borderRadius: 16,
    padding: 12,
    ...SHADOWS.small,
  },
  iconArea: {
    width: 56,
    height: 56,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    marginLeft: 14,
  },
  titulo: {
    fontSize: 16,
    ...FONTS.bold,
    color: COLORS.text,
    marginBottom: 2,
  },
  subtitulo: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  duracao: {
    fontSize: 12,
    color: COLORS.textLight,
  },
  lidaBadge: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: COLORS.success,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 6,
  },
});
