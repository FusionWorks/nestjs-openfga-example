import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { AuthorizationRelationships } from 'src/authorization/authorization-relationships.enum';

export class AddProjectMemberDto {

  @IsNotEmpty()
  readonly userId: string;

  @IsNotEmpty()
  @IsString()
  @IsEnum(AuthorizationRelationships)
  readonly role: AuthorizationRelationships;
}