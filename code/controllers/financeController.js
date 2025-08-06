const financeModel = require('../models/financeModel');
const { financeSchema } = require('../validators/financeValidator');

const createFinance = async (req, res) => {
  const { error, value } = financeSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  try {
    const [result] = await financeModel.createFinance(value);
    res.status(201).json({ message: 'Enregistrement financier ajouté avec succès.', id: result.insertId });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

const getAllFinances = async (req, res) => {
  try {
    const [rows] = await financeModel.getAllFinances();
    res.status(200).json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

const getFinanceById = async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const [rows] = await financeModel.getFinanceById(id);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Enregistrement financier non trouvé' });
    }
    res.status(200).json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

const updateFinance = async (req, res) => {
  const id = parseInt(req.params.id);
  const { error, value } = financeSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  try {
    const [result] = await financeModel.updateFinance(value, id);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Enregistrement financier non trouvé' });
    }
    res.status(200).json({ message: 'Enregistrement financier mis à jour' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

const deleteFinance = async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const [result] = await financeModel.deleteFinance(id);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Enregistrement financier non trouvé' });
    }
    res.status(200).json({ message: 'Enregistrement financier supprimé' });
  } catch (err) {
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
