const fetch = require('node-fetch');

const getName = async (req, res) => {
  const { name } = req.params;
  const response = await fetch(`https://rickandmortyapi.com/api/character/?name=${name}`);
  const data = await response.json();
  if (data.results && data.results.length > 0) {
    const character = data.results;
    res.send(`
      <html>
        <body>
          <h1>${character.name}</h1>
          <p>Gender: ${character.gender}</p>
          <img src="${character.image}" alt="${character.name}">
        </body>
      </html>
    `);
  } else {
    res.status(404).send('Character not found');
  }
};

module.exports = { getName };
