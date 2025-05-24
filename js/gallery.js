document.addEventListener('DOMContentLoaded', loadCatalog);

async function loadCatalog() {
  const resp = await fetch('./json/gallery.json');
  const items = await resp.json();
  const container = document.getElementById('catalog');

  items.forEach(item => {
    const card = document.createElement('div');
    card.classList.add('catalog-item');

    card.innerHTML = `
      <img src="${item.imagen}" alt="${item.name}" />
      <div class="info">
        <h3>${item.name}</h3>
        <p>${item.location}</p>
        <p>${item.date}</p>
      </div>
    `;
    container.appendChild(card);
  });
}
