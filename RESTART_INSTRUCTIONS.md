# 🔄 Como Aplicar as Correções

## ⚠️ IMPORTANTE: Reiniciar é Obrigatório

As correções de acessibilidade foram aplicadas no código-fonte, mas você precisa **reiniciar o frontend** para que as mudanças apareçam no navegador.

---

## 🚀 Passos para Aplicar

### 1. Parar o Frontend
No terminal onde o frontend está rodando, pressione:
```
Ctrl + C
```

### 2. Reiniciar o Frontend
```bash
cd frontend
npm run dev
```

### 3. Limpar Cache do Navegador
Pressione no navegador:
```
Ctrl + Shift + R  (Windows/Linux)
Cmd + Shift + R   (macOS)
```

Ou:
```
Ctrl + F5  (Windows/Linux)
```

### 4. Verificar as Correções
1. Abra o DevTools (F12)
2. Vá para a aba "Issues" ou "Problems"
3. As mensagens de erro devem ter sumido

---

## 🔍 Verificação Rápida

### Teste 1: NotificationCenter
1. Passe o mouse sobre o ícone de sino (Bell)
2. Deve aparecer tooltip "Notifications"
3. Clique para abrir o painel
4. Passe o mouse sobre o X
5. Deve aparecer tooltip "Close notifications"

### Teste 2: WebhookManager
1. Vá para a página de Webhooks
2. Passe o mouse sobre os botões de ícone
3. Todos devem ter tooltips:
   - 👁️ "Show secret" / "Hide secret"
   - 📋 "Copy secret"
   - 🗑️ "Delete webhook"

---

## 🐛 Se os Erros Persistirem

### Opção 1: Hard Refresh
```bash
# Fechar TODOS os navegadores
# Reabrir e pressionar Ctrl + Shift + Delete
# Limpar cache e cookies
# Recarregar a página
```

### Opção 2: Verificar o Código
```bash
# Verificar se as mudanças estão no arquivo
cd frontend/src/components
type NotificationCenter.tsx | findstr "aria-label"
type WebhookManager.tsx | findstr "aria-label"
```

Deve mostrar várias linhas com `aria-label`.

### Opção 3: Rebuild Completo
```bash
cd frontend
rmdir /s /q node_modules\.vite
npm run dev
```

---

## ✅ Checklist

- [ ] Frontend reiniciado
- [ ] Cache do navegador limpo (Ctrl + Shift + R)
- [ ] Página recarregada
- [ ] DevTools aberto (F12)
- [ ] Aba "Issues" verificada
- [ ] Tooltips aparecem ao passar o mouse

---

## 📋 Arquivos Modificados

1. ✅ `frontend/src/components/NotificationCenter.tsx`
   - Linha 92: `title="Notifications"` + `aria-label="Open notifications"`
   - Linha 136: `title="Close notifications"` + `aria-label="Close notifications panel"`
   - Linha 168: `title="Delete notification"` + `aria-label` dinâmico

2. ✅ `frontend/src/components/WebhookManager.tsx`
   - Linha 125: `aria-label="Webhook secret"` + `title="Webhook secret key"`
   - Linha 134: `title` + `aria-label` dinâmicos para toggle
   - Linha 140: `title="Copy secret"` + `aria-label="Copy webhook secret to clipboard"`
   - Linha 147: `title="Delete webhook"` + `aria-label="Delete this webhook"`

---

## 🎯 Resultado Esperado

### Antes (com erros)
```
❌ Buttons must have discernible text: Element has no title attribute
❌ Form elements must have labels: Element has no title attribute
```

### Depois (sem erros)
```
✅ No accessibility issues found
```

---

## 💡 Dica

Se você estiver usando **Hot Module Replacement (HMR)**, às vezes ele não detecta mudanças em atributos HTML. Nesse caso, um **restart completo** é necessário.

---

*Instruções criadas em: ${new Date().toISOString()}*
