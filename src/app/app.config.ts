import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import {provideRouter, withViewTransitions} from '@angular/router';

import { routes } from './app.routes';
import {provideAnimations} from "@angular/platform-browser/animations";
import { initializeApp } from "firebase/app";
import {environment} from "./enviroments/enviroments";
const firebaseApp = initializeApp(environment.firebaseConfig);
import {getDatabase} from "firebase/database";
import { getAuth } from 'firebase/auth';
import {getStorage} from "firebase/storage";

// Ottenere le istanze per Auth, Database, e Storage
const database = getDatabase(firebaseApp);
const auth = getAuth(firebaseApp);
const storage = getStorage(firebaseApp);
export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withViewTransitions()),
    provideAnimations(),]
};
