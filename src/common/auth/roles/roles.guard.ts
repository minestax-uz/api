import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JsonWebTokenError, verify } from 'jsonwebtoken';
import { Observable } from 'rxjs';
import { HttpError } from 'src/common/exception/http.error';
import { Role } from './role.enum';
import { ROLES_KEY } from './roles.decorator';
import { env } from 'src/common/config';

export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    try {
      const requiredRoles = this.reflector.getAllAndOverride<Role[]>(
        ROLES_KEY,
        [context.getHandler(), context.getClass()],
      );

      const request = context.switchToHttp().getRequest();
      let bearerToken = request.headers['authorization'];

      if (!bearerToken) {
        HttpError({ code: 'BEARER_TOKEN_NOT_PROVIDED' });
      }

      bearerToken = bearerToken.split(' ')[1];

      // Verify the token with more detailed error handling
      try {
        const validAuth: any = verify(bearerToken, env.ACCESS_TOKEN_SECRET, {
          algorithms: ['HS256'], // Explicitly specify the algorithm
          clockTolerance: 30, // Allow 30 seconds of clock skew
        });

        if (!validAuth) {
          HttpError({ code: 'LOGIN_FAILED' });
        }

        // Check if token is about to expire (less than 5 minutes left)
        const now = Math.floor(Date.now() / 1000);
        if (validAuth.exp && validAuth.exp - now < 300) {
          // Add a flag to indicate token is about to expire
          // This could be used by a middleware to refresh the token
          request.tokenExpiringSoon = true;
        }

        request.user = {
          ...validAuth,
        };

        return requiredRoles?.includes(validAuth.role);
      } catch (tokenError) {
        // Handle specific JWT errors with more detailed messages
        if (tokenError.name === 'TokenExpiredError') {
          HttpError({
            code: 'JWT_EXPIRED',
            message: 'Your session has expired. Please log in again.',
            statusCode: 401,
          });
        } else if (tokenError.name === 'JsonWebTokenError') {
          HttpError({
            code: 'JWT_INVALID',
            message: 'Invalid authentication token. Please log in again.',
            statusCode: 401,
          });
        } else if (tokenError.name === 'NotBeforeError') {
          HttpError({
            code: 'JWT_NOT_ACTIVE',
            message: 'Token not yet active. Please try again later.',
            statusCode: 401,
          });
        }

        // If we get here, it's an unknown JWT error
        HttpError({
          code: 'JWT_ERROR',
          message: 'Authentication error. Please log in again.',
          statusCode: 401,
        });
      }
    } catch (error) {
      // This will catch any other errors not related to JWT validation
      console.error('Auth guard error:', error);
      throw error;
    }
  }
}
