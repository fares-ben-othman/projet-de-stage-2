const pool = require('../connection');

const HistoriqueVehicule = {
  
  getAll: () => {
    return pool.query('SELECT * FROM historique_vehicule ORDER BY date_action DESC');
  },

  
  getByVehiculeId: (vehiculeId) => {
    return pool.query(
      'SELECT * FROM historique_vehicule WHERE vehicule_id = ? ORDER BY date_action DESC',
      [vehiculeId]
    );
  },

  
  create: ({ vehicule_id, type_action, description, utilisateur_id }) => {
    return pool.query(
      `INSERT INTO historique_vehicule (vehicule_id, type_action, description, utilisateur_id) 
       VALUES (?, ?, ?, ?)`,
      [vehicule_id, type_action, description, utilisateur_id || null]
    );
  }
};

module.exports = HistoriqueVehicule;
