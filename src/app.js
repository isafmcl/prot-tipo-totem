// Variáveis globais
let telaAtual = 'boasVindas';
let dadosMotorista = {};
let notasFiscais = [];
let numeroSenha = 0;

const telas = ['boasVindas', 'identificacao', 'notasFiscais', 'resumo', 'pagamento', 'confirmacao'];

// Funções de navegação
function atualizarProgresso() {
  const indice = telas.indexOf(telaAtual);
  const progresso = ((indice + 1) / telas.length) * 100;
  document.getElementById('progressoBarra').style.width = progresso + '%';
}

function proximaTela(novaTela) {
  document.getElementById('tela' + telaAtual.charAt(0).toUpperCase() + telaAtual.slice(1)).classList.remove('ativa');
  document.getElementById('tela' + novaTela.charAt(0).toUpperCase() + novaTela.slice(1)).classList.add('ativa');
  telaAtual = novaTela;
  atualizarProgresso();
  
  if (novaTela === 'pagamento') {
    gerarQRCode();
  }
}

function voltarTela() {
  const indice = telas.indexOf(telaAtual);
  if (indice > 0) {
    proximaTela(telas[indice - 1]);
  }
}

// Funções de validação
function validarIdentificacao() {
  const nome = document.getElementById('nome').value.trim();
  const sobrenome = document.getElementById('sobrenome').value.trim();
  const cnpj = document.getElementById('cnpj').value.trim();
  const whatsapp = document.getElementById('whatsapp').value.trim();
  const cargoCheckboxes = document.querySelectorAll('input[name="cargo"]:checked');
  const cargos = Array.from(cargoCheckboxes).map(cb => cb.value);
  
  if (!nome || !sobrenome || !cnpj || !whatsapp || cargos.length === 0) {
    mostrarNotificacao('Por favor, preencha todos os campos obrigatórios.', 'erro');
    return;
  }
  
  if (!validarCNPJ(cnpj)) {
    mostrarNotificacao('CNPJ inválido. Verifique o formato.', 'erro');
    return;
  }
  
  dadosMotorista = { nome, sobrenome, cnpj, cargo: cargos.join(', ') };
  proximaTela('notasFiscais');
}

function validarCNPJ(cnpj) {
  cnpj = cnpj.replace(/[^\d]/g, '');
  if (cnpj.length !== 14) return false;
  if (/^(\d)\1+$/.test(cnpj)) return false;
  return true;
}

// Funções de interface
function mostrarNotificacao(mensagem, tipo = 'sucesso') {
  const notificacao = document.createElement('div');
  notificacao.className = `notificacao ${tipo}`;
  notificacao.textContent = mensagem;
  notificacao.style.background = tipo === 'erro' ? '#f44336' : '#4caf50';
  
  document.body.appendChild(notificacao);
  
  setTimeout(() => {
    notificacao.remove();
  }, 3000);
}

// Funções de notas fiscais
function validarNotas() {
  const chave = document.getElementById('chaveNFe').value.trim();
  
  if (!chave) {
    alert('Por favor, digite a chave da nota fiscal.');
    return;
  }

  if (chave.length !== 44) {
    alert('A chave da nota fiscal deve ter 44 dígitos.');
    return;
  }

  notasFiscais = [{ chave }];
  
  numeroSenha = Math.floor(Math.random() * 9000) + 1000;
  
  document.getElementById('resumoNome').textContent = dadosMotorista.nome + ' ' + dadosMotorista.sobrenome;
  document.getElementById('resumoEmpresa').textContent = dadosMotorista.cnpj;
  document.getElementById('resumoCargo').textContent = dadosMotorista.cargo;
  document.getElementById('resumoNotas').textContent = notasFiscais[0].chave;
  document.getElementById('numeroSenha').textContent = numeroSenha;
  
  proximaTela('resumo');
}

// Funções de pagamento
function gerarQRCode() {
  const valorTotal = notasFiscais.reduce((total, nota) => total + nota.valor, 0);
  document.getElementById('valorPagamento').textContent = 'R$ ' + valorTotal.toFixed(2);
  
  const dadosPix = {
    valor: valorTotal.toFixed(2),
    senha: numeroSenha,
    motorista: dadosMotorista.nome + ' ' + dadosMotorista.sobrenome
  };
  
  const qrCodeData = JSON.stringify(dadosPix);
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrCodeData)}`;
  
  document.getElementById('qrCodeImg').src = qrCodeUrl;
}

function enviarWhatsApp() {
  const mensagem = `Olá! Sua senha é ${numeroSenha}. Acompanhe seu atendimento no painel.`;
  const url = `https://wa.me/5511999999999?text=${encodeURIComponent(mensagem)}`;
  window.open(url, '_blank');
}

function confirmarPagamento() {
  const valorTotal = notasFiscais.reduce((total, nota) => total + nota.valor, 0);
  document.getElementById('valorFinal').textContent = 'R$ ' + valorTotal.toFixed(2);
  document.getElementById('senhaFinal').textContent = numeroSenha;
  
  const botao = event.target;
  const textoOriginal = botao.textContent;
  botao.textContent = 'Processando...';
  botao.disabled = true;
  
  setTimeout(() => {
    proximaTela('confirmacao');
    botao.textContent = textoOriginal;
    botao.disabled = false;
  }, 2000);
}

function finalizarAtendimento() {
  setTimeout(() => {
    alert('Atendimento finalizado! Obrigado por utilizar nosso sistema.');
    dadosMotorista = {};
    notasFiscais = [];
    numeroSenha = 0;
    
    proximaTela('boasVindas');
    
    document.getElementById('nome').value = '';
    document.getElementById('sobrenome').value = '';
    document.getElementById('cnpj').value = '';
    document.getElementById('cargo').value = '';
    document.getElementById('chaveNFe').value = '';
    document.getElementById('valorNota').value = '';
    document.getElementById('listaNotas').style.display = 'none';
  }, 1000);
}

function enviarSMS() {
  const telefone = document.getElementById('whatsapp').value;
  const mensagem = `Olá! Sua senha é ${numeroSenha}. Acompanhe seu atendimento no painel.`;
  // Implementar integração com serviço de SMS
  mostrarNotificacao('SMS enviado com sucesso!');
}

function escolherFormaPagamento(tipo) {
  const qrCodeContainer = document.getElementById('qrCodeContainer');
  const linkContainer = document.getElementById('linkContainer');
  
  if (tipo === 'qrcode') {
    qrCodeContainer.style.display = 'block';
    linkContainer.style.display = 'none';
  } else {
    qrCodeContainer.style.display = 'none';
    linkContainer.style.display = 'block';
  }
}

function copiarLink() {
  const linkInput = document.getElementById('linkPagamento');
  linkInput.select();
  document.execCommand('copy');
  mostrarNotificacao('Link copiado para a área de transferência!');
}

function emitirRecibo() {
  // Simulação de geração de recibo para protótipo
  const botao = event.target;
  const textoOriginal = botao.innerHTML;
  botao.innerHTML = '<span style="display: flex; align-items: center; gap: 8px;">⏳ Gerando recibo...</span>';
  botao.disabled = true;
  
  setTimeout(() => {
    mostrarNotificacao('Recibo gerado com sucesso!');
    botao.innerHTML = textoOriginal;
    botao.disabled = false;
    
    // Simula download do recibo (apenas para protótipo)
    setTimeout(() => {
      mostrarNotificacao('Recibo baixado com sucesso!', 'sucesso');
    }, 500);
  }, 2000);
}

function enviarReciboWhatsApp() {
  const mensagem = `*Recibo de Pagamento*\n\nSenha: ${numeroSenha}\nData: ${new Date().toLocaleDateString()}\nStatus: Pago✅`;
  const url = `https://wa.me/55119999999999?text=${encodeURIComponent(mensagem)}`;
  window.open(url, '_blank');
  mostrarNotificacao('Abrindo WhatsApp...', 'sucesso');
}

function enviarSMS() {
  mostrarNotificacao('SMS enviado com sucesso!', 'sucesso');
}

function copiarLink() {
  const linkInput = document.getElementById('linkPagamento');
  linkInput.select();
  document.execCommand('copy');
  mostrarNotificacao('Link copiado para a área de transferência!', 'sucesso');
}

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
  atualizarProgresso();
  
  // Formatar campo de WhatsApp
  const whatsappInput = document.getElementById('whatsapp');
  if (whatsappInput) {
    whatsappInput.addEventListener('input', (e) => {
      let value = e.target.value.replace(/\D/g, '');
      if (value.length <= 11) {
        value = value.replace(/^(\d{2})(\d{5})(\d{4}).*/, '($1) $2-$3');
        e.target.value = value;
      }
    });
  }
});
