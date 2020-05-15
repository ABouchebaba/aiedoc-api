const { Intervention } = require("../models/intervention");
const { Client } = require("../models/client");
const { ServiceProvider } = require("../models/serviceProvider");
const {
  ACCEPTED,
  REFUSED,
  FINISHED,
  CANCELED,
  VALIDATED,
} = require("../constants/intervention");
const axios = require("axios");

module.exports = function (io) {
  // exploit io ...
  io.on("connection", (socket) => {
    console.log("A user connected");

    socket.on("init", async (int) => {
      // save intervention to db
      const intervention = await Intervention.create(int);

      // add intervention to sp & client
      // awaiting for these 2 requests will
      // slow response time down
      // console.log(intervention.client_id);
      await Client.findByIdAndUpdate(intervention.client_id, {
        $push: { interventions: intervention._id },
      });
      const sp = await ServiceProvider.findByIdAndUpdate(
        intervention.sp_id,
        {
          $push: { interventions: intervention._id },
        },
        { new: true }
      );

      //Notify sp
      sp.notify(intervention);

      socket.join(intervention._id);
      //Notify Sp
      socket.emit("wait", intervention);
      console.log("Intervention initialized");
    });

    socket.on("cancel", async (int_id) => {
      const intervention = await Intervention.findByIdAndUpdate(
        int_id,
        { state: CANCELED },
        { new: true }
      );
      if (!intervention) {
        // Handle Error
        console.log("CANCEL: inexisting intervention");
      }
      socket.emit("canceled", intervention);
      socket.to(int_id).emit("canceled", int_id);
      console.log("Intervention canceled by client");
    });

    socket.on("refuse", async (int_id) => {
      let intervention = await Intervention.findById(int_id);

      if (intervention.state === CANCELED) {
        // user canceled the intervention
        socket.emit("canceled");
        console.log("REFUSING : Intervention canceled by client");
        return;
      }

      intervention = await Intervention.findByIdAndUpdate(
        int_id,
        { state: REFUSED },
        { new: true }
      );
      if (!intervention) {
        // Handle Error
        console.log("Remove : inexisting intervention");
      }
      socket.join(int_id);
      socket.to(int_id).emit("refused", int_id);
      socket.emit("refused", int_id);
      socket.leave(int_id);
      console.log("Intervention refused by Sp");
    });

    socket.on("leave", (int_id) => {
      socket.leave(int_id);
      socket.disconnect();
      console.log("User has left room : " + int_id);
    });

    socket.on("join", (int_id) => {
      socket.join(int_id);
      console.log("User joined room : " + int_id);
    });

    socket.on("accept", async (int_id) => {
      let intervention = await Intervention.findById(int_id);

      if (intervention.state === CANCELED) {
        // user canceled the intervention
        socket.emit("canceled");
        console.log("ACCEPTING : Intervention canceled");
        return;
      }

      intervention = await Intervention.findByIdAndUpdate(
        int_id,
        { state: ACCEPTED },
        { new: true }
      );
      if (!intervention) {
        // Handle Error
        console.log("Accept: inexisting intervention");
      }
      socket.join(int_id);
      socket.to(int_id).emit("accepted", intervention);
      socket.emit("goWait", intervention);
      console.log("Intervention accepted by sp");
    });

    socket.on("finish", async (int_id) => {
      let intervention = await Intervention.findById(int_id);

      if (intervention.state === CANCELED) {
        // user canceled the intervention
        socket.emit("canceled");
        console.log("FINISHING : Intervention canceled by client");
        return;
      }
      intervention = await Intervention.findByIdAndUpdate(
        int_id,
        { state: FINISHED },
        { new: true }
      );
      if (!intervention) {
        // Handle Error
        console.log("Finish: inexisting intervention");
      }

      socket.join(int_id);
      socket.to(int_id).emit("finished", intervention);
      socket.emit("goFacture", intervention);
      console.log("Intervention finished by Sp");
    });

    socket.on("validate", async ({ int_id, services, total_price }) => {
      const intervention = await Intervention.findByIdAndUpdate(
        int_id,
        { services, totalPrice: total_price, state: VALIDATED },
        { new: true }
      );
      if (!intervention) {
        // Handle Error
        console.log("Validate: inexisting intervention");
      }

      const sp = await ServiceProvider.findByIdAndUpdate(
        intervention.sp_id,
        {
          $inc: { balance: total_price },
        },
        {
          new: true,
        }
      );

      socket.to(int_id).emit("validated", intervention);
      socket.emit("goReview", { intervention, sp });
      console.log("Intervention validated by Sp");
    });

    socket.on("clientReview", async ({ int_id, comment, rating }) => {
      const intervention = await Intervention.findByIdAndUpdate(
        int_id,
        { client_comment: comment, client_rating: rating },
        { new: true }
      );
      if (!intervention) {
        // Handle Error
        console.log("Client Review: inexisting intervention");
      }

      socket.emit("goHome");
      console.log("Intervention reviewed by Client");
    });

    socket.on("spReview", async ({ int_id, comment, rating }) => {
      const intervention = await Intervention.findByIdAndUpdate(
        int_id,
        { sp_comment: comment, sp_rating: rating },
        { new: true }
      );
      if (!intervention) {
        // Handle Error
        console.log("Sp Review: inexisting intervention");
      }

      socket.emit("goHome");
      console.log("Intervention reviewed by Sp");
    });

    socket.on("resync", async (int_id) => {
      const intervention = await Intervention.findById(int_id);
      if (!intervention) {
        console.log("Resync: inexisting intervention");
      }
      socket.join(int_id);
      socket.emit("resync", intervention);
      console.log("Resync : " + intervention._id);
    });

    socket.on("disconnect", (reason) => {
      console.log("A user disconnected : " + reason);
      if (reason === "ping timeout") {
        // socket.connect();
      }
    });
  });
};
