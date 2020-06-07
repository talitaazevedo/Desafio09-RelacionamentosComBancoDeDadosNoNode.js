import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export default class DropOrderProductsFieldFromOrdersAndProducts1591387186633
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('orders', 'order_products');
    await queryRunner.dropColumn('products', 'order_products');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'products',
      new TableColumn({
        name: 'order_products',
        type: 'varchar',
        isNullable: true,
      }),
    );
    await queryRunner.addColumn(
      'orders',
      new TableColumn({
        name: 'order_products',
        type: 'varchar',
        isNullable: true,
      }),
    );
  }
}
