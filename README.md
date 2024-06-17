# TakeAByte

---

## Presentation

TakeAByte is an online hardware shop made for an assignment at the end of my first year of computer science.
It is a project involving an API and a backend web server made in `nodejs` and `express`, with a `MySQL` database to store all necessary data.

This project was made in collaboration with **Nicolas Moyon**, who made most of the backend (API and backend web server), while I made the front-end with `ejs` templates and `SCSS`.

---

## Requirements

> - Nodejs `v20.14.0` or superior
> - WampServer `v3.3.2` or superior or MySQL `v8.2.0` or superior

---

## Installation

1. Clone the repository or download it.
2. Run `npm i` in `TakeAByte/api/` and `TakeAByte/ServJS/` from the terminal.
3. Follow the **installation procedure**:

[How to install TakeAByte (EN)](INSTALL/README_EN.md)

[Comment installer TakeAByte (FR)](INSTALL/README_FR.md)

> ℹ️ If you need to change any environment variable, there are located in `api/.env` and `ServJS/data.env`.
> 
> ⚠️ Modifying these files may crash the server (at your own risk)!
> 

---

## Test card for payment
    Allow successfull payments :
        number : 2525 2525 2525 2525
        expiration date : 12/28
        cvc : 123

    Expired card :
        number : 2020 2020 2020 2020
        expiration date : 12/20
        cvc : 256

    Card balance is not enought :
        number : 2121 2121 2121 2121
        expiration date : 12/28
        cvc : 512

---

## Contributors

- [Antoine de Barbarin](https://github.com/deBarbarinAntoine)
- [Nicolas Moyon](https://github.com/Nicolas13100)
