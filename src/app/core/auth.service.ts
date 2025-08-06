import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, map, catchError, of, finalize, firstValueFrom } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

// Interfaz para la respuesta del backend
export interface AuthResponse {
    detail: AuthResponseDetails
}
export interface AuthResponseDetails {
    access_token?: string;
    csrf_token?: string;
    token_type?: string;
    message?: string;
    success: boolean;
}

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private http = inject(HttpClient);
    public router = inject(Router);

    // Subjects para mantener el estado reactivo
    private isAuthenticated = new BehaviorSubject<boolean>(false);
    private accessToken = new BehaviorSubject<string | null>(null);
    private csrfToken = new BehaviorSubject<string | null>(null);

    // Observables públicos para que los componentes puedan suscribirse
    public isAuthenticated$ = new Observable<boolean>((observer) => {

        if (this.initialAuthCheckDone.getValue()) {
            observer.next(this.isAuthenticated.getValue());
            observer.complete();
        }
        else {
            this.refreshToken().pipe(
                // finalize se ejecuta siempre, ya sea en éxito o error.
                // Esto asegura que marquemos el chequeo como "hecho" sin importar el resultado.
                finalize(() => {
                    this.initialAuthCheckDone.next(true);
                    observer.next(this.isAuthenticated.getValue());
                    observer.complete();
                })
            ).subscribe();

        }
    });
    public accessToken$ = this.accessToken.asObservable();
    public csrfToken$ = this.csrfToken.asObservable();

    private initialAuthCheckDone = new BehaviorSubject<boolean>(false);
    public initialAuthCheckDone$ = this.initialAuthCheckDone.asObservable();

    public get currentAccessToken(): string | null {
        return this.accessToken.getValue();
    }

    public get currentCsrfToken(): string | null {
        return this.csrfToken.getValue();
    }

    // Método de Login
    login(credentials: { username: string; password: string }): Observable<AuthResponse> {
        const formData = new FormData();
        formData.append('username', credentials.username);
        formData.append('password', credentials.password);
        formData.append('grant_type', "password");

        return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/login`, formData, { withCredentials: true }).pipe(
            tap((res) => this.handleAuthSuccess(res)),
            catchError((error) => {
                return of(error.error); // Retorna un observable vacío en caso de error  
            })
        );
    }

    // Método de Logout
    logout(): void {
        // Llama al endpoint de logout para que el backend invalide la cookie
        this.http.post(`${environment.apiUrl}/logout`, {}).subscribe(() => {
            this.clearAuthData();
            this.router.navigate(['/login']);
        });
    }

    // Método para refrescar el token
    refreshToken(): Observable<AuthResponse> {

        // No se envía body. El refresh token viaja en la cookie HttpOnly.
        // El interceptor se encargará de añadir el header X-CSRF-Token.
        return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/refresh`, {}, { withCredentials: true }).pipe(
            tap((res) => this.handleAuthSuccess(res)),
            catchError((error) => {
                // Si el refresh falla, es un logout definitivo.
                this.clearAuthData();
                return of(); // Retorna un observable vacío para no propagar el error
            })
        );
    }

    // Helper para manejar una autenticación exitosa
    private handleAuthSuccess(response: AuthResponse): void {
        this.accessToken.next(response.detail.access_token!);
        this.csrfToken.next(response.detail.csrf_token!);
        this.isAuthenticated.next(true);
    }

    // Helper para limpiar todos los datos de sesión
    private clearAuthData(): void {
        this.accessToken.next(null);
        this.csrfToken.next(null);
        this.isAuthenticated.next(false);
    }
}