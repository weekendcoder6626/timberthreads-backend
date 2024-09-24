"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sessionModel = void 0;
const mongoose_1 = require("mongoose");
exports.sessionModel = (0, mongoose_1.model)('Session', new mongoose_1.Schema({
    token: {
        type: String,
        unique: true
    },
    email: String,
}));
