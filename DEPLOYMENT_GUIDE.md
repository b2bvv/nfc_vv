# Инструкция по размещению сайта на Yandex Object Storage

## Шаг 1: Создание бакета в Yandex Object Storage

1. Войдите в [Yandex Cloud Console](https://console.cloud.yandex.ru/)
2. Выберите или создайте каталог
3. Перейдите в раздел **Object Storage**
4. Нажмите **Создать бакет**
5. Заполните параметры:
   - **Имя бакета**: например, `nfc-vv-products` (должно быть уникальным)
   - **Тип доступа**: выберите **Публичный** (Public)
   - **Регион**: выберите ближайший регион
6. Нажмите **Создать бакет**

## Шаг 2: Настройка статического хостинга

1. В созданном бакете перейдите в раздел **Веб-сайт**
2. Включите опцию **Хостинг статического сайта**
3. Укажите:
   - **Главная страница**: `index.html`
   - **Страница ошибки**: `index.html` (опционально)
4. Сохраните настройки

## Шаг 3: Настройка CORS (если нужно)

1. В бакете перейдите в раздел **CORS**
2. Добавьте правило:
   - **Разрешенные источники**: `*` (или ваш домен)
   - **Разрешенные методы**: `GET, HEAD`
   - **Разрешенные заголовки**: `*`
   - **Максимальный возраст**: `3600`

## Шаг 4: Загрузка файлов

### Вариант А: Через веб-интерфейс

1. В бакете нажмите **Загрузить объекты**
2. Выберите все файлы из папки проекта:
   - `index.html`
   - `global.js`
   - `global.css`
   - `products.json`
   - Папку `images/` (со всеми файлами)
   - Папку `fonts/` (со всеми файлами)
   - Папку `video/` (со всеми файлами)
   - Папку `image_preview/` (со всеми файлами)
   - Папку `image_block/` (со всеми файлами)
3. Загрузите файлы

### Вариант Б: Через Yandex CLI (командная строка)

```bash
# Установите Yandex CLI (если еще не установлен)
# https://cloud.yandex.ru/docs/cli/quickstart

# Настройте профиль
yc config profile create my-profile
yc config set token <ваш-токен>
yc config set cloud-id <ваш-cloud-id>
yc config set folder-id <ваш-folder-id>

# Загрузите файлы
yc storage cp index.html s3://nfc-vv-products/index.html
yc storage cp global.js s3://nfc-vv-products/global.js
yc storage cp global.css s3://nfc-vv-products/global.css
yc storage cp products.json s3://nfc-vv-products/products.json
yc storage cp --recursive images/ s3://nfc-vv-products/images/
yc storage cp --recursive fonts/ s3://nfc-vv-products/fonts/
yc storage cp --recursive video/ s3://nfc-vv-products/video/
yc storage cp --recursive image_preview/ s3://nfc-vv-products/image_preview/
yc storage cp --recursive image_block/ s3://nfc-vv-products/image_block/
```

### Вариант В: Через S3-совместимые инструменты

Можно использовать любые S3-совместимые инструменты:
- **Cyberduck** (GUI)
- **S3 Browser** (GUI)
- **s3cmd** (CLI)
- **rclone** (CLI)

**Настройки подключения:**
- **Endpoint**: `https://storage.yandexcloud.net`
- **Access Key ID**: получите в разделе "Сервисные аккаунты"
- **Secret Access Key**: получите в разделе "Сервисные аккаунты"

## Шаг 5: Получение URL сайта

После загрузки файлов ваш сайт будет доступен по адресу:

```
https://<имя-бакета>.website.yandexcloud.net
```

Например:
```
https://nfc-vv-products.website.yandexcloud.net
```

## Шаг 6: Настройка уникальных ссылок для товаров

Ваш код уже поддерживает параметр `?product=` в URL. Уникальные ссылки будут выглядеть так:

### Список всех товаров и их ID:

1. **Чай Пуэр с элеутерококком**
   - ID: `pu-erh-tea`
   - URL: `https://<ваш-бакет>.website.yandexcloud.net/index.html?product=pu-erh-tea`

2. **Трубочки с белковым кремом**
   - ID: `protein-cream-tubes`
   - URL: `https://<ваш-бакет>.website.yandexcloud.net/index.html?product=protein-cream-tubes`

3. **Пирожное картошка**
   - ID: `potato-cake`
   - URL: `https://<ваш-бакет>.website.yandexcloud.net/index.html?product=potato-cake`

4. **Муравейные шарики**
   - ID: `ant-balls`
   - URL: `https://<ваш-бакет>.website.yandexcloud.net/index.html?product=ant-balls`

5. **Мандариновый сок**
   - ID: `tangerine-juice`
   - URL: `https://<ваш-бакет>.website.yandexcloud.net/index.html?product=tangerine-juice`

6. **Вафельные трубочки**
   - ID: `waffle-tubes`
   - URL: `https://<ваш-бакет>.website.yandexcloud.net/index.html?product=waffle-tubes`

## Шаг 7: Настройка собственного домена (опционально)

1. В бакете перейдите в раздел **Веб-сайт**
2. В разделе **Домены** добавьте ваш домен
3. Настройте DNS записи у вашего регистратора:
   - Тип: **CNAME**
   - Имя: `www` (или `@` для корневого домена)
   - Значение: `<имя-бакета>.website.yandexcloud.net`
4. Подождите распространения DNS (обычно 5-30 минут)

## Шаг 8: Проверка работы

1. Откройте основной URL: `https://<ваш-бакет>.website.yandexcloud.net`
2. Проверьте, что отображается первый товар (по умолчанию)
3. Попробуйте открыть ссылку с параметром: `https://<ваш-бакет>.website.yandexcloud.net/index.html?product=protein-cream-tubes`
4. Убедитесь, что данные товара загружаются корректно

## Важные замечания

1. **Права доступа**: Убедитесь, что все файлы имеют публичный доступ (ACL: public-read)

2. **MIME-типы**: Yandex Object Storage автоматически определяет MIME-типы, но если есть проблемы:
   - `.json` должен быть `application/json`
   - `.webp` должен быть `image/webp`
   - `.mp4` должен быть `video/mp4`

3. **Кэширование**: При обновлении файлов может потребоваться очистка кэша браузера или добавление версионирования к файлам

4. **HTTPS**: Yandex Object Storage автоматически предоставляет HTTPS для веб-сайтов

## Обновление файлов

При обновлении файлов просто загрузите новые версии с теми же именами. Изменения вступят в силу сразу (или после очистки кэша браузера).

## Структура файлов в бакете

```
nfc-vv-products/
├── index.html
├── global.js
├── global.css
├── products.json
├── images/
│   ├── Star.png
│   ├── 1_1257.svg
│   └── ... (все изображения)
├── fonts/
│   ├── villula-regular.ttf
│   └── ... (все шрифты)
├── video/
│   ├── protein-cream-tubes.mp4
│   ├── potato-cake.mp4
│   └── ... (все видео)
├── image_preview/
│   ├── protein-cream-tubes-img.webp
│   └── ... (все превью)
└── image_block/
    ├── composition-img.png
    ├── allergens-img.png
    └── whyOnShelf-img.png
```

## Поддержка

Если возникнут проблемы:
- Проверьте консоль браузера (F12) на наличие ошибок
- Убедитесь, что все файлы загружены и имеют правильные пути
- Проверьте настройки CORS и публичного доступа

