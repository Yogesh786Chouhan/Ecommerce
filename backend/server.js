// const app = require('./app');
// const cloudinary = require("cloudinary");
// const connectDatabase = require('./config/database');

// // Handling Uncaught Exception
// process.on("uncaughtException", (err) => {
//     console.log(`Error, ${err.message}`);
//     console.log("Shutting down the server due to Uncaught Exception");
//     process.exit(1);
// })

// //config
// if (process.env.NODE_ENV !== "PRODUCTION") {
//     require('dotenv').config({ path: "backend/config/config.env" });

// }

// // Connecting to database
// connectDatabase();

// cloudinary.config({
//     cloud_name: process.env.CLOUDINARY_NAME,
//     api_key: process.env.CLOUDINARY_API_KEY,
//     api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// const server = app.listen(process.env.PORT, () => {
//     console.log(`Server is working on http://localhost:${process.env.PORT}`);
// })

// // Unhandled Promise Rejection due to Wrong url of mongodb
// process.on("unhandledRejection", (err) => {
//     console.log(`Error: ${err.message}`);
//     console.log("Shutting down the server due to unhandled Promise Rejection");
//     server.close(() => {
//         process.exit(1);
//     });
// });

'use strict';

const compose = require('redux').compose;

exports.__esModule = true;
exports.composeWithDevTools =
  typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    : function () {
        if (arguments.length === 0) return undefined;
        if (typeof arguments[0] === 'object') return compose;
        return compose.apply(null, arguments);
      };

exports.devToolsEnhancer =
  typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION__
    ? window.__REDUX_DEVTOOLS_EXTENSION__
    : function () {
        return function (noop) {
          return noop;
        };
      };

const app = require('./app');
const cloudinary = require('cloudinary').v2; // Ensure using Cloudinary v2 if appropriate
const connectDatabase = require('./config/database');

// Handling Uncaught Exceptions
process.on('uncaughtException', (err) => {
  console.error(`Error: ${err.message}`);
  console.error('Shutting down the server due to Uncaught Exception');
  process.exit(1);
});

// Config - Load environment variables only in non-production
if (process.env.NODE_ENV !== 'PRODUCTION') {
  require('dotenv').config({ path: 'backend/config/config.env' });
}

// Connecting to the database
connectDatabase();

// Configuring Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const server = app.listen(process.env.PORT || 3000, () => {
  console.log(`Server is running on http://localhost:${process.env.PORT || 3000}`);
});

// Handling Unhandled Promise Rejections (e.g., MongoDB connection errors)
process.on('unhandledRejection', (err) => {
  console.error(`Error: ${err.message}`);
  console.error('Shutting down the server due to unhandled Promise Rejection');
  server.close(() => {
    process.exit(1);
  });
});

