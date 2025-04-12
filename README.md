```markdown
# 🎬 Movie Finder (Firebase Edition)

[![React](https://img.shields.io/badge/React-18.2-blue)](https://reactjs.org/)
[![Firebase](https://img.shields.io/badge/Firebase-9.22-orange)](https://firebase.google.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-4.9-blue)](https://www.typescriptlang.org/)

Приложение для поиска фильмов с аутентификацией и синхронизацией избранного через Firebase.

## 🔐 Тестовый доступ
```
Логин: admin@admin.ru
Пароль: 123456
```

## 🚀 Основные функции
- 🔍 Поиск фильмов через OMDb API
- ❤️ Сохранение в избранное (Firestore)
- 👤 Авторизация (Email/Google)
- 📱 Адаптивный интерфейс
- 🛡 TypeScript + Firebase Security Rules

## 🛠 Технологии
| Технология       | Назначение                      |
|------------------|---------------------------------|
| Firebase Auth    | Аутентификация пользователей    |
| Firestore        | Хранение избранных фильмов      |
| React Query      | Кеширование API-запросов        |
| React Hook Form  | Валидация форм                  |
| Framer Motion    | Анимации интерфейса             |

## 🚧 Roadmap 2024

### Q2 2024
- [x] Базовая авторизация
- [x] Система рейтингов фильмов ★★★★★
- [x] Оффлайн-режим (PWA)
- [x] Экспорт избранного в CSV

### Q3 2024
- [x] Микросервис рекомендаций (React)
- [ ] Виджет для сайтов (Web Component)

### Q4 2024
- [ ] Мобильное приложение (React Native)
- [ ] Парсинг кинопоиска
- [ ] AI-рекомендации (TensorFlow.js)

## 🛠 Установка
```bash
git clone https://github.com/s1ick/theMovieDatabase.git
cd movie-finder
npm install
echo "REACT_APP_FIREBASE_CONFIG='your-config'" > .env
npm start
```
## 🤝 Как помочь проекту
1. Сообщайте о багах в Issues
2. Предлагайте улучшения через Pull Requests
