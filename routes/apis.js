const e = require("express");
const express = require("express");
const SellBuy = require("../mongoose/models/sellBuy");
// setting up the router
const sellAndBuyRouter = new express.Router();
// code goes here for routes
// GET
sellAndBuyRouter.get("/sellProduct", async (req, res) => {
  if (req.query.product) {
    const data = await SellBuy.find({ productName: req.query.product });
    return res.send(data);
  }

  if (req.query.sortBy) {
    if (req.query.sortBy === "lowerCostPrice") {
      const data = await SellBuy.find().sort({ costPrice: 1 });
      return res.send(data);
    }
    if (req.query.sortBy === "higherCostPrice") {
      const data = await SellBuy.find().sort({ costPrice: -1 });
      return res.send(data);
    }
    if (req.query.sortBy === "lowerSoldPrice") {
      const data = await SellBuy.find().sort({ soldPrice: 1 });
      return res.send(data);
    }
    if (req.query.sortBy === "higherSoldPrice") {
      const data = await SellBuy.find().sort({ soldPrice: -1 });
      return res.send(data);
    }
  }
  if (!req.query.product) {
    try {
      const data = await SellBuy.find({});
      return res.send(data);
    } catch (e) {
      res.status(500).send();
    }
  }
});
// POST
sellAndBuyRouter.post("/sellProduct", async (req, res) => {
  const data = new SellBuy(req.body);
  if (req.body.productName.length < 4) {
    return res
      .status(400)
      .json({ error: "product name should have minimum of four characters" });
  }
  if (req.body.costPrice * 1 <= 0) {
    return res
      .status(400)
      .json({ error: "cost price value cannot be zero or negative value" });
  }
  await data.save();
  res.status(201).json({ message: "Product Added" });
});
// DELETE
sellAndBuyRouter.delete("/sellProduct/:id", async (req, res) => {
  try {
    const data = await SellBuy.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Deleted successfully" });
  } catch (e) {
    res.status(400).send();
  }
});
// PATCH
sellAndBuyRouter.patch("/sellProduct/:id", async (req, res) => {
  try {
    if (req.body.soldPrice <= 0) {
      return res
        .status(400)
        .json({ error: "sold price value cannot be zero or negative value" });
    }
    const data = await SellBuy.findByIdAndUpdate(req.params.id, req.body);
    res.status(200).json({ message: "Updated Successfully" });
  } catch (e) {
    res.status(400).send();
  }
});

// exporting the router
module.exports = sellAndBuyRouter;

const express = require("express");
const Course = require("../mongoose/models/courses");
//setting up the student router
const usersRouter = new express.Router();
//write your code here
usersRouter.post("/courses/enroll/:id", async (req, res) => {
  const course = await Course.findById(req.params.id);
  if (course.isApplied === true) {
    return res.status(403).json({
      error: "You have already applied for this course",
    });
  }
  course.isApplied = true;
  await course.save();
  res.status(200).json({
    message: "You have successfully enrolled for the course",
  });
});

usersRouter.delete("/courses/drop/:id", async (req, res) => {
  const course = await Course.findById(req.params.id);
  if (course.isApplied === false) {
    return res.status(403).json({
      error: "You have not enrolled for this course",
    });
  }
  course.isApplied = false;
  await course.save();
  res.status(200).json({
    message: "You have dropped the course",
  });
});
usersRouter.get("/courses/get", async (req, res) => {
  try {
    const courses = await Course.find();
    res.status(200).send(courses);
  } catch (e) {
    res.status(400).send();
  }
});
usersRouter.patch("/courses/rating/:id", async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (course.isApplied === false) {
      return res.status(403).json({
        error: "You have not enrolled for this course",
      });
    }
    if (course.isRated === true) {
      return res.status(403).json({
        error: "You have already rated this course",
      });
    }
    course.isRated = true;
    course.noOfRatings = req.body.noOfRatings * 1 + 1;
    course.rating = req.body.rating * 1;
    // course.rating = 4.2
    await course.save();
    res.status(200).json({
      message: "You have rated this course",
    });
  } catch (e) {
    res.status(400).send();
  }
});
module.exports = usersRouter;
