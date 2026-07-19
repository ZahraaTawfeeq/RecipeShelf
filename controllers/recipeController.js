const router = require("express").Router()
const Ingredient = require('../models/Ingredient')
const Recipe = require('../models/Recipe')
const Category = require('../models/Category')

const isSignedIn = require('../middleware/is-signed-in')
const multer = require("multer")
const path = require("path");

const storage = multer.diskStorage({
    destination: "public/images",
    filename: (req, file, cb) => {
        return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
    },
});
const upload = multer({ storage: storage });


const cuisines = [
    { name: "American" },
    { name: "Arabic" },
    { name: "Brazilian" },
    { name: "British" },
    { name: "Caribbean" },
    { name: "Chinese" },
    { name: "French" },
    { name: "German" },
    { name: "Greek" },
    { name: "Indian" },
    { name: "Indonesian" },
    { name: "Italian" },
    { name: "Japanese" },
    { name: "Korean" },
    { name: "Lebanese" },
    { name: "Mediterranean" },
    { name: "Mexican" },
    { name: "Middle Eastern" },
    { name: "Moroccan" },
    { name: "Persian" },
    { name: "Spanish" },
    { name: "Thai" },
    { name: "Turkish" },
    { name: "Vietnamese" }
]

router.get('/all-recipes', async (req, res) => {
    const allRecipes = await Recipe.find({}).populate('creator cuisine category')
    res.render('recipes/all-recipes.ejs', { allRecipes })
})

router.get('/new-recipe', isSignedIn, async (req, res) => {
    const allIngredients = await Ingredient.find({})
    const allCategories = await Category.find({})
    const allCuisines = cuisines
    res.render('recipes/new-recipe.ejs', { allIngredients, allCuisines, allCategories })
})

router.post('/new', isSignedIn, upload.single("image"), async (req, res) => {
    const newRecipe = {
        name: req.body.name,
        description: req.body.description,
        instructions: req.body.instructions,
        serving: req.body.serving,
        cookTime: req.body.cookTime,
        prepTime: req.body.prepTime,
        cuisine: req.body.cuisine,
        category: req.body.category,
        ingredients: [].concat(req.body.ingredients || []),
        image: req.file.filename,
        creator: req.session.user._id
    }
    await Recipe.create(newRecipe)
    res.redirect('/')
})

module.exports = router;
