import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class DeleteProjectMemberDto {

  @ApiProperty({
    description: 'The user ID to remove from the project.',
    example: 'auth0|1234567890',
  })
  @IsNotEmpty()
  userId: string;
}