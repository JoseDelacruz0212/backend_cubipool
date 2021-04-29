import {MigrationInterface, QueryRunner} from "typeorm";

export class addAvailableOffer1589738057218 implements MigrationInterface {
    name = 'addAvailableOffer1589738057218'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "oferta_cubiculo" ADD "disponible" boolean NOT NULL`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "oferta_cubiculo" DROP COLUMN "disponible"`, undefined);
    }

}
