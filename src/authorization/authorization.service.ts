import { Injectable, ForbiddenException } from '@nestjs/common';
import { OpenFgaClient, CredentialsMethod, TupleKey } from '@openfga/sdk';
import { ConfigService } from '@nestjs/config';
import { AuthorizationPartyTypes } from './authorization-types.enum';
import { AuthorizationRelationships } from './authorization-relationships.enum';
import { AuthorizationParty } from './authorization-party';

@Injectable()
export class AuthorizationService {
  private client: OpenFgaClient;

  constructor(private readonly configService: ConfigService) {
    this.client = new OpenFgaClient({
      apiUrl: this.configService.get<string>('FGA_API_URL'),
      storeId: this.configService.get<string>('FGA_STORE_ID'),
      credentials: {
        method: CredentialsMethod.ClientCredentials,
        config: {
          clientId: this.configService.get<string>('FGA_CLIENT_ID'),
          clientSecret: this.configService.get<string>('FGA_CLIENT_SECRET'),
          apiTokenIssuer: this.configService.get<string>('FGA_API_TOKEN_ISSUER'),
          apiAudience: this.configService.get<string>('FGA_API_AUDIENCE'),
        },
      },
    });
  }

  async checkPermission(
    userId: string,
    permission: string,
    objectType: string,
    objectId: string,
  ): Promise<boolean> {
    try {
      const response = await this.client.check({
        user: `${AuthorizationPartyTypes.USER}:${userId}`,
        relation: permission,
        object: `${objectType}:${objectId}`,
      });
      return response.allowed;
    } catch (error) {
      return false;
    }
  }

  async listObjectIds(user: AuthorizationParty, objectType: AuthorizationPartyTypes, relation: AuthorizationRelationships): Promise<string[]> {
    const request = {
      user: user.toOpenFgaString(),
      relation,
      type: objectType
    };
    const response = await this.client.listObjects(request);
    return response.objects.map((object) => object.split(':')[1]);
  }

  async addRelationship(user: AuthorizationParty, object: AuthorizationParty, relationship: AuthorizationRelationships): Promise<void> {
    const tupleKey: TupleKey = {
      user: user.toOpenFgaString(),
      relation: relationship,
      object: object.toOpenFgaString(),
    };

    try {
      const response = await this.client.write({
        writes: [tupleKey],
      });
      console.log('OpenFGA write response:', response);
    } catch (error) {
      throw new ForbiddenException(`Failed to assign ${relationship} to the ${user.toOpenFgaString()} on ${object.toOpenFgaString()}.`);
    }
  }

  async removeRelationship(user: AuthorizationParty, object: AuthorizationParty, relationship: AuthorizationRelationships): Promise<void> {
    const tupleKey: TupleKey = {
      user: user.toOpenFgaString(),
      relation: relationship,
      object: object.toOpenFgaString(),
    };

    try {
      await this.client.write({
        deletes: [tupleKey],
      });
    } catch (error) {
      throw new ForbiddenException(`Failed to assign ${relationship} to the ${user.toOpenFgaString()} on ${object.toOpenFgaString()}.`);
    }
  }

  async removeObject(object: AuthorizationParty): Promise<void> {
    const tupleKey: TupleKey = {
      user: '*',
      relation: '*',
      object: `${object.toOpenFgaString()}`,
    };
    try {
      await this.client.write({
        deletes: [tupleKey],
      });
    } catch (error) {
      throw new ForbiddenException(`Failed to remove object ${object.toOpenFgaString()}.`);
    }
  }

  async removeUser(user: AuthorizationParty): Promise<void> {
    const tupleKey: TupleKey = {
      user: `${user.toOpenFgaString()}`,
      relation: '*',
      object: '*',
    };
    try {
      await this.client.write({
        deletes: [tupleKey],
      });
    } catch (error) {
      throw new ForbiddenException(`Failed to remove user ${user.toOpenFgaString()}.`);
    }
  }

}