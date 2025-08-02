const pool = require('../connection');

const getAllClients = () => {
    return pool.query("SELECT * FROM clients WHERE is_deleted = FALSE");
};

const getClientById = (id) => {
    return pool.query("SELECT * FROM clients WHERE is_deleted = False AND id = ? ",[id]);
};

const createClient =(data) => {
    const { nom,prenom,email,telephone,cin} = data;
    return pool.query("INSERT INTO clients (nom ,prenom ,email, telephone, cin ) Values (? ,? ,? ,? ,?)",[nom,prenom,email,telephone,cin] );
} ;

const updateClient =(data,id) => {
    const { nom,prenom,email,telephone,cin} = data;
    return pool.query("Update clients SET nom = ? , prenom = ?, email = ?, telephone = ?, cin = ? WHERE id = ? ",[nom,prenom,email,telephone,cin,id]);
};

const removeClient =(id) =>{
    return pool.query("UPDATE clients SET is_deleted = TRUE, deleted_at = NOW() WHERE id = ? ",
    [id]);
}

module.exports ={
   getAllClients ,
   getClientById ,
   createClient ,
   updateClient ,
   removeClient
};