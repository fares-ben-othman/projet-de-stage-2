const express = require('express');
const router = express.Router();

const vehiculeController = require('../controllers/vehiculeController');

/**
 * @swagger
 * tags:
 *   name: Vehicules
 *   description: API pour gérer les véhicules
 */

/**
 * @swagger
 * /vehicules/get-all:
 *   get:
 *     tags: [Vehicules]
 *     summary: Récupérer tous les véhicules
 *     responses:
 *       200:
 *         description: Liste des véhicules
 */
router.get('/get-all', vehiculeController.getAllVehicules);

/**
 * @swagger
 * /vehicules/getById/{id}:
 *   get:
 *     tags: [Vehicules]
 *     summary: Récupérer un véhicule par ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Un véhicule
 *       404:
 *         description: Véhicule non trouvé
 */
router.get('/getById/:id', vehiculeController.getVehiculeById);

/**
 * @swagger
 * /vehicules/create:
 *   post:
 *     tags: [Vehicules]
 *     summary: Ajouter un nouveau véhicule
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               immatriculation:
 *                 type: string
 *               marque:
 *                 type: string
 *               modele:
 *                 type: string
 *               annee:
 *                 type: integer
 *               kilometrage:
 *                 type: integer
 *               statut:
 *                 type: string
 *                 enum: [disponible, loue, maintenance, leasing, reserve]
 *               date_assurance:
 *                 type: string
 *                 format: date
 *               agence_id:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Véhicule créé
 */
router.post('/create', vehiculeController.createVehicule);

/**
 * @swagger
 * /vehicules/update/{id}:
 *   put:
 *     tags: [Vehicules]
 *     summary: Mettre à jour un véhicule existant
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
 *               immatriculation:
 *                 type: string
 *               marque:
 *                 type: string
 *               modele:
 *                 type: string
 *               annee:
 *                 type: integer
 *               kilometrage:
 *                 type: integer
 *               statut:
 *                 type: string
 *                 enum: [disponible, loue, maintenance, leasing, reserve]
 *               date_assurance:
 *                 type: string
 *                 format: date
 *               agence_id:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Véhicule mis à jour
 */
router.put('/update/:id', vehiculeController.updateVehicule);

/**
 * @swagger
 * /vehicules/delete/{id}:
 *   delete:
 *     tags: [Vehicules]
 *     summary: Supprimer un véhicule
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Véhicule supprimé
 */
router.delete('/delete/:id', vehiculeController.deleteVehicule);

module.exports = router;
