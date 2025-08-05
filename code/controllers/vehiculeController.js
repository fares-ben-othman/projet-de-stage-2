const vehiculeModel = require('../models/vehiculeModel');
const vehiculeSchema = require('../validators/vehiculeValidator');

const getAllVehicules = async (req, res) => {
  try {
    const [rows] = await vehiculeModel.getAllVehicules();
    res.status(200).json(rows);
  } catch (error) {
    console.error("Error getting vehicles:", error);
    res.status(500).json({ message: "Failed to get vehicles" });
  }
};

const getVehiculeById = async (req, res) => {
  const id = req.params.id;
  try {
    const [rows] = await vehiculeModel.getVehiculeById(id);
    if (rows.length === 0) {
      return res.status(404).json({ message: "Vehicle not found" });
    }
    res.status(200).json(rows[0]);
  } catch (error) {
    console.error("Error getting vehicle:", error);
    res.status(500).json({ message: "Failed to get vehicle" });
  }
};

const createVehicule = async (req, res) => {
  const data = req.body;
  const { error } = vehiculeSchema.validate(data);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  try {
    const [result] = await vehiculeModel.createVehicule(data);
    res.status(201).json({ message: "Vehicle created", id: result.insertId });
  } catch (error) {
    console.error("Error creating vehicle:", error);
    res.status(500).json({ message: "Failed to create vehicle" });
  }
};

const updateVehicule = async (req, res) => {
  const id = req.params.id;
  const data = req.body;
  const { error } = vehiculeSchema.validate(data);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  try {
    const [result] = await vehiculeModel.updateVehicule(data, id);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Vehicle not found" });
    }
    res.status(200).json({ message: "Vehicle updated" });
  } catch (error) {
    console.error("Error updating vehicle:", error);
    res.status(500).json({ message: "Failed to update vehicle" });
  }
};

const deleteVehicule = async (req, res) => {
  const id = req.params.id;
  try {
    const [result] = await vehiculeModel.deleteVehicule(id);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Vehicle not found" });
    }
    res.status(200).json({ message: "Vehicle deleted" });
  } catch (error) {
    console.error("Error deleting vehicle:", error);
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
