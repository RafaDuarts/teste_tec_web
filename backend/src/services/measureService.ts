import { Measure } from '../entities/Measure';  // Certifique-se de importar a entidade correta
import { AppDataSource } from '../ormconfig';   // Acesso à conexão do banco de dados
import { Between, Repository } from 'typeorm';

// Interface para padronizar o serviço
interface IMeasureService {
  findExistingMeasure(customer_code: string, measure_type: string, measure_datetime: Date): Promise<Measure | null>;
  createMeasure(data: Partial<Measure>): Promise<Measure>;
  confirmMeasure(measure_uuid: string, confirmed_value: number): Promise<Measure | null>;
  listMeasures(customer_code: string, measure_type?: string): Promise<Measure[]>;
}

// Serviço de manipulação de medidas
export class MeasureService implements IMeasureService {
  private measureRepository: Repository<Measure>;

  constructor() {
    this.measureRepository = AppDataSource.getRepository(Measure);  // Obtém o repositório da entidade Measure
  }

  // Verifica se já existe uma medida para o cliente no mês atual
  async findExistingMeasure(customer_code: string, measure_type: string, measure_datetime: Date): Promise<Measure | null> {
    const monthStart = new Date(measure_datetime.getFullYear(), measure_datetime.getMonth(), 1);
    const monthEnd = new Date(measure_datetime.getFullYear(), measure_datetime.getMonth() + 1, 0);

    return await this.measureRepository.findOne({
      where: {
        customer_code,
        measure_type: measure_type as 'WATER' | 'GAS', // Converte para o tipo permitido
        measure_datetime: Between(monthStart, monthEnd)
      }
    });
  }

  // Cria uma nova medida
  async createMeasure(data: Partial<Measure>): Promise<Measure> {
    const newMeasure = this.measureRepository.create(data);
    return await this.measureRepository.save(newMeasure);
  }

  // Confirma o valor de uma medida já existente
  async confirmMeasure(measure_uuid: string, confirmed_value: number): Promise<Measure | null> {
    const measure = await this.measureRepository.findOneBy({ measure_uuid });

    if (measure) {
      measure.confirmed_value = confirmed_value;
      measure.has_confirmed = true;
      return await this.measureRepository.save(measure);
    }

    return null;
  }

  // Lista todas as medidas de um cliente, com filtragem opcional por tipo de medida
  async listMeasures(customer_code: string, measure_type?: string): Promise<Measure[]> {
    const query = this.measureRepository.createQueryBuilder("measure")
      .where("measure.customer_code = :customer_code", { customer_code });

    if (measure_type) {
      query.andWhere("measure.measure_type = :measure_type", { measure_type });
    }

    return await query.getMany();
  }
}
