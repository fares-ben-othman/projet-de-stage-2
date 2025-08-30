const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const { requireRoles } = require('../middlewares/roles');
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
router.get(
  '/get-all', 
  auth, 
  requireRoles('admin', 'chef_agence', 'agent'), 
  vehiculeController.getAllVehicules
);

/**
 * @swagger
 * /vehicules/get/{immatriculation}:
 *   get:
 *     tags: [Vehicules]
 *     summary: Récupérer un véhicule par son immatriculation
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: immatriculation
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Un véhicule
 *       404:
 *         description: Véhicule non trouvé
 */
router.get(
  '/get/:immatriculation', 
  auth, 
  requireRoles('admin', 'chef_agence', 'agent'), 
  vehiculeController.getVehiculeByImmatriculation
);

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
 *                 enum: [disponible, loue, maintenance, leasing, reserve, transfert]
 *               date_assurance:
 *                 type: string
 *                 format: date
 *               agence_id:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Véhicule créé
 */
router.post(
  '/create', 
  auth, 
  requireRoles('admin', 'chef_agence', 'agent'), 
  vehiculeController.createVehicule
);

/**
 * @swagger
 * /vehicules/update/{immatriculation}:
 *   put:
 *     tags: [Vehicules]
 *     summary: Mettre à jour un véhicule existant (sans modifier l'immatriculation)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: immatriculation
 *         required: true
 *         schema:
 *           type: string
 *         description: L'immatriculation du véhicule à mettre à jour
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
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
 *                 enum: [disponible, loue, maintenance, leasing, reserve, transfert]
 *               date_assurance:
 *                 type: string
 *                 format: date
 *               agence_id:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Véhicule mis à jour
 *       400:
 *         description: Erreur de validation
 *       404:
 *         description: Véhicule introuvable
 *       500:
 *         description: Erreur serveur
 */
router.put(
  '/update/:immatriculation',
  auth,
  requireRoles('admin', 'chef_agence', 'agent'),
  vehiculeController.updateVehicule
);


/**
 * @swagger
 * /vehicules/delete/{immatriculation}:
 *   delete:
 *     tags: [Vehicules]
 *     summary: Supprimer un véhicule
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: immatriculation
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Véhicule supprimé
 */
router.delete(
  '/delete/:immatriculation', 
  auth, 
  requireRoles('admin', 'chef_agence', 'agent'), 
  vehiculeController.deleteVehicule
);

module.exports = router;
