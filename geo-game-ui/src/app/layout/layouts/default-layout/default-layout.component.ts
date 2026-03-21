import { Component } from '@angular/core';
import { LoaderService } from '@shared/services';

@Component({
    selector: 'app-default-layout',
    templateUrl: './default-layout.component.html',
    styleUrl: './default-layout.component.scss',
    standalone: false
})
export class DefaultLayoutComponent {
    constructor(public loaderService: LoaderService) {}
}
