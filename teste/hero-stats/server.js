const express = require('express');
const cors = require('cors');
const puppeteer = require('puppeteer');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

// Cache para armazenar dados de heróis
const heroCache = {};

/**
 * Função para fazer scraping de dados do herói
 * @param {string} heroName - Nome do herói para buscar
 * @returns {object} - Dados do herói
 */
const getHeroData = async (heroName) => {
    if (heroCache[heroName]) {
        return heroCache[heroName]; // Retorna dados do cache se existir
    }

    const url = `https://hellhades.com/dragonheir/heroes/${heroName}/`;
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2' });

    try {
        // Espera o seletor da imagem ser carregado
        await page.waitForSelector('.fusion-image-element img');

        const heroData = await page.evaluate(() => {
            const getStat = (id) => document.querySelector(id)?.innerText.trim() || 'N/A';
            
            return {
                id: document.querySelector('h1')?.innerText.trim(),
                name: getStat('.dh-label'), // Nome do herói
                rarity: [...document.querySelectorAll('.dh-label')].find(label => 
                    label.innerText.includes('Legendary') || 
                    label.innerText.includes('Epic') || 
                    label.innerText.includes('Rare') || 
                    label.innerText.includes('Common'))?.innerText.trim() || 'N/A',
                element: getStat('.dh-label:nth-child(3)'), // Elemento (a terceira div)
                title: getStat('.dh-label:nth-child(1)'), // Título (a primeira div)
                captain_stat: getStat('.captain-stat'), // Captura estatísticas do capitão, se existirem
                captain_slot: getStat('.captain-slot'), // Captura slot do capitão, se existirem
                role: getStat('.role'), // Captura o papel do herói, se existirem
                health: getStat('#health-total'),
                defence: getStat('#defence-total'),
                attack: getStat('#attack-total'),
                enlightenment: getStat('#enlightenment-total'),
                crit_chance: getStat('#crit_chance-total'),
                crit_damage: getStat('#crit_damage-total'),
                accuracy: getStat('#accuracy-total'),
                resistance: getStat('#resistance-total'),
                atk_speed: getStat('#haste-total'),
                atk_frequency: getStat('.atk-frequency'), // Nova informação
                atk_type: getStat('.atk-type'), // Nova informação
            };
        });

        // Verifica e loga a URL da imagem para depuração
        console.log(`Image URL: ${heroData.imageUrl}`);

        // Armazena os dados no cache
        heroCache[heroName] = { base: heroData };
        return { base: heroData };
    } catch (error) {
        console.error(`Error fetching data for hero ${heroName}: ${error.message}`);
        return null; // Retorna nulo em caso de erro
    } finally {
        await browser.close(); // Sempre fecha o navegador
    }
};

// Rota para buscar heróis por nome
app.get('/api/hero/:name', async (req, res) => {
    const heroName = req.params.name.toLowerCase();
    const heroData = await getHeroData(heroName);

    if (heroData) {
        res.json(heroData);
    } else {
        res.status(404).json({ error: 'Herói não encontrado ou erro ao buscar dados' });
    }
});

// Servir o arquivo index.html para a rota principal "/"
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Inicia o servidor
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
