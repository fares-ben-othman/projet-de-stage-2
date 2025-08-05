const interventionModel = require('../models/interventionModel');
const { interventionSchema } = require('../validators/interventionValidator');

const getAllInterventions = async (req, res) => {
  try {
    const [rows] = await interventionModel.getAllInterventions();
    res.status(200).json(rows);
  } catch (error) {
    console.error("Error getting interventions:", error);
    res.status(500).json({ message: "Failed to get interventions" });
  }
};

const getInterventionById = async (req, res) => {
  const id = req.params.id;
  try {
    const [rows] = await interventionModel.getInterventionById(id);
    if (rows.length === 0) {
      return res.status(404).json({ message: "Intervention not found" });
    }
    res.status(200).json(rows[0]);
  } catch (error) {
    console.error("Error getting intervention:", error);
    res.status(500).json({ message: "Failed to get intervention" });
  }
};

const createIntervention = async (req, res) => {
  const data = req.body;
  const { error } = interventionSchema.validate(data);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  try {
    const [result] = await interventionModel.createIntervention(data);
    res.status(201).json({ message: "Intervention created", id: result.insertId });
  } catch (error) {
    console.error("Error creating intervention:", error);
    res.status(500).json({ message: "Failed to create intervention" });
  }
};

const updateIntervention = async (req, res) => {
  const id = req.params.id;
  const data = req.body;
  const { error } = interventionSchema.validate(data);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  try {
    const [result] = await interventionModel.updateIntervention(data, id);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Intervention not found" });
    }
    res.status(200).json({ message: "Intervention updated" });
  } catch (error) {
    console.error("Error updating intervention:", error);
    res.status(500).json({ message: "Failed to update intervention" });
  }
};

const deleteIntervention = async (req, res) => {
  const id = req.params.id;
  try {
    const [result] = await interventionModel.deleteIntervention(id);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Intervention not found" });
    }
    res.status(200).json({ message: "Intervention deleted" });
  } catch (error) {
    console.error("Error deleting intervention:", error);
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

