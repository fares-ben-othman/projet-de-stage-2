const pool = require('../connection');

const getAllUsers = () => {
  return pool.query(
    "SELECT id, nom, email, role, agence_id, is_active, last_login FROM utilisateurs WHERE is_deleted = FALSE"
  );
};

const getUserById = (id) => {
  return pool.query("SELECT * FROM utilisateurs WHERE is_deleted = FALSE AND id = ?", [id]);
};

const getUserByEmail = (email) => {
  return pool.query("SELECT * FROM utilisateurs WHERE email = ?", [email]);
};

const createUser = (data) => {
  const { nom, email, mot_de_passe, agence_id, is_active } = data;
  return pool.query(
    "INSERT INTO utilisateurs (nom, email, mot_de_passe, agence_id, is_active) VALUES (?, ?, ?, ?, ?)",
    [nom, email, mot_de_passe, agence_id, is_active]
  );
};

const updateUser = (data, id) => {
  const { nom, email, mot_de_passe, role, agence_id, is_active } = data;

  return pool.query(
    `UPDATE utilisateurs 
     SET nom = ?, email = ?, mot_de_passe = ?, role = ?, agence_id = ?, is_active = ? 
     WHERE id = ?`,
    [nom, email, mot_de_passe, role, agence_id, is_active, id]
  );
};

const DeleteUser = (id) => {
  return pool.query(
    "UPDATE utilisateurs SET is_deleted = TRUE, deleted_at = NOW() WHERE id = ?",
    [id]
  );
};

const updateLastLogin = (id) => {
  return pool.query(
    "UPDATE utilisateurs SET last_login = NOW() WHERE id = ?",
    [id]
  );
};

module.exports = {
  getAllUsers,
  getUserById,
  getUserByEmail,
  createUser,
  updateUser,
  DeleteUser,
  updateLastLogin,
};
