const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const Recipes = require("../models/Recipe.js");
const bcrypt = require("bcrypt");
const isSignedIn = require('../middleware/is-signed-in')



// Sign up routes
router.get("/sign-up", (req, res) => {
  res.render("auth/sign-up.ejs");
});

router.post("/sign-up", async (req, res) => {
  const userInDatabase = await User.findOne({ username: req.body.username });
  if (userInDatabase) {
    return res.send("Username already taken.");
  }

  if (req.body.password !== req.body.confirmPassword) {
    return res.send("Password and Confirm Password must match");
  }

  const hashedPassword = bcrypt.hashSync(req.body.password, 10);
  req.body.password = hashedPassword;

  // validation logic

  const user = await User.create(req.body);
  res.redirect("/auth/sign-in");
});



// Sign in routes
router.get("/sign-in", (req, res) => {
  res.render("auth/sign-in.ejs");
});



router.post("/sign-in", async (req, res) => {
  // First, get the user from the database
  const userInDatabase = await User.findOne({ username: req.body.username });
  if (!userInDatabase) {
    return res.send("Login failed. Please try again.");
  }

  // There is a user! Time to test their password with bcrypt
  const validPassword = bcrypt.compareSync(
    req.body.password,
    userInDatabase.password
  );
  if (!validPassword) {
    return res.send("Login failed. Please try again.");
  }

  // There is a user AND they had the correct password. Time to make a session!
  // Avoid storing the password, even in hashed format, in the session
  // If there is other data you want to save to `req.session.user`, do so here!
  req.session.user = {
    username: userInDatabase.username,
    _id: userInDatabase._id
  };

  res.redirect("/");
});


router.get("/sign-out", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

router.get('/profile', isSignedIn, async (req, res) => {
  try {
    const allUsersRecipes = await Recipes.find({ creator: req.session.user._id }).populate('creator cuisine category favorites')

    const userFav = await Recipes.find({
      favorites: req.session.user._id
    }).populate('creator cuisine category favorites')

    res.render('profile/profile.ejs', { allUsersRecipes, userFav, user: req.session.user })
  } catch (err) {
    console.log(`Cannot view profile ${err}`)
    res.redirect('/')
  }
})

// get specific recipe details page
router.get('/recipe-details/:id', async (req, res) => {
  try {
    // get the picked recipe by ad and populate references
    const pickedRecipe = await Recipes.findById((req.params.id)).populate('category creator ingredients favorites')

    // go to recipe details page
    res.render('recipes/recipe-details.ejs', { pickedRecipe, user: req.session.user._id })
  } catch (err) {
    console.log(`Cannot get recipe details page: ${err}`)
    res.redirect('recipes/all-recipes')
  }
})



module.exports = router;
