let allEntries = [];

// 1) Carga de json
fetch('../json/rants.json')
    .then(res => res.json())
    .then(data => {
        allEntries = data.map(e => ({
            ...e,
            dateObj: new Date(e.date)
        }));
        renderEntries(allEntries);
    });

// 2) Renderizamos
function renderEntries(entries) {
    const container = document.getElementById('entriesContainer');
    if (!entries.length) {
        container.innerHTML = '<p>No hay entradas que coincidan.</p>';
        return;
    }
    container.innerHTML = entries.map(e => `
    <article class="entry">
    <header class="entry-header">
        <time datetime="${e.date}">${e.dateObj.toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' })}</time>
        <span class="location">${e.location}</span>
    </header>
    <div class="entry-content">
        <p>${e.description}</p>
        ${e.images && e.images.length
                ? `<div class="entry-images">
            ${e.images.slice(0, 3).map(img => `
                <figure>
                <img src="${img.src}" alt="${img.caption}">
                <figcaption>${img.caption || ''}</figcaption>
                </figure>
            `).join('')}
            </div>`
                : ''
            }
    </div>
    </article>
`).join('');
}

// 3) Filtrado
document.getElementById('applyFilters').addEventListener('click', () => {
    const from = document.getElementById('fromDate').valueAsDate;
    const to = document.getElementById('toDate').valueAsDate;
    const month = document.getElementById('monthFilter').value; // "2025-05"
    const place = document.getElementById('placeFilter').value.trim().toLowerCase();

    let filtered = allEntries;

    // mes > rango
    if (month) {
        const [y, m] = month.split('-').map(Number);
        filtered = filtered.filter(e =>
            e.dateObj.getFullYear() === y &&
            e.dateObj.getMonth() + 1 === m
        );
    } else if (from || to) {
        if (from) filtered = filtered.filter(e => e.dateObj >= from);
        if (to) filtered = filtered.filter(e => e.dateObj <= to);
    }

    if (place) {
        filtered = filtered.filter(e =>
            e.location.toLowerCase().includes(place)
        );
    }

    renderEntries(filtered);
});

// 4) Limpiar filtros
document.getElementById('clearFilters').addEventListener('click', () => {
    document.getElementById('fromDate').value = '';
    document.getElementById('toDate').value = '';
    document.getElementById('monthFilter').value = '';
    document.getElementById('placeFilter').value = '';
    renderEntries(allEntries);
});
