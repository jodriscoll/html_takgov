# TAK.gov Theme

Bootstrap version of the HTML templating UI for the TAK.gov web application.

---

### Installation

```
npm install
```

### Dev Server

```
npm start
```

### Build

```
npm run build
```

### Features:

- Bundling via [webpack](https://github.com/webpack/webpack)
- ES6+ Support via [babel](https://babeljs.io/)
- SASS Support via [sass-loader](https://github.com/jtangelder/sass-loader)
- Linting via [eslint-loader](https://github.com/MoOx/eslint-loader)
- Unit Testing via [jest](https://github.com/facebook/jest)
- Code Formatting via [prettier](https://github.com/prettier/prettier)

### Files structure:

```
├── src
│   ├── img/
│   ├── js/
│   ├── scss/
│   └── index.html
│   └── {...}.html
├── webpack
│   ├── webpack.common.js
│   ├── webpack.config.dev.js
│   └── webpack.config.prod.js
└── dist/
```

<br><br>

---

### Importing JS modules

You can import the entire library or just individual modules:

```
import * as library from 'library-name';                        // lib
import { Component } from 'library-name';                       // module
import { Component as CustomComponent } from 'library-name';    // module with custom name
```

### Importing CSS file

To import nodule_module stylesheets, please use the following syntax:

```
@import '~library-name/path/to/library.min.css';
```

### Importing SCSS modules

You can also import individual SCSS modules. To do it properly, it's recommend copying them from
the `~/node_modules/library-name/path/to/src/scss` location directly to your project and import them.
