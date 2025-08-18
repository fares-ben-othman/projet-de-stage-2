const interventionModel = require('../models/interventionModel');
const { interventionSchema } = require('../validators/interventionValidator');

const getAllInterventions = async (req, res) => {
  console.log("Action: Récupération de toutes les interventions");
  try {
    const [rows] = await interventionModel.getAllInterventions();
    console.log(`Interventions récupérées: ${rows.length}`);
    res.status(200).json(rows);
  } catch (error) {
    console.error("Erreur lors de la récupération des interventions:", error);
    res.status(500).json({ message: "Failed to get interventions" });
  }
};

const getInterventionById = async (req, res) => {
  const id = req.params.id;
  console.log(`Action: Récupération de l'intervention avec ID ${id}`);
  try {
    const [rows] = await interventionModel.getInterventionById(id);
    if (rows.length === 0) {
      console.log(`Intervention avec ID ${id} non trouvée`);
      return res.status(404).json({ message: "Intervention not found" });
    }
    console.log("Intervention récupérée:", rows[0]);
    res.status(200).json(rows[0]);
  } catch (error) {
    console.error(`Erreur lors de la récupération de l'intervention avec ID ${id}:`, error);
    res.status(500).json({ message: "Failed to get intervention" });
  }
};

const createIntervention = async (req, res) => {
  const data = req.body;
  console.log("Action: Création d'une nouvelle intervention", data);
  const { error } = interventionSchema.validate(data);
  if (error) {
    console.log("Erreur de validation:", error.details[0].message);
    return res.status(400).json({ message: error.details[0].message });
  }
  try {
    const [result] = await interventionModel.createIntervention(data);
    console.log("Intervention créée avec succès, ID:", result.insertId);
    res.status(201).json({ message: "Intervention created", id: result.insertId });
  } catch (error) {
    console.error("Erreur lors de la création de l'intervention:", error);
    res.status(500).json({ message: "Failed to create intervention" });
  }
};

const updateIntervention = async (req, res) => {
  const id = req.params.id;
  const data = req.body;
  console.log(`Action: Mise à jour de l'intervention avec ID ${id}`, data);
  const { error } = interventionSchema.validate(data);
  if (error) {
    console.log("Erreur de validation:", error.details[0].message);
    return res.status(400).json({ message: error.details[0].message });
  }
  try {
    const [result] = await interventionModel.updateIntervention(data, id);
    if (result.affectedRows === 0) {
      console.log(`Intervention avec ID ${id} non trouvée pour mise à jour`);
      return res.status(404).json({ message: "Intervention not found" });
    }
    console.log(`Intervention avec ID ${id} mise à jour avec succès`);
    res.status(200).json({ message: "Intervention updated" });
  } catch (error) {
    console.error(`Erreur lors de la mise à jour de l'intervention avec ID ${id}:`, error);
    res.status(500).json({ message: "Failed to update intervention" });
  }
};

const deleteIntervention = async (req, res) => {
  const id = req.params.id;
  console.log(`Action: Suppression de l'intervention avec ID ${id}`);
  try {
    const [result] = await interventionModel.deleteIntervention(id);
    if (result.affectedRows === 0) {
      console.log(`Intervention avec ID ${id} non trouvée pour suppression`);
      return res.status(404).json({ message: "Intervention not found" });
    }
    console.log(`Intervention avec ID ${id} supprimée avec succès`);
    res.status(200).json({ message: "Intervention deleted" });
  } catch (error) {
    console.error(`Erreur lors de la suppression de l'intervention avec ID ${id}:`, error);
    res.status(500).json({ message: "Failed to delete intervention" });
  }
};

module.exports = {
  getAllInterventions,
  getInterventionById,
  createIntervention,
  updateIntervention,
  deleteIntervention
};
