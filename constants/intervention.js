const pending = "pending";
const accepted = "accepted";
const refused = "refused";
const onGoing = "onGoing";
const finished = "finished";

const Regular = "Regular";
const Emergency = "Emergency";

exports.PENDING = pending;
exports.ACCEPTED = accepted;
exports.REFUSED = refused;
exports.ON_GOING = onGoing;
exports.FINISHED = finished;

exports.REGULAR = Regular;
exports.EMERGENCY = Emergency;

exports.INTERVENTION_STATES = [pending, accepted, refused, onGoing, finished];
exports.INTERVENTION_TYPES = [Regular, Emergency];
