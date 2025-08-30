const pool = require('../connection');

const getAllVehicules = () => {
  return pool.query('SELECT * FROM vehicules WHERE is_deleted = FALSE');
};

const getVehiculeByImmatriculation = (immatriculation) => {
  return pool.query(
    'SELECT * FROM vehicules WHERE immatriculation = ? AND is_deleted = FALSE',
    [immatriculation]
  );
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


const updateVehicule = (vehicule, immatriculation) => {
  const { marque, modele, annee, kilometrage, statut, date_assurance, agence_id } = vehicule;

  return pool.query(
    `UPDATE vehicules 
     SET marque = ?, modele = ?, annee = ?, kilometrage = ?, statut = ?, date_assurance = ?, agence_id = ?
     WHERE immatriculation = ? AND is_deleted = FALSE`,
    [marque, modele, annee, kilometrage, statut, date_assurance, agence_id, immatriculation]
  );
};


const deleteVehicule = (immatriculation) => {
  return pool.query(
    `UPDATE vehicules SET is_deleted = TRUE, deleted_at = NOW() WHERE immatriculation = ?`,
    [immatriculation]
  );
};

module.exports = {
  getAllVehicules,
  getVehiculeByImmatriculation,
  createVehicule,
  updateVehicule,
  deleteVehicule
};
