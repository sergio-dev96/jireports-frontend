import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map, take, filter, switchMap } from 'rxjs/operators';
import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    return authService.isAuthenticated$.pipe(
        take(1), // Toma el primer valor emitido y se desuscribe
        map(isAuthenticated => {
            if (isAuthenticated) {
                return true; // Permite el acceso
            } else {
                // Si no está autenticado, redirige a la página de login
                return router.createUrlTree(['/auth/login']);
            }
        })
    );
};

// export const authGuard: CanActivateFn = () => {
//     const authService = inject(AuthService);
//     const router = inject(Router);

//     return authService.initialAuthCheckDone$.pipe(
//         // 1. Espera (filter): No hace nada hasta que initialAuthCheckDone$ emita 'true'.
//         //    Esto detiene al guardián hasta que el primer refreshToken() haya terminado.
//         filter((isDone) => { return isDone === true; }),

//         // 2. Cambia de Observable (switchMap): Una vez que el chequeo inicial está hecho,
//         //    nos cambiamos al observable que realmente nos importa: isAuthenticated$.
//         switchMap(() => authService.isAuthenticated$),

//         // 3. Toma la Decisión (map): Con el estado de autenticación definitivo,
//         //    decidimos si permitir el acceso o redirigir.
//         map(isAuthenticated => {
//             if (isAuthenticated) {
//                 return true; // ¡Acceso concedido!
//             } else {
//                 // Redirige a la página de login si no está autenticado.
//                 return router.createUrlTree(['/auth/login']);
//             }
//         })
//     );
// };