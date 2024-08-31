import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class Measure {
  @PrimaryGeneratedColumn('uuid')
  measure_uuid: string = '';

  @Column()
  customer_code: string = '';

  @Column()
  measure_value: number = 0;

  @Column()
  measure_type: 'WATER' | 'GAS' = 'WATER';

  @Column()
  image_url: string = '';

  @Column()
  has_confirmed: boolean = false;

  @CreateDateColumn()
  measure_datetime: Date = new Date();
  confirmed_value: number = 0;
}
