const express = require("express");
const router = express.Router();
const { User } = require("../models/user");
const Joi = require("joi");
const bcrypt = require("bcrypt");

router.post("/signup", async (req, res) => {
  try {
    const { error } = validateSignup(req.body);
    if (error)
      return res.status(400).send({ message: error.details[0].message });

    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser)
      return res
        .status(409)
        .send({ message: "User with given email already exists!" });

    const salt = await bcrypt.genSalt(Number(process.env.SALT_ROUNDS));
    const hashPassword = await bcrypt.hash(req.body.password, salt);

    const newUser = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: hashPassword,
    });

    await newUser.save();
    res.status(201).send({ message: "User created successfully!" });
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error!" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { error } = validateLogin(req.body);
    if (error)
      return res.status(400).send({ message: error.details[0].message });

    const user = await User.findOne({ email: req.body.email });
    if (!user)
      return res.status(401).send({ message: "INVALID EMAIL OR PASSWORD!" });

    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!validPassword)
      return res.status(401).send({ message: "INVALID EMAIL OR PASSWORD!" });

    const token = user.generateAuthToken();
    res.status(200).send({ data: token, message: "LOGGED IN SUCCESSFULLY!" });
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error!" });
  }
});

const validateSignup = (data) => {
  const schema = Joi.object({
    firstName: Joi.string().required().label("FIRST NAME"),
    lastName: Joi.string().required().label("LAST NAME"),
    email: Joi.string().email().required().label("EMAIL"),
    password: Joi.string()
      .required()
      .label("PASSWORD")
      .min(8)
      .max(20)
      .required(),
  });
  return schema.validate(data);
};

const validateLogin = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().required().label("EMAIL"),
    password: Joi.string()
      .required()
      .label("PASSWORD")
      .min(8)
      .max(20)
      .required(),
  });
  return schema.validate(data);
};

module.exports = router;
