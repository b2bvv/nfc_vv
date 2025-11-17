# Как открыть страницу локально в браузере

Для работы страницы нужен локальный веб-сервер (из-за загрузки JSON файла через fetch).

## Способ 1: Использовать готовые скрипты (РЕКОМЕНДУЕТСЯ)

### Windows (двойной клик):
- Запустите файл `start-server.bat`
- Откройте браузер и перейдите на `http://localhost:8000`

### Windows PowerShell:
- Правой кнопкой на `start-server.ps1` → "Выполнить с помощью PowerShell"
- Или в терминале: `powershell -ExecutionPolicy Bypass -File start-server.ps1`

## Способ 2: Python (если установлен)

### Python 3:
```bash
python -m http.server 8000
```

### Python 2:
```bash
python -m SimpleHTTPServer 8000
```

Затем откройте: `http://localhost:8000`

## Способ 3: Node.js (если установлен)

### Установить http-server глобально:
```bash
npm install -g http-server
```

### Запустить:
```bash
http-server -p 8000
```

Затем откройте: `http://localhost:8000`

## Способ 4: Live Server в VS Code (РЕКОМЕНДУЕТСЯ для разработки)

1. Установите расширение "Live Server" в VS Code
2. Правой кнопкой на `index.html` → "Open with Live Server"
3. Страница автоматически откроется в браузере

## Способ 5: Другие инструменты

- **PHP**: `php -S localhost:8000`
- **Ruby**: `ruby -run -e httpd . -p 8000`
- **npx** (без установки): `npx http-server -p 8000`

## Просмотр разных товаров

После запуска сервера используйте URL параметры:
- `http://localhost:8000/index.html?product=pu-erh-tea` - Чай Пуэр
- `http://localhost:8000/index.html?product=protein-cream-tubes` - Трубочки с белковым кремом
- `http://localhost:8000/index.html?product=potato-cake` - Пирожное картошка
- `http://localhost:8000/index.html?product=ant-balls` - Муравейные шарики
- `http://localhost:8000/index.html?product=tangerine-juice` - Мандариновый сок
- `http://localhost:8000/index.html?product=waffle-tubes` - Вафельные трубочки

## Остановка сервера

Нажмите `Ctrl+C` в терминале, где запущен сервер.

