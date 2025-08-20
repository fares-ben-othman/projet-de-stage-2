
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userModel = require('../models/userModel');
const agenceModel = require('../models/agenceModel');
const { userCreateSchema, userUpdateSchema, loginSchema } = require('../validators/userValidator');

const ROUNDS = Number(process.env.BCRYPT_ROUNDS || 10);

const findUser = async (id, res) => {
  console.log(`Action: Vérification de l'existence de l'utilisateur ID ${id}`);
  try {
    const [rows] = await userModel.getUserById(id);
    console.log('Résultat findUser:', rows);
    if (rows.length === 0) {
      console.log(`Utilisateur ${id} non trouvé`);
      res.status(404).json({ error: 'Utilisateur non trouvé' });
      return null;
    }
    return rows[0];
  } catch (e) {
    console.error(`Erreur lors de la recherche de l'utilisateur ${id}:`, e);
    res.status(500).json({ error: 'Erreur serveur' });
    return null;
  }
};

const getAllUsers = async (req, res) => {
  console.log("Action: Récupération des utilisateurs");
  try {
    const [rows] = await userModel.getAllUsers();
    console.log('Utilisateurs récupérés:', rows.length);
    res.status(200).json(rows);
  } catch (e) {
    console.error("Erreur récupération utilisateurs:", e);
    res.status(500).json({ error: 'Erreur lors de la récupération des utilisateurs' });
  }
};

const getUserById = async (req, res) => {
  const { id } = req.params;
  console.log(`Action: Récupération utilisateur ID ${id}`);
  const user = await findUser(id, res);
  if (!user) return;
  console.log('Utilisateur trouvé:', user.email);
  delete user.mot_de_passe;
  res.status(200).json(user);
};

const register = async (req, res) => {
  console.log("Action: Création d'un utilisateur:", req.body.email);
  const { error } = userCreateSchema.validate(req.body);
  if (error) {
    console.log('Validation échouée:', error.details[0].message);
    return res.status(400).json({ error: error.details[0].message });
  }

  try {
    const [exist] = await userModel.getUserByEmail(req.body.email);
    console.log('Vérification email existant:', exist.length);
    if (exist.length > 0) {
      console.log(`Email ${req.body.email} déjà utilisé`);
      return res.status(400).json({ error: 'Email déjà utilisé' });
    }

    let agenceId = req.body.agence_id || null;
    if (agenceId) {
      const [agenceRows] = await agenceModel.getAgenceById(agenceId);
      console.log('Vérification agence existante:', agenceRows.length);
      if (agenceRows.length === 0) {
        console.log('Agence invalide:', agenceId);
        return res.status(400).json({ error: 'Agence invalide' });
      }
    }

    console.log('Hashage du mot de passe...');
    const hash = await bcrypt.hash(req.body.mot_de_passe, ROUNDS);

    const toInsert = {
      nom: req.body.nom,
      email: req.body.email,
      mot_de_passe: hash,
      agence_id: agenceId,
      is_active: true, 
    };

    console.log('Insertion utilisateur dans la DB:', toInsert);
    const [result] = await userModel.createUser(toInsert);
    console.log("Utilisateur créé ID:", result.insertId);
    res.status(201).json({ message: 'Utilisateur créé', id: result.insertId });
  } catch (e) {
    console.error("Erreur création utilisateur:", e);
    if (e.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'Email déjà utilisé' });
    }
    res.status(500).json({ error: 'Erreur lors de la création de l’utilisateur' });
  }
};

const login = async (req, res) => {
  console.log("Action: Login:", req.body.email);
  const { error } = loginSchema.validate(req.body);
  if (error) {
    console.log('Validation login échouée:', error.details[0].message);
    return res.status(400).json({ error: error.details[0].message });
  }

  const { email, mot_de_passe } = req.body;
  try {
    const [rows] = await userModel.getUserByEmail(email);
    console.log('Résultat login:', rows.length);
    if (rows.length === 0) return res.status(401).json({ error: 'Identifiants invalides' });

    const user = rows[0];
    if (user.is_deleted || !user.is_active) {
      console.log('Compte inactif ou supprimé:', user.id);
      return res.status(403).json({ error: 'Compte inactif ou supprimé' });
    }

    const ok = await bcrypt.compare(mot_de_passe, user.mot_de_passe);
    console.log('Mot de passe correct:', ok);
    if (!ok) return res.status(401).json({ error: 'Identifiants invalides' });

    const payload = { id: user.id, role: user.role, agence_id: user.agence_id };
    const token = jwt.sign(payload, process.env.JWT_SECRET || 'dev_secret', {
      expiresIn: process.env.JWT_EXPIRES_IN || '1d',
    });

    await userModel.updateLastLogin(user.id);
    console.log('Dernière connexion mise à jour pour user ID:', user.id);

    delete user.mot_de_passe;
    res.status(200).json({ token, user });
  } catch (e) {
    console.error("Erreur login:", e);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

const updateUser = async (req, res) => {
  const { id } = req.params;
  console.log(`Action: Mise à jour utilisateur ID ${id}`);

  const user = await findUser(id, res);
  if (!user) return;

  const { error } = userUpdateSchema.validate(req.body);
  if (error) {
    console.log('Validation update échouée:', error.details[0].message);
    return res.status(400).json({ error: error.details[0].message });
  }

  try {
    if (req.body.email) {
      const [rows] = await userModel.getUserByEmail(req.body.email);
      console.log('Vérification email pour update:', rows.length);
      if (rows.length > 0 && String(rows[0].id) !== String(id)) {
        return res.status(400).json({ error: 'Email déjà utilisé' });
      }
    }

    const data = { ...req.body };
    if (data.mot_de_passe) {
      console.log('Hashage du nouveau mot de passe...');
      data.mot_de_passe = await bcrypt.hash(data.mot_de_passe, ROUNDS);
    }

    const [result] = await userModel.updateUser(data, id);
    console.log('Résultat update:', result);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }
    res.status(200).json({ message: 'Utilisateur mis à jour' });
  } catch (e) {
    console.error(`Erreur update utilisateur ${id}:`, e);
    if (e.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'Email déjà utilisé' });
    }
    res.status(500).json({ error: 'Erreur lors de la mise à jour' });
  }
};

const deleteUser = async (req, res) => {
  const { id } = req.params;
  console.log(`Action: Suppression (soft) utilisateur ID ${id}`);

  const user = await findUser(id, res);
  if (!user) return;

  try {
    console.log('Suppression soft en cours pour user ID:', id);
    await userModel.softDeleteUser(id);
    res.status(200).json({ message: 'Utilisateur supprimé' });
  } catch (e) {
    console.error(`Erreur suppression utilisateur ${id}:`, e);
    res.status(500).json({ error: 'Erreur lors de la suppression' });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  register,
  login,
  updateUser,
  deleteUser,
};
