import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import * as jwksClient from 'jwks-rsa';
import * as jwt from 'jsonwebtoken'; // Import the jsonwebtoken library

@Injectable()
export class AtStrategy extends PassportStrategy(Strategy, 'jwt') {
  private readonly logger = new Logger(AtStrategy.name);

  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKeyProvider: (request, jwtToken, done) => {
        try {
          // Decode the JWT token to get the header
          const decodedToken = jwt.decode(jwtToken, { complete: true });

          if (!decodedToken || !decodedToken.header) {
            console.error('Invalid JWT token or missing header.');
            return done(new Error('Invalid JWT token'), false);
          }

          const { header } = decodedToken;

          const kid = header.kid;

          const client = jwksClient({
            jwksUri:
              'https://cognito-idp.us-east-1.amazonaws.com/us-east-1_K0sEVIIY0/.well-known/jwks.json',
          });

          // Fetch the public key from Cognito's JWKS endpoint
          client.getSigningKey(kid, (err, key) => {
            if (err) {
              console.log(err);
              this.logger.error(
                `Error fetching public key from Cognito JWKS: ${err.message}`,
              );
              return done(err, false);
            }

            const signingKey = key.getPublicKey();
            done(null, signingKey);
          });
        } catch (error) {
          console.error(error);
        }
      },
      algorithms: ['RS256'],
    });
  }

  async validate(payload: any) {
    try {
      console.log(payload);
      return payload;
    } catch (error) {
      this.logger.error(`Error in validate method: ${error.message}`);
      throw new UnauthorizedException('Invalid token');
    }
  }
}
