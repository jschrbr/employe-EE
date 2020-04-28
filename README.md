<h1 align="center">Welcome to employ-ee 👋</h1>
<p>
  <img alt="Version" src="https://img.shields.io/badge/version-1.0.0-blue.svg?cacheSeconds=2592000" />
  <a href="https://github.com/jschrbr/employe-EE" target="_blank">
    <img alt="Documentation" src="https://img.shields.io/badge/documentation-yes-brightgreen.svg" />
  </a>
  <a href="#" target="_blank">
    <img alt="License: ISC" src="https://img.shields.io/badge/License-ISC-yellow.svg" />
  </a>
</p>

> A command line based employee tracking tool.

### 🏠 [Homepage](https://github.com/jschrbr/employe-EE)

## Install

This application requires a local mySQL server to be running. Connection credentials can be edited in [sql.js](db/sql.js).

> Default:
>
> ```sh
> username: root
> password:
> host: localhost
> port: 3306
> db: employee_db
> ```
>
> db name is set in [schema.sql](db/schema.sql).

Run the following in a terminal.

```sh
git clone https://github.com/jschrbr/employe-EE.git;
cd employ-EE;
npm install;
mysql -u root < db/schema.sql;
```

## Usage

```sh
node app.js
```

## Author

👤 **James Schreiber**

- Website: https://jschrbr.github.io/portfolio/
- Github: [@jschrbr](https://github.com/jschrbr)
- LinkedIn: [@techsmechs](https://linkedin.com/in/techsmechs)

## 🤝 Contributing

Contributions, issues and feature requests are welcome!<br />Feel free to check [issues page](https://github.com/jschrbr/employe-EE/issues).

## Show your support

Give a ⭐️ if this project helped you!

<a href="https://www.patreon.com/techsmechs">
  <img src="https://c5.patreon.com/external/logo/become_a_patron_button@2x.png" width="160">
</a>

---

_This README was generated with ❤️ by [readme-md-generator](https://github.com/kefranabg/readme-md-generator)_
