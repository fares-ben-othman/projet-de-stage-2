const { transfertSchema } = require('../validators/transfertValidator');
const transfertModel = require('../models/transfertModel');
const vehiculeModel = require('../models/vehiculeModel');

const getAllTransferts = async (req, res) => {
  try {
    const [rows] = await transfertModel.getAllTransferts();
    res.status(200).json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

const getTransfertById = async (req, res) => {
  try {
    const [rows] = await transfertModel.getTransfertById(req.params.id);
    if (rows.length === 0) return res.status(404).json({ error: 'Transfert introuvable' });
    res.status(200).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

const createTransfert = async (req, res) => {
  console.log('Requête reçue pour création transfert:', req.body);

  const { error, value } = transfertSchema.validate(req.body);
  if (error) {
    console.log('Erreur validation:', error.details[0].message);
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
  const { error, value } = transfertSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  try {
    const result = await transfertModel.updateTransfert(value, req.params.id);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Transfert introuvable ou déjà supprimé' });
    res.status(200).json({ message: 'Transfert mis à jour' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

const deleteTransfert = async (req, res) => {
  try {
    const result = await transfertModel.deleteTransfert(req.params.id);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Transfert introuvable ou déjà supprimé' });
    res.status(200).json({ message: 'Transfert supprimé' });
  } catch (err) {
    console.error(err);
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
