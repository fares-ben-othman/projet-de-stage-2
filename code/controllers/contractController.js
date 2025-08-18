const contractModel = require("../models/contractModel");
const { contractSchema } = require("../validators/contractValidator");

const getAllContracts = async (req, res) => {
  console.log("Action: Récupération de tous les contrats");
  try {
    const [rows] = await contractModel.getAllContracts();
    console.log(`Contrats récupérés: ${rows.length}`);
    res.json(rows);
  } catch (error) {
    console.error("Erreur lors de la récupération des contrats:", error);
    res.status(500).json({ message: "Failed to get contracts" });
  }
};

const getContractById = async (req, res) => {
  const id = req.params.id;
  console.log(`Action: Récupération du contrat avec ID ${id}`);
  try {
    const [rows] = await contractModel.getContractById(id);
    if (rows.length === 0) {
      console.log(`Contrat avec ID ${id} non trouvé`);
      return res.status(404).json({ message: "Contract not found" });
    }
    console.log("Contrat récupéré:", rows[0]);
    res.json(rows[0]);
  } catch (error) {
    console.error(`Erreur lors de la récupération du contrat avec ID ${id}:`, error);
    res.status(500).json({ message: "Failed to get contract" });
  }
};

const createContract = async (req, res) => {
  console.log("Action: Création d'un nouveau contrat");
  const data = req.body;

  const { error } = contractSchema.validate(data);
  if (error) {
    console.log("Erreur de validation:", error.details[0].message);
    return res.status(400).json({ message: error.details[0].message });
  }

  try {
    const [result] = await contractModel.createContract(data);
    console.log("Contrat créé avec succès:", { id: result.insertId, ...data });
    res.status(201).json({ message: "Contract created", id: result.insertId });
  } catch (error) {
    console.error("Erreur lors de la création du contrat:", error);
    res.status(500).json({ message: "Failed to create contract" });
  }
};

const updateContract = async (req, res) => {
  const id = req.params.id;
  const data = req.body;
  console.log(`Action: Mise à jour du contrat avec ID ${id}`);

  const { error } = contractSchema.validate(data);
  if (error) {
    console.log("Erreur de validation:", error.details[0].message);
    return res.status(400).json({ message: error.details[0].message });
  }

  try {
    const [result] = await contractModel.updateContract(data, id);
    if (result.affectedRows === 0) {
      console.log(`Contrat avec ID ${id} non trouvé pour mise à jour`);
      return res.status(404).json({ message: "Contract not found" });
    }
    console.log(`Contrat avec ID ${id} mis à jour avec succès`, data);
    res.json({ message: "Contract updated" });
  } catch (error) {
    console.error(`Erreur lors de la mise à jour du contrat avec ID ${id}:`, error);
    res.status(500).json({ message: "Failed to update contract" });
  }
};

const deleteContract = async (req, res) => {
  const id = req.params.id;
  console.log(`Action: Suppression du contrat avec ID ${id}`);
  try {
    const [result] = await contractModel.deleteContract(id);
    if (result.affectedRows === 0) {
      console.log(`Contrat avec ID ${id} non trouvé pour suppression`);
      return res.status(404).json({ message: "Contract not found" });
    }
    console.log(`Contrat avec ID ${id} supprimé avec succès`);
    res.json({ message: "Contract deleted" });
  } catch (error) {
    console.error(`Erreur lors de la suppression du contrat avec ID ${id}:`, error);
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
