const Satyavamma =
  require("../models/Satyavamma");

const getEntries = async (
  req,
  res
) => {
  try {
    const entries =
      await Satyavamma.find({ username: req.auth.username }).sort({
        createdAt: -1,
      });

    res.json(entries);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const createEntry = async (
  req,
  res
) => {
  try {
    const entry = await Satyavamma.create({
      ...req.body,
      username: req.auth.username,
    });

    res.status(201).json(
      entry
    );
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const updateEntry = async (
  req,
  res
) => {
  try {
    const entry = await Satyavamma.findOneAndUpdate(
      { _id: req.params.id, username: req.auth.username },
      { ...req.body, username: req.auth.username },
      { new: true, runValidators: true }
    );

    if (!entry) {
      return res.status(404).json({ message: "Entry not found." });
    }
    res.json(entry);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const deleteEntry = async (
  req,
  res
) => {
  try {
    const entry = await Satyavamma.findOneAndDelete({
      _id: req.params.id,
      username: req.auth.username,
    });

    if (!entry) {
      return res.status(404).json({ message: "Entry not found." });
    }

    res.json({
      message:
        "Entry Deleted",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getEntries,
  createEntry,
  updateEntry,
  deleteEntry,
};