
from functools import wraps
from os import remove

from flask import flash, redirect, session, url_for
from psycopg2 import DataError, IntegrityError

import common_logic as common
from data_manager import query


# Decorators for server-side access management

def access_level_required(access_level):
    def decorator(func):
        @wraps(func)
        def wrapper(team_id):

            if 'user_name' in session:
                account_id = common.get_account_id(session["user_name"])
                role = get_account_team_role(account_id, team_id)

                if access_level == 'manager' and role in ('manager', 'owner'):
                    return func(team_id)
                if access_level == 'owner' and role == 'owner':
                    return func(team_id)
                if access_level == 'not_owner' and role in ('member', 'manager'):
                    return func(team_id)

            flash('You have no authorization to edit this page.', 'error')
            return redirect(url_for('team_profile', team_id=team_id))

        return wrapper
    return decorator


# Team-logic functions

def load_teams(account_id):
    """Load teams based on account_id."""
    sql = """SELECT t.id AS id, t.name, at.role, at.id AS acc_team_id
             FROM accounts_teams AS at
             INNER JOIN teams AS t
                ON t.id = at.team_id
             WHERE at.account_id = %s
             ORDER BY t.name;"""
    parameters = (account_id,)
    fetch = 'all'

    return query(sql, parameters, fetch)


def get_team_data(team_id):
    """Return team profile information."""
    sql = """SELECT t.id, t.name, c.name AS category, t.description, t.image, t.created, t.modified,
                array_agg(a.account_name) AS member_names, array_agg(a.id) AS member_ids
             FROM teams AS t
             INNER JOIN categories AS c
                ON t.category_id = c.id
             INNER JOIN accounts_teams AS at
                ON t.id = at.team_id
             INNER JOIN accounts AS a
                ON a.id = at.account_id
             WHERE t.id = %s
             GROUP BY t.id, t.name, c.name, t.description, t.image, t.created, t.modified;"""
    parameters = (team_id,)
    fetch = 'one'
    try:
        response = query(sql, parameters, fetch)
    except DataError:
        response = 'not_valid'
    try:
        response['created'] = str(response['created'])[0:19]
        response['modified'] = str(response['modified'])[0:19]
    except TypeError:
        response = 'not_valid'

    return response


def get_account_team_role(account_id, team_id):
    """Return role in selected team for account in session."""
    sql = """SELECT role FROM accounts_teams WHERE team_id = %s AND account_id = %s;"""
    parameters = (team_id, account_id)
    fetch = 'cell'
    try:
        return query(sql, parameters, fetch)
    except TypeError:
        return None


def get_team_categories():
    """Return all team categories."""
    sql = """SELECT name FROM categories;"""
    parameters = None
    fetch = "col"
    return query(sql, parameters, fetch)


def edit_team_profile(team_id, category, desc):
    """Edit team profile based on parameters."""
    category_id = get_category_id(category)
    if category_id == 'wrong_category':
        return 'wrong_category'

    sql = """UPDATE teams SET category_id = %s, description = %s WHERE id = %s;"""
    parameters = (category_id, desc, team_id)
    fetch = None

    try:
        query(sql, parameters, fetch)
    except DataError as err:
        print('Data Error:\n{}'.format(err))
        return 'wrong_desc'


def get_category_id(category):
    sql = """SELECT id FROM categories WHERE name = %s;"""
    parameters = (category,)
    fetch = 'cell'
    try:
        category_id = query(sql, parameters, fetch)
    except TypeError:
        return create_new_category(category)

    return category_id


def create_new_category(category):
    sql = """INSERT INTO categories (name) VALUES (%s)
             RETURNING id;"""
    parameters = (category,)
    fetch = 'cell'
    try:
        return query(sql, parameters, fetch)
    except (DataError, IntegrityError) as err:
        print('Data Error:\n{}'.format(err))
        return 'wrong_category'


def update_image(image_type, entity_id, files):
    image = files.get('image')
    image_status = None

    if image and image.filename:
        extension, allowed_extension = common.allowed_extension(image.filename)
        if allowed_extension:
            base_filename = ('team' if image_type == 'team_logos' else 'account') + "_" + str(entity_id)

            delete_old_image(image_type, base_filename)

            filename = base_filename + '.' + extension
            image.save("static/uploads/" + image_type + '/' + filename)
            image_status = "uploaded"

            table = 'teams' if image_type == 'team_logos' else 'accounts'
            update_image_database(table, entity_id, filename)
        else:
            image_status = "not_allowed_ext"

    return image_status


def update_image_database(table, entity_id, filename):
    sql = """UPDATE {} SET image = %s WHERE id = %s;""".format(table)
    parameters = (filename, entity_id)
    fetch = None
    query(sql, parameters, fetch)


def delete_old_image(image_type, base_filename):
    for extension in ['jpeg', 'jpg', 'png']:
        try:
            remove("static/uploads/" + image_type + '/' + base_filename + '.' + extension)
        except FileNotFoundError:
            pass


def delete_logo(team_id):
    deleted = False
    for extension in ['jpeg', 'jpg', 'png']:
        try:
            remove("static/uploads/team_logos/team_" + str(team_id) + '.' + extension)
        except FileNotFoundError:
            pass
        else:
            deleted = True

    sql = """UPDATE teams SET image = NULL WHERE id = %s;"""
    parameters = (team_id,)
    fetch = None
    query(sql, parameters, fetch)

    return deleted


def hand_over_ownership(team_id, prev_owner_id, new_owner_id):
    sql = """UPDATE accounts_teams SET role = 'owner'
             WHERE team_id = %s AND account_id = %s;"""
    parameters = (team_id, new_owner_id)
    fetch = None
    query(sql, parameters, fetch)

    sql = """UPDATE accounts_teams SET role = 'manager'
             WHERE team_id = %s AND account_id = %s;"""
    parameters = (team_id, prev_owner_id)
    fetch = None
    query(sql, parameters, fetch)


def delete_team(team_id):
    sql = """DELETE FROM teams WHERE id = %s;"""
    parameters = (team_id,)
    fetch = None
    query(sql, parameters, fetch)


def leave_team(team_id, account_id):
    sql = """DELETE FROM accounts_teams
    WHERE account_id = %s AND team_id = %s AND role != 'owner';"""
    parameters = (account_id, team_id)
    fetch = None
    query(sql, parameters, fetch)


def create_team(account_id, name, category):
    category_id = get_category_id(category)

    sql = """INSERT INTO teams (name, category_id) VALUES (%s, %s)
             RETURNING id;"""
    parameters = (name, category_id)
    fetch = 'cell'

    try:
        team_id = query(sql, parameters, fetch)
    except IntegrityError:
        return 'already_exists'
    except DataError:
        return 'too_long'

    sql = """INSERT INTO accounts_teams (account_id, team_id, role) VALUES (%s, %s, %s);"""
    parameters = (account_id, team_id, 'owner')
    fetch = None
    query(sql, parameters, fetch)


def get_team_name(team_id):
    sql = """SELECT name FROM teams WHERE id = %s;"""
    parameters = (team_id,)
    fetch = 'cell'
    return query(sql, parameters, fetch)


def accounts_to_invite(team_id):
    """Return all accounts except current members or people who have unresponded invites."""
    sql = """SELECT id, account_name AS name FROM accounts WHERE id NOT IN (
                 SELECT account_id FROM accounts_teams WHERE team_id = %s
                 UNION
                 SELECT account_id FROM requests WHERE team_id = %s
             );"""
    parameters = (team_id, team_id)
    fetch = 'all'
    return query(sql, parameters, fetch)


def send_invite(team_id, invited_id):
    sql = """INSERT INTO requests (team_id, account_id, type) VALUES (%s, %s, %s);"""
    parameters = (team_id, invited_id, 'invitation')
    fetch = None
    query(sql, parameters, fetch)


def invited_accounts(team_id):
    sql = """SELECT r.account_id AS id, a.account_name AS name
             FROM requests AS r
             INNER JOIN accounts AS a
                ON a.id = r.account_id
             WHERE team_id = %s;"""
    parameters = (team_id,)
    fetch = 'all'
    return query(sql, parameters, fetch)


def cancel_invite(team_id, account_id):
    sql = """DELETE FROM requests WHERE team_id = %s AND account_id = %s;"""
    parameters = (team_id, account_id)
    fetch = None
    query(sql, parameters, fetch)
