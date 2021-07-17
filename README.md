# Frontend: Login using your wallet

We want to authenticate using our Metamask wallet. To do this we will make the user sign a message which is exchanged with the backend. The backend will on its turn, respond with an authorization token.

## To start

- Install npm modules in backend using `yarn` or `npm install` and run it using `yarn start` or `npm start`
- Create a frontend using `create-react-app` or anything that you deem fit

## Assignment

Show that you can create the authentication flow. We don't want anything fancy looking, just displaying the authentication token retrieved on the end suffices.

## Handing in

Zip folders but exclude the node_modules folder :)

## Getting Started

To get started you'll need:

- [Metamask](https://metamask.io/download.html)
- [Node.js >=10](https://nodejs.org/en/download/)

Clone the repository using git:

```bash
git clone https://github.com/glamboyosa/coding-test-frontend-login-sign.git
```

## Start the app

To start the backend, open a new terminal and install dependencies via:

```bash
cd backend && npm install
#or
cd backend && yarn
```

Copy the values of the `.env.example` file into a `.env` file via:

```bash
cp .env.example .env
```

Update the value in the `.env` file.

Then run:

```bash
npm run dev
#or
yarn dev
```

To start the frontend, open a new terminal and install dependencies via:

```bash
cd web && npm install
#or
cd web && yarn
```

Then run: 
```bash 
npm run dev 
#or 
yarn dev
```
