const express = require('express');
const cors = require('cors');
const axios = require('axios');
const cheerio = require('cheerio');
const puppeteer = require('puppeteer');
const path = require('path'); // Para lidar com caminhos de arquivo

const app = express();
const PORT = 3000;

app.use(cors());

// Servir arquivos estáticos da pasta "public" (onde seu HTML, CSS, etc. estará)
app.use(express.static(path.join(__dirname, 'public')));

// Função para fazer o scraping da página e capturar as informações
// const getHeroData = async (heroName) => {
//     try {
//         const url = `https://hellhades.com/dragonheir/heroes/${heroName}/`;
//         const { data } = await axios.get(url);
//         const $ = cheerio.load(data);

//         // Extraindo informações do HTML
//         const name = $('h1').text().trim(); // Captura o nome do herói

//         // Captura as estatísticas do herói
//         const health = $('#health-total').text().trim();
//         const defence = $('#defence-total').text().trim();
//         const attack = $('#attack-total').text().trim();
//         const enlightenment = $('#enlightenment-total').text().trim();
//         const critChance = $('#crit_chance-total').text().trim();
//         const critDamage = $('#crit_damage-total').text().trim();
//         const accuracy = $('#accuracy-total').text().trim();
//         const resistance = $('#resistance-total').text().trim();
//         const atkSpeed = $('#haste-total').text().trim(); // Se houver no HTML

//         // Você pode adicionar mais campos aqui se necessário, como `captain_slot` etc.

//         return {
//             base: {
//                 name,
//                 health: health || 'N/A',
//                 defence: defence || 'N/A',
//                 attack: attack || 'N/A',
//                 enlightenment: enlightenment || 'N/A',
//                 crit_chance: critChance || 'N/A',
//                 crit_damage: critDamage || 'N/A',
//                 accuracy: accuracy || 'N/A',
//                 resistance: resistance || 'N/A',
//                 atk_speed: atkSpeed || 'N/A',
//                 // Adicione outros campos conforme necessário
//             }
//         };
//     } catch (error) {
//         console.error('Erro ao buscar os dados do herói:', error);
//         return null;
//     }
// };
// const getHeroData = async (heroName) => {
//     const url = `https://hellhades.com/dragonheir/heroes/${heroName}/`;
//     const browser = await puppeteer.launch();
//     const page = await browser.newPage();
//     await page.goto(url, { waitUntil: 'networkidle2' }); // Aguarda até que a rede esteja inativa

//     const heroData = await page.evaluate(() => {
//         const getStat = (id) => document.querySelector(id)?.innerText || 'N/A';
        
//         return {
//             name: document.querySelector('h1').innerText.trim(),
//             health: getStat('#health-total'),
//             defence: getStat('#defence-total'),
//             attack: getStat('#attack-total'),
//             enlightenment: getStat('#enlightenment-total'),
//             crit_chance: getStat('#crit_chance-total'),
//             crit_damage: getStat('#crit_damage-total'),
//             accuracy: getStat('#accuracy-total'),
//             resistance: getStat('#resistance-total'),
//             atk_speed: getStat('#haste-total'),
//         };
//     });

//     await browser.close();
//     return { base: heroData };
// };

const heroCache = {};

const getHeroData = async (heroName) => {
    if (heroCache[heroName]) {
        return heroCache[heroName]; // Retorna dados do cache se existir
    }

    const url = `https://hellhades.com/dragonheir/heroes/${heroName}/`;
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2' });

    const heroData = await page.evaluate(() => {
        const getStat = (id) => document.querySelector(id)?.innerText || 'N/A';
        
        return {
            name: document.querySelector('h1').innerText.trim(),
            health: getStat('#health-total'),
            defence: getStat('#defence-total'),
            attack: getStat('#attack-total'),
            enlightenment: getStat('#enlightenment-total'),
            crit_chance: getStat('#crit_chance-total'),
            crit_damage: getStat('#crit_damage-total'),
            accuracy: getStat('#accuracy-total'),
            resistance: getStat('#resistance-total'),
            atk_speed: getStat('#haste-total'),
        };
    });

    await browser.close();
    
    // Armazena os dados no cache
    heroCache[heroName] = { base: heroData };
    
    return { base: heroData };
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
