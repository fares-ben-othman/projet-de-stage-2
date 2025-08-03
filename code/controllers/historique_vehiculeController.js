const pool = require('../connection'); 
const historiqueVehiculeSchema = require('../validators/historique_vehiculeValidator');

const getAllHistorique = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM historique_vehicule');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur lors de la récupération des historiques.' });
  }
};

const getHistoriqueByVehiculeId = async (req, res) => {
  const vehiculeId = parseInt(req.params.vehiculeId, 10);
  if (isNaN(vehiculeId)) {
    return res.status(400).json({ message: 'vehiculeId invalide.' });
  }
  try {
    const [rows] = await pool.query('SELECT * FROM historique_vehicule WHERE vehicule_id = ?', [vehiculeId]);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur lors de la récupération de l\'historique.' });
  }
};

const createHistorique = async (req, res) => {
  
  const { error, value } = historiqueVehiculeSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  
  const { vehicule_id, date_action, type_action, description, utilisateur_id } = value;

  try {
    const [result] = await pool.query(
      `INSERT INTO historique_vehicule 
      (vehicule_id, date_action, type_action, description, utilisateur_id) 
      VALUES (?, ?, ?, ?, ?)`,
      [
        vehicule_id,
        date_action || new Date(), 
        type_action,
        description || null,
        utilisateur_id || null
      ]
    );
    res.status(201).json({ id: result.insertId, message: 'Historique ajouté avec succès.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur lors de l\'ajout de l\'historique.' });
  }
};

module.exports = {
  getAllHistorique,
  getHistoriqueByVehiculeId,
  createHistorique
};
