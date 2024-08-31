"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const listMeasuresController_1 = require("../controllers/listMeasuresController");
const router = (0, express_1.Router)();
router.get('/:customer_code/list', listMeasuresController_1.listMeasuresController);
exports.default = router;
