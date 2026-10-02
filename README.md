# ЭКИПАЖ · сайт

Статический сайт из двух страниц для GitHub Pages:

| файл | что это |
|---|---|
| `index.html` | лендинг — главная страница |
| `demo.html` | демо продукта: кнопка «Открыть демо продукта» на лендинге ведёт сюда |
| `favicon.svg` | значок вкладки |
| `og-image.png` | картинка-превью, когда ссылку присылают в мессенджер |
| `404.html` | при неверном адресе возвращает на главную |
| `.nojekyll` | говорит GitHub Pages отдавать файлы как есть |

Сборщик и сервер не нужны: всё, включая фото, уже лежит внутри HTML-файлов. Шрифты подгружаются из Google Fonts.

## Публикация через сайт GitHub (без программ)

1. Зарегистрируйтесь на github.com или войдите.
2. Нажмите **New repository** (зелёная кнопка или «+» в правом верхнем углу).
   - Repository name: например `ekipazh`.
   - Видимость: **Public**. На бесплатном тарифе GitHub Pages работает только для публичных репозиториев.
   - Нажмите **Create repository**.
3. На странице пустого репозитория нажмите ссылку **uploading an existing file**.
4. Распакуйте архив и перетащите в окно **все файлы из папки** (не саму папку): `index.html`, `demo.html`, `favicon.svg`, `og-image.png`, `404.html`, `README.md`, `.nojekyll`.
   - Файл `.nojekyll` скрыт в Проводнике и Finder. На Windows включите «Вид → Скрытые элементы», на Mac нажмите Cmd + Shift + точка. Без него сайт тоже заработает.
5. Внизу нажмите **Commit changes**.
6. Откройте **Settings → Pages** (раздел Pages в левом меню).
   - Source: **Deploy from a branch**.
   - Branch: **main**, папка **/ (root)** → **Save**.
7. Подождите 1–2 минуты и обновите страницу. Сверху появится адрес вида
   `https://ВАШ-ЛОГИН.github.io/ekipazh/` — это и есть сайт.

## Как обновлять

Откройте репозиторий → **Add file → Upload files** → перетащите новые версии файлов с теми же именами → **Commit changes**. Через минуту сайт обновится. Если видите старую версию, обновите страницу с очисткой кэша: Ctrl + F5 на Windows или Cmd + Shift + R на Mac.

## Картинка-превью для мессенджеров

Telegram, WhatsApp и Slack лучше показывают превью, если в адресе картинки указан полный путь. После публикации откройте `index.html` на GitHub (значок карандаша) и замените строку

```
<meta property="og:image" content="og-image.png">
```

на

```
<meta property="og:image" content="https://ВАШ-ЛОГИН.github.io/ekipazh/og-image.png">
```

## Поисковики

Сейчас в обеих страницах стоит `<meta name="robots" content="noindex, nofollow">`: сайт открывается по ссылке, но не попадает в Яндекс и Google. Когда понадобится открытый сайт, удалите эту строку в `index.html` и `demo.html`.

## Свой домен (по желанию)

Settings → Pages → **Custom domain**: впишите домен, например `ekipazh.ru`. Затем у регистратора домена добавьте DNS-записи по инструкции GitHub: docs.github.com → «Managing a custom domain for your GitHub Pages site».

## Через git (если удобнее)

```
git clone https://github.com/ВАШ-ЛОГИН/ekipazh.git
cd ekipazh
# скопируйте сюда файлы сайта
git add .
git commit -m "Сайт ЭКИПАЖ"
git push
```
