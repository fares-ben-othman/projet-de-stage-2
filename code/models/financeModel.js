const pool = require('../connection');

const getAllFinances = () => {
  return pool.query('SELECT * FROM finances WHERE is_deleted = FALSE');
};

const getFinanceById = (id) => {
  return pool.query('SELECT * FROM finances WHERE id = ? AND is_deleted = FALSE', [id]);
};

const createFinance = (finance) => {
  const {
    type,
    montant,
    vehicule_id,
    agence_id,
    source,
    date_finance,
  } = finance;

  return pool.query(
    `INSERT INTO finances 
      (type, montant, vehicule_id, agence_id, source, date_finance)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [type, montant, vehicule_id, agence_id, source, date_finance]
  );
};

const updateFinance = (finance, id) => {
  const {
    type,
    montant,
    vehicule_id,
    agence_id,
    source,
    date_finance
  } = finance;

  return pool.query(
    `UPDATE finances SET 
      type = ?, 
      montant = ?, 
      vehicule_id = ?, 
      agence_id = ?, 
      source = ?, 
      date_finance = ?
     WHERE id = ?`,
    [type, montant, vehicule_id, agence_id, source, date_finance, id]
  );
};

const deleteFinance = (id) => {
  return pool.query(
    `UPDATE finances SET is_deleted = TRUE, deleted_at = NOW() WHERE id = ?`,
    [id]
  );
};

module.exports = {
  getAllFinances,
  getFinanceById,
  createFinance,
  updateFinance,
  deleteFinance
};
