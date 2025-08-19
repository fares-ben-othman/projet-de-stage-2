const pool = require('../connection');

const getAllVehicules = () => {
  return pool.query('SELECT * FROM vehicules WHERE is_deleted = FALSE');
};

const getVehiculeById = (id) => {
  return pool.query('SELECT * FROM vehicules WHERE id = ? AND is_deleted = FALSE', [id]);
};
const getVehiculeByImmatriculation = (immatriculation) => {
  return pool.query("SELECT * FROM vehicules WHERE  immatriculation = ?", [immatriculation]);
};
const createVehicule = (vehicule) => {
  const {
    immatriculation,
    marque,
    modele,
    annee,
    kilometrage,
    statut,
    date_assurance,
    agence_id
  } = vehicule;

  return pool.query(
    `INSERT INTO vehicules 
      (immatriculation, marque, modele, annee, kilometrage, statut, date_assurance, agence_id)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [immatriculation, marque, modele, annee, kilometrage, statut, date_assurance, agence_id]
  );
};

const updateVehicule = (vehicule, id) => {
  const {
    immatriculation,
    marque,
    modele,
    annee,
    kilometrage,
    statut,
    date_assurance,
    agence_id
  } = vehicule;

  return pool.query(
    `UPDATE vehicules SET immatriculation = ?, marque = ?, modele = ?, annee = ?, kilometrage = ?, statut = ?, date_assurance = ?, agence_id = ?
     WHERE id = ?`,
    [immatriculation, marque, modele, annee, kilometrage, statut, date_assurance, agence_id, id]
  );
};

const deleteVehicule = (id) => {
  return pool.query(
    `UPDATE vehicules SET is_deleted = TRUE, deleted_at = NOW() WHERE id = ?`,
    [id]
  );
};

module.exports = {
  getAllVehicules,
  getVehiculeById,
  getVehiculeByImmatriculation,
  createVehicule,
  updateVehicule,
  deleteVehicule
};
