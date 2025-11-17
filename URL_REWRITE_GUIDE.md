# Настройка красивых URL для товаров

## ✅ Обновление: JavaScript теперь поддерживает оба варианта!

Код уже обновлен и поддерживает:
- **Красивые URL**: `https://site.ru/pu-erh-tea`
- **URL с параметром**: `https://site.ru/index.html?product=pu-erh-tea`

JavaScript автоматически определяет товар из пути URL или параметра.

---

## Вариант 1: Использование Cloud CDN с правилами переписывания (РЕКОМЕНДУЕТСЯ)

Этот вариант позволяет использовать красивые URL вида:
- `https://ваш-домен.ru/pu-erh-tea`
- `https://ваш-домен.ru/protein-cream-tubes`
- `https://ваш-домен.ru/potato-cake`

### Шаг 1: Настройка Cloud CDN

1. В [Yandex Cloud Console](https://console.cloud.yandex.ru/) перейдите в **Cloud CDN**
2. Создайте **Распределение CDN**
3. Укажите источник: ваш бакет Object Storage
4. Настройте домен (ваш собственный домен)

### Шаг 2: Настройка правил переписывания

В настройках CDN добавьте правила переписывания URL:

**Правило 1:**
- **Условие**: Путь начинается с `/pu-erh-tea`
- **Действие**: Переписать на `/index.html?product=pu-erh-tea`

**Правило 2:**
- **Условие**: Путь начинается с `/protein-cream-tubes`
- **Действие**: Переписать на `/index.html?product=protein-cream-tubes`

И так далее для каждого товара.

**Или одно универсальное правило (РЕКОМЕНДУЕТСЯ):**
- **Условие**: Путь не содержит точку (не файл) и не является известным файлом
- **Действие**: Переписать на `/index.html` (JavaScript сам определит товар из пути)

**Пример настройки в Cloud CDN:**
```
Если путь: /pu-erh-tea, /protein-cream-tubes, и т.д.
То: Показать /index.html
```

JavaScript автоматически извлечет `pu-erh-tea` из пути `/pu-erh-tea` и загрузит нужный товар.

### Шаг 3: Настройка DNS

Настройте DNS записи:
- **Тип**: CNAME
- **Имя**: `www` или `@`
- **Значение**: CDN endpoint

---

## Вариант 2: Использование Cloud Functions (для продвинутых)

Создайте функцию, которая будет обрабатывать маршруты и возвращать нужный HTML.

### Шаг 1: Создание функции

1. Перейдите в **Cloud Functions**
2. Создайте новую функцию
3. Используйте следующий код:

```javascript
exports.handler = async (event) => {
    const path = event.path || event.requestContext.path;
    const productId = path.replace(/^\//, '').replace(/\/$/, '');
    
    // Список допустимых ID товаров
    const validProducts = [
        'pu-erh-tea',
        'protein-cream-tubes',
        'potato-cake',
        'ant-balls',
        'tangerine-juice',
        'waffle-tubes'
    ];
    
    // Если это корневой путь или невалидный товар, используем первый товар
    const product = validProducts.includes(productId) ? productId : validProducts[0];
    
    // Загрузите index.html из Object Storage
    // Добавьте параметр ?product= в HTML или верните редирект
    return {
        statusCode: 200,
        headers: {
            'Content-Type': 'text/html',
            'Location': `/index.html?product=${product}`
        },
        body: 'Redirecting...'
    };
};
```

---

## Вариант 3: Создание отдельных HTML файлов (ПРОСТОЙ, но неудобный)

Создайте отдельный HTML файл для каждого товара, который будет загружать нужный товар.

### Шаг 1: Создание файлов

Создайте файлы:
- `pu-erh-tea.html`
- `protein-cream-tubes.html`
- `potato-cake.html`
- `ant-balls.html`
- `tangerine-juice.html`
- `waffle-tubes.html`

### Шаг 2: Содержимое каждого файла

Каждый файл будет копией `index.html`, но с предустановленным параметром товара:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <!-- Все теги head из index.html -->
  <script>
    // Установить параметр товара перед загрузкой
    if (!window.location.search.includes('product=')) {
      window.location.href = window.location.pathname.replace('.html', '') + '?product=pu-erh-tea';
    }
  </script>
</head>
<body>
  <!-- Все содержимое из index.html -->
</body>
</html>
```

**Недостаток**: Придется поддерживать несколько копий HTML файла.

---

## Вариант 4: Использование .htaccess (если используете свой сервер)

Если вы используете свой веб-сервер вместо Object Storage, можно использовать `.htaccess`:

```apache
RewriteEngine On

# Редирект с красивого URL на параметр
RewriteRule ^pu-erh-tea/?$ /index.html?product=pu-erh-tea [L,QSA]
RewriteRule ^protein-cream-tubes/?$ /index.html?product=protein-cream-tubes [L,QSA]
RewriteRule ^potato-cake/?$ /index.html?product=potato-cake [L,QSA]
RewriteRule ^ant-balls/?$ /index.html?product=ant-balls [L,QSA]
RewriteRule ^tangerine-juice/?$ /index.html?product=tangerine-juice [L,QSA]
RewriteRule ^waffle-tubes/?$ /index.html?product=waffle-tubes [L,QSA]

# Или универсальное правило
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^([^/]+)/?$ /index.html?product=$1 [L,QSA]
```

---

## Вариант 5: Использование Nginx (если используете свой сервер)

Если используете Nginx:

```nginx
location / {
    try_files $uri $uri/ /index.html;
}

location ~ ^/(pu-erh-tea|protein-cream-tubes|potato-cake|ant-balls|tangerine-juice|waffle-tubes)/?$ {
    rewrite ^/([^/]+)/?$ /index.html?product=$1 last;
}
```

---

## Рекомендация

**Для Yandex Object Storage лучше всего использовать Вариант 1 (Cloud CDN)** с правилами переписывания URL. Это:
- ✅ Не требует изменения кода
- ✅ Работает со статическим хостингом
- ✅ Дает красивые URL
- ✅ Легко настраивается

**Альтернатива**: Если у вас есть свой веб-сервер, используйте Вариант 4 или 5.

---

## Примеры красивых URL

После настройки вы получите:

| Старый URL | Новый URL |
|------------|-----------|
| `https://site.ru/index.html?product=pu-erh-tea` | `https://site.ru/pu-erh-tea` |
| `https://site.ru/index.html?product=protein-cream-tubes` | `https://site.ru/protein-cream-tubes` |
| `https://site.ru/index.html?product=potato-cake` | `https://site.ru/potato-cake` |

---

## Важно

После настройки красивых URL убедитесь, что:
1. JavaScript код продолжает работать с параметром `?product=`
2. Все внутренние ссылки обновлены на новые URL
3. SEO-метатеги настроены для каждого товара (если нужно)

