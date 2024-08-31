"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.confirmController = void 0;
const measureService_1 = require("../services/measureService");
const measureService = new measureService_1.MeasureService();
const confirmController = async (req, res) => {
    const { measure_uuid, confirmed_value } = req.body;
    // Validações básicas de entrada
    if (!measure_uuid || typeof confirmed_value !== 'number') {
        return res.status(400).json({
            error_code: "INVALID_DATA",
            error_description: "UUID e valor confirmado são obrigatórios e o valor deve ser numérico"
        });
    }
    try {
        const result = await measureService.confirmMeasure(measure_uuid, confirmed_value);
        if (!result) {
            return res.status(404).json({
                error_code: "MEASURE_NOT_FOUND",
                error_description: "Leitura não encontrada"
            });
        }
        if (result.has_confirmed) {
            return res.status(409).json({
                error_code: "CONFIRMATION_DUPLICATE",
                error_description: "Leitura já confirmada"
            });
        }
        // Sucesso
        return res.status(200).json({ success: true });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            error_code: "SERVER_ERROR",
            error_description: "Erro ao processar a solicitação"
        });
    }
};
exports.confirmController = confirmController;
