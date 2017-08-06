
from data_manager import query
from psycopg2 import DataError, IntegrityError


def get_personal_boards(account_id):
    """Load boards based on the user credentials."""
    sql = """SELECT boards.id AS board_id, boards.title AS board_title,
             COUNT(cards.title) AS card_count, 'personal' AS board_role
             FROM boards
             LEFT JOIN cards ON boards.id = cards.board_id
             WHERE account_id = %s
             GROUP BY boards.id
             ORDER BY boards.created ASC;"""
    parameters = (account_id,)
    boards = query(sql, parameters, "all")
    return boards


def get_current_card_counts(account_id, team_role, team_id):
    """Return board ids with the current card count."""
    if team_role == 'personal':
        sql = """SELECT boards.id as board_id, COUNT(cards.title) as card_count
                FROM boards
                LEFT JOIN cards ON boards.id = cards.board_id
                WHERE account_id = %s
                GROUP BY boards.id;"""
        parameters = (account_id,)

    elif team_role in ('owner', 'manager'):
        sql = """SELECT b.id AS board_id, COUNT(c.title) AS card_count
                FROM boards AS b
                LEFT JOIN cards AS c
                    ON b.id = c.board_id
                WHERE b.team_id = %s
                GROUP BY b.id
                ORDER BY b.created ASC;"""

        parameters = (team_id,)

    elif team_role == 'member':
        sql = """SELECT b.id AS board_id, COUNT(c.title) AS card_count
                FROM accounts_teams AS at
                INNER JOIN accounts_boards AS ab
                    ON at.id = ab.account_team_id
                INNER JOIN boards AS b
                    ON ab.board_id = b.id
                LEFT JOIN cards AS c
                    ON b.id = c.board_id
                WHERE at.account_id = %s AND at.team_id = %s
                GROUP BY b.id, ab.role
                ORDER BY b.created ASC;"""

        parameters = (account_id, team_id)

    fetch = 'all'
    return query(sql, parameters, fetch)


def load_personal_cards(board_id, account_id):
    """Load cards related to the given board id."""
    sql = """SELECT c.id, c.title, c.card_order, c.status,
             c.created, c.modified, c.description,
             c.assigned_to, c.assigned_by, c.assigned_at
             FROM cards AS c
             INNER JOIN boards AS b
                ON b.id = c.board_id
             WHERE c.board_id = %s AND b.account_id = %s;"""
    parameters = (board_id, account_id)
    fetch = 'all'
    return query(sql, parameters, fetch)


def load_team_cards(board_id, account_id):
    sql = """SELECT team_id FROM boards WHERE id = %s;"""
    parameters = (board_id,)
    fetch = 'cell'
    team_id = query(sql, parameters, fetch)

    sql = """SELECT id, role FROM accounts_teams
             WHERE account_id = %s AND team_id = %s;"""
    parameters = (account_id, team_id)
    fetch = 'one'
    acc_team = query(sql, parameters, fetch)
    acc_team['id']
    acc_team['role']

    if acc_team['role'] in ('owner', 'manager'):
        cards = get_team_cards(board_id)

    elif acc_team['role'] == 'member':
        sql = """SELECT role FROM accounts_boards
                 WHERE account_team_id = %s AND board_id = %s;"""
        parameters = (acc_team['id'], board_id)
        fetch = 'cell'
        board_role = query(sql, parameters, fetch)

        if board_role in ('viewer', 'editor'):
            cards = get_team_cards(board_id)

    return cards


def get_team_cards(board_id):
    """Load cards related to the given board id."""
    sql = """SELECT c.id, c.title, c.card_order, c.status,
             c.created, c.modified, c.description,
             c.assigned_to, c.assigned_by, c.assigned_at
             FROM cards AS c WHERE c.board_id = %s;"""
    parameters = (board_id,)
    fetch = 'all'
    return query(sql, parameters, fetch)


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


def save_new_personal_board(title, account_id):
    """Save a newly created board."""
    sql = """INSERT INTO boards (title, status, account_id)
             VALUES(%s, %s, %s)
             RETURNING id, 'personal' AS team_role;"""
    parameters = (title, "active", account_id)
    try:
        response = query(sql, parameters, 'one')
    except (DataError, IntegrityError) as err:
        print('Data Error:\n{}'.format(err))
        response = 'data_error'

    return response


def save_new_team_board(title, team_id, team_role):
    sql = """INSERT INTO boards (title, status, team_id)
             VALUES(%s, %s, %s)
             RETURNING id, %s AS team_role;"""
    parameters = (title, "active", team_id, team_role)
    try:
        response = query(sql, parameters, 'one')
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


def edit_card(card_id, card_title, card_desc, assigned_to):
    if not assigned_to:
        assigned_to = None

    sql = """UPDATE cards SET title = %s, description = %s, assigned_to = %s
             WHERE id = %s
             RETURNING modified;"""
    parameters = (card_title, card_desc, assigned_to, card_id)
    fetch = 'cell'

    try:
        response = query(sql, parameters, fetch)
    except (DataError, IntegrityError) as err:
        print('Data Error:\n{}'.format(err))
        response = 'data_error'

    return response


def get_all_team_boards(team_id):

    sql = """SELECT b.id AS board_id, b.title AS board_title,
                COUNT(c.title) AS card_count, 'editor' AS board_role
             FROM boards AS b
             LEFT JOIN cards AS c
                ON b.id = c.board_id
             WHERE b.team_id = %s
             GROUP BY b.id
             ORDER BY b.created ASC;"""

    parameters = (team_id,)
    fetch = 'all'
    return query(sql, parameters, fetch)


def get_accessed_team_boards(acc_team_id):
    sql = """SELECT b.id AS board_id, b.title AS board_title,
                COUNT(c.title) AS card_count, ab.role AS board_role
             FROM accounts_teams AS at
             INNER JOIN accounts_boards AS ab
                ON at.id = ab.account_team_id
             INNER JOIN boards AS b
                ON ab.board_id = b.id
             LEFT JOIN cards AS c
                ON b.id = c.board_id
             WHERE at.id = %s
             GROUP BY b.id, ab.role
             ORDER BY b.created ASC;"""

    parameters = (acc_team_id,)
    fetch = 'all'
    return query(sql, parameters, fetch)
