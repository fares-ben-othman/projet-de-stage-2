const contractModel = require("../models/contractModel");
const {contractSchema} = require("../validators/contractValidator");

const getAllContracts = async (req, res) => {
  try {
    const [rows] = await contractModel.getAllContracts();
    res.json(rows);
  } catch (error) {
    console.error("Error getting contracts:", error);
    res.status(500).json({ message: "Failed to get contracts" });
  }
};

const getContractById = async (req, res) => {
  const id = req.params.id;
  try {
    const [rows] = await contractModel.getContractById(id);
    if (rows.length === 0) {
      return res.status(404).json({ message: "Contract not found" });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error("Error getting contract:", error);
    res.status(500).json({ message: "Failed to get contract" });
  }
};

const createContract = async (req, res) => {
  const data = req.body;

  const { error } = contractSchema.validate(data);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  try {
    const [result] = await contractModel.createContract(data);
    res.status(201).json({ message: "Contract created", id: result.insertId });
  } catch (error) {
    console.error("Error creating contract:", error);
    res.status(500).json({ message: "Failed to create contract" });
  }
};

const updateContract = async (req, res) => {
  const id = req.params.id;
  const data = req.body;

  const { error } = contractSchema.validate(data);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  try {
    const [result] = await contractModel.updateContract(data, id);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Contract not found" });
    }
    res.json({ message: "Contract updated" });
  } catch (error) {
    console.error("Error updating contract:", error);
    res.status(500).json({ message: "Failed to update contract" });
  }
};

const deleteContract = async (req, res) => {
  const id = req.params.id;
  try {
    const [result] = await contractModel.deleteContract(id);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Contract not found" });
    }
    res.json({ message: "Contract deleted" });
  } catch (error) {
    console.error("Error deleting contract:", error);
    res.status(500).json({ message: "Failed to delete contract" });
  }
};

module.exports = {
  getAllContracts,
  getContractById,
  createContract,
  updateContract,
  deleteContract,
};
