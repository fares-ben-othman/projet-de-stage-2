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
router.get('/get-all', auth,requireRoles('admin', 'chef_agence', 'agent') , clientController.getAllClients);

/**
 * @swagger
 * /clients/getClientById/{id}:
 *   get:
 *     tags: [Clients]
 *     summary: Récupérer un client par ID
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
 *         description: Un client
 *       404:
 *         description: Client non trouvé
 */
router.get('/getClientById/:id', auth,requireRoles('admin', 'chef_agence', 'agent') , clientController.getClientById);

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
router.post('/create', auth,requireRoles('admin', 'chef_agence', 'agent') , clientController.createClient);

/**
 * @swagger
 * /clients/update/{id}:
 *   put:
 *     tags: [Clients]
 *     summary: Mettre à jour un client existant
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
router.put('/update/:id', auth,requireRoles('admin', 'chef_agence', 'agent') , clientController.updateClient);

/**
 * @swagger
 * /clients/delete/{id}:
 *   delete:
 *     tags: [Clients]
 *     summary: Supprimer un client
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
 *         description: Client supprimé
 */
router.delete('/delete/:id', auth,requireRoles('admin', 'chef_agence', 'agent') , clientController.deleteClient);

module.exports = router;
