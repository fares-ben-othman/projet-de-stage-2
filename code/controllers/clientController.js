const clientModel = require('../models/clientModel');
const { clientSchema } = require('../validators/clientValidator');

const findClient = async (id, res) => {
    console.log(`Action: Vérification de l'existence du client avec ID ${id}`);
    try {
        const [rows] = await clientModel.getClientById(id);
        if (rows.length === 0) {
            console.log(`Client avec ID ${id} non trouvé`);
            res.status(404).json({ error: 'Client non trouvé' });
            return null;
        }
        console.log("Client trouvé:", rows[0]);
        return rows[0];
    } catch (err) {
        console.error(`Erreur lors de la recherche du client ${id}:`, err);
        res.status(500).json({ error: 'Erreur serveur' });
        return null;
    }
};

const getAllClients = async (req, res) => {
    console.log("Action: Récupération de tous les clients");
    try {
        const [rows] = await clientModel.getAllClients();
        console.log(`Clients récupérés: ${rows.length}`);
        res.status(200).json(rows);
    } catch (err) {
        console.error("Erreur lors de la récupération des clients:", err);
        res.status(500).json({ error: 'Erreur lors de la récupération des clients' });
    }
};

const getClientById = async (req, res) => {
    const { id } = req.params;
    console.log(`Action: Récupération du client avec ID ${id}`);
    const client = await findClient(id, res);
    if (!client) return;
    res.status(200).json(client);
};

const createClient = async (req, res) => {
    console.log("Action: Création d'un nouveau client");
    const { error } = clientSchema.validate(req.body);
    if (error) {
        console.log("Erreur de validation:", error.details[0].message);
        return res.status(400).json({ error: error.details[0].message });
    }

    
    if (req.body.email) {
        const [rows] = await clientModel.getClientByEmail(req.body.email);
        if (rows.length > 0) {
            console.log(`Email ${req.body.email} déjà utilisé`);
            return res.status(400).json({ error: 'Email déjà utilisé' });
        }
    }
    
    if (req.body.cin) {
        const [rows] = await clientModel.getClientByCin(req.body.cin);
        if (rows.length > 0) {
            console.log(`CIN ${req.body.cin} déjà utilisé`);
            return res.status(400).json({ error: 'CIN déjà utilisé' });
        }
    }

    try {
        await clientModel.createClient(req.body);
        console.log("Client créé avec succès:", req.body);
        res.status(201).json({ message: 'Client créé avec succès' });
    } catch (err) {
        console.error("Erreur lors de la création du client:", err);
        res.status(500).json({ error: 'Erreur lors de la création du client' });
    }
};

const updateClient = async (req, res) => {
    const { id } = req.params;
    console.log(`Action: Mise à jour du client avec ID ${id}`);

    const client = await findClient(id, res);
    if (!client) return; // Si le client n'existe pas, on stoppe l'exécution

    const { error } = clientSchema.validate(req.body);
    if (error) {
        console.log("Erreur de validation:", error.details[0].message);
        return res.status(400).json({ error: error.details[0].message });
    }

    try {
        
        if (req.body.email) {
            const [emailRows] = await clientModel.getClientByEmail(req.body.email);
            console.log(emailRows);
            if (emailRows.length > 0 && Number(emailRows[0].id) !== Number(id)) {
                console.log(`Email ${req.body.email} déjà utilisé par un autre client`);
                return res.status(400).json({ error: 'Email déjà utilisé' });
            }
        }

        
        if (req.body.cin) {
            const [cinRows] = await clientModel.getClientByCin(req.body.cin);
            console.log(cinRows);
            if (cinRows.length > 0 && Number(cinRows[0].id) !== Number(id)) {
                console.log(`CIN ${req.body.cin} déjà utilisé par un autre client`);
                return res.status(400).json({ error: 'CIN déjà utilisé' });
            }
        }

        await clientModel.updateClient(req.body, id);
        console.log(`Client avec ID ${id} mis à jour avec succès:`, req.body);
        res.status(200).json({ message: 'Client mis à jour avec succès' });
    } catch (err) {
        console.error(`Erreur lors de la mise à jour du client avec ID ${id}:`, err);
        res.status(500).json({ error: 'Erreur lors de la mise à jour du client' });
    }
};


const deleteClient = async (req, res) => {
    const { id } = req.params;
    console.log(`Action: Suppression du client avec ID ${id}`);

    const client = await findClient(id, res);
    if (!client) return;

    try {
        await clientModel.deleteClient(id);
        console.log(`Client avec ID ${id} supprimé avec succès`);
        res.status(200).json({ message: 'Client supprimé avec succès' });
    } catch (err) {
        console.error(`Erreur lors de la suppression du client avec ID ${id}:`, err);
        res.status(500).json({ error: 'Erreur lors de la suppression du client' });
    }
};

module.exports = {
    getAllClients,
    getClientById,
    createClient,
    updateClient,
    deleteClient
};
