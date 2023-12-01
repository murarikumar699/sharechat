const mongoose = require("mongoose");

try {
  mongoose.connect('mongodb://127.0.0.1:27017/shareChat').then(() => {
    console.log("mongodb Connected")
  });
} catch (error) {
  console.log("mongodb is not connected")
}