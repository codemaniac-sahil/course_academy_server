const express = require("express");
const updateProfileLinks = require("../controller/sellerController/updateProfile");
const addCourse = require("../controller/sellerController/addCourse");
const upload = require("../azureStorage/imageUpload");
const viewCourse = require("../controller/sellerController/viewCourse");
const updateCourse = require("../controller/sellerController/updateCourse");

const router = express.Router();

router.put("/updateprofile", updateProfileLinks);
router.post("/addcourse", upload.single("coursethumb"), addCourse);
router.get("/viewcourse/:courseid", viewCourse);
router.put("/updatecourse/:id", upload.single("coursethumb"), updateCourse)

module.exports = router;
