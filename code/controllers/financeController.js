const financeModel = require('../models/financeModel');
const { financeSchema } = require('../validators/financeValidator');
const vehiculeModel = require("../models/vehiculeModel");
const agenceModel = require("../models/agenceModel");
const { logAction } = require('../utils/journal');

const findFinance = async (id, res) => {
    console.log(`Action: Vérification de l'existence de l'enregistrement finance avec ID ${id}`);
    try {
        const [rows] = await financeModel.getFinanceById(id);
        if (rows.length === 0) {
            console.log(`Finance avec ID ${id} non trouvé`);
            res.status(404).json({ error: 'Finance non trouvé' });
            return null;
        }
        console.log(`Finance trouvé:`, rows[0]);
        return rows[0];
    } catch (err) {
        console.error(`Erreur lors de la recherche du finance ${id}:`, err);
        res.status(500).json({ error: 'Erreur serveur' });
        return null;
    }
};

const getAllFinances = async (req, res) => {
    const currentUser = req.user;
    console.log("Action: Récupération de toutes les finances");
    try {
        const [rows] = await financeModel.getAllFinances();
        console.log(`Finances récupérées: ${rows.length}`);

        await logAction(
            currentUser,
            "LECTURE",
            "finances",
            null,
            `Récupération de toutes les finances (${rows.length})`,
            "SUCCES"
        );

        res.status(200).json(rows);
    } catch (err) {
        console.error("Erreur lors de la récupération des finances:", err);
        await logAction(
            currentUser,
            "LECTURE",
            "finances",
            null,
            `Erreur récupération finances: ${err.message}`,
            "ECHEC"
        );
        res.status(500).json({ error: 'Erreur lors de la récupération des finances' });
    }
};

const getFinanceById = async (req, res) => {
    const currentUser = req.user;
    const { id } = req.params;
    console.log(`Action: Récupération de l'enregistrement finance avec ID ${id}`);
    const finance = await findFinance(id, res);
    if (!finance) {
        await logAction(
            currentUser,
            "LECTURE",
            "finances",
            id,
            `Tentative récupération finance ID ${id} - non trouvé`,
            "ECHEC"
        );
        return;
    }

    await logAction(
        currentUser,
        "LECTURE",
        "finances",
        id,
        `Récupération finance ID ${id}`,
        "SUCCES"
    );

    res.status(200).json(finance);
};

const createFinance = async (req, res) => {
    const currentUser = req.user;
    console.log("Action: Création d'un nouvel enregistrement finance");

    
    const { error } = financeSchema.validate(req.body);
    if (error) {
        console.log("Erreur de validation:", error.details[0].message);
        await logAction(
            currentUser,
            "CREATION",
            "finances",
            null,
            `Échec création finance: ${error.details[0].message}`,
            "ECHEC"
        );
        return res.status(400).json({ error: error.details[0].message });
    }

    try {
        const { vehicule_id, agence_id } = req.body;

        
        const [vehicule] = await vehiculeModel.getVehiculeById(vehicule_id);
        if (!vehicule || vehicule.length === 0) {
            console.log(`Véhicule ID ${vehicule_id} introuvable`);
            await logAction(
                currentUser,
                "CREATION",
                "finances",
                null,
                `Échec création finance: véhicule ID ${vehicule_id} inexistant`,
                "ECHEC"
            );
            return res.status(404).json({ error: `Véhicule ID ${vehicule_id} introuvable` });
        }

        
        const [agence] = await agenceModel.getAgenceById(agence_id);
        if (!agence || agence.length === 0) {
            console.log(`Agence ID ${agence_id} introuvable`);
            await logAction(
                currentUser,
                "CREATION",
                "finances",
                null,
                `Échec création finance: agence ID ${agence_id} inexistante`,
                "ECHEC"
            );
            return res.status(404).json({ error: `Agence ID ${agence_id} introuvable` });
        }

        
        const [result] = await financeModel.createFinance(req.body);
        console.log("Finance ajouté avec succès:", req.body);

        await logAction(
            currentUser,
            "CREATION",
            "finances",
            result.insertId,
            `Finance créé ID ${result.insertId} (Véhicule: ${vehicule_id}, Agence: ${agence_id})`,
            "SUCCES"
        );

        res.status(201).json({ message: "Finance ajouté avec succès", id: result.insertId });
    } catch (err) {
        console.error("Erreur lors de l'ajout du finance:", err);
        await logAction(
            currentUser,
            "CREATION",
            "finances",
            null,
            `Erreur création finance: ${err.message}`,
            "ECHEC"
        );
        res.status(500).json({ error: "Erreur lors de l'ajout du finance" });
    }
};

const updateFinance = async (req, res) => {
    const currentUser = req.user;
    const { id } = req.params;
    console.log(`Action: Mise à jour de l'enregistrement finance avec ID ${id}`);

    
    const finance = await findFinance(id, res);
    if (!finance) return;

    
    const { error } = financeSchema.validate(req.body);
    if (error) {
        console.log("Erreur de validation:", error.details[0].message);
        await logAction(
            currentUser,
            "MISE_A_JOUR",
            "finances",
            id,
            `Échec validation mise à jour finance ID ${id}: ${error.details[0].message}`,
            "ECHEC"
        );
        return res.status(400).json({ error: error.details[0].message });
    }

    try {
        const { vehicule_id, agence_id } = req.body;

        
        const [vehicule] = await vehiculeModel.getVehiculeById(vehicule_id);
        if (!vehicule || vehicule.length === 0) {
            console.log(`Véhicule ID ${vehicule_id} introuvable`);
            await logAction(
                currentUser,
                "MISE_A_JOUR",
                "finances",
                id,
                `Échec mise à jour finance: véhicule ID ${vehicule_id} inexistant`,
                "ECHEC"
            );
            return res.status(404).json({ error: `Véhicule ID ${vehicule_id} introuvable` });
        }

        
        const [agence] = await agenceModel.getAgenceById(agence_id);
        if (!agence || agence.length === 0) {
            console.log(`Agence ID ${agence_id} introuvable`);
            await logAction(
                currentUser,
                "MISE_A_JOUR",
                "finances",
                id,
                `Échec mise à jour finance: agence ID ${agence_id} inexistante`,
                "ECHEC"
            );
            return res.status(404).json({ error: `Agence ID ${agence_id} introuvable` });
        }

        
        await financeModel.updateFinance(req.body, id);
        console.log(`Finance avec ID ${id} mis à jour avec succès:`, req.body);

        await logAction(
            currentUser,
            "MISE_A_JOUR",
            "finances",
            id,
            `Finance ID ${id} mis à jour (Véhicule: ${vehicule_id}, Agence: ${agence_id})`,
            "SUCCES"
        );

        res.status(200).json({ message: "Finance mis à jour avec succès" });
    } catch (err) {
        console.error(`Erreur lors de la mise à jour du finance avec ID ${id}:`, err);
        await logAction(
            currentUser,
            "MISE_A_JOUR",
            "finances",
            id,
            `Erreur mise à jour finance ID ${id}: ${err.message}`,
            "ECHEC"
        );
        res.status(500).json({ error: "Erreur lors de la mise à jour du finance" });
    }
};



const deleteFinance = async (req, res) => {
    const currentUser = req.user;
    const { id } = req.params;
    console.log(`Action: Suppression de l'enregistrement finance avec ID ${id}`);
    const finance = await findFinance(id, res);
    if (!finance) return;

    try {
        await financeModel.deleteFinance(id);
        console.log(`Finance avec ID ${id} supprimé avec succès`);

        await logAction(
            currentUser,
            "SUPPRESSION",
            "finances",
            id,
            `Finance ID ${id} supprimé`,
            "SUCCES"
        );

        res.status(200).json({ message: 'Finance supprimé avec succès' });
    } catch (err) {
        console.error(`Erreur lors de la suppression du finance avec ID ${id}:`, err);
        await logAction(
            currentUser,
            "SUPPRESSION",
            "finances",
            id,
            `Erreur suppression finance ID ${id}: ${err.message}`,
            "ECHEC"
        );
        res.status(500).json({ error: 'Erreur lors de la suppression du finance' });
    }
};

module.exports = {
    getAllFinances,
    getFinanceById,
    createFinance,
    updateFinance,
    deleteFinance,
};
