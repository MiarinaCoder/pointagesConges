const Verification = require('../models/verificationModel');

exports.createVerification = async (req, res) => {
  try {
    const idUtilisateur = req.user.id;
    const aRepondu=(req.user.verified===true)?1:0;
    console.log("aaaaa:",aRepondu);
    const verificationId = await Verification.create(idUtilisateur, aRepondu);
    res.status(201).json({ 
      idVerification: verificationId,
      message: 'Verification created successfully' 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.respondToVerification = async (req, res) => {
  try {
    const { idVerification } = req.params;
    const { aRepondu } = req.body;
    await Verification.updateResponse(idVerification, aRepondu);
    res.json({ message: 'Response recorded successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getUserVerifications = async (req, res) => {
  try {
    const idUtilisateur = req.user.id;
    const verifications = await Verification.getByUser(idUtilisateur);
    res.json(verifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
