import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, HydratedDocument } from "mongoose";

export type ProjectDocument = HydratedDocument<Project>;

@Schema({
  toObject: {
    virtuals: true,
  },
})
export class Project {

  @Prop({ required: true })
  name: string;
}

export const ProjectSchema = SchemaFactory.createForClass(Project);
