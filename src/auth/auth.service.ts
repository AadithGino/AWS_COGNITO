import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import {
  AuthenticationDetails,
  CognitoUser,
  CognitoUserAttribute,
  CognitoUserPool,
  CognitoUserSession,
} from 'amazon-cognito-identity-js';
import { SetNewPasswordDto, SignInDto, SignUpDto, VerifyEmail } from './dto';

@Injectable()
export class AuthService {
  private userPool: CognitoUserPool;

  constructor() {
    this.userPool = new CognitoUserPool({
      UserPoolId: process.env.USER_POOL_ID,
      ClientId: process.env.USER_POOL_CLIENT_ID,
    });
  }

  async signUp(dto: SignUpDto) {
    try {
      const result = await new Promise((resolve, reject) => {
        this.userPool.signUp(
          dto.email,
          dto.password,
          [
            new CognitoUserAttribute({ Name: 'name', Value: dto.username }),
            new CognitoUserAttribute({ Name: 'email', Value: dto.email }),
            new CognitoUserAttribute({
              Name: 'phone_number',
              Value: '+917907753163',
            }),
          ],
          null,
          (err, result) => {
            if (err) {
              reject(err);
            } else {
              resolve(result);
            }
          },
        );
      });

      return result;
    } catch (error) {
      if (error.name === 'UsernameExistsException') {
        throw new UnauthorizedException(error?.message);
      } else {
        throw new BadRequestException(error?.message);
      }
    }
  }

  async verifyEmail(dto: VerifyEmail) {
    try {
      const result = await new Promise((resolve, reject) => {
        new CognitoUser({
          Username: dto.email,
          Pool: this.userPool,
        }).confirmRegistration(dto.otp, true, (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        });
      });

      return result;
    } catch (error) {
      if (error.name === 'NotAuthorizedException') {
        throw new UnauthorizedException(error?.message);
      } else {
        throw new BadRequestException(error?.message);
      }
    }
  }

  async signIn(dto: SignInDto): Promise<CognitoUserSession> {
    try {
      const authenticationDetails = new AuthenticationDetails({
        Username: dto.email,
        Password: dto.password,
      });

      const userData = {
        Username: dto.email,
        Pool: this.userPool,
      };

      const newUser = new CognitoUser(userData);

      return await new Promise((resolve, reject) => {
        return newUser.authenticateUser(authenticationDetails, {
          onSuccess: (result) => {
            resolve(result);
          },
          onFailure: (err) => {
            reject(err);
          },
        });
      });
    } catch (error) {
      if (error.name === 'NotAuthorizedException') {
        throw new UnauthorizedException(error?.message);
      } else {
        throw new BadRequestException(error?.message);
      }
    }
  }

  async forgotPassword(email: string) {
    try {
      return await new Promise((resolve, reject) => {
        return new CognitoUser({
          Username: email,
          Pool: this.userPool,
        }).forgotPassword({
          onSuccess: function (result) {
            resolve(result);
          },
          onFailure: function (err) {
            reject(err);
          },
        });
      });
    } catch (error) {
      if (error.name === 'NotAuthorizedException') {
        throw new UnauthorizedException(error?.message);
      } else {
        throw new BadRequestException(error?.message);
      }
    }
  }

  async setNewPassword(dto: SetNewPasswordDto) {
    try {
      return await new Promise((resolve, reject) => {
        return new CognitoUser({
          Username: dto.email,
          Pool: this.userPool,
        }).confirmPassword(dto.verificationCode, dto.newPassword, {
          onSuccess: function (result) {
            resolve(result);
          },
          onFailure: function (err) {
            console.log(err);
            reject(err);
          },
        });
      });
    } catch (error) {
      throw new BadRequestException(error?.message);
    }
  }
}
