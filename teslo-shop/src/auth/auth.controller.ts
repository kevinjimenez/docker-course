import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from "@nestjs/swagger";
import { AuthService } from './auth.service';
import { Auth } from './decorators/auth.decorator';
import { GetUser } from './decorators/get-user.decorator';
import { RawHeaders } from './decorators/raw-headers.decorator';
import { RoleProtected } from './decorators/role-protected.decorator';
import { CreateUserDto, LoginUserDto } from './dto';
import { User } from './entities/user.entity';
import { ValidRoles } from './enums/valid-roles.enum';
import { UserRoleGuard } from './guards/user-role.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @Post('login')
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Get('check-auth-status')
  @Auth()
  checkAuthStatus(@GetUser() user: User) {
    return this.authService.checkAuthStatus(user);
  }

  @Get('private')
  @UseGuards(AuthGuard())
  testingPrivateRoute(
    @Req() resquest: Express.Request,
    // @GetUser('email') user: User,
    // @GetUser(['email', '1', '2']) user: User,
    @GetUser() user: User,
    @GetUser('email') userEmail: string,
    @RawHeaders() rawHeaders: string[],
    // @Headers() headers: IncomingHttpHeaders,
  ) {
    console.log(resquest);
    return {
      ok: true,
      msg: 'hola mundo private',
      user,
      userEmail,
      rawHeaders,
    };
  }

  @Get('private2')
  // data extra
  // @SetMetadata('roles', ['admin', 'user'])
  @RoleProtected(ValidRoles.admin, ValidRoles.user)
  // recomienda cuan son custom guar solo mandar la referencia
  @UseGuards(AuthGuard(), UserRoleGuard)
  testingPrivate2Route(@GetUser() user: User) {
    return {
      ok: true,
      user,
    };
  }

  @Get('private3')
  @Auth(ValidRoles.user, ValidRoles.admin)
  testingPrivate3Route(@GetUser() user: User) {
    return {
      ok: true,
      user,
    };
  }
}
