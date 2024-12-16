import { FgaObject } from "@openfga/sdk";
import { AuthorizationPartyTypes } from "./authorization-types.enum";

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

  toOpenFgaObject(): FgaObject {
    return { type: this.type, id: this.id };
  }
}