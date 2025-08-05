const express = require('express');
const router = express.Router();

const interventionController = require('../controllers/interventionController');

/**
 * @swagger
 * tags:
 *   name: Interventions
 *   description: API pour gérer les interventions véhicules
 */

/**
 * @swagger
 * /interventions/get-all:
 *   get:
 *     tags: [Interventions]
 *     summary: Récupérer toutes les interventions
 *     responses:
 *       200:
 *         description: Liste des interventions
 */
router.get('/get-all', interventionController.getAllInterventions);

/**
 * @swagger
 * /interventions/getById/{id}:
 *   get:
 *     tags: [Interventions]
 *     summary: Récupérer une intervention par ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Une intervention
 *       404:
 *         description: Intervention non trouvée
 */
router.get('/getById/:id', interventionController.getInterventionById);

/**
 * @swagger
 * /interventions/create:
 *   post:
 *     tags: [Interventions]
 *     summary: Ajouter une nouvelle intervention
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - vehicule_id
 *               - type
 *               - date_intervention
 *               - agence_id
 *             properties:
 *               vehicule_id:
 *                 type: integer
 *               type:
 *                 type: string
 *                 enum: [maintenance, reparation, nettoyage]
 *               date_intervention:
 *                 type: string
 *                 format: date
 *               agence_id:
 *                 type: integer
 *               prestataire:
 *                 type: string
 *               cout:
 *                 type: number
 *                 format: float
 *               commentaire:
 *                 type: string
 *               facture_pdf:
 *                 type: string
 *     responses:
 *       201:
 *         description: Intervention créée
 *       400:
 *         description: Erreur de validation
 */
router.post('/create', interventionController.createIntervention);

/**
 * @swagger
 * /interventions/update/{id}:
 *   put:
 *     tags: [Interventions]
 *     summary: Mettre à jour une intervention existante
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               vehicule_id:
 *                 type: integer
 *               type:
 *                 type: string
 *                 enum: [maintenance, reparation, nettoyage]
 *               date_intervention:
 *                 type: string
 *                 format: date
 *               agence_id:
 *                 type: integer
 *               prestataire:
 *                 type: string
 *               cout:
 *                 type: number
 *                 format: float
 *               commentaire:
 *                 type: string
 *               facture_pdf:
 *                 type: string
 *     responses:
 *       200:
 *         description: Intervention mise à jour
 *       400:
 *         description: Erreur de validation
 *       404:
 *         description: Intervention non trouvée
 */
router.put('/update/:id', interventionController.updateIntervention);

/**
 * @swagger
 * /interventions/delete/{id}:
 *   delete:
 *     tags: [Interventions]
 *     summary: Supprimer une intervention (soft delete)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Intervention supprimée
 *       404:
 *         description: Intervention non trouvée
 */
router.delete('/delete/:id', interventionController.deleteIntervention);

module.exports = router;
