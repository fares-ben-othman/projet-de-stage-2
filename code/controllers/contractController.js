const contractModel = require('../models/contractModel');
const { contractSchema } = require('../validators/contractValidator');
const { logAction } = require('../utils/journal');

const findContract = async (id, res) => {
    console.log(`Action: Vérification de l'existence du contrat ${id}`);
    try {
        const [rows] = await contractModel.getContractById(id);
        if (rows.length === 0) {
            console.log(`Contrat ${id} non trouvé`);
            res.status(404).json({ error: 'Contrat non trouvé' });
            return null;
        }
        console.log("Contrat trouvé:", rows[0]);
        return rows[0];
    } catch (err) {
        console.error(`Erreur lors de la recherche du contrat ${id}:`, err);
        res.status(500).json({ error: 'Erreur serveur' });
        return null;
    }
};

const getAllContracts = async (req, res) => {
    const currentUser = req.user;
    console.log("Action: Récupération de tous les contrats");
    try {
        const [rows] = await contractModel.getAllContracts();
        console.log(`Contrats récupérés: ${rows.length}`);

        await logAction(
            currentUser,
            "LECTURE",
            "contrats",
            null,
            `Récupération de tous les contrats (${rows.length})`,
            "SUCCES"
        );

        res.status(200).json(rows);
    } catch (err) {
        console.error("Erreur lors de la récupération des contrats:", err);
        await logAction(
            currentUser,
            "LECTURE",
            "contrats",
            null,
            `Erreur récupération contrats: ${err.message}`,
            "ECHEC"
        );
        res.status(500).json({ error: 'Erreur lors de la récupération des contrats' });
    }
};

const getContractById = async (req, res) => {
    const currentUser = req.user;
    const { id } = req.params;
    console.log(`Action: Récupération du contrat ${id}`);
    const contract = await findContract(id, res);
    if (!contract) {
        await logAction(
            currentUser,
            "LECTURE",
            "contrats",
            id,
            `Tentative récupération contrat ${id} - non trouvé`,
            "ECHEC"
        );
        return;
    }

    await logAction(
        currentUser,
        "LECTURE",
        "contrats",
        id,
        `Récupération contrat ${id}`,
        "SUCCES"
    );

    res.status(200).json(contract);
};

const createContract = async (req, res) => {
    const currentUser = req.user;
    console.log("Action: Création d'un nouveau contrat");
    const { error } = contractSchema.validate(req.body);
    if (error) {
        console.log("Erreur de validation:", error.details[0].message);
        await logAction(
            currentUser,
            "CREATION",
            "contrats",
            null,
            `Échec création contrat: ${error.details[0].message}`,
            "ECHEC"
        );
        return res.status(400).json({ error: error.details[0].message });
    }

    try {
        const [result] = await contractModel.createContract(req.body);
        console.log("Contrat créé avec succès:", req.body);

        await logAction(
            currentUser,
            "CREATION",
            "contrats",
            result.insertId,
            `Contrat créé: ID ${result.insertId}`,
            "SUCCES"
        );

        res.status(201).json({ message: 'Contrat créé avec succès', id: result.insertId });
    } catch (err) {
        console.error("Erreur lors de la création du contrat:", err);
        await logAction(
            currentUser,
            "CREATION",
            "contrats",
            null,
            `Erreur création contrat: ${err.message}`,
            "ECHEC"
        );
        res.status(500).json({ error: 'Erreur lors de la création du contrat' });
    }
};

const updateContract = async (req, res) => {
    const currentUser = req.user;
    const { id } = req.params;
    console.log(`Action: Mise à jour du contrat ${id}`);

    const contract = await findContract(id, res);
    if (!contract) return;

    const { error } = contractSchema.validate(req.body);
    if (error) {
        console.log("Erreur de validation:", error.details[0].message);
        await logAction(
            currentUser,
            "MISE_A_JOUR",
            "contrats",
            id,
            `Échec validation mise à jour contrat ${id}: ${error.details[0].message}`,
            "ECHEC"
        );
        return res.status(400).json({ error: error.details[0].message });
    }

    try {
        const [result] = await contractModel.updateContract(req.body, id);
        console.log(`Contrat ${id} mis à jour avec succès:`, req.body);

        await logAction(
            currentUser,
            "MISE_A_JOUR",
            "contrats",
            id,
            `Contrat ${id} mis à jour`,
            "SUCCES"
        );

        res.status(200).json({ message: 'Contrat mis à jour avec succès' });
    } catch (err) {
        console.error(`Erreur lors de la mise à jour du contrat ${id}:`, err);
        await logAction(
            currentUser,
            "MISE_A_JOUR",
            "contrats",
            id,
            `Erreur mise à jour contrat ${id}: ${err.message}`,
            "ECHEC"
        );
        res.status(500).json({ error: 'Erreur lors de la mise à jour du contrat' });
    }
};
// gestion de roles que ce soit admin ou bien chef agence
const deleteContract = async (req, res) => {
    const currentUser = req.user;
    const { id } = req.params;
    console.log(`Action: Suppression du contrat ${id}`);

    const contract = await findContract(id, res);
    if (!contract) return;

    try {
        await contractModel.deleteContract(id);
        console.log(`Contrat ${id} supprimé avec succès`);

        await logAction(
            currentUser,
            "SUPPRESSION",
            "contrats",
            id,
            `Contrat ${id} supprimé`,
            "SUCCES"
        );

        res.status(200).json({ message: 'Contrat supprimé avec succès' });
    } catch (err) {
        console.error(`Erreur lors de la suppression du contrat ${id}:`, err);
        await logAction(
            currentUser,
            "SUPPRESSION",
            "contrats",
            id,
            `Erreur suppression contrat ${id}: ${err.message}`,
            "ECHEC"
        );
        res.status(500).json({ error: 'Erreur lors de la suppression du contrat' });
    }
};

module.exports = {
    getAllContracts,
    getContractById,
    createContract,
    updateContract,
    deleteContract
};
