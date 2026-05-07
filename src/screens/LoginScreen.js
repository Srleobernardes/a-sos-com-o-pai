import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  SafeAreaView,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  ScrollView,
  Linking,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';

// Detecta se está rodando no iOS Safari fora do modo PWA instalado
const isIOSSafariNaoBrowser = Platform.OS === 'web' &&
  typeof window !== 'undefined' &&
  /iphone|ipad|ipod/i.test(window.navigator.userAgent) &&
  window.navigator.standalone !== true;

const logoIcon = require('../../assets/icons/logo.png');

const ERROS = {
  SEM_CONEXAO: {
    icone: 'wifi-outline',
    cor: '#FF7043',
    titulo: 'Sem conexão',
    mensagem: 'Verifique sua internet e tente novamente.',
  },
  SERVIDOR_INDISPONIVEL: {
    icone: 'cloud-offline-outline',
    cor: '#FF7043',
    titulo: 'Serviço indisponível',
    mensagem: 'Nossos servidores estão temporariamente fora. Tente novamente em alguns instantes.',
  },
  EMAIL_NAO_ENCONTRADO: {
    icone: 'mail-unread-outline',
    cor: '#8899AA',
    titulo: 'E-mail não encontrado',
    mensagem: 'Verifique se usou o mesmo e-mail do checkout. Cada letra importa!',
  },
  ASSINATURA_INATIVA: {
    icone: 'alert-circle-outline',
    cor: '#FF7043',
    titulo: 'Assinatura inativa',
    mensagem: 'Sua assinatura está inativa ou expirada. Entre em contato com o suporte.',
    suporte: true,
  },
  DEFAULT: {
    icone: 'alert-circle-outline',
    cor: '#FF7043',
    titulo: 'Erro ao acessar',
    mensagem: 'Não foi possível acessar. Tente novamente.',
  },
};

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState(null);
  const { login } = useApp();

  const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  const handleChangeEmail = (text) => {
    setEmail(text);
    if (erro) setErro(null);
  };

  const handleEntrar = async () => {
    if (!emailValido) {
      setErro({ codigo: 'DEFAULT', mensagem: 'Por favor, insira um e-mail válido.' });
      return;
    }

    setCarregando(true);
    setErro(null);
    try {
      await login(email.trim().toLowerCase());
    } catch (e) {
      setErro({ codigo: e.code || 'DEFAULT' });
    } finally {
      setCarregando(false);
    }
  };

  const erroConfig = erro ? (ERROS[erro.codigo] || ERROS.DEFAULT) : null;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={['#0D1B3E', '#1E3A5F', '#0D1B3E']}
        style={StyleSheet.absoluteFillObject}
      />

      <SafeAreaView style={styles.safe}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <ScrollView
            contentContainerStyle={styles.scroll}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* Back button */}
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
              <Ionicons name="arrow-back" size={22} color="#AABBCC" />
              <Text style={styles.backText}>Voltar</Text>
            </TouchableOpacity>

            {/* Aviso PWA - só aparece no iOS Safari fora do app instalado */}
            {isIOSSafariNaoBrowser && (
              <View style={styles.pwaBanner}>
                <Ionicons name="warning-outline" size={18} color="#D4A017" />
                <Text style={styles.pwaBannerText}>
                  Você está no Safari. Para não perder seu acesso, abra o app pelo ícone na tela de início do celular.
                </Text>
              </View>
            )}

            {/* Logo */}
            <View style={styles.logoContainer}>
              <Image source={logoIcon} style={styles.logo} resizeMode="contain" />
              <Text style={styles.appName}>A Sós com o Pai</Text>
            </View>

            {/* Content */}
            <View style={styles.content}>
              <Text style={styles.titulo}>Acesse sua conta</Text>
              <Text style={styles.subtitulo}>
                Use o e-mail que você cadastrou no checkout para entrar no app.
              </Text>

              {/* Input com borda vermelha quando há erro */}
              <View style={[
                styles.inputContainer,
                erroConfig && { borderColor: erroConfig.cor },
              ]}>
                <Ionicons
                  name="mail-outline"
                  size={20}
                  color={erroConfig ? erroConfig.cor : '#8899AA'}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="seu@email.com"
                  placeholderTextColor="#8899AA"
                  value={email}
                  onChangeText={handleChangeEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  returnKeyType="done"
                  onSubmitEditing={handleEntrar}
                />
              </View>

              {/* Card de erro inline */}
              {erroConfig && (
                <View style={[styles.erroCard, { borderColor: erroConfig.cor + '50' }]}>
                  <Ionicons name={erroConfig.icone} size={20} color={erroConfig.cor} style={styles.erroIcone} />
                  <View style={styles.erroTextos}>
                    <Text style={[styles.erroTitulo, { color: erroConfig.cor }]}>{erroConfig.titulo}</Text>
                    <Text style={styles.erroMensagem}>{erroConfig.mensagem}</Text>
                    {erroConfig.suporte && (
                      <TouchableOpacity onPress={() => Linking.openURL('mailto:suporte@asoscomopai.com')}>
                        <Text style={styles.erroSuporte}>Falar com o suporte →</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              )}

              <TouchableOpacity
                activeOpacity={0.85}
                onPress={handleEntrar}
                disabled={carregando || !emailValido}
                style={styles.btnWrapper}
              >
                <LinearGradient
                  colors={emailValido ? ['#D4A017', '#B8890F'] : ['#4A5568', '#4A5568']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.btnEntrar}
                >
                  {carregando ? (
                    <ActivityIndicator color="#0D1B3E" />
                  ) : (
                    <>
                      <Text style={[styles.btnText, !emailValido && styles.btnTextDisabled]}>
                        Acessar
                      </Text>
                      {emailValido && (
                        <Ionicons name="arrow-forward" size={20} color="#0D1B3E" />
                      )}
                    </>
                  )}
                </LinearGradient>
              </TouchableOpacity>

              <View style={styles.infoBox}>
                <Ionicons name="information-circle-outline" size={16} color="#8899AA" />
                <Text style={styles.infoText}>
                  Ainda não fez o checkout? Volte e escolha um plano para começar seus 7 dias grátis.
                </Text>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
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
  keyboardView: {
    flex: 1,
  },
  scroll: {
    flexGrow: 1,
    paddingBottom: 40,
  },

  pwaBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginHorizontal: 20,
    marginTop: 12,
    backgroundColor: 'rgba(212, 160, 23, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(212, 160, 23, 0.35)',
    borderRadius: 12,
    padding: 12,
  },
  pwaBannerText: {
    flex: 1,
    fontSize: 13,
    color: '#D4A017',
    lineHeight: 18,
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

  logoContainer: {
    alignItems: 'center',
    paddingTop: 32,
    paddingBottom: 40,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 12,
  },
  appName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },

  content: {
    paddingHorizontal: 24,
  },
  titulo: {
    fontSize: 26,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  subtitulo: {
    fontSize: 14,
    fontWeight: '400',
    color: '#8899AA',
    lineHeight: 20,
    marginBottom: 32,
  },

  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.15)',
    borderRadius: 14,
    paddingHorizontal: 16,
    height: 54,
    marginBottom: 12,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontWeight: '400',
    color: '#FFFFFF',
    height: '100%',
  },

  erroCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
    gap: 10,
  },
  erroIcone: {
    marginTop: 1,
    flexShrink: 0,
  },
  erroTextos: {
    flex: 1,
  },
  erroTitulo: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 2,
  },
  erroMensagem: {
    fontSize: 13,
    color: '#AABBCC',
    lineHeight: 18,
  },
  erroSuporte: {
    fontSize: 13,
    fontWeight: '600',
    color: '#D4A017',
    marginTop: 6,
  },

  btnWrapper: {
    marginBottom: 24,
  },
  btnEntrar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 54,
    borderRadius: 14,
  },
  btnText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0D1B3E',
  },
  btnTextDisabled: {
    color: '#8899AA',
  },

  infoBox: {
    flexDirection: 'row',
    gap: 8,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    padding: 14,
    alignItems: 'flex-start',
  },
  infoText: {
    flex: 1,
    fontSize: 12,
    fontWeight: '400',
    color: '#8899AA',
    lineHeight: 18,
  },
});
