const vehiculeModel = require('../models/vehiculeModel');
const { vehiculeSchema } = require('../validators/vehiculeValidator');
const { logAction } = require('../utils/journal');

const getAllVehicules = async (req, res) => {
  const currentUser = req.user;
  console.log("Action: Récupération de tous les véhicules");
  try {
    const [rows] = await vehiculeModel.getAllVehicules();
    console.log(`Véhicules récupérés: ${rows.length}`);

    await logAction(
      currentUser,
      "LECTURE",
      "vehicules",
      null,
      `Récupération de tous les véhicules (${rows.length})`,
      "SUCCES"
    );

    res.status(200).json(rows);
  } catch (error) {
    console.error("Erreur lors de la récupération des véhicules:", error);

    await logAction(
      currentUser,
      "LECTURE",
      "vehicules",
      null,
      `Erreur récupération véhicules: ${error.message}`,
      "ECHEC"
    );

    res.status(500).json({ message: "Erreur serveur" });
  }
};

const getVehiculeByImmatriculation = async (req, res) => {
  const immatriculation = req.params.immatriculation;
  const currentUser = req.user;
  console.log(`Action: Récupération du véhicule avec immatriculation ${immatriculation}`);
  try {
    const [rows] = await vehiculeModel.getVehiculeByImmatriculation(immatriculation);
    if (rows.length === 0) {
      console.log(`Véhicule avec immatriculation ${immatriculation} introuvable`);

      await logAction(
        currentUser,
        "LECTURE",
        "vehicules",
        immatriculation,
        `Véhicule immatriculation ${immatriculation} introuvable`,
        "ECHEC"
      );

      return res.status(404).json({ message: "Véhicule introuvable" });
    }

    console.log("Véhicule récupéré:", rows[0]);

    await logAction(
      currentUser,
      "LECTURE",
      "vehicules",
      immatriculation,
      `Véhicule immatriculation ${immatriculation} récupéré`,
      "SUCCES"
    );

    res.status(200).json(rows[0]);
  } catch (error) {
    console.error(`Erreur lors de la récupération du véhicule avec immatriculation ${immatriculation}:`, error);

    await logAction(
      currentUser,
      "LECTURE",
      "vehicules",
      immatriculation,
      `Erreur récupération véhicule ${immatriculation}: ${error.message}`,
      "ECHEC"
    );

    res.status(500).json({ message: "Erreur serveur" });
  }
};

const createVehicule = async (req, res) => {
  const currentUser = req.user;
  console.log("Action: Création d'un véhicule, données reçues:", req.body);

  const { error, value } = vehiculeSchema.validate(req.body);
  if (error) {
    console.log("Erreur de validation:", error.details[0].message);

    await logAction(
      currentUser,
      "CREATION",
      "vehicules",
      null,
      `Erreur validation: ${error.details[0].message}`,
      "ECHEC"
    );

    return res.status(400).json({ message: error.details[0].message });
  }

  try {
    const [existing] = await vehiculeModel.getVehiculeByImmatriculation(value.immatriculation);
    if (existing.length > 0) {
      console.log(`Immatriculation ${value.immatriculation} déjà utilisée`);

      await logAction(
        currentUser,
        "CREATION",
        "vehicules",
        null,
        `Immatriculation ${value.immatriculation} déjà utilisée`,
        "ECHEC"
      );

      return res.status(400).json({ message: "Immatriculation déjà utilisée" });
    }

    const [result] = await vehiculeModel.createVehicule(value);
    console.log("Véhicule créé avec succès, ID:", result.insertId);

    await logAction(
      currentUser,
      "CREATION",
      "vehicules",
      value.immatriculation,
      `Véhicule créé: ${value.immatriculation} ${value.marque} ${value.modele}`,
      "SUCCES"
    );

    res.status(201).json({ message: "Véhicule créé", immatriculation: value.immatriculation });
  } catch (error) {
    console.error("Erreur lors de la création du véhicule:", error);

    await logAction(
      currentUser,
      "CREATION",
      "vehicules",
      null,
      `Erreur création véhicule: ${error.message}`,
      "ECHEC"
    );

    res.status(500).json({ message: "Erreur serveur" });
  }
};

const updateVehicule = async (req, res) => {
  const immatriculation = req.params.immatriculation;
  const currentUser = req.user;
  console.log(`Action: Mise à jour du véhicule avec immatriculation ${immatriculation}, données:`, req.body);

  const { error, value } = vehiculeSchema.validate(req.body);
  if (error) {
    console.log("Erreur de validation:", error.details[0].message);

    await logAction(
      currentUser,
      "MISE_A_JOUR",
      "vehicules",
      immatriculation,
      `Erreur validation: ${error.details[0].message}`,
      "ECHEC"
    );

    return res.status(400).json({ message: error.details[0].message });
  }

  try {
    if (value.immatriculation && value.immatriculation !== immatriculation) {
      const [existing] = await vehiculeModel.getVehiculeByImmatriculation(value.immatriculation);
      if (existing.length > 0) {
        console.log(`Immatriculation ${value.immatriculation} déjà utilisée`);

        await logAction(
          currentUser,
          "MISE_A_JOUR",
          "vehicules",
          immatriculation,
          `Immatriculation ${value.immatriculation} déjà utilisée`,
          "ECHEC"
        );

        return res.status(400).json({ message: "Immatriculation déjà utilisée" });
      }
    }

    const [result] = await vehiculeModel.updateVehicule(value, immatriculation);
    if (result.affectedRows === 0) {
      console.log(`Véhicule avec immatriculation ${immatriculation} introuvable`);

      await logAction(
        currentUser,
        "MISE_A_JOUR",
        "vehicules",
        immatriculation,
        "Véhicule introuvable",
        "ECHEC"
      );

      return res.status(404).json({ message: "Véhicule introuvable" });
    }

    console.log(`Véhicule avec immatriculation ${immatriculation} mis à jour avec succès`);

    await logAction(
      currentUser,
      "MISE_A_JOUR",
      "vehicules",
      immatriculation,
      "Véhicule mis à jour avec succès",
      "SUCCES"
    );

    res.status(200).json({ message: "Véhicule mis à jour" });
  } catch (error) {
    console.error(`Erreur lors de la mise à jour du véhicule avec immatriculation ${immatriculation}:`, error);

    await logAction(
      currentUser,
      "MISE_A_JOUR",
      "vehicules",
      immatriculation,
      `Erreur mise à jour: ${error.message}`,
      "ECHEC"
    );

    res.status(500).json({ message: "Erreur serveur" });
  }
};

const deleteVehicule = async (req, res) => {
  const immatriculation = req.params.immatriculation;
  const currentUser = req.user;
  console.log(`Action: Suppression du véhicule avec immatriculation ${immatriculation}`);
  try {
    const [result] = await vehiculeModel.deleteVehicule(immatriculation);
    if (result.affectedRows === 0) {
      console.log(`Véhicule avec immatriculation ${immatriculation} introuvable`);

      await logAction(
        currentUser,
        "SUPPRESSION",
        "vehicules",
        immatriculation,
        "Véhicule introuvable",
        "ECHEC"
      );

      return res.status(404).json({ message: "Véhicule introuvable" });
    }

    console.log(`Véhicule avec immatriculation ${immatriculation} supprimé avec succès`);

    await logAction(
      currentUser,
      "SUPPRESSION",
      "vehicules",
      immatriculation,
      "Véhicule supprimé avec succès",
      "SUCCES"
    );

    res.status(200).json({ message: "Véhicule supprimé" });
  } catch (error) {
    console.error(`Erreur lors de la suppression du véhicule avec immatriculation ${immatriculation}:`, error);

    await logAction(
      currentUser,
      "SUPPRESSION",
      "vehicules",
      immatriculation,
      `Erreur suppression: ${error.message}`,
      "ECHEC"
    );

    res.status(500).json({ message: "Erreur serveur" });
  }
};

module.exports = {
  getAllVehicules,
  getVehiculeByImmatriculation,
  createVehicule,
  updateVehicule,
  deleteVehicule,
};
