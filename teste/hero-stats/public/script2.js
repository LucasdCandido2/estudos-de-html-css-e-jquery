document.getElementById('hero-form').addEventListener('submit', async function (e) {
    e.preventDefault();

    const heroName = document.getElementById('hero-name').value.toLowerCase();
    const heroStatsDiv = document.getElementById('hero-stats');
    
    // Iniciar carregamento
    showLoading(heroStatsDiv);

    try {
        const heroData = await fetchHeroData(heroName);
        displayHeroStats(heroData);
    } catch (error) {
        displayError(heroStatsDiv, error.message);
    }
});

/**
 * Função para exibir o indicador de carregamento.
 * @param {HTMLElement} container - O elemento onde o carregamento será mostrado.
 */
function showLoading(container) {
    container.innerHTML = 'Loading...';
}

/**
 * Função para buscar dados do herói a partir da API.
 * @param {string} heroName - Nome do herói a ser buscado.
 * @returns {Promise<object>} - Dados do herói.
 * @throws Will throw an error if the hero is not found.
 */
async function fetchHeroData(heroName) {
    const response = await fetch(`http://localhost:3000/api/hero/${heroName}`);
    if (!response.ok) throw new Error('Hero not found');
    
    return await response.json();
}

/**
 * Função para exibir os dados do herói na interface.
 * @param {object} heroData - Dados do herói a serem exibidos.
 */
function displayHeroStats(heroData) {
    const heroStatsDiv = document.getElementById('hero-stats');
    console.log(heroData);

    heroStatsDiv.innerHTML = `
        <img src="${heroData.imageUrl !== 'N/A' ? heroData.imageUrl : 'default-image.png'}" alt="${heroData.name}" />
        <div><strong>Name:</strong> ${heroData.base.name}</div>
        <div><strong>Rarity:</strong> ${heroData.base.rarity}</div>
        <div><strong>Element:</strong> ${heroData.base.element}</div>
        <div><strong>Title:</strong> ${heroData.base.title}</div>
        <div><strong>Health:</strong> ${heroData.base.health}</div>
        <div><strong>Defence:</strong> ${heroData.base.defence}</div>
        <div><strong>Attack:</strong> ${heroData.base.attack}</div>
        <div><strong>Enlightenment:</strong> ${heroData.base.enlightenment}</div>
        <div><strong>Crit Chance:</strong> ${heroData.base.crit_chance}</div>
        <div><strong>Crit Damage:</strong> ${heroData.base.crit_damage}</div>
        <div><strong>Accuracy:</strong> ${heroData.base.accuracy}</div>
        <div><strong>Resistance:</strong> ${heroData.base.resistance}</div>
        <div><strong>Attack Speed:</strong> ${heroData.base.atk_speed}</div>
    `;
}

/**
 * Função para exibir mensagens de erro na interface.
 * @param {HTMLElement} container - O elemento onde a mensagem de erro será exibida.
 * @param {string} message - Mensagem de erro a ser exibida.
 */
function displayError(container, message) {
    container.innerHTML = `<p style="color:red">${message}</p>`;
}
