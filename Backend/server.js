const app = require('./app');
const dotenv = require('dotenv');
const cloudinary = require("cloudinary")
const connectDatabase = require('./config/database');
// Handling uncaught Exception

process.on("uncaughtException", (err) => {
    console.log(`Error:${err.message}`);
    console.log(`SHutting dowm the server due  to Unhandled Promise rejection`)
    process.exit(1)
})

// Config

dotenv.config({ path: "Backend/config/config.env" });

// Connecting to the database

connectDatabase()

cloudinary.config({
    cloud_name : process.env.CLODINARY_NAME,
    api_key : process.env.CLODINARY_API_KEY,
    api_secret: process.env.CLODINARY_API_SECRET,
})

console.log(process.env.PORT)
const server = app.listen(process.env.PORT, () => {
    console.log(`Example app listening on port ${process.env.PORT || 4000}`);
});

app.get('/', (req, res) => {
    res.send('Hello World!');
});


// Unhandled Promise Rejection

process.on("unhandledRejection", (err) => {
    console.log(`Error:${err.message}`);
    console.log(`SHutting dowm the server due  to Unhandled Promise rejection`)

    server.close(() => {
        process.exit(1);
    })
})
