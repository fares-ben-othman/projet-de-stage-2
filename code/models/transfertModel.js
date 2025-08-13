const pool = require('../connection');

const getAllTransferts = () => {
  return pool.query('SELECT * FROM transferts WHERE is_deleted = FALSE');
};

const getTransfertById = (id) => {
  return pool.query('SELECT * FROM transferts WHERE id = ? AND is_deleted = FALSE', [id]);
};

const createTransfert = (transfert) => {
  const {
    vehicule_id,
    source_agence_id,
    destination_agence_id,
    date_transfert,
    etat
  } = transfert;
  return pool.query(
    `INSERT INTO transferts 
      (vehicule_id, source_agence_id, destination_agence_id, date_transfert, etat)
     VALUES (?, ?, ?, ?, ?)`,
    [vehicule_id, source_agence_id, destination_agence_id, date_transfert, etat]
  ); 
};

const updateTransfert = (transfert, id) => {
  const {
    vehicule_id,
    source_agence_id,
    destination_agence_id,
    date_transfert,
    etat
  } = transfert;

  return pool.query(
    `UPDATE transferts 
     SET vehicule_id = ?, source_agence_id = ?, destination_agence_id = ?, date_transfert = ?, etat = ?
     WHERE id = ? AND is_deleted = FALSE`,
    [vehicule_id, source_agence_id, destination_agence_id, date_transfert, etat, id]
  );
};

const deleteTransfert = (id) => {
  return pool.query(
    `UPDATE transferts SET is_deleted = TRUE, deleted_at = NOW() WHERE id = ?`,
    [id]
  );
};

module.exports = {
  getAllTransferts,
  getTransfertById,
  createTransfert,
  updateTransfert,
  deleteTransfert
};
