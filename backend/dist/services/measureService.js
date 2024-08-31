"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MeasureService = void 0;
const Measure_1 = require("../entities/Measure"); // Certifique-se de importar a entidade correta
const ormconfig_1 = require("../ormconfig"); // Acesso à conexão do banco de dados
const typeorm_1 = require("typeorm");
// Serviço de manipulação de medidas
class MeasureService {
    constructor() {
        this.measureRepository = ormconfig_1.AppDataSource.getRepository(Measure_1.Measure); // Obtém o repositório da entidade Measure
    }
    // Verifica se já existe uma medida para o cliente no mês atual
    async findExistingMeasure(customer_code, measure_type, measure_datetime) {
        const monthStart = new Date(measure_datetime.getFullYear(), measure_datetime.getMonth(), 1);
        const monthEnd = new Date(measure_datetime.getFullYear(), measure_datetime.getMonth() + 1, 0);
        return await this.measureRepository.findOne({
            where: {
                customer_code,
                measure_type: measure_type, // Converte para o tipo permitido
                measure_datetime: (0, typeorm_1.Between)(monthStart, monthEnd)
            }
        });
    }
    // Cria uma nova medida
    async createMeasure(data) {
        const newMeasure = this.measureRepository.create(data);
        return await this.measureRepository.save(newMeasure);
    }
    // Confirma o valor de uma medida já existente
    async confirmMeasure(measure_uuid, confirmed_value) {
        const measure = await this.measureRepository.findOneBy({ measure_uuid });
        if (measure) {
            measure.confirmed_value = confirmed_value;
            measure.has_confirmed = true;
            return await this.measureRepository.save(measure);
        }
        return null;
    }
    // Lista todas as medidas de um cliente, com filtragem opcional por tipo de medida
    async listMeasures(customer_code, measure_type) {
        const query = this.measureRepository.createQueryBuilder("measure")
            .where("measure.customer_code = :customer_code", { customer_code });
        if (measure_type) {
            query.andWhere("measure.measure_type = :measure_type", { measure_type });
        }
        return await query.getMany();
    }
}
exports.MeasureService = MeasureService;
