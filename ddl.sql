CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    generation INT NOT NULL,
    name text NOT NULL,
    email VARCHAR(256)
);

CREATE TABLE users_facebook_auth (
  id SERIAL PRIMARY KEY,
	facebook_auth_id text NOT NULL,
  user_id INT NOT NULL,

  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE sopt_member (
  id SERIAL PRIMARY KEY,
  name VARCHAR(20),
  generation INT NOT NULL,
  email VARCHAR(256) NOT NULL,
  user_id INT REFERENCES users(id) DEFAULT NULL,

  UNIQUE (name, generation, email)
);
