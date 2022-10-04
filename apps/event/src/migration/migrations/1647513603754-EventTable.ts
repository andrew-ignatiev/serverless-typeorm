import { MigrationInterface, QueryRunner } from 'typeorm';

export class EventTable1647513603754 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE event (
         id          BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
         type_id     BIGINT NOT NULL,
         store_id    INT NOT NULL,
         name        VARCHAR(255) NOT NULL,
         start_date  DATETIME NOT NULL,
         end_date    DATETIME NOT NULL,
         created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
         updated_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
       )`,
    );
    await queryRunner.query(
      `CREATE INDEX IDX_TYPE_ID_STORE_ID ON event (type_id, store_id)`,
    );
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE event`);
  }
}
