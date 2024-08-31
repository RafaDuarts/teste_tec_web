"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ormconfig_1 = require("./ormconfig");
const uploadRoutes_1 = __importDefault(require("./routes/uploadRoutes"));
const confirmRoutes_1 = __importDefault(require("./routes/confirmRoutes"));
const listRoutes_1 = __importDefault(require("./routes/listRoutes"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
ormconfig_1.AppDataSource.initialize()
    .then(() => {
    console.log("Data Source has been initialized!");
    // Definindo rotas com prefixos adequados
    app.use('/upload', uploadRoutes_1.default); // Rotas de upload
    app.use('/confirm', confirmRoutes_1.default); // Rotas de confirmação
    app.use('/list', listRoutes_1.default); // Rotas de listagem
    // Porta configurada via variável de ambiente ou padrão 3000
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
})
    .catch((err) => {
    console.error("Error during Data Source initialization:", err);
});
// Middleware global para tratamento de erros
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send({
        error_code: "INTERNAL_SERVER_ERROR",
        error_description: "An unexpected error occurred.",
    });
});
