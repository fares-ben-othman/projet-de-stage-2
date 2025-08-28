const pool = require('../connection');

const JournalAdmin = {
  async log({ utilisateur_id, utilisateur_nom, agence_id, role, type_action, table_cible, identifiant_cible, description, statut }) {
    const sql = `
      INSERT INTO journal_admin 
      (utilisateur_id, utilisateur_nom, agence_id, role, type_action, table_cible, identifiant_cible, description, statut)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const params = [
      utilisateur_id,
      utilisateur_nom , 
      agence_id ,
      role,
      type_action,
      table_cible,
      identifiant_cible || null,
      description,
      statut
    ];
    return await pool.query(sql, params);
  }
};

module.exports = JournalAdmin;
