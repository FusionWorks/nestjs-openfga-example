import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { AuthorizationRelations } from 'src/authorization/authorization-relations.enum';

export class DeleteProjectMemberDto {

  @ApiProperty({
    description: 'The user ID to remove from the project.',
    example: 'auth0|1234567890',
  })
  @IsNotEmpty()
  userId: string;

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