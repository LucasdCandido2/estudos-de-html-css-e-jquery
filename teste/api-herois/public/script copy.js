// Função para buscar os dados do herói
async function fetchHero() {
    try {
        const response = await fetch('/api/hero');
        if (!response.ok) throw new Error("Erro ao buscar a lista de heróis.");
        const heroData = await response.json();

        
        populateHeroSelect(heroData);
    } catch (error) {
        console.error(error);
    }
}

//Função para preencher o select com os herois
function populateHeroSelect(heroData) {    
    const heroSelect = $('#hero-select');
    heroData.forEach(hero => {
        const option = $('<option></option>');
        option.val(hero.heroId);
        option.text(hero.heroname);
        heroSelect.append(option);
    });
}

//função para buscar e exibir os dados do heroi selecionado
async function fetchAndDisplayHero(heroId) {
    try {
        const heroIdNum = parseInt(heroId, 10);
        // console.log("Hero ID selecionado:", heroIdNum); // Verificar o ID selecionado
        const response = await fetch('/api/hero');
        if(!response.ok) throw new Error('Erro ao buscar os dados do herói.');
        const heroData = await response.json();

        // console.log('Dados dos heróis:', heroData); // Adicione este log

        //Filtra pelo heroi selecionado
        const selectedHero = heroData.find(hero => hero.heroId === heroIdNum);
        if (selectedHero) {
            displayHero(selectedHero);
            const level = parseInt($("#hero-level").val(), 10);
            displayCalculatedAttributes(selectedHero, level); // Exemplo de nível fixo
        } else {
            console.log("Herói não encontrado:", heroIdNum);
        }
    }catch(error){
        console.error(error);
    }
}

//Função para exibir os dados do heroi
function displayHero(hero) {
    // console.log(hero);
    
    const heroContainer = $('#hero-container');
    // Extraindo os dados necessários do objeto hero
    
    const { heroname, ability_replace, accuracy_base, atk_speed_bpct, atk_type, attack_frequency, 
        captain_enable_combat_types, captain_slot, crit_bonus_bpct, crit_chance_bpct, 
        defense_base, max_health_base, phy_dmg_base, resistance_base, show_title, rarity, 
        element, orientation, skill } = hero;

    const accuracy = hero['accuracy*base'];
    const atk_speed = hero['atk_speed*bpct'];
    const crit_bonus = hero['crit_bonus*bpct'];
    const crit_chance = hero['crit_chance*bpct'];
    const defense = hero['defense*base'];
    const max_health = hero['max_health*base'];
    const phy_dmg = hero['phy_dmg*base'];
    const resistance = hero['resistance*base'];
        
    const heroImagePath = `${hero.heroIdPath.split('/').pop()}`; // Ajuste conforme o caminho real da imagem
    heroContainer.html(`
                    <div class="card mb-4">
                <img src="${heroImagePath}" id="img-head" class="card-img-top" alt="${heroname}">
                <div class="card-body">
                    <h5 class="card-title">${heroname || 'Hero'}</h5>
                    <p><strong>Título:</strong> ${show_title}</p>
                    <p><strong>Raridade:</strong> ${rarity}</p>
                    <p><strong>Elemento:</strong> ${element}</p>
                    <p><strong>Orientação:</strong> ${orientation}</p>
                    <p><strong>Habilidade Substituta:</strong> ${ability_replace}</p>
                    <p><strong>Precisão Base:</strong> ${accuracy}</p>
                    <p><strong>Velocidade de Ataque BPCT:</strong> ${atk_speed}</p>
                    <p><strong>Tipo de Ataque:</strong> ${atk_type}</p>
                    <p><strong>Frequência de Ataque:</strong> ${attack_frequency}</p>
                    <p><strong>Habilidade do Capitão:</strong> ${captain_slot}</p>
                    <p><strong>Defesa Base:</strong> ${defense}</p>
                    <p><strong>Saúde Máxima Base:</strong> ${max_health}</p>
                    <p><strong>Dano Físico Base:</strong> ${phy_dmg}</p>
                    <p><strong>Resistência Base:</strong> ${resistance}</p>
                    <p><strong>Bônus Crítico BPCT:</strong> ${crit_bonus}</p>
                    <p><strong>Chance Crítica BPCT:</strong> ${crit_chance}</p>
                    <p><strong>Capacidade de Combate do Capitão:</strong> ${captain_enable_combat_types}</p>
                    <h6>Habilidades:</h6>
                    <ul>
                    ${Object.values(skill).map(s => {
                        return `
                            <li>
                                <strong>${s.skillname}</strong>: ${s.skilldesc}
                                ${[1, 2, 3].map(i => `
                                    <img src="icon_skill_${hero.heroId}_${i}.png" alt="${s.skillname} - nível ${i}" class="skill-icon" />
                                `).join('')}
                            </li>
                        `;
                    }).join('')}
                    </ul>
                </div>
            </div>
    `);
}

//Função para calcular os atributos do heroi com base no nivel
function calculateHeroAttributes(hero, level) {
    const baseAttributes = {
        accuracy: hero['accuracy*base'] || 0,
        atk_speed: hero['atk_speed*bpct'] || 0,
        crit_bonus: hero['crit_bonus*bpct'] || 0,
        crit_chance: hero['crit_chance*bpct'] || 0,
        defense: hero['defense*base'] || 0,
        max_health: hero['max_health*base'] || 0,
        phy_dmg: hero['phy_dmg*base'] || 0,
        resistance: hero['resistance*base'] || 0
    };

    console.log('Atributos base:', baseAttributes);

    const levelUpData = {
        30: { defense: 8.51, max_health: 8.51, phy_dmg: 8.51 },
        50: { defense: 12.97, max_health: 12.97, phy_dmg: 12.97 },
        70: { defense: 19.74, max_health: 19.74, phy_dmg: 19.74 },
        90: { defense: 28.45, max_health: 28.45, phy_dmg: 28.45 },
        100: { defense: 0.0, max_health: 0.0, phy_dmg: 0.0 }
    };

    //Aplicar aumento de atributos conforme o nivel
    Object.keys(levelUpData).forEach(levelThreshold => {
        if(level >= levelThreshold) {
            baseAttributes.defense += levelUpData[levelThreshold].defense;
            baseAttributes.max_health += levelUpData[levelThreshold].max_health;
            baseAttributes.phy_dmg += levelUpData[levelThreshold].phy_dmg;
        }
    })
    return baseAttributes;

}

//Exibir atributos calculados
function displayCalculatedAttributes(hero, level) {
    const attributes = calculateHeroAttributes(hero, level);

    const attributesContainer = $('#attributes-container');
    attributesContainer.html(`
        <h6>Atributos Calculados (Nível ${level}):</h6>
        <p><strong>Precisão:</strong> ${attributes.accuracy}</p>
        <p><strong>Velocidade de Ataque:</strong> ${attributes.atk_speed}</p>
        <p><strong>Bônus Crítico:</strong> ${attributes.crit_bonus}</p>
        <p><strong>Chance Crítica:</strong> ${attributes.crit_chance}</p>
        <p><strong>Defesa:</strong> ${attributes.defense}</p>
        <p><strong>Saúde Máxima:</strong> ${attributes.max_health}</p>
        <p><strong>Dano Físico:</strong> ${attributes.phy_dmg}</p>
        <p><strong>Resistência:</strong> ${attributes.resistance}</p>
    `);
}

//função para buscar e exibir dados do nivel
// async function fetchLevelData(level) {
//     try{
//         const response = await fetch('/api/heroLevelBase');
//         if(!response.ok)throw new Error('Erro ao buscar dados de nível.');
//         const levelData = await response.json();

//         //Filtra os dados do nivel selecionado
//         const levelStats = levelData.find(stat => stat.level === parseInt(level));
//         return levelStats;
//     }catch(error) {
//         console.error(error);
//     }
// }

//Função para atualizar atributos ao mudar o nivel
$('#hero-level').on('input', function(){
    const heroId = $('#hero-select').val();
    const level = parseInt($(this).val(), 10);
    $('#level-display').text(`Nivel: ${level}`);
    if(heroId) {
        fetchAndDisplayHero(heroId);
    }
});


$('#hero-select').on('change', (e) => {
    const heroId = e.target.value;
    if (heroId) {
        fetchAndDisplayHero(heroId);
    } else {
        $('#hero-container').empty(); // Limpa o conteúdo do container
        $('#attributes-container').empty(); // Limpa atributos
    }
});


// Chama a função para buscar os dados ao carregar a página
fetchHero();
