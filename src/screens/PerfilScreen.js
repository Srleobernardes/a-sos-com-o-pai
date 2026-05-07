import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Alert,
  TextInput,
  Image,
  Modal,
  KeyboardAvoidingView,
  Platform,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS, SHADOWS, FONTS } from '../theme/colors';
import { useApp } from '../context/AppContext';
import { MEDALHAS } from '../data/medalhas';
import MedalhaCard from '../components/MedalhaCard';
import { getPlanoPorId } from '../data/planos';
import { buscarTotalIndicacoes } from '../lib/supabase';
import { gerarLinkRef } from '../lib/referral';

const PLANO_LABELS = { mensal: 'Plano Mensal', semestral: 'Plano Semestral', anual: 'Plano Anual' };

const TITULOS = [
  { minimo: 15, label: 'Líder',       icone: '👑', gradiente: ['#F59E0B', '#D97706'], sombra: '#F59E0B' },
  { minimo: 7,  label: 'Embaixador',  icone: '⚜️', gradiente: ['#8B5CF6', '#6D28D9'], sombra: '#8B5CF6' },
  { minimo: 3,  label: 'Intercessor', icone: '🙏', gradiente: ['#3B82F6', '#1D4ED8'], sombra: '#3B82F6' },
  { minimo: 1,  label: 'Mensageiro',  icone: '🕊️', gradiente: ['#10B981', '#059669'], sombra: '#10B981' },
];

function getTitulo(total) {
  return TITULOS.find(t => total >= t.minimo) ?? null;
}

const STORAGE_NAME_KEY = '@perfil_nome';
const STORAGE_PHOTO_KEY = '@perfil_foto';

const MESES = ['jan','fev','mar','abr','mai','jun','jul','ago','set','out','nov','dez'];

function formatarData(dateStr) {
  if (!dateStr) return '';
  const [, m, d] = dateStr.split('-');
  return `${parseInt(d)} de ${MESES[parseInt(m) - 1]}`;
}

const ADMIN_EMAIL = 'leo@geneziss.com.br';

export default function PerfilScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const {
    streak,
    totalJejuns,
    totalOracoes,
    totalDevocionais,
    oracoesLidas,
    unlockedMedals,
    completedDays,
    jejunsHistorico,
    devocionaisHistorico,
    resetData,
    auth,
    logout,
    temAcesso,
  } = useApp();

  const [modalStat, setModalStat] = useState(null);
  const [modalConquistas, setModalConquistas] = useState(false);
  const [showWidget, setShowWidget] = useState(true);
  const [totalIndicacoes, setTotalIndicacoes] = useState(0);

  const planoInfo = getPlanoPorId(auth?.plano);

  useEffect(() => {
    if (auth?.email) {
      buscarTotalIndicacoes(auth.email).then(setTotalIndicacoes);
    }
  }, [auth?.email]);

  const handleNotificacoes = () => {
    Linking.openSettings();
  };

  const handleTema = () => {
    Alert.alert('Em breve', 'O tema escuro estará disponível em breve!');
  };

  const handleSolicitarRecurso = () => {
    Linking.openURL('mailto:suporte@asoscomopai.com?subject=Sugestão de recurso');
  };

  const handleCompartilharWhatsApp = () => {
    const link = gerarLinkRef(auth?.email || '');
    const msg =
      `Oi! 🙏 Uso o *A Sós com o Pai* e tem transformado minha vida de oração.\n\n` +
      `Quero te dar 7 dias grátis para você experimentar:\n${link}`;
    Linking.openURL(`https://wa.me/?text=${encodeURIComponent(msg)}`);
  };

  const handleLogout = () => {
    Alert.alert(
      'Sair da conta',
      'Tem certeza que deseja sair?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Sair', style: 'destructive', onPress: logout },
      ]
    );
  };

  const [nome, setNome] = useState('Servo do Senhor');
  const [foto, setFoto] = useState(null);
  const [editandoNome, setEditandoNome] = useState(false);
  const [nomeTemp, setNomeTemp] = useState('');

  useEffect(() => {
    async function carregarPerfil() {
      const nomeSalvo = await AsyncStorage.getItem(STORAGE_NAME_KEY);
      const fotoSalva = await AsyncStorage.getItem(STORAGE_PHOTO_KEY);
      if (nomeSalvo) setNome(nomeSalvo);
      if (fotoSalva) setFoto(fotoSalva);
    }
    carregarPerfil();
  }, []);

  const abrirEdicaoNome = () => {
    setNomeTemp(nome);
    setEditandoNome(true);
  };

  const salvarNome = async () => {
    const novoNome = nomeTemp.trim() || 'Servo do Senhor';
    setNome(novoNome);
    await AsyncStorage.setItem(STORAGE_NAME_KEY, novoNome);
    setEditandoNome(false);
  };

  const escolherFoto = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permissão necessária',
        'Precisamos de acesso à sua galeria para escolher uma foto.'
      );
      return;
    }

    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
      base64: true,
    });

    if (!resultado.canceled && resultado.assets[0]) {
      const asset = resultado.assets[0];
      // Salva em base64 para persistir no web/PWA (blob URIs expiram)
      const dataUri = asset.base64
        ? `data:image/jpeg;base64,${asset.base64}`
        : asset.uri;
      setFoto(dataUri);
      await AsyncStorage.setItem(STORAGE_PHOTO_KEY, dataUri);
    }
  };

  const handleReset = () => {
    Alert.alert(
      'Resetar progresso',
      'Tem certeza que deseja apagar todos os seus dados? Esta ação não pode ser desfeita.',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Sim, resetar', style: 'destructive', onPress: resetData },
      ]
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.titulo}>Perfil</Text>
            {getTitulo(totalIndicacoes) && (() => {
              const t = getTitulo(totalIndicacoes);
              return (
                <LinearGradient
                  colors={t.gradiente}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={[styles.tituloTag, {
                    shadowColor: t.sombra,
                    shadowOffset: { width: 0, height: 3 },
                    shadowOpacity: 0.5,
                    shadowRadius: 6,
                    elevation: 6,
                  }]}
                >
                  <Text style={styles.tituloTagEmoji}>{t.icone}</Text>
                  <Text style={styles.tituloTagText}>{t.label.toUpperCase()}</Text>
                </LinearGradient>
              );
            })()}
          </View>
          <TouchableOpacity style={styles.settingsButton}>
            <Ionicons name="settings-outline" size={24} color={COLORS.text} />
          </TouchableOpacity>
        </View>

        {/* User info */}
        <View style={styles.userCard}>
          <TouchableOpacity onPress={escolherFoto} style={styles.avatarWrapper}>
            {foto ? (
              <Image source={{ uri: foto }} style={styles.avatarImage} />
            ) : (
              <View style={styles.avatarCircle}>
                <Ionicons name="person" size={40} color={COLORS.textLight} />
              </View>
            )}
            <View style={styles.cameraOverlay}>
              <Ionicons name="camera" size={14} color="#FFF" />
            </View>
          </TouchableOpacity>

          <View style={styles.userInfo}>
            <Text style={styles.userName}>{nome}</Text>
            <TouchableOpacity style={styles.editNameBtn} onPress={abrirEdicaoNome}>
              <Ionicons name="pencil" size={14} color={COLORS.textSecondary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Plano atual */}
        {planoInfo && (
          <View style={styles.planoCard}>
            <View style={styles.planoIconCircle}>
              <Ionicons name="star" size={20} color={COLORS.primary} />
            </View>
            <View style={styles.planoInfo}>
              <Text style={styles.planoLabel}>Assinatura ativa</Text>
              <Text style={styles.planoNome}>{PLANO_LABELS[auth?.plano] || planoInfo.nome}</Text>
            </View>
            <View style={styles.planoAtivoBadge}>
              <Text style={styles.planoAtivoText}>ATIVO</Text>
            </View>
          </View>
        )}

        {/* Widget banner */}
        {showWidget && (
          <View style={styles.widgetBanner}>
            <View style={styles.widgetIcon}>
              <Ionicons name="grid" size={24} color={COLORS.primary} />
            </View>
            <View style={styles.widgetContent}>
              <Text style={styles.widgetTitle}>Adicione um Widget para a Bíblia Diária</Text>
              <Text style={styles.widgetDesc}>
                Personalize sua tela inicial com versículos bíblicos diários nas Configurações.
              </Text>
              <TouchableOpacity onPress={handleNotificacoes}>
                <Text style={styles.widgetLink}>Veja como adicionar</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.widgetClose} onPress={() => setShowWidget(false)}>
              <Ionicons name="close" size={18} color={COLORS.textLight} />
            </TouchableOpacity>
          </View>
        )}

        {/* Stats */}
        <View style={styles.statsRow}>
          <TouchableOpacity style={styles.statCard} onPress={() => setModalStat('sequencia')}>
            <View style={[styles.statIconCircle, { backgroundColor: COLORS.streakLight }]}>
              <Ionicons name="flame" size={24} color={COLORS.streak} />
            </View>
            <Text style={styles.statValue}>{streak}</Text>
            <Text style={styles.statLabel}>Sequência</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.statCard} onPress={() => setModalStat('jejuns')}>
            <View style={[styles.statIconCircle, { backgroundColor: '#FFF3E0' }]}>
              <Ionicons name="moon" size={24} color="#FF9800" />
            </View>
            <Text style={styles.statValue}>{totalJejuns || 0}</Text>
            <Text style={styles.statLabel}>Jejuns</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.statCard} onPress={() => setModalStat('devocionais')}>
            <View style={[styles.statIconCircle, { backgroundColor: '#F3E5F5' }]}>
              <Ionicons name="book" size={24} color="#9C27B0" />
            </View>
            <Text style={styles.statValue}>{totalDevocionais}</Text>
            <Text style={styles.statLabel}>Devocionais</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.statCard} onPress={() => setModalStat('oracoes')}>
            <View style={[styles.statIconCircle, { backgroundColor: '#E8F5E9' }]}>
              <Ionicons name="hand-left" size={24} color={COLORS.success} />
            </View>
            <Text style={styles.statValue}>{oracoesLidas.length}</Text>
            <Text style={styles.statLabel}>Orações</Text>
          </TouchableOpacity>
        </View>

        {/* Conquistas */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Conquistas</Text>
          {temAcesso('medalhas') && (
            <TouchableOpacity style={styles.verTudoBtn} onPress={() => setModalConquistas(true)}>
              <Text style={styles.verTudoText}>Ver Tudo</Text>
              <Ionicons name="chevron-forward" size={16} color={COLORS.textSecondary} />
            </TouchableOpacity>
          )}
        </View>

        {temAcesso('medalhas') ? (
          <FlatList
            data={MEDALHAS}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.medalhasRow}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => setModalConquistas(true)} activeOpacity={0.85}>
                <MedalhaCard
                  medalha={item}
                  conquistada={(unlockedMedals || []).includes(item.id)}
                />
              </TouchableOpacity>
            )}
          />
        ) : (
          <View style={styles.conquistasBloqueado}>
            <Ionicons name="lock-closed" size={28} color="#D4A017" />
            <Text style={styles.conquistasBloqueadoTitulo}>Recurso do Plano Semestral</Text>
            <Text style={styles.conquistasBloqueadoDesc}>
              Faça upgrade para desbloquear medalhas e acompanhar suas conquistas espirituais.
            </Text>
          </View>
        )}

        {/* Indique e Ganhe */}
        <View style={styles.indicacaoCard}>
          <View style={styles.indicacaoTop}>
            <View>
              <Text style={styles.indicacaoTitulo}>Indique e Ganhe 🎁</Text>
              <Text style={styles.indicacaoSubtitulo}>3 indicações = 1 mês grátis</Text>
            </View>
            <View style={styles.indicacaoContador}>
              <Text style={styles.indicacaoNum}>{totalIndicacoes}</Text>
              <Text style={styles.indicacaoNumLabel}>indicadas</Text>
            </View>
          </View>

          {/* Progresso no ciclo atual */}
          <View style={styles.progressRow}>
            {[1, 2, 3].map((i) => {
              const cicloAtual = totalIndicacoes % 3;
              const preenchido = cicloAtual === 0 && totalIndicacoes > 0 ? true : i <= cicloAtual;
              return (
                <View key={i} style={[styles.progressDot, preenchido && styles.progressDotFilled]}>
                  {preenchido && <Ionicons name="checkmark" size={12} color="#FFF" />}
                </View>
              );
            })}
            <Text style={styles.progressLabel}>
              {totalIndicacoes % 3}/3 para 1 mês grátis
            </Text>
          </View>

          <TouchableOpacity style={styles.btnIndicar} onPress={handleCompartilharWhatsApp} activeOpacity={0.85}>
            <Ionicons name="logo-whatsapp" size={18} color="#FFF" />
            <Text style={styles.btnIndicarText}>Compartilhar agora</Text>
          </TouchableOpacity>
        </View>

        {/* Preferences */}
        <Text style={styles.prefTitle}>Preferências</Text>

        <TouchableOpacity style={styles.prefItem} onPress={handleSolicitarRecurso}>
          <Text style={styles.prefEmoji}>✍️</Text>
          <Text style={styles.prefText}>Solicitar recurso</Text>
          <View style={styles.novoBadge}>
            <Text style={styles.novoText}>NOVO</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={COLORS.textLight} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.prefItem} onPress={handleNotificacoes}>
          <Ionicons name="notifications-outline" size={22} color={COLORS.text} />
          <Text style={styles.prefText}>Notificações</Text>
          <Ionicons name="chevron-forward" size={18} color={COLORS.textLight} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.prefItem} onPress={handleTema}>
          <Ionicons name="moon-outline" size={22} color={COLORS.text} />
          <Text style={styles.prefText}>Tema</Text>
          <Ionicons name="chevron-forward" size={18} color={COLORS.textLight} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.prefItem} onPress={handleCompartilharWhatsApp}>
          <Ionicons name="share-social-outline" size={22} color={COLORS.text} />
          <Text style={styles.prefText}>Compartilhar app</Text>
          <Ionicons name="chevron-forward" size={18} color={COLORS.textLight} />
        </TouchableOpacity>

        {/* Admin */}
        {auth?.email === ADMIN_EMAIL && (
          <TouchableOpacity style={styles.prefItem} onPress={() => navigation.navigate('Admin')}>
            <Ionicons name="shield-checkmark-outline" size={22} color={COLORS.primary} />
            <Text style={[styles.prefText, { color: COLORS.primary }]}>Painel Admin</Text>
            <Ionicons name="chevron-forward" size={18} color={COLORS.textLight} />
          </TouchableOpacity>
        )}

        {/* Sair */}
        <TouchableOpacity style={styles.prefItem} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={22} color={COLORS.error} />
          <Text style={[styles.prefText, { color: COLORS.error }]}>Sair da conta</Text>
          <Ionicons name="chevron-forward" size={18} color={COLORS.textLight} />
        </TouchableOpacity>

        {/* Reset */}
        <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
          <Ionicons name="refresh" size={18} color={COLORS.error} />
          <Text style={styles.resetText}>Resetar progresso</Text>
        </TouchableOpacity>

        <Text style={styles.versionText}>A Sós com o Pai v1.0.0</Text>
      </ScrollView>

      {/* Modal Conquistas */}
      <Modal visible={modalConquistas} transparent={false} animationType="slide" onRequestClose={() => setModalConquistas(false)}>
        <View style={[styles.conquContainer, { paddingTop: insets.top }]}>
          {/* Header */}
          <View style={styles.conquHeader}>
            <TouchableOpacity style={styles.conquBackBtn} onPress={() => setModalConquistas(false)}>
              <Ionicons name="arrow-back" size={24} color={COLORS.text} />
            </TouchableOpacity>
            <Text style={styles.conquTitle}>Conquistas</Text>
            <View style={{ width: 42 }} />
          </View>

          {/* Progresso geral */}
          <View style={styles.conquProgressCard}>
            <View style={styles.conquProgressInfo}>
              <Text style={styles.conquProgressNum}>
                {(unlockedMedals || []).length}
                <Text style={styles.conquProgressTotal}>/{MEDALHAS.length}</Text>
              </Text>
              <Text style={styles.conquProgressLabel}>conquistadas</Text>
            </View>
            <View style={styles.conquProgressBarBg}>
              <View
                style={[
                  styles.conquProgressBarFill,
                  { width: `${((unlockedMedals || []).length / MEDALHAS.length) * 100}%` },
                ]}
              />
            </View>
          </View>

          {/* Grid de medalhas */}
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.conquGrid}>
            {MEDALHAS.map((medalha) => {
              const conquistada = (unlockedMedals || []).includes(medalha.id);
              return (
                <View key={medalha.id} style={[styles.conquCard, conquistada && styles.conquCardUnlocked]}>
                  {/* Ícone */}
                  <View style={[styles.conquIconCircle, { backgroundColor: conquistada ? medalha.corFundo : '#F0F0F0' }]}>
                    <Ionicons
                      name={conquistada ? medalha.icone : 'lock-closed'}
                      size={40}
                      color={conquistada ? medalha.cor : COLORS.locked}
                    />
                  </View>

                  {/* Badge conquistada */}
                  {conquistada && (
                    <View style={styles.conquBadge}>
                      <Ionicons name="checkmark-circle" size={20} color={COLORS.success} />
                    </View>
                  )}

                  {/* Textos */}
                  <Text style={[styles.conquCardTitle, !conquistada && styles.conquCardTitleLocked]}>
                    {medalha.titulo}
                  </Text>
                  <Text style={styles.conquCardDesc}>{medalha.descricao}</Text>

                  {/* Requisito */}
                  <View style={[styles.conquReqBadge, { backgroundColor: conquistada ? medalha.corFundo : '#F5F5F5' }]}>
                    <Ionicons name="flame" size={12} color={conquistada ? medalha.cor : COLORS.textLight} />
                    <Text style={[styles.conquReqText, { color: conquistada ? medalha.cor : COLORS.textLight }]}>
                      {medalha.diasNecessarios} dias
                    </Text>
                  </View>
                </View>
              );
            })}
          </ScrollView>
        </View>
      </Modal>

      {/* Modal detalhes estatística */}
      <Modal visible={!!modalStat} transparent animationType="slide" onRequestClose={() => setModalStat(null)}>
        <TouchableOpacity style={styles.statModalOverlay} activeOpacity={1} onPress={() => setModalStat(null)}>
          <TouchableOpacity activeOpacity={1} style={styles.statModalSheet}>
            {/* Handle */}
            <View style={styles.sheetHandle} />

            {/* Header do modal */}
            {modalStat === 'sequencia' && (
              <View style={styles.sheetHeaderRow}>
                <View style={[styles.sheetIconCircle, { backgroundColor: COLORS.streakLight }]}>
                  <Ionicons name="flame" size={22} color={COLORS.streak} />
                </View>
                <Text style={styles.sheetTitle}>Dias de Sequência</Text>
              </View>
            )}
            {modalStat === 'jejuns' && (
              <View style={styles.sheetHeaderRow}>
                <View style={[styles.sheetIconCircle, { backgroundColor: '#FFF3E0' }]}>
                  <Ionicons name="moon" size={22} color="#FF9800" />
                </View>
                <Text style={styles.sheetTitle}>Jejuns Realizados</Text>
              </View>
            )}
            {modalStat === 'devocionais' && (
              <View style={styles.sheetHeaderRow}>
                <View style={[styles.sheetIconCircle, { backgroundColor: '#F3E5F5' }]}>
                  <Ionicons name="book" size={22} color="#9C27B0" />
                </View>
                <Text style={styles.sheetTitle}>Devocionais Realizados</Text>
              </View>
            )}
            {modalStat === 'oracoes' && (
              <View style={styles.sheetHeaderRow}>
                <View style={[styles.sheetIconCircle, { backgroundColor: '#E8F5E9' }]}>
                  <Ionicons name="hand-left" size={22} color={COLORS.success} />
                </View>
                <Text style={styles.sheetTitle}>Orações Guiadas</Text>
              </View>
            )}

            {/* Conteúdo */}
            <ScrollView style={styles.sheetList} showsVerticalScrollIndicator={false}>
              {modalStat === 'sequencia' && (() => {
                const dias = Object.keys(completedDays || {}).sort().reverse();
                if (dias.length === 0) return (
                  <Text style={styles.sheetEmpty}>Nenhum dia completo ainda. Complete todas as 4 tarefas diárias para registrar um dia.</Text>
                );
                return dias.map((d) => (
                  <View key={d} style={styles.sheetItem}>
                    <View style={[styles.sheetItemDot, { backgroundColor: COLORS.streak }]} />
                    <View style={styles.sheetItemContent}>
                      <Text style={styles.sheetItemTitle}>Plano diário concluído</Text>
                      <Text style={styles.sheetItemDate}>{formatarData(d)}</Text>
                    </View>
                    <Ionicons name="checkmark-circle" size={20} color={COLORS.success} />
                  </View>
                ));
              })()}

              {modalStat === 'jejuns' && (() => {
                const hist = (jejunsHistorico || []).slice().reverse();
                if (hist.length === 0) return (
                  <Text style={styles.sheetEmpty}>Nenhum jejum concluído ainda. Complete um jejum para registrá-lo aqui.</Text>
                );
                return hist.map((j, i) => (
                  <View key={i} style={styles.sheetItem}>
                    <View style={[styles.sheetItemDot, { backgroundColor: '#FF9800' }]} />
                    <View style={styles.sheetItemContent}>
                      <Text style={styles.sheetItemTitle}>{j.label || 'Jejum'}</Text>
                      <Text style={styles.sheetItemDate}>{formatarData(j.data)}</Text>
                    </View>
                    <Ionicons name="trophy" size={20} color="#FFD700" />
                  </View>
                ));
              })()}

              {modalStat === 'devocionais' && (() => {
                const hist = (devocionaisHistorico || []).slice().reverse();
                if (hist.length === 0) return (
                  <Text style={styles.sheetEmpty}>Nenhum devocional concluído ainda. Leia um devocional diário para registrá-lo aqui.</Text>
                );
                return hist.map((d, i) => (
                  <View key={i} style={styles.sheetItem}>
                    <View style={[styles.sheetItemDot, { backgroundColor: '#9C27B0' }]} />
                    <View style={styles.sheetItemContent}>
                      <Text style={styles.sheetItemTitle}>{d.titulo}</Text>
                      <Text style={styles.sheetItemDate}>{formatarData(d.data)}</Text>
                    </View>
                    <Ionicons name="book" size={20} color="#9C27B0" />
                  </View>
                ));
              })()}

              {modalStat === 'oracoes' && (() => {
                if (oracoesLidas.length === 0) return (
                  <Text style={styles.sheetEmpty}>Nenhuma oração guiada concluída ainda. Complete uma oração guiada diária para registrá-la aqui.</Text>
                );
                return (
                  <View style={styles.sheetOracoesBox}>
                    <Ionicons name="hand-left" size={40} color={COLORS.success} />
                    <Text style={styles.sheetOracoesNum}>{oracoesLidas.length}</Text>
                    <Text style={styles.sheetOracoesLabel}>orações realizadas</Text>
                  </View>
                );
              })()}

              <View style={{ height: 24 }} />
            </ScrollView>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      {/* Modal editar nome */}
      <Modal visible={editandoNome} transparent animationType="fade">
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalOverlay}
        >
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Editar nome</Text>
            <TextInput
              style={styles.modalInput}
              value={nomeTemp}
              onChangeText={setNomeTemp}
              placeholder="Digite seu nome"
              placeholderTextColor={COLORS.textLight}
              autoFocus
              maxLength={30}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalBtn, styles.modalBtnCancel]}
                onPress={() => setEditandoNome(false)}
              >
                <Text style={styles.modalBtnCancelText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalBtn, styles.modalBtnSave]}
                onPress={salvarNome}
              >
                <Text style={styles.modalBtnSaveText}>Salvar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  titulo: {
    fontSize: 28,
    ...FONTS.extrabold,
    color: COLORS.text,
  },
  tituloTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
  },
  tituloTagEmoji: {
    fontSize: 13,
  },
  tituloTagText: {
    fontSize: 11,
    ...FONTS.extrabold,
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  settingsButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: 14,
  },
  avatarWrapper: {
    position: 'relative',
  },
  avatarCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#F0F0F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarImage: {
    width: 72,
    height: 72,
    borderRadius: 36,
  },
  cameraOverlay: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: COLORS.background,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  userName: {
    fontSize: 22,
    ...FONTS.bold,
    color: COLORS.text,
  },
  editNameBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#F0F0F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  planoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 16,
    backgroundColor: '#FFF9E6',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.primaryLight + '60',
    gap: 12,
  },
  planoIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primaryLight + '40',
    alignItems: 'center',
    justifyContent: 'center',
  },
  planoInfo: {
    flex: 1,
  },
  planoLabel: {
    fontSize: 11,
    color: COLORS.textSecondary,
    ...FONTS.medium,
  },
  planoNome: {
    fontSize: 15,
    ...FONTS.bold,
    color: COLORS.text,
  },
  planoAtivoBadge: {
    backgroundColor: COLORS.success,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  planoAtivoText: {
    fontSize: 10,
    ...FONTS.bold,
    color: '#FFF',
    letterSpacing: 0.5,
  },
  widgetBanner: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 24,
    padding: 16,
    backgroundColor: '#FFF9E6',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F0E6C0',
    gap: 12,
  },
  widgetIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: COLORS.primaryLight + '40',
    alignItems: 'center',
    justifyContent: 'center',
  },
  widgetContent: {
    flex: 1,
  },
  widgetTitle: {
    fontSize: 15,
    ...FONTS.bold,
    color: COLORS.text,
    marginBottom: 4,
  },
  widgetDesc: {
    fontSize: 12,
    color: COLORS.textSecondary,
    lineHeight: 17,
    marginBottom: 6,
  },
  widgetLink: {
    fontSize: 13,
    ...FONTS.bold,
    color: COLORS.text,
  },
  widgetClose: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 28,
    gap: 8,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    padding: 12,
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    ...SHADOWS.small,
  },
  statIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 20,
    ...FONTS.extrabold,
    color: COLORS.text,
  },
  statLabel: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 18,
    ...FONTS.bold,
    color: COLORS.text,
  },
  verTudoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  verTudoText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    ...FONTS.medium,
  },
  medalhasRow: {
    paddingHorizontal: 20,
    paddingBottom: 4,
  },
  prefTitle: {
    fontSize: 16,
    ...FONTS.semibold,
    color: COLORS.textSecondary,
    paddingHorizontal: 20,
    marginTop: 28,
    marginBottom: 12,
  },
  prefItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 8,
    padding: 16,
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    gap: 12,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  prefEmoji: {
    fontSize: 20,
  },
  prefText: {
    flex: 1,
    fontSize: 15,
    ...FONTS.semibold,
    color: COLORS.text,
  },
  novoBadge: {
    backgroundColor: '#E8F5E9',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  novoText: {
    fontSize: 11,
    ...FONTS.bold,
    color: COLORS.success,
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20,
    marginTop: 24,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.error + '30',
    gap: 8,
  },
  resetText: {
    fontSize: 14,
    ...FONTS.semibold,
    color: COLORS.error,
  },
  versionText: {
    textAlign: 'center',
    fontSize: 12,
    color: COLORS.textLight,
    marginTop: 16,
  },
  // Indique e Ganhe
  indicacaoCard: {
    marginHorizontal: 20,
    marginTop: 28,
    marginBottom: 8,
    padding: 20,
    backgroundColor: '#FFF9E6',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.primaryLight + '50',
  },
  indicacaoTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  indicacaoTitulo: {
    fontSize: 17,
    ...FONTS.bold,
    color: COLORS.text,
    marginBottom: 2,
  },
  indicacaoSubtitulo: {
    fontSize: 12,
    color: COLORS.textSecondary,
    ...FONTS.medium,
  },
  indicacaoContador: {
    alignItems: 'center',
    backgroundColor: COLORS.primaryLight + '30',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  indicacaoNum: {
    fontSize: 22,
    ...FONTS.extrabold,
    color: COLORS.primaryDark,
  },
  indicacaoNumLabel: {
    fontSize: 10,
    color: COLORS.textSecondary,
    ...FONTS.medium,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  progressDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#F0F0F0',
    borderWidth: 1.5,
    borderColor: '#E0E0E0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressDotFilled: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  progressLabel: {
    fontSize: 13,
    color: COLORS.textSecondary,
    ...FONTS.medium,
    marginLeft: 4,
  },
  btnIndicar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#25D366',
    borderRadius: 14,
    height: 48,
  },
  btnIndicarText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFF',
  },
  conquistasBloqueado: {
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 24,
    backgroundColor: '#FFF9E6',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#D4A01740',
    alignItems: 'center',
    gap: 8,
  },
  conquistasBloqueadoTitulo: {
    fontSize: 15,
    fontWeight: '700',
    color: '#B8890F',
    textAlign: 'center',
  },
  conquistasBloqueadoDesc: {
    fontSize: 13,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
  },
  // Conquistas modal
  conquContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  conquHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  conquBackBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  conquTitle: {
    fontSize: 18,
    ...FONTS.bold,
    color: COLORS.text,
  },
  conquProgressCard: {
    margin: 20,
    padding: 20,
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    ...SHADOWS.small,
  },
  conquProgressInfo: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
    marginBottom: 12,
  },
  conquProgressNum: {
    fontSize: 36,
    ...FONTS.extrabold,
    color: COLORS.text,
  },
  conquProgressTotal: {
    fontSize: 20,
    ...FONTS.semibold,
    color: COLORS.textSecondary,
  },
  conquProgressLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
    ...FONTS.medium,
    marginLeft: 4,
  },
  conquProgressBarBg: {
    height: 8,
    backgroundColor: '#F0F0F0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  conquProgressBarFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 4,
  },
  conquGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    paddingBottom: 40,
    gap: 12,
  },
  conquCard: {
    width: '47%',
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    ...SHADOWS.small,
    opacity: 0.55,
    borderWidth: 1.5,
    borderColor: COLORS.borderLight,
  },
  conquCardUnlocked: {
    opacity: 1,
    borderColor: COLORS.primaryLight,
  },
  conquIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  conquBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
  },
  conquCardTitle: {
    fontSize: 14,
    ...FONTS.bold,
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 4,
  },
  conquCardTitleLocked: {
    color: COLORS.textLight,
  },
  conquCardDesc: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 17,
    marginBottom: 12,
  },
  conquReqBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  conquReqText: {
    fontSize: 12,
    ...FONTS.bold,
  },
  // Modal stat
  statModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },
  statModalSheet: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: 12,
    paddingHorizontal: 20,
    maxHeight: '75%',
    ...SHADOWS.large,
  },
  sheetHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E0E0E0',
    alignSelf: 'center',
    marginBottom: 20,
  },
  sheetHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
  },
  sheetIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sheetTitle: {
    fontSize: 20,
    ...FONTS.bold,
    color: COLORS.text,
  },
  sheetList: {
    flexGrow: 0,
  },
  sheetItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
    gap: 12,
  },
  sheetItemDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  sheetItemContent: {
    flex: 1,
  },
  sheetItemTitle: {
    fontSize: 15,
    ...FONTS.semibold,
    color: COLORS.text,
  },
  sheetItemDate: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  sheetEmpty: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    paddingVertical: 32,
    paddingHorizontal: 16,
  },
  sheetOracoesBox: {
    alignItems: 'center',
    paddingVertical: 32,
    gap: 8,
  },
  sheetOracoesNum: {
    fontSize: 48,
    ...FONTS.extrabold,
    color: COLORS.text,
  },
  sheetOracoesLabel: {
    fontSize: 16,
    color: COLORS.textSecondary,
    ...FONTS.medium,
  },
  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  modalCard: {
    width: '100%',
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    padding: 24,
    ...SHADOWS.medium,
  },
  modalTitle: {
    fontSize: 18,
    ...FONTS.bold,
    color: COLORS.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  modalInput: {
    borderWidth: 1.5,
    borderColor: COLORS.borderLight,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: COLORS.text,
    backgroundColor: COLORS.background,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalBtn: {
    flex: 1,
    paddingVertical: 13,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalBtnCancel: {
    backgroundColor: '#F0F0F0',
  },
  modalBtnCancelText: {
    fontSize: 15,
    ...FONTS.semibold,
    color: COLORS.textSecondary,
  },
  modalBtnSave: {
    backgroundColor: COLORS.primary,
  },
  modalBtnSaveText: {
    fontSize: 15,
    ...FONTS.semibold,
    color: '#FFF',
  },
});
