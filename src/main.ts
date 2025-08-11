// main.ts (Admin App)
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

const params = new URLSearchParams(window.location.search);

const token = params.get('token');
const role = params.get('role');
const name = params.get('name');
const email = params.get('email');
const userId = params.get('userId');
const profileImage = params.get('profileImage');

if (token) {
  const user = { userId, name, email, role, profileImage }; // 👈 now it exists

  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user)); // stored for UserService
  localStorage.setItem('loggedInUser', JSON.stringify(user)); // optional duplicate

  if (role) localStorage.setItem('role', role);
  if (name) localStorage.setItem('name', name);
  if (email) localStorage.setItem('email', email);
  if (userId) localStorage.setItem('userId', userId);
  if (profileImage) localStorage.setItem('profileImage', profileImage);

  // Clean the URL so query params disappear
  const cleanUrl = window.location.origin + window.location.pathname;
  window.history.replaceState({}, document.title, cleanUrl);
}


bootstrapApplication(AppComponent, appConfig)
  .catch(err => console.error(err));
