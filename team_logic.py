
from data_manager import query
from psycopg2 import DataError, IntegrityError


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
    sql = """SELECT t.id, t.name, c.name AS category, t.description, t.logo, t.created, t.modified
             FROM teams AS t
             INNER JOIN categories AS c
                ON t.category_id = c.id
             WHERE t.id = %s;"""
    parameters = (team_id,)
    fetch = 'one'

    return query(sql, parameters, fetch)


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
