Graphene – Blockchain-Based Certificate Verification System
Project Overview and Purpose
Graphene is a full-stack web application designed to securely issue and verify academic and professional certificates using blockchain technology. The platform addresses the critical problem of credential fraud by leveraging cryptographic hashing, digital signatures, and an immutable public ledger (Polygon blockchain). The goal is to provide a trustworthy system where institutions (issuers) can issue tamper-proof certificates and third parties (verifiers) can instantly validate a certificate’s authenticity.
Key objectives of Graphene include:
•	Secure Certificate Issuance: Colleges, universities, or other institutions (issuers) can register on the platform and upload certificates. Each certificate’s content is hashed (SHA-256) to ensure integrity and then recorded both in a PostgreSQL database and on the Polygon blockchain. This makes the record tamper-proof – any change in the certificate file would change its hash and be detected during verification.
•	Instant Verification: Employers or other verifiers can verify a certificate by providing the certificate’s unique ID (and optionally the certificate file). Graphene performs a three-factor verification – confirming the issuing institution’s identity (Issuer ID), the document’s integrity (comparing the file’s hash), and ownership (using a private Certificate ID known only to the certificate holder). If all checks pass, the certificate is confirmed as authentic and unaltered.
•	Public Ledger & Transparency: Instead of solely relying on a centralized database, Graphene also writes certificate records to an on-chain ledger (Polygon Amoy testnet). This public blockchain record means anyone can independently verify that a given certificate hash was issued by a trusted institution at a specific time, adding an extra layer of trust beyond the Graphene database.
•	User-Friendly Platform: Graphene offers a web interface with distinct user journeys for issuers and verifiers. Issuers get a dashboard to manage their institution profile and issued certificates, including uploading an official logo and viewing all certificates they have issued. Verifiers (such as HR departments) can use a simple verification portal to check a certificate’s validity without needing their own blockchain knowledge or access.
In summary, Graphene’s purpose is to bring the security and transparency of blockchain to certificate verification in a practical, easy-to-use web application. It ensures that educational and professional credentials cannot be easily forged or altered, thereby increasing trust for employers, academic institutions, and other stakeholders in the authenticity of documents.
Features
Graphene provides a comprehensive feature set to support secure document issuance and verification:
•	Institution Registration & Verification: Academic or professional institutions can register for an account. Each approved institution is assigned a unique Issuer ID that serves as a public identifier on the platform. (Optionally, institutions can be manually verified by an admin before activation to prevent unauthorized sign-ups.)
•	Secure Login and Authentication: Registered institutions log into an issuer dashboard using secure authentication (passwords are hashed, and authentication tokens or sessions protect routes). JSON Web Tokens (JWT) or similar techniques are used to maintain session security for API access.
•	Issuer Dashboard: Upon login, an issuer sees a dashboard where they can manage their profile and certificates. This includes the ability to upload the institution’s official logo (stored via Firebase Cloud Storage through the Firebase Admin SDK) so that issued certificates can carry authentic branding.
•	Certificate Issuance (Upload): Issuers can upload new certificates to the system. For each certificate, the issuer provides recipient details (e.g. student name, certificate title/description, date of issuance, etc.) and the certificate file (PDF or image). The system computes a SHA-256 hash of the certificate file content to create a digital fingerprint of the document. A Certificate ID (a private unique code) is generated for the certificate, which will be shared only with the certificate’s recipient.
•	On-Chain Recording: When a certificate is issued, Graphene interacts with a smart contract on the Polygon (Amoy) testnet to record the certificate’s details on-chain. Typically, this involves storing the certificate’s hash, the Issuer ID, and possibly the Certificate ID or a transaction ID on the blockchain. This on-chain record serves as an immutable ledger entry that the certificate was issued by that institution. Even if Graphene’s own database is compromised, the blockchain record remains as a source of truth.
•	Certificate Storage and Immutability: The certificate’s metadata (issuer, recipient name, etc.) and hash are stored in a PostgreSQL database. The design is append-only — once a certificate record is created, it is never modified or removed, simulating an immutable ledger in the database. This ensures an internal audit trail in addition to the blockchain.
•	Verification Portal: Verifiers (such as employers or universities reviewing credentials) can access a verification page without needing an account. To verify a certificate, they input the certificate’s public Issuer ID (or select the institution) and the Certificate ID provided by the certificate-holder. Optionally, they can upload the certificate file itself for an automatic integrity check. Graphene will then:
•	Identity Check: Confirm that the Issuer ID belongs to a registered, trusted institution.
•	Ownership Check: Ensure the provided Certificate ID exists and was indeed issued to that recipient by that issuer.
•	Integrity Check: If a certificate file is uploaded, compute its hash and compare it against the hash recorded in the system and on-chain.
•	Instant Verification Results: The verifier receives immediate feedback. If the certificate is valid, the system displays a confirmation (often showing the certificate’s details – e.g., recipient name, certificate title, issuing institution name/logo, issue date – so the verifier can cross-verify these with the document in hand). If invalid, an error or warning is shown (e.g., “Certificate not found or has been tampered with”). The UI provides a clear verdict.
•	Public Institution Registry: Graphene includes a public-facing registry of all verified issuers. This is a directory listing all institutions that have signed up and been verified on the platform, along with their Issuer ID, official name, logo, and other public details (such as an official website or location if provided). This registry allows anyone to confirm an institution’s participation in the Graphene network and obtain their Issuer ID for verification purposes.
•	Logo and Document Storage via Firebase: The platform uses Firebase Cloud Storage (via the Admin SDK on the backend) to store uploaded logos (and potentially certificate files, if storing them). This offloads file storage to a reliable cloud service. When an institution uploads a logo, the file is uploaded to a secure Storage bucket, and the URL or reference is saved in the database for later retrieval (e.g., showing the logo on verification results).
•	Email Notifications (Planned/Future): (If implemented) When a certificate is issued, Graphene can send an email notification to the recipient with their Certificate ID and a link to the verification portal. This improves usability by directly providing the verification steps to the certificate holder.
•	Audit Trail and Transaction Logs: Every certificate issuance and verification action can be logged. Each certificate record includes timestamps and digital signatures. On-chain transactions have transaction hashes that can be viewed on a Polygon blockchain explorer (like Amoy Polygonscan) to independently verify the certificate issuance event.
•	Security Measures: Graphene employs multiple layers of security: password hashing for user accounts, JWT or session-based auth for API calls, server-side validation of all inputs, file type and size checks on uploads, and the aforementioned cryptographic hash comparisons. Data in transit is protected via HTTPS (in production deployment).
•	Scalability and Performance: Built with a React/Vite frontend and a Node.js/Express backend, Graphene is designed for responsiveness and scalability. The use of a relational database (PostgreSQL) ensures reliable data management, while offloading certain tasks to blockchain and cloud storage keeps the core app efficient. The architecture can be containerized or deployed to cloud platforms for production use.
•	Ease of Use: Despite the complex technology under the hood, Graphene’s user interface is designed to be simple. Issuers do not need blockchain expertise to issue certificates — they interact with a familiar web form. Verifiers do not need any special software; they simply use the web portal to get instant results. Graphene abstracts away the blockchain interactions entirely from the end-users.
This feature set makes Graphene a robust solution for modernizing certificate issuance and verification, blending user-friendly design with the power of blockchain to prevent fraud.
Tech Stack
Graphene is built with a modern web development stack and blockchain integration. The primary technologies include:
•	Frontend: Vite + React + TypeScript – The user interface is a single-page application built with React for a dynamic, responsive experience. Vite is used as the build tool and development server for fast hot-module reloading and optimized production builds. TypeScript ensures type safety and better maintainability of the front-end code.
•	UI Libraries & Styling: [Add if used] For styling and layout, the project uses standard CSS and possibly a component library or framework (such as Tailwind CSS, Material-UI, Bootstrap, etc.). (If no specific library, then simple React with CSS/SCSS modules or styled-components is used to design the interface.)
•	Backend: Node.js with Express – The server-side is a Node.js application using the Express framework to build a RESTful API. Express handles routing and middleware for authentication, file upload, and API endpoints for various features (auth, certificate issuance, verification, etc.). The backend is written in JavaScript (or TypeScript) and follows a modular structure (with separate controllers, routes, and services for clarity).
•	Database: PostgreSQL – A relational SQL database is used to store persistent data such as user accounts (institutions), issued certificates metadata, and logs. PostgreSQL was chosen for its reliability and support for complex queries (for example, to search certificate records or join data between issuers and certificates). The schema is designed to enforce data integrity (e.g., foreign keys linking certificates to issuing institution records). Optionally, an ORM or query builder (such as Prisma, Sequelize, or Knex) is used to interact with the database in a convenient way, or raw SQL queries with the pg Node driver are utilized for full control.
•	Blockchain: Polygon (Amoy Testnet) – Graphene integrates with the Polygon blockchain’s Amoy testnet (Polygon’s latest test network, replacing Mumbai) for on-chain certificate issuance and verification. A smart contract (written in Solidity) is deployed on the Amoy testnet to record certificate issuance events. The application uses a blockchain library (such as Ethers.js or Web3.js) to interact with the smart contract and the blockchain. Using Polygon’s testnet allows for fast, low-cost transactions using test MATIC (also referred to as “POL” on the new testnet) and provides a public ledger that anyone can verify independently.
•	Cloud Storage & Services: Firebase Cloud Storage (via Firebase Admin SDK) – The backend uses Google Firebase’s services for storing files, particularly institution logos (and potentially certificate PDFs if needed). The Firebase Admin SDK enables the server to upload files to a secure bucket and retrieve them when needed. This provides scalability and ease of file management, avoiding the need to store binary files in the Git repo or on the local server filesystem.
•	Authentication & Security:
•	Token-based Auth: The backend likely uses JSON Web Tokens (JWT) for authenticating API requests. On login, the server issues a JWT signed with a secret key, and the client stores it (e.g., in localStorage or an HTTP-only cookie) and includes it in subsequent requests to protected endpoints.
•	Password Hashing: User passwords are hashed (using bcrypt or a similar library) before storage in the database, to ensure account security even if the database were compromised.
•	Input Validation: The backend uses validation libraries (like express-validator or Yup/Zod) to ensure data integrity for incoming requests (e.g., valid email format for registration, required fields present, file size limits, etc.).
•	Cryptography: The Node.js Crypto module (or equivalents) is used for computing SHA-256 hashes of certificates. Digital signature techniques can be used for signing data (for example, the institution’s private key on the blockchain might sign the certificate hash).
•	File Uploads: For handling file uploads in the Express server, libraries like Multer are used to parse multipart/form-data requests (for receiving certificate files or logos from the frontend). Uploaded files are processed (hashed, and then forwarded to Firebase storage or processed as needed).
•	Development Tools:
•	TypeScript: Used on the frontend (and optionally on the backend) for static typing.
•	ESLint and Prettier: These tools may be configured to maintain code quality and formatting consistency across the project.
•	Git & GitHub: Version control for the codebase, allowing collaboration and tracking changes.
•	VSCode + Extensions: (Developers likely used a code editor with relevant extensions for React/TypeScript development.)
•	Deployment and Build:
•	The frontend is built into static assets (HTML/CSS/JS) by Vite for production, which can be deployed on a static hosting service or served by the backend.
•	The backend can be containerized with Docker or run on a Node server environment. For production, environment variables and a process manager like PM2 or Docker Compose might be used to ensure the app runs continuously.
•	The separation of frontend and backend allows each to be scaled independently or even hosted on different services (e.g., frontend on Netlify/Vercel, backend on Heroku/AWS).
•	Testing: (If implemented) The project might include some unit or integration tests. For instance, using Jest or Mocha/Chai for backend testing of API routes and React Testing Library for frontend component testing. (This ensures that critical functionality like the hashing and verification logic works as expected.)
By using this tech stack, Graphene achieves a balance between modern web app performance (thanks to React+Vite) and robust backend capabilities (Node/Express with a relational database and blockchain connectivity). The inclusion of blockchain and Firebase showcases an integration of decentralized tech with cloud services, resulting in a cutting-edge yet practical system.
Prerequisites for Local Development
Before setting up Graphene on your local machine, ensure you have the following prerequisites installed and configured:
•	Node.js (and npm): Install Node.js (version 18 LTS or above is recommended for compatibility). This will also install npm, the Node package manager. Verify by running node -v and npm -v in your terminal.
•	PostgreSQL Database: Install PostgreSQL and ensure it's running. You should set up a database for Graphene (e.g., create a database named graphene) and have the credentials (host, port, username, password) ready. You can download PostgreSQL from the official site or use a cloud-hosted PostgreSQL instance. Ensure you can connect to the database (for example, via psql or a DB client) before proceeding.
•	Firebase Account (for Admin SDK): You will need access to a Firebase project to use Firebase Cloud Storage for file uploads:
•	Create a Firebase project (via the Firebase Console).
•	Enable Cloud Storage in that project (a default storage bucket is usually created).
•	Generate a Service Account Key JSON for the Firebase Admin SDK: In Firebase console, go to Project Settings > Service Accounts and click "Generate new private key". This will download a JSON file containing credentials.
•	Polygon Testnet Access: For the on-chain features:
•	Set up a Polygon wallet/account (you can use MetaMask or any Ethereum wallet to generate an account).
•	Obtain the private key of a test account (for development, you can use a burner account—never use a real mainnet private key or one with real funds in a development environment).
•	Get test tokens (MATIC on Polygon Amoy testnet) for your account from a faucet. For example, use the official Polygon faucet and select the Amoy testnet to fund your account with test MATIC (also called “POL” on this testnet). You’ll need a small amount of testnet MATIC to pay for gas fees when writing to the blockchain.
•	Note the Polygon RPC URL for the Amoy testnet. The official RPC endpoint is https://rpc-amoy.polygon.technology/, and the chain ID is 80002. You can use this RPC or an alternative provider (Alchemy, Infura, etc.) that supports Polygon’s testnet.
•	Graphene’s smart contract address (if the contract is pre-deployed) – If the project includes a pre-deployed smart contract for certificate records, you’ll need its address and possibly the ABI definition. (This might be included in the repository or provided in configuration.)
•	Development Tools:
•	A terminal or command prompt for running commands.
•	A code editor like VS Code (optional, but helpful for exploring or modifying the project).
•	Git if you plan to clone the repository from a remote source like GitHub.
•	Other Services (optional):
•	Mail Server: If the project sends email notifications (for example, using NodeMailer or a third-party email API), you might need SMTP credentials or API keys. (Check the environment variables section to see if email configurations are present.)
•	Cloud Services: If the project is configured to use any other APIs (for example, Google Maps API for institution location verification or similar), have those API keys ready. (Not expected unless mentioned explicitly.)
Make sure all the above components are properly installed and that you have the necessary credentials (database, Firebase key, blockchain RPC URL, private key, etc.) before moving to installation. Having these prerequisites ready will ensure a smooth setup process for Graphene.
Installation and Setup
Follow these steps to set up the Graphene project on your local machine for development and testing. The project is divided into two main parts – the backend (server) and the frontend (client). You will need to install and configure each part:
1. Clone the Repository
First, obtain the source code. If you have not already, clone the Graphene repository from GitHub (or your source control):
git clone https://github.com/your-username/graphene.git
(Replace the URL with the actual repository URL if different.)
Then navigate into the project directory:
cd graphene
The repository should contain two main folders (e.g., frontend and backend) among other files.
2. Backend Setup (Node.js + Express)
Navigate to the backend directory and install dependencies:
cd backend
npm install
This will download all required Node packages for the server (Express, Firebase admin, database client, etc.).
Configuration: Before running the backend, create a configuration file for environment variables: - Duplicate the provided example environment file (if one exists, e.g., .env.example) and rename it to .env, or create a new .env file in the backend/ directory. - Open .env in a text editor and set the required variables (see Environment Variables section below for a detailed list). At minimum, you need to configure: - Database connection settings (e.g., DB host, name, user, password). - Firebase credentials (either path to the service account JSON or the key values). - Polygon RPC and account credentials (RPC URL, contract address, private key). - JWT secret or any other secret keys. - Database Setup: Ensure your PostgreSQL database is running. If you haven’t created a database for Graphene, do so now (for example, create a database named graphene). Update the .env with the database name and credentials. The app may be configured to automatically run migrations or initialize tables on launch, but if a SQL migration script or ORM migration command is provided, run that to create the necessary tables: - For example, if using Prisma: run npx prisma migrate dev (or prisma db push) to apply the database schema. - If using Sequelize and migrations are included, run npx sequelize db:migrate. - If no migration tool is used, check the project documentation for any SQL scripts or the code for table definitions. You might need to manually create tables according to the schema (see folder structure or documentation for hints). - Firebase Service Account: Take the Firebase service account JSON you obtained and save it in a secure location (e.g., save it as serviceAccountKey.json in the backend folder, but do not commit it to source control). In the .env, set the path to this file or its contents (details in Environment Variables section).
Starting the Backend (Development Mode): Once configured, start the Express server. In development, it's useful to use nodemon (which might be installed as a dev dependency) to auto-restart on code changes:
npm run dev
This might run nodemon (as defined in package.json) which will start the server (for example, on localhost:5000 or a port specified in the environment). If there is no dev script, you can start the server with:
node index.js
(Or whatever the main file is, such as server.js or dist/index.js if compiled from TypeScript.)
After starting, you should see a log in the console indicating the server is running (e.g., “Server listening on port 5000”). The backend is now ready to accept API calls.
3. Frontend Setup (Vite + React)
Open a new terminal and navigate to the frontend directory:
cd frontend
npm install
This installs all React app dependencies (React, Vite, etc.).
Configuration: Create an environment file for the frontend. Vite uses environment variables prefixed with VITE_. Typically, you'll have a .env or .env.development in the frontend/ directory. For development, you might set variables like:
•	VITE_API_URL – the base URL where the backend API is running. For example, in development, if your backend runs on port 5000 locally, you might set VITE_API_URL=http://localhost:5000. This allows the front-end to make API calls to the correct address. In production, this could be the URL of your deployed server or simply “/api” if served on the same domain.
•	Any other front-end specific configs (if the project uses any third-party API keys for front-end use, or feature flags, those would be here). Often, for our use case, the main one is the API URL and maybe things like a Google Maps API key if showing maps, etc., but not likely needed here.
Create or update the frontend/.env file with the appropriate values. (There might be an example file like frontend/.env.example to follow.)
Starting the Frontend (Development Mode): Use Vite’s development server to run the React app locally:
npm run dev
Vite will start the dev server (by default on port 5173). The terminal will show a local dev URL (something like http://localhost:5173/). Open that address in your web browser. You should see the Graphene web application interface loading. In development, the front-end will proxy or use the VITE_API_URL for API calls to reach the backend.
Now you have both backend and frontend running in development mode. You can log in or register on the front-end and the requests should hit your local backend.
4. Running Both Servers Concurrently (optional)
During development, it’s often convenient to run both the backend and frontend simultaneously. If you prefer a single-step approach and the repository is configured for it, you might find a root-level script or use tools like concurrently. For example, the project might have a root package.json script like:
npm run dev
which uses concurrently to run npm --prefix backend dev and npm --prefix frontend dev together. Check the documentation or package.json. If such a script exists, you can use it from the root directory to launch both servers with one command. Otherwise, continue running each in its own terminal.
(Note: Running both is only for convenience. The frontend and backend can be started/stopped independently as needed.)
5. Verify the Setup
Once both parts are running: - Visit the React app in your browser (likely http://localhost:5173). - Try registering a new institution, or use provided test credentials if any exist (sometimes projects include a seed user or you may have to register manually). - Check the backend logs for any errors. If the backend prints a database connection success message and doesn’t crash, it’s a good sign. - If you attempt an action like registration or certificate upload, watch the backend console for logs or error messages. This can help identify if any configuration (like DB or Firebase) is not correct.
If everything is configured correctly, you should be able to navigate through the app: register/log in as an institution, upload a certificate, and then use the verification page to verify it (you might need to copy the Certificate ID that is generated).
6. Additional Setup (Optional)
•	Database Migrations/Seeding: If the project includes a way to seed the database with initial data (like some example institutions or certificates), follow those instructions (e.g., running npm run seed if available). This can be helpful to explore the app with pre-populated data.
•	Smart Contract Deployment: If you intend to deploy your own instance of the smart contract to the Polygon testnet (rather than using the one provided), you might need to:
•	Compile the Solidity contract (e.g., using Hardhat or Truffle configuration if included).
•	Deploy it to Amoy testnet (make sure your wallet has test MATIC). Tools like Hardhat can deploy using the provided RPC and private key.
•	Update the contract address and ABI in the backend config so the app uses your deployed contract.
•	This is only necessary if you plan to modify the contract or run your own; otherwise, using the pre-deployed contract address provided by the project is sufficient.
•	Firebase Emulators (optional): If you prefer not to use real Firebase during local development, you could set up Firebase emulators for storage. However, this requires additional configuration and is only recommended for advanced usage. For straightforward development, using the real Firebase project (with a test bucket) as configured is fine.
With the installation complete, you can proceed to use the Graphene platform locally. Next, we will detail the environment variables and configuration needed, how to run the servers in production mode, and the available API routes for functionality.
Environment Variable Configuration
Graphene requires several environment variables to be set for proper operation. These are divided between the backend and frontend. This section lists the important configuration options and their purpose. It’s crucial to set these in your .env files before running the application.
Backend Environment Variables (.env for Express server)
Create a file named .env in the backend/ directory with the following variables (the actual names might vary; adapt to match those expected by the codebase or the provided .env.example):
# Server Configuration
PORT=5000               # Port on which the Express server will run (default 5000 or as desired)
NODE_ENV=development    # Node environment (development or production)

# PostgreSQL Database Configuration
DB_HOST=localhost       # Host where the database is running
DB_PORT=5432            # Port for the database (5432 is default for Postgres)
DB_NAME=graphene        # Name of the PostgreSQL database
DB_USER=postgres        # Database username (ensure this user has access to the DB)
DB_PASSWORD=your_db_password   # Database password for the above user

# Alternatively, you can use a single DATABASE_URL instead of the above, in the format:
# DATABASE_URL=postgres://user:password@host:5432/graphene

# JWT Authentication
JWT_SECRET=your_jwt_secret_key   # Secret key for signing JWT tokens (choose a strong random string)

# Firebase Admin SDK (for file uploads)
FIREBASE_PROJECT_ID=your_firebase_project_id      # Firebase project ID
FIREBASE_CLIENT_EMAIL=your_service_account_email  # Service account email from the JSON
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nABC...123\n-----END PRIVATE KEY-----\n"  
# The private key from the service account JSON. 
# IMPORTANT: If your private key contains newline characters, format them as \n within the string.

# Firebase Storage
FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com   # The default storage bucket URL

# Blockchain / Polygon Configuration
POLYGON_RPC_URL=https://rpc-amoy.polygon.technology/    # RPC endpoint for Polygon Amoy testnet
POLYGON_CHAIN_ID=80002                                  # Chain ID for Amoy (80002)
CONTRACT_ADDRESS=0xYourSmartContractAddress             # Deployed contract address for certificate records
POLYGON_PRIVATE_KEY=your_wallet_private_key             # Private key of the blockchain account to sign transactions

# (Optional) Additional Configs
# If the smart contract ABI is loaded from a file, ensure that file is accessible (or embed ABI in code).
# If using an Alchemy/Infura RPC instead of the public RPC, you can set that URL here.
# If email notifications are enabled:
# SMTP_HOST=...
# SMTP_USER=...
# SMTP_PASS=...
# (and so on for any mailing service)
Notes on the above configuration:
•	Do not commit the actual .env file to version control as it contains sensitive information (passwords, private keys).
•	Database variables: Ensure these match your local Postgres setup. If you prefer a single connection string (DATABASE_URL), make sure the code is set up to use it.
•	JWT_SECRET: Set a random string; this is used to sign tokens for authentication. In production, treat this like a password.
•	Firebase variables: These are derived from the Firebase service account JSON. You can either:
•	Provide them individually as above (project ID, client email, private key, and storage bucket).
•	Or set GOOGLE_APPLICATION_CREDENTIALS to the path of the service account key file (e.g., GOOGLE_APPLICATION_CREDENTIALS=./serviceAccountKey.json). The code might then load credentials automatically from that file. Check how the code initializes Firebase; some implementations use the environment variables directly, others prefer the file.
•	Private Key Formatting: The private key in the JSON has line breaks. In a .env file, you need to replace actual newlines with \n. As shown above, wrap the key in quotes and use \n where line breaks would be. Be careful to get the exact format correct (including the BEGIN and END lines with the newlines).
•	Blockchain variables:
•	POLYGON_RPC_URL can be the public Polygon Amoy RPC or a custom one. If using a service like Infura or Alchemy, use the URL they provide for the Polygon testnet.
•	CONTRACT_ADDRESS is the address of the smart contract deployed on the Polygon testnet that Graphene will interact with. This should be provided by the project. If you deployed the contract yourself, put that address here.
•	POLYGON_PRIVATE_KEY is the private key (in hex format, without the 0x prefix, or however your library expects it) of the account that will send transactions. This account should have test MATIC (check by visiting Amoy Polygonscan or using a wallet).
•	It’s a good idea to double-check that the account’s public address has been whitelisted or recognized in the contract if needed (some contracts might only allow certain issuers; if this is a general open contract, not an issue).
•	Additional configs: If the project uses any other environment variables (for example, file paths, toggle for using blockchain or not, etc.), set them accordingly. Refer to any documentation or comments in code for any variables not listed here.
Frontend Environment Variables (.env for React app)
In the frontend/ directory, create a .env file for the React application. Variables here must start with VITE_ to be exposed to the client code. Common variables include:
VITE_API_URL=http://localhost:5000       # Base URL of the backend API in development.
VITE_APP_NAME=Graphene                   # (Example) App name to display, if used.
# VITE_PUBLIC_FIREBASE_CONFIG (if the front uses any Firebase SDK directly, which is unlikely in this case since upload is via backend)
# ... any other public config
Explanations: - VITE_API_URL is used in the React code to prefix API calls. For instance, an API call in code might target ${import.meta.env.VITE_API_URL}/api/auth/login. In a dev environment, you’d point this to your local backend. In production, you might set this to the production domain or omit it if the frontend is served by the backend (in that case, it could just be an empty string or /). - If the front-end does not need any special config (some projects hardcode the relative paths for APIs), this variable might not even be needed. It’s included for completeness in case the React app expects it. - Generally, you wouldn’t include secrets in frontend env (since they become visible to users). Graphene likely doesn’t require any secret on the frontend – all secrets (private keys, API keys) are on the backend. So, things like Firebase API keys or Google Analytics keys would be here if used, but in our scenario, Firebase is only used on the server side via Admin SDK.
After setting up the environment files, rebuild or restart your applications if they were running. The backend will pick up new env vars on restart, and the frontend needs to be restarted or rebuilt to include any changes to its env.
Running the Servers (Development & Production)
With everything installed and configured, here’s how to run Graphene in different modes:
Running in Development
For development, as described in installation:
•	Backend (Dev Mode): Use npm run dev inside the backend folder. This usually uses nodemon to watch for file changes and restart automatically. The server will run in development mode (often with more verbose logging and not minified).
•	Frontend (Dev Mode): Use npm run dev inside the frontend folder. This starts the Vite development server with hot module reloading. The React app will be accessible at the URL shown in the terminal (default localhost:5173).
During development, keep two terminals open (one for each). You can edit code on either side and see changes: backend changes will restart the server, frontend changes will hot-reload in the browser.
Check the browser console and terminal output for any errors or warnings and address them accordingly.
Running in Production
When you're ready to simulate a production environment (or to actually deploy):
1. Build the frontend:
In the frontend/ directory, run:
npm run build
This will create an optimized production build of the React app. By default, the output will be in frontend/dist/ (a directory containing index.html and static assets). These are the files you can deploy to a static server or serve via Express.
2. Configure the backend for production:
•	Set NODE_ENV=production in the backend environment (and adjust any production-specific settings, like enabling security features or different logging).
•	Ensure the backend knows how to serve the frontend in production (if you choose to serve the static files from Express). For example, the Express app might have a configuration to serve files from a client or dist folder. You might need to copy the frontend/dist content into a folder that the backend can serve, or adjust the backend code to use the correct static folder.
•	If the repository is set up with the frontend and backend separate, one common approach is to deploy them separately. Alternatively, you could integrate by placing the build files into the backend. Check if there is any script or instructions for that (some projects have a npm run build:full that builds the front and moves it into the back).
•	If you want a quick integration for local testing: one simple way is to use Express to serve the dist folder. For example, you could add in the backend code:
 	app.use(express.static(path.join(__dirname, '../frontend/dist')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});
 	This will catch all routes and return the React app’s entry point, enabling client-side routing to work. Make sure to import path and adjust the path as needed. This way, you can run just the backend server and it will serve the API and the frontend together on the same port.
•	Double-check that all required production environment variables are set (they might be the same as dev, except maybe using a different database or turning off certain dev-only settings).
3. Start the backend in production mode:
From the backend directory, install any production dependencies (already done via npm install earlier) and then run:
npm start
By convention, npm start might be mapped to something like node index.js or node server.js. This starts the server without the development overhead (no live reload, etc.). The server should run on the specified PORT, serving both API and static files (if configured as above).
4. Access the production build:
Open a browser and go to http://localhost:5000 (or the port you set). You should see the React app loading, but now it’s served by Express. All API calls from the app should go to the same domain (no CORS issues) and you can test the functionality as an end user would.
Alternate Production Setup:
If you plan to deploy the front-end separately (say on a service like Netlify or GitHub Pages) and the backend on a server (Heroku, AWS, etc.), then: - Deploy the frontend/dist contents to your static hosting (ensuring the API URL is set to your backend’s URL in the build). - Deploy the backend to your server environment, and configure environment variables on the server accordingly. - Make sure to enable CORS on the backend to allow the frontend domain to access the APIs, if they are on different domains.
Testing Production Build Locally:
After building, you can also test the static files by using a tool like serve:
npm install -g serve
serve -s dist
This will serve the dist folder on a local port and you can check that the static files are working. But note that if your API is still on a separate port, you might face CORS or need to adjust the VITE_API_URL for that test. The integrated approach via Express is often simpler.
Environment-specific Behavior:
In production mode, ensure that any dev-only features (like verbose logging or test endpoints) are disabled. Also, ensure that your application is secure: - If deploying publicly, use HTTPS. - Set appropriate CORS policies on the server (during development, you might allow all origins; in production, restrict to your domain). - If using any keys (like the private key for blockchain) on a deployed server, guard them carefully and never expose them client-side.
By following these steps, you can run Graphene in both development and production scenarios. Now, with the application running, let's outline the API routes provided by the backend and how they can be used for various operations.
API Route Documentation
The Graphene backend exposes a RESTful API for all its core functionalities: user authentication, certificate issuance, verification, etc. Below is a documentation of the key API endpoints, including their purpose, request formats, and expected responses. Use this as a reference when integrating with the backend or testing the system via tools like Postman or curl.
Base URL: In development, the base URL is typically http://localhost:5000/api. In production, it would correspond to the deployed server’s URL (e.g., https://your-domain.com/api). We’ll omit the base in the paths below for brevity.
Authentication & User Accounts
•	POST /api/auth/register – Register a new issuing institution.
Description: Allows a new institution to sign up for an account. This could be a university, college, or organization that will issue certificates.
Request: multipart/form-data (if uploading a logo during registration) or JSON. Expected fields:
•	name: (string) Name of the institution (e.g., "Graphene University").
•	email: (string) Official email address for the account (used as login username).
•	password: (string) Password for the account.
•	logo: (file, optional) Institution logo image file. If provided, the logo will be uploaded via Firebase and linked to the account.
•	Other details: Possibly address, contact person, etc., if the platform collects them. Response: JSON containing the created institution’s public details. For example:
 	{
  "success": true,
  "data": {
    "issuerId": "ISSUER12345",
    "name": "Graphene University",
    "email": "registrar@graphene.edu",
    "logoUrl": "https://storage.googleapis.com/yourbucket/logos/graphene_univ.png",
    "createdAt": "2025-10-01T12:34:56Z"
  }
}
 	The issuerId is the unique identifier assigned (perhaps an auto-generated code). This is important for others to recognize the issuer. On errors (like email already in use), a corresponding error message will be returned with success: false.
•	POST /api/auth/login – Authenticate an institution (login).
Description: Logs in an existing institution user and returns an authentication token.
Request: JSON with credentials:
 	{
  "email": "registrar@graphene.edu",
  "password": "your_password"
}
 	Response: On success, returns a JSON with an auth token and user info:
 	{
  "success": true,
  "token": "<JWT_TOKEN>",
  "data": {
    "issuerId": "ISSUER12345",
    "name": "Graphene University",
    "email": "registrar@graphene.edu",
    "logoUrl": "https://.../graphene_univ.png"
  }
}
 	The token is a JWT that must be included in future requests (e.g., in the Authorization header as Bearer <token>) to access protected endpoints. If login fails (wrong credentials), you get an error with success: false and message.
•	GET /api/auth/profile – Get current logged-in institution profile.
Description: (Protected – requires JWT) Returns the details of the currently authenticated institution (based on the token provided). Useful for checking login status and retrieving profile info on the frontend.
Request: No body. Just send the JWT in Authorization header.
Response: Similar structure to registration, returning institution info. e.g.:
 	{
  "issuerId": "ISSUER12345",
  "name": "Graphene University",
  "email": "registrar@graphene.edu",
  "logoUrl": "...",
  "verified": true,
  "createdAt": "2025-10-01T12:34:56Z"
}
 	(The verified field could indicate if the platform admin has verified the institution’s identity, if that feature exists.)
•	PUT /api/auth/profile – Update profile information.
Description: (Protected) Allows an institution to update its profile details, like name or logo.
Request: Could be multipart/form-data if updating the logo, or JSON if just updating text fields:
 	{
  "name": "New Name of Institution",
  // possibly other fields, but email likely not changeable for login
}
 	plus a logo file if changing the logo.
Response: Updated profile data, similar to GET profile.
(Note: Some projects combine profile update under the /auth routes or have a separate /institutions route. The exact path may vary. The above assumes a straightforward implementation.)
Certificate Issuance (for Issuers)
These endpoints are for the issuing institution to manage certificates. They require authentication via JWT.
•	POST /api/certificates – Issue a new certificate.
Description: (Protected) Allows an issuer to upload and record a new certificate. This involves storing the certificate data in the database and on the blockchain.
Request: multipart/form-data with fields:
o	recipientName: (string) Name of the person receiving the certificate.
o	recipientEmail: (string, optional) Email of the recipient (could be used for notification).
o	certificateTitle: (string) Title or type of certificate (e.g., "Bachelor of Science, Computer Science").
o	certificateFile: (file, required) The actual certificate document (PDF or image) to be uploaded.
o	additionalInfo: (string, optional) Any additional metadata (like grade, honors, etc., or a JSON string of metadata).
o	(The issuer’s identity is derived from the auth token; no need to include Issuer ID in the payload.) Process: When this request is received, the backend will:
o	Validate the input fields.
o	Save the file (for example, to a temporary location or directly hash it in memory).
o	Compute the SHA-256 hash of the certificate file.
o	Generate a unique certificateId (which acts as a secret verification code for this certificate). This might be a random UUID or a hash combined with an ID. This certificateId should be stored and later given to the certificate recipient securely.
o	Store the certificate record in the Postgres database (including fields like issuerId (from token), certificateId, recipientName, hash, etc.).
o	Interact with the blockchain: use the configured Polygon account to send a transaction to the smart contract or a specific method, including the relevant details (could be certificateId, hash, and issuerId or an index). This will create an on-chain record. The transaction hash or confirmation is awaited.
o	Upload the certificate file to storage (this step is optional—some implementations might not store the full file, only the hash and metadata. If storing, it could be to Firebase or local disk).
o	Return a response once all above are successful. Response: JSON indicating success or failure. On success, it may return the certificate’s details:
 	{
  "success": true,
  "data": {
    "certificateId": "CERT-XYZ-123456",   // the unique code for verification
    "issuerId": "ISSUER12345",
    "recipientName": "Alice Doe",
    "certificateTitle": "Bachelor of Science, Computer Science",
    "hash": "e3b0c44298fc1c149afbf4c8996fb924..." , // SHA-256 hash of the file
    "transactionId": "0xabc123...789",    // blockchain transaction hash or ID
    "issuedAt": "2025-10-02T09:00:00Z"
  }
}
 	The certificateId is important to note down (the issuer should communicate this to the certificate owner). The transactionId can be used to look up the record on Polygon’s explorer (amoy.polygonscan.com) for independent verification.
On failure (e.g., missing fields, or blockchain transaction failed), success: false with an error message will be returned. The operation should ideally be atomic (if blockchain step fails, the database entry might be rolled back or marked invalid).
•	GET /api/certificates – List certificates issued by the logged-in institution.
Description: (Protected) Retrieves all certificates that the authenticated issuer has issued. Useful for the issuer’s dashboard to see a history of issued documents.
Request: No body (just need auth token). Could allow query parameters for pagination or filtering (e.g., ?limit=50&page=2).
Response: JSON list of certificates. For example:
 	{
  "success": true,
  "data": [
    {
      "certificateId": "CERT-XYZ-123456",
      "recipientName": "Alice Doe",
      "certificateTitle": "Bachelor of Science, Computer Science",
      "issuedAt": "2025-10-02T09:00:00Z"
    },
    {
      "certificateId": "CERT-ABC-789012",
      "recipientName": "Bob Smith",
      "certificateTitle": "Master of Business Administration",
      "issuedAt": "2025-10-10T15:30:00Z"
    }
    // ... more records
  ]
}
 	(The list might not include the hash or other sensitive details for brevity. Those could be available in a detail endpoint.)
•	GET /api/certificates/:certificateId – Get details of a specific certificate.
Description: (Protected, but possibly issuers only or open to verifiers if restricted by code) Fetches the full details of a single certificate by its ID. An issuer would use this to view the certificate details they issued.
Request: Provide the certificateId in the URL.
Response: JSON with all details, possibly including:
 	{
  "certificateId": "CERT-XYZ-123456",
  "issuerId": "ISSUER12345",
  "issuerName": "Graphene University",
  "recipientName": "Alice Doe",
  "recipientEmail": "alice@example.com",
  "certificateTitle": "Bachelor of Science, Computer Science",
  "hash": "e3b0c44298fc1c149afbf4c8996fb924...",
  "transactionId": "0xabc123...789",
  "issuedAt": "2025-10-02T09:00:00Z",
  "verifiedOnChain": true   // maybe a flag indicating the blockchain record is present
}
 	If the certificateId is not found or not owned by the requesting issuer, an error is returned (or 404 not found).
(Note: The endpoints might have different naming or structure depending on implementation, but above is a typical REST style. Some projects might have /api/issuer/certificates or similar namespacing.)
Certificate Verification (for Verifiers)
These endpoints are generally open (not requiring authentication), because verification is intended for third parties who might not have accounts on the system. However, to prevent abuse, rate limiting or captcha might be used in a real system.
•	POST /api/verify – Verify a certificate’s authenticity.
Description: Allows anyone to verify a certificate by providing the required information. The system will cross-check the database and blockchain to determine validity.
Request: This can be a multipart/form-data if allowing file upload, or JSON if verifying by IDs only. Possible inputs:
o	issuerId: (string, required) The unique Issuer ID of the institution that purportedly issued the certificate. (This is often printed on the certificate or known from the certificate holder or the public registry.)
o	certificateId: (string, required) The unique Certificate ID/code associated with the certificate (provided by the certificate holder, often printed on the certificate or given separately).
o	certificateFile: (file, optional) The certificate document file. If provided, the system will compute its hash to verify content integrity.
o	Alternatively to certificateFile, some systems allow providing a hash directly if the verifier already has it, but uploading the file is user-friendly. Behavior: The backend will:
o	Find the issuer by issuerId and ensure that issuer is verified/trusted.
o	Look up the certificate record by the combination of issuer and certificateId (and possibly recipient info if that was required, but in our design, certificateId is unique enough, likely globally unique or at least unique per issuer).
o	If not found, return a "Certificate not found" response.
o	If found, and if a file was uploaded, compute its SHA-256 hash and compare it to the stored hash for that certificate. If they differ, it means the provided file is not the original issued file (either tampered or a wrong file).
o	Optionally, cross-verify on the blockchain: fetch the certificate’s hash stored in the smart contract for that certificateId/issuer, and ensure it matches the stored hash. This double-checks that the database hasn’t been tampered with and that the issuance was indeed recorded on chain.
o	Determine verification status:
o	If all checks pass (record exists, issuer matches, hash matches, blockchain record exists and matches), result is "Valid".
o	If any check fails (e.g., hash mismatch, or certificateId not found, or issuer not recognized), result is "Invalid" or "Verification failed".
o	(Optional) If verification is successful, the system might log this verification attempt for auditing. Response: A JSON with verification result. For example:
 	{
  "success": true,
  "data": {
    "isValid": true,
    "issuerName": "Graphene University",
    "issuerId": "ISSUER12345",
    "recipientName": "Alice Doe",
    "certificateTitle": "Bachelor of Science, Computer Science",
    "issuedAt": "2025-10-02T09:00:00Z",
    "verifiedAt": "2025-11-01T14:20:00Z",
    "onChainVerified": true
  }
}
•	isValid: true indicates the certificate passed all checks. If false, the data might indicate which check failed or simply say not valid.
•	The returned data includes the certificate’s details (as stored in the system) so the verifier can cross-reference them with the physical certificate. For example, the recipient name and title returned here should exactly match what’s on the certificate file. If a fraudulent certificate had altered the name or degree, the verifier would notice a discrepancy.
•	onChainVerified: true means the record was also found on the blockchain, providing extra assurance. If false, it could mean the blockchain step failed or wasn’t done, which might be a warning sign (or if the system was in a mode that not all certificates are on chain, it might still consider DB valid – but in Graphene’s design, onChain should be true for all issued certificates).
•	If success is false, an error message field might explain (e.g., "Certificate not found", "Hash mismatch - document may be altered", etc.).
•	GET /api/institutions – Get list of verified institutions (issuers).
Description: (Public) Returns the list of all institutions registered and verified on the platform. Verifiers may use this to confirm an Issuer ID or to browse participating issuers.
Request: None (or could support query filters like name search).
Response: For example:
 	{
  "institutions": [
    {
      "issuerId": "ISSUER12345",
      "name": "Graphene University",
      "logoUrl": "https://.../graphene_univ.png",
      "verified": true,
      "joinDate": "2025-10-01"
    },
    {
      "issuerId": "ISSUER67890",
      "name": "Example Institute of Technology",
      "logoUrl": "https://.../eit_logo.png",
      "verified": true,
      "joinDate": "2025-09-10"
    }
    //...
  ]
}
 	Only public information is included. If an institution is not yet verified by admin, it might be either excluded or marked as verified: false depending on the design.
•	GET /api/certificates/verify – (Alternate usage) Verify via query parameters.
Description: Some implementations allow a GET request for verification for ease of use or linking (e.g., a certificate’s QR code might point to a URL that hits this endpoint with query params). For example:
GET /api/certificates/verify?issuerId=ISSUER12345&certificateId=CERT-XYZ-123456
Without the file, this can only do partial verification (it checks existence and ownership but not content integrity). The response might then redirect or display a simple message.
In Graphene’s case, primary verification is via the POST route with file, but if a GET exists, it might just tell whether a cert ID is valid and issued by an issuer (assuming if someone scans a QR code on a certificate, it could return a page that says “Valid certificate issued to [Name] on [Date]” but ideally it would require the secure code as well). This is an optional route, included if such functionality was implemented.
Headers & Auth: For protected routes (anything under /auth/* and issuing certificate routes), include the JWT token in the Authorization header:
Authorization: Bearer <token>
Response Formats: All endpoints generally return JSON. A success flag and either data or error message is common. The exact format might vary, but the examples above give an idea.
Error Handling: Common HTTP statuses: - 400 Bad Request for missing/invalid parameters (often with a JSON error describing the issue). - 401 Unauthorized if token is missing or invalid. - 403 Forbidden if trying to access a resource you shouldn’t (e.g., an issuer trying to view another issuer’s certificate). - 404 Not Found if a resource doesn’t exist (e.g., no such certificate). - 500 Internal Server Error for unexpected issues (the response may contain a generic message, and the server logs would have details).
Using the API
During development, you can test these endpoints using tools like Postman, curl, or the built-in Swagger/OpenAPI UI if the project provided one.
For example, to test certificate issuance: 1. Log in via /api/auth/login to get a token. 2. Use the token to call /api/certificates with form-data (most tools allow attaching a file easily) to simulate uploading a certificate. 3. Observe the response, then test verification by taking the returned certificateId and using /api/verify with the file.
When integrating the front-end, these endpoints correspond to actions in the UI: - The registration form calls /api/auth/register. - The login form calls /api/auth/login. - After login, the dashboard likely calls /api/certificates (GET) to list certificates. - The “issue certificate” form calls /api/certificates (POST) to upload a new one. - The verification page calls /api/verify (POST) when the user submits the verification form.
Understanding these routes will help in debugging issues and extending functionality. Next, we discuss how Graphene’s on-chain component works and what blockchain-related configurations are necessary.
On-Chain Interaction (Polygon Integration)
One of the distinguishing aspects of Graphene is its integration with the Polygon blockchain (Amoy testnet) to record and verify certificates on an immutable ledger. This section explains how that integration works, what smart contract or blockchain logic is involved, and what credentials or setup you need to ensure it functions correctly.
What Happens On-Chain?
When a certificate is issued in Graphene, aside from saving the details in the PostgreSQL database, the backend performs a blockchain transaction. Specifically, Graphene uses a smart contract on Polygon (Amoy testnet) to log certificate issuance. The on-chain record typically includes: - Issuer Identifier: A representation of the issuer (e.g., the Issuer ID or perhaps the issuing wallet address). - Certificate Hash: The SHA-256 hash of the certificate file (or a hash of important data from it). This acts as a fingerprint of the document. - Certificate ID: The unique ID/code of the certificate (to tie it to off-chain records or for lookup). - Possibly Recipient Identifier: Some systems include a hashed recipient detail or an index.
The exact data and method depend on the smart contract’s design. A simple approach is a contract that has a function like issueCertificate(issuerId, certId, hash) which emits an event or stores the info on-chain. Verifiers could then query the contract (or event logs) to independently verify that a certificate with that hash was issued by that issuer.
Smart Contract: The project likely includes a Solidity smart contract (something like CertificateRegistry.sol). It might: - Maintain a mapping of certificate IDs to their hash and issuer. - Or emit an event upon issuance which is picked up when needed. - Possibly enforce that only authorized addresses (like the issuer’s address or the platform’s address) can call the issuance function.
For development, this contract is deployed on the Polygon Amoy testnet (chain ID 80002). Amoy testnet requires using the Sepolia testnet for finality, but as a developer you mostly just care that it behaves like Ethereum and uses MATIC (POL) for gas.
Required Blockchain Credentials and Setup
To enable blockchain interactions, ensure the following are configured (as mentioned in Environment Variables):
•	RPC URL: POLYGON_RPC_URL – This should be a valid RPC endpoint to connect to the Polygon test network. The simplest is the public RPC https://rpc-amoy.polygon.technology/. Alternatively, you can use a custom endpoint from a provider (for example, Alchemy might provide https://polygon-amoy.g.alchemy.com/v2/YOURKEY). The advantage of a custom RPC is potentially more reliability or higher rate limits.
•	Chain ID: POLYGON_CHAIN_ID – Should be set to 80002 for the Amoy testnet. This is used by libraries to ensure you’re signing for the correct network.
•	Contract Address: CONTRACT_ADDRESS – The address of the deployed smart contract that the backend will call to register certificates. This contract should already be deployed on Amoy. If the project repository includes the contract source, it may also include deployment instructions or the address in a config file. If not explicitly given, you may find it in the backend code where the blockchain call is made.
•	Private Key: POLYGON_PRIVATE_KEY – The private key of the account that will initiate blockchain transactions. In Graphene, this is likely a key controlled by the platform or the issuing institution:
•	It could be that each institution has their own blockchain key (more decentralized, but then key management is tricky). If that were the case, the private key might be tied to the user account, and Graphene would prompt issuers to connect a wallet. However, since the tech stack did not mention Web3 login or MetaMask, it’s more likely that Graphene uses a single platform key to do all certificate writes on chain.
•	So, this private key likely corresponds to a dedicated “Graphene issuer” account on testnet that has been assigned to issue certificates on behalf of everyone (or perhaps the contract doesn’t restrict who can call it).
•	Ensure this account (the address derived from the private key) has sufficient test MATIC (POL) for gas fees. Each certificate issuance will cost a small amount of gas. On testnet, gas is free aside from needing the test tokens.
•	Security: Never expose this private key. In production, it should be kept in a secure config (or use a service like AWS Secrets Manager or environment variables on the server). On a testnet it's not valuable, but on mainnet it would control real funds.
•	Web3 Library: The backend likely uses Ethers.js or Web3.js. Ensure that library is installed and the code is properly connecting. You might see code like:
 	const provider = new ethers.JsonRpcProvider(process.env.POLYGON_RPC_URL);
const wallet = new ethers.Wallet(process.env.POLYGON_PRIVATE_KEY, provider);
const contract = new ethers.Contract(contractAddress, contractABI, wallet);
await contract.issueCertificate(issuerId, certId, hash);
 	(pseudocode for illustration) This means the ABI (contract interface) is needed. Often it’s imported from a JSON file (compiled output). Make sure that file is present (commonly in a artifacts or abi folder).
•	Contract ABI: If the project expects an ABI file path or JSON, ensure it's correctly referenced. If the ABI is embedded in code or not needed (some might just do low-level call), you can ignore. But typically, a contract call requires the ABI.
•	Polygon Explorer Verification: The project might provide an easy way to verify on chain. If you have the contract address and the transaction hash from issuance, you can go to Amoy Polygonscan to see the transaction and event. This is outside of the app but is a great way to demonstrate the blockchain aspect.
How Verification Uses Blockchain
During the verification process (/api/verify): - After the system finds the certificate in its Postgres DB, it can cross-check the blockchain. There are two possible ways: 1. Event Log Lookup: Query the blockchain for an event matching the certificateId or hash. If the contract emits an event on issuance (like CertificateIssued(issuerId, certId, hash)), the verifier could search events by certId and ensure the hash matches. This can be done via a provider call or a subgraph if set up. But doing on-the-fly event lookup might be slow; caching results might help. Given this is testnet and small scale, a direct lookup is fine. 2. Contract State: If the contract stores data (e.g., mapping of certId to hash), the backend can call a read-only function like getCertificate(certId) to retrieve the stored hash and issuer info from the contract, then compare to its own data. - If the blockchain confirms the existence and consistency of the record, the verification is strong. If for some reason the blockchain does not have the record (and it should), the system might flag it. Possibly Graphene’s design might trust its DB primarily and use blockchain as augment; but ideally, they go hand-in-hand.
If the project is in an academic context, it may not implement a very complex smart contract (maybe just enough to prove the concept). The emphasis is on demonstrating that a record was written to a public ledger.
Setting Up Your Own Contract (Optional)
If you fork this project and want to deploy your own contract: - You might find the Solidity code under a /contracts directory or similar. Ensure you have tools like Hardhat configured. - Update any addresses and ABIs in the code and env. - After deployment, update CONTRACT_ADDRESS in the .env to point to your contract. - Test the issuance to ensure it interacts with your contract.
Troubleshooting Blockchain Integration
•	If certificate issuance API calls are failing at the blockchain step, check the server logs for errors. Common issues:
•	“insufficient funds for gas” – the private key’s account needs more test MATIC.
•	“invalid opcode” or contract revert – possibly the contract has a require condition (like maybe it expects the sender to be a certain address or the issuerId to match something). Ensure the contract is being called correctly. Also, if the contract requires issuer to be whitelisted, maybe each institution’s address needed whitelisting (in our simplified scenario likely not).
•	Network connectivity – make sure your RPC URL is correct and not rate-limited. If using the public RPC, there might be occasional rate limits. Using a personal RPC endpoint could help.
•	Wrong chain ID – If the library complains about chain, ensure chainId is correct.
•	ABI mismatches – If the contract address or ABI is wrong, the transaction may fail or do nothing. Double-check you’re using the right contract and network.
•	If verification always shows onChainVerified: false:
•	Perhaps the app isn’t actually checking the chain due to config. Ensure CONTRACT_ADDRESS and POLYGON_RPC_URL are set in the environment that the running server sees (especially in production, sometimes env not properly loaded).
•	Or the contract call to verify is not implemented. (You might need to implement it if not done. But since it's mentioned, likely it is.)
•	Try manually querying the contract outside the app (e.g., using a block explorer or writing a quick script) to see if the data is there for a known certId.
•	If everything is properly set, the on-chain integration should augment the verification. It’s one of the key selling points of Graphene – even if someone distrusted the Graphene server, they could independently verify a certificate by checking the blockchain record.
Summary of Blockchain Credentials:
•	Testnet: Polygon Amoy (network name: polygon-amoy, chainId: 80002).
•	Token: MATIC (POL) for gas. Get from faucet.
•	Account: Use a dev account’s private key for transactions (never expose in frontend).
•	Contract: A deployed certificate registry contract’s address and ABI known to the backend.
•	Provider: RPC URL for connecting.
By combining on-chain records with off-chain storage, Graphene ensures maximal integrity. The blockchain acts as a publicly auditable log, while the database allows efficient queries and data management. This design ensures that even if an attacker tried to fabricate a certificate in the database, they couldn’t fake the corresponding blockchain entry, and vice versa – providing a robust defense against fraud.
Project Structure
Understanding the layout of the repository will help in navigating the codebase. Below is an overview of Graphene’s project structure, including key directories and files, and what they contain:
graphene/
├── backend/                     # Backend (Node.js/Express) code
│   ├── src/                     # Source code for the server (if TypeScript, might be TS files here)
│   │   ├── controllers/         # Express route handlers (business logic for each route)
│   │   ├── routes/              # Express route definitions (mapping URLs to controllers)
│   │   ├── models/              # Database models or ORM schemas (e.g., Prisma schema or Sequelize models)
│   │   ├── middleware/          # Auth middleware, file upload config (e.g., Multer), etc.
│   │   ├── services/            # Services/utilities (e.g., functions for hashing, blockchain interaction)
│   │   ├── config/              # Configuration (e.g., database connection, Firebase init, contract ABI load)
│   │   └── index.js             # Entry point of the application (initializes Express app, connects to DB, starts server)
│   ├── package.json             # Backend dependencies and scripts
│   ├── .env.example             # Sample environment variables for backend
│   └── ... (other files, e.g., README for backend if separate, or ORM config files)
│
├── frontend/                    # Frontend (React + Vite) code
│   ├── src/                     # React application source
│   │   ├── components/          # Reusable UI components (forms, navbar, etc.)
│   │   ├── pages/               # Page components corresponding to routes (Home, Login, Dashboard, Verify, etc.)
│   │   ├── services/ or utils/  # Helper functions (e.g., API client calls, auth helpers)
│   │   ├── App.tsx              # Main App component (routing setup likely here)
│   │   ├── main.tsx             # Vite entry point
│   │   └── ... (other React files)
│   ├── public/                  # Public assets (static files like images, favicon, etc.)
│   │   └── index.html           # HTML template for the React app
│   ├── vite.config.ts           # Vite configuration (defines dev server settings, etc.)
│   ├── package.json             # Frontend dependencies and scripts
│   ├── .env.example             # Sample environment variables for frontend
│   └── tsconfig.json            # TypeScript configuration for the React app
│
├── docs/ or screenshots/        # Documentation assets (if any, like images for README)
│   └── ... (maybe architecture diagrams or UI screenshots)
│
├── contract/ or smart-contracts/ (if present)
│   ├── CertificateRegistry.sol  # Solidity smart contract source
│   ├── artifacts/               # Compiled contract ABIs and bytecode
│   ├── hardhat.config.js        # Config if using Hardhat for deployment/testing
│   └── scripts/                 # Deployment or testing scripts for the contract
│
├── README.md                    # The main README documentation (you're reading a version of it)
├── package.json                 # (Optionally, if project uses a single package.json for both, or root for dev scripts)
└── .gitignore                   # Git ignore file for the repository
Key Folders and Files Explained:
•	backend/src/controllers: This likely contains files like authController.js, certificateController.js, etc., where each exports functions to handle requests (e.g., register, login, issueCertificate, verifyCertificate). Inside, they will perform tasks such as validating input, interacting with models/database, calling blockchain services, and sending responses.
•	backend/src/routes: Expect files such as authRoutes.js, certificateRoutes.js, etc. These use an Express router to define endpoints (e.g., router.post('/register', authController.register)). They might also attach middleware for authentication on protected routes.
•	backend/src/models: If using an ORM like Prisma, there might not be model classes per se, but if using Sequelize or Mongoose (if it were Mongo), you’d have model definitions. In case of Prisma, you might see a prisma.schema file in a /prisma directory instead of models. If using the pg library directly, there might be no models folder; instead, raw queries in controllers or a db.js in config.
•	backend/src/middleware: Could include authMiddleware.js to verify JWT tokens on protected routes, upload.js for Multer configuration of file uploads (e.g., limiting file size, file storage dest, etc.), and perhaps a errorHandler.js to format error responses.
•	backend/src/services: This might house utility functions like hashService.js (for hashing files), blockchainService.js (for interacting with Polygon, e.g., initiating provider, contract instance, issuing transactions), and emailService.js if emails are sent.
•	backend/src/config: Possibly contains configuration files, e.g., firebase.js to initialize the Firebase Admin SDK with the service account from env, and database.js to initialize the database connection (maybe using a library like pg or initializing an ORM client).
•	backend/index.js (or server.js): This is the main file that ties everything together. Typical tasks:
•	Load environment variables (using dotenv).
•	Initialize Express app.
•	Connect to PostgreSQL (maybe using an async connection or an ORM sync).
•	Initialize Firebase admin (if not already done in config).
•	Use Express middlewares (like JSON parser, CORS).
•	Mount routes (like app.use('/api/auth', authRoutes) etc.).
•	Error handling middleware.
•	Start the server (app.listen(PORT)).
•	frontend/src/components: For example, Navbar.tsx, LoginForm.tsx, CertificateCard.tsx etc. These are reusable pieces of UI.
•	frontend/src/pages: For example, RegisterPage.tsx, LoginPage.tsx, DashboardPage.tsx, VerifyPage.tsx. These pages likely correspond to React Router routes. The Dashboard might have sub-components or nested routes (like an Issue Certificate form).
•	frontend/src/services or api: Often, projects create a module for API calls, e.g., api.ts with functions like loginUser(credentials), verifyCertificate(data) that internally do fetch(${API_URL}/auth/login, {...}). This centralizes the API endpoints usage on the front-end.
•	frontend/public/index.html: Template that includes a root <div> where React app mounts. It might have a title like "Graphene" and maybe some meta tags.
•	screenshots/: If present, would contain images used in the README or elsewhere. If not present, you can create it to add future screenshots.
The above structure is an educated guess based on typical projects. The actual repository might differ slightly (for instance, some projects keep backend at root and frontend in a subfolder, or use a monorepo tool). Always adjust based on the actual files present.
Contribution Guidelines
Contributions to Graphene are welcome! If you would like to report a bug, request a feature, or contribute code, please follow these guidelines to help maintain consistency and quality in the project:
•	Issue Tracking: Use the GitHub Issues section to report bugs or suggest new features. Before opening a new issue, search existing issues to see if it’s already been reported or discussed. When reporting a bug, provide as much detail as possible: steps to reproduce, environment (OS, Node version, browser), and any relevant logs or screenshots.
•	Feature Requests: For new ideas, feel free to open an issue to discuss with maintainers and the community. Describe the problem your feature would solve or the use-case it would support. We welcome suggestions that align with the project’s scope (improving certificate security, user experience, etc.).
•	Fork & Pull Requests: If you want to contribute code:
•	Fork the repository to your own GitHub account.
•	Create a new branch from main (or the appropriate development branch) for your feature or fix. Use a descriptive branch name (e.g., fix/file-hash-bug or feature/add-email-notifications).
•	Make your changes in your fork. Keep the changes focused on the single issue/feature you’re addressing to simplify review.
•	Ensure the project still builds and all tests (if any) pass. If you introduced new functionality, consider adding tests for it.
•	Lint & Format: Ensure your code follows the style guidelines. We use ESLint and Prettier for consistent code style. Run npm run lint (and npm run format if available) in both frontend and backend to catch any issues before committing.
•	Commit your changes with clear commit messages. For example: fix: correct hash comparison in verification route or feat: add endpoint for resending verification email.
•	Push your branch to your fork and open a Pull Request to the main repository. In the PR description, reference any issue it addresses (e.g., “Closes #12”) and provide a brief summary of changes.
•	Code Style: Try to follow the conventions already used in the codebase. For example, naming of variables, functions, and files should be consistent. Use descriptive names and add comments in code where logic might be non-obvious (especially around cryptographic or blockchain-related code).
•	Testing: If the project includes a test suite, run it after your changes (npm test or similar). If you add new functionality, add corresponding tests if possible. This helps prevent regressions.
•	Documentation: If your contribution changes how something works or adds new features, please update the README or any relevant documentation. For example, if you add a new environment variable or a new API route, add it to the documentation so others know how to use it.
•	Discuss First for Major Changes: If you plan to make a substantial change (like refactoring the core architecture, adding a major feature), it’s a good idea to open an issue or discussion first. This way, maintainers can provide guidance and ensure it aligns with the project’s roadmap, possibly saving you time if the idea needs adjustment.
•	License & CLA: By contributing, you agree that your contributions will be licensed under the same license as the project (make sure to read the repository’s LICENSE file, e.g., MIT). If a Contributor License Agreement is required by the maintainers, they will indicate the process.
We appreciate all forms of contributions – code, documentation, bug reports, and even critiques. Together we can improve Graphene and make certificate verification more secure and accessible. Thank you for considering contributing to the project!
Screenshots
To give a better idea of the user interface and experience, here are some screenshots of Graphene in action. (If running locally, you can see these UIs in your browser. In this README, placeholders are shown for where screenshots would be added.)
Graphene Login Page

![Institution login](image.png)
Graphene Institution Login

![Certificate Issue](image-1.png)
Certificate Issuance Form

![Verification Page](image-2.png) ![Verification step2](image-3.png)
Verification Page

![Failed](image-4.png)![Success](image-7.png)
Verification Result

![Public Ledger](image-5.png)
Public Ledger

![Verified University Page](image-6.png)
Verified Universities
________________________________________
With these instructions, documentation, and visuals, you should be well-equipped to install, develop, and use the Graphene certificate verification system. For any questions or further clarification, please refer to the issues or discussion forums of the project. Happy coding! If you have any improvements you could think of you are free to fork the project 
________________________________________
