## 🧩 EVM Indexer

EVM Indexer is a **NestJS-based application** designed to **index and serve on-chain Ethereum data**.
It provides **APIs**, integrates with **Swagger UI** for documentation, and supports **Docker** for easy deployment.
The project also includes **validation**, **rate-limiting**, and other features.

---
## 📦 1) Prerequisites
* ENV setup (see `src/constants/etherscan.ts` and `src/constants/infura.ts`).
* [Node.js](https://nodejs.org/) v18+ (with [pnpm](https://pnpm.io/) installed) or [Docker](https://www.docker.com/).

## 🚀 2-a) Running the App with Docker

```bash
# development
# Swagger docs available at: http://localhost:3008/docs
$ docker compose -f docker-compose.dev.yml up

# or run with
$ pnpm run docker:dev
```

---

## 💻 2-b) Running the App Locally (Node.js)

### ⚙️ Setup

```bash
$ pnpm install
```

### ▶️ Running the App

```bash
# development
$ pnpm run start

# watch mode
$ pnpm run start:dev

# production mode
$ pnpm run start:prod
```

### 🧪 Testing (not implemented yet)

```bash
# unit tests
$ pnpm run test

# e2e tests
$ pnpm run test:e2e

# test coverage
$ pnpm run test:cov
```
## 🔗 4)  **Swagger UI (Local 3001 / Docker 3008):** [http://localhost:3008/docs](http://localhost:3008/docs)

---

## 🛠️ Tech Stack

* 📌 [NestJS](https://nestjs.com/)
* 📌 TypeScript
* 📌 Docker
* 📌 ESLint + Prettier
* 📌 Swagger UI
* 📌 Husky


---

## ✅ Features Done

* ✅ Added **linter pre-commit hook** with Husky.
* ✅ Integrated **Swagger UI** for API documentation.
* ✅ Configured **ESLint + Prettier**.
* ✅ Implemented **rate-limiting** with `@nestjs/throttler` to prevent DDoS attacks.
* ✅ Added **DTO validation** with `class-validator` + `class-transformer`.
* ✅ Created **docker-compose** file for simplified app setup.

---

## 📝 Todo

* 💡 Write unit & e2e tests.
* 💡 Add a **caching layer** (Redis, Memcached).
* 💡 Implement **API versioning**.
* 💡 Use an advanced logging system (e.g., Winston).
* 💡 Add **monitoring & alerting** (Prometheus, Grafana).
* 💡 Set up **CI/CD pipelines** with GitHub Actions.

---

## 📄 Extra Info

### 🔍 Indexing On-Chain Data

Some useful methods for indexing Ethereum data:

* Using third-party APIs like **Moralis** or **The Graph**.
* Connecting through **RPC nodes** (paid providers generally offer better performance).
* Running your own **Ethereum node** with software like **Geth**.

### 🔄 Ethereum Reorgs After The Merge

📖 [Read more here](https://www.paradigm.xyz/2021/07/ethereum-reorgs-after-the-merge)

### ⏱️ Ethereum Block Time ≈ 12s

The Ethereum block time is \~12 seconds per block, meaning a new block is added every 12 seconds.
This timing is managed by Ethereum’s **consensus mechanism** to ensure stability and predictable transaction confirmations.
📊 [Etherscan Block Time Chart](https://etherscan.io/chart/blocktime)

