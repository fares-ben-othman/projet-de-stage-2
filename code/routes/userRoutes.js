const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: API pour gérer les utilisateurs
 */

/**
 * @swagger
 * /users/get-all:
 *   get:
 *     tags: [Users]
 *     summary: Récupérer tous les utilisateurs
 *     responses:
 *       200:
 *         description: Liste des utilisateurs
 */
router.get('/get-all', userController.getAllUsers);

/**
 * @swagger
 * /users/get/{id}:
 *   get:
 *     tags: [Users]
 *     summary: Récupérer un utilisateur par ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Un utilisateur
 *       404:
 *         description: Utilisateur non trouvé
 */
router.get('/get/:id', userController.getUser);

/**
 * @swagger
 * /users/register:
 *   post:
 *     tags: [Users]
 *     summary: Créer un nouvel utilisateur (le rôle sera toujours "agent" par défaut)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nom:
 *                 type: string
 *                 example: Jean Dupont
 *               email:
 *                 type: string
 *                 example: jean.dupont@example.com
 *               mot_de_passe:
 *                 type: string
 *                 example: Password123!
 *               agence_id:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       201:
 *         description: Utilisateur créé
 *       400:
 *         description: Erreur de validation ou email déjà utilisé
 */
router.post('/register', userController.register);

/**
 * @swagger
 * /users/login:
 *   post:
 *     tags: [Users]
 *     summary: Authentification utilisateur
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: jean.dupont@example.com
 *               mot_de_passe:
 *                 type: string
 *                 example: Password123!
 *     responses:
 *       200:
 *         description: Login réussi avec token JWT
 *       401:
 *         description: Identifiants invalides
 *       403:
 *         description: Compte inactif ou supprimé
 */
router.post('/login', userController.login);

/**
 * @swagger
 * /users/update/{id}:
 *   put:
 *     tags: [Users]
 *     summary: Mettre à jour un utilisateur existant
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
 *               email:
 *                 type: string
 *               mot_de_passe:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [admin, chef_agence, agent]
 *               agence_id:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Utilisateur mis à jour
 *       400:
 *         description: Email déjà utilisé ou erreur de validation
 *       404:
 *         description: Utilisateur non trouvé
 */
router.put('/update/:id', userController.updateUser);

/**
 * @swagger
 * /users/delete/{id}:
 *   delete:
 *     tags: [Users]
 *     summary: Supprimer un utilisateur 
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Utilisateur supprimé
 *       404:
 *         description: Utilisateur non trouvé
 */
router.delete('/delete/:id', userController.deleteUser);

module.exports = router;


