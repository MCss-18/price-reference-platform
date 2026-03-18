import { IDatabaseConnection } from "../../../core/database/connection.interface";
import { IBaseRepository } from "../../../core/repository/base-repository.interface";
import { User } from "./user.interface";

export interface IUserRepository extends IBaseRepository<
  User
>{

  findById(
    conn: IDatabaseConnection,
    userId: number
  ): Promise<User | null>;

  findByUsername(
    conn: IDatabaseConnection,
    username: string,
    excludeUserId?: number
  ): Promise<User | null>;

}