const mongoose = require('mongoose')

const reviewSchema = mongoose.Schema({
    rating: { type: Number },
    review: { type: String, maxLength: 200 }
})

const recipeSchema = mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, minLength: 20 },
    instructions: { type: String, required: true, minLength: 20 },
    serving: { type: Number, min: 1 },
    cookTime: { type: Number },
    prepTime: { type: String },
    cuisine: { type: String, enum: [] },
    notes: { type: String, minLength: 5, maxLength: 500 },
    isFav: { type: Boolean },
    review: { type: [reviewSchema] },
    image: { type: String },
    isHidden: { type: Boolean },
    ingredients: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ingredients'
    }],
    Category: {
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