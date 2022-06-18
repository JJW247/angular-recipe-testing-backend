import { IsEmail, Matches } from 'class-validator';
export class RequestAuthDto {
  @IsEmail({}, { message: 'Please enter valid email address!' })
  email: string;
  @Matches(
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,16}$/,
    {
      message:
        'Please enter valid password, which is in the form of 8 to 16 characters including at least one alphabet, number, and special character!',
    },
  )
  password: string;
}
