const interventionModel = require('../models/interventionModel');
const Vehicule = require('../models/vehiculeModel');
const Agence = require('../models/agenceModel');
const { interventionSchema } = require('../validators/interventionValidator');
const { logAction } = require('../utils/journal');

const findIntervention = async (id, res) => {
    console.log(`Action: Vérification de l'existence de l'intervention avec ID ${id}`);
    try {
        const [rows] = await interventionModel.getInterventionById(id);
        if (rows.length === 0) {
            console.log(`Intervention avec ID ${id} non trouvée`);
            res.status(404).json({ error: 'Intervention non trouvée' });
            return null;
        }
        console.log("Intervention trouvée:", rows[0]);
        return rows[0];
    } catch (err) {
        console.error(`Erreur lors de la recherche de l'intervention ${id}:`, err);
        res.status(500).json({ error: 'Erreur serveur' });
        return null;
    }
};

const getAllInterventions = async (req, res) => {
    const currentUser = req.user;
    console.log("Action: Récupération de toutes les interventions");
    try {
        const [rows] = await interventionModel.getAllInterventions();
        console.log(`Interventions récupérées: ${rows.length}`);

        await logAction(
            currentUser,
            "LECTURE",
            "interventions",
            null,
            `Récupération de toutes les interventions (${rows.length})`,
            "SUCCES"
        );

        res.status(200).json(rows);
    } catch (err) {
        console.error("Erreur lors de la récupération des interventions:", err);
        await logAction(
            currentUser,
            "LECTURE",
            "interventions",
            null,
            `Erreur récupération interventions: ${err.message}`,
            "ECHEC"
        );
        res.status(500).json({ error: "Erreur serveur" });
    }
};

const getInterventionById = async (req, res) => {
    const currentUser = req.user;
    const { id } = req.params;
    console.log(`Action: Récupération de l'intervention avec ID ${id}`);
    const intervention = await findIntervention(id, res);
    if (!intervention) {
        await logAction(
            currentUser,
            "LECTURE",
            "interventions",
            id,
            `Tentative récupération intervention ID ${id} - non trouvée`,
            "ECHEC"
        );
        return;
    }

    await logAction(
        currentUser,
        "LECTURE",
        "interventions",
        id,
        `Récupération intervention ID ${id}`,
        "SUCCES"
    );

    res.status(200).json(intervention);
};

const createIntervention = async (req, res) => {
    const currentUser = req.user;
    console.log("Action: Création d'une nouvelle intervention");
    const { error } = interventionSchema.validate(req.body);
    if (error) {
        console.log("Erreur de validation:", error.details[0].message);
        await logAction(
            currentUser,
            "CREATION",
            "interventions",
            null,
            `Échec création intervention: ${error.details[0].message}`,
            "ECHEC"
        );
        return res.status(400).json({ error: error.details[0].message });
    }

    const { vehicule_id, agence_id } = req.body;

    try {
        
        const [vehiculeRows] = await Vehicule.getVehiculeById(vehicule_id);
        if (vehiculeRows.length === 0) {
            await logAction(
                currentUser,
                "CREATION",
                "interventions",
                null,
                `Échec création intervention: Véhicule ID ${vehicule_id} non trouvé`,
                "ECHEC"
            );
            return res.status(400).json({ error: `Véhicule avec ID ${vehicule_id} non trouvé` });
        }

        
        const [agenceRows] = await Agence.getAgenceById(agence_id);
        if (agenceRows.length === 0) {
            await logAction(
                currentUser,
                "CREATION",
                "interventions",
                null,
                `Échec création intervention: Agence ID ${agence_id} non trouvée`,
                "ECHEC"
            );
            return res.status(400).json({ error: `Agence avec ID ${agence_id} non trouvée` });
        }

        const [result] = await interventionModel.createIntervention(req.body);
        console.log("Intervention créée avec succès, ID:", result.insertId);

        await logAction(
            currentUser,
            "CREATION",
            "interventions",
            result.insertId,
            `Intervention créée ID ${result.insertId}`,
            "SUCCES"
        );

        res.status(201).json({ message: "Intervention créée avec succès", id: result.insertId });
    } catch (err) {
        console.error("Erreur lors de la création de l'intervention:", err);
        await logAction(
            currentUser,
            "CREATION",
            "interventions",
            null,
            `Erreur création intervention: ${err.message}`,
            "ECHEC"
        );
        res.status(500).json({ error: "Erreur serveur" });
    }
};

const updateIntervention = async (req, res) => {
    const currentUser = req.user;
    const { id } = req.params;
    console.log(`Action: Mise à jour de l'intervention avec ID ${id}`);
    const intervention = await findIntervention(id, res);
    if (!intervention) return;

    const { error } = interventionSchema.validate(req.body);
    if (error) {
        console.log("Erreur de validation:", error.details[0].message);
        await logAction(
            currentUser,
            "MISE_A_JOUR",
            "interventions",
            id,
            `Échec validation mise à jour intervention ID ${id}: ${error.details[0].message}`,
            "ECHEC"
        );
        return res.status(400).json({ error: error.details[0].message });
    }

    const { vehicule_id, agence_id } = req.body;

    try {
        // Vérifier l'existence du véhicule
        const [vehiculeRows] = await Vehicule.getVehiculeById(vehicule_id);
        if (vehiculeRows.length === 0) {
            await logAction(
                currentUser,
                "MISE_A_JOUR",
                "interventions",
                id,
                `Échec mise à jour intervention: Véhicule ID ${vehicule_id} non trouvé`,
                "ECHEC"
            );
            return res.status(400).json({ error: `Véhicule avec ID ${vehicule_id} non trouvé` });
        }

        
        const [agenceRows] = await Agence.getAgenceById(agence_id);
        if (agenceRows.length === 0) {
            await logAction(
                currentUser,
                "MISE_A_JOUR",
                "interventions",
                id,
                `Échec mise à jour intervention: Agence ID ${agence_id} non trouvée`,
                "ECHEC"
            );
            return res.status(400).json({ error: `Agence avec ID ${agence_id} non trouvée` });
        }

        await interventionModel.updateIntervention(req.body, id);
        console.log(`Intervention avec ID ${id} mise à jour avec succès`);

        await logAction(
            currentUser,
            "MISE_A_JOUR",
            "interventions",
            id,
            `Intervention ID ${id} mise à jour`,
            "SUCCES"
        );

        res.status(200).json({ message: "Intervention mise à jour avec succès" });
    } catch (err) {
        console.error(`Erreur lors de la mise à jour de l'intervention avec ID ${id}:`, err);
        await logAction(
            currentUser,
            "MISE_A_JOUR",
            "interventions",
            id,
            `Erreur mise à jour intervention ID ${id}: ${err.message}`,
            "ECHEC"
        );
        res.status(500).json({ error: "Erreur serveur" });
    }
};

const deleteIntervention = async (req, res) => {
    const currentUser = req.user;
    const { id } = req.params;
    console.log(`Action: Suppression de l'intervention avec ID ${id}`);
    const intervention = await findIntervention(id, res);
    if (!intervention) return;

    try {
        await interventionModel.deleteIntervention(id);
        console.log(`Intervention avec ID ${id} supprimée avec succès`);

        await logAction(
            currentUser,
            "SUPPRESSION",
            "interventions",
            id,
            `Intervention ID ${id} supprimée`,
            "SUCCES"
        );

        res.status(200).json({ message: "Intervention supprimée avec succès" });
    } catch (err) {
        console.error(`Erreur lors de la suppression de l'intervention avec ID ${id}:`, err);
        await logAction(
            currentUser,
            "SUPPRESSION",
            "interventions",
            id,
            `Erreur suppression intervention ID ${id}: ${err.message}`,
            "ECHEC"
        );
        res.status(500).json({ error: "Erreur serveur" });
    }
};

module.exports = {
    getAllInterventions,
    getInterventionById,
    createIntervention,
    updateIntervention,
    deleteIntervention
};
