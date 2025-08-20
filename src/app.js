window.abrirPopup = abrirPopup;
window.proximaTela = proximaTela;
window.voltarTela = voltarTela;
window.validarIdentificacao = validarIdentificacao;
window.adicionarNotaFiscal = adicionarNotaFiscal;
window.validarNotas = validarNotas;
window.escolherFormaPagamento = escolherFormaPagamento;
window.copiarLink = copiarLink;
window.confirmarPagamento = confirmarPagamento;
window.emitirRecibo = emitirRecibo;
window.enviarReciboWhatsApp = enviarReciboWhatsApp;
window.enviarWhatsApp = enviarWhatsApp;
window.enviarSMS = enviarSMS;
window.copiarPopupLink = copiarPopupLink;
window.enviarPopupMensagem = enviarPopupMensagem;
window.fecharPopup = fecharPopup;
window.limparNotasFiscais = limparNotasFiscais;
window.carregarDadosMotorista = carregarDadosMotorista;
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
  if (telaAtual === 'resumo') {
    if (contadorInterval) {
      clearInterval(contadorInterval);
    }
    const telaResumo = document.getElementById('telaResumo');
    telaResumo.removeEventListener('click', reiniciarContador);
    telaResumo.removeEventListener('touchstart', reiniciarContador);
  }

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
  
  dadosMotorista = { nome, sobrenome, cnpj, whatsapp, cargo: cargos.join(', ') };
  // Salva dados no sessionStorage
  sessionStorage.setItem('dadosMotorista', JSON.stringify(dadosMotorista));
  proximaTela('notasFiscais');
}

function validarCNPJ(cnpj) {
  cnpj = cnpj.replace(/[^\d]/g, '');
  if (cnpj.length !== 14) return false;
  if (/^(\d)\1+$/.test(cnpj)) return false;
  return true;
}

// Função para carregar dados do motorista do sessionStorage
function carregarDadosMotorista() {
  const dados = sessionStorage.getItem('dadosMotorista');
  if (dados) {
    dadosMotorista = JSON.parse(dados);
    console.log('Dados do motorista carregados:', dadosMotorista);
  }
}

// Função para limpar dados das notas fiscais
function limparNotasFiscais() {
  notasFiscais = [];
  atualizarListaNotas();
  document.getElementById('chaveNFe').value = '';
}

// Função para validar formato da chave NFe
function validarFormatoChaveNFe(chave) {
  // Verificar se contém apenas números
  if (!/^\d+$/.test(chave)) {
    return { valido: false, mensagem: 'A chave deve conter apenas números.' };
  }
  
  // Verificar comprimento
  if (chave.length !== 44) {
    return { valido: false, mensagem: 'A chave deve ter exatamente 44 dígitos.' };
  }
  
  return { valido: true, mensagem: '' };
}

// interface
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

function adicionarNotaFiscal() {
  // Carregar dados do motorista do sessionStorage
  carregarDadosMotorista();
  
  // Verificar se os dados de identificação foram preenchidos
  if (!dadosMotorista.cnpj) {
    mostrarNotificacao('É necessário preencher a identificação primeiro. Volte e informe o CNPJ da empresa.', 'erro');
    return;
  }
  
  const chaveInput = document.getElementById('chaveNFe');
  const chave = chaveInput.value.trim();
  
  if (!chave) {
    mostrarNotificacao('Digite a chave da nota fiscal.', 'erro');
    return;
  }
  
  // Validar formato da chave
  const validacaoFormato = validarFormatoChaveNFe(chave);
  if (!validacaoFormato.valido) {
    mostrarNotificacao(validacaoFormato.mensagem, 'erro');
    return;
  }
  
  if (notasFiscais.some(n => n.chave === chave)) {
    mostrarNotificacao('Esta nota já foi adicionada.', 'erro');
    return;
  }
  
  // Extrair série (posições 23-25) e número (posições 26-34)
  const serie = chave.substring(22, 25); // Posição 23 a 25
  const numero = chave.substring(25, 34); // Posição 26 a 34
  
  // Validar se os dígitos 7-20 correspondem ao CNPJ cadastrado
  const cnpjChave = chave.substring(6, 20); // Posições 7 a 20
  const cnpjCadastrado = dadosMotorista.cnpj.replace(/[^\d]/g, '');
  
  console.log('CNPJ da chave:', cnpjChave);
  console.log('CNPJ cadastrado:', cnpjCadastrado);
  console.log('São iguais?', cnpjChave === cnpjCadastrado);
  
  if (cnpjChave !== cnpjCadastrado) {
    mostrarNotificacao('Esta nota fiscal não pertence à empresa registrada para entrega. Verifique o CNPJ.', 'erro');
    return;
  }
  
  // Adicionar nota com série e número
  notasFiscais.push({ 
    chave, 
    serie, 
    numero,
    cnpjEmpresa: cnpjChave
  });
  
  chaveInput.value = '';
  atualizarListaNotas();
  mostrarNotificacao(`Nota fiscal ${numero}-${serie} adicionada com sucesso!`, 'sucesso');
}

function atualizarListaNotas() {
  const listaDiv = document.getElementById('listaNotas');
  const ul = document.getElementById('notasAdicionadas');
  ul.innerHTML = '';
  
  if (notasFiscais.length > 0) {
    listaDiv.style.display = 'block';
    notasFiscais.forEach((nota, idx) => {
      const li = document.createElement('li');
      li.style.cssText = 'display: flex; justify-content: space-between; align-items: center; padding: 10px; border: 1px solid #ddd; border-radius: 5px; margin-bottom: 8px; background: #f9f9f9;';
      
      // Formato solicitado: "Número - Série" (ex: 122463 - 003)
      const spanNota = document.createElement('span');
      spanNota.textContent = `${nota.numero} - ${nota.serie}`;
      spanNota.style.cssText = 'font-weight: bold; font-size: 16px; color: #333;';
      li.appendChild(spanNota);
      
      // Botão remover
      const btn = document.createElement('button');
      btn.textContent = 'Remover';
      btn.style.cssText = 'background: #f44336; color: white; border: none; padding: 5px 10px; border-radius: 3px; cursor: pointer;';
      btn.onclick = () => {
        notasFiscais.splice(idx, 1);
        atualizarListaNotas();
      };
      li.appendChild(btn);
      
      ul.appendChild(li);
    });
  } else {
    listaDiv.style.display = 'none';
  }
}

let tempoRestante = 15;
let contadorInterval;

function iniciarContador() {
  if (contadorInterval) {
    clearInterval(contadorInterval);
  }
  
 
  tempoRestante = 15;
  document.getElementById('contador').textContent = tempoRestante;
  
 
  contadorInterval = setInterval(() => {
    tempoRestante--;
    document.getElementById('contador').textContent = tempoRestante;
    
    if (tempoRestante <= 0) {
      clearInterval(contadorInterval);
      proximaTela('boasVindas');
    }
  }, 1000);
}

function reiniciarContador() {
  iniciarContador();
}

function validarNotas() {
  if (notasFiscais.length === 0) {
    mostrarNotificacao('Adicione pelo menos uma nota fiscal.', 'erro');
    return;
  }
  
  numeroSenha = Math.floor(Math.random() * 9000) + 1000;
  
  // Recupera dados do motorista do sessionStorage
  const dados = JSON.parse(sessionStorage.getItem('dadosMotorista') || '{}');
  dadosMotorista = dados;
  
  document.getElementById('resumoNome').textContent = (dadosMotorista.nome || '') + ' ' + (dadosMotorista.sobrenome || '');
  document.getElementById('resumoEmpresa').textContent = 'Dia a Dia Atacadista S/A';
  document.getElementById('resumoCargo').textContent = dadosMotorista.cargo || '';
  document.getElementById('resumoNotas').textContent = `${notasFiscais.length} nota(s) - ${notasFiscais.map(n => `${n.numero}-${n.serie}`).join(', ')}`;
  document.getElementById('numeroSenha').textContent = numeroSenha;
  
  proximaTela('resumo');
  
  // Iniciar contador
  iniciarContador();
  
  // Adicionar eventos para reiniciar contador
  const telaResumo = document.getElementById('telaResumo');
  telaResumo.addEventListener('click', reiniciarContador);
  telaResumo.addEventListener('touchstart', reiniciarContador);
}

//o popup de acompanhamento
function abrirPopup(tipo) {
  console.log('Abrindo popup:', tipo); // Debug

  // Recupera dados do motorista
  const dados = JSON.parse(sessionStorage.getItem('dadosMotorista') || '{}');
  const nome = (dados.nome || '') + ' ' + (dados.sobrenome || '');
  const empresa = 'Dia a Dia Atacadista S/A';
  const telefone = dados.whatsapp || '';
  const senha = numeroSenha || '';
  const totalNotas = notasFiscais.length;
  
  // Calcular valor da descarga
  let valorDescarga = 0;
  if (notasFiscais.length > 0 && notasFiscais[0].valor) {
    valorDescarga = notasFiscais.reduce((total, nota) => total + (nota.valor || 0), 0);
  }
  
  if (!valorDescarga) valorDescarga = 50 * totalNotas;
  
  // Gerar link de acompanhamento
  const linkAcompanhamento = 'https://painel.diaadia.com.br/atendimento/' + senha;

  console.log('Dados do popup:', { nome, empresa, senha, totalNotas, valorDescarga }); // Debug

  // Atualizar conteúdo do popup
  document.getElementById('popupTitulo').textContent = tipo === 'whatsapp' ? 'Acompanhar via WhatsApp' : 'Acompanhar via SMS';
  document.getElementById('popupNome').textContent = nome;
  document.getElementById('popupEmpresa').textContent = empresa;
  document.getElementById('popupSenha').textContent = senha;
  document.getElementById('popupTotalNotas').textContent = `${totalNotas} nota(s) - ${notasFiscais.map(n => `${n.numero}-${n.serie}`).join(', ')}`;
  document.getElementById('popupValorDescarga').textContent = 'R$ ' + valorDescarga.toFixed(2);
  document.getElementById('popupTelefone').value = telefone;
  document.getElementById('popupLink').value = linkAcompanhamento;

  const popup = document.getElementById('popupAcompanhamento');
  popup.classList.add('active');
  popup.style.display = 'flex';
  popup.setAttribute('data-tipo', tipo);
  
  console.log('Popup aberto:', popup.style.display); // Debug
}


function fecharPopup() {
  console.log('Fechando popup'); // Debug
  const popup = document.getElementById('popupAcompanhamento');
  popup.classList.remove('active');
  popup.style.display = 'none';
  console.log('Popup fechado:', popup.style.display); // Debug
}


function copiarPopupLink() {
  const linkInput = document.getElementById('popupLink');
  linkInput.select();
  document.execCommand('copy');
  mostrarNotificacao('Link copiado!', 'sucesso');
}


function enviarPopupMensagem() {
  // Recupera dados do popup
  const nome = document.getElementById('popupNome').textContent;
  const empresa = 'Dia a Dia Atacadista S/A';
  const senha = document.getElementById('popupSenha').textContent;
  const totalNotas = document.getElementById('popupTotalNotas').textContent;
  const valorDescarga = document.getElementById('popupValorDescarga').textContent;
  const telefone = document.getElementById('popupTelefone').value.replace(/\D/g, '');
  const link = document.getElementById('popupLink').value;
  const tipo = document.getElementById('popupAcompanhamento').getAttribute('data-tipo');

  // Criar mensagem com informações das notas fiscais
  const notasInfo = notasFiscais.map(n => `${n.numero}-${n.serie}`).join(', ');
  const mensagem = `Olá, ${nome}!%0AEmpresa: ${empresa}%0ASenha: ${senha}%0ANotas Fiscais: ${notasInfo}%0ATotal de notas: ${notasFiscais.length}%0AValor da descarga: ${valorDescarga}%0AAcompanhe por aqui: ${link}`;

  if (tipo === 'whatsapp') {
    // Abre WhatsApp Web/App com mensagem pronta
    window.open(`https://wa.me/55${telefone}?text=${mensagem}`, '_blank');
  } else {
    // Abre app de SMS (sintaxe para mobile)
    window.open(`sms:+55${telefone}?body=${mensagem.replace(/%0A/g, '\n')}`, '_blank');
  }
  fecharPopup();
}



function gerarQRCode() {
  // Calcular valor total da descarga
  const valorTotal = notasFiscais.length * 50;
  
  // Atualizar interface
  document.getElementById('senhaValorDescarga').textContent = numeroSenha;
  document.getElementById('empresaPagamento').textContent = 'Dia a Dia Atacadista S/A';
  document.getElementById('totalNotas').textContent = notasFiscais.length;
  document.getElementById('valorPagamento').textContent = 'R$ ' + valorTotal.toFixed(2);
  
  // Preparar dados para o QR Code
  const dadosPix = {
    senha: numeroSenha,
    empresa: 'Dia a Dia Atacadista S/A',
    totalNotas: notasFiscais.length,
    valorDescarga: 'R$ ' + valorTotal.toFixed(2),
    motorista: dadosMotorista.nome + ' ' + dadosMotorista.sobrenome,
    notasFiscais: notasFiscais.map(n => ({ numero: n.numero, serie: n.serie, cnpj: n.cnpjEmpresa }))
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


let tempoValidacao = 15;
let contadorValidacaoInterval;

function iniciarContadorValidacao() {
  // Limpa qualquer contador existente
  if (contadorValidacaoInterval) {
    clearInterval(contadorValidacaoInterval);
  }
  
  
  tempoValidacao = 15;
  document.getElementById('contadorValidacao').textContent = tempoValidacao;
  
  
  const popup = document.getElementById('popupValidacaoPagamento');
  popup.style.display = 'flex';
  
  
  contadorValidacaoInterval = setInterval(() => {
    tempoValidacao--;
    document.getElementById('contadorValidacao').textContent = tempoValidacao;
    
    if (tempoValidacao <= 0) {
      clearInterval(contadorValidacaoInterval);
      // Se o tempo acabar, confirma automaticamente
      confirmarValidacaoPagamento();
    }
  }, 1000);
}

function confirmarValidacaoPagamento() {
  // Limpa o contador
  if (contadorValidacaoInterval) {
    clearInterval(contadorValidacaoInterval);
  }
  
  
  document.getElementById('popupValidacaoPagamento').style.display = 'none';
  
  
  document.querySelector('#telaConfirmacao .conteudo').style.display = 'block';
}

function cancelarValidacaoPagamento() {

  if (contadorValidacaoInterval) {
    clearInterval(contadorValidacaoInterval);
  }
  
  
  proximaTela('pagamento');
  
 
  mostrarNotificacao('Pagamento não validado. Tente novamente.', 'erro');
}

function confirmarPagamento() {
  const valorTotal = notasFiscais.length * 50;
  document.getElementById('valorFinal').textContent = 'R$ 50,00';
  document.getElementById('senhaFinal').textContent = numeroSenha;
  
  const botao = event.target;
  const textoOriginal = botao.textContent;
  botao.textContent = 'Processando...';
  botao.disabled = true;
  
  setTimeout(() => {
    proximaTela('confirmacao');
    // Esconde o conteúdo da tela de confirmação até a validação
    document.querySelector('#telaConfirmacao .conteudo').style.display = 'none';
    // Inicia o processo de validação
    iniciarContadorValidacao();
    botao.textContent = textoOriginal;
    botao.disabled = false;
  }, 2000);
}

function finalizarAtendimento() {
  setTimeout(() => {
    alert('Atendimento finalizado! Obrigado por utilizar nosso sistema.');
    dadosMotorista = {};
    limparNotasFiscais();
    numeroSenha = 0;
    
    proximaTela('boasVindas');
    
    // Limpar campos de identificação
    document.getElementById('nome').value = '';
    document.getElementById('sobrenome').value = '';
    document.getElementById('cnpj').value = '';
    document.getElementById('whatsapp').value = '';
    
    // Limpar checkboxes de cargo
    document.querySelectorAll('input[name="cargo"]').forEach(cb => cb.checked = false);
    
    // Limpar lista de notas
    document.getElementById('listaNotas').style.display = 'none';
  }, 1000);
}

function enviarSMS() {
  const telefone = document.getElementById('whatsapp').value;
  const mensagem = `Olá! Sua senha é ${numeroSenha}. Acompanhe seu atendimento no painel.`;
  
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
  mostrarNotificacao('Enviado para o WhatsApp!');
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
    
    setTimeout(() => {
      mostrarNotificacao('Recibo baixado com sucesso!', 'sucesso');
    }, 500);
  }, 2000);
}

function enviarReciboWhatsApp() {
  mostrarNotificacao('Recibo Enviado para o WhatsApp!', 'sucesso');
  
}

function enviarSMS() {
  mostrarNotificacao('SMS enviado com sucesso!', 'sucesso');
}

function copiarLink() {
  const linkInput = document.getElementById('linkPagamento');
  linkInput.select();
  document.execCommand('copy');
  mostrarNotificacao('Enviado para o WhatsApp!', 'sucesso');
}


document.addEventListener('DOMContentLoaded', () => {
  atualizarProgresso();
  
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

 
  atualizarListaNotas();

   
    const cnpjInput = document.getElementById('cnpj');
    if (cnpjInput) {
      cnpjInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 14) value = value.slice(0, 14);
        if (value.length > 12) {
          value = value.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5');
        } else if (value.length > 8) {
          value = value.replace(/^(\d{2})(\d{3})(\d{3})(\d{0,4})$/, '$1.$2.$3/$4');
        } else if (value.length > 5) {
          value = value.replace(/^(\d{2})(\d{3})(\d{0,3})$/, '$1.$2.$3');
        } else if (value.length > 2) {
          value = value.replace(/^(\d{2})(\d{0,3})$/, '$1.$2');
        }
        e.target.value = value;
      });
    }
});
