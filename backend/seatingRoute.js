const express = require("express");
const EmailService = require("./emailService");
const PaymentService = require("./paymentService");

module.exports = (config) => {
  const router = express.Router();
  const db = config.database.db;
  const collection = db.collection("seats");
  const paymentService = new PaymentService(config);
  const emailService = new EmailService(config);

  router.get("/", (req, res) => {
    res.send("seating");
  });

  /**
   * puts a seat on hold to prevent it from being booked
   */
  router.post('/hold', async (req, res) => {    

    try {
        const {seat, price} = {...req.body};    
        const query = { name: 'cinemaA'};
        const update = { $push: { hold: seat}};        

        const result = await collection.updateOne(query, update, {upsert: true});
        const seatsOnHold = await collection.findOne(query);

        config.io.emit("ticket:hold", seatsOnHold.hold);

        res.send({data: null, message: result});
    } catch (error) {
        res.status(500).send({ data: null, error: error.message });
    }

  });

  /**
   * releases a seat that was previously on hold
   */
  router.post('/release', async (req, res) => {
    try {
        const {seat} = {...req.body};    
        const query = { name: 'cinemaA'};
        const update = { $pull: { hold: seat}};
                
        const result = await collection.updateOne(query, update);
        const seatsOnHold = await collection.findOne(query);
        
        config.io.emit("ticket:release", seatsOnHold.hold);

        res.send({data: null, message: result});
    } catch (error) {
        res.status(500).send({ data: null, error: error.message });
    }
  });

  /**
   * returns seating for a cinema
   */
  router.get("/:cinema", async (req, res) => {
    try {
      const cinema = req.params.cinema;

      const query = { name: cinema };

      const seatsResult = await collection.findOne(query);

      if (seatsResult) res.send({ data: seatsResult, message: null });
      else res.send({ data: null, message: "No record found" });
    } catch (error) {
      res.status(500).send({ data: null, error: error.message });
    }
  });

  router.post('/fake-purchase', async (req, res) => {
    try {
      const {
        seat,price,nonce
      } = {...req.body};
      const paymentService = new PaymentService(config);
      const paymentResult = await paymentService.sale({amount: price, nonce: nonce});

      console.log(paymentResult);

      if( paymentResult.success ) {
  
        res.send({ code: 0, data: null, message: "Your seat has been booked! Please check email." });      
      } else {
        res.send({ code: 1, data: null, message: paymentResult.message });      
      }


    } catch (error) {
      res.status(500).send({code: 1, error: error.message });
    }
  });

  router.post('/purchase', async (req, res) => {
    try {
      const {
        email,seat,price,nonce
      } = {...req.body};

      const paymentResult = await paymentService.sale({amount: price, nonce: nonce});

      if( paymentResult.success ) {
        

        // mark the seat as booked
        const query = { name: 'cinemaA'};
        const update = { $push: { booked: seat}};        
        const result = await collection.updateOne(query, update, {upsert: true});
        const seatsBooked = await collection.findOne(query);

        // send email
        await emailService.sendMail({
          to: email,
          bodytext: `Hello, thank you for booking your seat with TicketExpress.           
          Your seat is: ${seat}
          Confirmation number: ${Math.random() * 1000}`,
          bodyhtml: `Hello, thank you for booking your seat with <a href="#">TicketExpress</a>.           
          Your seat is: <strong>${seat}</strong>
          Confirmation number: <strong>${Math.random() * 1000}</strong>`
          
        });

        config.io.emit("ticket:booked", seatsBooked.booked);
  
        res.send({ code: 0, data: null, message: "Your seat has been booked! Please check email." });      
      } else {
        res.send({ code: 1, data: null, message: "Failed to process payment." });      
      }

    } catch (error) {
      res.status(500).send({code: 1, error: error.message });
    }
  });

  return router;
};
