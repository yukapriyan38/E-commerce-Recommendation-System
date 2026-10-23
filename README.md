# E-commerce Recommendation System

A full-stack shopping application with a React storefront, an Express and MongoDB API, and a Python recommendation service. Signed-in users can browse products, manage a cart, place orders, and receive recommendations based on their activity.

## Features

- Product browsing and product detail pages
- User registration and sign-in using JSON Web Tokens
- Protected cart, checkout, and order history
- Product views, searches, cart actions, and purchases recorded as interactions
- Personalized recommendations based on product text and interaction history, with popular products as a fallback

## Project structure

```text
client/   React 19 application built with Vite
server/   Express API and MongoDB models
ml/       FastAPI recommendation service and recommendation models
```

## Technology

- **Frontend:** React, React Router, Axios, Vite
- **API:** Node.js, Express, Mongoose, JWT
- **Recommendations:** Python, FastAPI, pandas, scikit-learn
- **Database:** MongoDB

## Prerequisites

- Node.js and npm
- Python 3
- A MongoDB instance and connection URI

## Configuration

The Express API reads its environment variables from the repository-root `.env` file. The Python recommendation service reads its MongoDB URI from `ml/.env`.

Create or update these files with your own values:

```dotenv
# .env (repository root)
MONGO_URI=your_mongodb_connection_uri
JWT_SECRET=replace_with_a_long_random_secret
PORT=5000
```

```dotenv
# ml/.env
MONGO_URI=your_mongodb_connection_uri
```

Use the same MongoDB URI for both services. The application uses the `E-commerce` database. Keep secrets out of source control; do not commit either `.env` file.

## Installation and running

Run each component in its own terminal from the repository root.

### 1. Install frontend dependencies

```powershell
Set-Location client
npm install
npm run dev
```

Vite prints the local frontend URL when it starts.

### 2. Install and start the API

```powershell
Set-Location server
npm install
npm run dev
```

The API listens on `http://localhost:5000` by default. If you change `PORT`, update the frontend API base URL in `client/src/services/api.js` to match.

### 3. Install and start the recommendation service

From the repository root:

```powershell
Set-Location ml
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
python app.py
```

The recommendation service listens on `http://127.0.0.1:5001`. The Express API calls this local URL when an authenticated user requests recommendations.

## Product data

Products are read from MongoDB; the CSV in `ml/data/products.csv` is not imported automatically. Add product documents to the `products` collection (for example, through the product API) before browsing or generating recommendations. Product documents should include `name`, `category`, `brand`, `price`, and `description`; `tags`, `image`, `rating`, and `stock` are also supported.

## API overview

The API base URL is `http://localhost:5000/api`.

| Method | Endpoint | Description |
| --- | --- | --- |
| `POST` | `/auth/register` | Register an account |
| `POST` | `/auth/login` | Sign in and receive a JWT |
| `GET` | `/users/profile` | Get the signed-in user's profile |
| `GET` | `/products` | List products |
| `GET` | `/products/:id` | Get a product |
| `POST`, `PUT`, `DELETE` | `/products` and `/products/:id` | Create, update, or delete products |
| `GET` | `/cart` | Get the signed-in user's cart |
| `POST` | `/cart/add` | Add an item to the cart |
| `PUT`, `DELETE` | `/cart/:productId` | Update or remove a cart item |
| `DELETE` | `/cart` | Clear the cart |
| `POST` | `/orders` | Place an order |
| `GET` | `/orders/my-orders` | List the signed-in user's orders |
| `GET` | `/orders/:id` | Get an order |
| `POST` | `/interactions` | Record a user interaction |
| `GET` | `/recommendations` | Get personalized recommendations |

The profile, cart, order, interaction, and recommendation endpoints require the JWT returned by `/auth/login`, sent in an `Authorization` header. Product endpoints are currently not protected by authentication.

## Development checks

Build the frontend and run its linter from the `client` directory:

```powershell
npm run build
npm run lint
```

The API can be started in development mode with `npm run dev` or in regular mode with `npm start` from the `server` directory.
