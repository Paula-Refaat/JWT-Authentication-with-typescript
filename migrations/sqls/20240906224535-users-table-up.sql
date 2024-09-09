/* Replace with your SQL commands */
-- Create table user
CREATE Extension IF NOT EXISTS "uuid-ossp";

Create TABLE users(
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);

