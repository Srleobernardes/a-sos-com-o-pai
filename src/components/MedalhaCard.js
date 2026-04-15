import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SHADOWS, FONTS } from '../theme/colors';

export default function MedalhaCard({ medalha, conquistada }) {
  return (
    <View style={[styles.card, !conquistada && styles.cardLocked]}>
      <View
        style={[
          styles.iconContainer,
          { backgroundColor: conquistada ? medalha.corFundo : '#F0F0F0' },
        ]}
      >
        <Ionicons
          name={medalha.icone}
          size={36}
          color={conquistada ? medalha.cor : COLORS.locked}
        />
      </View>
      <Text style={[styles.titulo, !conquistada && styles.tituloLocked]} numberOfLines={1}>
        {medalha.titulo}
      </Text>
      <Text style={styles.descricao} numberOfLines={2}>
        {medalha.descricao}
      </Text>
      {conquistada && (
        <View style={styles.conquistadaBadge}>
          <Ionicons name="checkmark-circle" size={16} color={COLORS.success} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 140,
    alignItems: 'center',
    padding: 16,
    marginRight: 12,
    borderRadius: 16,
    backgroundColor: COLORS.surface,
    ...SHADOWS.small,
  },
  cardLocked: {
    opacity: 0.6,
  },
  iconContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  titulo: {
    fontSize: 13,
    ...FONTS.bold,
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 4,
  },
  tituloLocked: {
    color: COLORS.textLight,
  },
  descricao: {
    fontSize: 11,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 14,
  },
  conquistadaBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
});
