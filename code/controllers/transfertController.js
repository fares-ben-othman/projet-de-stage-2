const { transfertSchema } = require('../validators/transfertValidator');
const transfertModel = require('../models/transfertModel');
const vehiculeModel = require('../models/vehiculeModel');

const getAllTransferts = async (req, res) => {
  console.log("Action: Récupération de tous les transferts");
  try {
    const [rows] = await transfertModel.getAllTransferts();
    console.log(`Transferts récupérés: ${rows.length}`);
    res.status(200).json(rows);
  } catch (err) {
    console.error("Erreur lors de la récupération des transferts:", err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

const getTransfertById = async (req, res) => {
  const id = req.params.id;
  console.log(`Action: Récupération du transfert avec ID ${id}`);
  try {
    const [rows] = await transfertModel.getTransfertById(id);
    if (rows.length === 0) {
      console.log(`Transfert avec ID ${id} introuvable`);
      return res.status(404).json({ error: 'Transfert introuvable' });
    }
    console.log("Transfert récupéré:", rows[0]);
    res.status(200).json(rows[0]);
  } catch (err) {
    console.error(`Erreur lors de la récupération du transfert avec ID ${id}:`, err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

const createTransfert = async (req, res) => {
  console.log('Action: Création d\'un transfert, requête reçue:', req.body);

  const { error, value } = transfertSchema.validate(req.body);
  if (error) {
    console.log('Erreur de validation:', error.details[0].message);
    return res.status(400).json({ error: error.details[0].message });
  }
  console.log('Validation réussie, données validées:', value);

  try {
    const { vehicule_id, source_agence_id } = value;

    console.log(`Vérification véhicule avec ID ${vehicule_id}`);
    const [vehiculeRows] = await vehiculeModel.getVehiculeById(vehicule_id);
    console.log('Résultat requête véhicule:', vehiculeRows);

    if (!vehiculeRows || vehiculeRows.length === 0) {
      console.log("Véhicule introuvable");
      return res.status(404).json({ message: "Véhicule introuvable" });
    }
    const vehicule = vehiculeRows[0];
    console.log('Véhicule trouvé:', vehicule);

    if (vehicule.statut !== 'disponible') {
      console.log("Le véhicule n'est pas disponible pour un transfert:", vehicule.statut);
      return res.status(400).json({ message: "Le véhicule n'est pas disponible pour un transfert" });
    }

    if (vehicule.agence_id !== source_agence_id) {
      console.log(`L'agence source (${source_agence_id}) ne correspond pas à l'agence du véhicule (${vehicule.agence_id})`);
      return res.status(400).json({ message: "L'agence source ne correspond pas à l'agence du véhicule" });
    }

    const result = await transfertModel.createTransfert(value);
    console.log("Transfert créé avec succès, ID:", result.insertId);

    const updatedVehicule = {
      immatriculation: vehicule.immatriculation,
      marque: vehicule.marque,
      modele: vehicule.modele,
      annee: vehicule.annee,
      kilometrage: vehicule.kilometrage,
      statut: 'transfert',
      date_assurance: vehicule.date_assurance,
      agence_id: vehicule.agence_id
    };

    console.log(`Mise à jour du statut du véhicule ID ${vehicule_id} à 'transfert'`);
    const updateResult = await vehiculeModel.updateVehicule(updatedVehicule, vehicule_id);
    console.log('Résultat mise à jour véhicule:', updateResult);

    res.status(201).json({ message: "Transfert créé avec succès", id: result.insertId });

  } catch (error) {
    console.error("Erreur lors de la création du transfert:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

const updateTransfert = async (req, res) => {
  const id = req.params.id;
  console.log(`Action: Mise à jour du transfert avec ID ${id}, données:`, req.body);

  const { error, value } = transfertSchema.validate(req.body);
  if (error) {
    console.log('Erreur de validation:', error.details[0].message);
    return res.status(400).json({ error: error.details[0].message });
  }

  try {
    const result = await transfertModel.updateTransfert(value, id);
    if (result.affectedRows === 0) {
      console.log(`Transfert avec ID ${id} introuvable ou déjà supprimé`);
      return res.status(404).json({ error: 'Transfert introuvable ou déjà supprimé' });
    }
    console.log(`Transfert avec ID ${id} mis à jour avec succès`);
    res.status(200).json({ message: 'Transfert mis à jour' });
  } catch (err) {
    console.error(`Erreur lors de la mise à jour du transfert avec ID ${id}:`, err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

const deleteTransfert = async (req, res) => {
  const id = req.params.id;
  console.log(`Action: Suppression du transfert avec ID ${id}`);
  try {
    const result = await transfertModel.deleteTransfert(id);
    if (result.affectedRows === 0) {
      console.log(`Transfert avec ID ${id} introuvable ou déjà supprimé`);
      return res.status(404).json({ error: 'Transfert introuvable ou déjà supprimé' });
    }
    console.log(`Transfert avec ID ${id} supprimé avec succès`);
    res.status(200).json({ message: 'Transfert supprimé' });
  } catch (err) {
    console.error(`Erreur lors de la suppression du transfert avec ID ${id}:`, err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

module.exports = {
  createTransfert,
  getAllTransferts,
  getTransfertById,
  updateTransfert,
  deleteTransfert,
};
