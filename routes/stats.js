const express = require("express");
const router = express.Router();
const { Client } = require("../models/client");
const { ServiceProvider } = require("../models/serviceProvider");
const { Intervention } = require("../models/intervention");
const { Command } = require("../models/command");

router.get("/users/week", async (req, res) => {
  const days = 7;
  const date = new Date(new Date() - days * 60 * 60 * 24 * 1000);

  const clients = await Client.countDocuments({
    createdAt: { $gte: date },
  });

  const sps = await ServiceProvider.countDocuments({
    createdAt: { $gte: date },
  });

  const interventions = await Intervention.countDocuments({
    createdAt: { $gte: date },
  });

  const commands = await Command.countDocuments({
    createdAt: { $gte: date },
  });

  const result = {
    clients,
    sps,
    interventions,
    commands,
  };
  res.send(result);
});

router.get("/users/month", async (req, res) => {
  const days = 365;
  const date = new Date(new Date() - days * 60 * 60 * 24 * 1000);

  let clients = await Client.aggregate([
    {
      $match: {
        createdAt: { $gte: date },
      },
    },
    {
      $group: {
        _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
        count: { $sum: 1 },
      },
    },
  ]);
  let sps = await ServiceProvider.aggregate([
    {
      $match: {
        createdAt: { $gte: date },
      },
    },
    {
      $group: {
        _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
        count: { $sum: 1 },
      },
    },
  ]);

  clients = clients.map(({ count, _id }) => ({
    count,
    month: _id.month,
    year: _id.year,
  }));

  sps = sps.map(({ count, _id }) => ({
    count,
    month: _id.month,
    year: _id.year,
  }));

  res.send({ clients, sps });
});

router.get("/users/total", async (req, res) => {
  let tmp = await ServiceProvider.aggregate([
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
      },
    },
  ]);

  let sps = {};
  tmp.map((e) => {
    sps[e._id] = e.count;
  });

  let clients = await Client.countDocuments();

  res.send({ sps, clients });
});

router.get("/interventions/total", async (req, res) => {
  let tmp = await Intervention.aggregate([
    {
      $group: {
        _id: null,
        count: { $sum: 1 },
        sum: { $sum: "$totalPrice" },
      },
    },
  ]);
  let regulars = await Intervention.aggregate([
    {
      $match: {
        type: "Regular",
      },
    },
    {
      $group: {
        _id: null,
        count: { $sum: 1 },
      },
    },
  ]);

  const result = {
    total: tmp[0].count,
    sum: tmp[0].sum,
    regularCount: regulars[0].count,
    emergencyCount: tmp[0].count - regulars[0].count,
  };

  res.send(result);
});

router.get("/interventions/month", async (req, res) => {
  const days = 365;
  const date = new Date(new Date() - days * 60 * 60 * 24 * 1000);

  let interventions = await Intervention.aggregate([
    {
      $match: {
        createdAt: { $gte: date },
      },
    },
    {
      $group: {
        _id: {
          type: "$type",
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
        },
        count: { $sum: 1 },
      },
    },
  ]);

  let result = { Regular: [], Emergency: [] };

  interventions.map(({ count, _id }) => {
    result[_id.type] = [
      ...result[_id.type],
      {
        count,
        month: _id.month,
        year: _id.year,
      },
    ];
  });

  res.send(result);
});

router.get("/commands/total", async (req, res) => {
  const tmp = await Command.aggregate([
    {
      $group: {
        _id: null,
        sum: { $sum: "$total_price" },
        count: { $sum: 1 },
      },
    },
  ]);

  let total = {
    count: tmp[0].count,
    sum: tmp[0].sum,
  };

  res.send(total);
});

module.exports = router;
