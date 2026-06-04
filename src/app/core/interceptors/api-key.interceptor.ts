import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export const apiKeyInterceptor: HttpInterceptorFn = (req, next) => {
  // Solo aplica el interceptor a peticiones hacia la RAWG API
  if (req.url.includes(environment.apiUrl)) {
    const modifiedReq = req.clone({
      params: req.params.set('key', environment.apiKey)
    });
    return next(modifiedReq);
  }
  return next(req);
};
