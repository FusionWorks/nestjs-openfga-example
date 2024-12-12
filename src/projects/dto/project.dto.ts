import { ApiProperty } from "@nestjs/swagger";
import { Exclude, Expose } from "class-transformer";

@Exclude()
export class ProjectDto {

  @ApiProperty({
    description: 'The ID of the project.',
    example: '1234567890',
  })
  @Expose()
  id: string;

  @ApiProperty({
    description: 'The name of the project.',
    example: 'My Project',
  })
  @Expose()
  name: string;

  constructor(partial: Partial<ProjectDto>) {
    Object.assign(this, partial);
    console.log(this);
  }

  static fromDocument(doc: any): ProjectDto {
    const plain = doc.toObject ? doc.toObject() : doc;
    return new ProjectDto(plain);
  }
}