const express = require('express');
const { getallCase ,addcase,lockUnlock,completed,getCompletedCase} = require('../controller/caselist_controller');

const router = express.Router();

router.get("/", getallCase);
router.post("/add", addcase);
router.post("/lock",lockUnlock);
router.post("/completed",completed)
router.get("fetchcompletedcase",getCompletedCase)


module.exports = router;
