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

      //Notify sp
      // put app id in env or config file
      // get sp push token from DB
      // put the hole thing in a separate file
      axios
        .post("https://onesignal.com/api/v1/notifications", {
          app_id: "aac6ed8b-9b71-4cd7-95c4-dc0931101a87",
          include_player_ids: ["95bff5c7-8926-4391-8d98-7622aa667760"],
          data: intervention,
        })
        .then((res) => {
          console.log("sp notified !!!!!!");
        })
        .catch((err) => {
          console.log("An error occured while notifying sp");
        });

      // add intervention to sp & client
      // awaiting for these 2 requests will
      // slow response time down
      // console.log(intervention.client_id);
      await Client.findByIdAndUpdate(intervention.client_id, {
        $push: { interventions: intervention._id },
      });
      await ServiceProvider.findByIdAndUpdate(intervention.sp_id, {
        $push: { interventions: intervention._id },
      });
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
      console.log("Intervention canceled by client");
    });

    socket.on("refuse", async (int_id) => {
      const intervention = await Intervention.findByIdAndUpdate(
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
      const intervention = await Intervention.findByIdAndUpdate(
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
      const intervention = await Intervention.findByIdAndUpdate(
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

      socket.to(int_id).emit("validated", intervention);
      socket.emit("goReview");
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
