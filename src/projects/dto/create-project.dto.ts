import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateProjectDto {

  @ApiProperty({
    description: 'The name of the project.',
    example: 'My Project',
  })
  @IsString()
  @IsNotEmpty({ message: 'Project name must not be empty' })
  name: string;
}