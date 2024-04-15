import { DataSource } from 'typeorm';
import { User, Task, TaskPermission, TaskHistory } from './entities';
import { CreateUser1713149168041 } from './migrations/1713149168041-CreateUser';
import { CreateTasks1713150753530 } from './migrations/1713150753530-CreateTasks';
import { CreateTaskPermission1713156010509 } from './migrations/1713156010509-CreateTaskPermission';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'postgres',
  port: 5432,
  username: 'admin',
  password: 'admin',
  database: 'tasksdb',
  synchronize: true,
  logging: true,
  entities: [
    User,
    Task,
    TaskPermission,
    TaskHistory,
  ],
  subscribers: [],
  migrations: [
    CreateUser1713149168041,
    CreateTasks1713150753530,
    CreateTaskPermission1713156010509,
  ],
  migrationsTableName: 'migrations'
});
