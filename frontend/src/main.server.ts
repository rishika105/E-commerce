import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app';
import { config } from './app/app.config.server';
import 'zone.js'; // Required for Angular

const bootstrap = () => bootstrapApplication(AppComponent, config);

export default bootstrap;
