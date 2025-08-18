const financeModel = require('../models/financeModel');
const { financeSchema } = require('../validators/financeValidator');

const createFinance = async (req, res) => {
  console.log("Action: Création d'un enregistrement financier");
  const { error, value } = financeSchema.validate(req.body);
  if (error) {
    console.log("Erreur de validation:", error.details[0].message);
    return res.status(400).json({ message: error.details[0].message });
  }

  try {
    const [result] = await financeModel.createFinance(value);
    console.log("Enregistrement financier ajouté avec succès:", { id: result.insertId, ...value });
    res.status(201).json({ message: 'Enregistrement financier ajouté avec succès.', id: result.insertId });
  } catch (err) {
    console.error("Erreur lors de l'ajout de l'enregistrement financier:", err);
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

const getAllFinances = async (req, res) => {
  console.log("Action: Récupération de tous les enregistrements financiers");
  try {
    const [rows] = await financeModel.getAllFinances();
    console.log(`Enregistrements financiers récupérés: ${rows.length}`);
    res.status(200).json(rows);
  } catch (err) {
    console.error("Erreur lors de la récupération des enregistrements financiers:", err);
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

const getFinanceById = async (req, res) => {
  const id = parseInt(req.params.id);
  console.log(`Action: Récupération de l'enregistrement financier avec ID ${id}`);
  try {
    const [rows] = await financeModel.getFinanceById(id);
    if (rows.length === 0) {
      console.log(`Enregistrement financier avec ID ${id} non trouvé`);
      return res.status(404).json({ message: 'Enregistrement financier non trouvé' });
    }
    console.log("Enregistrement financier récupéré:", rows[0]);
    res.status(200).json(rows[0]);
  } catch (err) {
    console.error(`Erreur lors de la récupération de l'enregistrement financier avec ID ${id}:`, err);
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

const updateFinance = async (req, res) => {
  const id = parseInt(req.params.id);
  console.log(`Action: Mise à jour de l'enregistrement financier avec ID ${id}`);
  const { error, value } = financeSchema.validate(req.body);
  if (error) {
    console.log("Erreur de validation:", error.details[0].message);
    return res.status(400).json({ message: error.details[0].message });
  }

  try {
    const [result] = await financeModel.updateFinance(value, id);
    if (result.affectedRows === 0) {
      console.log(`Enregistrement financier avec ID ${id} non trouvé pour mise à jour`);
      return res.status(404).json({ message: 'Enregistrement financier non trouvé' });
    }
    console.log(`Enregistrement financier avec ID ${id} mis à jour avec succès`, value);
    res.status(200).json({ message: 'Enregistrement financier mis à jour' });
  } catch (err) {
    console.error(`Erreur lors de la mise à jour de l'enregistrement financier avec ID ${id}:`, err);
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

const deleteFinance = async (req, res) => {
  const id = parseInt(req.params.id);
  console.log(`Action: Suppression de l'enregistrement financier avec ID ${id}`);
  try {
    const [result] = await financeModel.deleteFinance(id);
    if (result.affectedRows === 0) {
      console.log(`Enregistrement financier avec ID ${id} non trouvé pour suppression`);
      return res.status(404).json({ message: 'Enregistrement financier non trouvé' });
    }
    console.log(`Enregistrement financier avec ID ${id} supprimé avec succès`);
    res.status(200).json({ message: 'Enregistrement financier supprimé' });
  } catch (err) {
    console.error(`Erreur lors de la suppression de l'enregistrement financier avec ID ${id}:`, err);
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

module.exports = {
  createFinance,
  getAllFinances,
  getFinanceById,
  updateFinance,
  deleteFinance,
};
