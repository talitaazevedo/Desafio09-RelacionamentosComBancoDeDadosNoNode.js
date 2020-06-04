import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export default class CreateProduct1591305679030 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'products',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'name',
            type: 'varchar',
          },
          {
            name: 'price',
            type: 'decimal',
          },
          {
            name: 'quantity',
            type: 'integer',
          },
          {
            name: 'order_products',
            type: 'varchar',
          },
          {
            name: 'created_at',
            type: 'timestamp',

            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'now()',
          },
        ],
        // foreignKeys: [
        //   {
        //     name: 'FKProductOrderProducts',
        //     referencedTableName: 'orders_products',
        //     referencedColumnNames: ['product'],
        //     columnNames: ['order_products'],
        //     onDelete: 'CASCADE',
        //     onUpdate: 'CASCADE',
        //   },
        // ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('products');
  }
}
