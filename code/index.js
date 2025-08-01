const express = require('express'); // bech timporti el express 
const pool = require('./connection'); // bech tconnecti 3al database 
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

//mezlou el importation des routes lehna mba3d 

const PORT = process.env.PORT ;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
