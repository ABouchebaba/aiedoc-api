const { v4: uuidv4 } = require("uuid");

module.exports.save = async function (files, basepath, prefix = "") {
  if (!files) return [];
  return Promise.all(
    Object.keys(files).map((key) => saveOne(files[key], basepath, prefix))
  );
};

const saveOne = async function (item, basepath, prefix = "") {
  return await saveAsync(item, basepath, prefix);
};
module.exports.saveOne = saveOne;

module.exports.saveAs = function (item, basepath, name) {
  const ext = item.name.split(".").pop();
  const filename = name + "." + ext;

  return new Promise(function (resolve, reject) {
    item
      .mv(`public/${basepath}/${filename}`)
      .then(() => resolve(`${basepath}/${filename}`))
      .catch((err) => reject(err));
  });
};

const saveAsync = async function (item, basepath, prefix) {
  return new Promise(function (resolve, reject) {
    const filename = `${uuidv4()}___${item.name}`;
    const filepath = `${basepath}/${filename}`;

    const result = {
      path: filepath,
      type: item.type,
      name: item.name,
    };

    item
      .mv(`public/${filepath}`)
      .then(() => resolve(filepath))
      .catch((err) => reject(err));
  });
};
