import { ApiProperty } from "@nestjs/swagger";
import { Exclude, Expose } from "class-transformer";
import { AuthorizationRelationships } from "src/authorization/authorization-relationships.enum";
import { Auth } from "typeorm";

@Exclude()
export class MemberDto {

  @ApiProperty({
    description: 'The user ID of the member.',
    example: 'auth0|1234567890',
  })
  @Expose()
  userId: string;

  @ApiProperty({
    description: 'The role of the member in the project.',
    example: 'member',
  })
  @Expose()
  roles: string[];
}