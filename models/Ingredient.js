const mongoose = require('mongoose')

const ingredientSchema = mongoose.Schema({
    name: { type: String, required: true },
    category: { type: String}
})

const Ingredient = mongoose.model('Ingredient', ingredientSchema)

module.exports = Ingredient