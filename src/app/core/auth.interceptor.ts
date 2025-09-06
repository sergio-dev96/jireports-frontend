import { HttpErrorResponse, HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core'; // Asegúrate que inject sea de @angular/core
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, switchMap, filter, take } from 'rxjs/operators';
import { AuthService } from './auth.service';

let isRefreshing = false;
const refreshTokenSubject = new BehaviorSubject<any>(null);

// MODIFICACIÓN CLAVE: No se inyecta el servicio aquí arriba
export const authInterceptor: HttpInterceptorFn = (
    req: HttpRequest<any>,
    next: HttpHandlerFn
): Observable<HttpEvent<any>> => {
    // Se inyecta aquí para obtener los tokens, pero no causa el ciclo
    const authService = inject(AuthService);
    const accessToken = authService.currentAccessToken;
    const csrfToken = authService.currentCsrfToken;
    if (accessToken) {
        req = addTokenHeaders(req, accessToken, csrfToken);
    }

    return next(req).pipe(
        catchError((error: HttpErrorResponse) => {
            if (error.status === 401 && !req.url.includes('/login') && !req.url.includes('/refresh')) {
                // Pasamos 'next' como argumento a la función helper
                return handle401Error(req, next);
            }
            return throwError(() => error);
        })
    );
};

// Esta función no necesita inyectar nada, solo recibe los tokens
function addTokenHeaders(request: HttpRequest<any>, accessToken: string, csrfToken: string | null): HttpRequest<any> {
    let headers = request.headers.set('Authorization', `Bearer ${accessToken}`);
    if (csrfToken) {
        headers = headers.set('X-CSRF-Token', csrfToken);
    }
    return request.clone({ headers });
}

// Esta función es la que necesita inyectar el servicio para llamar a refreshToken y logout
function handle401Error(request: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> {
    // MODIFICACIÓN CLAVE: Se inyecta el servicio aquí, de forma tardía
    const authService = inject(AuthService);

    if (!isRefreshing) {
        isRefreshing = true;
        refreshTokenSubject.next(null);

        return authService.refreshToken().pipe(
            switchMap((authResponse) => {
                isRefreshing = false;
                refreshTokenSubject.next(authResponse.detail.access_token!);
                return next(addTokenHeaders(request, authResponse.detail.access_token!, authResponse.detail.csrf_token!));
            }),
            catchError((err) => {
                isRefreshing = false;
                authService.logout();
                return throwError(() => err);
            })
        );
    } else {
        return refreshTokenSubject.pipe(
            filter(token => token != null),
            take(1),
            switchMap((accessToken) => {
                return next(addTokenHeaders(request, accessToken, authService.currentCsrfToken));
            })
        );
    }
}