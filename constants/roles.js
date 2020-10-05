const admin = "admin";
const moderateur = "moderateur";
const modCom = "modCom";
const modService = "modService";
const modSap = "modSap";

const client = "client";
const sp = "sp";

exports.ADMIN = admin;
exports.MODERATEUR = moderateur;
exports.MODCOM = modCom; //commercial-acheteur
exports.MODSERVICE = modService; // chargé service
exports.MODSAP = modSap; // Service apres vente

exports.CLIENT = client;
exports.SP = sp;

exports.ALL = [client, sp, admin, moderateur];
exports.ADMINS = [admin, moderateur];
exports.ALLROLES = [admin, moderateur, modService, modSap, modCom];
exports.STORE = [admin, modCom]; // acces boutique
exports.INTERVENTIONS = [admin, modService, modSap]; // préstation seulement
exports.COMMANDES = [admin, modSap, modCom]; //service après vente (commandes )
