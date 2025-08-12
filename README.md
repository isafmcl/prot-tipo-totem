#  Totem Autorecebimento - Sistema de Autoatendimento (Em Desenvolvimento)

Sistema completo de autoatendimento para motoristas com interface moderna e responsiva, desenvolvido em HTML, CSS e JavaScript puro.

##  Visão Geral

O **Totem Autorecebimento** é um sistema de autoatendimento desenvolvido para otimizar o processo de recebimento de mercadorias em centros de distribuição. O sistema é dividido em dois módulos principais:

###  Módulos do Sistema

1. **APP (Totem)** - Interface para motoristas
2. **WEB (Painel)** - Interface de gestão e monitoramento

## Características do APP (Totem)

###  Funcionalidades Principais

- **Interface em Português**: Sistema totalmente em português
- **Identificação do Motorista**: Nome, sobrenome, CNPJ da empresa e cargo
- **Gestão de Notas Fiscais**: Adição e validação de NFes
- **Geração de Senha**: Sistema automático de senhas únicas
- **Pagamento PIX**: QR Code gerado dinamicamente
- **Integração WhatsApp**: Acompanhamento via mensagens
- **Resumo Completo**: Confirmação de todas as informações

### Fluxo do Usuário

1. **Tela de Boas-Vindas** → Interface de boas-vindas
2. **Identificação** → Dados pessoais e da empresa
3. **Notas Fiscais** → Adição e validação de NFes
4. **Resumo** → Confirmação e geração de senha
5. **Pagamento** → QR Code PIX para pagamento
6. **Confirmação** → Finalização do atendimento

### Tecnologias Utilizadas

- **HTML5**: Estrutura semântica e acessível
- **CSS3**: Design moderno com Flexbox e Grid
- **JavaScript**: Lógica de negócio e interações
- **Google Fonts**: Fonte Inter para melhor legibilidade
- **APIs Externas**: Geração de QR Code

###  Design System

- **Paleta de Cores**: Azul claro (#e3f2fd), branco e azul escuro (#0B3D91)
- **Tipografia**: Inter (Google Fonts)
- **Layout**: Responsivo e otimizado para touch
- **Acessibilidade**: Navegação por teclado e contraste adequado

##  Como Usar

### APP (Totem)

1. Abra o arquivo `app.html` em um navegador
2. Clique em "Iniciar Atendimento"
3. Preencha os dados de identificação
4. Adicione as notas fiscais
5. Confirme o resumo e receba sua senha
6. Realize o pagamento via PIX
7. Finalize o atendimento

### WEB (Painel)

*Em desenvolvimento - será o painel de gestão e monitoramento*

## Funcionalidades Técnicas

### Validações Implementadas

- **CNPJ**: Validação básica de formato e dígitos
- **Campos Obrigatórios**: Verificação de preenchimento
- **Notas Fiscais**: Mínimo de uma nota obrigatória
- **Valores**: Validação de valores numéricos

### Estados e Transições

- **Barra de Progresso**: Indicador visual do progresso
- **Animações**: Transições suaves entre telas
- **Loading States**: Feedback visual durante processamento
- **Notificações**: Sistema de alertas e confirmações

### Responsividade

- **Mobile First**: Design otimizado para dispositivos móveis
- **Touch Friendly**: Botões e elementos adequados para toque
- **Adaptativo**: Funciona em diferentes tamanhos de tela
- **Acessibilidade**: Suporte a navegação por teclado

## Próximas Funcionalidades

### Roadmap

- [ ] **Painel WEB**: Interface de gestão completa
- [ ] **Integração ERP**: Conexão com sistema Consinco
- [ ] **API PIX Real**: Integração com APIs bancárias
- [ ] **Leitor de NFe**: Scanner de códigos de barras
- [ ] **PWA**: Aplicativo instalável
- [ ] **Multi-idioma**: Suporte a outros idiomas
- [ ] **Relatórios**: Dashboard de métricas
- [ ] **Notificações Push**: Alertas em tempo real

### Integrações Futuras

- **Sistema ERP**: Consinco, SAP, etc.
- **APIs Bancárias**: PIX, boleto, cartão
- **WhatsApp Business**: Mensagens automáticas
- **Sistemas de Fila**: Controle de atendimento
- **Leitores RFID**: Identificação automática

## Segurança

### Medidas Implementadas

- **Validação Client-Side**: Verificação de dados de entrada
- **Sanitização**: Limpeza de dados inseridos
- **HTTPS Ready**: Preparado para conexões seguras
- **Dados Locais**: Armazenamento temporário apenas

### Recomendações de Produção

- Implementar autenticação de usuários
- Adicionar criptografia de dados sensíveis
- Configurar HTTPS obrigatório
- Implementar logs de auditoria
- Adicionar rate limiting

## Performance

### Otimizações

- **CSS Otimizado**: Estilos minificados e organizados
- **JavaScript Eficiente**: Código limpo e performático
- **Imagens Otimizadas**: QR Codes gerados sob demanda
- **Carregamento Rápido**: Sem dependências pesadas

### Métricas

- **Tempo de Carregamento**: < 2 segundos
- **Tamanho Total**: < 500KB
- **Compatibilidade**: Todos os navegadores modernos
- **Acessibilidade**: WCAG 2.1 AA

## Contribuição

###  Como Contribuir

1. Faça um fork do projeto
2. Crie uma branch para sua feature
3. Implemente as mudanças
4. Teste em diferentes dispositivos
5. Envie um pull request

### 
## Suporte

Para dúvidas, sugestões ou problemas:

- Email: isabellemaciiel@gmail.com
- WhatsApp: (61) 99435-5356
