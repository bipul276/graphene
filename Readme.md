
-----
*![logo](<Screenshot 2025-10-29 115525-1.png>)*
# Graphene – Blockchain-Based Certificate Verification System

## Project Overview and Purpose

Graphene is a full-stack web application designed to securely issue and verify academic and professional certificates using blockchain technology. The platform addresses the critical problem of credential fraud by leveraging cryptographic hashing, digital signatures, and an immutable public ledger (Polygon blockchain). The goal is to provide a trustworthy system where institutions (issuers) can issue tamper-proof certificates and third parties (verifiers) can instantly validate a certificate’s authenticity.

Key objectives of Graphene include:

  * **Secure Certificate Issuance:** Colleges, universities, or other institutions (issuers) can register on the platform and upload certificates. Each certificate’s content is hashed (SHA-256) to ensure integrity and then recorded both in a PostgreSQL database and on the Polygon blockchain.
  * **Instant Verification:** Employers or other verifiers can verify a certificate by providing the certificate’s unique ID. Graphene performs a three-factor verification – confirming the issuing institution’s identity (Issuer ID), the document’s integrity (hash comparison), and ownership (private Certificate ID).
  * **Public Ledger & Transparency:** Graphene writes certificate records to an on-chain ledger (Polygon Amoy testnet). This public record means anyone can independently verify that a given certificate hash was issued by a trusted institution at a specific time.
  * **User-Friendly Platform:** Graphene offers a web interface with distinct user journeys for issuers and verifiers, abstracting away the blockchain complexity.

In summary, Graphene’s purpose is to bring the security and transparency of blockchain to certificate verification in a practical, easy-to-use web application.

-----

## Features

Graphene provides a comprehensive feature set to support secure document issuance and verification:

  * **Institution Registration & Verification:** Institutions can register and are assigned a unique **Issuer ID** after approval.
  * **Secure Login and Authentication:** Uses hashed passwords and JSON Web Tokens (JWT) for secure session management.
  * **Issuer Dashboard:** Allows issuers to manage their profile, upload an official logo (via Firebase Cloud Storage), and view all issued certificates.
  * **Certificate Issuance (Upload):**
      * Issuers upload a certificate (PDF/image) and provide recipient details.
      * The system computes a **SHA-256 hash** of the file.
      * A private **Certificate ID** is generated for the recipient.
  * **On-Chain Recording:** The certificate's hash and metadata are recorded on the **Polygon (Amoy) testnet** via a smart contract.
  * **Certificate Storage and Immutability:** Metadata and hash are stored in a PostgreSQL database, designed to be append-only.
  * **Verification Portal:**
      * A public page for verifiers (no account needed).
      * Verifiers input the Issuer ID, Certificate ID, and optionally the certificate file.
      * The system performs an **Identity Check**, **Ownership Check**, and **Integrity Check** (hash comparison).
  * **Instant Verification Results:** The UI provides a clear "Valid" or "Invalid" verdict, displaying the authentic certificate details.
  * **Public Institution Registry:** A public directory of all verified issuers on the Graphene network.
  * **Logo and Document Storage via Firebase:** Uses Firebase Cloud Storage (via the Admin SDK) to securely store uploaded files.
  * **Email Notifications (Planned/Future):** Can notify recipients with their Certificate ID and a verification link.
  * **Audit Trail and Transaction Logs:** All actions are logged, and on-chain issuances have a public transaction hash viewable on a blockchain explorer.
  * **Security Measures:** Employs password hashing (bcrypt), JWT, server-side validation, file type/size checks, and cryptographic hash comparisons.
  * **Scalability and Performance:** Built with React/Vite and Node.js/Express for a responsive, scalable system.
  * **Ease of Use:** Abstracts all blockchain complexity from the end-users.

-----

## Tech Stack

  * **Frontend:** Vite + React + TypeScript
  * **UI Libraries & Styling:** [Add if used] (e.g., Tailwind CSS, Material-UI, or standard CSS)
  * **Backend:** Node.js with Express
  * **Database:** PostgreSQL
  * **Blockchain:** Polygon (Amoy Testnet) with a Solidity smart contract
  * **Blockchain Interaction:** Ethers.js or Web3.js
  * **Cloud Storage & Services:** Firebase Cloud Storage (via Firebase Admin SDK)
  * **Authentication & Security:**
      * JSON Web Tokens (JWT)
      * Password Hashing (bcrypt)
      * Input Validation (e.g., express-validator, Zod)
      * Cryptography (Node.js Crypto module for SHA-256)
  * **File Uploads:** Multer (for Express)
  * **Development Tools:** ESLint, Prettier, Git & GitHub

-----

## Prerequisites for Local Development

Before setting up Graphene, ensure you have the following installed and configured:

  * **Node.js (and npm):** Version 18 LTS or above.
  * **PostgreSQL Database:** A running instance. You'll need to create a database (e.g., `graphene`) and have the credentials (host, port, user, password).
  * **Firebase Account (for Admin SDK):**
      * A Firebase project with **Cloud Storage** enabled.
      * A **Service Account Key JSON** file (generated from Project Settings \> Service Accounts).
  * **Polygon Testnet Access:**
      * A crypto wallet (like MetaMask) to get an account address and private key.
      * **Test MATIC (POL)** for the Amoy testnet, obtainable from a faucet.
      * The **Polygon Amoy RPC URL**: `https://rpc-amoy.polygon.technology/`
      * The project's deployed **smart contract address**.
  * **Development Tools:**
      * A terminal or command prompt.
      * A code editor like VS Code.
      * Git (if cloning from a repository).
  * **Other Services (optional):**
      * **Mail Server:** SMTP credentials if email notifications are implemented.

-----

## Installation and Setup

### 1\. Clone the Repository

```bash
# Replace with the actual repository URL
git clone https://github.com/your-username/graphene.git
cd graphene
```

### 2\. Backend Setup (Node.js + Express)

1.  Navigate to the backend directory and install dependencies:
    ```bash
    cd backend
    npm install
    ```
2.  **Configuration:**
      * Create a `.env` file in the `backend/` directory (you can copy `.env.example`).
      * Set the required variables (see Environment Variables section). You'll need credentials for your Database, Firebase, and Polygon account.
3.  **Database Setup:**
      * Ensure your PostgreSQL server is running and you've created the database.
      * Run any database migration scripts if provided (e.g., `npx prisma migrate dev` or `npx sequelize db:migrate`).
4.  **Firebase Service Account:** Place your downloaded `serviceAccountKey.json` file in a secure location (e.g., the `backend/` folder, and add it to `.gitignore`).
5.  **Start the Backend (Development Mode):**
    ```bash
    npm run dev
    ```
    The server should start (e.g., on `localhost:5000`).

### 3\. Frontend Setup (Vite + React)

1.  Open a **new terminal** and navigate to the frontend directory:
    ```bash
    cd frontend
    npm install
    ```
2.  **Configuration:** Create a `.env` file in the `frontend/` directory. You will need to set the backend API URL:
    ```ini
    VITE_API_URL=http://localhost:5000
    ```
3.  **Start the Frontend (Development Mode):**
    ```bash
    npm run dev
    ```
    Vite will start the dev server (e.g., on `http://localhost:5173/`).

### 4\. Running Both Servers Concurrently (optional)

If the root `package.json` is configured, you might be able to run both from the root directory:

```bash
npm run dev
```

### 5\. Verify the Setup

  * Visit the React app in your browser (e.g., `http://localhost:5173`).
  * Try registering a new institution.
  * Check the backend terminal for logs to see if the request was successful.

### 6\. Additional Setup (Optional)

  * **Database Migrations/Seeding:** Run any seed scripts (`npm run seed`) to populate the database with test data.
  * **Smart Contract Deployment:** If you want to deploy your own contract, use tools like Hardhat, deploy it to Amoy, and update the `CONTRACT_ADDRESS` in your `.env` file.

-----

## Environment Variable Configuration

### Backend Environment Variables (`backend/.env`)

Create a file named `.env` in the `backend/` directory:

```ini
# Server Configuration
PORT=5000
NODE_ENV=development

# PostgreSQL Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=graphene
DB_USER=postgres
DB_PASSWORD=your_db_password

# Alternatively, a single DATABASE_URL:
# DATABASE_URL=postgres://user:password@host:5432/graphene

# JWT Authentication
JWT_SECRET=your_jwt_secret_key

# Firebase Admin SDK (for file uploads)
FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_CLIENT_EMAIL=your_service_account_email
# IMPORTANT: Format the private key with \n for newlines
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nABC...123\n-----END PRIVATE KEY-----\n"

# Firebase Storage
FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com

# Blockchain / Polygon Configuration
POLYGON_RPC_URL=https://rpc-amoy.polygon.technology/
POLYGON_CHAIN_ID=80002
CONTRACT_ADDRESS=0xYourSmartContractAddress
POLYGON_PRIVATE_KEY=your_wallet_private_key

# (Optional) Additional Configs
# If the smart contract ABI is loaded from a file, ensure that file is accessible.
# If using an Alchemy/Infura RPC, set that URL here.

# If email notifications are enabled:
# SMTP_HOST=...
# SMTP_USER=...
# SMTP_PASS=...
# (and so on for any mailing service)
```

**Notes on the above configuration:**

  * **Do not commit** the actual `.env` file to version control.
  * **Database variables:** Ensure these match your local Postgres setup.
  * **Firebase variables:** You can provide them individually *or* set `GOOGLE_APPLICATION_CREDENTIALS=./serviceAccountKey.json` if your code supports it.
  * **Blockchain variables:** `POLYGON_PRIVATE_KEY` is the key for the account that will send transactions. **This account must have test MATIC (POL) from an Amoy faucet.**

### Frontend Environment Variables (`frontend/.env`)

In the `frontend/` directory, create a `.env` file:

```ini
VITE_API_URL=http://localhost:5000
VITE_APP_NAME=Graphene
# ... any other public config
```

-----

## Running the Servers (Development & Production)

### Running in Development

Use two terminals:

1.  **Backend:** `cd backend && npm run dev`
2.  **Frontend:** `cd frontend && npm run dev`

### Running in Production

1.  **Build the frontend:**

    ```bash
    cd frontend
    npm run build
    ```

    This creates an optimized build in `frontend/dist/`.

2.  **Configure the backend for production:**

      * Set `NODE_ENV=production` in the `backend/.env`.
      * To serve the frontend from the backend, add this to your `backend/index.js` (or `server.js`):
        ```javascript
        // Make sure to import 'path'
        const path = require('path');

        // Serve static files from the React build
        app.use(express.static(path.join(__dirname, '../frontend/dist')));

        // Handle all other routes by sending the React app
        app.get('*', (req, res) => {
          res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
        });
        ```

3.  **Start the backend in production mode:**

    ```bash
    cd backend
    npm start
    ```

4.  **Access the production build:** Open `http://localhost:5000` (or your configured `PORT`) in your browser.

-----

## API Route Documentation

Base URL: `http://localhost:5000/api`

### Authentication & User Accounts

  * **POST /api/auth/register**

      * **Description:** Register a new issuing institution.
      * **Request (`multipart/form-data`):** `name`, `email`, `password`, `logo` (optional file).
      * **Response:**
        ```json
        {
          "success": true,
          "data": {
            "issuerId": "ISSUER12345",
            "name": "Graphene University",
            "email": "registrar@graphene.edu",
            "logoUrl": "https://storage.googleapis.com/...",
            "createdAt": "2025-10-01T12:34:56Z"
          }
        }
        ```

  * **POST /api/auth/login**

      * **Description:** Authenticate an institution.
      * **Request (`json`):** `email`, `password`.
      * **Response:**
        ```json
        {
          "success": true,
          "token": "<JWT_TOKEN>",
          "data": {
            "issuerId": "ISSUER12345",
            "name": "Graphene University",
            "email": "registrar@graphene.edu"
          }
        }
        ```

  * **GET /api/auth/profile**

      * **Description:** (Protected) Get current logged-in institution profile.
      * **Auth:** `Authorization: Bearer <token>`
      * **Response:**
        ```json
        {
          "issuerId": "ISSUER12345",
          "name": "Graphene University",
          "email": "registrar@graphene.edu",
          "verified": true,
          "createdAt": "2025-10-01T12:34:56Z"
        }
        ```

  * **PUT /api/auth/profile**

      * **Description:** (Protected) Update profile information (e.g., `name` or `logo`).
      * **Auth:** `Authorization: Bearer <token>`

### Certificate Issuance (for Issuers)

  * **POST /api/certificates**

      * **Description:** (Protected) Issue a new certificate.
      * **Auth:** `Authorization: Bearer <token>`
      * **Request (`multipart/form-data`):** `recipientName` (string), `certificateTitle` (string), `certificateFile` (file), `recipientEmail` (optional), `additionalInfo` (optional).
      * **Response:**
        ```json
        {
          "success": true,
          "data": {
            "certificateId": "CERT-XYZ-123456",
            "issuerId": "ISSUER12345",
            "recipientName": "Alice Doe",
            "certificateTitle": "Bachelor of Science",
            "hash": "e3b0c44298fc1c149afbf4c8996fb924...",
            "transactionId": "0xabc123...789",
            "issuedAt": "2025-10-02T09:00:00Z"
          }
        }
        ```

  * **GET /api/certificates**

      * **Description:** (Protected) List certificates issued by the logged-in institution.
      * **Auth:** `Authorization: Bearer <token>`
      * **Response:**
        ```json
        {
          "success": true,
          "data": [
            {
              "certificateId": "CERT-XYZ-123456",
              "recipientName": "Alice Doe",
              ...
            },
            ...
          ]
        }
        ```

  * **GET /api/certificates/:certificateId**

      * **Description:** (Protected) Get details of a specific certificate.
      * **Auth:** `Authorization: Bearer <token>`

### Certificate Verification (for Verifiers)

  * **POST /api/verify**

      * **Description:** (Public) Verify a certificate’s authenticity.
      * **Request (`multipart/form-data`):** `issuerId` (string), `certificateId` (string), `certificateFile` (file, optional for hash check).
      * **Response (Valid):**
        ```json
        {
          "success": true,
          "data": {
            "isValid": true,
            "issuerName": "Graphene University",
            "recipientName": "Alice Doe",
            "certificateTitle": "Bachelor of Science",
            "issuedAt": "2025-10-02T09:00:00Z",
            "onChainVerified": true
          }
        }
        ```
      * **Response (Invalid):**
        ```json
        {
          "success": false,
          "data": {
            "isValid": false,
            "message": "Certificate not found or hash mismatch."
          }
        }
        ```

  * **GET /api/institutions**

      * **Description:** (Public) Get list of all verified institutions.
      * **Response:**
        ```json
        {
          "institutions": [
            {
              "issuerId": "ISSUER12345",
              "name": "Graphene University",
              "logoUrl": "https://...",
              "verified": true
            },
            ...
          ]
        }
        ```

  * **GET /api/certificates/verify?issuerId=...\&certificateId=...**

      * **Description:** (Alternate) A GET endpoint for simple verification, often used for QR codes.

-----

## On-Chain Interaction (Polygon Integration)

### What Happens On-Chain?

When a certificate is issued, the backend performs a blockchain transaction. It uses a smart contract on Polygon (Amoy testnet) to log the certificate's **hash**, **Issuer ID**, and **Certificate ID**. This creates an immutable record that anyone can check.

### Required Blockchain Credentials and Setup

  * **`POLYGON_RPC_URL`:** An RPC endpoint for the Amoy testnet.
  * **`POLYGON_CHAIN_ID`:** `80002` for Amoy.
  * **`CONTRACT_ADDRESS`:** The address of your deployed `CertificateRegistry.sol` smart contract.
  * **`POLYGON_PRIVATE_KEY`:** The private key of the server's wallet. **This account must be funded with test MATIC (POL)** to pay for gas fees.
  * **Web3 Library:** The backend uses Ethers.js or Web3.js to interact with the contract. The code will look something like this:
    ```javascript
    const provider = new ethers.JsonRpcProvider(process.env.POLYGON_RPC_URL);
    const wallet = new ethers.Wallet(process.env.POLYGON_PRIVATE_KEY, provider);
    const contract = new ethers.Contract(contractAddress, contractABI, wallet);

    // This call costs gas
    await contract.issueCertificate(issuerId, certId, hash);
    ```
  * **Contract ABI:** The application needs the contract's ABI (Application Binary Interface), usually loaded from a JSON file.

### How Verification Uses Blockchain

During verification (`/api/verify`), the backend can:

1.  **Check its local Postgres database.**
2.  **Cross-check the blockchain** by calling a read-only function on the smart contract (e.g., `getCertificate(certId)`) to see if the hash stored on-chain matches.

-----

## Project Structure

This is a typical layout for the monorepo:

```
graphene/
├── backend/                  # Node.js/Express Backend
│   ├── src/
│   │   ├── controllers/      # Route handler logic (authController.js, ...)
│   │   ├── routes/           # API route definitions (authRoutes.js, ...)
│   │   ├── models/           # Database models or ORM schemas
│   │   ├── middleware/       # (auth.js for JWT, upload.js for Multer)
│   │   ├── services/         # (blockchainService.js, firebaseService.js)
│   │   ├── config/           # (database.js, firebase.js)
│   │   └── index.js          # Server entry point
│   ├── package.json
│   └── .env.example
│
├── frontend/                 # React + Vite Frontend
│   ├── src/
│   │   ├── components/       # Reusable UI components (Navbar.tsx, ...)
│   │   ├── pages/            # Page components (Login.tsx, Dashboard.tsx, ...)
│   │   ├── services/         # API call functions (api.ts)
│   │   ├── App.tsx           # Main app component with routing
│   │   └── main.tsx          # React entry point
│   ├── public/
│   │   └── index.html
│   ├── vite.config.ts
│   ├── package.json
│   └── .env.example
│
├── docs/ or screenshots/     # Documentation assets
│
├── contract/                 # Solidity Smart Contract
│   ├── CertificateRegistry.sol
│   ├── artifacts/            # Compiled ABIs
│   ├── hardhat.config.js
│   └── scripts/              # Deployment scripts
│
├── README.md                 # This file
├── package.json              # Root package.json (for running both servers)
└── .gitignore
```

### Key Folders and Files Explained:

  * **`backend/src/controllers`:** Contains the business logic for each API route (e.g., `register`, `login`, `issueCertificate`).
  * **`backend/src/routes`:** Defines the API endpoints and maps them to the correct controller functions.
  * **`backend/src/middleware`:** Holds functions that run before your controllers, like checking for a valid JWT (`authMiddleware.js`) or parsing file uploads (`upload.js`).
  * **`backend/src/services`:** Houses utility functions, like `blockchainService.js` (for interacting with Polygon) or `hashService.js`.
  * **`backend/index.js`:** The main file that initializes the Express app, connects to the database, and starts the server.
  * **`frontend/src/components`:** Reusable React components (buttons, forms, layout).
  * **`frontend/src/pages`:** Top-level components for each page/route (Home, Login, Dashboard).
  * **`frontend/src/services` or `api`:** Functions for making API calls to the backend.

-----

## Contribution Guidelines

  * **Issue Tracking:** Use GitHub Issues to report bugs or suggest features.
  * **Fork & Pull Requests:**
    1.  Fork the repository.
    2.  Create a new feature branch (e.g., `git checkout -b feature/add-email-notifications`).
    3.  Make your changes.
    4.  Run `npm run lint` to check code style.
    5.  Commit your changes and push to your fork.
    6.  Open a Pull Request to the main repository.
  * **Code Style:** Follow the existing conventions (ESLint and Prettier).
  * **Major Changes:** Please open an issue first to discuss any major architectural changes.

-----

## Screenshots

*![Institution login](image.png)*

Graphene Institution Login

*![Certificate Issue](image-1.png)*

Certificate Issuance Form

*![Verification Page](image-2.png)* *![Verification step2](image-3.png)*

Verification Page

*![Failed](image-4.png)* *![Success](image-7.png)*

Verification Result

*![Public Ledger](image-5.png)*

Public Ledger

*![Verified University Page](image-6.png)*

Verified Universities

-----

With these instructions, documentation, and visuals, you should be well-equipped to install, develop, and use the Graphene certificate verification system. If you have any improvements you could think of, you are free to fork the project.

-----