const pool = require('../connection');

const getAllInterventions = () => {
return pool.query('SELECT * FROM interventions WHERE is_deleted = FALSE');
}

const getInterventionById = (id) => {
  return pool.query('SELECT * FROM interventions WHERE id = ? AND is_deleted = FALSE', [id]);
};

const createIntervention = (data) => {
  const { vehicule_id, type, date_intervention, agence_id, prestataire, cout, commentaire, facture_pdf } = data;
  return pool.query(
    'INSERT INTO interventions (vehicule_id, type, date_intervention, agence_id, prestataire, cout, commentaire, facture_pdf) VALUES (?, ?, ?, ?, ?,?,?,?)',
    [vehicule_id, type, date_intervention, agence_id, prestataire, cout, commentaire, facture_pdf]
  );
};

const updateIntervention = (data , id) => {
  const { vehicule_id, type, date_intervention, agence_id, prestataire, cout, commentaire, facture_pdf } = data;
  return pool.query(
    'UPDATE interventions SET vehicule_id = ? ,type = ?, date_intervention = ?, agence_id = ?, prestataire = ?, cout = ?,commentaire = ?, facture_pdf = ? WHERE id = ?',
    [ vehicule_id,type, date_intervention, agence_id, prestataire, cout, commentaire, facture_pdf,id]
  );
};

const deleteIntervention = (id) => {
  return pool.query(
    'UPDATE interventions SET is_deleted = TRUE, deleted_at = NOW() WHERE id = ?',
    [id]
  );
};
module.exports = {
    getAllInterventions,
    getInterventionById,
    createIntervention,
    updateIntervention,
    deleteIntervention
}