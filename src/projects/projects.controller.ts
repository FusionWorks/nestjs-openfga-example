// src/projects/projects.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Delete,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PermissionsGuard } from '../authorization/permissions.guard';
import { Permissions } from '../authorization/permissions.decorator';
import { ProjectsService } from './projects.service';
import { AuthorizationService } from '../authorization/authorization.service';
import { AuthorizationParty } from '../authorization/authorization-party';
import { AuthorizationPartyTypes } from '../authorization/authorization-party-types.enum';
import { AuthorizationRelationships } from '../authorization/authorization-relationships.enum';
import { CreateProjectDto } from './dto/create-project.dto';
import { User } from 'src/auth/user.decorator';
import { AddProjectMemberDto } from './dto/add-project-member.dto';
import { DeleteProjectMemberDto } from './dto/delete-project-member.dto';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth('Auth0')
@Controller('projects')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class ProjectsController {
  constructor(
    private readonly projectsService: ProjectsService,
    private readonly authorizationService: AuthorizationService,
  ) { }


  /**
   * Get all projects.
   */
  @Get()
  async getProjects(@User() currentUser) {
    const user = new AuthorizationParty(AuthorizationPartyTypes.USER, currentUser.sub);
    const projectIds = await this.authorizationService.listObjectIds(
      user,
      AuthorizationPartyTypes.PROJECT,
      AuthorizationRelationships.MEMBER,
    );
    return this.projectsService.findAll(projectIds);
  }

  /**
   * Get a project by ID.
   */
  @Get(':id')
  @Permissions({
    permission: AuthorizationRelationships.MEMBER,
    objectType: 'project',
    objectIdParam: 'id',
  })
  async getProject(@Param('id') id: string) {
    return this.projectsService.findOne(id);
  }

  /**
   * Create a new project.
   */
  @Post()
  async createProject(@Body() createProjectDto: CreateProjectDto, @User() currentUser) {
    const project = await this.projectsService.create(createProjectDto);

    const userId = currentUser.sub;
    if (userId) {
      const user = new AuthorizationParty(AuthorizationPartyTypes.USER, userId);
      const object = new AuthorizationParty(AuthorizationPartyTypes.PROJECT, project.id,);
      await this.authorizationService.addRelationship(
        user,
        object,
        AuthorizationRelationships.OWNER,
      );
    }

    return project;
  }

  /**
   * Assign a member to a project.
   * Requires 'admin' permission on the project.
   */
  @Post(':id/members')
  @Permissions({
    permission: AuthorizationRelationships.ADMIN,
    objectType: AuthorizationPartyTypes.PROJECT,
    objectIdParam: 'id',
  })
  async assignDeveloper(
    @Param('id') projectId: string,
    @Body() addMemberDto: AddProjectMemberDto,
  ) {
    const { userId, role } = addMemberDto;

    const user = new AuthorizationParty(AuthorizationPartyTypes.USER, userId);
    const project = new AuthorizationParty(
      AuthorizationPartyTypes.PROJECT,
      projectId,
    );

    await this.authorizationService.addRelationship(user, project, role);
    return { message: 'Member assigned successfully.' };
  }

  /**
   * Remove a member from a project.
   * Requires 'admin' permission on the project.
   */
  @Delete(':id/members')
  @Permissions({
    permission: AuthorizationRelationships.ADMIN,
    objectType: AuthorizationPartyTypes.PROJECT,
    objectIdParam: 'id',
  })
  async removeDeveloper(
    @Param('id') projectId: string,
    @Body() deleteMemberDto: DeleteProjectMemberDto,
  ) {
    const { userId } = deleteMemberDto;

    const user = new AuthorizationParty(AuthorizationPartyTypes.USER, userId);
    const project = new AuthorizationParty(
      AuthorizationPartyTypes.PROJECT,
      projectId,
    );

    await this.authorizationService.addRelationship(user, project, AuthorizationRelationships.ANY);
    return { message: 'Developer assigned successfully.' };
  }

}