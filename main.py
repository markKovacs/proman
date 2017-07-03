
from os import urandom

from flask import Flask, flash, redirect, render_template, request, session

import account_logic as account
import board_logic

app = Flask(__name__)
app.secret_key = urandom(24)


# Before Request Checks:

@app.before_request
def check_before_request():
    """Before request, refresh session time and check for valid request method."""
    account.make_session_permanent(app)
    account.check_for_valid_request()


# Error Handlers:

@app.errorhandler(404)
def page_not_found(error):
    return render_template('error.html', error='404'), 404


@app.errorhandler(405)
def not_allowed_method(error):
    return render_template('error.html', error='405'), 405


# Routing Endpoints:

@app.route("/")
def index():
    return render_template('index.html')


@app.route("/boards")
def boards():
    boards_data = board_logic.load_boards()

    return render_template('boards.html', boards_data=boards_data)


@app.route('/login', methods=['GET', 'POST'])
def manage_account():
    if request.method == 'POST':
        if request.form.get('register_acc_name'):
            return account.register_account()
        elif request.form.get('login_acc_name'):
            return account.login_user()

    return render_template('account.html')


@app.route('/logout')
def logout():
    session.pop('user_name', None)
    flash("Successfully logged out.", "success")

    return redirect(url_for('planets'))


if __name__ == '__main__':
    app.run(debug=True, port=5000)
