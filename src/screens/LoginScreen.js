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
  Alert,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';

const logoIcon = require('../../assets/icons/logo.png');

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [carregando, setCarregando] = useState(false);
  const { login } = useApp();

  const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  const handleEntrar = async () => {
    if (!emailValido) {
      Alert.alert('E-mail inválido', 'Por favor, insira um e-mail válido.');
      return;
    }

    setCarregando(true);
    try {
      await login(email.trim().toLowerCase());
      // Navegação automática pelo AppNavigator ao detectar isAuthenticated
    } catch (e) {
      Alert.alert('Acesso negado', e.message || 'Não foi possível acessar. Tente novamente.');
    } finally {
      setCarregando(false);
    }
  };

  const handleVoltar = () => {
    navigation.goBack();
  };

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
            <TouchableOpacity onPress={handleVoltar} style={styles.backButton}>
              <Ionicons name="arrow-back" size={22} color="#AABBCC" />
              <Text style={styles.backText}>Voltar</Text>
            </TouchableOpacity>

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

              <View style={styles.inputContainer}>
                <Ionicons name="mail-outline" size={20} color="#8899AA" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="seu@email.com"
                  placeholderTextColor="#8899AA"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  returnKeyType="done"
                  onSubmitEditing={handleEntrar}
                />
              </View>

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
    marginBottom: 16,
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
