-- institutions & issuers
CREATE TABLE IF NOT EXISTS institutions (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  state_province TEXT NOT NULL,
  contact_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  issuer_id TEXT UNIQUE NOT NULL, -- e.g., GR-UPENN2024
  verified BOOLEAN DEFAULT TRUE,
  -- Firebase public URL for the institution logo (optional)
  logo_url TEXT,
  -- (optional) the storage path in Firebase, if you want to track it
  logo_storage_path TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- certificates (one row per issued cert)
CREATE TABLE IF NOT EXISTS certificates (
  id SERIAL PRIMARY KEY,
  certificate_id TEXT NOT NULL,      -- human ID from UI
  title TEXT NOT NULL,
  student_name TEXT NOT NULL,
  file_hash TEXT NOT NULL,           -- SHA-256 hex of uploaded doc
  -- Firebase public URL for the certificate doc (optional)
  file_url TEXT,
  file_storage_path TEXT,
  issuer_id TEXT NOT NULL REFERENCES institutions(issuer_id),
  issued_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(certificate_id, issuer_id)
);

-- ledger (append-only transaction log)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'tx_type') THEN
    CREATE TYPE tx_type AS ENUM('CERTIFICATE_ISSUED','INSTITUTION_REGISTERED');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'tx_status') THEN
    CREATE TYPE tx_status AS ENUM('CONFIRMED','PENDING');
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS ledger (
  id SERIAL PRIMARY KEY,
  block_number BIGINT NOT NULL,
  tx_hash TEXT NOT NULL,             -- simulated tx hash
  tx_type tx_type NOT NULL,
  status tx_status NOT NULL DEFAULT 'CONFIRMED',
  certificate_id TEXT,
  issuer_id TEXT,
  payload JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW()
);

-- simple “auto-incrementing block”
CREATE SEQUENCE IF NOT EXISTS block_seq START 245880;

-- helpful indexes
CREATE INDEX IF NOT EXISTS idx_certificates_issuer ON certificates(issuer_id);
CREATE INDEX IF NOT EXISTS idx_certificates_certid ON certificates(certificate_id);
CREATE INDEX IF NOT EXISTS idx_ledger_block ON ledger(block_number DESC);
CREATE INDEX IF NOT EXISTS idx_ledger_issuer ON ledger(issuer_id);
CREATE INDEX IF NOT EXISTS idx_ledger_certid ON ledger(certificate_id);

-- community feedback (approvals/reports) per institution
CREATE TABLE IF NOT EXISTS institution_feedback (
  id SERIAL PRIMARY KEY,
  issuer_id TEXT NOT NULL,
  vote TEXT NOT NULL CHECK (vote IN ('approve','report')),
  reason TEXT,
  client_ip TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_feedback_issuer ON institution_feedback(issuer_id);
