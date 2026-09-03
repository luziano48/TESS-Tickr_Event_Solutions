const STORAGE_KEY = 'ticketa-orders';
const TIMEOUT = 800;

function getOrdersSalvos() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (error) {
    console.warn('Não foi possível carregar os bilhetes guardados:', error);
    return [];
  }
}

function buscarBilhetesPorTelefone(telefone) {
  const pedidos = getOrdersSalvos();
  const numero = String(telefone || '').replace(/\D/g, '');

  return pedidos.filter((pedido) => {
    const numeroPedido = String(pedido.telefone ?? pedido.phone ?? '').replace(/\D/g, '');
    return numeroPedido === numero;
  });
}

const BASE_DADOS_DEMO = {
  "923000000": {
    estado: "pendente"
  },
  "941271622": {
    estado: "aprovado",
    codigo: "TCK-4X92-LD",
    evento: "Noite Afrobeat — Luanda",
    dataLocal: "15 de Agosto · 21h00 · Talatona",
    titular: "Luziano D.",
    tipo: "Pista",
    quantidade: 2
  },
  "923456789": {
    estado: "aprovado",
    codigo: "TCK-7K15-LD",
    evento: "SWAT NA CIDADE",
    dataLocal: "8 de Agosto · 16h00 · Old Mutual",
    titular: "Nelsa M.",
    tipo: "VIP",
    quantidade: 1
  }
};

const estados = {
  busca: document.getElementById('estado-busca'),
  pendente: document.getElementById('estado-pendente'),
  aprovado: document.getElementById('estado-aprovado')
};

function mostrarEstado(nome) {
  Object.values(estados).forEach(el => el.classList.remove('ativo'));
  estados[nome].classList.add('ativo');
}

function limparErro() {
  document.getElementById('erro-msg').classList.remove('ativo');
}

function formatarTelefone(e) {
  const input = e.target;
  let valor = input.value.replace(/\D/g, '');
  
  if (valor.length > 9) {
    valor = valor.slice(0, 9);
  }
  
  if (valor.length >= 3 && valor.length <= 6) {
    valor = valor.slice(0, 3) + ' ' + valor.slice(3);
  } else if (valor.length > 6) {
    valor = valor.slice(0, 3) + ' ' + valor.slice(3, 6) + ' ' + valor.slice(6);
  }
  
  input.value = valor;
}

function procurarBilhete() {
  const input = document.getElementById('telefone');
  const numero = input.value.replace(/\D/g, '').trim();
  limparErro();
  document.getElementById('contacto-suporte').style.display = 'none';

  if (!numero || numero.length < 9) {
    document.getElementById('erro-msg').classList.add('ativo');
    input.focus();
    return;
  }

  const btn = document.getElementById('btn-procurar');
  const spinner = document.getElementById('spinner');
  const texto = document.getElementById('btn-procurar-texto');

  btn.disabled = true;
  spinner.classList.add('ativo');
  texto.textContent = 'A procurar...';

  setTimeout(() => {
    btn.disabled = false;
    spinner.classList.remove('ativo');
    texto.textContent = 'Procurar Bilhete';

    const bilhetesSalvos = buscarBilhetesPorTelefone(numero);
    const registo = bilhetesSalvos[0] || BASE_DADOS_DEMO[numero];

    if (!registo) {
      document.getElementById('erro-msg').classList.add('ativo');
      document.getElementById('contacto-suporte').style.display = 'block';
      input.focus();
      return;
    }

    if (registo.status === 'pendente' || registo.estado === 'pendente') {
      mostrarEstado('pendente');
      return;
    }

    if (registo.status === 'aprovado' || registo.estado === 'aprovado') {
      const bilheteFormatado = {
        codigo: registo.id || registo.codigo,
        evento: registo.eventName || registo.evento,
        dataLocal: registo.eventDate || registo.dataLocal,
        titular: registo.titular || registo.name,
        tipo: registo.tipo || 'Pista',
        quantidade: registo.quantidade || 1,
        status: registo.status || registo.estado
      };

      preencherBilhete(bilheteFormatado);
      mostrarEstado('aprovado');
    }
  }, TIMEOUT);
}

function preencherBilhete(registo) {
  document.getElementById('ev-nome').textContent = registo.evento;
  document.getElementById('ev-meta').textContent = registo.dataLocal;
  document.getElementById('ev-codigo').textContent = registo.codigo;
  document.getElementById('det-titular').textContent = registo.titular;
  document.getElementById('det-tipo').textContent = registo.tipo;
  document.getElementById('det-qtd').textContent = registo.quantidade;

  const holder = document.getElementById('qr-holder');
  holder.innerHTML = '';
  new QRCode(holder, {
    text: registo.codigo,
    width: 180,
    height: 180,
    colorDark: "#063028",
    colorLight: "#ffffff",
    correctLevel: QRCode.CorrectLevel.M
  });
}

function resetarFormulario() {
  document.getElementById('telefone').value = '';
  document.getElementById('telefone').focus();
  limparErro();
  mostrarEstado('busca');
}

// Event listeners
document.getElementById('btn-procurar').addEventListener('click', procurarBilhete);

document.getElementById('telefone').addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    procurarBilhete();
  }
});

document.getElementById('telefone').addEventListener('input', formatarTelefone);

document.getElementById('btn-voltar-1').addEventListener('click', resetarFormulario);
document.getElementById('btn-voltar-2').addEventListener('click', resetarFormulario);