import { CanActivateFn } from '@angular/router';
import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';

export const cajeroGuard: CanActivateFn = (route, state) => {
  const platformId = inject(PLATFORM_ID);
  const router = inject(Router);

  // Ensure this runs only on the browser
  if (!isPlatformBrowser(platformId)) {
    return false; // Block navigation on the server to avoid crashes
  }

  // Now that we're on the browser, safely access localStorage
  const empleado = JSON.parse(localStorage.getItem('empleado') || '{}');

  if(!empleado){
    router.navigate(['/login']);
    return false;
  }
  
  if (empleado && (empleado.tipo === 'Cajero'  || empleado.tipo === 'Admin')) {
    return true; // Allow access
  }

  // Redirect if the user is not authorized
  router.navigate(['/cajas']);
  return false;
};
