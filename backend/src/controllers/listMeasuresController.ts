import { Request, Response } from 'express';
import { AppDataSource } from '../ormconfig'; // Atualize o caminho conforme sua estrutura
import { Measure } from '../entities/Measure'; // Atualize o caminho conforme sua estrutura

export const listMeasuresController = async (req: Request, res: Response) => {
  const { customer_code } = req.params;
  const { measure_type } = req.query;

  const measureRepository = AppDataSource.getRepository(Measure);

  try {
    // Validação de tipo de medição
    const validTypes = ['WATER', 'GAS'];
    if (measure_type && !validTypes.includes((measure_type as string).toUpperCase())) {
      return res.status(400).json({
        error_code: "INVALID_TYPE",
        error_description: "Tipo de medição inválido, deve ser WATER ou GAS"
      });
    }

    // Buscar as medições no banco de dados
    const queryBuilder = measureRepository.createQueryBuilder('measure')
      .where('measure.customer_code = :customer_code', { customer_code });

    if (measure_type) {
      queryBuilder.andWhere('measure.measure_type = :measure_type', { measure_type: (measure_type as string).toUpperCase() });
    }

    const measures = await queryBuilder.getMany();

    if (measures.length === 0) {
      return res.status(404).json({
        error_code: "MEASURES_NOT_FOUND",
        error_description: "Nenhuma leitura encontrada"
      });
    }

    // Sucesso
    return res.status(200).json({
      customer_code,
      measures
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error_code: "SERVER_ERROR",
      error_description: "Erro ao processar a solicitação"
    });
  }
};
