const router = require('express').Router()
const { get, getTotalUsers, post, deleteUser, getPic, patchUser } = require('../controller/users')
const uploadImage = require("../middleware/multer");

router.get("/", get)
router.get("/totalUser", getTotalUsers)
router.post("/", uploadImage, post)
router.delete("/deleteUser/:id", deleteUser)
router.get("/getpic", getPic)
router.patch("/:id", uploadImage, patchUser)

module.exports = router
