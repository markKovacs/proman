
# Account and session management related logic

from datetime import datetime, timedelta
from functools import wraps
from string import ascii_lowercase, ascii_uppercase, digits

from flask import abort, flash, redirect, request, session, url_for
from werkzeug.security import check_password_hash, generate_password_hash

import data_manager


# Decorators for server-side access management

def login_required(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        if 'user_name' in session:
            return func(*args, **kwargs)

        flash('Restricted area. Please login to gain access.', 'error')
        return redirect(url_for('manage_account'))

    return wrapper


def not_loggedin(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        if 'user_name' not in session:
            return func(*args, **kwargs)
        else:
            flash("Cannot access page. You are already logged in.", "error")
            return redirect(url_for("boards"))

    return wrapper


# Before request checks

def make_session_permanent(app):
    """Makes session permanent, set lifetime to 5 minutes, refresh upon each request."""
    if 'user_name' in session:
        session.permanent = True
        app.permanent_session_lifetime = timedelta(minutes=5)


def check_for_valid_request():
    """Check if HTTP request is any of the allowed request methods,
    and if function does not exist for requested URL, then abort.
    """
    allowed_req_methods = ('GET', 'POST')
    if request.method not in allowed_req_methods:
        abort(405)
    if request.endpoint is None:
        abort(404)


# Registration and helper functions

def register_account():
    """Register account after validation and hashing process."""
    user_name = request.form.get('register_acc_name')
    password = request.form.get('register_password_1')
    password_conf = request.form.get('register_password_2')
    user_names = get_user_names()

    if user_name in user_names:
        flash("User name already exists. Please choose another one.", "register_error")
        return redirect(url_for('manage_account'))

    if not valid_user_name(user_name):
        flash("Invalid user name. Should be 4-16 characters long, contain only letters, \
        numbers, dashes and underscores.", "register_error")
        return redirect(url_for('manage_account'))

    if not valid_password(password, password_conf):
        flash("Invalid password or not matching. Password should be 4-16 characters long, \
        containing only letters, numbers, dashes and underscores.", "register_error")
        return redirect(url_for('manage_account'))

    create_account(user_name, password)
    session['user_name'] = user_name
    flash("Successful registration as '{}'.".format(user_name), "success")

    return redirect(url_for('boards'))


def get_user_names():
    """Return all user names."""
    sql = """SELECT account_name FROM accounts;"""
    parameters = None
    fetch = "col"

    return data_manager.query(sql, parameters, fetch)


def valid_user_name(user_name):
    """Return True if user name string is valid.
    Valid characters: lowercase, digits, underscore.
    """
    if len(user_name) >= 4 and len(user_name) <= 16:
        for char in user_name:
            if char not in (ascii_lowercase + ascii_uppercase + digits + '_-'):
                break
        else:
            return True

    return False


def valid_password(password_1, password_2):
    """Return True if password string is valid.
    Valid characters: lowercase, uppercase, digits.
    """
    if password_1 == password_2:
        if len(password_1) >= 4 and len(password_1) <= 16:
            for char in password_1:
                if char not in (ascii_lowercase + ascii_uppercase + digits + '-_'):
                    break
            else:
                return True

    return False


def create_account(account_name, password):
    """Create account in accounts table."""
    reg_date = create_timestamp()
    hashed_pw = generate_password_hash(password, method='pbkdf2:sha512:80000', salt_length=8)

    sql = """INSERT INTO accounts (account_name, password, reg_date)
             VALUES (%s, %s, %s);"""
    parameters = (account_name, hashed_pw, reg_date)
    fetch = None

    data_manager.query(sql, parameters, fetch)


def create_timestamp():
    """Create timestamp, suitable for database timestamp format."""
    return '{:%Y-%m-%d %H:%M:%S}'.format(datetime.now())


# Login and helper functions

def login_user():
    """Login user after validating credentials. Set session ID,
    set client-side cookie and store session ID server-side as well.
    """
    if not valid_credentials(request.form):
        flash("Invalid credentials.", "login_error")
        return redirect(url_for('manage_account'))

    user_name = request.form['login_acc_name']
    session['user_name'] = user_name

    flash('Successfully logged in as {}. Welcome back in ProMan!'.format(user_name), 'success')

    return redirect(url_for('boards'))


def valid_credentials(form):
    """Return True if input credentials are valid."""
    user_names = get_user_names()
    user_name = form.get('login_acc_name')
    if user_name in user_names:
        user_password = get_user_password(user_name)
        if check_password_hash(user_password, form.get('login_password')):
            return True

    return False


def get_user_password(account_name):
    """Get password for account_name in accounts table."""
    sql = """SELECT password FROM accounts WHERE account_name = %s;"""
    parameters = (account_name,)
    fetch = 'cell'

    return data_manager.query(sql, parameters, fetch)
