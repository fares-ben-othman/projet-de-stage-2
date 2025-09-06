const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const userModel = require('../models/userModel');
const agenceModel = require('../models/agenceModel');
const { userCreateSchema, userUpdateSchema, loginSchema } = require('../validators/userValidator');
const { logAction } = require('../utils/journal'); 
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
  const currentUser = req.user; 
  console.log("Action: Récupération des utilisateurs");
  try {
    const [rows] = await userModel.getAllUsers();
    console.log('Utilisateurs récupérés:', rows.length);

    await logAction(
      currentUser,
      "LECTURE",
      "utilisateurs",
      null,
      `Récupération de tous les utilisateurs (${rows.length})`,
      "SUCCES"
    );

    res.status(200).json(rows);
  } catch (e) {
    console.error("Erreur récupération utilisateurs:", e);
    await logAction(
      currentUser,
      "LECTURE",
      "utilisateurs",
      null,
      `Erreur lors de la récupération des utilisateurs: ${e.message}`,
      "ECHEC"
    );

    res.status(500).json({ error: 'Erreur lors de la récupération des utilisateurs' });
  }
};


const getUserById = async (req, res) => {
  const currentUser = req.user; 
  const { id } = req.params;
  console.log(`Action: Récupération utilisateur ID ${id}`);

  try {
    const user = await findUser(id, res);
    if (!user) {
      await logAction(
        currentUser,
        "LECTURE",
        "utilisateurs",
        id,
        `Tentative de récupération utilisateur ID ${id} - non trouvé`,
        "ECHEC"
      );
      return;
    }

    console.log('Utilisateur trouvé:', user.email);
    delete user.mot_de_passe;

    await logAction(
      currentUser,
      "LECTURE",
      "utilisateurs",
      id,
      `Récupération utilisateur ID ${id} - ${user.email}`,
      "SUCCES"
    );

    res.status(200).json(user);
  } catch (e) {
    console.error(`Erreur récupération utilisateur ID ${id}:`, e);
    await logAction(
      currentUser,
      "LECTURE",
      "utilisateurs",
      id,
      `Erreur récupération utilisateur ID ${id}: ${e.message}`,
      "ECHEC"
    );

    res.status(500).json({ error: 'Erreur serveur' });
  }
};

const register = async (req, res) => {
  console.log("Action: Création d'un utilisateur:", req.body.email);
  const { error } = userCreateSchema.validate(req.body);
  if (error) {
    console.log('Validation échouée:', error.details[0].message);
    return res.status(400).json({ error: error.details[0].message });
  }

  try {
    // Vérification que l'email n'existe pas déjà
    const [exist] = await userModel.getUserByEmail(req.body.email);
    console.log('Vérification email existant:', exist.length);
    if (exist.length > 0) {
      console.log(`Email ${req.body.email} déjà utilisé`);
      return res.status(400).json({ error: 'Email déjà utilisé' });
    }

    // Vérification de l'agence
    let agenceId = req.body.agence_id;
    if (agenceId) {
      const [agenceRows] = await agenceModel.getAgenceById(agenceId);
      console.log('Vérification agence existante:', agenceRows.length);
      if (!agenceRows || agenceRows.length === 0) {
        console.log('Agence invalide:', agenceId);
        return res.status(400).json({ error: 'Agence invalide' });
      }
    } else {
      // Aucun ID ou ID falsy (ex: 0), refus de l'inscription si obligatoire
      return res.status(400).json({ error: 'Agence invalide ou non fournie' });
    }

    // Hash du mot de passe
    console.log('Hashage du mot de passe...');
    const hash = await bcrypt.hash(req.body.mot_de_passe, ROUNDS);

    // Préparation des données
    const toInsert = {
      nom: req.body.nom,
      email: req.body.email,
      mot_de_passe: hash,
      agence_id: agenceId,
      is_active: true,
    };

    // Insertion en DB
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



// Login
const login = async (req, res) => {
  console.log('Action: Tentative de login pour', req.body.email);
  const { email, mot_de_passe } = req.body;

  const { error } = loginSchema.validate(req.body);
  if (error) {
    console.log('Validation login échouée:', error.details[0].message);
    return res.status(400).json({ error: error.details[0].message });
  }

  try {
    const [rows] = await userModel.getUserByEmail(email);
    if (rows.length === 0) {
      console.log('Utilisateur non trouvé pour email:', email);
      return res.status(401).json({ error: 'Identifiants invalides' });
    }

    const user = rows[0];
    if (user.is_deleted || !user.is_active) {
      console.log('Compte inactif ou supprimé pour user ID:', user.id);
      return res.status(403).json({ error: 'Compte inactif ou supprimé' });
    }

    const ok = await bcrypt.compare(mot_de_passe, user.mot_de_passe);
    if (!ok) {
      console.log('Mot de passe invalide pour user ID:', user.id);
      return res.status(401).json({ error: 'Identifiants invalides' });
    }

    console.log('Login réussi pour user ID:', user.id);

    const payload = { id: user.id, nom: user.nom, role: user.role, agence_id: user.agence_id };
    const accessToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
    const refreshToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });

    await userModel.updateLastLogin(user.id);
    console.log('Mise à jour last login pour user ID:', user.id);

    // Journal succès login
    await logAction(
      { id: user.id, nom: user.nom, agence_id: user.agence_id, role: user.role },
      "LOGIN",
      "utilisateurs",
      user.id,
      `Login réussi`,
      "SUCCES"
    );

    delete user.mot_de_passe;
    res.status(200).json({ accessToken, refreshToken, user });
    console.log('Tokens générés et renvoyés pour user ID:', user.id);
  } catch (e) {
    console.error('Erreur lors du login:', e);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

const updateUser = async (req, res) => {
  const currentUser = req.user; 
  const { id } = req.params;
  console.log(`Action: Mise à jour utilisateur ID ${id}`);

  const user = await findUser(id, res);
  if (!user) return;

  const { error } = userUpdateSchema.validate(req.body);
  if (error) {
    console.log('Validation update échouée:', error.details[0].message);

    await logAction(
      currentUser,
      "MISE_A_JOUR",
      "utilisateurs",
      id,
      `Échec validation mise à jour utilisateur ID ${id}: ${error.details[0].message}`,
      "ECHEC"
    );

    return res.status(400).json({ error: error.details[0].message });
  }

  try {
    
    if (req.body.email) {
      const [rows] = await userModel.getUserByEmail(req.body.email);
      console.log('Vérification email pour update:', rows.length);

      if (rows.length > 0 && String(rows[0].id) !== String(id)) {
        await logAction(
          currentUser,
          "MISE_A_JOUR",
          "utilisateurs",
          id,
          `Échec mise à jour utilisateur ID ${id}: email déjà utilisé (${req.body.email})`,
          "ECHEC"
        );

        return res.status(400).json({ error: 'Email déjà utilisé' });
      }
    }

    
    if (req.body.agence_id !== undefined) {
      const [agence] = await agenceModel.getAgenceById(req.body.agence_id);
      if (!agence || agence.length === 0) {
        await logAction(
          currentUser,
          "MISE_A_JOUR",
          "utilisateurs",
          id,
          `Échec mise à jour utilisateur ID ${id}: agence inexistante (ID ${req.body.agence_id})`,
          "ECHEC"
        );
        return res.status(400).json({ error: 'Agence non trouvée' });
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
      await logAction(
        currentUser,
        "MISE_A_JOUR",
        "utilisateurs",
        id,
        `Tentative mise à jour utilisateur ID ${id} - non trouvé`,
        "ECHEC"
      );
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    await logAction(
      currentUser,
      "MISE_A_JOUR",
      "utilisateurs",
      id,
      `Utilisateur ID ${id} mis à jour`,
      "SUCCES"
    );

    res.status(200).json({ message: 'Utilisateur mis à jour' });
  } catch (e) {
    console.error(`Erreur update utilisateur ${id}:`, e);

    await logAction(
      currentUser,
      "MISE_A_JOUR",
      "utilisateurs",
      id,
      `Erreur mise à jour utilisateur ID ${id}: ${e.message}`,
      "ECHEC"
    );

    
    if (e.code === 'ER_NO_REFERENCED_ROW_2') {
      console.error(` Erreur clé étrangère: agence_id invalide pour utilisateur ${id}`);
      return res.status(400).json({ error: "Agence spécifiée invalide" });
    }

    if (e.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'Email déjà utilisé' });
    }

    res.status(500).json({ error: 'Erreur lors de la mise à jour' });
  }
};

// gestion selon le role admin ou chef agence a faire 
const deleteUser = async (req, res) => {
  const currentUser = req.user; 
  const { id } = req.params;
  console.log(`Action: Suppression (soft) utilisateur ID ${id}`);

  const user = await findUser(id, res);
  if (!user) return;

  try {
    console.log('Suppression soft en cours pour user ID:', id);
    await userModel.softDeleteUser(id);

    await logAction(
      currentUser,
      "SUPPRESSION",
      "utilisateurs",
      id,
      `Suppression utilisateur ID ${id}`,
      "SUCCES"
    );

    res.status(200).json({ message: 'Utilisateur supprimé' });
  } catch (e) {
    console.error(`Erreur suppression utilisateur ${id}:`, e);
    await logAction(
      currentUser,
      "SUPPRESSION",
      "utilisateurs",
      id,
      `Erreur suppression utilisateur ID ${id}: ${e.message}`,
      "ECHEC"
    );

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
