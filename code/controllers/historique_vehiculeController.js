const HistoriqueVehicule = require('../models/historique_vehiculeModel');
const Vehicule = require('../models/vehiculeModel');
const Utilisateur = require('../models/userModel');
const Agence = require('../models/agenceModel'); 
const { historiqueVehiculeSchema } = require('../validators/historique_vehiculeValidator');
const { logAction } = require('../utils/journal');

const getAllHistoriques = async (req, res) => {
    const currentUser = req.user;
    console.log("Action: Récupération de tout l'historique des véhicules");
    try {
        const [rows] = await HistoriqueVehicule.getAll();
        console.log(`Historiques récupérés: ${rows.length}`);

        await logAction(
            currentUser,
            "LECTURE",
            "historique_vehicule",
            null,
            `Récupération de tout l'historique des véhicules (${rows.length})`,
            "SUCCES"
        );

        res.status(200).json(rows);
    } catch (error) {
        console.error('Erreur lors de la récupération de l\'historique :', error);
        await logAction(
            currentUser,
            "LECTURE",
            "historique_vehicule",
            null,
            `Erreur récupération historique : ${error.message}`,
            "ECHEC"
        );
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

const getHistoriqueByVehiculeId = async (req, res) => {
    const currentUser = req.user;
    const vehiculeId = req.params.vehiculeId;
    console.log(`Action: Récupération de l'historique pour le véhicule avec ID ${vehiculeId}`);

    try {
        const [vehicule] = await Vehicule.getVehiculeById(vehiculeId);
        if (!vehicule) {
            await logAction(
                currentUser,
                "LECTURE",
                "historique_vehicule",
                vehiculeId,
                `Tentative récupération historique véhicule ID ${vehiculeId} - non trouvé`,
                "ECHEC"
            );
            return res.status(404).json({ error: `Véhicule ID ${vehiculeId} non trouvé` });
        }

        const [rows] = await HistoriqueVehicule.getByVehiculeId(vehiculeId);
        console.log(`Historique récupéré avec succès pour le véhicule ${vehiculeId}`);

        await logAction(
            currentUser,
            "LECTURE",
            "historique_vehicule",
            vehiculeId,
            `Récupération historique véhicule ID ${vehiculeId} (${rows.length} entrées)`,
            "SUCCES"
        );

        res.status(200).json(rows);
    } catch (error) {
        console.error(`Erreur lors de la récupération de l'historique pour le véhicule ${vehiculeId} :`, error);
        await logAction(
            currentUser,
            "LECTURE",
            "historique_vehicule",
            vehiculeId,
            `Erreur récupération historique véhicule ID ${vehiculeId}: ${error.message}`,
            "ECHEC"
        );
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

const createHistorique = async (req, res) => {
    const currentUser = req.user;
    console.log("Action: Création d'un nouvel historique de véhicule");

    const { error } = historiqueVehiculeSchema.validate(req.body);
    if (error) {
        console.log("Erreur de validation:", error.details[0].message);
        await logAction(
            currentUser,
            "CREATION",
            "historique_vehicule",
            null,
            `Échec création historique : ${error.details[0].message}`,
            "ECHEC"
        );
        return res.status(400).json({ error: error.details[0].message });
    }

    const { vehicule_id, type_action, description, utilisateur_id, agence_id } = req.body;

    try {
        const [vehicule] = await Vehicule.getVehiculeById(vehicule_id);
        if (!vehicule) {
            await logAction(
                currentUser,
                "CREATION",
                "historique_vehicule",
                null,
                `Échec création historique : Véhicule ID ${vehicule_id} non trouvé`,
                "ECHEC"
            );
            return res.status(400).json({ message: `Le véhicule avec id ${vehicule_id} n'existe pas.` });
        }

        const [utilisateur] = await Utilisateur.getUserById(utilisateur_id);
        if (!utilisateur) {
            await logAction(
                currentUser,
                "CREATION",
                "historique_vehicule",
                null,
                `Échec création historique : Utilisateur ID ${utilisateur_id} non trouvé`,
                "ECHEC"
            );
            return res.status(400).json({ message: `L'utilisateur avec id ${utilisateur_id} n'existe pas.` });
        }

        if (agence_id) {
            const [agence] = await Agence.getAgenceById(agence_id);
            if (!agence) {
                await logAction(
                    currentUser,
                    "CREATION",
                    "historique_vehicule",
                    null,
                    `Échec création historique : Agence ID ${agence_id} non trouvée`,
                    "ECHEC"
                );
                return res.status(400).json({ message: `L'agence avec id ${agence_id} n'existe pas.` });
            }
        }

        const result = await HistoriqueVehicule.create({ vehicule_id, type_action, description, utilisateur_id, agence_id });
        console.log("Historique ajouté avec succès");

        await logAction(
            currentUser,
            "CREATION",
            "historique_vehicule",
            result[0].insertId,
            `Historique créé ID ${result[0].insertId} pour véhicule ID ${vehicule_id}`,
            "SUCCES"
        );

        res.status(201).json({ 
            message: 'Historique ajouté avec succès', 
            historique: {
                id: result[0].insertId,
                vehicule_id,
                type_action,
                description,
                utilisateur_id,
                agence_id
            }
        });

    } catch (error) {
        console.error('Erreur lors de la création de l\'historique :', error);
        await logAction(
            currentUser,
            "CREATION",
            "historique_vehicule",
            null,
            `Erreur création historique : ${error.message}`,
            "ECHEC"
        );
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

module.exports = {
    getAllHistoriques,
    getHistoriqueByVehiculeId,
    createHistorique
};
