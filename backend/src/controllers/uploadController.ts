import { Request, Response } from 'express';
import { MeasureService } from '../services/measureService';
import axios from 'axios';

const measureService = new MeasureService();
const apiKey = process.env.GEMINI_API_KEY || 'default_api_key';

export const uploadController = async (req: Request, res: Response) => {
  const { image, customer_code, measure_datetime, measure_type } = req.body;

  // Validações básicas de entrada
  if (!image || !customer_code || !measure_datetime || !measure_type) {
    return res.status(400).json({
      error_code: "INVALID_DATA",
      error_description: "Todos os campos são obrigatórios"
    });
  }

  const validTypes = ['WATER', 'GAS'];
  if (!validTypes.includes(measure_type.toUpperCase())) {
    return res.status(400).json({
      error_code: "INVALID_TYPE",
      error_description: "Tipo de medição inválido, deve ser WATER ou GAS"
    });
  }

  try {
    // Verificar duplicidade no mês atual
    const existingMeasure = await measureService.findExistingMeasure(customer_code, measure_type, new Date(measure_datetime));
    
    if (existingMeasure) {
      return res.status(409).json({
        error_code: "DOUBLE_REPORT",
        error_description: "Leitura do mês já realizada"
      });
    }

    // Integração com a API do Gemini
    const response = await axios.post('https://generativelanguage.googleapis.com/v1beta/corpora', {
      image,
    }, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });

    const { image_url, measure_value, measure_uuid } = response.data;

    const newMeasure = await measureService.createMeasure({
      customer_code,
      measure_datetime: new Date(measure_datetime),
      measure_type,
      image_url,
      measure_value,
      measure_uuid
    });

    return res.status(200).json({
      image_url: newMeasure.image_url,
      measure_value: newMeasure.measure_value,
      measure_uuid: newMeasure.measure_uuid
    });
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      // Erro específico do Axios
      console.error("Axios Error:", error.response?.data || error.message);
    } else {
      // Erro genérico
      console.error("Error:", error);
    }

    return res.status(500).json({
      error_code: "SERVER_ERROR",
      error_description: "Erro ao processar a solicitação"
    });
  }
};
