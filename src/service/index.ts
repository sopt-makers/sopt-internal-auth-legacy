import { Repository } from "../repository";

export interface Services {
  hello(): string;
}

interface CreateServicesDeps {
  repository: Repository;
}

export function createServices({ repository }: CreateServicesDeps): Services {
  repository;

  return {
    hello() {
      return "world";
    },
  };
}
