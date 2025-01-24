const express = require('express');
const { getName } = require('../controles/character');
const router = express.Router();
const { verifyToken } = require('../middlewares/autentificacionMiddelware');

router.get('/character/:name', verifyToken, async (req, res) => {
    const { characterName } = req.query;
    const response = await fetch(`https://rickandmortyapi.com/api/character/?name=${characterName}`);
    const data = await response.json();
    let characterHTML = '<p>No character found.</p>';
  
    if (data.results && data.results.length > 0) {
      const character = data.results;
      characterHTML = `
        <h2>${character.name}</h2>
        <img src="${character.image}" alt="${character.name}">
        <p>Gender: ${character.gender}</p>
        <p>Especie: ${character.species}</p>
        <p>Estado: ${character.status}</p>
        <p>Origen: ${character.origin.name}</p>
      `;
    }
  
    res.send(`
      <h1>Búsqueda de personaje de Rick and Morty</h1>
      ${characterHTML}
      <a href="/dashboard">Volver al dashboard</a>
    `);
  });

module.exports = router;
