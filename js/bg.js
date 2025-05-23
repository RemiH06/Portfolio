document.addEventListener('DOMContentLoaded', loadCatalog);

async function loadCatalog() {
  const resp = await fetch('./json/bg.json');
  const items = await resp.json();
  const container = document.getElementById('catalog');

  items.forEach(item => {
    const card = document.createElement('div');
    card.classList.add('catalog-item');

    card.innerHTML = `
      <img src="${item.imagen}" alt="${item.nombre}" />
      <div class="info">
        <h3>${item.game}</h3>
      </div>
    `;
    container.appendChild(card);
  });
}
