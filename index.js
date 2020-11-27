require('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser')
const morgan = require("morgan")
const cors = require('cors')
const routerNavigation = require('./src')

const app = express();

app.use(cors()) // Izin API
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(morgan("dev"))
app.use((request, response, next) => {
    response.header("Access-Control-Allow-Origin", "*")
    response.header("Access-Control-Allow-Header", "Origin, X-Request-With, Content-Type, Accept, Authorization")
    next()
})
app.use("/", routerNavigation)
app.use(express.static("uploads")) // Open access upload => on url web

app.get("*", (request, response) => {
    response.status(404).send("Path not found")
})

app.listen(process.env.PORT, process.env.IP, () => {
    console.log(`Express running at host: ${process.env.IP} and port: ${process.env.PORT}`)
});