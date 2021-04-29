import {MigrationInterface, QueryRunner} from "typeorm";

export class addCronTable1588897067325 implements MigrationInterface {
    name = 'addCronTable1588897067325'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "cron" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "fecha" character varying NOT NULL, "horaInicio" character varying NOT NULL, CONSTRAINT "PK_2bd2e0a051c553ce710865305a1" PRIMARY KEY ("id"))`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "cron"`, undefined);
    }

}
