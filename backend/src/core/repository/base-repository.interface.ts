import { IDatabaseConnection } from "../database/connection.interface";

export interface IBaseRepository<
  T,
  CreateDto = Partial<T>,
  UpdateDto = Partial<T>
> {
  create(data: CreateDto, conn: IDatabaseConnection): Promise<void | number>;
  update(id: number, data: UpdateDto, conn: IDatabaseConnection): Promise<void>;
  findAll(conn: IDatabaseConnection): Promise<T[]>;
  // findById(id: number, conn: IDatabaseConnection): Promise<T | null>;
  findPaginatedAndCount(
    params: {
      search: string;
      limit: number;
      offset: number;
    },
    conn: IDatabaseConnection
  ): Promise<{
    data: T[];
    total: number;
  }>;
}
