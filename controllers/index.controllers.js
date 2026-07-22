const router = require("express").Router();
const User = require('../models/user.js');
const Recipe = require('../models/Recipe.js');


router.get('/', async (req, res) => {
    try {
        const userCount = await User.countDocuments();
        const recipeCount = await Recipe.countDocuments();

        res.render('homepage.ejs', {
            userCount,
            recipeCount
        });

    } catch (err) {
        console.log(err);
        res.redirect('/');
    }
});

module.exports = router;