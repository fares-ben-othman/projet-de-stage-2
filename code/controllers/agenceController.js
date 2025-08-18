const agenceModel = require('../models/agenceModel');
const { agenceSchema } = require('../validators/agenceValidator');


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
    console.log("Action: Récupération de toutes les agences");
    try {
        const [rows] = await agenceModel.getAllAgences();
        console.log(`Agences récupérées: ${rows.length}`);
        res.status(200).json(rows);
    } catch (err) {
        console.error("Erreur lors de la récupération des agences:", err);
        res.status(500).json({ error: 'Erreur lors de la récupération des agences' });
    }
};

const getAgenceById = async (req, res) => {
    const { id } = req.params;
    console.log(`Action: Récupération de l'agence avec ID ${id}`);
    const agence = await findAgenceOr404(id, res);
    if (!agence) return;
    res.status(200).json(agence);
};

const createAgence = async (req, res) => {
    console.log("Action: Création d'une nouvelle agence");
    const { error } = agenceSchema.validate(req.body);
    if (error) {
        console.log("Erreur de validation:", error.details[0].message);
        return res.status(400).json({ error: error.details[0].message });
    }

    try {
        await agenceModel.createAgence(req.body);
        console.log("Agence ajoutée avec succès:", req.body);
        res.status(201).json({ message: 'Agence ajoutée avec succès' });
    } catch (err) {
        console.error("Erreur lors de l'ajout de l'agence:", err);
        res.status(500).json({ error: 'Erreur lors de l\'ajout de l\'agence' });
    }
};

const updateAgence = async (req, res) => {
    const { id } = req.params;
    console.log(`Action: Mise à jour de l'agence avec ID ${id}`);
    const agence = await findAgence(id, res);
    if (!agence) return;

    const { error } = agenceSchema.validate(req.body);
    if (error) {
        console.log("Erreur de validation:", error.details[0].message);
        return res.status(400).json({ error: error.details[0].message });
    }

    try {
        await agenceModel.updateAgence(req.body, id);
        console.log(`Agence avec ID ${id} mise à jour avec succès:`, req.body);
        res.status(200).json({ message: 'Agence mise à jour avec succès' });
    } catch (err) {
        console.error(`Erreur lors de la mise à jour de l'agence avec ID ${id}:`, err);
        res.status(500).json({ error: 'Erreur lors de la mise à jour de l\'agence' });
    }
};

const deleteAgence = async (req, res) => {
    const { id } = req.params;
    console.log(`Action: Suppression de l'agence avec ID ${id}`);
    const agence = await findAgence(id, res);
    if (!agence) return;

    try {
        await agenceModel.deleteAgence(id);
        console.log(`Agence avec ID ${id} supprimée avec succès`);
        res.status(200).json({ message: 'Agence supprimée avec succès' });
    } catch (err) {
        console.error(`Erreur lors de la suppression de l'agence avec ID ${id}:`, err);
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
