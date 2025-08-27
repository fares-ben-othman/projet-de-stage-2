const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const { requireRoles } = require('../middlewares/roles');
const clientController = require('../controllers/clientController');

/**
 * @swagger
 * tags:
 *   name: Clients
 *   description: API pour gérer les clients
 */

/**
 * @swagger
 * /clients/get-all:
 *   get:
 *     tags: [Clients]
 *     summary: Récupérer tous les clients
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des clients
 */
router.get('/get-all', auth, requireRoles('admin', 'chef_agence', 'agent'), clientController.getAllClients);

/**
 * @swagger
 * /clients/getClientByNumeroPermis/{numero_permis}:
 *   get:
 *     tags: [Clients]
 *     summary: Récupérer un client par numéro de permis
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: numero_permis
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Un client
 *       404:
 *         description: Client non trouvé
 */
router.get('/getClientByNumeroPermis/:numero_permis', auth, requireRoles('admin', 'chef_agence', 'agent'), clientController.getClientByNumeroPermis);

/**
 * @swagger
 * /clients/create:
 *   post:
 *     tags: [Clients]
 *     summary: Ajouter un nouveau client
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               numero_permis:
 *                 type: string
 *               nom:
 *                 type: string
 *               prenom:
 *                 type: string
 *               email:
 *                 type: string
 *               telephone:
 *                 type: string
 *               cin:
 *                 type: string
 *     responses:
 *       201:
 *         description: Client créé
 */
router.post('/create', auth, requireRoles('admin', 'chef_agence', 'agent'), clientController.createClient);

/**
 * @swagger
 * /clients/update/{numero_permis}:
 *   put:
 *     tags: [Clients]
 *     summary: Mettre à jour un client existant
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: numero_permis
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nom:
 *                 type: string
 *               prenom:
 *                 type: string
 *               email:
 *                 type: string
 *               telephone:
 *                 type: string
 *               cin:
 *                 type: string
 *     responses:
 *       200:
 *         description: Client mis à jour
 */
router.put('/update/:numero_permis', auth, requireRoles('admin', 'chef_agence', 'agent'), clientController.updateClient);

/**
 * @swagger
 * /clients/delete/{numero_permis}:
 *   delete:
 *     tags: [Clients]
 *     summary: Supprimer un client
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: numero_permis
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Client supprimé
 */
router.delete('/delete/:numero_permis', auth, requireRoles('admin', 'chef_agence', 'agent'), clientController.deleteClient);

module.exports = router;
