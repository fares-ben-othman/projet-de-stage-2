const express = require('express'); // bech timporti el express 
const pool = require('./connection'); // bech tconnecti 3al database 
const cors = require('cors');
const swaggerUi = require('swagger-ui-express'); // bech nesta3mel el swagger lil test
const swaggerSpec = require('./docs/swagger'); 
require('dotenv').config();

const app = express();

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(cors());
app.use(express.json());

const agenceRoute = require('./routes/agenceRoutes');
const clientRoute = require('./routes/clientRoutes');
const contractRoute = require('./routes/contractRoutes');
const vehiculeRoutes = require('./routes/vehiculeRoutes');
const historique_vehiculeRoutes = require('./routes/historique_vehiculeRoutes');
const interventionRoutes = require('./routes/interventionRoutes');
const financeRoutes = require('./routes/financeRoutes');
const transfertRoutes = require('./routes/transfertRoutes');
app.use('/agences', agenceRoute);
app.use('/clients', clientRoute);
app.use('/contracts', contractRoute);
app.use('/vehicules', vehiculeRoutes);
app.use('/historique_vehicule',historique_vehiculeRoutes);
app.use('/interventions',interventionRoutes);
app.use('/finances',financeRoutes);
app.use('/transfert',transfertRoutes);
const PORT = process.env.PORT ;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
