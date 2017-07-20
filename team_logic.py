
from os import remove

from psycopg2 import DataError, IntegrityError

import common_logic as common
from data_manager import query


def load_teams(account_id):
    """Load teams based on account_id."""
    sql = """SELECT t.id AS id, t.name, at.role, at.id AS acc_team_id FROM accounts_teams AS at
             INNER JOIN teams AS t
                ON t.id = at.team_id
             WHERE at.account_id = %s
             ORDER BY t.name;"""
    parameters = (account_id,)
    fetch = 'all'

    return query(sql, parameters, fetch)


def get_team_data(team_id):
    """Return team profile information."""
    sql = """SELECT t.id, t.name, c.name AS category, t.description, t.image, t.created, t.modified
             FROM teams AS t
             INNER JOIN categories AS c
                ON t.category_id = c.id
             WHERE t.id = %s;"""
    parameters = (team_id,)
    fetch = 'one'

    team_data = query(sql, parameters, fetch)
    team_data['created'] = str(team_data['created'])[0:19]
    team_data['modified'] = str(team_data['modified'])[0:19]
    return team_data


def get_account_team_role(team_id, account_id):
    """Return role in selected team for account in session."""
    sql = """SELECT role FROM accounts_teams WHERE team_id = %s AND account_id = %s;"""
    parameters = (team_id, account_id)
    fetch = 'cell'
    try:
        return query(sql, parameters, fetch)
    except TypeError:
        return 'no_permission'


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

    sql = """UPDATE teams SET category_id = %s, description = %s;"""
    parameters = (category_id, desc)
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
