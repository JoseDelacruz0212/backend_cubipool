import {MigrationInterface, QueryRunner} from "typeorm";

export class addStatusUserManyReservations1588897607679 implements MigrationInterface {
    name = 'addStatusUserManyReservations1588897607679'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_many_reserva" ADD "activate" character varying NULL`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_many_reserva" DROP COLUMN "activate"`, undefined);
    }

}
