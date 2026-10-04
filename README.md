# ЭКИПАЖ · экипаж-ии.рф

| файл | что это |
|---|---|
| `index.html`, `style.css`, `script.js` | лендинг |
| `demo.html`, `demo.css`, `demo.js`, `demo-data.js` | демо продукта |
| `img/` | фото команды |
| `og.png` | превью ссылки в мессенджерах |
| `CNAME` | домен для GitHub Pages: экипаж-ии.рф в латинской записи |

Тексты лендинга правятся прямо в `index.html`. Данные демо (команда, кейс, стенограмма, разбор) лежат в `demo-data.js`.

После правки `style.css` или `script.js` увеличьте метку `?v=1` в `index.html` (`demo.css`, `demo.js`, `demo-data.js` — в `demo.html`), чтобы браузеры и Cloudflare взяли новые файлы.
