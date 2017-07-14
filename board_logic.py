from flask import session
from data_manager import query, run_statement
from datetime import datetime
from psycopg2 import DataError, IntegrityError


def load_boards():
    """Load boards based on the user credentials."""
    account_name = session["user_name"]
    sql = """SELECT id FROM accounts WHERE account_name = %s;"""
    parameters = (account_name,)
    account_id = query(sql, parameters, "cell")
    sql = """SELECT boards.id, boards.title, boards.status, COUNT(cards.title) as card_count
             FROM boards
             LEFT JOIN cards ON boards.id = cards.board_id
             WHERE account_id = %s
             GROUP BY boards.id
             ORDER BY boards.created ASC;"""
    parameters = (account_id,)
    boards = query(sql, parameters, "all")
    return boards


def get_current_card_counts():
    """Return board ids with the current card count."""
    account_name = session["user_name"]
    sql = """SELECT id FROM accounts WHERE account_name = %s;"""
    parameters = (account_name,)
    account_id = query(sql, parameters, "cell")
    sql = """SELECT boards.id as board_id, COUNT(cards.title) as card_count
             FROM boards
             LEFT JOIN cards ON boards.id = cards.board_id
             WHERE account_id = %s
             GROUP BY boards.id;"""
    parameters = (account_id,)
    boards_card_counts = query(sql, parameters, "all")
    return boards_card_counts


def load_cards(board_id):
    """Load cards related to the given board id."""
    sql = """SELECT id, title, card_order, status FROM cards
             WHERE board_id = %s;"""
    parameters = (board_id,)
    cards = query(sql, parameters, "all")
    return cards


def save_new_card_title(card_id, title):
    """Save the renamed card."""
    sql = """UPDATE cards SET title = %s
             WHERE id = %s;"""
    parameters = (title, card_id)
    try:
        query(sql, parameters, None)
    except (DataError, IntegrityError) as err:
        print('Data Error:\n{}'.format(err))
        return 'data_error'


def save_new_card(title, board_id):
    """Save a newly created card"""
    sql = """SELECT MAX(card_order) FROM cards WHERE board_id = %s;"""
    parameters = (board_id,)
    response = query(sql, parameters, 'cell')
    card_order = response + 1 if response else 1

    sql = """INSERT INTO cards (title, card_order, status, board_id)
             VALUES (%s, %s, %s, %s)
             RETURNING id, card_order;"""
    parameters = (title, card_order, "new", board_id)
    try:
        response = query(sql, parameters, 'one')
    except (DataError, IntegrityError) as err:
        print('Data Error:\n{}'.format(err))
        response = 'data_error'

    return response


def save_new_board(title):
    """Save a newly created board."""
    account_name = session["user_name"]
    sql = """SELECT id FROM accounts WHERE account_name = %s;"""
    parameters = (account_name,)
    account_id = query(sql, parameters, "cell")

    sql = """INSERT INTO boards (title, status, account_id)
             VALUES(%s, %s, %s)
             RETURNING id;"""
    parameters = (title, "active", account_id)
    try:
        response = query(sql, parameters, 'cell')
    except (DataError, IntegrityError) as err:
        print('Data Error:\n{}'.format(err))
        response = 'data_error'

    return response


def delete_card(card_id):
    """Delete a card based on the given id."""
    sql = """DELETE FROM cards WHERE id = %s;"""
    parameters = (card_id,)
    fetch = None
    query(sql, parameters, fetch)

 
def delete_board(board_id):
    """Delete a board based on the given id."""
    sql = """DELETE FROM boards WHERE id = %s;"""
    parameters = (board_id,)
    fetch = None
    query(sql, parameters, fetch)


def make_drag_and_drop_persistent(moved_card_id, new_status, card_ids):
    """Make drag and drop persistent in database:
    - update all values in card_order column,
    - update status of moved card.
    """
    card_ids = card_ids.strip('[]')
    card_ids = card_ids.split(',')

    for i, card_id in enumerate(card_ids, 1):
        sql = """UPDATE cards SET card_order = %s WHERE id = %s;"""
        parameters = (i, card_id)
        fetch = None
        query(sql, parameters, fetch)

    sql = """UPDATE cards SET status = %s WHERE id = %s;"""
    parameters = (new_status, moved_card_id)
    fetch = None
    query(sql, parameters, fetch)


def get_board_details(board_id):
    """Return board details required by modal, based on given board_id."""
    sql = """SELECT id, title, description, created, modified FROM boards WHERE id = %s;"""
    parameters = (board_id,)
    fetch = 'one'
    return query(sql, parameters, fetch)


def edit_board(board_id, board_title, board_desc):
    """Edit board with new title and description. Return new modified date."""
    sql = """UPDATE boards SET title = %s, description = %s WHERE id = %s
             RETURNING modified;"""
    parameters = (board_title, board_desc, board_id)
    fetch = 'cell'

    try:
        response = query(sql, parameters, fetch)
    except (DataError, IntegrityError) as err:
        print('Data Error:\n{}'.format(err))
        response = 'data_error'

    return response
