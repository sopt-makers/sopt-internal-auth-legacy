import { Repository } from "../repository";
import { AuthService, createAuthService } from "./authService";
import { createTokenService, TokenService } from "./tokenService";
import { createUserService, UserService } from "./userService";

export interface Services {
  tokenService: TokenService;
  authService: AuthService;
  userService: UserService;
}

interface CreateServicesDeps {
  repository: Repository;
  JWT_SECRET: string;
  ORIGIN: string;
}

export function createServices({ repository, JWT_SECRET, ORIGIN }: CreateServicesDeps): Services {
  return {
    tokenService: createTokenService({
      jwtSecret: JWT_SECRET,
      origin: ORIGIN,
    }),
    authService: createAuthService({
      facebookAPIRepository: repository.facebookAPI,
      facebookAuthRepository: repository.facebookAuth,
      userRepository: repository.user,
    }),
    userService: createUserService({
      facebookAPIRepository: repository.facebookAPI,
      facebookAuthRepository: repository.facebookAuth,
      userRepository: repository.user,
    }),
  };
}
