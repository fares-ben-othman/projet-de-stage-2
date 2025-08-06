const express = require('express');
const router = express.Router();

const financeController = require('../controllers/financeController');

/**
 * @swagger
 * tags:
 *   name: Finances
 *   description: API pour gérer les finances
 */

/**
 * @swagger
 * /finances/get-all:
 *   get:
 *     tags: [Finances]
 *     summary: Récupérer toutes les opérations financières
 *     responses:
 *       200:
 *         description: Liste des finances
 */
router.get('/get-all', financeController.getAllFinances);

/**
 * @swagger
 * /finances/getById/{id}:
 *   get:
 *     tags: [Finances]
 *     summary: Récupérer une opération financière par ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Une opération financière
 *       404:
 *         description: Opération non trouvée
 */
router.get('/getById/:id', financeController.getFinanceById);

/**
 * @swagger
 * /finances/create:
 *   post:
 *     tags: [Finances]
 *     summary: Ajouter une nouvelle opération financière
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               type:
 *                 type: string
 *                 enum: [revenu, depense]
 *               montant:
 *                 type: number
 *                 format: float
 *               vehicule_id:
 *                 type: integer
 *                 nullable: true
 *               agence_id:
 *                 type: integer
 *                 nullable: true
 *               source:
 *                 type: string
 *               date_finance:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: Opération créée
 */
router.post('/create', financeController.createFinance);

/**
 * @swagger
 * /finances/update/{id}:
 *   put:
 *     tags: [Finances]
 *     summary: Mettre à jour une opération financière
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
 *               type:
 *                 type: string
 *                 enum: [revenu, depense]
 *               montant:
 *                 type: number
 *                 format: float
 *               vehicule_id:
 *                 type: integer
 *                 nullable: true
 *               agence_id:
 *                 type: integer
 *                 nullable: true
 *               source:
 *                 type: string
 *               date_finance:
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         description: Opération mise à jour
 */
router.put('/update/:id', financeController.updateFinance);

/**
 * @swagger
 * /finances/delete/{id}:
 *   delete:
 *     tags: [Finances]
 *     summary: Supprimer une opération financière
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Opération supprimée
 */
router.delete('/delete/:id', financeController.deleteFinance);

module.exports = router;
