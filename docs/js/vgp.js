document.addEventListener('DOMContentLoaded', loadCatalog);

async function loadCatalog() {
  const resp = await fetch('./json/vgp.json');
  const items = await resp.json();
  const container = document.getElementById('catalog');

  items.forEach(item => {
    const card = document.createElement('div');
    card.classList.add('catalog-item');

    card.innerHTML = `
      <img src="${item.imagen}" alt="${item.game}" />
      <div class="info">
        <h3>${item.game}</h3>
        <p>${item.nick}</p>
      </div>
    `;
    container.appendChild(card);
  });
}
