const Retard = require('../models/retard');

exports.checkRetard = async (req, res) => {
  try {
    const idSession = req.params.sessionId;
    if (!idSession) {
      return res.status(400).json({ message: 'Session ID is required' });
    }
    const retardInfo = await Retard.checkRetard(idSession);
    res.json(retardInfo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
