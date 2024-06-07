# Template documentation

There are three types of templates:
- `base.ejs`
- pages
- partials

`base.ejs` is the one that contains the head, header and footer of any page used in the website.

It takes a `page` template inside.

pages are the ones used in `base.ejs`.

partials are models used in the pages: they are always called from a `page` template.

---

## Table of contents

- [`base.ejs`](#baseejs)
- [`landing.ejs`](#landingejs)
- [`category.ejs`](#categoryejs)
- [`product.ejs`](#productejs)
- [`order.ejs`](#orderejs)
- [`login.ejs`](#loginejs)
- [`register.ejs`](#registerejs)
- [`update-password.ejs`](#update-passwordejs)
- [`confirm.ejs`](#confirmejs)

---

## `base.ejs`

Data format to pass to `base.ejs`:
````js
const data = {
  title: 'header-title',
    isAuthenticated: req.isAuthenticated /* boolean value with user authentication status */,
  template: 'page\'s name',
  templateData: {/* any specific data for page template*/},
  slogan: 'footer-slogan'  
};
````

---


## `landing.ejs`

Data format:

````json
{
  "banner": {
    "img": "image-path",
    "title": "banner-title",
    "text": "banner-text",
    "link": "banner-button-link",
    "btnContent": "banner-button-text"
  },
  "latest": {
    "title": "Latest products",
    "products": [
      {
        "link": "product-link",
        "img": "product-img",
        "name": "product-name",
        "price": "product-price"
      }
    ]
  },
  "popular": {
    "title": "Latest products",
    "products": [
      {
        "link": "product-link",
        "img": "product-img",
        "name": "product-name",
        "price": "product-price"
      }
    ]
  },
  "random": {
    "title": "Latest products",
    "products": [
      {
        "link": "product-link",
        "img": "product-img",
        "name": "product-name",
        "price": "product-price"
      }
    ]
  }
}
````

---

## `category.ejs`

Data format:

````json
{
  "navData": [
    {
      "link": "nav-link",
      "className": "nav-class",
      "title": "nav-title"
    }
  ],
  "category": {
    "products": [
      {
        "link": "product-link",
        "img": "product-img",
        "name": "product-name",
        "price": "product-price"
      }
    ]
  }
}
````

---

## `product.ejs`

Data format:

````json
{
  "navData": [
    {
      "link": "nav-link",
      "className": "nav-class",
      "title": "nav-title"
    }
  ],
  "product": {
    "images": [
      "image1-path",
      "image2-path",
      "image3-path"
    ],
    "name": "product-name",
    "description": "product-description",
    "price": "product-price-€",
    "colors": [
      "css-color-name"
    ],
    "brand": "product-brand",
    "miscellaneous": [
      {
        "name": "spec-name",
        "content": "spec-content"
      }
    ]
  }
}
````

---

## `order.ejs`

Data format:

````json
{
  "page": "details OR shipping OR payment",
  "order": {
    "products": [
      {
        "link": "product-link",
        "img": "product-img",
        "name": "product-name",
        "quantity": "quantity-ordered",
        "price": "product-price-€"
      }
    ],
    "subtotal": "sub-total-price-€",
    "shippingCost": "shipping-cost-€",
    "total": "total-price-€"
  }
}
````

Form names:
> **email**
> 
> **name**
> 
> **lastname**
> 
> **street**
> 
> **optional**
> 
> **city**
> 
> **zip**
> 
> **region**
> 
> **country**

---

## `login.ejs`

Form names:
> **email**
> 
> **password**
>

---

## `register.ejs`

Form names:
> **username**
> 
> **email**
> 
> **password**
> 
> **confirm-password**
>

---

## `update-password.ejs`

Data format:

````json
{
  "updatePwdToken": "token-to-update-password"
}
````

Form names:
> **password**
>
> **confirm-password**
>


---

## `confirm.ejs`

Data format:

````json
{
  "activationToken": "activation-token"
}
````
