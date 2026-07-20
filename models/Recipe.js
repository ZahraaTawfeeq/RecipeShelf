const mongoose = require('mongoose')

const reviewSchema = mongoose.Schema({
    rating: { type: Number },
    review: { type: String, maxLength: 200 }
})

const recipeSchema = mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, minLength: 10 },
    instructions: { type: String, required: true, minLength: 10 },
    serving: { type: Number, min: 1, required: true },
    cookTime: { type: Number },
    prepTime: { type: String },
    cuisine: { type: String, required: true },
    // isFav: { type: Boolean, default: false },
    favorites: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    review: { type: [reviewSchema] },
    image: { type: String },
    isHidden: { type: Boolean, default: false },
    ingredients: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ingredient'
    }],
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    },
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
})

const Recipe = mongoose.model('Recipe', recipeSchema)

module.exports = Recipe