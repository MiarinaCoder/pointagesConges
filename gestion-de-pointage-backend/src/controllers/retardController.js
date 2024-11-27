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

exports.updateJustification = async (req, res) => {
  try {
    const { idRetard } = req.params;
    const retardInfo = await Retard.updateJustification(idRetard);
    res.json(retardInfo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateDescription = async (req, res) => {
  try {
    const { idRetard } = req.params;
    const { description } = req.body;
    const result = await Retard.updateDescription(idRetard, description);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};