const express = require('express');
const bcrypt = require('bcrypt');
const { generateToken, verifyToken } = require('../middlewares/autentificacionMiddelware');
const { users } = require('../users/user');
const axios=require("axios")


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
    // return res.json({ mensaje:"hola estas logado",token}) esto es para ver el token
    res.redirect('/search');
  } else {
    res.status(401).json({ mensaje: 'Credenciales incorrectas' });
  }
});

router.get('/search', verifyToken, (req, res) => {
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
      <form action="/character/:name" method="get"> 
      <label for="characterName">Nombre del personaje:</label> 
      <input type="text" id="characterName" name="characterName" required> 
      <button type="submit">Buscar</button> 
      </form> <div id="characterInfo"></div>
    `);
  } else {
    res.status(401).json({ message: 'Usuario no encontrado' });
  }
});
router.get('/character', verifyToken, async (req, res) => {
  const url = 'https://rickandmortyapi.com/api/character';

  try {
    const response = await axios.get(url);
    const characters = response.data.results;
    const characterInfo = characters.map(character => {
      const { name, image, gender, species, status, origin } = character;
      return { name, image, gender, species, status, origin: origin.name };
    });
    res.json(characterInfo);
  } catch (error) {
    res.status(404).json({ error: "Personajes no encontrados" });
  }
});

module.exports = router;
// router.get('/character', verifyToken, async (req, res) => {
//     console.log("estoy dentro del caracter")
//     const { characterName } = req.query;
//     console.log(characterName)
//     const response = await fetch(`https://rickandmortyapi.com/api/character}`);
//     const data = await response.json();
  
//     if (data.results && data.results.length > 0) {
//       const character = data.results;
//         res.json(character)
       
//     }
//     else{res.send("<p>usuario no encontrado solo</p>")}
  
   
//   });
  router.get("/character/:name",verifyToken,async(req,res)=>{
    const Name= req.params.name
    
    const url=`https://rickandmortyapi.com/api/character/?name=${Name}
    `

    try {
        const response= await axios.get(url)
        const character = response.data.results[0];
        const {name, image,gender,species,status,origin}=character;
        res.json({name,image,gender,species,status,origin})
    } 
    catch (error) {
        res.status(404).json({error:"Personaje no encontrado"})
        
    }

})

  // router.get('/character/:name', verifyToken, async (req, res) => {
  //     console.log("estoy dentro del caracter:name")
  //     const { characterName } = req.params.name
  //     console.log(characterName)
  //     const response = await fetch(`https://rickandmortyapi.com/api/character/?name=${characterName}`);
  //     const data = await response.json();
    
  //     if (data.results && data.results.length > 0) {
  //       const character = data.results;
  //         res.json(character)
         
  //     }
  //     else{res.send("<p>usuario no encontrado :name</p>")}
    
     
  //   });
    
router.post('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

module.exports = router;
