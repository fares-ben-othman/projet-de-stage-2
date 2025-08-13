const express = require('express');
const router = express.Router();

const transfertController = require('../controllers/transfertController');

/**
 * @swagger
 * tags:
 *   name: Transfert
 *   description: API pour gérer les transferts de véhicules
 */

/**
 * @swagger
 * /transfert/get-all:
 *   get:
 *     tags: [Transfert]
 *     summary: Récupérer tous les transferts
 *     responses:
 *       200:
 *         description: Liste des transferts
 */
router.get('/get-all', transfertController.getAllTransferts);

/**
 * @swagger
 * /transfert/getById/{id}:
 *   get:
 *     tags: [Transfert]
 *     summary: Récupérer un transfert par ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Un transfert
 *       404:
 *         description: Transfert non trouvé
 */
router.get('/getById/:id', transfertController.getTransfertById);

/**
 * @swagger
 * /transfert/create:
 *   post:
 *     tags: [Transfert]
 *     summary: Créer un nouveau transfert
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - vehicule_id
 *               - source_agence_id
 *               - destination_agence_id
 *               - date_transfert
 *             properties:
 *               vehicule_id:
 *                 type: integer
 *               source_agence_id:
 *                 type: integer
 *               destination_agence_id:
 *                 type: integer
 *               date_transfert:
 *                 type: string
 *                 format: date
 *               etat:
 *                 type: string
 *                 enum: [en_cours, termine]
 *                 default: en_cours
 *     responses:
 *       201:
 *         description: Transfert créé
 */
router.post('/create', transfertController.createTransfert);

/**
 * @swagger
 * /transfert/update/{id}:
 *   put:
 *     tags: [Transfert]
 *     summary: Mettre à jour un transfert existant
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
 *               source_agence_id:
 *                 type: integer
 *               destination_agence_id:
 *                 type: integer
 *               date_transfert:
 *                 type: string
 *                 format: date
 *               etat:
 *                 type: string
 *                 enum: [en_cours, termine]
 *     responses:
 *       200:
 *         description: Transfert mis à jour
 *       404:
 *         description: Transfert non trouvé
 */
router.put('/update/:id', transfertController.updateTransfert);

/**
 * @swagger
 * /transfert/delete/{id}:
 *   delete:
 *     tags: [Transfert]
 *     summary: Supprimer un transfert
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Transfert supprimé
 *       404:
 *         description: Transfert non trouvé
 */
router.delete('/delete/:id', transfertController.deleteTransfert);

module.exports = router;
