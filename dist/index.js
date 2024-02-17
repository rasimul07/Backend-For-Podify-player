"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
require("./db");
const app = (0, express_1.default)();
const PORT = process.env.PORT || 8989;
app.listen(PORT, () => {
    console.log('Server is listening on port ' + PORT);
});
