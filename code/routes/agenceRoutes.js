const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const { requireRoles } = require('../middlewares/roles');
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
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des agences
 */
router.get('/get-all', auth,requireRoles('admin', 'chef_agence', 'agent'), agenceController.getAllAgences);

/**
 * @swagger
 * /agences/getAgenceById/{id}:
 *   get:
 *     tags: [Agences]
 *     summary: Récupérer une agence par ID
 *     security:
 *       - bearerAuth: []
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
router.get('/getAgenceById/:id', auth, requireRoles('admin', 'chef_agence', 'agent') ,agenceController.getAgenceById);

/**
 * @swagger
 * /agences/create:
 *   post:
 *     tags: [Agences]
 *     summary: Ajouter une nouvelle agence
 *     security:
 *       - bearerAuth: []
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
router.post('/create', auth, requireRoles('admin', 'chef_agence', 'agent') , agenceController.createAgence);

/**
 * @swagger
 * /agences/update/{id}:
 *   put:
 *     tags: [Agences]
 *     summary: Mettre à jour une agence existante
 *     security:
 *       - bearerAuth: []
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
router.put('/update/:id', auth, requireRoles('admin', 'chef_agence', 'agent') , agenceController.updateAgence);

/**
 * @swagger
 * /agences/delete/{id}:
 *   delete:
 *     tags: [Agences]
 *     summary: Supprimer une agence
 *     security:
 *       - bearerAuth: []
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
router.delete('/delete/:id', auth, requireRoles('admin', 'chef_agence', 'agent') , agenceController.deleteAgence);

module.exports = router;


