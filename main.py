
from os import urandom

from flask import (Flask, flash, jsonify, redirect, render_template, request,
                   session, url_for)

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
@account.not_loggedin
def index():
    return render_template('index.html')


@app.route("/boards")
@account.login_required
def boards():
    boards_data = board_logic.load_boards()
    return render_template('boards.html', boards_data=boards_data)


@app.route('/login', methods=['GET', 'POST'])
@account.not_loggedin
def manage_account():
    if request.method == 'POST':
        if request.form.get('register_acc_name'):
            return account.register_account()
        elif request.form.get('login_acc_name'):
            return account.login_user()

    if request.args.get('error') == 'timedout':
        flash('Your session has been timed out. Please log back in to continue.', 'error')

    return render_template('account.html')


@app.route('/logout')
@account.login_required
def logout():
    session.pop('user_name', None)

    return redirect(url_for('index'))


# API Endpoints:

@app.route('/api/cards')
@account.login_required
def load_cards():
    board_id = request.args.get("id")
    cards = board_logic.load_cards(board_id)
    return jsonify(cards)


@app.route('/api/new_card', methods=["POST"])
@account.login_required
def save_new_card():
    title = request.form.get("title")
    board_id = request.form.get("board_id")
    response = board_logic.save_new_card(title, board_id)
    if response == 'data_error':
        return jsonify(response)

    return jsonify(id=response["id"], card_order=response["card_order"])


@app.route('/api/new_board', methods=["POST"])
@account.login_required
def save_new_board():
    title = request.form.get("title")
    response = board_logic.save_new_board(title)
    return jsonify(response)


@app.route('/api/new_card_title', methods=["POST"])
@account.login_required
def add_new_card_title():
    title = request.form.get("title")
    card_id = request.form.get("card_id")
    response = board_logic.save_new_card_title(card_id, title)
    if response == 'data_error':
        return jsonify(response)

    return jsonify("success")


@app.route('/api/persistent_dnd', methods=['POST'])
@account.login_required
def make_drag_and_drop_persistent():
    moved_card_id = request.form.get("moved_card_id")
    new_status = request.form.get("new_status")
    card_ids = request.form.get("card_ids")
    board_logic.make_drag_and_drop_persistent(moved_card_id, new_status, card_ids)
    return jsonify(status="success")


@app.route('/api/delete_board', methods=['POST'])
@account.login_required
def delete_board():
    board_id = request.form.get("board_id")
    board_logic.delete_board(board_id)
    return jsonify("Done")


@app.route('/api/delete_card', methods=['POST'])
@account.login_required
def delete_card():
    card_id = request.form.get("card_id")
    board_logic.delete_card(card_id)
    return jsonify("Done")


@app.route('/api/current_card_counts')
@account.login_required
def get_current_card_counts():
    boards_card_counts = board_logic.get_current_card_counts()
    return jsonify(boards_card_counts)


@app.route('/api/board_details', methods=['POST'])
@account.login_required
def get_board_details():
    board_id = request.form.get('board_id')
    board_details = board_logic.get_board_details(board_id)
    return jsonify(board_details)


@app.route('/api/edit_board', methods=['POST'])
@account.login_required
def edit_board():
    board_id = request.form.get('board_id')
    board_title = request.form.get('board_title')
    board_desc = request.form.get('board_desc')
    new_mod_date = board_logic.edit_board(board_id, board_title, board_desc)
    return jsonify(new_mod_date)


if __name__ == '__main__':
    app.run(debug=True, port=5000)
