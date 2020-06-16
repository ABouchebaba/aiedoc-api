const { Intervention } = require("../models/intervention");
const { Client } = require("../models/client");
const { ServiceProvider } = require("../models/serviceProvider");
const {
  ACCEPTED,
  REFUSED,
  FINISHED,
  CANCELED,
  VALIDATED,
  EMERGENCY,
} = require("../constants/intervention");
const {
  EMERGENCY_READY,
  VALIDATED: SP_VALIDATED,
} = require("../constants/serviceProvider");
const { getDistance } = require("geolib");

module.exports = function (io) {
  // exploit io ...
  io.on("connection", (socket) => {
    console.log("A user connected");
    let nb = Object.keys(io.sockets.sockets).length;
    console.log(nb);

    socket.on("destroy", () => {
      socket.disconnect();
    });

    socket.on("disconnect", (reason) => {
      console.log("A user disconnected : " + reason);

      if (reason === "ping timeout") {
        // socket.connect();
      }
    });

    socket.on("initEmergency", async ({ int, location }) => {
      const client_location = {
        type: "Point",
        coordinates: [location.longitude, location.latitude],
      };

      let sps = await ServiceProvider.find({
        state: EMERGENCY_READY,
        status: VALIDATED,
        busy: false,
        services: { $in: int.services },
        location: {
          $near: {
            $geometry: client_location,
          },
        },
      });

      if (sps.length === 0) {
        socket.emit("NoSpAvailable");

        return;
      }

      let sp = sps[0];
      console.log("SP ::: ", sp);

      console.log("int : ", int);
      // save intervention to db
      const intervention = await Intervention.create({
        ...int,
        sp_id: sp._id,
        type: EMERGENCY,
        location: client_location,
      });
      console.log("intervention : ", intervention);

      // add intervention to sp & client
      const client = await Client.findByIdAndUpdate(
        intervention.client_id,
        {
          $push: { interventions: intervention._id },
        },
        { new: true }
      ).select("phone firstname lastname birthdate");

      sp = await ServiceProvider.findByIdAndUpdate(
        intervention.sp_id,
        {
          $push: { interventions: intervention._id },
        },
        { new: true }
      );

      const [lon, lat] = sp.location.coordinates;
      console.log(lon, lat);
      const distance = getDistance({ lat, lon }, location);
      console.log("dist", distance);
      //Notify sp
      sp.notify({ intervention, client, distance });

      socket.join(intervention._id);
      socket.emit("wait", intervention);
      console.log("Intervention initialized");

      console.log(sp);
    });

    socket.on("init", async ({ int, location }) => {
      let sp = await ServiceProvider.findById(int.sp_id);
      if (sp.busy) {
        socket.emit("SpBusy");
        return;
      }

      //TODO:  refactor client location
      const client_location = {
        type: "Point",
        coordinates: [location.longitude, location.latitude],
      };
      console.log("int : ", int);
      // save intervention to db
      const intervention = await Intervention.create({
        ...int,
        location: client_location,
      });
      console.log("intervention : ", intervention);

      // add intervention to sp & client
      const client = await Client.findByIdAndUpdate(
        intervention.client_id,
        {
          $push: { interventions: intervention._id },
        },
        { new: true }
      ).select("phone firstname lastname birthdate");

      const sp = await ServiceProvider.findByIdAndUpdate(
        intervention.sp_id,
        {
          $push: { interventions: intervention._id },
        },
        { new: true }
      );

      const [lon, lat] = sp.location.coordinates;
      console.log(lon, lat);
      const distance = getDistance({ lat, lon }, location);
      console.log("dist", distance);
      //Notify sp
      sp.notify({ intervention, client, distance });

      socket.join(intervention._id);
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
        console.log("Accept: inexisting intervention");
        return;
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
  });
};
