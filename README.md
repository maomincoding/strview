# strview.js
![strview.js](https://www.maomin.club/data/strview/logo.png)

A JS library that can convert strings into view.

## How to use?

If you introduce it directly in the production environment.

```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>

<body>
    <div id="app"></div>
    <script src="./strview.global.min.js"></script>
    <script>
        Strview.createView({
            el: "#app",
            data: {
                msg: 'hello'
            },
            template: `<h1>{msg}</h1>`,
        });
        Strview.eventListener('h1', 'click', () => {
            Strview.ref().msg = 'world';
        });
    </script>
</body>

</html>
```

You can use `strviewCLI`, a scaffolding tool that will enable you to better understand and use `strview.js`. Click the link below to learn more.

```
https://github.com/maomincoding/strviewCLI.git
```

## Which dist file to use?

- `strview.esm.js`
  - For usage via native ES modules imports (in browser via `<script type="module">`.

- `strview.global.js`
  - For direct use via `<script src="...">` in the browser. Exposes the `Strview` global.