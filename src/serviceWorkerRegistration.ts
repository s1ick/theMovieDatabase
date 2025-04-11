export const registerServiceWorker = () => {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      const swUrl = `${process.env.PUBLIC_URL}/service-worker.js`;

      navigator.serviceWorker.register(swUrl)
        .then(registration => {
          console.log('ServiceWorker успешно зарегистрирован:', registration);
          
          // Автоматическое обновление при изменении
          registration.onupdatefound = () => {
            const installingWorker = registration.installing;
            if (installingWorker) {
              installingWorker.onstatechange = () => {
                if (installingWorker.state === 'installed') {
                  if (navigator.serviceWorker.controller) {
                    console.log('Доступна новая версия приложения');
                    // Можно добавить уведомление для пользователя
                  } else {
                    console.log('Приложение готово к работе оффлайн');
                  }
                }
              };
            }
          };
        })
        .catch(error => {
          console.error('Ошибка регистрации ServiceWorker:', error);
        });
    });
  }
};

export const unregisterServiceWorker = () => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then(registration => {
      registration.unregister().then(() => {
        console.log('ServiceWorker отменён');
      });
    });
  }
};