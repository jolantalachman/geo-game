import { HttpEvent, HttpHandler, HttpHandlerFn, HttpInterceptor, HttpInterceptorFn, HttpRequest } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { LoaderService } from "@shared/services";
import { Observable, finalize } from "rxjs";

export const loaderInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> => {
    const loaderService = inject(LoaderService);
        loaderService.show();
        return next(req).pipe(
            finalize(() => loaderService.hide())
        );
}
