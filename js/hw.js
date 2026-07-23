let currentPanel = 1;
let totalPanels;

// icons by devicon
const iconMap = {
  'Arduino':           'devicon-arduino-plain',
  'C++':           'devicon-cplusplus-plain',
  'Raspberry Pi':      'devicon-raspberrypi-plain',
  'Oscilloscope':      'devicon-gnuplot-plain',
  'Multimeter':        'devicon-amazonwebservices-original',
  'VS Code':           'devicon-vscode-plain',
  'KiCad':             'devicon-kicad-plain',
  'Eagle':             "",
  'PCB':               "",
  'ESP32':             'devicon-esp32-plain',
  'NRF24':             'devicon-esp32-plain'
};

// junta los devicon (sin duplicados) de todos los componentes y herramientas de un proyecto
function getProjectIcons(project) {
  const seen = new Set();
  return [...project.componentes, ...project.herramientas]
    .map((name) => iconMap[name])
    .filter((cls) => cls && !seen.has(cls) && seen.add(cls))
    .map((cls) => `<i class="${cls} colored"></i>`)
    .join('');
}

async function loadProjects() {
  const response    = await fetch('./json/hw.json');
  const projects    = await response.json();
  const container   = document.getElementById('scrollContainer');
  const sidebarList = document.getElementById('sidebar-list');

  totalPanels = 1 + projects.length;

  projects.forEach((project, index) => {
    const panelNumber = index + 2;

    // 1) Crear paneles
    const panel = document.createElement('div');
    panel.classList.add('panel');
    panel.id = `panel${panelNumber}`;
    panel.innerHTML = `
      <a href="${project.github}" class="github-button" target="_blank">…</a>
      <h1>${project.nombre}</h1>
      <h2>
        Author(s): ${project.autor}
        &nbsp;|&nbsp; Status: ${project.status}
        &nbsp;|&nbsp; Comps & Tools: ${project.componentes.join(', ')} | ${project.herramientas.join(', ')}
      </h2>
      <div class="tech-icons-band">${getProjectIcons(project)}</div>
      <p><strong>Description:</strong> ${project.descripcion}</p>
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

    // 2) Crear ítems de la burger
    const li = document.createElement('li');
    li.classList.add('sidebar-item');
    li.dataset.panel = panelNumber;

    // íconos de hasta DOS herramientas
    const compIcons = project.herramientas.slice(0, 2).map(comp => {
      const cls = iconMap[comp];
      return cls
        ? `<i class="${cls} colored"></i>`
        : `<span>${comp}</span>`;
    }).join('');

    // icono del PRIMER componente
    const firstTool = project.componentes[0] || '';
    const toolHtml = iconMap[firstTool]
      ? `<i class="${iconMap[firstTool]} colored"></i>`
      : `<span class="tool-name">${firstTool}</span>`;

    li.innerHTML = `
      <span class="sidebar-name">${project.nombre}</span>
      <div class="sidebar-icons">
        ${compIcons}
        ${toolHtml}
      </div>
    `;
    sidebarList.appendChild(li);
  });

  // 3) Click en ítems de la burger
  document.querySelectorAll('.sidebar-item').forEach(item => {
    item.addEventListener('click', () => {
      const target = Number(item.dataset.panel);
      scrollToPanel(target);
      document.getElementById('sidebar').classList.remove('open');
    });
  });
}

// 4) Toggle sidebar
document.getElementById('hamburger')
  .addEventListener('click', () => {
    document.getElementById('sidebar').classList.toggle('open');
  });

loadProjects();

function scrollToPanel(panelNumber) {
  const targetPanel = document.getElementById(`panel${panelNumber}`);
  if (targetPanel) {
    targetPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
    currentPanel = panelNumber;
  }
}

// deja scrollear dentro del piso; bloquea el wheel solo cuando ya no hay más
// contenido para scrollear en esa dirección, para que no salte al siguiente piso
document.getElementById('scrollContainer').addEventListener(
  'wheel',
  (event) => {
    const panel = event.target.closest('.panel');
    if (!panel) return;

    const scrollingDown =
      event.deltaY > 0 &&
      panel.scrollTop + panel.clientHeight < panel.scrollHeight;
    const scrollingUp = event.deltaY < 0 && panel.scrollTop > 0;

    if (!scrollingDown && !scrollingUp) event.preventDefault();
  },
  { passive: false }
);