"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiV1Router = void 0;
// Import the express in typescript file
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const token_auth_1 = __importDefault(require("./middlewares/token-auth"));
const mongoose_1 = __importDefault(require("mongoose"));
const auth_route_1 = require("./routers/auth.route");
require("./database/models/export");
const user_route_1 = require("./routers/user.route");
const product_route_1 = require("./routers/product.route");
const dev_router_1 = require("./dev/dev.router");
dotenv_1.default.config();
// Initialize the express engine
const app = (0, express_1.default)();
const clientOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } };
const database_uri = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@tt.i6762.mongodb.net/?appName=${process.env.MONGO_APPNAME}`;
mongoose_1.default.connect(database_uri, clientOptions).then((v) => console.log(`Connected - ${process.env.MONGO_USER}`)).catch(() => console.error("Error!"));
const logger = (req, res, next) => {
    let current_datetime = new Date();
    let formatted_date = current_datetime.getFullYear() +
        "-" +
        (current_datetime.getMonth() + 1) +
        "-" +
        current_datetime.getDate() +
        " " +
        current_datetime.getHours() +
        ":" +
        current_datetime.getMinutes() +
        ":" +
        current_datetime.getSeconds();
    let method = req.method;
    let url = req.url;
    let log = `[${formatted_date}] ${method}:${url}`;
    console.log(log);
    next();
};
app.use((0, cors_1.default)());
app.use(logger);
app.use(express_1.default.json());
// middlewares
app.use(token_auth_1.default);
// app.use(adminAuth);
// API - V1
exports.apiV1Router = express_1.default.Router();
app.use('/api/v1', exports.apiV1Router);
exports.apiV1Router.use('/auth', auth_route_1.authRouter);
exports.apiV1Router.use('/user', user_route_1.userRouter);
exports.apiV1Router.use('/product', product_route_1.productRouter);
exports.apiV1Router.use('/dev', dev_router_1.devRouter);
app.get("/", (_, res) => {
    res.send("Welcome to TimberThreads");
});
// Server setup
app.listen(process.env.PORT, () => {
    console.log(`TypeScript with Express 
         PORT: ${process.env.PORT}`);
});
