const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
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
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des transferts
 */
router.get('/get-all', auth, transfertController.getAllTransferts);

/**
 * @swagger
 * /transfert/getTransfertById/{id}:
 *   get:
 *     tags: [Transfert]
 *     summary: Récupérer un transfert par ID
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
 *         description: Un transfert
 *       404:
 *         description: Transfert non trouvé
 */
router.get('/getTransfertById/:id', auth, transfertController.getTransfertById);

/**
 * @swagger
 * /transfert/create:
 *   post:
 *     tags: [Transfert]
 *     summary: Créer un nouveau transfert
 *     security:
 *       - bearerAuth: []
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
router.post('/create', auth, transfertController.createTransfert);

/**
 * @swagger
 * /transfert/update/{id}:
 *   put:
 *     tags: [Transfert]
 *     summary: Mettre à jour un transfert existant
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
router.put('/update/:id', auth, transfertController.updateTransfert);

/**
 * @swagger
 * /transfert/delete/{id}:
 *   delete:
 *     tags: [Transfert]
 *     summary: Supprimer un transfert
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
 *         description: Transfert supprimé
 *       404:
 *         description: Transfert non trouvé
 */
router.delete('/delete/:id', auth, transfertController.deleteTransfert);

module.exports = router;
