CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name text NOT NULL,
    bio text NOT NULL,
	  is_sopt_member boolean
--  email text NOT NULL,
--  private_profile boolean NOT NULL,
--  school text NOT NULL,
--  major text NOT NULL,
  -- 이름 추후 수정..
--  open_to_projects boolean,
);


CREATE TABLE users_facebook_auth (
  id SERIAL PRIMARY KEY,
	facebook_access_token text,
	facebook_auth_id text NOT NULL,
  user_id INT NOT NULL,

  FOREIGN KEY (user_id) REFERENCES users(id)
)
