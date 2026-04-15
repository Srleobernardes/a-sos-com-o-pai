import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, FONTS } from '../theme/colors';

function WebIframe({ video, onLoad }) {
  return (
    <iframe
      src={video.embedUrl}
      style={{ width: '100%', height: '100%', border: 'none', backgroundColor: '#000' }}
      allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
      allowFullScreen
      onLoad={onLoad}
    />
  );
}

function NativeWebView({ video, onLoad }) {
  const WebView = require('react-native-webview').WebView;

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { background: #000; display: flex; align-items: center; justify-content: center; min-height: 100vh; overflow: hidden; }
        vturb-smartplayer { display: block; width: 100% !important; max-width: 100% !important; }
      </style>
    </head>
    <body>
      <vturb-smartplayer id="${video.playerId}" style="display:block;width:100%;max-width:100%;"></vturb-smartplayer>
      <script type="text/javascript">
        var s = document.createElement("script");
        s.src = "${video.scriptUrl}";
        s.async = true;
        document.head.appendChild(s);
      </script>
    </body>
    </html>
  `;

  return (
    <WebView
      source={{ html: htmlContent, baseUrl: 'https://scripts.converteai.net' }}
      style={{ flex: 1, backgroundColor: '#000' }}
      allowsInlineMediaPlayback={true}
      mediaPlaybackRequiresUserAction={false}
      javaScriptEnabled={true}
      domStorageEnabled={true}
      allowsFullscreenVideo={true}
      mixedContentMode="compatibility"
      originWhitelist={['*']}
      onLoadEnd={onLoad}
      scrollEnabled={false}
    />
  );
}

export default function VideoOracaoScreen({ route, navigation }) {
  const insets = useSafeAreaInsets();
  const { video, cor } = route.params;
  const [loading, setLoading] = useState(true);

  const handleLoad = () => setLoading(false);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={[styles.header, { backgroundColor: cor || COLORS.navy }]}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle} numberOfLines={1}>{video.titulo}</Text>
          <Text style={styles.headerSubtitle} numberOfLines={1}>{video.subtitulo}</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      {/* Player */}
      <View style={styles.playerContainer}>
        {loading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color={cor || COLORS.primary} />
            <Text style={styles.loadingText}>Carregando oracao...</Text>
          </View>
        )}
        {Platform.OS === 'web' ? (
          <WebIframe video={video} onLoad={handleLoad} />
        ) : (
          <NativeWebView video={video} onLoad={handleLoad} />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    width: 40, height: 40, borderRadius: 20,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  headerCenter: { flex: 1, alignItems: 'center' },
  headerTitle: { fontSize: 16, ...FONTS.bold, color: '#FFF' },
  headerSubtitle: { fontSize: 12, color: 'rgba(255,255,255,0.7)', marginTop: 2 },
  playerContainer: { flex: 1, backgroundColor: '#000' },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  loadingText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 14,
    marginTop: 12,
    ...FONTS.medium,
  },
});
