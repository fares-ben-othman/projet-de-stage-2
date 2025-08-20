
const HistoriqueVehicule = require('../models/historique_vehiculeModel');
const Vehicule = require('../models/vehiculeModel');
const Utilisateur = require('../models/userModel');
const Agence = require('../models/agenceModel'); 
const { historiqueVehiculeSchema } = require('../validators/historique_vehiculeValidator');

const getAllHistoriques = async (req, res) => {
  console.log("Action: Récupération de tout l'historique des véhicules");
  try {
    const [rows] = await HistoriqueVehicule.getAll();
    console.log(`Historiques récupérés: ${rows.length}`);
    res.status(200).json(rows);
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'historique :', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

const getHistoriqueByVehiculeId = async (req, res) => {
  const vehiculeId = req.params.vehiculeId;
  console.log(`Action: Récupération de l'historique pour le véhicule avec ID ${vehiculeId}`);
  try {
    const [rows] = await HistoriqueVehicule.getByVehiculeId(vehiculeId);
    console.log(`Historique récupéré avec succès pour le véhicule ${vehiculeId}`);
    res.status(200).json(rows);
  } catch (error) {
    console.error(`Erreur lors de la récupération de l'historique pour le véhicule ${vehiculeId} :`, error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

const createHistorique = async (req, res) => {
  console.log("Action: Création d'un nouvel historique de véhicule");

  const { error } = historiqueVehiculeSchema.validate(req.body);
  if (error) {
    console.log("Erreur de validation:", error.details[0].message);
    return res.status(400).json({ error: error.details[0].message });
  }

  const { vehicule_id, type_action, description, utilisateur_id, agence_id } = req.body;

  try {
    
    const vehiculeResult = await Vehicule.getVehiculeById(vehicule_id);
    const vehicule = vehiculeResult[0];
    if (!vehicule || vehicule.length === 0) {
      return res.status(400).json({ message: `Le véhicule avec id ${vehicule_id} n'existe pas.` });
    }

    
    const utilisateurResult = await Utilisateur.getUserById(utilisateur_id);
    const utilisateur = utilisateurResult[0];
    if (!utilisateur || utilisateur.length === 0) {
      return res.status(400).json({ message: `L'utilisateur avec id ${utilisateur_id} n'existe pas.` });
    }

    
    if (agence_id) {
      const agenceResult = await Agence.getAgenceById(agence_id);
      const agence = agenceResult[0];
      if (!agence || agence.length === 0) {
        return res.status(400).json({ message: `L'agence avec id ${agence_id} n'existe pas.` });
      }
    }

    console.log("Insertion de l'historique dans la base de données...");
    const result = await HistoriqueVehicule.create({ vehicule_id, type_action, description, utilisateur_id, agence_id });

    console.log("Historique ajouté avec succès");
    res.status(201).json({ 
      message: 'Historique ajouté avec succès', 
      historique: {
        id: result[0].insertId,
        vehicule_id,
        type_action,
        description,
        utilisateur_id,
        agence_id
      }
    });

  } catch (error) {
    console.error('Erreur lors de la création de l\'historique :', error);

    if (error.code === 'ER_NO_REFERENCED_ROW_2') {
      return res.status(400).json({ message: 'Impossible d’ajouter l’historique : vérifiez les identifiants du véhicule, de l’utilisateur ou de l’agence.' });
    }

    res.status(500).json({ message: 'Erreur serveur' });
  }
};

module.exports = {
  getAllHistoriques,
  getHistoriqueByVehiculeId,
  createHistorique
};
