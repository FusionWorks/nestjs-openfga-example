import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Delete,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PermissionsGuard } from '../authorization/permissions.guard';
import { Permissions } from '../authorization/permissions.decorator';
import { ProjectsService } from './projects.service';
import { AuthorizationService } from '../authorization/authorization.service';
import { AuthorizationParty } from '../authorization/authorization-party';
import { AuthorizationPartyTypes } from '../authorization/authorization-types.enum';
import { AuthorizationRelationships } from '../authorization/authorization-relationships.enum';
import { CreateProjectDto } from './dto/create-project.dto';
import { User } from 'src/auth/user.decorator';
import { AddProjectMemberDto } from './dto/add-project-member.dto';
import { DeleteProjectMemberDto } from './dto/delete-project-member.dto';
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';
import { ProjectDto } from './dto/project.dto';
import { MemberDto } from './dto/member.dto';

@ApiBearerAuth('Auth0')
@Controller('projects')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class ProjectsController {
  constructor(
    private readonly projectsService: ProjectsService,
    private readonly authorizationService: AuthorizationService,
  ) { }


  /**
   * Get all projects.
   */
  @Get()
  @ApiOkResponse({ type: ProjectDto, isArray: true })
  async getProjects(@User() currentUser): Promise<ProjectDto[]> {
    const user = new AuthorizationParty(AuthorizationPartyTypes.USER, currentUser.sub);
    const projectIds = await this.authorizationService.listObjectIds(
      user,
      AuthorizationPartyTypes.PROJECT,
      AuthorizationRelationships.MEMBER,
    );
    const projects = await this.projectsService.findAll(projectIds);
    return projects.map((project) => ProjectDto.fromDocument(project));
  }

  /**
   * Get a project by ID.
   */
  @Get(':id')
  @ApiOkResponse({ type: ProjectDto })
  @Permissions({
    permission: AuthorizationRelationships.MEMBER,
    objectType: 'project',
    objectIdParam: 'id',
  })
  async getProject(@Param('id') id: string): Promise<ProjectDto> {
    const project = await this.projectsService.findOne(id);
    return ProjectDto.fromDocument(project);
  }

  /**
   * Create a new project.
   */
  @Post()
  @ApiCreatedResponse({ type: ProjectDto })
  async createProject(@Body() createProjectDto: CreateProjectDto, @User() currentUser) {
    const project = await this.projectsService.create(createProjectDto);

    const userId = currentUser.sub;
    const user = new AuthorizationParty(AuthorizationPartyTypes.USER, userId);
    const object = new AuthorizationParty(AuthorizationPartyTypes.PROJECT, project.id);
    await this.authorizationService.addRelationship(
      user,
      object,
      AuthorizationRelationships.OWNER,
    );

    return ProjectDto.fromDocument(project);
  }

  /**
   * List all members of a project.
   */
  @Get(':id/members')
  @ApiOkResponse({ type: String, isArray: true })
  @Permissions({
    permission: AuthorizationRelationships.MEMBER,
    objectType: AuthorizationPartyTypes.PROJECT,
    objectIdParam: 'id',
  })
  async listMembers(@Param('id') projectId: string): Promise<MemberDto[]> {
    const project = new AuthorizationParty(
      AuthorizationPartyTypes.PROJECT,
      projectId,
    );
    return (await this.authorizationService.listUsers(project)).map(
      (user) => {
        return {
          userId: user.userId,
          roles: user.relations.map((role) => role.toString()),
        }
      }
    );
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
  async addMember(
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
    return { message: 'Ok' };
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
  async removeMember(
    @Param('id') projectId: string,
    @Body() deleteMemberDto: DeleteProjectMemberDto,
  ) {
    const { userId } = deleteMemberDto;

    const user = new AuthorizationParty(AuthorizationPartyTypes.USER, userId);
    const project = new AuthorizationParty(
      AuthorizationPartyTypes.PROJECT,
      projectId,
    );

    await this.authorizationService.removeRelationship(user, project, deleteMemberDto.role);
    return { message: 'Ok' };
  }

}