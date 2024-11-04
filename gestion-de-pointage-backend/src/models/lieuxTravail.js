const db = require('../config/db');

const LieuxTravail = {
  getAllLieux: () => {
    return db.query('SELECT * FROM lieuxTravail');
  },
};

module.exports = LieuxTravail;
