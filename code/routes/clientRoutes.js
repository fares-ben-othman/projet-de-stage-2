const express = require('express');
const router = express.Router();

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
 *     responses:
 *       200:
 *         description: Liste des clients
 */
router.get('/get-all', clientController.getAllClients);

/**
 * @swagger
 * /clients/getById/{id}:
 *   get:
 *     tags: [Clients]
 *     summary: Récupérer un client par ID
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
router.get('/getById/:id', clientController.getClientById);

/**
 * @swagger
 * /clients/create:
 *   post:
 *     tags: [Clients]
 *     summary: Ajouter un nouveau client
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
router.post('/create', clientController.createClient);

/**
 * @swagger
 * /clients/update/{id}:
 *   put:
 *     tags: [Clients]
 *     summary: Mettre à jour un client existant
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
router.put('/update/:id', clientController.updateClient);

/**
 * @swagger
 * /clients/delete/{id}:
 *   delete:
 *     tags: [Clients]
 *     summary: Supprimer un client
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
router.delete('/delete/:id', clientController.deleteClient);

module.exports = router;
