const pool = require('./connection');

const getAllAgences = () => {
  return pool.query('SELECT * FROM agences WHERE is_deleted = FALSE');
};

const getAgenceById = (id) => {
  return db.query('SELECT * FROM agences WHERE id = ? AND is_deleted = FALSE', [id]);
};


const createAgence = (data) => {
  const { nom, adresse, ville, telephone, email } = data;
  return db.query(
    'INSERT INTO agences (nom, adresse, ville, telephone, email) VALUES (?, ?, ?, ?, ?)',
    [nom, adresse, ville, telephone, email]
  );
};

const updateAgence = (id, data) => {
  const { nom, adresse, ville, telephone, email } = data;
  return db.query(
    'UPDATE agences SET nom = ?, adresse = ?, ville = ?, telephone = ?, email = ? WHERE id = ?',
    [nom, adresse, ville, telephone, email, id]
  );
};
// hedhi tetsemma soft deletion 5ater fel 79i9a mehech bech tetfasse5 mel base de données
const deleteAgence = (id) => {
  return db.query(
    'UPDATE agences SET is_deleted = TRUE, deleted_at = NOW() WHERE id = ?',
    [id]
  );
};

module.exports = {
  getAllAgences,
  getAgenceById,
  createAgence,
  updateAgence,
  deleteAgence,
};
