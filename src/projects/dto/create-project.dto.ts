import { IsNotEmpty, IsString } from "class-validator";

export class CreateProjectDto {
  /**
   * The name of the project.
   * @example "Awesome Project"
   */
  @IsString()
  @IsNotEmpty({ message: 'Project name must not be empty' })
  name: string;
}