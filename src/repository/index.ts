import { Database } from "../database";
import { createUserRepository, UserRepository } from "./user";

export interface Repository {
  user: UserRepository;
}

interface RepositoryDeps {
  db: Database;
}

export function createRepository({ db }: RepositoryDeps): Repository {
  return {
    user: createUserRepository(db),
  };
}
