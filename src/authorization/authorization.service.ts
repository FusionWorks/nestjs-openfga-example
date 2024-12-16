import { Injectable, ForbiddenException, Logger } from '@nestjs/common';
import { OpenFgaClient, CredentialsMethod, TupleKey } from '@openfga/sdk';
import { ConfigService } from '@nestjs/config';
import { AuthorizationPartyTypes } from './authorization-types.enum';
import { AuthorizationRelationships } from './authorization-relationships.enum';
import { AuthorizationParty } from './authorization-party';

@Injectable()
export class AuthorizationService {

  private readonly logger = new Logger(AuthorizationService.name);

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

  async listUsers(object: AuthorizationParty): Promise<{ userId: string; relations: string[] }[]> {
    const relations = [
      AuthorizationRelationships.MEMBER,
      AuthorizationRelationships.OWNER,
      AuthorizationRelationships.ADMIN
    ];

    const responses = await Promise.all(
      relations.map(async (relation) => {
        const response = await this.client.listUsers({
          object: object.toOpenFgaObject(),
          relation,
          user_filters: [
            {
              type: AuthorizationPartyTypes.USER,
            },
          ],
        });
        return { relation, users: response.users };
      })
    );

    const userRolesMap = responses.reduce((acc, { relation, users }) => {
      users.forEach(user => {
        const userId = user.object.id;
        if (!acc[userId]) {
          acc[userId] = new Set<string>();
        }
        acc[userId].add(relation);
      });
      return acc;
    }, {} as Record<string, Set<string>>);

    const aggregatedUsers = Object.entries(userRolesMap).map(([userId, rolesSet]) => ({
      userId,
      relations: Array.from(rolesSet),
    }));

    return aggregatedUsers;
  }

  async addRelationship(user: AuthorizationParty, object: AuthorizationParty, relationship: AuthorizationRelationships): Promise<void> {
    const tupleKey: TupleKey = {
      user: user.toOpenFgaString(),
      relation: relationship,
      object: object.toOpenFgaString(),
    };

    await this.client.write({
      writes: [tupleKey],
    });
  }

  async removeRelationship(user: AuthorizationParty, object: AuthorizationParty, relationship: AuthorizationRelationships): Promise<void> {
    const tupleKey: TupleKey = {
      user: user.toOpenFgaString(),
      relation: relationship,
      object: object.toOpenFgaString(),
    };

    await this.client.write({
      deletes: [tupleKey],
    });
  }

}