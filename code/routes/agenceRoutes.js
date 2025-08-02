const express = require('express');
const router = express.Router();

const agenceController = require('../controllers/agenceController');

/**
 * @swagger
 * tags:
 *   name: Agences
 *   description: API pour gérer les agences
 */

/**
 * @swagger
 * /agences/get-all:
 *   get:
 *     tags: [Agences]
 *     summary: Récupérer toutes les agences
 *     responses:
 *       200:
 *         description: Liste des agences
 */
router.get('/get-all', agenceController.getAllAgences);

/**
 * @swagger
 * /agences/getById/{id}:
 *   get:
 *     tags: [Agences]
 *     summary: Récupérer une agence par ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Une agence
 *       404:
 *         description: Agence non trouvée
 */
router.get('/getById/:id', agenceController.getAgenceById);

/**
 * @swagger
 * /agences/create:
 *   post:
 *     tags: [Agences]
 *     summary: Ajouter une nouvelle agence
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nom:
 *                 type: string
 *               adresse:
 *                 type: string
 *               ville:
 *                 type: string
 *               telephone:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       201:
 *         description: Agence créée
 */
router.post('/create', agenceController.createAgence);

/**
 * @swagger
 * /agences/update/{id}:
 *   put:
 *     tags: [Agences]
 *     summary: Mettre à jour une agence existante
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
 *               nom:
 *                 type: string
 *               adresse:
 *                 type: string
 *               ville:
 *                 type: string
 *               telephone:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Agence mise à jour
 */
router.put('/update/:id', agenceController.updateAgence);

/**
 * @swagger
 * /agences/delete/{id}:
 *   delete:
 *     tags: [Agences]
 *     summary: Supprimer une agence
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Agence supprimée
 */
router.delete('/delete/:id', agenceController.deleteAgence);

module.exports = router;

