from flask import session
from data_manager import query, run_statement
from datetime import datetime


def create_timestamp():
    timestamp = '{:%Y-%m-%d %H:%M:%S}'.format(datetime.now())
    return timestamp


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
             ORDER BY boards.creation_date ASC;"""
    parameters = (account_id,)
    boards = query(sql, parameters, "all")
    return boards


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
    query(sql, parameters, None)


def save_new_card(title, board_id):
    """Save a newly created card"""
    sql = """SELECT MAX(card_order) FROM cards WHERE board_id = %s;"""
    parameters = (board_id,)
    response = query(sql, parameters, 'cell')
    print(board_id)
    card_order = response + 1 if response else 1
    date = create_timestamp()

    sql = """INSERT INTO cards (title, card_order, status, board_id, creation_date)
             VALUES (%s, %s, %s, %s, %s)
             RETURNING id, card_order;"""
    parameters = (title, card_order, "new", board_id, date)
    card_row = query(sql, parameters, 'one')

    return card_row


def save_new_board(title):
    """Save a newly created board."""
    account_name = session["user_name"]
    sql = """SELECT id FROM accounts WHERE account_name = %s;"""
    parameters = (account_name,)
    account_id = query(sql, parameters, "cell")
    date = create_timestamp()
    sql = """INSERT INTO boards (title, status, account_id, creation_date)
             VALUES(%s, %s, %s, %s)
             RETURNING id;"""
    parameters = (title, "active", account_id, date)
    board_id = query(sql, parameters, 'cell')

    return board_id


def edit_board(title, board_id):
    """Edit the name of the board based on the given id and title."""
    sql = """UPDATE boards SET title = %s WHERE id = %s;"""
    parameters = (title, board_id,)
    query = (sql, parameters)


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
