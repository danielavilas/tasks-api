import { MigrationInterface, QueryRunner } from 'typeorm';
import { User } from '../entities';
import bcrypt from 'bcryptjs';

export class CreateUser1713149168041 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const hashedPassword = await bcrypt.hash('Password123!', 10);

    const user = new User();
    user.username = 'daniel';
    user.password = hashedPassword;

    const user2 = new User();
    user2.username = 'avila';
    user2.password = hashedPassword;

    await queryRunner.manager.save(user);
    await queryRunner.manager.save(user2);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
  }
}
