document.addEventListener('DOMContentLoaded', async () => {
  let eventoAtual = null;

  const api = {
    async getEvents() {
      try {
        const response = await fetch('../eventos.json', { cache: 'no-store' });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return await response.json();
      } catch (error) {
        console.warn('Usando fallback do evento:', error);
        return [{
          id: 'osancle',
          title: 'O SANCLÉ',
          image: 'assets/O SANCLÉ OFF.png',
          city: 'Ndalatando',
          location: 'Rua do mazambique',
          date: 'A definir',
          description: 'Descrição detalhada sobre o evento O SANCLÉ.',
          price: '3.500,00'
        }];
      }
    },

    async getEventById(id) {
      const eventos = await this.getEvents();
      return eventos.find((event) => event.id === id) || null;
    }
  };

  const params = new URLSearchParams(window.location.search);
  const eventId = params.get('id');

  if (!eventId) {
    document.body.innerHTML = '<h1>Evento não encontrado</h1><p>O ID do evento não foi fornecido.</p>';
    return;
  }

  try {
    const evento = await api.getEventById(eventId);
    eventoAtual = evento;

    if (!evento) {
      document.body.innerHTML = `<h1>Evento "${eventId}" não encontrado.</h1>`;
      return;
    }

    document.title = `${evento.title} — Tess`;
    document.getElementById('event-title').textContent = evento.title;
    document.getElementById('event-image').src = `../${evento.image}`;
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
  const formError = document.getElementById('form-error');

  if (!modal || !openBtn || !closeBtn || !buyForm) return;

  const setFormError = (message) => {
    if (!formError) return;
    formError.textContent = message;
    formError.classList.toggle('hidden', !message);
  };

  const toggleModal = (force) => {
    modal.classList.toggle('hidden', force);
    document.body.classList.toggle('modal-open', !force);
  };

  openBtn.addEventListener('click', () => toggleModal(false));
  closeBtn.addEventListener('click', () => toggleModal(true));
  closeBtn2.addEventListener('click', () => {
    toggleModal(true);
    buyForm.classList.remove('hidden');
    successScreen.classList.add('hidden');
    buyForm.reset();
    setFormError('');
    updateTotal();
  });

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

  buyForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const formData = new FormData(buyForm);
    const name = String(formData.get('name') || '').trim();
    const email = String(formData.get('email') || '').trim();
    const phone = String(formData.get('phone') || '').trim();
    const phoneDigits = phone.replace(/\D/g, '');
    const card = String(formData.get('card') || '').replace(/\s+/g, '');
    const exp = String(formData.get('exp') || '').trim();
    const cvv = String(formData.get('cvv') || '').trim();

    if (name.length < 2) {
      setFormError('Informe um nome completo válido.');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setFormError('Informe um e-mail válido.');
      return;
    }

    if (phoneDigits.length < 9) {
      setFormError('Informe um telefone válido.');
      return;
    }

    if (card.length < 12) {
      setFormError('Número do cartão inválido.');
      return;
    }

    if (!/^\d{2}\/\d{2}$/.test(exp)) {
      setFormError('A data de expiração deve seguir o formato MM/AA.');
      return;
    }

    if (!/^\d{3,4}$/.test(cvv)) {
      setFormError('O CVV deve ter 3 ou 4 dígitos.');
      return;
    }

    const order = {
      id: `TCK-${Date.now().toString().slice(-8)}`,
      eventId: eventoAtual?.id || eventId,
      eventName: eventoAtual?.title || 'Evento',
      eventDate: eventoAtual?.date || 'A definir',
      eventLocation: `${eventoAtual?.location || ''}, ${eventoAtual?.city || ''}`.trim(),
      titular: name,
      email,
      telefone: phoneDigits,
      quantidade: qty,
      tipo: 'Pista',
      total: totalEl.textContent,
      status: 'aprovado',
      createdAt: new Date().toISOString()
    };

    const storageKey = 'ticketa-orders';
    const orders = JSON.parse(localStorage.getItem(storageKey) || '[]');
    orders.push(order);
    localStorage.setItem(storageKey, JSON.stringify(orders));

    setFormError('');
    document.getElementById('s-name').textContent = name;
    document.getElementById('s-email').textContent = email;
    document.getElementById('s-qty').textContent = qty;
    buyForm.classList.add('hidden');
    successScreen.classList.remove('hidden');
  });

  updateTotal();
});