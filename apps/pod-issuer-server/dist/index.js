"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const app_1 = __importDefault(require("./app"));
dotenv_1.default.config();
if (!process.env.GOV_EDDSA_PRIVATE_KEY) {
    throw new Error("expect process.env.GOV_EDDSA_PRIVATE_KEY");
}
if (!process.env.DEEL_EDDSA_PRIVATE_KEY) {
    throw new Error("expect process.env.DEEL_EDDSA_PRIVATE_KEY");
}
const port = process.env.PORT || 8080;
app_1.default.listen(port, () => {
    console.log(`[server]: Server ready on port ${port}`);
});
