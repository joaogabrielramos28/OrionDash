import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1770258835498 implements MigrationInterface {
    name = 'Migration1770258835498'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "order_items" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "order_id" uuid NOT NULL, "product_id" character varying NOT NULL, "product_name" character varying NOT NULL, "productDescription" text, "unit_price" numeric(10,2) NOT NULL, "quantity" integer NOT NULL, "subtotal" numeric(10,2) NOT NULL, "product_image_url" character varying, "category" character varying, "is_cancelled" boolean NOT NULL DEFAULT false, "cancel_reason" character varying, CONSTRAINT "PK_005269d8574e6fac0493715c308" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."orders_status_enum" AS ENUM('created', 'pending_payment', 'payment_failed', 'paid', 'pending_dispatch', 'dispatch_failed', 'assigned', 'picked_up', 'delivering', 'delivered', 'cancelled', 'refunded')`);
        await queryRunner.query(`CREATE TABLE "orders" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "customerId" character varying NOT NULL, "restaurantId" character varying NOT NULL, "status" "public"."orders_status_enum" NOT NULL DEFAULT 'created', "total_amount" numeric(10,2) NOT NULL, "courier_id" character varying, "payment_id" character varying, "delivery_address" jsonb NOT NULL, "cancel_reason" character varying, "paid_at" TIMESTAMP, "assigned_at" TIMESTAMP, "picked_up_at" TIMESTAMP, "delivered_at" TIMESTAMP, "cancelled_at" TIMESTAMP, CONSTRAINT "PK_710e2d4957aa5878dfe94e4ac2f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "order_items" ADD CONSTRAINT "FK_145532db85752b29c57d2b7b1f1" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order_items" DROP CONSTRAINT "FK_145532db85752b29c57d2b7b1f1"`);
        await queryRunner.query(`DROP TABLE "orders"`);
        await queryRunner.query(`DROP TYPE "public"."orders_status_enum"`);
        await queryRunner.query(`DROP TABLE "order_items"`);
    }

}
