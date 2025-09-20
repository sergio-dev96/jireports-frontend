import { provideHttpClient, withFetch, withInterceptors, withXsrfConfiguration } from '@angular/common/http';
import { authInterceptor } from './app/core/auth.interceptor';
import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter, withEnabledBlockingInitialNavigation, withInMemoryScrolling } from '@angular/router';
import Aura from '@primeng/themes/aura';
import { providePrimeNG } from 'primeng/config';
import { appRoutes } from './app.routes';
import { GANTT_GLOBAL_CONFIG } from './app/ngx-gantt/gantt.config';
import { GANTT_I18N_LOCALE_TOKEN, GanttI18nLocale } from './app/ngx-gantt/i18n';
import { NgxGanttModule } from './app/ngx-gantt/gantt.module';
import { es } from 'date-fns/locale';

export const appConfig: ApplicationConfig = {

    providers: [
        provideRouter(appRoutes, withInMemoryScrolling({ anchorScrolling: 'enabled', scrollPositionRestoration: 'enabled' }), withEnabledBlockingInitialNavigation()),
        provideHttpClient(withFetch()),
        provideAnimationsAsync(),
        providePrimeNG({ theme: { preset: Aura, options: { darkModeSelector: '.app-dark' } } }),
        provideHttpClient(
            withInterceptors([authInterceptor]),
            withXsrfConfiguration({
                cookieName: 'csrf_token', // Nombre de la cookie CSRF
                headerName: 'x-csrf-token' // Nombre del header CSRF
            })
        ),
        importProvidersFrom(NgxGanttModule),
        {
            provide: GANTT_GLOBAL_CONFIG,
            useValue: {
                locale: GanttI18nLocale.esEs,
                dateOptions: {
                    timeZone: 'America/Lima',
                    weekStartsOn: 1
                },
                styleOptions: {
                    lineHeight: 25, // custom line height
                    barHeight: 15 // custom Bar height
                }
            }
        }
    ],

};
