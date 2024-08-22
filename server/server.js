const express = require('express');
const path = require('path');
const app = express();
const PORT = 4000;

// Servir les fichiers statiques du répertoire 'public'
app.use(express.static(path.join(__dirname, '../client/public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', '../client/index.html'));
});

app.listen(PORT, () => {
    console.log(`Serveur lancé sur http://localhost:${PORT}`);
});
