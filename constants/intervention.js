const pending = "pending";
const accepted = "accepted";
const canceled = "canceled";
const refused = "refused";
const finished = "finished";
const validated = "validated";

const Regular = "Regular";
const Emergency = "Emergency";

exports.PENDING = pending;
exports.ACCEPTED = accepted;
exports.CANCELED = canceled;
exports.REFUSED = refused;
exports.FINISHED = finished;
exports.VALIDATED = validated;

exports.REGULAR = Regular;
exports.EMERGENCY = Emergency;

exports.INTERVENTION_STATES = [
  pending,
  accepted,
  canceled,
  refused,
  finished,
  validated,
];
exports.INTERVENTION_TYPES = [Regular, Emergency];
