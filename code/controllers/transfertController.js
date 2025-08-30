const { transfertSchema } = require('../validators/transfertValidator');
const transfertModel = require('../models/transfertModel');
const vehiculeModel = require('../models/vehiculeModel');
const agenceModel = require('../models/agenceModel');
const { logAction } = require('../utils/journal');

const getAllTransferts = async (req, res) => {
  const currentUser = req.user;
  console.log("Action: Récupération de tous les transferts");
  try {
    const [rows] = await transfertModel.getAllTransferts();
    console.log(`Transferts récupérés: ${rows.length}`);

    await logAction(
      currentUser,
      "LECTURE",
      "transferts",
      null,
      `Récupération de tous les transferts (${rows.length})`,
      "SUCCES"
    );

    res.status(200).json(rows);
  } catch (err) {
    console.error("Erreur lors de la récupération des transferts:", err);

    await logAction(
      currentUser,
      "LECTURE",
      "transferts",
      null,
      `Erreur récupération transferts: ${err.message}`,
      "ECHEC"
    );

    res.status(500).json({ message: 'Erreur serveur' });
  }
};

const getTransfertById = async (req, res) => {
  const id = req.params.id;
  const currentUser = req.user;
  console.log(`Action: Récupération du transfert avec ID ${id}`);
  try {
    const [rows] = await transfertModel.getTransfertById(id);
    if (rows.length === 0) {
      console.log(`Transfert avec ID ${id} introuvable`);

      await logAction(
        currentUser,
        "LECTURE",
        "transferts",
        id,
        `Transfert ID ${id} introuvable`,
        "ECHEC"
      );

      return res.status(404).json({ error: 'Transfert introuvable' });
    }
    console.log("Transfert récupéré:", rows[0]);

    await logAction(
      currentUser,
      "LECTURE",
      "transferts",
      id,
      `Transfert ID ${id} récupéré`,
      "SUCCES"
    );

    res.status(200).json(rows[0]);
  } catch (err) {
    console.error(`Erreur lors de la récupération du transfert avec ID ${id}:`, err);

    await logAction(
      currentUser,
      "LECTURE",
      "transferts",
      id,
      `Erreur récupération transfert ID ${id}: ${err.message}`,
      "ECHEC"
    );

    res.status(500).json({ error: 'Erreur serveur' });
  }
};

const createTransfert = async (req, res) => {
  const currentUser = req.user;
  console.log("Action: Création d'un transfert, requête reçue:", req.body);

  const { error, value } = transfertSchema.validate(req.body);
  if (error) {
    console.log("Erreur de validation:", error.details[0].message);

    await logAction(
      currentUser,
      "CREATION",
      "transferts",
      null,
      `Erreur validation: ${error.details[0].message}`,
      "ECHEC"
    );

    return res.status(400).json({ error: error.details[0].message });
  }
  console.log("Validation réussie, données validées:", value);

  try {
    const { vehicule_id, source_agence_id, destination_agence_id } = value;

    
    console.log(`Vérification véhicule avec ID ${vehicule_id}`);
    const [vehiculeRows] = await vehiculeModel.getVehiculeById(vehicule_id);
    if (!vehiculeRows || vehiculeRows.length === 0) {
      console.log("Véhicule introuvable");

      await logAction(
        currentUser,
        "CREATION",
        "transferts",
        null,
        `Véhicule ID ${vehicule_id} introuvable`,
        "ECHEC"
      );

      return res.status(404).json({ message: "Véhicule introuvable" });
    }
    const vehicule = vehiculeRows[0];
    console.log("Véhicule trouvé:", vehicule);

    if (vehicule.statut !== "disponible") {
      console.log("Le véhicule n'est pas disponible pour un transfert:", vehicule.statut);

      await logAction(
        currentUser,
        "CREATION",
        "transferts",
        null,
        `Véhicule ID ${vehicule_id} non disponible (statut=${vehicule.statut})`,
        "ECHEC"
      );

      return res.status(400).json({ message: "Le véhicule n'est pas disponible pour un transfert" });
    }

    if (vehicule.agence_id !== source_agence_id) {
      console.log(
        `L'agence source (${source_agence_id}) ne correspond pas à l'agence du véhicule (${vehicule.agence_id})`
      );

      await logAction(
        currentUser,
        "CREATION",
        "transferts",
        null,
        `Agence source ne correspond pas (véhicule.agence=${vehicule.agence_id}, input=${source_agence_id})`,
        "ECHEC"
      );

      return res.status(400).json({ message: "L'agence source ne correspond pas à l'agence du véhicule" });
    }

    
    const [agenceDest] = await agenceModel.getAgenceById(destination_agence_id);
    if (!agenceDest || agenceDest.length === 0) {
      console.log("Agence destination introuvable");

      await logAction(
        currentUser,
        "CREATION",
        "transferts",
        null,
        `Agence destination ID ${destination_agence_id} introuvable`,
        "ECHEC"
      );

      return res.status(404).json({ message: "Agence destination introuvable" });
    }

    
    const result = await transfertModel.createTransfert(value);
    console.log("Transfert créé avec succès, ID:", result.insertId);

    
    const updatedVehicule = {
      immatriculation: vehicule.immatriculation,
      marque: vehicule.marque,
      modele: vehicule.modele,
      annee: vehicule.annee,
      kilometrage: vehicule.kilometrage,
      statut: "transfert",
      date_assurance: vehicule.date_assurance,
      agence_id: vehicule.agence_id,
    };

    console.log(`Mise à jour du statut du véhicule ID ${vehicule_id} à 'transfert'`);
    await vehiculeModel.updateVehicule(updatedVehicule, vehicule_id);

    await logAction(
      currentUser,
      "CREATION",
      "transferts",
      result.insertId,
      `Transfert créé (vehicule=${vehicule_id}, source=${source_agence_id}, dest=${destination_agence_id})`,
      "SUCCES"
    );

    res.status(201).json({ message: "Transfert créé avec succès", id: result.insertId });
  } catch (err) {
    console.error("Erreur lors de la création du transfert:", err);

    await logAction(
      currentUser,
      "CREATION",
      "transferts",
      null,
      `Erreur création transfert: ${err.message}`,
      "ECHEC"
    );

    res.status(500).json({ message: "Erreur serveur" });
  }
};

const updateTransfert = async (req, res) => {
  const id = req.params.id;
  const currentUser = req.user;
  console.log(`Action: Mise à jour du transfert avec ID ${id}, données:`, req.body);

  const { error, value } = transfertSchema.validate(req.body);
  if (error) {
    console.log("Erreur de validation:", error.details[0].message);

    await logAction(
      currentUser,
      "MISE_A_JOUR",
      "transferts",
      id,
      `Erreur validation: ${error.details[0].message}`,
      "ECHEC"
    );

    return res.status(400).json({ error: error.details[0].message });
  }

  try {
    const result = await transfertModel.updateTransfert(value, id);
    if (result.affectedRows === 0) {
      console.log(`Transfert avec ID ${id} introuvable ou déjà supprimé`);

      await logAction(
        currentUser,
        "MISE_A_JOUR",
        "transferts",
        id,
        "Transfert introuvable ou supprimé",
        "ECHEC"
      );

      return res.status(404).json({ error: "Transfert introuvable ou déjà supprimé" });
    }
    console.log(`Transfert avec ID ${id} mis à jour avec succès`);

    await logAction(
      currentUser,
      "MISE_A_JOUR",
      "transferts",
      id,
      "Transfert mis à jour avec succès",
      "SUCCES"
    );

    res.status(200).json({ message: "Transfert mis à jour" });
  } catch (err) {
    console.error(`Erreur lors de la mise à jour du transfert avec ID ${id}:`, err);

    await logAction(
      currentUser,
      "MISE_A_JOUR",
      "transferts",
      id,
      `Erreur mise à jour: ${err.message}`,
      "ECHEC"
    );

    res.status(500).json({ error: "Erreur serveur" });
  }
};

const deleteTransfert = async (req, res) => {
  const id = req.params.id;
  const currentUser = req.user;
  console.log(`Action: Suppression du transfert avec ID ${id}`);
  try {
    const result = await transfertModel.deleteTransfert(id);
    if (result.affectedRows === 0) {
      console.log(`Transfert avec ID ${id} introuvable ou déjà supprimé`);

      await logAction(
        currentUser,
        "SUPPRESSION",
        "transferts",
        id,
        "Transfert introuvable ou déjà supprimé",
        "ECHEC"
      );

      return res.status(404).json({ error: "Transfert introuvable ou déjà supprimé" });
    }
    console.log(`Transfert avec ID ${id} supprimé avec succès`);

    await logAction(
      currentUser,
      "SUPPRESSION",
      "transferts",
      id,
      "Transfert supprimé avec succès",
      "SUCCES"
    );

    res.status(200).json({ message: "Transfert supprimé" });
  } catch (err) {
    console.error(`Erreur lors de la suppression du transfert avec ID ${id}:`, err);

    await logAction(
      currentUser,
      "SUPPRESSION",
      "transferts",
      id,
      `Erreur suppression: ${err.message}`,
      "ECHEC"
    );

    res.status(500).json({ error: "Erreur serveur" });
  }
};

module.exports = {
  createTransfert,
  getAllTransferts,
  getTransfertById,
  updateTransfert,
  deleteTransfert,
};
