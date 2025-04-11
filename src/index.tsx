import React from 'react';
import ReactDOM from 'react-dom/client';
import { registerServiceWorker  } from './serviceWorkerRegistration';
import App from './App';
import './index.css'; // Сохраняем ваш импорт стилей

// Регистрация Service Worker только в production-сборке
if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then(registration => {
        console.log('SW registered:', registration);
        registration.update(); // Принудительное обновление
      })
      .catch(error => {
        console.log('SW registration failed:', error);
      });
  });
}

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

if (process.env.NODE_ENV === 'production') {
  registerServiceWorker();
} else {
  // В development-режиме отменяем регистрацию
  import('./serviceWorkerRegistration').then(({ unregisterServiceWorker }) => {
    unregisterServiceWorker();
  });
}


if (process.env.NODE_ENV === 'production') {
  const checkServiceWorker = async () => {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('/service-worker.js');
        console.log('SW registered:', registration);

        registration.addEventListener('updatefound', () => {
          console.log('New SW installing...');
        });

        if (navigator.serviceWorker.controller) {
          console.log('SW controlling the page');
        }
      } catch (error) {
        console.error('SW registration failed:', error);
      }
    }
  };

  window.addEventListener('load', checkServiceWorker);
}