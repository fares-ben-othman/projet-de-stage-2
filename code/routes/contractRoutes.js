const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');

const contractController = require('../controllers/contractController');

/**
 * @swagger
 * tags:
 *   name: Contracts
 *   description: API pour gérer les contrats
 */

/**
 * @swagger
 * /contracts/get-all:
 *   get:
 *     tags: [Contracts]
 *     summary: Récupérer tous les contrats
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des contrats
 */
router.get('/get-all', auth, contractController.getAllContracts);

/**
 * @swagger
 * /contracts/getContractById/{id}:
 *   get:
 *     tags: [Contracts]
 *     summary: Récupérer un contrat par ID
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
 *         description: Un contrat
 *       404:
 *         description: Contrat non trouvé
 */
router.get('/getContractById/:id', auth, contractController.getContractById);

/**
 * @swagger
 * /contracts/create:
 *   post:
 *     tags: [Contracts]
 *     summary: Ajouter un nouveau contrat
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               client_id:
 *                 type: integer
 *               vehicule_id:
 *                 type: integer
 *               agence_id:
 *                 type: integer
 *               date_debut:
 *                 type: string
 *                 format: date
 *               date_fin:
 *                 type: string
 *                 format: date
 *               montant:
 *                 type: number
 *               remise:
 *                 type: number
 *               options_assurance:
 *                 type: string
 *               options_gps:
 *                 type: string
 *               options_conducteur_add:
 *                 type: string
 *               etat_pickup:
 *                 type: string
 *               km_initial:
 *                 type: number
 *               carburant_final:
 *                 type: string
 *               frais_supplémentaires:
 *                 type: number
 *               rapport_restitution:
 *                 type: string
 *             required:
 *               - client_id
 *               - vehicule_id
 *               - agence_id
 *               - date_debut
 *               - date_fin
 *               - montant
 *     responses:
 *       201:
 *         description: Contrat créé
 *       500:
 *         description: Erreur serveur
 */
router.post('/create', auth, contractController.createContract);

/**
 * @swagger
 * /contracts/update/{id}:
 *   put:
 *     tags: [Contracts]
 *     summary: Mettre à jour un contrat existant
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
 *               client_id:
 *                 type: integer
 *               vehicule_id:
 *                 type: integer
 *               agence_id:
 *                 type: integer
 *               date_debut:
 *                 type: string
 *                 format: date
 *               date_fin:
 *                 type: string
 *                 format: date
 *               montant:
 *                 type: number
 *               remise:
 *                 type: number
 *               options_assurance:
 *                 type: string
 *               options_gps:
 *                 type: string
 *               options_conducteur_add:
 *                 type: string
 *               etat_pickup:
 *                 type: string
 *               km_initial:
 *                 type: number
 *               carburant_final:
 *                 type: string
 *               frais_supplémentaires:
 *                 type: number
 *               rapport_restitution:
 *                 type: string
 *     responses:
 *       200:
 *         description: Contrat mis à jour
 *       404:
 *         description: Contrat non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.put('/update/:id', auth, contractController.updateContract);

/**
 * @swagger
 * /contracts/delete/{id}:
 *   delete:
 *     tags: [Contracts]
 *     summary: Supprimer un contrat
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
 *         description: Contrat supprimé
 *       404:
 *         description: Contrat non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.delete('/delete/:id', auth, contractController.deleteContract);

module.exports = router;
