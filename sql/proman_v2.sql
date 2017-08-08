
-- Drop all constraints:

ALTER TABLE IF EXISTS ONLY public.accounts DROP CONSTRAINT IF EXISTS pk_accounts_id CASCADE;

ALTER TABLE IF EXISTS ONLY public.boards DROP CONSTRAINT IF EXISTS pk_boards_id CASCADE;
ALTER TABLE IF EXISTS ONLY public.boards DROP CONSTRAINT IF EXISTS fk_boards_account_id CASCADE;
ALTER TABLE IF EXISTS ONLY public.boards DROP CONSTRAINT IF EXISTS fk_boards_team_id CASCADE;

ALTER TABLE IF EXISTS ONLY public.cards DROP CONSTRAINT IF EXISTS pk_cards_id CASCADE;
ALTER TABLE IF EXISTS ONLY public.cards DROP CONSTRAINT IF EXISTS fk_cards_board_id CASCADE;
ALTER TABLE IF EXISTS ONLY public.cards DROP CONSTRAINT IF EXISTS fk_cards_assigned_to CASCADE;
ALTER TABLE IF EXISTS ONLY public.cards DROP CONSTRAINT IF EXISTS fk_cards_assigned_by CASCADE;

ALTER TABLE IF EXISTS ONLY public.teams DROP CONSTRAINT IF EXISTS pk_teams_id CASCADE;
ALTER TABLE IF EXISTS ONLY public.teams DROP CONSTRAINT IF EXISTS fk_teams_category_id CASCADE;

ALTER TABLE IF EXISTS ONLY public.categories DROP CONSTRAINT IF EXISTS pk_categories_id CASCADE;

ALTER TABLE IF EXISTS ONLY public.accounts_teams DROP CONSTRAINT IF EXISTS pk_accounts_teams_id CASCADE;
ALTER TABLE IF EXISTS ONLY public.accounts_teams DROP CONSTRAINT IF EXISTS fk_accounts_teams_account_id CASCADE;
ALTER TABLE IF EXISTS ONLY public.accounts_teams DROP CONSTRAINT IF EXISTS fk_accounts_teams_team_id CASCADE;

ALTER TABLE IF EXISTS ONLY public.accounts_boards DROP CONSTRAINT IF EXISTS pk_accounts_boards_id CASCADE;
ALTER TABLE IF EXISTS ONLY public.accounts_boards DROP CONSTRAINT IF EXISTS fk_accounts_boards_account_team_id CASCADE;
ALTER TABLE IF EXISTS ONLY public.accounts_boards DROP CONSTRAINT IF EXISTS fk_accounts_boards_board_id CASCADE;

ALTER TABLE IF EXISTS ONLY public.requests DROP CONSTRAINT IF EXISTS pk_requests_id CASCADE;
ALTER TABLE IF EXISTS ONLY public.requests DROP CONSTRAINT IF EXISTS fk_requests_team_id CASCADE;
ALTER TABLE IF EXISTS ONLY public.requests DROP CONSTRAINT IF EXISTS fk_requests_account_id CASCADE;

ALTER TABLE IF EXISTS ONLY public.messages DROP CONSTRAINT IF EXISTS pk_messages_id CASCADE;
ALTER TABLE IF EXISTS ONLY public.messages DROP CONSTRAINT IF EXISTS fk_messages_sender CASCADE;
ALTER TABLE IF EXISTS ONLY public.messages DROP CONSTRAINT IF EXISTS fk_messages_receiver CASCADE;


-- Create tables with primary key, not null and check(non-composite) constraints:

DROP TABLE IF EXISTS public.accounts;
DROP SEQUENCE IF EXISTS public.accounts_id_seq;
CREATE TABLE accounts (
    id serial NOT NULL,
    account_name varchar(30) UNIQUE,
    password varchar(200) NOT NULL,
    image varchar(50),
    description varchar(255),
    created timestamp without time zone DEFAULT now() NOT NULL,
    modified timestamp without time zone DEFAULT now() NOT NULL
);

ALTER TABLE ONLY accounts
    ADD CONSTRAINT pk_accounts_id PRIMARY KEY (id);


DROP TABLE IF EXISTS public.boards;
DROP SEQUENCE IF EXISTS public.boards_id_seq;
CREATE TABLE boards (
    id serial NOT NULL,
    title varchar(30) CHECK (char_length(title) >= 1),
    description varchar(255) DEFAULT NULL,
    status varchar(8) CHECK(status IN ('active', 'deleted')),
    account_id int DEFAULT NULL,
    team_id int DEFAULT NULL,
    created timestamp without time zone DEFAULT now() NOT NULL,
    modified timestamp without time zone DEFAULT now() NOT NULL
);

ALTER TABLE ONLY boards
    ADD CONSTRAINT pk_boards_id PRIMARY KEY (id);


DROP TABLE IF EXISTS public.cards;
DROP SEQUENCE IF EXISTS public.cards_id_seq;
CREATE TABLE cards (
    id serial NOT NULL,
    title varchar(30) CHECK (char_length(title) >= 1),
    description varchar(255) DEFAULT NULL,
    card_order int NOT NULL,
    status varchar(11) CHECK(status IN ('new', 'in_progress', 'review', 'done')),
    board_id int NOT NULL,
    assigned_to varchar(30) DEFAULT NULL,
    assigned_by varchar(30) DEFAULT NULL,
    assigned_at timestamp without time zone DEFAULT NULL,
    created timestamp without time zone DEFAULT now() NOT NULL,
    modified timestamp without time zone DEFAULT now() NOT NULL
);

ALTER TABLE ONLY cards
    ADD CONSTRAINT pk_cards_id PRIMARY KEY (id);


DROP TABLE IF EXISTS public.teams;
DROP SEQUENCE IF EXISTS public.teams_id_seq;
CREATE TABLE teams (
    id serial NOT NULL,
    name varchar(30) UNIQUE CHECK (char_length(name) >= 1),
    category_id int DEFAULT 0 NOT NULL,
    description varchar(255),
    image varchar(100),
    created timestamp without time zone DEFAULT now() NOT NULL,
    modified timestamp without time zone DEFAULT now() NOT NULL
);

ALTER TABLE ONLY teams
    ADD CONSTRAINT pk_teams_id PRIMARY KEY (id);


DROP TABLE IF EXISTS public.categories;
DROP SEQUENCE IF EXISTS public.categories_id_seq;
CREATE TABLE categories (
    id serial NOT NULL,
    name varchar(30) UNIQUE NOT NULL CHECK (char_length(name) >= 1)
);

ALTER TABLE ONLY categories
    ADD CONSTRAINT pk_categories_id PRIMARY KEY (id);


DROP TABLE IF EXISTS public.accounts_teams;
DROP SEQUENCE IF EXISTS public.accounts_teams_id_seq;
CREATE TABLE accounts_teams (
    id serial NOT NULL,
    account_id int NOT NULL,
    team_id int NOT NULL,
    role varchar(7) CHECK(role IN ('owner', 'manager', 'member')),
    created timestamp without time zone DEFAULT now() NOT NULL,
    modified timestamp without time zone DEFAULT now() NOT NULL
);

ALTER TABLE ONLY accounts_teams
    ADD CONSTRAINT pk_accounts_teams_id PRIMARY KEY (id);


DROP TABLE IF EXISTS public.accounts_boards;
DROP SEQUENCE IF EXISTS public.accounts_boards_id_seq;
CREATE TABLE accounts_boards (
    id serial NOT NULL,
    account_team_id int NOT NULL,
    board_id int NOT NULL,
    role varchar(7) CHECK(role IN ('viewer', 'editor')),
    created timestamp without time zone DEFAULT now() NOT NULL,
    modified timestamp without time zone DEFAULT now() NOT NULL,
    UNIQUE (account_team_id, board_id)
);

ALTER TABLE ONLY accounts_boards
    ADD CONSTRAINT pk_accounts_boards_id PRIMARY KEY (id);


DROP TABLE IF EXISTS public.requests;
DROP SEQUENCE IF EXISTS public.requests_id_seq;
CREATE TABLE requests (
    id serial NOT NULL,
    team_id int NOT NULL,
    account_id int NOT NULL,
    accepted boolean DEFAULT false NOT NULL,
    type varchar(10) CHECK(type IN ('invitation', 'request')),
    created timestamp without time zone DEFAULT now() NOT NULL
);

ALTER TABLE ONLY requests
    ADD CONSTRAINT pk_requests_id PRIMARY KEY (id);


DROP TABLE IF EXISTS public.messages;
DROP SEQUENCE IF EXISTS public.messages_id_seq;
CREATE TABLE messages (
    id serial NOT NULL,
    sender int CHECK(sender != receiver),
    receiver int CHECK(receiver != sender),
    read boolean DEFAULT false NOT NULL,
    type varchar(10) CHECK(type IN ('message', 'notification')),
    created timestamp without time zone DEFAULT now() NOT NULL
);

ALTER TABLE ONLY messages
    ADD CONSTRAINT pk_messages_id PRIMARY KEY (id);


-- Modify "modified" column on update of record:

DROP TRIGGER IF EXISTS check_update_accounts on public.accounts;
CREATE TRIGGER check_update_accounts
    BEFORE UPDATE ON accounts
    FOR EACH ROW
    EXECUTE PROCEDURE modified_auto_update();

DROP TRIGGER IF EXISTS check_update_boards on public.boards;
CREATE TRIGGER check_update_boards
    BEFORE UPDATE ON boards
    FOR EACH ROW
    EXECUTE PROCEDURE modified_auto_update();

DROP TRIGGER IF EXISTS check_update_cards on public.cards;
CREATE TRIGGER check_update_cards
    BEFORE UPDATE ON cards
    FOR EACH ROW
    EXECUTE PROCEDURE modified_auto_update();

DROP TRIGGER IF EXISTS check_update_teams on public.teams;
CREATE TRIGGER check_update_teams
    BEFORE UPDATE ON teams
    FOR EACH ROW
    EXECUTE PROCEDURE modified_auto_update();

DROP TRIGGER IF EXISTS check_update_accounts_teams on public.accounts_teams;
CREATE TRIGGER check_update_accounts_teams
    BEFORE UPDATE ON accounts_teams
    FOR EACH ROW
    EXECUTE PROCEDURE modified_auto_update();

DROP TRIGGER IF EXISTS check_update_accounts_boards on public.accounts_boards;
CREATE TRIGGER check_update_accounts_boards
    BEFORE UPDATE ON accounts_boards
    FOR EACH ROW
    EXECUTE PROCEDURE modified_auto_update();

CREATE OR REPLACE FUNCTION modified_auto_update() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.modified := now();
    RETURN NEW;
END;
$$;


-- Foreign-key Constraints:

ALTER TABLE ONLY boards
    ADD CONSTRAINT fk_boards_account_id FOREIGN KEY (account_id) REFERENCES accounts(id)
    ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY boards
    ADD CONSTRAINT fk_boards_team_id FOREIGN KEY (team_id) REFERENCES teams(id)
    ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY cards
    ADD CONSTRAINT fk_cards_board_id FOREIGN KEY (board_id) REFERENCES boards(id)
    ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY cards
    ADD CONSTRAINT fk_cards_assigned_to FOREIGN KEY (assigned_to) REFERENCES accounts(account_name)
    ON UPDATE CASCADE ON DELETE SET NULL;

ALTER TABLE ONLY cards
    ADD CONSTRAINT fk_cards_assigned_by FOREIGN KEY (assigned_by) REFERENCES accounts(account_name)
    ON UPDATE CASCADE ON DELETE SET NULL;

ALTER TABLE ONLY teams
    ADD CONSTRAINT fk_teams_category_id FOREIGN KEY (category_id) REFERENCES categories(id)
    ON UPDATE CASCADE ON DELETE SET DEFAULT;

ALTER TABLE ONLY accounts_teams
    ADD CONSTRAINT fk_accounts_teams_account_id FOREIGN KEY (account_id) REFERENCES accounts(id)
    ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY accounts_teams
    ADD CONSTRAINT fk_accounts_teams_team_id FOREIGN KEY (team_id) REFERENCES teams(id)
    ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY accounts_boards
    ADD CONSTRAINT fk_accounts_boards_account_team_id FOREIGN KEY (account_team_id) REFERENCES accounts_teams(id)
    ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY accounts_boards
    ADD CONSTRAINT fk_accounts_boards_board_id FOREIGN KEY (board_id) REFERENCES boards(id)
    ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY requests
    ADD CONSTRAINT fk_requests_team_id FOREIGN KEY (team_id) REFERENCES teams(id)
    ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY requests
    ADD CONSTRAINT fk_requests_account_id FOREIGN KEY (account_id) REFERENCES accounts(id)
    ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY messages
    ADD CONSTRAINT fk_messages_sender FOREIGN KEY (sender) REFERENCES accounts(id)
    ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY messages
    ADD CONSTRAINT fk_messages_receiver FOREIGN KEY (receiver) REFERENCES accounts(id)
    ON UPDATE CASCADE ON DELETE CASCADE;


-- Trigger should make assigned_by and assigned_at NULL if assigned_to turns to NULL:

CREATE TRIGGER check_assigned_to_value
    BEFORE UPDATE ON cards
    FOR EACH ROW
    WHEN (NEW.assigned_to IS NULL)
    EXECUTE PROCEDURE make_assigned_by_and_to_null();

CREATE OR REPLACE FUNCTION make_assigned_by_and_to_null() RETURNS trigger AS $check_assigned_to_value$
    BEGIN
        NEW.assigned_by := NULL;
        NEW.assigned_at := NULL;
        RETURN NEW;
    END;
$check_assigned_to_value$ LANGUAGE plpgsql;


-- Insert Sample Records:

INSERT INTO accounts VALUES (1, 'steve_jobs', 'pbkdf2:sha512:80000$RiM11IjO$8ca3536e997c74236dc4d69339b9415fa0ebfce50e5220ae518ead412059a70831f9471e6b0d10bccc9cb8861b92f3ad63a09efe3515667cdaa3b029a8946d8d', false, 'My name is Steve Jobs.', '2017-05-23 10:25:32', '2017-05-23 10:25:32');
INSERT INTO accounts VALUES (2, 'neo_anderson', 'pbkdf2:sha512:80000$4rbilA0W$774fba3ab0296e25a0145264d55852037f29ca7bfe65169da1bcb8d3f527275425c13e5426807bc490558f8a36546f747e2b63330e58c141a6805ca2bfcecaa5', false, NULL, '2017-05-23 10:25:32', '2017-05-23 10:25:32');
INSERT INTO accounts VALUES (3, 'bill_gates', 'pbkdf2:sha512:80000$RNuJhjfD$3de4a2689363cc8e146127c580cbb12bd2fd375f8cf9b9341d66ecade390708e1071149c40709c672313c92a8b8973751776496e40cf30db66676dce5b98b475', false, NULL, '2017-05-23 10:25:32', '2017-05-23 10:25:32');
INSERT INTO accounts VALUES (4, 'zuckerberg', 'pbkdf2:sha512:80000$rsTIFHNU$6803cd4f33d9b21d9a28863f728124d8307d387ad041df007d129c24875a6de94ac8f8845ebc70ee51437a7cf4cc2c029d886c8d4a7b621641670843092ee7aa', false, NULL, '2017-05-23 10:25:32', '2017-05-23 10:25:32');
INSERT INTO accounts VALUES (5, 'mark', 'pbkdf2:sha512:80000$emejRYOP$d93009f5aa599127198a8b53d9d14de03f0cb5a1df42cd5d85e44da10e72ea6321a9e0e9d7025e41971da3d36d4cb013126d5c60ea3d46d353dc7edfb3ab77fc', false, NULL, '2017-05-23 10:25:32', '2017-05-23 10:25:32');
SELECT pg_catalog.setval('accounts_id_seq', 5, true);


INSERT INTO categories VALUES (0, 'unselected');
INSERT INTO categories VALUES (1, 'manufacturing');
INSERT INTO categories VALUES (2, 'development');
INSERT INTO categories VALUES (3, 'free-time');
SELECT pg_catalog.setval('categories_id_seq', 3, true);


INSERT INTO teams VALUES (1, 'Team Title 1', 1, 'We like to manufacture stuff.', 'team_1.jpg', '2017-06-24 10:25:32', '2017-06-24 10:25:32');
INSERT INTO teams VALUES (2, 'Team Title 2', 2, 'We like to develop stuff.', NULL, '2017-06-24 10:25:32', '2017-06-24 10:25:32');
INSERT INTO teams VALUES (3, 'Team Title 3', 3, 'We like to do anything.', NULL, '2017-06-24 10:25:32', '2017-06-24 10:25:32');
INSERT INTO teams VALUES (4, 'Team Title 4', 2, 'Nothing special.', NULL, '2017-06-24 10:25:32', '2017-06-24 10:25:32');
INSERT INTO teams VALUES (5, 'Team Title dsdsdsdsd sddsdsd 5', 3, 'Explained later.', NULL, '2017-06-24 10:25:32', '2017-06-24 10:25:32');
SELECT pg_catalog.setval('teams_id_seq', 5, true);


INSERT INTO boards VALUES (1, 'Active Board 1', 'A short description.', 'active', 5, NULL, '2017-06-23 10:25:32', '2017-06-23 10:25:32');
INSERT INTO boards VALUES (2, 'Active Board 2', NULL, 'active', 5, NULL, '2017-06-23 10:25:33', '2017-06-23 10:25:33');
INSERT INTO boards VALUES (3, 'Active Board 3', 'A longer description can be read over here. I hope this will be shown approprietly and will help me configure the page well. A longer description can be read over here. I hope this will be shown approprietly and will help me configure the page well.', 'active', 5, NULL, '2017-06-23 10:25:32', '2017-06-23 10:25:32');
INSERT INTO boards VALUES (4, 'Active Board 4', NULL, 'active', 5, NULL, '2017-06-23 10:25:32', '2017-06-23 10:25:32');
INSERT INTO boards VALUES (5, 'Active Board 5', NULL, 'active', NULL, 1, '2017-06-23 10:25:32', '2017-06-23 10:25:32');
INSERT INTO boards VALUES (6, 'Active Board 6', NULL, 'active', NULL, 5, '2017-06-23 10:25:32', '2017-06-23 10:25:32');
INSERT INTO boards VALUES (7, 'Active Board 7', NULL, 'active', NULL, 5, '2017-06-23 10:25:32', '2017-06-23 10:25:32');
INSERT INTO boards VALUES (8, 'Active Board 8', NULL, 'active', NULL, 4, '2017-06-23 10:25:32', '2017-06-23 10:25:32');
SELECT pg_catalog.setval('boards_id_seq', 8, true);


INSERT INTO cards VALUES (1, 'New Card 1', NULL, 1, 'new', 1, 'admin', 'neo_anderson', '2017-06-24 10:25:32', '2017-06-24 10:25:32', '2017-06-24 10:25:32');
INSERT INTO cards VALUES (2, 'New Card 2', NULL, 2, 'done', 1, 'admin', 'steve_jobs', '2017-06-24 10:25:32', '2017-06-24 10:25:32', '2017-06-24 10:25:32');
INSERT INTO cards VALUES (3, 'New Card 3', NULL, 3, 'review', 1, NULL, NULL, NULL, '2017-06-24 10:25:32', '2017-06-24 10:25:32');
INSERT INTO cards VALUES (4, 'New Card 4', NULL, 4, 'in_progress', 1, 'neo_anderson', 'admin', '2017-06-24 10:25:32', '2017-06-24 10:25:32', '2017-06-24 10:25:32');
INSERT INTO cards VALUES (5, 'New Card 5', NULL, 5, 'new', 1, 'neo_anderson', 'steve_jobs', '2017-06-24 10:25:32', '2017-06-24 10:25:32', '2017-06-24 10:25:32');
INSERT INTO cards VALUES (6, 'New Card 6', NULL, 6, 'done', 1, 'steve_jobs', 'neo_anderson', '2017-06-24 10:25:32', '2017-06-24 10:25:32', '2017-06-24 10:25:32');
INSERT INTO cards VALUES (7, 'New Card 7', NULL, 7, 'review', 1, 'admin', 'steve_jobs', '2017-06-24 10:25:32', '2017-06-24 10:25:32', '2017-06-24 10:25:32');
INSERT INTO cards VALUES (8, 'New Card 8', NULL, 8, 'in_progress', 1, 'admin', 'neo_anderson', '2017-06-24 10:25:32', '2017-06-24 10:25:32', '2017-06-24 10:25:32');
INSERT INTO cards VALUES (9, 'New Card 9', NULL, 9, 'new', 1, 'admin', 'neo_anderson', '2017-06-24 10:25:32', '2017-06-24 10:25:32', '2017-06-24 10:25:32');
INSERT INTO cards VALUES (10, 'New Card 10', NULL, 10, 'done', 1, 'admin', NULL, '2017-06-24 10:25:32', '2017-06-24 10:25:32', '2017-06-24 10:25:32');
INSERT INTO cards VALUES (11, 'New Card 11', NULL, 11, 'review', 2, 'admin', 'neo_anderson', '2017-06-24 10:25:32', '2017-06-24 10:25:32', '2017-06-24 10:25:32');
INSERT INTO cards VALUES (12, 'New Card 12', NULL, 12, 'in_progress', 3, 'admin', 'neo_anderson', '2017-06-24 10:25:32', '2017-06-24 10:25:32', '2017-06-24 10:25:32');
SELECT pg_catalog.setval('cards_id_seq', 12, true);


INSERT INTO accounts_teams VALUES (1, 5, 1, 'owner', '2017-06-24 10:25:32', '2017-06-24 10:25:32');
INSERT INTO accounts_teams VALUES (2, 5, 5, 'member', '2017-06-24 10:25:32', '2017-06-24 10:25:32');
INSERT INTO accounts_teams VALUES (3, 5, 4, 'manager', '2017-06-24 10:25:32', '2017-06-24 10:25:32');
INSERT INTO accounts_teams VALUES (4, 5, 3, 'owner', '2017-06-24 10:25:32', '2017-06-24 10:25:32');
INSERT INTO accounts_teams VALUES (5, 1, 2, 'owner', '2017-06-24 10:25:32', '2017-06-24 10:25:32');
INSERT INTO accounts_teams VALUES (6, 1, 1, 'manager', '2017-06-24 10:25:32', '2017-06-24 10:25:32');
INSERT INTO accounts_teams VALUES (7, 2, 1, 'member', '2017-06-24 10:25:32', '2017-06-24 10:25:32');
SELECT pg_catalog.setval('accounts_teams_id_seq', 7, true);


INSERT INTO requests (team_id, account_id, type) VALUES (1, 3, 'request');
INSERT INTO requests (team_id, account_id, type) VALUES (4, 3, 'request');
INSERT INTO requests (team_id, account_id, type) VALUES (5, 3, 'request');
INSERT INTO requests (team_id, account_id, type) VALUES (5, 4, 'invitation');
SELECT pg_catalog.setval('requests_id_seq', 4, true);


INSERT INTO accounts_boards (account_team_id, board_id, role) VALUES (6, 5, 'editor');
INSERT INTO accounts_boards (account_team_id, board_id, role) VALUES (6, 6, 'viewer');
INSERT INTO accounts_boards (account_team_id, board_id, role) VALUES (7, 5, 'editor');
INSERT INTO accounts_boards (account_team_id, board_id, role) VALUES (2, 6, 'editor');
INSERT INTO accounts_boards (account_team_id, board_id, role) VALUES (2, 7, 'viewer');
SELECT pg_catalog.setval('accounts_boards_id_seq', 6, true);
