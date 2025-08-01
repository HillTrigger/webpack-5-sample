# Boilerplate (Webpack 5 + Pug)

**[UI Demo](http://f0436264.xsph.ru/boilerplate/UI.html)**

## Development mode

```bash
npm run dev
```

## Build mode

```bash
npm run build:dev -- для разработки
npm run build:prod -- для продакшена
```

## Production mode for backend

Если используются чанки в `js`, нужно указать путь, откуда они будут
загружаться.

Путь задаётся в `config/paths.js`:

```js
// For Backend
publicProduction: '/local/templates/example/assets/',
```

Запуск сборки:

```bash
yarn build:prod
```

Пример асинхронной загрузки чанков:

```js
(async () => {
  await import(/* webpackChunkName: "Scrollbar" */ '@components/Scrollbar');
  await import(/* webpackChunkName: "Modal" */ '@components/Modal');
  await import(/* webpackChunkName: "Dropdown" */ '@components/Dropdown');
  await import(/* webpackChunkName: "Select" */ '@components/Select');
})();
```

Сборка сохраняется в `/dist`, также создаётся архив с именем проекта.

---

## Основная структура страницы

```pug
extends ../partials/template/default

block content
  div тут контент
```

Шаблоны находятся в `src/partials/template/`.

---

## Компоненты

Все компоненты находятся в `src/partials`.

Если компонент расположен по пути `src/partials/examples/example.pug`, его
нужно:

1. Добавить в `src/partials/index.pug`
2. Убедиться, что `index.pug` подключён в шаблон страницы

---

## SVG

```pug
// mixin в index.pug
mixin svg(name, className = '')
  svg(class=className)
    use(xlink:href=`${publicPath}/svg/sprite.svg#${name}`)

// использование
+svg('365mg')
```

---

## Примечания

- Для указания `publicPath` используйте `--env`:

```bash
npm run build:dev -- publicPath="/365mg"
```

- Для запуска анализатора бандла:

```bash
npm run build:dev -- analyzer=true
```

- В Pug для загрузки изображений используйте `require`:

```pug
img(src=require('@img/1c-bitrix-24.png'), alt="")
```

- В шаблонах Pug доступны **глобальные переменные**, которые можно изменить в
  `buildPlugins.ts`

- Для абсолютных путей без `require` (например, в `svg`, `img`, `a href`) нужно
  **вручную добавлять** `publicPath`:

```pug
img(src=`${publicPath}/img/example.jpg`, alt="")
```
