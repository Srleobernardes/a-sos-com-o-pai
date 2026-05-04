import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Linking,
  Image,
  SafeAreaView,
  StatusBar,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { PLANOS } from '../data/planos';

const { width } = Dimensions.get('window');
const logoIcon = require('../../assets/icons/logo.png');

const CHECK_COLOR = '#D4A017';

export default function PaywallScreen({ navigation }) {
  const [planSelecionado, setPlanSelecionado] = useState('semestral');
  const { savePendingPlano } = useApp();

  const planoAtual = PLANOS.find((p) => p.id === planSelecionado);

  const handleAssinar = async () => {
    await savePendingPlano(planSelecionado);
    try {
      await Linking.openURL(planoAtual.checkoutUrl);
    } catch {
      // URL placeholder — quando Hubla estiver configurado isso vai funcionar
    }
  };

  const handleJaTenhoAcesso = () => {
    navigation.navigate('Login');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <LinearGradient
        colors={['#0D1B3E', '#1E3A5F', '#0D1B3E']}
        style={StyleSheet.absoluteFillObject}
      />

      <SafeAreaView style={styles.safe}>
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <Image source={logoIcon} style={styles.logo} resizeMode="contain" />
            <Text style={styles.appName}>A Sós com o Pai</Text>
            <Text style={styles.tagline}>Sua jornada espiritual começa aqui</Text>

            <View style={styles.trialBadge}>
              <Ionicons name="gift-outline" size={16} color="#D4A017" />
              <Text style={styles.trialText}>7 dias grátis — cancele quando quiser</Text>
            </View>
          </View>

          {/* Plan Cards */}
          <View style={styles.plansContainer}>
            {PLANOS.map((plano) => {
              const selecionado = planSelecionado === plano.id;
              return (
                <TouchableOpacity
                  key={plano.id}
                  activeOpacity={0.85}
                  onPress={() => setPlanSelecionado(plano.id)}
                  style={[
                    styles.planCard,
                    selecionado && styles.planCardSelected,
                    plano.destaque && !selecionado && styles.planCardDestaque,
                  ]}
                >
                  {/* Tag badge */}
                  {plano.tag && (
                    <View style={[styles.tagBadge, plano.destaque ? styles.tagBadgeGold : styles.tagBadgeNavy]}>
                      <Text style={[styles.tagText, plano.destaque ? styles.tagTextGold : styles.tagTextNavy]}>
                        {plano.tag}
                      </Text>
                    </View>
                  )}

                  {/* Radio + Plan name */}
                  <View style={styles.planHeader}>
                    <View style={[styles.radio, selecionado && styles.radioSelected]}>
                      {selecionado && <View style={styles.radioDot} />}
                    </View>
                    <View style={styles.planTitleBlock}>
                      <Text style={styles.planNome}>{plano.nome}</Text>
                      <Text style={styles.planSubtitulo}>{plano.subtitulo}</Text>
                    </View>
                  </View>

                  {/* Price */}
                  <View style={styles.priceBlock}>
                    <Text style={styles.precoOriginal}>{plano.precoOriginal}</Text>
                    <View style={styles.priceRow}>
                      <Text style={styles.preco}>{plano.preco}</Text>
                      <Text style={styles.periodo}>{plano.periodo}</Text>
                    </View>
                    {plano.economia && (
                      <Text style={styles.economia}>{plano.economia}</Text>
                    )}
                  </View>

                  {/* Features */}
                  <View style={styles.featuresList}>
                    {plano.features.map((f, i) => (
                      <View key={i} style={styles.featureRow}>
                        <Ionicons name="checkmark-circle" size={16} color={CHECK_COLOR} style={styles.checkIcon} />
                        <Text style={styles.featureText}>{f}</Text>
                      </View>
                    ))}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* CTA */}
          <View style={styles.ctaContainer}>
            <TouchableOpacity activeOpacity={0.85} onPress={handleAssinar}>
              <LinearGradient
                colors={['#D4A017', '#B8890F']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.ctaButton}
              >
                <Text style={styles.ctaText}>Começar 7 dias grátis</Text>
                <Ionicons name="arrow-forward" size={20} color="#0D1B3E" />
              </LinearGradient>
            </TouchableOpacity>

            <Text style={styles.ctaDisclaimer}>
              Após o trial, você será cobrado {planoAtual?.preco}{planoAtual?.periodo}.{'\n'}
              Cancele a qualquer momento.
            </Text>

            <TouchableOpacity onPress={handleJaTenhoAcesso} style={styles.loginLink}>
              <Text style={styles.loginLinkText}>Já tenho acesso — Entrar</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D1B3E',
  },
  safe: {
    flex: 1,
  },
  scroll: {
    paddingBottom: 40,
  },

  // Header
  header: {
    alignItems: 'center',
    paddingTop: 32,
    paddingBottom: 24,
    paddingHorizontal: 24,
  },
  logo: {
    width: 72,
    height: 72,
    borderRadius: 36,
    marginBottom: 12,
  },
  appName: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  tagline: {
    fontSize: 14,
    fontWeight: '400',
    color: '#8899AA',
    marginBottom: 16,
  },
  trialBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(212, 160, 23, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(212, 160, 23, 0.4)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  trialText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#D4A017',
  },

  // Plans
  plansContainer: {
    paddingHorizontal: 16,
    gap: 12,
  },
  planCard: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.1)',
    position: 'relative',
  },
  planCardSelected: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderColor: '#D4A017',
  },
  planCardDestaque: {
    borderColor: 'rgba(212, 160, 23, 0.35)',
  },

  // Tag
  tagBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 20,
    marginBottom: 10,
  },
  tagBadgeGold: {
    backgroundColor: '#D4A017',
  },
  tagBadgeNavy: {
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  tagText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
  },
  tagTextGold: {
    color: '#0D1B3E',
  },
  tagTextNavy: {
    color: '#FFFFFF',
  },

  // Plan header
  planHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  radioSelected: {
    borderColor: '#D4A017',
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#D4A017',
  },
  planTitleBlock: {
    flex: 1,
  },
  planNome: {
    fontSize: 17,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  planSubtitulo: {
    fontSize: 12,
    fontWeight: '400',
    color: '#8899AA',
    marginTop: 1,
  },

  // Price
  priceBlock: {
    marginBottom: 14,
    paddingLeft: 32,
  },
  precoOriginal: {
    fontSize: 12,
    fontWeight: '400',
    color: '#8899AA',
    textDecorationLine: 'line-through',
    marginBottom: 2,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  preco: {
    fontSize: 22,
    fontWeight: '800',
    color: '#D4A017',
  },
  periodo: {
    fontSize: 13,
    fontWeight: '500',
    color: '#AABBCC',
  },
  economia: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4CAF50',
    marginTop: 2,
  },

  // Features
  featuresList: {
    gap: 6,
    paddingLeft: 32,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  checkIcon: {
    marginTop: 1,
  },
  featureText: {
    fontSize: 13,
    fontWeight: '400',
    color: '#D0DCE8',
    flex: 1,
    lineHeight: 18,
  },

  // CTA
  ctaContainer: {
    paddingHorizontal: 16,
    paddingTop: 24,
    alignItems: 'center',
  },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 14,
    width: width - 32,
  },
  ctaText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0D1B3E',
    letterSpacing: 0.3,
  },
  ctaDisclaimer: {
    fontSize: 11,
    fontWeight: '400',
    color: '#8899AA',
    textAlign: 'center',
    marginTop: 10,
    lineHeight: 16,
  },
  loginLink: {
    marginTop: 20,
    paddingVertical: 8,
  },
  loginLinkText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#AABBCC',
    textDecorationLine: 'underline',
  },
});
