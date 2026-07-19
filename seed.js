const connectToDB = require('./db.js')
const Ingredient = require('./models/Ingredient.js')
const Category = require('./models/Category.js')
const dotenv = require("dotenv").config()
const dns = require('dns')
dns.setServers(['8.8.8.8', '1.1.1.1'])


const ingredients = [
    // Vegetables
    { name: "Onion", category: "Vegetables" },
    { name: "Garlic", category: "Vegetables" },
    { name: "Tomato", category: "Vegetables" },
    { name: "Carrot", category: "Vegetables" },
    { name: "Potato", category: "Vegetables" },
    { name: "Broccoli", category: "Vegetables" },
    { name: "Spinach", category: "Vegetables" },
    { name: "Bell Pepper", category: "Vegetables" },
    { name: "Mushroom", category: "Vegetables" },
    { name: "Cucumber", category: "Vegetables" },

    // Fruits
    { name: "Apple", category: "Fruits" },
    { name: "Banana", category: "Fruits" },
    { name: "Lemon", category: "Fruits" },
    { name: "Orange", category: "Fruits" },
    { name: "Strawberry", category: "Fruits" },
    { name: "Blueberry", category: "Fruits" },
    { name: "Avocado", category: "Fruits" },

    // Meat & Poultry
    { name: "Chicken Breast", category: "Meat & Poultry" },
    { name: "Ground Beef", category: "Meat & Poultry" },
    { name: "Beef Steak", category: "Meat & Poultry" },
    { name: "Turkey", category: "Meat & Poultry" },
    { name: "Lamb", category: "Meat & Poultry" },

    // Seafood
    { name: "Salmon", category: "Seafood" },
    { name: "Tuna", category: "Seafood" },
    { name: "Shrimp", category: "Seafood" },
    { name: "Crab", category: "Seafood" },

    // Dairy
    { name: "Milk", category: "Dairy" },
    { name: "Butter", category: "Dairy" },
    { name: "Cheddar Cheese", category: "Dairy" },
    { name: "Mozzarella", category: "Dairy" },
    { name: "Parmesan", category: "Dairy" },
    { name: "Yogurt", category: "Dairy" },
    { name: "Cream", category: "Dairy" },

    // Grains & Pasta
    { name: "Rice", category: "Grains & Pasta" },
    { name: "Pasta", category: "Grains & Pasta" },
    { name: "Bread", category: "Grains & Pasta" },
    { name: "Flour", category: "Grains & Pasta" },
    { name: "Oats", category: "Grains & Pasta" },

    // Herbs & Spices
    { name: "Salt", category: "Herbs & Spices" },
    { name: "Black Pepper", category: "Herbs & Spices" },
    { name: "Paprika", category: "Herbs & Spices" },
    { name: "Cumin", category: "Herbs & Spices" },
    { name: "Oregano", category: "Herbs & Spices" },
    { name: "Basil", category: "Herbs & Spices" },
    { name: "Parsley", category: "Herbs & Spices" },
    { name: "Cinnamon", category: "Herbs & Spices" },

    // Oils & Condiments
    { name: "Olive Oil", category: "Oils & Condiments" },
    { name: "Vegetable Oil", category: "Oils & Condiments" },
    { name: "Soy Sauce", category: "Oils & Condiments" },
    { name: "Vinegar", category: "Oils & Condiments" },
    { name: "Ketchup", category: "Oils & Condiments" },
    { name: "Mustard", category: "Oils & Condiments" },
    { name: "Mayonnaise", category: "Oils & Condiments" },
    { name: "Honey", category: "Oils & Condiments" },

    // Baking
    { name: "Sugar", category: "Baking" },
    { name: "Brown Sugar", category: "Baking" },
    { name: "Baking Powder", category: "Baking" },
    { name: "Baking Soda", category: "Baking" },
    { name: "Vanilla Extract", category: "Baking" },
    { name: "Cocoa Powder", category: "Baking" },

    // Legumes & Nuts
    { name: "Lentils", category: "Legumes & Nuts" },
    { name: "Chickpeas", category: "Legumes & Nuts" },
    { name: "Black Beans", category: "Legumes & Nuts" },
    { name: "Kidney Beans", category: "Legumes & Nuts" },
    { name: "Peanuts", category: "Legumes & Nuts" },
    { name: "Almonds", category: "Legumes & Nuts" },
    { name: "Walnuts", category: "Legumes & Nuts" },

    // Eggs
    { name: "Egg", category: "Eggs" },
]

const categories = [
    { name: "Appetizer" },
    { name: "Breakfast" },
    { name: "Brunch" },
    { name: "Lunch" },
    { name: "Main Course" },
    { name: "Side Dish" },
    { name: "Soup" },
    { name: "Salad" },
    { name: "Snack" },
    { name: "Dessert" },
    { name: "Beverage" },
    { name: "Sauce" },
    { name: "Dip" },
    { name: "Bread" },
    { name: "Pastry" }
]

async function seed() {
    await connectToDB()
    await Ingredient.insertMany(ingredients);
    await Category.insertMany(categories);
    console.log('DB Seeded')
}

seed()
