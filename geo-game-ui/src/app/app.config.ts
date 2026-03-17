import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from "@angular/core";
import { provideRouter, withHashLocation } from "@angular/router";
import { MAP_FEATURE_STORE_KEY, MapFacade, mapReducer } from "@shared/store/map";
import { routes } from "./app.routes";
import { provideHttpClient, withInterceptors } from "@angular/common/http";
import { provideState, provideStore, StoreModule } from "@ngrx/store";
import { MapService, UserService } from "@shared/services";
import { GoogleLoginProvider, SocialAuthServiceConfig } from "@abacritt/angularx-social-login";
import { jwtInterceptor } from "@shared/interceptors";
import { USER_FEATURE_STORE_KEY, UserFacade, userReducer } from "@shared/store/user";
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { provideCharts, withDefaultRegisterables } from "ng2-charts";
import { environment } from "@environments/environment";

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withHashLocation()),
    provideHttpClient(
      withInterceptors([jwtInterceptor])
    ),
    provideCharts(withDefaultRegisterables()),
    provideStore(),
    provideState({ name: MAP_FEATURE_STORE_KEY, reducer: mapReducer }),
    provideState({name: USER_FEATURE_STORE_KEY, reducer: userReducer}),
    importProvidersFrom([
      StoreModule.forRoot(),
      NoopAnimationsModule,
    ]),
    MapService,
    MapFacade,
    UserService,
    UserFacade,
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        lang: 'en',
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              environment.googleClientId,
              {oneTapEnabled: false}
            )
          }
        ],
        onError: (err) => {}
      } as SocialAuthServiceConfig,
    }
  ],
};
