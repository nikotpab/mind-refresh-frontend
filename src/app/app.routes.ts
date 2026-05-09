import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { EventCatalog } from './pages/event-catalog/event-catalog';
import { EmotionalRecord } from './pages/emotional-record/emotional-record';
import { EventManagement } from './pages/event-management/event-management';
import { CollaboratorDashboard } from './pages/collaborator-dashboard/collaborator-dashboard';
import { SentimentAnalytics } from './pages/sentiment-analytics/sentiment-analytics';
import { StrategicDashboard } from './pages/strategic-dashboard/strategic-dashboard';
import { DashboardLayout } from './layouts/dashboard-layout/dashboard-layout';
import { AuthGuard } from './core/auth/auth-guard';
import { RoleGuard } from './core/auth/role-guard';
import { Profile } from './pages/profile/profile';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'emotional-record', component: EmotionalRecord, canActivate: [AuthGuard] },
  {
    path: '',
    component: DashboardLayout,
    canActivate: [AuthGuard],
    children: [
      { path: 'collaborator-dashboard', component: CollaboratorDashboard },
      { path: 'event-catalog', component: EventCatalog },
      { path: 'event-management', component: EventManagement, canActivate: [RoleGuard], data: { role: 'admin' } },
      { path: 'sentiment-analytics', component: SentimentAnalytics, canActivate: [RoleGuard], data: { role: 'admin' } },
      { path: 'strategic-dashboard', component: StrategicDashboard, canActivate: [RoleGuard], data: { role: 'admin' } },
      { path: 'profile', component: Profile },
    ]
  },
];
