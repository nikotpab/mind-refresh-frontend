import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Since we use HttpOnly cookies, we just need to ensure withCredentials is true
  // for all requests to the backend API.
  req = req.clone({
    withCredentials: true
  });

  return next(req);
};
