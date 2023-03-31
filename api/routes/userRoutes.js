const User = require("../models/user");
const Branch = require("../models/branch");
const router = require("express").Router();
const {
  emailConfirmation,
  passwordUpdate,
} = require("../config/emailConfirmation");
const mapUser = require("../config/userMapped");
const jwt = require("jsonwebtoken");

router.post("/register", async (req, res) => {
  try {
    const userCreated = await User.create(req.body);
    return res.status(200).send(`User registered successfully`);
  } catch (error) {
    console.error(error);
  }
});

router.get("/all-users", async (req, res) => {
  try {
    const users = await User.find().exec();
    const allUsers = mapUser(users);
    return res.send(allUsers);
  } catch (error) {
    console.error(error);
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email: email });
    if (!user) return res.status(401).send(`User not found`);
    const validatedUser = await user.validatePassword(password);
    if (!validatedUser)
      return res.status(401).send(`No authorization, Invalid credentials`);
    return res.status(200).send(user);
  } catch {
    return res.status(404).send("User not found");
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const userFound = await User.findById(id);
    const selectedUser = mapUser([userFound]);
    return res.send(selectedUser);
  } catch (error) {
    console.error(error);
  }
});

router.put("/:id", async (req, res) => {
  // Recibimos por req.body newPassword, idUser
  const { password } = req.body;
  try {
    const userPasswordUpdate = await User.findByIdAndUpdate(
      { _id: req.params.id },
      {
        password,
      },
      { new: true }
    );
    await userPasswordUpdate.save();
    return res.send(`Password was successfully updated`);
  } catch (error) {
    console.error(error);
  }
  // } else if (req.body.phone && req.body.password) {
  //   const { phone, password } = req.body;
  //   try {
  //     const userPasswordUpdate = await User.findByIdAndUpdate(
  //       { _id: req.params.id },
  //       {
  //         password,
  //         phone,
  //       },
  //       { new: true }
  //     );
  //     await userPasswordUpdate.save();
  //     return res.send(`Password was successfully updated`);
  //   } catch (error) {
  //     console.error(error);
  //   }
  // }
});

router.post("/appointmentBooked", async (req, res) => {
  emailConfirmation();
});

router.post("/password-update", async (req, res) => {
  const { email } = req.body;
  try {
    const selectedUser = await User.findOne({ email });
    passwordUpdate(email, selectedUser._id);
    res.send(`Email de actualizacion de contraseña enviado`);
  } catch {
    return res.status(400).send({ message: "Invalid email" });
  }
});

router.get("/email/token", async (req, res) => {
  // Recibo por params id Usuario const {id} = req.params
  const { token } = req.query;
  try {
    const decodeUser = jwt.verify(token, "Matias");
    res.status(200).send(decodeUser);
  } catch (error) {
    return res.status(400).send({ message: "Invalid token" });
  }
});

router.get("/email/:email", async (req, res) => {
  // Recibo por params id Usuario const {id} = req.params
  const email = req.params.email;
  try {
    if (!email) {
      return res.status(400).send({ message: "email cannot be undefined" });
    }
    const userFound = await User.findOne({ email: email }).exec();
    if (!userFound) {
      return res
        .status(400)
        .send({ message: "the email passed is not from any saved user" });
    }
    return res.status(200).send(userFound);
  } catch (error) {
    console.error(error);
  }
});

module.exports = router;
