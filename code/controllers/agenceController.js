const agenceModel = require('../models/agenceModel');

const getAllAgences = async (req, res) => {
    try {
        const [rows] = await agenceModel.getAllAgences();
        res.status(200).json(rows);
    } catch (err) {
        res.status(500).json({ error: 'Erreur lors de la récupération des agences' });
    }
};

const getAgenceById = async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await agenceModel.getAgenceById(id);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Agence non trouvé' });
        }
        res.status(200).json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: 'Erreur lors de la récupération de l\'agence' });
    }
};

const createAgence = async (req, res) => {
    try {
        await agenceModel.createAgence(req.body);
        res.status(201).json({ message: 'Agence ajouté avec succès' });
    } catch (err) {
        res.status(500).json({ error: 'Erreur lors de l\'ajout de l\'agence' });
    }
};

const updateAgence = async (req, res) => {
    const { id } = req.params;
    try {
        await agenceModel.updateAgence(req.body, id);
        res.status(200).json({ message: 'Agence mis à jour avec succès' });
    } catch (err) {
        res.status(500).json({ error: 'Erreur lors de la mise à jour de l\'agence ' });
    }
};

const removeAgence = async (req, res) => {
    const { id } = req.params;
    try {
        await agenceModel.removeAgence(id);
        res.status(200).json({ message: 'Agence supprimé avec succès' });
    } catch (err) {
        res.status(500).json({ error: 'Erreur lors de la suppression de l\'agence' });
    }
};

module.exports = {
    getAllAgences,
    getAgenceById,
    createAgence,
    updateAgence,
    removeAgence,
};