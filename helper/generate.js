module.exports.generateAffiliateCode = () => {
  return Array.from({ length: 10 }, () => Math.random().toString(36)[2])
    .join("")
    .toUpperCase();
};
