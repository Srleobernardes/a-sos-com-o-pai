#!/bin/bash
set -e

echo "📦 Gerando build web..."
npx expo export --platform web

echo "🖼️ Copiando ícones PWA..."
cp web/icon-192.png dist/icon-192.png
cp web/icon-512.png dist/icon-512.png
cp web/manifest.json dist/manifest.json

echo "🔧 Injetando manifest e apple-touch-icon no index.html..."
sed -i '' 's|<link rel="icon" href="/favicon.ico" />|<link rel="icon" href="/favicon.ico" />\n<link rel="apple-touch-icon" href="/icon-192.png" />\n<link rel="manifest" href="/manifest.json" />|' dist/index.html

echo "✅ Build concluído! Pasta dist/ pronta para deploy."
