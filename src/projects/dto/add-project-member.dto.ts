import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { AuthorizationRelations } from 'src/authorization/authorization-relations.enum';

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
      enum: AuthorizationRelations,
    },
  )
  @IsNotEmpty()
  @IsEnum(AuthorizationRelations)
  readonly role: AuthorizationRelations;
}