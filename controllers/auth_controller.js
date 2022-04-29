const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const { User } = require("../models");
const db = require("../models");

router.get("/register", function (req, res) {
  return res.render("auth/register");
  //res.send("register page");
});

router.get("/login", function (req, res) {
  res.render("auth/login");
});

router.get("/logout", async function (req, res) {
  try {
    await req.session.destroy();
    return res.redirect("/auth/login");
  } catch (error) {
    console.log(error);
    return res.send(error);
  }
});

router.get("/:id/editprofile", async (req, res, next) => {
  try {
    const updatedUser = await db.User.findById(req.params.id);
    //console.log(updatedUser.profilePic);
    const context = { currentUser: updatedUser, id: req.params.id };
    return res.render("editProfile.ejs", context);
  } catch (error) {
    console.log(error);
    req.error = error;
    return next();
  }
});

router.post("/register", async function (req, res) {
  try {
    // step check if user exists
    const foundUser = await User.exists({ email: req.body.email });
    // if so redirect to login
    if (foundUser) {
      return res.redirect("/auth/login");
    }
    // if not create user and redirect to login

    // salt will created a more complicated hash
    const salt = await bcrypt.genSalt(12);
    // hash will convert our password into something more secure
    // test1234 => "$2a$10$5vR9VhGpkARz6EFPdkuNQ.aZNRGUgSCNSKEb9Xp1IKzrfxYETlkB2"
    const hash = await bcrypt.hash(req.body.password, salt);

    req.body.password = hash;

    // create user in database
    const newUser = await User.create(req.body);

    return res.redirect("/auth/login");
  } catch (err) {
    console.log(err);
    return res.send(err);
  }
});

//Login POST route
router.post("/login", async function (req, res) {
  try {
    // check if the user exists
    const foundUser = await User.findOne({ email: req.body.email });
    console.log(foundUser);
    // if not
    // redirect to register
    if (!foundUser) return res.redirect("/auth/register");

    // if the user exists
    // validate the user if passwords match -> login
    // .compare(body password, hashed password) => return true or false
    const match = await bcrypt.compare(req.body.password, foundUser.password);

    // if not match send error
    if (!match) return res.send("password invalid");

    // if match create the session and redirect to home\
    // here we have created the key card
    //console.log(`here is my ${req.session}`);
    req.session.currentUser = {
      id: foundUser._id,
      username: foundUser.username,
      profilePic: foundUser.profilePic
    };
    console.log(req.session.currentUser);
    return res.redirect("/home");
  } catch (err) {
    console.log(err);
    res.send(err);
  }
});



router.put("/:id", async (req, res, next) => {
  try {
    const updatedUser = await db.User.findByIdAndUpdate(
      req.params.id,
      req.body
    );
    console.log(updatedUser);
    //const updatedUsername = await db.Product.findByIdAndUpdate(req.params.id, req.body);

    return res.redirect(`/home`);
  } catch (error) {
    console.log(error);
    req.error = error;
    return next();
  }
});

//practice
router.put("/:id/deleteprofile", async (req,res,next) => {
  try {
    const updatedUser = await db.User.findById(
      req.params.id
      
    );
    console.log(updatedUser)
    updatedUser.updateOne(updatedUser, {$set: {profilePic:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdpRvftRBgfCbvzOHB0bANVih3QvZD-xZ4flbABUFGDctmaY87ajkJD5RhdvVcyZvkS7U&usqp=CAU'}})
    //updatedUser.profilePic = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdpRvftRBgfCbvzOHB0bANVih3QvZD-xZ4flbABUFGDctmaY87ajkJD5RhdvVcyZvkS7U&usqp=CAU'
    //req.session.currentUser.profilePic =  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdpRvftRBgfCbvzOHB0bANVih3QvZD-xZ4flbABUFGDctmaY87ajkJD5RhdvVcyZvkS7U&usqp=CAU'
    return res.redirect('/home');
  }catch (error) {
    console.log(error);
    req.error = error;
    return next();
  }
})

module.exports = router;
