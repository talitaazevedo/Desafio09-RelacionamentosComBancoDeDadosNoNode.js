import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export default class DropOrderAndProductFieldToOrderProductTable1591549559201
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('orders_products', 'order');
    await queryRunner.dropColumn('orders_products', 'product');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'orders_products',
      new TableColumn({
        name: 'product',
        type: 'varchar',
        isNullable: true,
      }),
    );
    await queryRunner.addColumn(
      'orders_products',
      new TableColumn({
        name: 'order',
        type: 'varchar',
        isNullable: true,
      }),
    );
  }
}
