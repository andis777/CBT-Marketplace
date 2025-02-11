# КПТ.рф - Маркетплейс специалистов и учебных заведений

Платформа для поиска специалистов и учебных заведений в области когнитивно-поведенческой терапии.

## Основные возможности

### 🔍 Поиск специалистов
- Фильтрация по городу, специализации и рейтингу
- Подробные профили с описанием опыта и образования
- Верификация образования учебными заведениями
- Система отзывов и рейтингов

### 🏫 Каталог учебных заведений
- Информация о программах обучения
- Стоимость и длительность курсов
- Список преподавателей
- Верификация специалистов

### 📝 База знаний
- Статьи от специалистов
- Материалы по КПТ
- Полезные ресурсы

### 📅 Онлайн-запись
- Удобное расписание
- Выбор формата консультации
- Система напоминаний
- Управление записями

### 💎 Продвижение
- Топ специалист
- Премиум размещение
- Расширенный профиль
- Статистика просмотров

## Технологии

### Frontend
- React 18
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Axios
- Framer Motion

### Backend
- Node.js
- Express
- MySQL
- Knex.js
- JWT Auth
- Swagger API

## Установка

1. Клонируйте репозиторий:
```bash
git clone https://github.com/your-username/cbt-marketplace.git
cd cbt-marketplace
```

2. Установите зависимости:
```bash
npm install
```

3. Создайте файл `.env` в корне проекта:
```env
# API
PORT=8443
JWT_SECRET=your-secret-key

# Database
DB_HOST=localhost
DB_USER=your-db-user
DB_PASS=your-db-password
DB_NAME=kpt

# YooKassa
YOOKASSA_SHOP_ID=your-shop-id
YOOKASSA_SECRET_KEY=your-secret-key
```

4. Запустите миграции базы данных:
```bash
npm run migrate
```

5. Запустите проект:
```bash
# Frontend
npm run dev

# API
npm run api
```

## API Endpoints

### Аутентификация
- `POST /api/auth/login` - Вход
- `POST /api/auth/register` - Регистрация
- `GET /api/auth/me` - Текущий пользователь

### Специалисты
- `GET /api/psychologists` - Список специалистов
- `GET /api/psychologists/{id}` - Информация о специалисте
- `POST /api/psychologists/{id}` - Обновление профиля
- `POST /api/psychologists/{id}/verify` - Верификация образования

### Учебные заведения
- `GET /api/institutions` - Список учебных заведений
- `GET /api/institutions/{id}` - Информация об учебном заведении
- `POST /api/institutions/verify-psychologist` - Верификация специалиста

### Статьи
- `GET /api/articles` - Список статей
- `GET /api/articles/{id}` - Получение статьи
- `POST /api/articles` - Создание статьи

### Записи
- `GET /api/appointments` - Список записей
- `POST /api/appointments` - Создание записи
- `PUT /api/appointments/{id}/status` - Обновление статуса

### Платежи
- `POST /api/payment` - Создание платежа
- `GET /api/payment/history` - История платежей
- `POST /api/payment/webhook` - Webhook для уведомлений

### Верификация
- `GET /api/requests` - Список запросов на верификацию
- `PUT /api/requests/{id}/status` - Обновление статуса запроса

## API Запросы

### Формат запросов

Все запросы к API должны содержать следующие заголовки:

```http
Content-Type: application/json
Authorization: Bearer <token>
```

### Примеры запросов

#### Аутентификация

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "password123"
}
```

#### Верификация специалиста

```http
POST /api/institutions/verify-psychologist
Content-Type: application/json
Authorization: Bearer <token>

{
  "psychologist_id": "psych123",
  "institution_id": "inst456",
  "is_verified": true,
  "verification_notes": "Диплом проверен"
}
```

#### Обновление статуса запроса

```http
PUT /api/requests/{id}/status
Content-Type: application/json
Authorization: Bearer <token>

{
  "status": "approved",
  "notes": "Образование подтверждено"
}
```

### Ответы API

Все ответы API имеют следующую структуру:

```json
{
  "success": true,
  "data": {
    // Данные ответа
  },
  "error": null // или сообщение об ошибке
}
```

### Коды ответов

- 200: Успешный запрос
- 201: Ресурс успешно создан
- 400: Некорректный запрос
- 401: Не авторизован
- 403: Нет прав доступа
- 404: Ресурс не найден
- 500: Внутренняя ошибка сервера

### Обработка ошибок

В случае ошибки API возвращает объект с описанием:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Описание ошибки"
  }
}

## Структура проекта

```
cbt-marketplace/
├── src/                  # Frontend исходники
│   ├── components/       # React компоненты
│   ├── contexts/         # React контексты
│   ├── hooks/           # Кастомные хуки
│   ├── lib/             # Утилиты и API
│   ├── pages/           # Страницы приложения
│   └── types/           # TypeScript типы
├── api/                 # Backend исходники
│   ├── routes/          # API маршруты
│   ├── models/          # Модели данных
│   ├── db/              # Конфигурация БД
│   └── core/            # Основные модули
├── public/              # Статические файлы
└── supabase/            # Миграции базы данных
```

## Разработка

### Команды

```bash
# Запуск в режиме разработки
npm run dev

# Сборка проекта
npm run build

# Запуск API сервера
npm run api

# Запуск API с SSL
npm run api:ssl

# Линтинг
npm run lint
```

### Переменные окружения

Создайте файл `.env` в корне проекта:

```env
VITE_API_URL=http://localhost:8443
JWT_SECRET=your-secret-key
```

## Деплой

1. Сборка проекта:
```bash
npm run build
```

2. Настройка Apache:
```apache
<VirtualHost *:443>
    ServerName kpt.arisweb.ru
    DocumentRoot /var/www/html/dist

    SSLEngine on
    SSLCertificateFile /path/to/cert.crt
    SSLCertificateKeyFile /path/to/key.key

    <Directory /var/www/html/dist>
        Options -Indexes +FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>

    ProxyPass /api http://localhost:8443/api
    ProxyPassReverse /api http://localhost:8443/api
</VirtualHost>
```

3. Запуск API сервера:
```bash
NODE_ENV=production npm run api:ssl
```

## Лицензия

MIT License. См. файл [LICENSE](LICENSE) для деталей.

## Поддержка

При возникновении проблем создавайте issue в репозитории проекта.