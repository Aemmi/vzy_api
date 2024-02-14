# Express API Server

This is an Express API server that provides endpoints for user registration, authentication, updating user records, and handling Stripe webhook events.

## Requirements

- Node.js
- MongoDB
- Stripe account

## Setup

1. Clone the repository:


2. Install dependencies:


3. Set up environment variables: copy .env.example and replace the following: 
STRIPE_SKEY=your_stripe_secret_key
STRIPE_PKEY=your_stripe_public_key

4. Start the server: npm run dev


## Endpoints

- **POST /register**: Register a new user. Requires `email`, `password`, `name`, and optional `country` and `gender` in the request body.

- **POST /login**: Authenticate a user and generate an access token. Requires `email` and `password` in the request body.

- **PUT /update**: Update user records. Requires an access token in the Authorization header. Allows updating `name` and `gender` of the authenticated user.

- **POST /stripe-webhook**: Endpoint to handle Stripe webhook events. Handles `payment_intent.succeeded` event and updates user status to "paid" in the database.

## Usage

1. Register a new user using the `/register` endpoint.

example: 

{
  "email": "imawebservice2@gmail.com",
  "password": "12345678",
  "name": "Emmanuel Ayeh",
  "country": "Nigeria",
  "gender": "M"
}

2. Authenticate the user using the `/login` endpoint to obtain an access token.

{
  "email": "imawebservice2@gmail.com",
  "password": "12345678"
}

3. Use the access token to access protected endpoints like `/update`.

{
  "email": "imawebservice2@gmail.com",
  "name": "Emmanuel Ayeh",
  "gender": "M"
}

Note: Provide the jwt token that was generated on login in the request header.

4. Set up Stripe webhook in your Stripe account dashboard to send payment success events to the `/stripe-webhook` endpoint.






