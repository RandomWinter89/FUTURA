## FUTURA App (E-Commerce on Fashion and Tech) - Frontend

### Coding Format

- JS: React.js v19 / Vite v6.3.1
- CSS: TailwindCSS v3.4.17 / Tailwind Merger v3.2.0

[![React](https://img.shields.io/badge/Coding%20Style-React-brightgreen.svg?style=flat)](https://github.com/facebook/react)
[![ES-JS](https://img.shields.io/badge/Coding%20Style-Javascript%20ES%202025-brightgreen.svg?style=flat)](https://github.com/standard/standard)
[![TailwindCSS](https://img.shields.io/badge/CSS%20Style-TailwindCSS-blue.svg?style=flat)](https://github.com/tailwindlabs/tailwindcss)

## Requirement:

Before downloading the source code, you must at least have a fundamental knowledge of the following:

1. [React Framework](https://react.dev/learn)
2. [React Router](https://reactrouter.com/6.30.1/start/tutorial)
3. [Redux Framework + Persist](https://redux.js.org/tutorials/fundamentals/part-1-overview)
4. [Redux Toolkit](https://redux-toolkit.js.org/introduction/getting-started)
5. [Tailwind CSS](https://tailwindcss.com/docs/installation/using-vite)
6. [Firebase Authentication](https://firebase.google.com/docs/auth/web/start)
7. [Firebase Storage](https://firebase.google.com/docs/storage)
8. [Axios Plugin](https://axios-http.com/docs/intro) (API Request)
9. [REST APIs](https://www.geeksforgeeks.org/rest-api-introduction/)
10. [Environment Variables / Secrets](https://vite.dev/guide/env-and-mode)

## Features

1. **Authentication Sign-up and Login** via Email/Password
2. **CRUD (Admin / User)**: Admin side handles in create product, product's variation and client order status. As for client side (user), they can interact with product as they prefer. Whether to add, remove or modified quantity in their cart or save to favorite.
3. **Payment Gateway - Stripe** (Development Mode) . Futura is a mock app for educational purpose, it will remain in development mode. Therefore, no actual transactions will be made.

## Installation Guidance

+ In the github, you can either **clone/download** the source code as zip version.
+ Ensure **npm** or **node package** is installed before proceeding, otherwise you aren't able to run the project
+ Edit the source code based on your prefer **IDE Editor** (Visual Code, Rider Editor)
+ Run `npm install` in terminal, the system will automatically install required package. You can manually installed based on **package.json** if prefer.
+ Create a `.env` file at the base directory, ensure you filled them correctly:

```sql
# Backend API without "/" (example: https://something:9999)
VITE_FUTURA_API = INSERT_VALUE_HERE

# Firebase Secrets (Grab from Firebase Console)
VITE_FIREBASE_API_KEY = INSERT_VALUE_HERE
VITE_FIREBASE_AUTH_DOMAIN = INSERT_VALUE_HERE
VITE_FIREBASE_PROJECT_ID = INSERT_VALUE_HERE
VITE_FIREBASE_STORAGE_BUCKET = INSERT_VALUE_HERE
VITE_FIREBASE_MESSAGING_SENDER_ID = INSERT_VALUE_HERE
VITE_FIREBASE_APP_ID = INSERT_VALUE_HERE

# Stripe Secret (Grab from Stripe Console)
VITE_STRIPE_PUBLIC_KEY= INSERT_VALUE_HERE

```

## Deploy Guidance

+ **Local Development** - Run `node index` to generate a local host backend. (Full Experience required frontend activate);
+ **Publish Deployment** - Upload it to GitHub, then navigate to Vercel and select from there.

## Built-in Dummy:

1. Admin
   + Email: zzz@gmail.com | Password: 123456
2. Users
   + Email: kenshi@gmail.com | Password: 123456
   + Email: family@gmail.com | Password: 123456

#### Active Deployment - [Vercel](https://futura-lac.vercel.app/)

#### Important - This project was created as part of the Sigma School Bootcamp's Module (#4) - the capstone project

## License

MIT © [David Tang / Project Futura](https://github.com/RandomWinter89)
