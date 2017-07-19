
from data_manager import query


def get_account_id(account_name):
    """Get account_id based on session user name."""
    sql = """SELECT id FROM accounts WHERE account_name = %s;"""
    parameters = (account_name,)
    fetch = 'cell'
    account_id = query(sql, parameters, fetch)

    return account_id
