const vehiculeModel = require('../models/vehiculeModel');
const { vehiculeSchema } = require('../validators/vehiculeValidator');

const getAllVehicules = async (req, res) => {
  console.log("Action: Récupération de tous les véhicules");
  try {
    const [rows] = await vehiculeModel.getAllVehicules();
    console.log(`Véhicules récupérés: ${rows.length}`);
    res.status(200).json(rows);
  } catch (error) {
    console.error("Erreur lors de la récupération des véhicules:", error);
    res.status(500).json({ message: "Failed to get vehicles" });
  }
};

const getVehiculeById = async (req, res) => {
  const id = req.params.id;
  console.log(`Action: Récupération du véhicule avec ID ${id}`);
  try {
    const [rows] = await vehiculeModel.getVehiculeById(id);
    if (rows.length === 0) {
      console.log(`Véhicule avec ID ${id} introuvable`);
      return res.status(404).json({ message: "Vehicle not found" });
    }
    console.log("Véhicule récupéré:", rows[0]);
    res.status(200).json(rows[0]);
  } catch (error) {
    console.error(`Erreur lors de la récupération du véhicule avec ID ${id}:`, error);
    res.status(500).json({ message: "Failed to get vehicle" });
  }
};

const createVehicule = async (req, res) => {
  console.log("Action: Création d'un véhicule, données reçues:", req.body);

  const data = req.body;
  const { error } = vehiculeSchema.validate(data);
  if (error) {
    console.log("Erreur de validation:", error.details[0].message);
    return res.status(400).json({ message: error.details[0].message });
  }

  try {
    const [result] = await vehiculeModel.createVehicule(data);
    console.log("Véhicule créé avec succès, ID:", result.insertId);
    res.status(201).json({ message: "Vehicle created", id: result.insertId });
  } catch (error) {
    console.error("Erreur lors de la création du véhicule:", error);
    res.status(500).json({ message: "Failed to create vehicle" });
  }
};

const updateVehicule = async (req, res) => {
  const id = req.params.id;
  console.log(`Action: Mise à jour du véhicule avec ID ${id}, données:`, req.body);

  const data = req.body;
  const { error } = vehiculeSchema.validate(data);
  if (error) {
    console.log("Erreur de validation:", error.details[0].message);
    return res.status(400).json({ message: error.details[0].message });
  }

  try {
    const [result] = await vehiculeModel.updateVehicule(data, id);
    if (result.affectedRows === 0) {
      console.log(`Véhicule avec ID ${id} introuvable`);
      return res.status(404).json({ message: "Vehicle not found" });
    }
    console.log(`Véhicule avec ID ${id} mis à jour avec succès`);
    res.status(200).json({ message: "Vehicle updated" });
  } catch (error) {
    console.error(`Erreur lors de la mise à jour du véhicule avec ID ${id}:`, error);
    res.status(500).json({ message: "Failed to update vehicle" });
  }
};

const deleteVehicule = async (req, res) => {
  const id = req.params.id;
  console.log(`Action: Suppression du véhicule avec ID ${id}`);
  try {
    const [result] = await vehiculeModel.deleteVehicule(id);
    if (result.affectedRows === 0) {
      console.log(`Véhicule avec ID ${id} introuvable`);
      return res.status(404).json({ message: "Vehicle not found" });
    }
    console.log(`Véhicule avec ID ${id} supprimé avec succès`);
    res.status(200).json({ message: "Vehicle deleted" });
  } catch (error) {
    console.error(`Erreur lors de la suppression du véhicule avec ID ${id}:`, error);
    res.status(500).json({ message: "Failed to delete vehicle" });
  }
};

module.exports = {
  getAllVehicules,
  getVehiculeById,
  createVehicule,
  updateVehicule,
  deleteVehicule
};
