import { Request, Response } from 'express';

export const listMeasuresController = async (req: Request, res: Response) => {
  const { customer_code } = req.params;
  const { measure_type } = req.query;

  try {
    // Validação de tipo de medição
    const validTypes = ['WATER', 'GAS'];
    if (measure_type && !validTypes.includes((measure_type as string).toUpperCase())) {
      return res.status(400).json({
        error_code: "INVALID_TYPE",
        error_description: "Tipo de medição inválido, deve ser WATER ou GAS"
      });
    }

    // TODO: Buscar as medições no banco de dados
    // Aqui você vai buscar as medições para o cliente específico e, se o measure_type for informado, filtrar apenas o tipo especificado.
    const measures = [
      {
        measure_uuid: "guid-gerado",
        measure_datetime: "2024-08-27T10:00:00Z",
        measure_type: "WATER",
        has_confirmed: true,
        image_url: "https://link_temporario_da_imagem.com"
      },
      {
        measure_uuid: "guid-outro",
        measure_datetime: "2024-07-27T10:00:00Z",
        measure_type: "GAS",
        has_confirmed: false,
        image_url: "https://link_temporario_da_imagem_gas.com"
      }
    ];

    // Se o measure_type foi especificado, filtrar os resultados
    const filteredMeasures = measure_type
      ? measures.filter(measure => measure.measure_type.toUpperCase() === (measure_type as string).toUpperCase())
      : measures;

    if (filteredMeasures.length === 0) {
      return res.status(404).json({
        error_code: "MEASURES_NOT_FOUND",
        error_description: "Nenhuma leitura encontrada"
      });
    }

    // Sucesso
    return res.status(200).json({
      customer_code,
      measures: filteredMeasures
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error_code: "SERVER_ERROR",
      error_description: "Erro ao processar a solicitação"
    });
  }
};
