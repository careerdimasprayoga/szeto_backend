const route = require("express").Router()

const users = require("./routes/users")

route.use("/users", users)

module.exports = route