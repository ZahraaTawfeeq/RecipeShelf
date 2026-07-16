// imports
const express = require("express")
const app = express()
const dotenv = require("dotenv").config()
const morgan = require('morgan')
const session = require('express-session');
const methodOverride = require('method-override')
const { MongoStore } = require("connect-mongo");
const connectToDB = require('./db.js')

// middleware imports
const isSignedIn = require("./middleware/is-signed-in.js");
const passUserToView = require("./middleware/pass-user-to-view.js");

// controller Imports
const authController = require("./controllers/auth.controllers.js");
const indexController = require("./controllers/index.controllers.js");
const ingredientController = require("./controllers/ingredientController.js");
const categoryController = require("./controllers/categoryController.js");
const recipeController = require("./controllers/recipeController.js");
const chatController = require("./controllers/chatController.js");



const dns = require('dns')
dns.setServers(['8.8.8.8', '1.1.1.1'])

// Middleware
app.use(express.static('public'))
app.use(express.urlencoded({ extended: false }));
app.use(morgan('dev'))
app.use(methodOverride('_method'))
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,

    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
      collectionName: "sessions"
    }),

    cookie: {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24
    }
  })
);
app.use(passUserToView)


// Routes
app.use('/auth', authController)
app.use('/', indexController)
app.use('/ingredients', ingredientController)
app.use('/categories', categoryController)
app.use('/recipes', recipeController)
app.use('/chats', chatController)





// connect to database and listen on Port 3000
async function startServer() {
  const PORT = process.env.PORT || 3000;
  await connectToDB();

  app.listen(PORT, () => {
    console.log(`App is running on port ${PORT}`);
  });
}

startServer();