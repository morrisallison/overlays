# Overlays

> React library for rendering overlays.

[![npm Version][badge-npm]][npm]
[![MIT License][badge-license]][license]

[badge-license]: https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square
[badge-npm]: https://img.shields.io/npm/v/overlays.svg?style=flat-square
[license]: https://github.com/morrisallison/overlays/raw/main/LICENSE
[npm]: https://www.npmjs.com/package/overlays

## Overview

Upgrade Dependents will discover and upgrade all compatible dependents within a directory.

#### Features

* Simple, easy to use API
* Doesn't require React portals

## Usage

```tsx
import { Overlay, OverlayProvider, OverlayRoot } from "overlays";

function MyHomePage() {
  return (
    <OverlayProvider>
      <main>
        <h1>Hello World!</h1>
        <section>
          <p>Page content</p>
          <Overlay>
            <p>Overlay content</p>
          </Overlay>
        </section>
        <OverlayRoot />
      </main>
    </OverlayProvider>
  );
}

function MyAboutPage() {
  return (
    <OverlayProvider>
      <main>
        <h1>About Us!</h1>
        <section>
          <p>Page content</p>
          <Overlay scope="modal">
            <p>Modal content</p>
          </Overlay>
          <Overlay scope="alert">
            <p>First alert</p>
          </Overlay>
          <Overlay scope="alert">
            <p>Second alert</p>
          </Overlay>
        </section>
        <OverlayRoot scope="modal" />
        <OverlayRoot scope="alert"  />
      </main>
    </OverlayProvider>
  );
}
```

## Installation

Node.js via [npm](https://www.npmjs.com/)

```bash
npm i overlays
```

Node.js via [Yarn](https://yarnpkg.com/)

```bash
yarn add overlays
```

## License

Copyright &copy; 2020 [Morris Allison III](http://morris.xyz).
<br>Released under the [MIT license][license].
