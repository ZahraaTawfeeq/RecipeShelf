const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const Recipes = require("../models/Recipe.js");
const bcrypt = require("bcrypt");
const isSignedIn = require('../middleware/is-signed-in')



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


  const user = await User.create(req.body);
  res.redirect("/auth/sign-in");
});


router.get("/sign-in", (req, res) => {
  res.render("auth/sign-in.ejs");
});


router.post("/sign-in", async (req, res) => {
  const userInDatabase = await User.findOne({ username: req.body.username });
  if (!userInDatabase) {
    return res.send("Login failed. Please try again.");
  }

  const validPassword = bcrypt.compareSync(
    req.body.password,
    userInDatabase.password
  );
  if (!validPassword) {
    return res.send("Login failed. Please try again.");
  }


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
    const hiddenRecipe = await Recipes.find({ creator: req.session.user._id, isHidden: true })

    const userFav = await Recipes.find({
      favorites: req.session.user._id
    }).populate('creator cuisine category favorites')

    res.render('profile/profile.ejs', { allUsersRecipes, userFav, user: req.session.user, hiddenRecipe })
  } catch (err) {
    console.log(`Cannot view profile ${err}`)
    res.redirect('/')
  }
})

router.get('/recipe-details/:id', async (req, res) => {
  try {
    const pickedRecipe = await Recipes.findById((req.params.id)).populate('category creator ingredients favorites')
    res.render('recipes/recipe-details.ejs', { pickedRecipe, user: req.session.user._id })
  } catch (err) {
    console.log(`Cannot get recipe details page: ${err}`)
    res.redirect('recipes/all-recipes')
  }
})

module.exports = router;
