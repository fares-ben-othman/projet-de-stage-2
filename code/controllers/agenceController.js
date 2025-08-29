const agenceModel = require('../models/agenceModel');
const { agenceSchema } = require('../validators/agenceValidator');
const { logAction } = require('../utils/journal'); 

const findAgence = async (id, res) => {
    console.log(`Action: Vérification de l'existence de l'agence avec ID ${id}`);
    try {
        const [rows] = await agenceModel.getAgenceById(id);
        if (rows.length === 0) {
            console.log(`Agence avec ID ${id} non trouvée`);
            res.status(404).json({ error: 'Agence non trouvée' });
            return null;
        }
        console.log(`Agence trouvée:`, rows[0]);
        return rows[0];
    } catch (err) {
        console.error(`Erreur lors de la recherche de l'agence ${id}:`, err);
        res.status(500).json({ error: 'Erreur serveur' });
        return null;
    }
};

const getAllAgences = async (req, res) => {
    const currentUser = req.user;
    console.log("Action: Récupération de toutes les agences");
    try {
        const [rows] = await agenceModel.getAllAgences();
        console.log(`Agences récupérées: ${rows.length}`);

        await logAction(
            currentUser,
            "LECTURE",
            "agences",
            null,
            `Récupération de toutes les agences (${rows.length})`,
            "SUCCES"
        );

        res.status(200).json(rows);
    } catch (err) {
        console.error("Erreur lors de la récupération des agences:", err);
        await logAction(
            currentUser,
            "LECTURE",
            "agences",
            null,
            `Erreur récupération agences: ${err.message}`,
            "ECHEC"
        );
        res.status(500).json({ error: 'Erreur lors de la récupération des agences' });
    }
};

const getAgenceById = async (req, res) => {
    const currentUser = req.user;
    const { id } = req.params;
    console.log(`Action: Récupération de l'agence avec ID ${id}`);
    const agence = await findAgence(id, res);
    if (!agence) {
        await logAction(
            currentUser,
            "LECTURE",
            "agences",
            id,
            `Tentative récupération agence ID ${id} - non trouvée`,
            "ECHEC"
        );
        return;
    }

    await logAction(
        currentUser,
        "LECTURE",
        "agences",
        id,
        `Récupération agence ID ${id} - ${agence.nom}`,
        "SUCCES"
    );

    res.status(200).json(agence);
};

const createAgence = async (req, res) => {
    const currentUser = req.user;
    console.log("Action: Création d'une nouvelle agence");
    const { error } = agenceSchema.validate(req.body);
    if (error) {
        console.log("Erreur de validation:", error.details[0].message);
        await logAction(
            currentUser,
            "CREATION",
            "agences",
            null,
            `Échec création agence: ${error.details[0].message}`,
            "ECHEC"
        );
        return res.status(400).json({ error: error.details[0].message });
    }

    try {
        const [result] = await agenceModel.createAgence(req.body);
        console.log("Agence ajoutée avec succès:", req.body);

        await logAction(
            currentUser,
            "CREATION",
            "agences",
            result.insertId,
            `Agence créée: ${req.body.nom}`,
            "SUCCES"
        );

        res.status(201).json({ message: 'Agence ajoutée avec succès', id: result.insertId });
    } catch (err) {
        console.error("Erreur lors de l'ajout de l'agence:", err);
        await logAction(
            currentUser,
            "CREATION",
            "agences",
            null,
            `Erreur création agence: ${err.message}`,
            "ECHEC"
        );
        res.status(500).json({ error: 'Erreur lors de l\'ajout de l\'agence' });
    }
};

const updateAgence = async (req, res) => {
    const currentUser = req.user;
    const { id } = req.params;
    console.log(`Action: Mise à jour de l'agence avec ID ${id}`);
    const agence = await findAgence(id, res);
    if (!agence) return;

    const { error } = agenceSchema.validate(req.body);
    if (error) {
        console.log("Erreur de validation:", error.details[0].message);
        await logAction(
            currentUser,
            "MISE_A_JOUR",
            "agences",
            id,
            `Échec validation mise à jour agence ID ${id}: ${error.details[0].message}`,
            "ECHEC"
        );
        return res.status(400).json({ error: error.details[0].message });
    }

    try {
        const [result] = await agenceModel.updateAgence(req.body, id);
        console.log(`Agence avec ID ${id} mise à jour avec succès:`, req.body);

        await logAction(
            currentUser,
            "MISE_A_JOUR",
            "agences",
            id,
            `Agence ID ${id} mise à jour: ${req.body.nom}`,
            "SUCCES"
        );

        res.status(200).json({ message: 'Agence mise à jour avec succès' });
    } catch (err) {
        console.error(`Erreur lors de la mise à jour de l'agence avec ID ${id}:`, err);
        await logAction(
            currentUser,
            "MISE_A_JOUR",
            "agences",
            id,
            `Erreur mise à jour agence ID ${id}: ${err.message}`,
            "ECHEC"
        );
        res.status(500).json({ error: 'Erreur lors de la mise à jour de l\'agence' });
    }
};

const deleteAgence = async (req, res) => {
    const currentUser = req.user;
    const { id } = req.params;
    console.log(`Action: Suppression de l'agence avec ID ${id}`);
    const agence = await findAgence(id, res);
    if (!agence) return;

    try {
        await agenceModel.deleteAgence(id);
        console.log(`Agence avec ID ${id} supprimée avec succès`);

        await logAction(
            currentUser,
            "SUPPRESSION",
            "agences",
            id,
            `Agence ID ${id} supprimée`,
            "SUCCES"
        );

        res.status(200).json({ message: 'Agence supprimée avec succès' });
    } catch (err) {
        console.error(`Erreur lors de la suppression de l'agence avec ID ${id}:`, err);
        await logAction(
            currentUser,
            "SUPPRESSION",
            "agences",
            id,
            `Erreur suppression agence ID ${id}: ${err.message}`,
            "ECHEC"
        );
        res.status(500).json({ error: 'Erreur lors de la suppression de l\'agence' });
    }
};

module.exports = {
    getAllAgences,
    getAgenceById,
    createAgence,
    updateAgence,
    deleteAgence,
};
