const clientModel = require('../models/clientModel');
const { clientSchema } = require('../validators/clientValidator');
const { logAction } = require('../utils/journal');

const findClient = async (numero_permis, res) => {
    console.log(`Action: Vérification de l'existence du client avec numéro de permis ${numero_permis}`);
    try {
        const [rows] = await clientModel.getClientByNumeroPermis(numero_permis);
        if (rows.length === 0) {
            console.log(`Client avec numéro de permis ${numero_permis} non trouvé`);
            res.status(404).json({ error: 'Client non trouvé' });
            return null;
        }
        console.log("Client trouvé:", rows[0]);
        return rows[0];
    } catch (err) {
        console.error(`Erreur lors de la recherche du client ${numero_permis}:`, err);
        res.status(500).json({ error: 'Erreur serveur' });
        return null;
    }
};

const getAllClients = async (req, res) => {
    const currentUser = req.user;
    console.log("Action: Récupération de tous les clients");
    try {
        const [rows] = await clientModel.getAllClients();
        console.log(`Clients récupérés: ${rows.length}`);

        await logAction(
            currentUser,
            "LECTURE",
            "clients",
            null,
            `Récupération de tous les clients (${rows.length})`,
            "SUCCES"
        );

        res.status(200).json(rows);
    } catch (err) {
        console.error("Erreur lors de la récupération des clients:", err);
        await logAction(
            currentUser,
            "LECTURE",
            "clients",
            null,
            `Erreur récupération clients: ${err.message}`,
            "ECHEC"
        );
        res.status(500).json({ error: 'Erreur lors de la récupération des clients' });
    }
};

const getClientByNumeroPermis = async (req, res) => {
    const currentUser = req.user;
    const { numero_permis } = req.params;
    console.log(`Action: Récupération du client avec numéro de permis ${numero_permis}`);
    const client = await findClient(numero_permis, res);
    if (!client) {
        await logAction(
            currentUser,
            "LECTURE",
            "clients",
            numero_permis,
            `Tentative récupération client numéro de permis ${numero_permis} - non trouvé`,
            "ECHEC"
        );
        return;
    }

    await logAction(
        currentUser,
        "LECTURE",
        "clients",
        numero_permis,
        `Récupération client numéro de permis ${numero_permis} - ${client.nom}`,
        "SUCCES"
    );

    res.status(200).json(client);
};

const createClient = async (req, res) => {
    const currentUser = req.user;
    console.log("Action: Création d'un nouveau client");
    const { error } = clientSchema.validate(req.body);
    if (error) {
        console.log("Erreur de validation:", error.details[0].message);
        await logAction(
            currentUser,
            "CREATION",
            "clients",
            null,
            `Échec création client: ${error.details[0].message}`,
            "ECHEC"
        );
        return res.status(400).json({ error: error.details[0].message });
    }

    try {
        if (req.body.email) {
            const [rows] = await clientModel.getClientByEmail(req.body.email);
            if (rows.length > 0) {
                await logAction(
                    currentUser,
                    "CREATION",
                    "clients",
                    null,
                    `Échec création client: email déjà utilisé (${req.body.email})`,
                    "ECHEC"
                );
                return res.status(400).json({ error: 'Email déjà utilisé' });
            }
        }

        if (req.body.cin) {
            const [rows] = await clientModel.getClientByCin(req.body.cin);
            if (rows.length > 0) {
                await logAction(
                    currentUser,
                    "CREATION",
                    "clients",
                    null,
                    `Échec création client: CIN déjà utilisé (${req.body.cin})`,
                    "ECHEC"
                );
                return res.status(400).json({ error: 'CIN déjà utilisé' });
            }
        }

        const [result] = await clientModel.createClient(req.body);
        console.log("Client créé avec succès:", req.body);

        await logAction(
            currentUser,
            "CREATION",
            "clients",
            req.body.numero_permis,
            `Client créé: ${req.body.nom,req.body.cin,req.body.email}`,
            "SUCCES"
        );

        res.status(201).json({ message: 'Client créé avec succès', numero_permis: req.body.numero_permis });
    } catch (err) {
        console.error("Erreur lors de la création du client:", err);
        await logAction(
            currentUser,
            "CREATION",
            "clients",
            null,
            `Erreur création client: ${err.message}`,
            "ECHEC"
        );
        res.status(500).json({ error: 'Erreur lors de la création du client' });
    }
};

const updateClient = async (req, res) => {
    const currentUser = req.user;
    const { numero_permis } = req.params;
    console.log(`Action: Mise à jour du client avec numéro de permis ${numero_permis}`);

    const client = await findClient(numero_permis, res);
    if (!client) return;

    const { error } = clientSchema.validate(req.body);
    if (error) {
        console.log("Erreur de validation:", error.details[0].message);
        await logAction(
            currentUser,
            "MISE_A_JOUR",
            "clients",
            numero_permis,
            `Échec validation mise à jour client numéro de permis ${numero_permis}: ${error.details[0].message}`,
            "ECHEC"
        );
        return res.status(400).json({ error: error.details[0].message });
    }

    try {
        if (req.body.email) {
            const [emailRows] = await clientModel.getClientByEmail(req.body.email);
            if (emailRows.length > 0 && emailRows[0].numero_permis !== numero_permis) {
                await logAction(
                    currentUser,
                    "MISE_A_JOUR",
                    "clients",
                    numero_permis,
                    `Échec mise à jour client: email déjà utilisé (${req.body.email})`,
                    "ECHEC"
                );
                return res.status(400).json({ error: 'Email déjà utilisé' });
            }
        }

        if (req.body.cin) {
            const [cinRows] = await clientModel.getClientByCin(req.body.cin);
            if (cinRows.length > 0 && cinRows[0].numero_permis !== numero_permis) {
                await logAction(
                    currentUser,
                    "MISE_A_JOUR",
                    "clients",
                    numero_permis,
                    `Échec mise à jour client: CIN déjà utilisé (${req.body.cin})`,
                    "ECHEC"
                );
                return res.status(400).json({ error: 'CIN déjà utilisé' });
            }
        }

        const [result] = await clientModel.updateClient(req.body, numero_permis);
        console.log(`Client avec numéro de permis ${numero_permis} mis à jour avec succès:`, req.body);

        await logAction(
            currentUser,
            "MISE_A_JOUR",
            "clients",
            numero_permis,
            `Client avec numéro de permis ${numero_permis} mis à jour`,
            "SUCCES"
        );

        res.status(200).json({ message: 'Client mis à jour avec succès' });
    } catch (err) {
        console.error(`Erreur lors de la mise à jour du client avec numéro de permis ${numero_permis}:`, err);
        await logAction(
            currentUser,
            "MISE_A_JOUR",
            "clients",
            numero_permis,
            `Erreur mise à jour client numéro de permis ${numero_permis}: ${err.message}`,
            "ECHEC"
        );
        res.status(500).json({ error: 'Erreur lors de la mise à jour du client' });
    }
};

// gestion de roles que ce soit admin ou bien chef agence
const deleteClient = async (req, res) => {
    const currentUser = req.user;
    const { numero_permis } = req.params;
    console.log(`Action: Suppression du client avec numéro de permis ${numero_permis}`);

    const client = await findClient(numero_permis, res);
    if (!client) return;

    try {
        await clientModel.deleteClient(numero_permis);
        console.log(`Client avec numéro de permis ${numero_permis} supprimé avec succès`);

        await logAction(
            currentUser,
            "SUPPRESSION",
            "clients",
            numero_permis,
            `Client numéro de permis ${numero_permis} supprimé`,
            "SUCCES"
        );

        res.status(200).json({ message: 'Client supprimé avec succès' });
    } catch (err) {
        console.error(`Erreur lors de la suppression du client avec numéro de permis ${numero_permis}:`, err);
        await logAction(
            currentUser,
            "SUPPRESSION",
            "clients",
            numero_permis,
            `Erreur suppression client numéro de permis ${numero_permis}: ${err.message}`,
            "ECHEC"
        );
        res.status(500).json({ error: 'Erreur lors de la suppression du client' });
    }
};

module.exports = {
    getAllClients,
    getClientByNumeroPermis,
    createClient,
    updateClient,
    deleteClient
};
