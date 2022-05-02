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
  id int NOT NULL PRIMARY KEY AUTO_INCREMENT,
	facebook_access_token text,
	facebook_auth_id text,

  foreign key(user_id) references(users.id)
)