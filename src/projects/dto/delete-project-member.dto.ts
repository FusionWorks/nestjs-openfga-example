import { IsNotEmpty, IsUUID } from 'class-validator';

export class DeleteProjectMemberDto {

  @IsNotEmpty()
  userId: string;
}