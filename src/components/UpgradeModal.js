import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { PLANOS } from '../data/planos';

const RECURSO_CONFIG = {
  jejumBiblico: {
    planoNecessario: 'semestral',
    titulo: 'Jejuns Bíblicos',
    descricao: 'Os Jejuns de Daniel e Ester são exclusivos do Plano Semestral ou superior.',
  },
  jejumIntencional: {
    planoNecessario: 'anual',
    titulo: 'Jejuns com Propósito',
    descricao: 'Os Jejuns Intencionais Guiados são exclusivos do Plano Anual.',
  },
  oracaoGlorificacao: {
    planoNecessario: 'semestral',
    titulo: 'Orações de Glorificação',
    descricao: 'Orações de Glorificação e Guiadas avançadas são exclusivas do Plano Semestral ou superior.',
  },
  medalhas: {
    planoNecessario: 'semestral',
    titulo: 'Medalhas e Conquistas',
    descricao: 'O sistema de medalhas e conquistas é exclusivo do Plano Semestral ou superior.',
  },
  comunidade: {
    planoNecessario: 'anual',
    titulo: 'Comunidade Exclusiva',
    descricao: 'A comunidade exclusiva de oração é exclusiva do Plano Anual.',
  },
  guia: {
    planoNecessario: 'anual',
    titulo: 'Guia Espiritual Completo',
    descricao: 'O guia espiritual completo é exclusivo do Plano Anual.',
  },
};

export default function UpgradeModal({ visible, onClose, recurso, navigation }) {
  const config = RECURSO_CONFIG[recurso] || {
    planoNecessario: 'anual',
    titulo: 'Recurso Premium',
    descricao: 'Este recurso é exclusivo de planos superiores.',
  };

  const plano = PLANOS.find((p) => p.id === config.planoNecessario);
  if (!plano) return null;

  const handleUpgrade = () => {
    onClose();
    navigation.navigate('Paywall');
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.card}>
          {/* Ícone */}
          <LinearGradient
            colors={['#D4A017', '#B8890F']}
            style={styles.iconCircle}
          >
            <Ionicons name="lock-closed" size={28} color="#0D1B3E" />
          </LinearGradient>

          {/* Textos */}
          <Text style={styles.titulo}>Recurso Bloqueado</Text>
          <Text style={styles.recursoNome}>{config.titulo}</Text>
          <Text style={styles.descricao}>{config.descricao}</Text>

          {/* Card do plano necessário */}
          <View style={styles.planoCard}>
            <View style={styles.planoHeader}>
              <View style={styles.planoBadge}>
                <Text style={styles.planoBadgeText}>PLANO {plano.nome.toUpperCase()}</Text>
              </View>
              <Text style={styles.planoPreco}>{plano.preco}<Text style={styles.planoPeriodo}>{plano.periodo}</Text></Text>
            </View>

            <ScrollView style={styles.featuresList} scrollEnabled={false}>
              {plano.features.map((f, i) => (
                <View key={i} style={styles.featureRow}>
                  <Ionicons name="checkmark-circle" size={15} color="#D4A017" />
                  <Text style={styles.featureText}>{f}</Text>
                </View>
              ))}
            </ScrollView>
          </View>

          {/* Botões */}
          <TouchableOpacity onPress={handleUpgrade} activeOpacity={0.85} style={styles.btnUpgrade}>
            <LinearGradient
              colors={['#D4A017', '#B8890F']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.btnUpgradeGradient}
            >
              <Ionicons name="arrow-up-circle" size={20} color="#0D1B3E" />
              <Text style={styles.btnUpgradeText}>Fazer Upgrade Agora</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity onPress={onClose} style={styles.btnFechar}>
            <Text style={styles.btnFecharText}>Agora não</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  card: {
    backgroundColor: '#0D1B3E',
    borderRadius: 24,
    padding: 28,
    width: '100%',
    borderWidth: 1,
    borderColor: 'rgba(212,160,23,0.3)',
    alignItems: 'center',
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  titulo: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  recursoNome: {
    fontSize: 15,
    fontWeight: '600',
    color: '#D4A017',
    marginBottom: 10,
  },
  descricao: {
    fontSize: 13,
    color: '#8899AA',
    textAlign: 'center',
    lineHeight: 19,
    marginBottom: 20,
  },
  planoCard: {
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(212,160,23,0.25)',
    marginBottom: 20,
  },
  planoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  planoBadge: {
    backgroundColor: '#D4A017',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  planoBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#0D1B3E',
    letterSpacing: 0.5,
  },
  planoPreco: {
    fontSize: 18,
    fontWeight: '800',
    color: '#D4A017',
  },
  planoPeriodo: {
    fontSize: 12,
    fontWeight: '400',
    color: '#8899AA',
  },
  featuresList: {
    maxHeight: 160,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 6,
  },
  featureText: {
    fontSize: 12,
    color: '#D0DCE8',
    flex: 1,
    lineHeight: 17,
  },
  btnUpgrade: {
    width: '100%',
    marginBottom: 10,
  },
  btnUpgradeGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 52,
    borderRadius: 14,
  },
  btnUpgradeText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0D1B3E',
  },
  btnFechar: {
    paddingVertical: 8,
  },
  btnFecharText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#8899AA',
  },
});
