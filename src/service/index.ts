import { Repository } from "../repository";
import { AuthService, createAuthService } from "./authService";
import { createRegisterService, RegisterService } from "./registerService";
import { createTokenService, TokenService } from "./tokenService";
import { createUserService, UserService } from "./userService";

export interface Services {
  tokenService: TokenService;
  authService: AuthService;
  userService: UserService;
  registerService: RegisterService;
}

interface CreateServicesDeps {
  repository: Repository;
  JWT_SECRET: string;
  ORIGIN: string;
}

export function createServices({ repository, JWT_SECRET, ORIGIN }: CreateServicesDeps): Services {
  const tokenService = createTokenService({
    jwtSecret: JWT_SECRET,
    origin: ORIGIN,
  });
  return {
    tokenService,
    authService: createAuthService({
      facebookAPIRepository: repository.facebookAPI,
      facebookAuthRepository: repository.facebookAuth,
      userRepository: repository.user,
      soptMemberRepository: repository.soptMember,
      tokenService,
    }),
    userService: createUserService({
      facebookAPIRepository: repository.facebookAPI,
      facebookAuthRepository: repository.facebookAuth,
      userRepository: repository.user,
    }),
    registerService: createRegisterService({
      emailRepository: repository.email,
      soptMemberRepository: repository.soptMember,
      userRepository: repository.user,
      tokenService: tokenService,
    }),
  };
}
