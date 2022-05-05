import { Repository } from "../repository";
import { createTokenService, TokenService } from "./tokenService";

export interface Services {
  tokenService: TokenService;
}

interface CreateServicesDeps {
  repository: Repository;
  JWT_SECRET: string;
  ORIGIN: string;
}

export function createServices({ repository, JWT_SECRET, ORIGIN }: CreateServicesDeps): Services {
  repository;

  return {
    tokenService: createTokenService({
      jwtSecret: JWT_SECRET,
      origin: ORIGIN,
    }),
  };
}
