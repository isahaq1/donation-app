export class CreateUserDto {
  readonly username: string | undefined;
  readonly password: string | undefined;
  readonly email: string | undefined;
  readonly role: string | undefined;
}
