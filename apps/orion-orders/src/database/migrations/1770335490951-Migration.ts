import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1770335490951 implements MigrationInterface {
    name = 'Migration1770335490951'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "total_amount"`);
        await queryRunner.query(`ALTER TABLE "orders" ADD "total_amount" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "order_items" DROP COLUMN "unit_price"`);
        await queryRunner.query(`ALTER TABLE "order_items" ADD "unit_price" integer(10) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "order_items" DROP COLUMN "subtotal"`);
        await queryRunner.query(`ALTER TABLE "order_items" ADD "subtotal" integer(10) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order_items" DROP COLUMN "subtotal"`);
        await queryRunner.query(`ALTER TABLE "order_items" ADD "subtotal" numeric(10,2) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "order_items" DROP COLUMN "unit_price"`);
        await queryRunner.query(`ALTER TABLE "order_items" ADD "unit_price" numeric(10,2) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "total_amount"`);
        await queryRunner.query(`ALTER TABLE "orders" ADD "total_amount" numeric(10,2) NOT NULL`);
    }

}
