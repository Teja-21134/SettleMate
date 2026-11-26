const Purchase = require("../models/Purchase");

const getPurchases = async (req, res) => {
  try {
    const purchases =
      await Purchase.find({ username: req.auth.username }).sort({
        createdAt: -1,
      });

    res.json(purchases);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const createPurchase = async (req, res) => {
  try {
    const purchase = await Purchase.create({
      ...req.body,
      username: req.auth.username,
    });

    res.status(201).json(
      purchase
    );
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const updatePurchase = async (req, res) => {
  try {
    const purchase = await Purchase.findOneAndUpdate(
      { _id: req.params.id, username: req.auth.username },
      { ...req.body, username: req.auth.username },
      { new: true, runValidators: true }
    );

    if (!purchase) {
      return res.status(404).json({ message: "Purchase not found." });
    }
    res.json(purchase);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const deletePurchase = async (req, res) => {
  try {
    const purchase = await Purchase.findOneAndDelete({
      _id: req.params.id,
      username: req.auth.username,
    });

    if (!purchase) {
      return res.status(404).json({ message: "Purchase not found." });
    }

    res.json({
      message:
        "Purchase Deleted",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getPurchases,
  createPurchase,
  updatePurchase,
  deletePurchase,
};