const Satyavamma =
  require("../models/Satyavamma");

const getEntries = async (
  req,
  res
) => {
  try {
    const entries =
      await Satyavamma.find().sort({
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
    const entry =
      await Satyavamma.create(
        req.body
      );

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
    const entry =
      await Satyavamma.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );

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
    await Satyavamma.findByIdAndDelete(
      req.params.id
    );

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