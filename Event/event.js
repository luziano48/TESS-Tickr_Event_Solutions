document.addEventListener('DOMContentLoaded', async () => {
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

    const purchaseLink = document.getElementById('open-btn');
    if (purchaseLink) purchaseLink.href = `compra.html?id=${encodeURIComponent(evento.id)}`;

    const priceElement = document.getElementById('event-price');
    if (priceElement) {
      priceElement.textContent = evento.price.toLowerCase().includes('definir') ? evento.price : `KZ ${evento.price}`;
    }

  } catch (error) {
    console.error('Erro ao buscar ou processar dados do evento:', error);
    document.body.innerHTML = '<h1>Ocorreu um erro</h1><p>Não foi possível carregar as informações do evento. Tente novamente mais tarde.</p>';
  }

});
