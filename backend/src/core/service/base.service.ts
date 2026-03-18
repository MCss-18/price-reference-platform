import { IBaseRepository } from "../repository/base-repository.interface";
import { IDatabaseConnection } from "../database/connection.interface";
import { IConnectionProvider } from "../database/connection-provider.interface";

export abstract class BaseService<
    T,
    CreateDto = Partial<T>,
    UpdateDto = Partial<T>
  > {

  protected abstract repository: IBaseRepository<T, CreateDto, UpdateDto>;
  protected abstract connectionProvider: IConnectionProvider;

  protected async withConnection<T>(
    fn: (conn: IDatabaseConnection) => Promise<T>
  ): Promise<T> {
    let conn: IDatabaseConnection | null = null;
    try {
      conn = await this.connectionProvider.getConnection();
      return await fn(conn);
    } catch (error) {
      console.error("Service Error:", error);
      throw error;
    } finally {
      if (conn) {
        await this.connectionProvider.releaseConnection(conn);
      }
    }
  }
  
  public async findAll(): Promise<T[]> {
    return this.withConnection((conn) => this.repository.findAll(conn));
  }

  public async findPaginatedAndCount(
    limit: number,
    offset: number,
    search: string
  ): Promise<{ data: T[]; total: number }> {
    return this.withConnection((conn) =>
      this.repository.findPaginatedAndCount({ limit, offset, search }, conn)
    );
  }

  public async create(data: CreateDto): Promise<void | number> {
    return this.withConnection((conn) =>
      this.repository.create(data, conn)
    );
  }

  public async update(id: number, data: UpdateDto): Promise<void> {
    return this.withConnection((conn) =>
      this.repository.update(id, data, conn)
    );
  }

}