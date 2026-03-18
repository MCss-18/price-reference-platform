import { User} from "./interface/user.interface";
import { UserRepository } from "./user.repository";
import { BaseService } from "../../core/service/base.service";
import { PostgresConnectionProvider } from "../../database/postgres/postgres-connection.provider";

export class UserService extends BaseService<
    User
  > {

  protected repository = new UserRepository();
  protected connectionProvider = new PostgresConnectionProvider();

  public async findById(
    id: number
  ): Promise<User | null> {
    return this.withConnection(async (conn) => {
      return this.repository.findById(conn, id);
    });
  }
  
  public async findByUsername(
    username: string
  ): Promise<User | null> {
    return this.withConnection(async (conn) => {
      return this.repository.findByUsername(conn, username);
    });
  }

}