import {MigrationInterface, QueryRunner} from "typeorm";

export class addOffersTable1589735309731 implements MigrationInterface {
    name = 'addOffersTable1589735309731'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "oferta_cubiculo" ("id" SERIAL NOT NULL, "apple" boolean NOT NULL, "pizarra" boolean NOT NULL, "sitios" integer NOT NULL, "reservaId" integer, CONSTRAINT "PK_95c9318e684ed1cac36934c2cef" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`ALTER TABLE "user_many_reserva" ALTER COLUMN "activate" DROP NOT NULL`, undefined);
        await queryRunner.query(`ALTER TABLE "oferta_cubiculo" ADD CONSTRAINT "FK_9385c18b216cf9b0673062fc7e4" FOREIGN KEY ("reservaId") REFERENCES "reserva"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "oferta_cubiculo" DROP CONSTRAINT "FK_9385c18b216cf9b0673062fc7e4"`, undefined);
        await queryRunner.query(`ALTER TABLE "user_many_reserva" ALTER COLUMN "activate" DROP NOT NULL`, undefined);
        await queryRunner.query(`DROP TABLE "oferta_cubiculo"`, undefined);
    }

}
