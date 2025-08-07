# 🚀 Instruções Rápidas - Totem Autorecebimento

## 📱 Como Usar o APP (Totem)

### 🎯 Passo a Passo

1. **Abra o arquivo `app.html`** em qualquer navegador moderno
2. **Clique em "Iniciar Atendimento"**
4. **Preencha seus dados**:
   - Nome e sobrenome
   - CNPJ da empresa
   - Cargo (motorista, ajudante, outro)
5. **Adicione as notas fiscais**:
   - Digite a chave de acesso da NFe
   - Informe o valor da nota
   - Clique em "+ Adicionar Nota Fiscal"
   - Repita para todas as notas
6. **Confirme o resumo** e receba sua senha
7. **Escaneie o QR Code** para pagamento PIX
8. **Confirme o pagamento** e finalize

### 🖥️ Como Executar Localmente

```bash
# Opção 1: Python (recomendado)
python -m http.server 8000
# Acesse: http://localhost:8000/app.html

# Opção 2: Node.js
npx serve .
# Acesse: http://localhost:3000/app.html

# Opção 3: Abrir diretamente
# Clique duas vezes no arquivo app.html
```

### 📋 Dados de Teste

Para testar o sistema, use estes dados fictícios:

**Motorista:**
- Nome: João Silva
- Sobrenome: Santos
- CNPJ: 12.345.678/0001-90
- Cargo: Motorista

**Nota Fiscal:**
- Chave: 35201234567890123456789012345678901234567890
- Valor: 1500,00

### 🎨 Características do Sistema

✅ **Interface Moderna**: Design limpo e profissional
✅ **Responsivo**: Funciona em qualquer dispositivo
✅ **Touch Friendly**: Otimizado para telas touch
✅ **Acessível**: Navegação por teclado e alto contraste
✅ **PWA Ready**: Pode ser instalado como app
✅ **Interface em Português**: Sistema totalmente em português
✅ **Validações**: CNPJ, campos obrigatórios, etc.
✅ **QR Code Real**: Gerado dinamicamente
✅ **WhatsApp**: Integração para acompanhamento

### 🔧 Funcionalidades Técnicas

- **Barra de Progresso**: Mostra o avanço do atendimento
- **Validação CNPJ**: Verifica formato e dígitos
- **Notificações**: Alertas visuais para erros/sucessos
- **Animações**: Transições suaves entre telas
- **Loading States**: Feedback durante processamento
- **Dados Persistentes**: Mantém informações durante a sessão

### 📱 Compatibilidade

- ✅ Chrome/Edge (recomendado)
- ✅ Firefox
- ✅ Safari
- ✅ Mobile browsers
- ✅ Tablets
- ✅ Totens touch

### 🚨 Solução de Problemas

**Problema**: QR Code não aparece
- **Solução**: Verifique a conexão com internet

**Problema**: Validação de CNPJ falha
- **Solução**: Use apenas números (ex: 12345678000190)

**Problema**: Tela não carrega
- **Solução**: Use um servidor local (não abra diretamente)

**Problema**: Botões não respondem
- **Solução**: Verifique se JavaScript está habilitado

### 📞 Suporte

Para dúvidas ou problemas:
- 📧 Email: suporte@totem.com
- 📱 WhatsApp: (11) 99999-9999

---

**🎉 Sistema pronto para uso! Teste agora mesmo!** 