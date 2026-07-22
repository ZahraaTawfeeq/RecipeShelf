// -------------------- Imports --------------------//
const router = require("express").Router()
const Ingredient = require('../models/Ingredient')
const Recipe = require('../models/Recipe')
const Category = require('../models/Category')
const isSignedIn = require('../middleware/is-signed-in')

// Image Upload imports
const multer = require("multer")
const path = require("path")

const storage = multer.diskStorage({
    destination: "public/images",
    filename: (req, file, cb) => {
        return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
    },
})
const upload = multer({ storage: storage })

// Cuisines Array
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

//--------- GET ---------//

// get all recipes
router.get('/all-recipes', async (req, res) => {
    try {
        // get all recipes that is not hidden
        const allRecipes = await Recipe.find({ isHidden: false }).populate('creator cuisine category')
        const category = await Category.find({})
        // go to all recipes page
        res.render('recipes/all-recipes.ejs', {
            allRecipes,
            category,
            cuisines
        })
    }
    catch (err) {
        console.log(`Cannot get all recipes: ${err}`)
        res.redirect('/')
    }
})

// get new recipe page
router.get('/new-recipe', isSignedIn, async (req, res) => {
    try {
        const allIngredients = await Ingredient.find({}).sort({
            name: 1
        })

        const allIngCateg = []

        for (let oneIng of allIngredients) {
            if (!allIngCateg.includes(oneIng.category)) {
                allIngCateg.push(oneIng.category)
            }
        }
        const allCategories = await Category.find({})
        const allCuisines = cuisines

        res.render('recipes/new-recipe.ejs', {
            allIngredients,
            allIngCateg,
            allCategories,
            allCuisines
        })

    } catch (err) {
        console.log(err)
        res.redirect('/recipes/all-recipes')
    }
})

// get specific recipe details page
router.get('/recipe-details/:id', async (req, res) => {
    try {
        // get the picked recipe by ad and populate references
        const pickedRecipe = await Recipe.findById((req.params.id)).populate('category creator ingredients favorites review.creator')

        // go to recipe details page
        res.render('recipes/recipe-details.ejs', { pickedRecipe, user: req.session.user._id })
    } catch (err) {
        console.log(`Cannot get recipe details page: ${err}`)
        res.redirect('recipes/all-recipes')
    }
})

// get update recipe page
router.get('/:id/edit', isSignedIn, async (req, res) => {
    try {
        // get a specific recipe to update
        const pickedRecipe = await Recipe.findById(req.params.id).populate('category ingredients creator')

        // check if the recipe creator is the logged in user
        if (pickedRecipe.creator.equals(req.session.user._id)) {
            const allIngredients = await Ingredient.find({}).sort({
                name: 1
            })

            const allIngCateg = []

            for (let oneIng of allIngredients) {
                if (!allIngCateg.includes(oneIng.category)) {
                    allIngCateg.push(oneIng.category)
                }
            }
            // fetch ingredients, categories, and cuisines
            const allCategories = await Category.find({})
            // const allIngredients = await Ingredient.find({})
            const allCuisines = cuisines
            // go to update recipe page
            res.render('recipes/update-recipe.ejs', {
                pickedRecipe, allCategories, allIngredients, allCuisines, user: req.session.user._id
                , allIngCateg
            })
        } else {

            // if not the creator redirect to all recipes page
            res.redirect('/recipes/all-recipes')
        }
    } catch (err) {
        console.log(`Cannot get update recipe page: ${err}`)
        res.redirect('recipes/all-recipes')
    }
})
router.get('/filter', async (req, res) => {
    try {
        const filter = {}

        if (req.query.category) filter.category = req.query.category
        if (req.query.cuisine) filter.cuisine = req.query.cuisine

        if (req.query.ingredient) {
            const ingredient = await Ingredient.findOne({
                name: {
                    $regex: req.query.ingredient,
                    $options: "i"
                }
            })

            if (!ingredient) {
                return res.render("recipes/all-recipes.ejs", {
                    allRecipes: [],
                    category: await Category.find({}),
                    cuisines,
                })
            }

            filter.ingredients = ingredient._id
        }
        console.log(filter)
        const allRecipes = await Recipe.find(filter)
            .populate("category ingredients creator")

        res.render("recipes/all-recipes.ejs", {
            allRecipes,
            category: await Category.find({}),
            cuisines,
        })

    } catch (err) {
        console.log(err)
        res.redirect("/recipes/all-recipes")
    }
})

router.get('/delete-confirm/:id', isSignedIn, async (req, res) => {
    const currentRecipe = await Recipe.findById(req.params.id)
    console.log(currentRecipe)
    res.render('recipes/delete-confirm.ejs', { currentRecipe })
})

//--------- POST ---------//

// post new recipe
router.post('/new', isSignedIn, upload.single("image"), async (req, res) => {
    try {
        // get all the filled fields
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

        // add to Recipe
        await Recipe.create(newRecipe)

        // redirect to home
        res.redirect('/recipes/all-recipes')
    } catch (err) {
        console.log(`Cannot add the new recipe: ${err}`)
        res.redirect('/')
    }
})

// Add recipe to favourites
router.post('/:id/fav', isSignedIn, async (req, res) => {
    try {

        const recipe = await Recipe.findById(req.params.id)

        recipe.favorites.push(req.session.user._id)

        await recipe.save()

        res.redirect(`/recipes/recipe-details/${recipe._id}`)

    } catch (err) {
        console.log(`Cannot add favourite: ${err}`)
        res.redirect(`/recipes/recipe-details/${req.params.id}`)
    }
})

// Remove recipe from favourites
router.post('/:id/unFav', isSignedIn, async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id)

        const allIdsButMyId = recipe.favorites.filter(
            (oneId) => !oneId.equals(req.session.user._id)
        )
        recipe.favorites = allIdsButMyId
        await recipe.save()

        res.redirect(`/recipes/recipe-details/${recipe._id}`)

    } catch (err) {
        console.log(`Cannot remove favourite: ${err}`)
        res.redirect(`/recipes/recipe-details/${req.params.id}`)
    }
})

router.post('/review/:id', async (req, res) => {

    const foundRecipe = await Recipe.findById(req.params.id)

    const newReview = {
        review: req.body.review,
        rating: req.body.rating,
        creator: req.body.creator = req.session.user._id
    }
    foundRecipe.review.push(newReview)
    foundRecipe.save()
    res.redirect(`/recipes/recipe-details/${req.params.id}`)
})

//--------- PUT ---------//

// update recipe data
router.put('/:id', isSignedIn, upload.single('image'), async (req, res) => {
    try {
        // get the updated data
        const updatedRecipe = {
            name: req.body.name,
            description: req.body.description,
            cuisine: req.body.cuisine,
            category: req.body.category,
            serving: req.body.serving,
            instructions: req.body.instructions,
            prepTime: req.body.prepTime,
            cookTime: req.body.cookTime,
            ingredients: [].concat(req.body.ingredients || []),
        }
        if (req.file) {
            updatedRecipe.image = req.file.filename
        }
        // update the recipe based on the id
        await Recipe.findByIdAndUpdate(req.params.id, updatedRecipe)

        // redirect to the recipe page
        res.redirect(`/recipes/recipe-details/${req.params.id}`)
    } catch (err) {
        console.log(`Cannot update recipe: ${err}`)
        res.redirect(`/recipes/recipe-details/${req.params.id}`)
    }
})

// hide or unhide recipe
router.put('/:id/hidden', isSignedIn, async (req, res) => {
    try {
        // get the recipe by its id
        const recipe = await Recipe.findById(req.params.id)

        // if isHidden = false then do isHidden = tru and the opposit in every click
        recipe.isHidden = !recipe.isHidden

        // save changes
        await recipe.save()

        res.redirect(`/recipes/recipe-details/${req.params.id}`)
    } catch (err) {
        console.log(`Cannot hide/unhide recipe: ${err}`)
        res.redirect(`/recipes/recipe-details/${req.params.id}`)
    }
})
//--------- PUT ---------//

router.delete('/:id', isSignedIn, async (req, res) => {
    const deletedRecipe = await Recipe.findByIdAndDelete(req.params.id)
    res.redirect(`/auth/profile/${req.session.user._id}`)
})

router.delete('/review/:recipeId/:reviewId', isSignedIn, async (req, res) => {
    try {

        const pickedRecipe = await Recipe.findById(req.params.recipeId)
            .populate("review.creator")

        const pickedReview = pickedRecipe.review.id(req.params.reviewId)

        if (!pickedReview) {
            return res.redirect(`/recipes/recipe-details/${req.params.recipeId}`)
        }

        if (pickedReview.creator._id.toString() !== req.session.user._id.toString()) {
            return res.redirect(`/recipes/recipe-details/${req.params.recipeId}`)
        }

        pickedRecipe.review.pull(req.params.reviewId)

        await pickedRecipe.save()

        res.redirect(`/recipes/recipe-details/${req.params.recipeId}`)

    } catch (err) {
        console.log(`Cannot delete review: ${err}`)
        res.redirect(`/recipes/recipe-details/${req.params.recipeId}`)
    }
})

module.exports = router
