const materialController = require('../controllers/materialController')
const express = require('express')
const router = express.Router()

router.get("/getMaterials", materialController.getMaterials)
router.post("/addMaterial", materialController.addMaterial)
router.get("/getMaterial/:materialName", materialController.getMaterial)
router.put("/editMaterial", materialController.editMaterial)
router.delete("/deleteMaterial/:materialName" , materialController.deleteMaterial)

module.exports = router