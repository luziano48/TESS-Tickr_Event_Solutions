document.addEventListener('DOMContentLoaded', async () => {
  let eventoAtual = null; // Armazenar os dados do evento carregado

  // 1. Obter o ID do evento a partir da URL
  const params = new URLSearchParams(window.location.search);
  const eventId = params.get('id');

  if (!eventId) {
    document.body.innerHTML = '<h1>Evento não encontrado</h1><p>O ID do evento não foi fornecido.</p>';
    return;
  }

  // 2. Buscar os dados de todos os eventos
  try {
    // O caminho '../eventos.json' assume que este script está na pasta 'Event'
    const response = await fetch('../eventos.json');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const eventos = await response.json();

    // 3. Encontrar o evento específico pelo ID
    const evento = eventos.find(e => e.id === eventId);
    eventoAtual = evento; // Salva o evento para uso posterior (no modal)

    if (!evento) {
      document.body.innerHTML = `<h1>Evento "${eventId}" não encontrado.</h1>`;
      return;
    }

    // 4. Preencher a página com os dados do evento
    // Certifique-se de que seu Event/index.html tem elementos com estes IDs
    document.title = `${evento.title} — Tess`; // Atualiza o título da aba do navegador
    document.getElementById('event-title').textContent = evento.title;
    document.getElementById('event-image').src = `../${evento.image}`; // Adiciona ../ para corrigir o caminho da imagem
    document.getElementById('event-image').alt = evento.title;
    document.getElementById('event-date').textContent = evento.date;
    document.getElementById('event-location').textContent = `${evento.location}, ${evento.city}`;
    document.getElementById('event-description').textContent = evento.description;
    
    const priceElement = document.getElementById('event-price');
    if (priceElement) {
      priceElement.textContent = evento.price.toLowerCase().includes('definir') ? evento.price : `KZ ${evento.price}`;
    }

  } catch (error) {
    console.error('Erro ao buscar ou processar dados do evento:', error);
    document.body.innerHTML = '<h1>Ocorreu um erro</h1><p>Não foi possível carregar as informações do evento. Tente novamente mais tarde.</p>';
  }

  // ---- LÓGICA DO MODAL DE COMPRA ----
  const modal = document.getElementById('modal');
  const openBtn = document.getElementById('open-btn');
  const closeBtn = document.getElementById('close-btn');
  const closeBtn2 = document.getElementById('close-btn-2');
  const buyForm = document.getElementById('buy-form');
  const successScreen = document.getElementById('success');
  const qtyEl = document.getElementById('qty');
  const totalEl = document.getElementById('total');
  const minusBtn = document.getElementById('minus');
  const plusBtn = document.getElementById('plus');

  if (!modal || !openBtn || !closeBtn || !buyForm) return;

  const toggleModal = (force) => {
    modal.classList.toggle('hidden', force);
    document.body.classList.toggle('modal-open', !force);
  };

  openBtn.addEventListener('click', () => toggleModal(false));
  closeBtn.addEventListener('click', () => toggleModal(true));
  closeBtn2.addEventListener('click', () => {
    toggleModal(true);
    // Reseta o formulário para a próxima abertura
    buyForm.classList.remove('hidden');
    successScreen.classList.add('hidden');
    buyForm.reset();
    updateTotal();
  });

  // Lógica da quantidade
  let qty = 1;
  const updateQty = () => {
    qtyEl.textContent = qty;
    updateTotal();
  };

  const updateTotal = () => {
    if (!eventoAtual || !totalEl) return;
    const priceString = eventoAtual.price.replace(',', '.');
    const price = parseFloat(priceString);

    if (isNaN(price)) {
      totalEl.textContent = 'A definir';
    } else {
      const total = (price * qty).toFixed(2).replace('.', ',');
      totalEl.textContent = `KZ ${total}`;
    }
  };

  minusBtn.addEventListener('click', () => {
    if (qty > 1) {
      qty--;
      updateQty();
    }
  });

  plusBtn.addEventListener('click', () => {
    qty++;
    updateQty();
  });

  // Lógica do formulário
  buyForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(buyForm);
    document.getElementById('s-name').textContent = formData.get('name');
    document.getElementById('s-email').textContent = formData.get('email');
    document.getElementById('s-qty').textContent = qty;
    buyForm.classList.add('hidden');
    successScreen.classList.remove('hidden');
  });

  updateTotal(); // Define o total inicial ao carregar a página
});