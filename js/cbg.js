let currentPanel = 1;
let totalPanels;
let isScrolling = false;

// perso icons // will create them when I upload all my ideas
const iconMap = {
  'Cards':  'icon-cards',
  'Pieces': 'icon-pieces',
  'Dices':  'icon-dices'
};

async function loadProjects() {
  const response    = await fetch('./json/cbg.json');
  const projects    = await response.json();
  const container   = document.getElementById('scrollContainer');
  const sidebarList = document.getElementById('sidebar-list');

  totalPanels = 1 + projects.length;

  projects.forEach((project, index) => {
    const panelNumber = index + 2;

    const panel = document.createElement('div');
    panel.classList.add('panel');
    panel.id = `panel${panelNumber}`;
    panel.innerHTML = `
      <h1>${project.nombre}</h1>
      <h2>
        Author(s): ${project.autor}
        &nbsp;|&nbsp; Status: ${project.status}
        &nbsp;|&nbsp; Genre: ${project.genero}
        &nbsp;|&nbsp; Players: ${project.njugadores}
      </h2>
      <p><strong>Description:</strong> ${project.descripcion}</p>
      <div class="rules-container">
        <h3>Rules:</h3>
        <div class="rules-content">${project.reglas.replace(/\n/g, '<br>')}</div>
      </div>
      <div class="imagenes-proyecto">
        ${project.imagenes.map(img => `
          <div class="image-item">
            <img src="${img.src}" alt="Project img">
            <h3 class="caption">${img.caption}</h3>
          </div>
        `).join('')}
      </div>
      <button class="down" onclick="scrollToPanel(${panelNumber + 1})">&#x2193;</button>
      `;
    container.appendChild(panel);


    const li = document.createElement('li');
    li.classList.add('sidebar-item');
    li.dataset.panel = panelNumber;

    const genres = Array.isArray(project.genero)
      ? project.genero
      : [project.genero];

    const iconsHtml = genres.slice(0, 3).map(g => {
      const cls = iconMap[g];
      return cls
        ? `<i class="${cls}"></i>`
        : `<span>${g}</span>`;
    }).join('');

    li.innerHTML = `
      <span class="sidebar-name">${project.nombre}</span>
      <div class="sidebar-icons">
        ${iconsHtml}
      </div>
    `;
    sidebarList.appendChild(li);
  });

  document.querySelectorAll('.sidebar-item').forEach(item => {
    item.addEventListener('click', () => {
      scrollToPanel(Number(item.dataset.panel));
      document.getElementById('sidebar').classList.remove('open');
    });
  });
}

document.getElementById('hamburger')
  .addEventListener('click', () => {
    document.getElementById('sidebar').classList.toggle('open');
  });

loadProjects();

function scrollToPanel(panelNumber) {
  const target = document.getElementById(`panel${panelNumber}`);
  if (target) {
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    currentPanel = panelNumber;
  }
}

document.addEventListener('wheel', event => {
  if (isScrolling) return;
  isScrolling = true;
  setTimeout(() => { isScrolling = false; }, 500);

  if (event.deltaY > 0 && currentPanel < totalPanels) {
    currentPanel++;
  } else if (event.deltaY < 0 && currentPanel > 1) {
    currentPanel--;
  }
  scrollToPanel(currentPanel);
});
