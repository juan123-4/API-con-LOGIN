const express = require("express");
const app = express();
const port = 3000;
const bodyParser = require("body-parser");
const cors = require("cors");
const { verifyToken, setupApp } = require('./middlewares/autentificacionMiddelware');
const indexRouter = require('./routes/index'); 


app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

app.use(cors());

setupApp(app);

app.use('/', indexRouter); 
app.use('/character', verifyToken, indexRouter); 
app.use('/character/:name', verifyToken, indexRouter);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
