const pool = require('../connection');

const getAllContracts = () => {
  return pool.query("SELECT * FROM contrats WHERE is_deleted = false");
};

const getContractById = (id) => {
  return pool.query("SELECT * FROM contrats WHERE is_deleted = false AND id = ?", [id]);
};

const createContract = (data) => {
  const {
    client_numero_permis,
    vehicule_id,
    agence_id,
    agenceParent,
    date_debut,
    date_fin,
    montant,
    remise,
    options_assurance,
    options_gps,
    options_conducteur_add,
    etat_pickup,
    km_initial,
    carburant_initial,
    etat_dropoff,
    km_final,
    carburant_final,
    frais_supplementaires,
    rapport_restitution,
  } = data;

  return pool.query(`
    INSERT INTO contrats (
      client_numero_permis,
      vehicule_id,
      agence_id,
      agenceParent,
      date_debut,
      date_fin,
      montant,
      remise,
      options_assurance,
      options_gps,
      options_conducteur_add,
      etat_pickup,
      km_initial,
      carburant_initial,
      etat_dropoff,
      km_final,
      carburant_final,
      frais_supplementaires,
      rapport_restitution
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `, [
    client_numero_permis,
    vehicule_id,
    agence_id,
    agenceParent,
    date_debut,
    date_fin,
    montant,
    remise,
    options_assurance,
    options_gps,
    options_conducteur_add,
    etat_pickup,
    km_initial,
    carburant_initial,
    etat_dropoff,
    km_final,
    carburant_final,
    frais_supplementaires,
    rapport_restitution,
  ]);
};


const updateContract = (data, id) => {
  const {
    client_numero_permis,
    vehicule_id,
    agence_id,
    agenceParent, // nouvelle colonne
    date_debut,
    date_fin,
    montant,
    remise,
    options_assurance,
    options_gps,
    options_conducteur_add,
    etat_pickup,
    km_initial,
    carburant_initial,
    etat_dropoff,
    km_final,
    carburant_final,
    frais_supplementaires,
    rapport_restitution,
  } = data;

  return pool.query(`
    UPDATE contrats SET
      client_numero_permis = ?,
      vehicule_id = ?,
      agence_id = ?,
      agenceParent = ?,
      date_debut = ?,
      date_fin = ?,
      montant = ?,
      remise = ?,
      options_assurance = ?,
      options_gps = ?,
      options_conducteur_add = ?,
      etat_pickup = ?,
      km_initial = ?,
      carburant_initial = ?,
      etat_dropoff = ?,
      km_final = ?,
      carburant_final = ?,
      frais_supplementaires = ?,
      rapport_restitution = ?
    WHERE id = ?
  `, [
    client_numero_permis,
    vehicule_id,
    agence_id,
    agenceParent,
    date_debut,
    date_fin,
    montant,
    remise,
    options_assurance,
    options_gps,
    options_conducteur_add,
    etat_pickup,
    km_initial,
    carburant_initial,
    etat_dropoff,
    km_final,
    carburant_final,
    frais_supplementaires,
    rapport_restitution,
    id
  ]);
};


const deleteContract = (id) => {
  return pool.query(
    "UPDATE contrats SET is_deleted = TRUE, deleted_at = NOW() WHERE id = ?",
    [id]
  );
};

module.exports = {
  getAllContracts,
  getContractById,
  createContract,
  updateContract,
  deleteContract,
};
