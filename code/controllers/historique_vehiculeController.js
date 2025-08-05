const HistoriqueVehicule = require('../models/historique_vehiculeModel');
const { historiqueVehiculeSchema } = require('../validators/historique_vehiculeValidator');



const getAllHistoriques = async (req, res) => {
  try {
    const [rows] = await HistoriqueVehicule.getAll();
    res.status(200).json(rows);
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'historique :', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};


const getHistoriqueByVehiculeId = async (req, res) => {
  const vehiculeId = req.params.id;
  try {
    const [rows] = await HistoriqueVehicule.getByVehiculeId(vehiculeId);
    res.status(200).json(rows);
  } catch (error) {
    console.error(`Erreur lors de la récupération de l'historique pour le véhicule ${vehiculeId} :`, error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};


const createHistorique = async (req, res) => {
  const {error} = historiqueVehiculeSchema.validate(req.body);
  if (error){
    return res.status(400).json({ error: error.details[0].message});
  }
  const { vehicule_id, type_action, description, utilisateur_id } = req.body;
  try {
    await HistoriqueVehicule.create({ vehicule_id, type_action, description, utilisateur_id });
    res.status(201).json({ message: 'Historique ajouté avec succès' });
  } catch (error) {
    console.error('Erreur lors de la création de l\'historique :', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

module.exports = {
  getAllHistoriques,
  getHistoriqueByVehiculeId,
  createHistorique
};

