const dotenv = require('dotenv');
const fs = require('fs');
const colors = require('colors');
const mongoose = require('mongoose');
const express = require('express');

const app = express()
dotenv.config();

// Load Models
const Product = require('./models/Product');
const Order = require('./models/Order');
const Category = require('./models/Category');
const User = require('./models/User');

// Connect to Mongo Database
mongoose
    .connect(process.env.MONGO_URI || "")
    .then(() => {
        app.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`));
    })

// Read The JSON files
const products = JSON.parse(fs.readFileSync(`${__dirname}/_seedData/products.json`, 'utf-8'));
const orders = JSON.parse(fs.readFileSync(`${__dirname}/_seedData/orders.json`, 'utf-8'));
const categories = JSON.parse(fs.readFileSync(`${__dirname}/_seedData/categories.json`, 'utf-8'));
const users = JSON.parse(fs.readFileSync(`${__dirname}/_seedData/users.json`, 'utf-8'));

// Import Sample Data In DB
const importData = async () => {
    try {
        await Product.create(products);
        await Category.create(categories);
        await Order.create(orders);
        await User.create(users);
        console.log(`Data successfully imported`.green.inverse);
        process.exit();
    } catch (err) {
        console.log(err);
    }
}

// Delete the data from DB
const deleteData = async () => {
    try {
        await Product.deleteMany({});
        await User.deleteMany({});
        await Category.deleteMany({});
        await Order.deleteMany({});
        console.log(`Data successfully deleted`.red.inverse);
        process.exit();
    } catch (err) {
        console.log(err);
    }
}

if (process.argv[2] === '-i') {
    importData().then();
} else if (process.argv[2] === '-d') {
    deleteData().then();
}