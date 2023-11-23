const hearted = require("../model/hearted.model");

exports.create = async (req, res) => {};

exports.findAll = async (req, res) => {
  const hearted = await hearted.find({});
  res.json({ hearted: accounts, statusCode: 200 });
};

exports.findOne = (req, res) => {};

exports.update = (req, res) => {};

exports.delete = (req, res) => {};
