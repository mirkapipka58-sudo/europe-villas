# Europe Villas & Apartments — сайт

Сайт работает без установки: откройте `index.html` двойным кликом.

## Структура
```
index.html          — главная (полу-лендинг)
villas.html         — каталог с фильтрами
villa.html?id=101   — страница объекта
destinations.html   — 20 стран и регионы
about.html          — о компании
contact.html        — контакты (WhatsApp)
assets/css/style.css — дизайн, цвета, анимации
assets/js/i18n.js    — ВСЕ тексты на EN / ES / RU
assets/js/data.js    — страны, объекты, отзывы, настройки
assets/js/main.js    — языки, шапка, WhatsApp, анимации
assets/js/pages.js   — логика страниц
assets/img/logo.jpg  — логотип
assets/video/        — сюда видео
```

## 🎬 Видео на первом экране
Положите файл **`assets/video/hero.mp4`**, и он появится автоматически.
Пока видео нет, показывается слайд-шоу из фото.
Советы: длительность 15–30 с, без звука, 1920×1080, размер до 10–15 МБ.

## 🖼 Свои фото
1. Положите фото в `assets/img/villas/` (например, `marbella-1.jpg`).
2. В `assets/js/data.js` укажите путь: `"assets/img/villas/marbella-1.jpg"`.

## 🏡 Реальные объекты
Ваши 7 вилл в Марбелье (Eterna, Mila, Celeste, Enzo, Salvia, Velara, Manati) уже добавлены
в `data.js` в блок `REAL`. Новую виллу проще всего добавить строкой:
```js
R(8, "Villa Nova", 12, 1500, "nova"),   // id, название, гостей, цена/ночь, файл assets/img/villas/nova.jpg
```
Ещё 120 объектов в других странах **сгенерированы как демо**: названия, цены и фото условные.
Чтобы убрать демо, замените в `data.js` строку `window.VILLAS = REAL.concat(list);` на `window.VILLAS = REAL;`.
Полный формат объекта (если нужны все поля):

```js
window.VILLAS = [
  {
    id: 101,
    name: "Villa Azure",
    country: "spain",          // id страны из COUNTRIES
    region: "Marbella",
    kind: "sea",               // sea | alpine | lake | country | city | north
    type: "villa",             // villa | apartment | penthouse | chalet
    beds: 5, baths: 5, guests: 10, area: 450,
    price: 1200,               // € за ночь
    rating: 4.9, reviews: 32,
    features: ["pool", "seaView", "wifi", "ac", "parking", "chef"],
    images: ["assets/img/villas/azure-1.jpg", "assets/img/villas/azure-2.jpg", "..."],
    popular: 1
  },
  // ...
];
```
Доступные удобства: pool, seaView, beachfront, view, chef, gym, cinema, spa, sauna,
fireplace, ski, wifi, ac, parking, garden, bbq.

## ⚙️ Быстрые настройки
- **Количество сделок**: `data.js` → `CONFIG.deals`.
- **Отзывы**: `data.js` → `TESTIMONIALS`. Сейчас там примеры, замените на настоящие отзывы клиентов.
- **Тексты**: `i18n.js`. У каждого текста есть ключ, меняйте значение во всех трёх языках.
- **Номер WhatsApp**: `main.js` → `_p`. Номер хранится в перевёрнутом и разбитом виде,
  чтобы его не было видно в коде страницы. Для `+380966973130` это `["0313","7966","9083"]`
  (цифры номера задом наперёд, разбитые на части).

## 🌍 Языки (5)
English · Español · Português · Українська · Русский.
Язык определяется по браузеру посетителя (если язык браузера не из списка, показывается английский).
Выбор посетителя запоминается.
Тексты EN / ES / RU лежат в `assets/js/i18n.js`, PT / UA — в `assets/js/i18n-pt-uk.js`.

## 🚀 Публикация
Подходит любой статический хостинг: Netlify (перетащить папку на app.netlify.com/drop),
Vercel, GitHub Pages или обычный хостинг через FTP.
