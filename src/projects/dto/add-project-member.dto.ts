import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { AuthorizationRelationships } from 'src/authorization/authorization-relationships.enum';

export class AddProjectMemberDto {

  @ApiProperty(
    {
      description: 'The user ID to add to the project.',
      example: 'auth0|1234567890',
    },
  )
  @IsNotEmpty()
  readonly userId: string;

  @ApiProperty(
    {
      description: 'The role of the user in the project.',
      example: 'member',
      enum: AuthorizationRelationships,
    },
  )
  @IsNotEmpty()
  @IsEnum(AuthorizationRelationships)
  readonly role: AuthorizationRelationships;
}