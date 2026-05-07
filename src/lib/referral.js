export function gerarCodigoRef(email = '') {
  const base = (email.split('@')[0] || '')
    .replace(/[^a-zA-Z0-9]/g, '')
    .toUpperCase()
    .slice(0, 6) || 'AMIGO';
  const hash = [...email].reduce((a, c) => a + c.charCodeAt(0), 0);
  return `${base}${(hash % 9000) + 1000}`;
}
