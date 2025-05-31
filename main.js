const axios = require("axios");
const fs = require("fs");
const path = require("path");

const pseudos = JSON.parse(fs.readFileSync("pseudos.json", "utf-8"));

const headsDir = path.join(__dirname, "heads");
if (!fs.existsSync(headsDir)) {
    fs.mkdirSync(headsDir);
}

async function fetchUUID(pseudo) {
    try {
        const res = await axios.get(`https://api.minecraftservices.com/minecraft/profile/lookup/name/${pseudo}`);
        return res.data.id;
    } catch (err) {
        console.error(`❌| Erreur lors de la récupération de l'UUID pour ${pseudo}:`, err.response?.data || err.message);
        return null;
    }
}

async function fetchAndSaveHead(uuid, pseudo) {
    try {
        const url = `https://crafatar.com/avatars/${uuid}`;
        const res = await axios.get(url, { responseType: "arraybuffer" });
        const filePath = path.join(headsDir, `${pseudo}.png`);
        fs.writeFileSync(filePath, res.data);
        console.log(`✅| Tête sauvegardée pour ${pseudo}`);
    } catch (err) {
        console.error(`❌| Erreur lors de la récupération de la tête pour ${pseudo}:`, err.response?.data || err.message);
    }
}

async function main() {
    for (const pseudo of pseudos) {
        const uuid = await fetchUUID(pseudo);
        if (uuid) {
            await fetchAndSaveHead(uuid, pseudo);
        }
    }
}

main();