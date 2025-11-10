# 🔧 Comandos PowerShell Corretos

## ⚠️ Você está usando PowerShell, não CMD

No PowerShell, os comandos são diferentes do CMD.

---

## 🚀 Solução Rápida - Execute o Script

```powershell
.\FORCE_REFRESH.ps1
```

Se der erro de execução, execute antes:
```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
.\FORCE_REFRESH.ps1
```

---

## 📋 Comandos Manuais (PowerShell)

### 1. Parar Node.js
```powershell
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force
```

### 2. Ir para pasta frontend
```powershell
cd frontend
```

### 3. Limpar cache do Vite
```powershell
Remove-Item -Recurse -Force node_modules\.vite -ErrorAction SilentlyContinue
```

### 4. Limpar dist
```powershell
Remove-Item -Recurse -Force dist -ErrorAction SilentlyContinue
```

### 5. Reiniciar servidor
```powershell
npm run dev
```

---

## 🔄 Comando Único (Copie e Cole)

```powershell
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force; cd frontend; Remove-Item -Recurse -Force node_modules\.vite -ErrorAction SilentlyContinue; Remove-Item -Recurse -Force dist -ErrorAction SilentlyContinue; npm run dev
```

---

## ❌ NÃO Use Comandos CMD no PowerShell

### ❌ ERRADO (CMD):
```cmd
rmdir /s /q node_modules\.vite
```

### ✅ CORRETO (PowerShell):
```powershell
Remove-Item -Recurse -Force node_modules\.vite
```

---

## 🎯 Diferenças CMD vs PowerShell

| Ação | CMD | PowerShell |
|------|-----|------------|
| Remover pasta | `rmdir /s /q pasta` | `Remove-Item -Recurse -Force pasta` |
| Listar arquivos | `dir` | `Get-ChildItem` ou `ls` |
| Mudar diretório | `cd pasta` | `Set-Location pasta` ou `cd pasta` |
| Limpar tela | `cls` | `Clear-Host` ou `cls` |

---

## 🔍 Como Saber Qual Shell Você Está Usando?

### PowerShell:
```
PS C:\PROJETOS\aml-crypto-mvp-complete>
```
(Começa com `PS`)

### CMD:
```
C:\PROJETOS\aml-crypto-mvp-complete>
```
(Não tem `PS`)

---

## ✅ Após Limpar Cache

1. **Feche todos os navegadores**
2. **Abra Edge novamente**
3. **Pressione `Ctrl + Shift + R`** para hard refresh
4. **Abra DevTools (F12)**
5. **Inspecione os botões** para confirmar que `title` e `aria-label` estão presentes

---

## 💡 Dica

Se você preferir usar CMD, abra um novo terminal CMD (não PowerShell) e use:
```cmd
cd frontend
rmdir /s /q node_modules\.vite
rmdir /s /q dist
npm run dev
```

---

*Comandos corretos para PowerShell*
