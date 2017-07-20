
from data_manager import query


def get_account_id(account_name):
    """Get account_id based on session user name."""
    sql = """SELECT id FROM accounts WHERE account_name = %s;"""
    parameters = (account_name,)
    fetch = 'cell'
    account_id = query(sql, parameters, fetch)

    return account_id


def allowed_extension(filename):
    """Takes a filename string and validates extension, returning boolean."""
    ALLOWED_EXTENSIONS = ['jpeg', 'jpg', 'png']
    allowed_extension = '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS
    if allowed_extension:
        extension = filename.rsplit('.', 1)[1].lower()
    else:
        extension = None

    return extension, allowed_extension
