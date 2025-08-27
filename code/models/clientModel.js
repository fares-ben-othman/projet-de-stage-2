const pool = require('../connection');

const getAllClients = () => {
    return pool.query("SELECT * FROM clients WHERE is_deleted = FALSE");
};

const getClientByNumeroPermis = (numero_permis) => {
    return pool.query("SELECT * FROM clients WHERE is_deleted = FALSE AND numero_permis = ?", [numero_permis]);
};

const getClientByEmail = (email) => {
    return pool.query("SELECT * FROM clients WHERE email = ?", [email]);
};

const getClientByCin = (cin) => {
    return pool.query("SELECT * FROM clients WHERE cin = ?", [cin]);
};

const createClient = (data) => {
    const { numero_permis, nom, prenom, email, telephone, cin } = data;
    return pool.query(
        "INSERT INTO clients (numero_permis, nom, prenom, email, telephone, cin) VALUES (?, ?, ?, ?, ?, ?)",
        [numero_permis, nom, prenom, email, telephone, cin]
    );
};

const updateClient = (data, numero_permis) => {
    const { nom, prenom, email, telephone, cin } = data;
    return pool.query(
        "UPDATE clients SET nom = ?, prenom = ?, email = ?, telephone = ?, cin = ? WHERE numero_permis = ?",
        [nom, prenom, email, telephone, cin, numero_permis]
    );
};

const deleteClient = (numero_permis) => {
    return pool.query(
        "UPDATE clients SET is_deleted = TRUE, deleted_at = NOW() WHERE numero_permis = ?",
        [numero_permis]
    );
};

module.exports = {
    getAllClients,
    getClientByNumeroPermis,
    getClientByEmail,
    getClientByCin,
    createClient,
    updateClient,
    deleteClient
};
