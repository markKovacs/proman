
from flask import Flask, render_template, flash, request, redirect, session

import account_logic as account
import board_logic

app = Flask(__name__)


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
