import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { EventCatalog } from './pages/event-catalog/event-catalog';
import { EmotionalRecord } from './pages/emotional-record/emotional-record';
import { EventManagement } from './pages/event-management/event-management';
import { CollaboratorDashboard } from './pages/collaborator-dashboard/collaborator-dashboard';
import { SentimentAnalytics } from './pages/sentiment-analytics/sentiment-analytics';
import { StrategicDashboard } from './pages/strategic-dashboard/strategic-dashboard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'event-catalog', component: EventCatalog },
  { path: 'emotional-record', component: EmotionalRecord },
  { path: 'event-management', component: EventManagement },
  { path: 'collaborator-dashboard', component: CollaboratorDashboard },
  { path: 'sentiment-analytics', component: SentimentAnalytics },
  { path: 'strategic-dashboard', component: StrategicDashboard },
];
