import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Linking,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const DICAS = [
  {
    icone: 'search-outline',
    titulo: 'Procure no seu e-mail',
    descricao: 'Abra seu Gmail, Outlook ou Hotmail e pesquise por "Greenn" ou "A Sós com o Pai". O recibo do pagamento vai aparecer.',
  },
  {
    icone: 'file-tray-full-outline',
    titulo: 'Verifique a pasta de spam',
    descricao: 'Às vezes o e-mail de confirmação vai para spam. Dê uma olhada lá também.',
  },
  {
    icone: 'people-outline',
    titulo: 'Tente outros e-mails seus',
    descricao: 'Você pode ter mais de um e-mail. Pense em qual usou na hora de pagar: Gmail, Yahoo, iCloud...',
  },
  {
    icone: 'phone-portrait-outline',
    titulo: 'Veja no celular de quem fez a compra',
    descricao: 'Se outra pessoa fez a compra para você, o e-mail de confirmação foi para o celular dela.',
  },
];

export default function EsqueciEmailScreen({ navigation }) {
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
          {/* Voltar */}
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={22} color="#AABBCC" />
            <Text style={styles.backText}>Voltar</Text>
          </TouchableOpacity>

          {/* Ícone e título */}
          <View style={styles.header}>
            <View style={styles.iconCircle}>
              <Ionicons name="mail-open-outline" size={36} color="#D4A017" />
            </View>
            <Text style={styles.titulo}>Não lembra seu e-mail?</Text>
            <Text style={styles.subtitulo}>
              Siga as dicas abaixo para encontrar o e-mail usado na compra. Se não conseguir, fale com a gente.
            </Text>
          </View>

          {/* Dicas */}
          <View style={styles.dicasContainer}>
            {DICAS.map((dica, i) => (
              <View key={i} style={styles.dicaCard}>
                <View style={styles.dicaIconCircle}>
                  <Ionicons name={dica.icone} size={22} color="#D4A017" />
                </View>
                <View style={styles.dicaTextos}>
                  <Text style={styles.dicaTitulo}>{dica.titulo}</Text>
                  <Text style={styles.dicaDescricao}>{dica.descricao}</Text>
                </View>
              </View>
            ))}
          </View>

          {/* Divisor */}
          <View style={styles.divisor}>
            <View style={styles.divisorLinha} />
            <Text style={styles.divisorTexto}>ainda não achou?</Text>
            <View style={styles.divisorLinha} />
          </View>

          {/* Suporte */}
          <View style={styles.suporteContainer}>
            <Text style={styles.suporteTitulo}>Fale com o suporte</Text>
            <Text style={styles.suporteSubtitulo}>
              Nossa equipe encontra seu e-mail em menos de 24 horas.
            </Text>

            <TouchableOpacity
              style={styles.btnEmail}
              activeOpacity={0.85}
              onPress={() => Linking.openURL('mailto:suporte@asoscomopai.com?subject=Não lembro meu e-mail de acesso')}
            >
              <Ionicons name="mail-outline" size={20} color="#0D1B3E" />
              <Text style={styles.btnEmailText}>Enviar e-mail para o suporte</Text>
            </TouchableOpacity>

            <Text style={styles.suporteEmail}>suporte@asoscomopai.com</Text>
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
    flexGrow: 1,
    paddingBottom: 40,
  },

  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  backText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#AABBCC',
  },

  header: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 32,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(212,160,23,0.12)',
    borderWidth: 1.5,
    borderColor: 'rgba(212,160,23,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  titulo: {
    fontSize: 26,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitulo: {
    fontSize: 14,
    color: '#8899AA',
    textAlign: 'center',
    lineHeight: 21,
  },

  dicasContainer: {
    paddingHorizontal: 20,
    gap: 12,
  },
  dicaCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  dicaIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(212,160,23,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  dicaTextos: {
    flex: 1,
  },
  dicaTitulo: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  dicaDescricao: {
    fontSize: 13,
    color: '#8899AA',
    lineHeight: 19,
  },

  divisor: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginVertical: 28,
    gap: 12,
  },
  divisorLinha: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  divisorTexto: {
    fontSize: 12,
    color: '#8899AA',
    fontWeight: '500',
  },

  suporteContainer: {
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  suporteTitulo: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 6,
  },
  suporteSubtitulo: {
    fontSize: 13,
    color: '#8899AA',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 19,
  },
  btnEmail: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#D4A017',
    borderRadius: 14,
    height: 54,
    width: '100%',
    marginBottom: 12,
  },
  btnEmailText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0D1B3E',
  },
  suporteEmail: {
    fontSize: 12,
    color: '#8899AA',
  },
});
