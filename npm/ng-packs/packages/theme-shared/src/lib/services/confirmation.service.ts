import { Injectable } from '@angular/core';
import { Confirmation } from '../models/confirmation';
import { fromEvent, Observable, Subject, ReplaySubject } from 'rxjs';
import { takeUntil, debounceTime, filter } from 'rxjs/operators';
import { Toaster } from '../models/toaster';
import { Config } from '@abp/ng.core';

@Injectable({ providedIn: 'root' })
export class ConfirmationService {
  status$: Subject<Confirmation.Status> | Subject<Toaster.Status>;
  confirmation$ = new ReplaySubject<Confirmation.DialogData>(1);

  info(
    message: Config.LocalizationParam,
    title: Config.LocalizationParam,
    options?: Partial<Confirmation.Options>,
  ): Observable<Confirmation.Status> | Observable<Toaster.Status> {
    return this.show(message, title, 'info', options);
  }

  success(
    message: Config.LocalizationParam,
    title: Config.LocalizationParam,
    options?: Partial<Confirmation.Options>,
  ): Observable<Confirmation.Status> | Observable<Toaster.Status> {
    return this.show(message, title, 'success', options);
  }

  warn(
    message: Config.LocalizationParam,
    title: Config.LocalizationParam,
    options?: Partial<Confirmation.Options>,
  ): Observable<Confirmation.Status> | Observable<Toaster.Status> {
    return this.show(message, title, 'warning', options);
  }

  error(
    message: Config.LocalizationParam,
    title: Config.LocalizationParam,
    options?: Partial<Confirmation.Options>,
  ): Observable<Confirmation.Status> | Observable<Toaster.Status> {
    return this.show(message, title, 'error', options);
  }

  show(
    message: Config.LocalizationParam,
    title: Config.LocalizationParam,
    severity?: Toaster.Severity,
    options?: Partial<Confirmation.Options>,
  ): Observable<Confirmation.Status> | Observable<Toaster.Status> {
    this.listenToEscape();
    this.confirmation$.next({
      message,
      title: title || 'AbpUi:AreYouSure',
      severity: severity || 'neutral',
      options,
    });
    this.status$ = new Subject();
    return this.status$;
  }

  clear(status?: Toaster.Status | Confirmation.Status) {
    this.status$.next(status || Confirmation.Status.dismiss);
  }

  listenToEscape() {
    fromEvent(document, 'keyup')
      .pipe(
        takeUntil(this.status$),
        debounceTime(150),
        filter((key: KeyboardEvent) => key && key.key === 'Escape'),
      )
      .subscribe(_ => {
        this.clear();
      });
  }
}
