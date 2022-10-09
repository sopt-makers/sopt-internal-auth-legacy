CREATE TABLE "AUTH_user" (
  id SERIAL PRIMARY KEY,
  generation INT NOT NULL,
  name text NOT NULL,
  email VARCHAR(256)
);

CREATE TABLE "AUTH_idp_facebook" (
  id SERIAL PRIMARY KEY,
	facebook_auth_id text NOT NULL,
  user_id INT NOT NULL,

  FOREIGN KEY (user_id) REFERENCES "AUTH_user"(id)
);

CREATE TABLE "AUTH_sopt_member" (
  id SERIAL PRIMARY KEY,
  name VARCHAR(20),
  generation INT NOT NULL,
  email VARCHAR(256) NOT NULL,
  joined BOOLEAN NOT NULL DEFAULT FALSE,

  UNIQUE (name, generation, email)
);

CREATE TABLE "AUTH_server_config" (
  id SERIAL PRIMARY KEY,
  key VARCHAR(30) NOT NULL,
  value TEXT NOT NULL,

  UNIQUE (key)
);