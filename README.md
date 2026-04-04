# Webpack 5 + Pug Boilerplate

Базовый шаблон для многостраничной фронтенд-разработки на Webpack 5. Проект
собран под Pug, SCSS и модульный JavaScript, со встроенным SVG-спрайтом,
локальным mock API и набором готовых UI-компонентов.

## Стек

- Webpack 5
- Pug
- SCSS
- JavaScript / SWC
- webpack-dev-server
- json-server для mock API
- ESLint
- Stylelint
- Prettier

## Быстрый старт

```bash
npm install
npm run dev
```

После запуска доступны:

- приложение: `http://localhost:3000`
- mock API: `http://localhost:3000/api/`

## Скрипты

```bash
npm run dev
```

```bash
npm run build
```

```bash
npm run build:prod
```

## Структура проекта

```text
.
├── config/                 # конфигурация webpack и плагины сборки
├── mock/                   # локальный mock API
│   ├── db.json             # данные для json-server
│   └── server.js           # init json-server
├── src/
│   ├── fonts/              # шрифты
│   ├── img/                # изображения
│   ├── js/
│   │   ├── components/     # готовые UI-компоненты
│   │   ├── helpers/        # вспомогательные функции
│   │   ├── layout/         # общие entry-скрипты для layout
│   │   ├── modules/        # общие JS-модули проекта
│   │   ├── utils/          # утилиты
│   │   └── views/          # JS для отдельных страниц
│   ├── partials/
│   │   ├── index.pug       # общая точка подключения mixin'ов и partials
│   │   ├── layouts/        # части layout: head, header, footer, modals
│   │   ├── modals/         # шаблоны модальных окон
│   │   ├── template/       # базовые шаблоны страниц
│   │   └── ui/             # UI-mixin'ы и мелкие partials
│   ├── scss/               # стили проекта
│   ├── svg/                # исходники для SVG-спрайта
│   └── views/              # страницы проекта
├── webpack.config.ts
└── package.json
```

## Папки и их назначение

### `src/views`

Страницы проекта. Каждый `.pug` файл в этой папке собирается в отдельный
HTML-файл в `dist`.

Сейчас в проекте есть:

- `index.pug`
- `demo.pug`
- `UI.pug`
- `sitemap.pug`

### `src/partials/template`

Базовые шаблоны страниц.

Сейчас используется:

- `default.pug` — основной каркас страницы. Подключает общие partials и задаёт
  блоки `head`, `header`, `content`, `footer`.

Пример страницы:

```pug
extends ../partials/template/default

block content
  .section Контент страницы
```

### `src/partials/layouts`

Общие части layout, которые используются в шаблоне страницы:

- `head.pug`
- `header.pug`
- `footer.pug`
- `modals.pug`

### `src/partials/modals`

Отдельные шаблоны модальных окон.

### `src/partials/ui`

Переиспользуемые UI-mixin'ы и небольшие partials.

Сейчас в папке есть:

- `svg.pug` — mixin для SVG-иконок из спрайта

### `src/partials/index.pug`

Центральная точка подключения partials и mixin'ов. Всё, что должно быть доступно
в шаблонах страниц, подключается здесь.

### `src/js/components`

Готовые JS-компоненты, которые можно подключать в общий бандл или грузить
асинхронно.

Сейчас в проекте есть:

- `Accordion`
- `ClassToggler`
- `Dropdown`
- `Mask`
- `Modal`
- `PasswordToggler`
- `Scrollbar`
- `Select`
- `TabsController`
- `ThemeController`

### `src/js/modules`

Общие модули проекта.

Сейчас в папке есть:

- `_svg.js`
- `closing-element.js`
- `onLoad.js`
- `tippy.js`

### `src/scss`

Точка входа для стилей и SCSS-структура проекта.

Основные файлы:

- `styles.scss` — основной файл стилей
- `dev.scss` — стили для dev-режима
- `inline.scss` — файл под инлайновые стили

## Что входит в сборку

Сборка формирует:

- HTML-страницы из `src/views/*.pug`
- JS-бандлы в `dist/js`
- чанки в `dist/js/chunks`
- CSS-файлы в `dist/css` при обычной сборке
- изображения в `dist/images`
- шрифты в `dist/fonts`
- SVG-спрайт в `dist/svg/sprite.svg`
- ZIP-архив при `npm run build:prod`

Основной общий бандл собирается из `src/js/views/bundle.js`. В него уже
подключены:

- `Scrollbar`
- `Modal`
- `Dropdown`
- `Select`
- `Mask`
- `PasswordToggler`
- `Accordion`
- `TabsController`
- модуль `tippy`

## Mock API

В проекте есть локальный mock API на `json-server`.

- данные лежат в `mock/db.json`
- сервер поднимается из `mock/server.js`
- запросы `/api/*` проксируются на `http://localhost:3001`

Текущий пример данных:

```json
{
	"data": {
		"name": "Webpack 5 Sample",
		"desc": "Template for developers",
		"author": "HillTrigger"
	}
}
```

Пример запроса из страницы:

```js
fetch('http://localhost:3000/api/data');
```

## SVG

Все SVG из `src/svg` собираются в один спрайт:

```text
dist/svg/sprite.svg
```

Для использования иконок подключён mixin `svg` из `src/partials/ui/svg.pug`.

Пример использования:

```pug
+svg('icon-name')
```

Если в шаблоне нужен абсолютный путь к спрайту или к статическим файлам,
используется `publicPath`.

## Алиасы

В проекте настроены алиасы:

- `@` → `src`
- `@img` → `src/img`
- `@svg` → `src/svg`
- `@scss` → `src/scss`
- `@modules` → `src/js/modules`
- `@components` → `src/js/components`
- `@helpers` → `src/js/helpers`
- `@utils` → `src/js/utils`

Пример:

```js
import '@components/Modal';
import '@scss/styles.scss';
```

## Как добавлять страницы

1. Создать новый `.pug` файл в `src/views`.
2. Наследоваться от `src/partials/template/default.pug`.
3. Описать содержимое через `block content`.

Новая страница автоматически попадёт в сборку как отдельный HTML-файл.

## Как добавлять partials и UI-mixin'ы

Если partial или mixin должен быть доступен в шаблонах страниц, его нужно
подключить в `src/partials/index.pug`.

## Нюансы

- В `dev`-режиме используется `styles=js`, поэтому стили подключаются через
  JavaScript, без отдельного CSS-файла.
- В обычной сборке и в production стили выносятся в отдельные файлы через
  `MiniCssExtractPlugin`.
- `publicPath` передаётся в Pug как глобальная переменная шаблона и используется
  для абсолютных путей.
- Для картинок в Pug, которые должны пройти через webpack-обработку,
  используется `require`.
- `sitemap.pug` получает список всех `.pug`-страниц автоматически во время
  сборки.
- Для анализа бандла можно передать `--env analyzer=true`.

## Примеры

### Подключение изображения в Pug

```pug
img(src=require('@img/example.jpg'), alt='')
```

### Абсолютный путь с `publicPath`

```pug
img(src=`${publicPath}/img/example.jpg`, alt='')
```

### Сборка с `publicPath`

```bash
npm run build -- --env publicPath=/project-name
npm run build:prod -- --env publicPath=/project-name
```
