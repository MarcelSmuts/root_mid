import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { createHmac } from 'node:crypto'

@Injectable()
export class RootRequest implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    return validateRequest(request);
  }
}

function validateRequest(req: Request): boolean {
  // TODO: Implement correctly
  return true

  const secret = process.env.ROOT_SECRET;
  const signature = req.headers["x-hook-signature"];

  if (!signature) {
    throw new UnauthorizedException('X-Hook-Signature required.')
  }

  const check = createHmac("sha1", secret);
  check.update(JSON.stringify(req.body));
  const digest = check.digest("hex");

  if (signature === digest) {
    return true;
  } else {
    throw new UnauthorizedException('X-Hook-Signature does not match the expected signature.')
  }
}