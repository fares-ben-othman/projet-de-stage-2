const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const historiqueController = require('../controllers/historique_vehiculeController');

/**
 * @swagger
 * tags:
 *   name: HistoriqueVehicule
 *   description: API pour gérer l'historique des véhicules
 */

/**
 * @swagger
 * /historique_vehicule/get-all:
 *   get:
 *     summary: Récupérer tous les historiques de véhicules
 *     tags: [HistoriqueVehicule]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des historiques
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   vehicule_id:
 *                     type: integer
 *                   date_action:
 *                     type: string
 *                     format: date-time
 *                   type_action:
 *                     type: string
 *                   description:
 *                     type: string
 *                   utilisateur_id:
 *                     type: integer
 */
router.get('/get-all', auth, historiqueController.getAllHistoriques);

/**
 * @swagger
 * /historique_vehicule/getByVehiculeId/{vehiculeId}:
 *   get:
 *     summary: Récupérer l'historique d'un véhicule par son ID
 *     tags: [HistoriqueVehicule]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: vehiculeId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID du véhicule
 *     responses:
 *       200:
 *         description: Historique du véhicule
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   vehicule_id:
 *                     type: integer
 *                   date_action:
 *                     type: string
 *                     format: date-time
 *                   type_action:
 *                     type: string
 *                   description:
 *                     type: string
 *                   utilisateur_id:
 *                     type: integer
 *       400:
 *         description: ID du véhicule invalide
 */
router.get('/getByVehiculeId/:vehiculeId', auth, historiqueController.getHistoriqueByVehiculeId);

/**
 * @swagger
 * /historique_vehicule/create:
 *   post:
 *     summary: Ajouter un nouvel historique véhicule
 *     tags: [HistoriqueVehicule]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - vehicule_id
 *               - type_action
 *             properties:
 *               vehicule_id:
 *                 type: integer
 *               date_action:
 *                 type: string
 *                 format: date-time
 *               type_action:
 *                 type: string
 *                 enum: [maintenance, reparation, nettoyage, autre]
 *               description:
 *                 type: string
 *               utilisateur_id:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Historique créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 message:
 *                   type: string
 *       400:
 *         description: Erreur de validation des données
 */
router.post('/create', auth, historiqueController.createHistorique);

module.exports = router;
