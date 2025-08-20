const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
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
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des véhicules
 */
router.get('/get-all', auth, vehiculeController.getAllVehicules);

/**
 * @swagger
 * /vehicules/getVehiculeById/{id}:
 *   get:
 *     tags: [Vehicules]
 *     summary: Récupérer un véhicule par ID
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
 *         description: Un véhicule
 *       404:
 *         description: Véhicule non trouvé
 */
router.get('/getVehiculeById/:id', auth, vehiculeController.getVehiculeById);

/**
 * @swagger
 * /vehicules/create:
 *   post:
 *     tags: [Vehicules]
 *     summary: Ajouter un nouveau véhicule
 *     security:
 *       - bearerAuth: []
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
router.post('/create', auth, vehiculeController.createVehicule);

/**
 * @swagger
 * /vehicules/update/{id}:
 *   put:
 *     tags: [Vehicules]
 *     summary: Mettre à jour un véhicule existant
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
router.put('/update/:id', auth, vehiculeController.updateVehicule);

/**
 * @swagger
 * /vehicules/delete/{id}:
 *   delete:
 *     tags: [Vehicules]
 *     summary: Supprimer un véhicule
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
 *         description: Véhicule supprimé
 */
router.delete('/delete/:id', auth, vehiculeController.deleteVehicule);

module.exports = router;
