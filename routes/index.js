const express = require('express');
const bcrypt = require('bcrypt');
const { generateToken, verifyToken } = require('../middlewares/autentificacionMiddelware');
const { users } = require('../users/user');
const{getName}=require("../controles/character")

const router = express.Router();

router.get('/', (req, res) => {
  const loginForm = `
    <form action="/login" method="post">
      <label for="username">Usuario:</label>
      <input type="text" id="username" name="username" required><br>
      <label for="password">Contraseña:</label>
      <input type="password" id="password" name="password" required><br>
      <button type="submit">Iniciar sesión</button>
    </form>
    <a href="/dashboard">Dashboard</a>
  `;
  res.send(loginForm);
});

router.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(
    (u) => u.username === username && u.password === password
  );

  if (user) {
    const token = generateToken(user);
    req.session.token = token;
    res.redirect('/dashboard');
  } else {
    res.status(401).json({ message: 'Credenciales incorrectas' });
  }
});

router.get('/dashboard', verifyToken, (req, res) => {
  const userId = req.user;
  const user = users.find((u) => u.id === userId);

  if (user) {
    res.send(`
      <h1>Bienvenido, ${user.name}!</h1>
      <p>ID: ${user.id}</p> 
      <p>Usuario: ${user.username}</p> 
      <form action="/logout" method="post"> 
      <button type="submit">Cerrar sesión</button> 
      </form> <a href="/">Home</a> 
      <form action="/dashboard/search" method="get"> 
      <label for="characterName">Nombre del personaje:</label> 
      <input type="text" id="characterName" name="characterName" required> 
      <button type="submit">Buscar</button> 
      </form> <div id="characterInfo"></div>
    `);
  } else {
    res.status(401).json({ message: 'Usuario no encontrado' });
  }
});
router.get('/dashboard/search', verifyToken, async (req, res) => {
  const { characterName } = req.query;
  const response = await fetch(`https://rickandmortyapi.com/api/character/?name=${characterName}`);
  const data = await response.json();
  let characterHTML = '<p>No character found.</p>';

  if (data.results && data.results.length > 0) {
    const character = data.results[0];
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

router.post('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

module.exports = router;
