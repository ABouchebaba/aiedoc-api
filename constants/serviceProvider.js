/// DECLARING CONSTANTS
const notReady = "notReady";
const ready = "ready";
const emergencyReady = "emergencyReady";

const notValidated = "not validated";
const validated = "validated";
const banned = "banned";

const License = "License";
const Master = "Master";
const Doctorat = "Doctorat";
const Technicien = "Technicien";

/// EXPORTING CONSTANTS
exports.NOT_READY = notReady;
exports.READY = ready;
exports.EMERGENCY_READY = emergencyReady;

exports.NOT_VALIDATED = notValidated;
exports.VALIDATED = validated;
exports.BANNED = banned;

exports.LICENSE = License;
exports.MASTER = Master;
exports.DOCTORAT = Doctorat;
exports.TECHNICIEN = Technicien;

/// EXPORTING SETS OF CONSTANTS
exports.STATES = [notReady, ready, emergencyReady];
exports.STATUSES = [notValidated, validated, banned];
exports.DIPLOMAS = [License, Master, Doctorat, Technicien];

exports.WILAYAS = [
  "Adrar",
  "Chlef",
  "Laghouat",
  "Oum El Bouaghi",
  "Batna",
  "Béjaïa",
  "Biskra",
  "Béchar",
  "Blida",
  "Bouira",
  "Tamanrasset",
  "Tébessa",
  "Tlemcen",
  "Tiaret",
  "Tizi Ouzou",
  "Alger",
  "Djelfa",
  "Jijel",
  "Sétif",
  "Saïda",
  "Skikda",
  "Sidi Bel Abbès",
  "Annaba",
  "Guelma",
  "Constantine",
  "Médéa",
  "Mostaganem",
  "M'Sila",
  "Mascara",
  "Ouargla",
  "Oran",
  "El Bayadh",
  "Illizi",
  "Bordj Bou Arreridj",
  "Boumerdès",
  "El Tarf",
  "Tindouf",
  "Tissemsilt",
  "El Oued",
  "Khenchela",
  "Souk Ahras",
  "Tipaza",
  "Mila",
  "Aïn Defla",
  "Naâma",
  "Aïn Témouchent",
  "Ghardaïa",
  "Relizane",
];
