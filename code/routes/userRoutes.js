const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');
const auth = require('../middlewares/auth');
const { requireRoles } = require('../middlewares/roles');
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
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des utilisateurs
 */
router.get('/get-all', userController.getAllUsers);

/**
 * @swagger
 * /users/getUserById/{id}:
 *   get:
 *     tags: [Users]
 *     summary: Récupérer un utilisateur par ID
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
 *         description: Un utilisateur
 *       404:
 *         description: Utilisateur non trouvé
 */
router.get('/getUserById/:id', auth,requireRoles('admin', 'chef_agence', 'agent'), userController.getUserById);

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
 *               email:
 *                 type: string
 *               mot_de_passe:
 *                 type: string
 *               agence_id:
 *                 type: integer
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
 *               mot_de_passe:
 *                 type: string
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
router.put('/update/:id', auth,requireRoles('admin', 'chef_agence', 'agent'), userController.updateUser);

/**
 * @swagger
 * /users/delete/{id}:
 *   delete:
 *     tags: [Users]
 *     summary: Supprimer un utilisateur 
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
 *         description: Utilisateur supprimé
 *       404:
 *         description: Utilisateur non trouvé
 */
router.delete('/delete/:id', auth,requireRoles('admin', 'chef_agence', 'agent'), userController.deleteUser);

module.exports = router;
