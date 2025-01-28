import { ExecutionContext, CallHandler, Injectable } from "@nestjs/common";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { HttpStatus } from "@nestjs/common";

// Wrapper interface to add status code to response
interface ResponseWrapper<T> {
  statusCode: HttpStatus;
  data: T;
}

@Injectable()
export class TransformInterceptor<T> {
  intercept(
    context: ExecutionContext,
    next: CallHandler<T>
  ): Observable<ResponseWrapper<T>> {
    return next.handle().pipe(
      map((data) => ({
        statusCode: HttpStatus.OK,
        data,
      }))
    );
  }
}
