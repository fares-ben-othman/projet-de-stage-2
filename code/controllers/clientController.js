const clientModel = require('../models/clientModel');
const { clientSchema } = require('../validators/clientValidator');

const getAllClients = async (req, res) => {
    try {
        const [rows] = await clientModel.getAllClients();
        res.status(200).json(rows);
    } catch (err) {
        res.status(500).json({ error: 'Erreur lors de la récupération des clients' });
    }
};

const getClientById = async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await clientModel.getClientById(id);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Client non trouvé' });
        }
        res.status(200).json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: 'Erreur lors de la récupération du client' });
    }
};

const createClient = async (req, res) => {
    const { error } = clientSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }

    try {
        await clientModel.createClient(req.body);
        res.status(201).json({ message: 'Client créé avec succès' });
    } catch (err) {
        res.status(500).json({ error: 'Erreur lors de la création du client' });
    }
};

const updateClient = async (req, res) => {
    const { id } = req.params;

    const { error } = clientSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }

    try {
        await clientModel.updateClient(req.body, id);
        res.status(200).json({ message: 'Client mis à jour avec succès' });
    } catch (err) {
        res.status(500).json({ error: 'Erreur lors de la mise à jour du client' });
    }
};

const deleteClient = async (req, res) => {
    const { id } = req.params;
    try {
        await clientModel.removeClient(id);
        res.status(200).json({ message: 'Client supprimé avec succès' });
    } catch (err) {
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
