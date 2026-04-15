import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SHADOWS, FONTS } from '../theme/colors';

const { width } = Dimensions.get('window');

export default function DailyCard({ titulo, duracao, icone, cor, concluido, onPress, banner }) {
  const content = (
    <>
      <View style={styles.bannerOverlay}>
        <View style={styles.duracaoTag}>
          <Ionicons name="time-outline" size={14} color="#FFF" />
          <Text style={styles.duracaoText}>{duracao}</Text>
        </View>
        {concluido && (
          <View style={styles.checkBadge}>
            <Ionicons name="checkmark" size={18} color="#FFF" />
          </View>
        )}
      </View>
      {!banner && (
        <View style={styles.bannerContent}>
          <Ionicons name={icone || 'book'} size={40} color="rgba(255,255,255,0.3)" />
        </View>
      )}
      <Text style={styles.tituloOverBanner}>{titulo}</Text>
    </>
  );

  return (
    <TouchableOpacity
      style={[styles.card, concluido && styles.cardCompleted]}
      onPress={onPress}
      activeOpacity={0.85}
    >
      {banner ? (
        <ImageBackground
          source={banner}
          style={[styles.bannerArea]}
          imageStyle={styles.bannerImage}
          resizeMode="cover"
        >
          <View style={styles.bannerDarken} />
          {content}
        </ImageBackground>
      ) : (
        <View style={[styles.bannerArea, { backgroundColor: cor || COLORS.primary }]}>
          {content}
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
    ...SHADOWS.medium,
    backgroundColor: COLORS.surface,
  },
  cardCompleted: {
    opacity: 0.75,
  },
  bannerArea: {
    height: 160,
    justifyContent: 'flex-end',
    padding: 16,
    overflow: 'hidden',
  },
  bannerImage: {
    borderRadius: 16,
  },
  bannerDarken: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  bannerOverlay: {
    position: 'absolute',
    top: 12,
    left: 12,
    right: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 2,
  },
  bannerContent: {
    position: 'absolute',
    top: '35%',
    alignSelf: 'center',
    opacity: 0.5,
  },
  duracaoTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.45)',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
    gap: 4,
  },
  duracaoText: {
    color: '#FFF',
    fontSize: 12,
    ...FONTS.semibold,
  },
  checkBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.success,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tituloOverBanner: {
    color: '#FFF',
    fontSize: 22,
    ...FONTS.bold,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
});
