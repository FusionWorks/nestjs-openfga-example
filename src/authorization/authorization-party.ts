import { AuthorizationPartyTypes } from "./authorization-party-types.enum";

export class AuthorizationParty {
  type: AuthorizationPartyTypes;
  id: string;

  constructor(type: AuthorizationPartyTypes, id: string) {
    this.type = type;
    this.id = id;
  }

  toOpenFgaString(): string {
    return `${this.type}:${this.id}`;
  }
}