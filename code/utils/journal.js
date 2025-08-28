const JournalAdmin = require('../models/journalModel');

async function logAction(currentUser, type_action, table_cible, identifiant_cible, description, statut) {
  try {
    await JournalAdmin.log({
      utilisateur_id: currentUser.id,
      utilisateur_nom: currentUser.nom,
      agence_id: currentUser.agence_id,
      role: currentUser.role,
      type_action,
      table_cible,
      identifiant_cible,
      description,
      statut
    });
  } catch (e) {
    console.error('Erreur lors de l\'écriture dans le journal:', e);
  }
}

module.exports = { logAction };
