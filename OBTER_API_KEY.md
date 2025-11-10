# Como Obter API Key do Etherscan (2 minutos)

## Passo a Passo

1. **Acesse:** https://etherscan.io/register

2. **Preencha:**
   - Username: (escolha um)
   - Email: seu email
   - Password: (escolha uma senha)

3. **Confirme o email** que receberá

4. **Faça login:** https://etherscan.io/login

5. **Vá em API Keys:** https://etherscan.io/myapikey

6. **Clique em "+ Add"** para criar nova chave

7. **Copie a chave completa** (34 caracteres)

8. **Cole no arquivo `backend/.env`:**
   ```
   ETHERSCAN_API_KEY=SUA_CHAVE_AQUI
   ```

9. **Reinicie o backend**

## A chave atual não funciona

A chave `649EM4JUJIVV2J8F1IM13QZP1FIG1HZ4H2` retorna erro "NOTOK" da API.

Você PRECISA criar sua própria chave (é grátis e leva 2 minutos).

## Sem uma chave válida:
- ❌ Sistema não busca transações reais
- ❌ Monitoramento não funciona
- ❌ Sistema AML não opera
