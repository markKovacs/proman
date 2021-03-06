
import json
from os import urandom

from flask import (Flask, abort, flash, jsonify, redirect, render_template,
                   request, session, url_for)
from werkzeug.utils import secure_filename

import account_logic as account
import board_logic
import common_logic as common
import team_logic

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
    account_id = common.get_account_id(session["user_name"])
    boards_data = board_logic.get_personal_boards(account_id)
    account_teams = team_logic.get_account_teams(account_id)

    return render_template('boards.html', boards_data=boards_data, account_teams=account_teams)


@app.route("/teams")
@account.login_required
def teams():
    account_id = common.get_account_id(session["user_name"])
    teams_data = team_logic.load_teams(account_id)

    if request.args.get('success') == 'team-deleted':
        deleted_id = request.args.get('id')
        deleted_name = request.args.get('name')
        flash("Team #{} named as '{}' deleted from database.".format(deleted_id, deleted_name), 'success')

    if request.args.get('success') == 'team-left':
        left_team = request.args.get('name')
        flash("You have successfully left the team '{}'.".format(left_team), 'success')

    categories = team_logic.get_team_categories()

    return render_template('teams.html', teams_data=teams_data, categories=categories)


@app.route('/team/<team_id>')
@account.login_required
def team_profile(team_id):
    team_data = team_logic.get_team_data(team_id)
    if team_data == 'not_valid':
        abort(404)

    member_ids = team_data.pop('member_ids')
    member_names = team_data.pop('member_names')
    team_data['members'] = tuple(zip(member_names, member_ids))

    account_id = common.get_account_id(session["user_name"])
    role = team_logic.get_account_team_role(account_id, team_id)

    cur_time = common.get_timestamp()
    categories = team_logic.get_team_categories()

    return render_template('team_profile.html', team_data=team_data, role=role,
                           categories=categories, cur_time=cur_time)


@app.route('/team/<team_id>/edit', methods=['POST'])
@team_logic.access_level_required('manager')
def edit_team_profile(team_id):
    category = request.form.get('category')
    desc = request.form.get('description')
    response = team_logic.edit_team_profile(team_id, category, desc)

    if response == 'wrong_desc':
        flash('Wrong description. Cannot exceed 255 characters.', 'error')
    elif response == 'wrong_category':
        flash('Wrong category. Must be 1-30 characters long.', 'error')
    else:
        flash('Team profile successfully edited.', 'success')

    return redirect(url_for('team_profile', team_id=team_id))


@app.route('/team/<team_id>/upload', methods=['POST'])
@team_logic.access_level_required('manager')
def upload_logo(team_id):
    image_status = team_logic.update_image('team_logos', team_id, request.files)

    if image_status == "uploaded":
        flash("Image was uploaded successfully.", "success")
    elif image_status == "not_allowed_ext":
        flash("Image was not uploaded. Allowed extensions: JPEG, JPG, PNG.", "error")
    else:
        flash("Something went wrong Please try again.", "error")

    return redirect(url_for('team_profile', team_id=team_id))


@app.route('/dashboard')
@account.login_required
def dashboard():
    # content to be implemented
    return render_template('dashboard.html')


@app.route('/team/<team_id>/ownership', methods=['POST'])
@team_logic.access_level_required('owner')
def hand_over_ownership(team_id):
    new_owner_name, new_owner_id = request.form.get('new-owner').strip("'()").split(', ')

    prev_owner_id = common.get_account_id(session["user_name"])
    team_logic.hand_over_ownership(team_id, prev_owner_id, new_owner_id)

    flash("Ownership handed over to '{}'.".format(new_owner_name), 'success')
    return redirect(url_for('team_profile', team_id=team_id))


@app.route('/create_team', methods=['POST'])
@account.login_required
def create_team():
    account_id = common.get_account_id(session["user_name"])
    name = request.form.get('name')

    if len(name) < 1:
        flash('Team name field cannot be empty.', 'error')
        return redirect(url_for('teams'))

    category = request.form.get('category')

    if category is None:
        flash('Please select a category.', 'error')
        return redirect(url_for('teams'))

    title = team_logic.create_team(account_id, name, category)

    if title == 'too_long':
        flash('Team name is too long. Please choose a name that is between 1-30 characters.', 'error')
    elif title == 'already_exists':
        flash('Team name already exists, please choose another name.', 'error')

    return redirect(url_for('teams'))


@app.route('/team/<team_id>/members')
@account.login_required
def team_members(team_id):
    team_name = team_logic.get_team_name(team_id)

    if request.args.get('success') == 'inv-sent':
        flash("'{}' was invited to team successfully.".format(request.args.get('invited-name')), 'success')
    elif request.args.get('success') == 'inv-cancelled':
        flash("Invite successfully cancelled.", 'success')
    elif request.args.get('success') == 'request-accepted':
        flash("Request accepted.", 'success')
    elif request.args.get('success') == 'request-declined':
        flash("Request declined.", 'success')
    elif request.args.get('error') == 'empty-input':
        flash('Please select an account to send an invitation.', 'error')
    elif request.args.get('error') == 'member-removed':
        flash('This user cannot be removed.', 'error')
    elif request.args.get('success') == 'member-removed':
        flash('User has been removed.', 'success')

    # all accounts except current members and invited accounts:
    accounts_to_invite = team_logic.accounts_to_invite(team_id)
    invited_accounts = team_logic.invited_accounts(team_id)
    requests = team_logic.get_requests(team_id)
    current_members = team_logic.get_team_members(team_id)

    account_id = common.get_account_id(session["user_name"])
    role = team_logic.get_account_team_role(account_id, team_id)

    return render_template('team_members.html', team_id=team_id, team_name=team_name,
                           accounts_to_invite=accounts_to_invite, invited_accounts=invited_accounts,
                           requests=requests, current_members=current_members, role=role)


# Register, login, logout functions:

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
    """Decorator validates only login, but further validation happens inside."""
    account_id = common.get_account_id(session["user_name"])
    board_id = request.args.get("board_id")
    team_role = request.args.get("team_role")

    if team_role == 'personal':
        cards = board_logic.load_personal_cards(board_id, account_id)
    elif team_role in ('owner', 'manager', 'member'):
        cards = board_logic.load_team_cards(board_id, account_id)
    else:
        cards = None

    return jsonify(cards)


@app.route('/api/new_card', methods=["POST"])
@account.login_required
def save_new_card():
    # TO BE IMPLEMENTED: can do only if editor
    title = request.form.get("title")
    board_id = request.form.get("board_id")
    response = board_logic.save_new_card(title, board_id)
    if response == 'data_error':
        return jsonify(response)

    return jsonify(id=response["id"], card_order=response["card_order"])


@app.route('/api/new_board', methods=["POST"])
@account.login_required
def save_new_personal_board():
    title = request.form.get("title")
    team_role = request.form.get("team_role")
    account_id = common.get_account_id(session["user_name"])

    reponse = board_logic.save_new_personal_board(title, account_id)

    return jsonify(board_id=reponse['id'], team_role=reponse['team_role'])


@app.route('/api/new_team_board/<team_id>', methods=["POST"])
@team_logic.access_level_required('owner')
def save_new_team_board(team_id):
    title = request.form.get("title")
    team_role = request.form.get("team_role")
    team_id = request.form.get("team_id")
    account_id = common.get_account_id(session["user_name"])

    reponse = board_logic.save_new_team_board(title, team_id, team_role)

    return jsonify(board_id=reponse['id'], team_role=reponse['team_role'])


@app.route('/api/new_card_title', methods=["POST"])
@account.login_required
def add_new_card_title():
    # TO BE IMPLEMENTED: can do only if editor
    title = request.form.get("title")
    card_id = request.form.get("card_id")
    response = board_logic.save_new_card_title(card_id, title)
    if response == 'data_error':
        return jsonify(response)

    return jsonify("success")


@app.route('/api/persistent_dnd', methods=['POST'])
@account.login_required
def make_drag_and_drop_persistent():
    # TO BE IMPLEMENTED: can do only if editor
    moved_card_id = request.form.get("moved_card_id")
    new_status = request.form.get("new_status")
    card_ids = request.form.get("card_ids")
    board_logic.make_drag_and_drop_persistent(moved_card_id, new_status, card_ids)
    return jsonify(status="success")


@app.route('/api/delete_board', methods=['POST'])
@account.login_required
def delete_board():
    # TO BE IMPLEMENTED: can do only if owner
    board_id = request.form.get("board_id")
    board_logic.delete_board(board_id)
    return jsonify("Done")


@app.route('/api/delete_card', methods=['POST'])
@account.login_required
def delete_card():
    # TO BE IMPLEMENTED: can do only if editor
    card_id = request.form.get("card_id")
    board_logic.delete_card(card_id)
    return jsonify("Done")


@app.route('/api/current_card_counts', methods=['POST'])
@account.login_required
def get_current_card_counts():
    # TO BE IMPLEMENTED: can do only if viewer at least
    team_role = request.form.get('team_role')
    team_id = request.form.get('team_id')
    account_id = common.get_account_id(session["user_name"])
    boards_card_counts = board_logic.get_current_card_counts(account_id, team_role, team_id)
    return jsonify(boards_card_counts)


@app.route('/api/board_details', methods=['POST'])
@account.login_required
def get_board_details():
    # TO BE IMPLEMENTED: can do only if viewer at least
    board_id = request.form.get('board_id')
    board_details = board_logic.get_board_details(board_id)
    return jsonify(board_details)


@app.route('/api/edit_board', methods=['POST'])
@account.login_required
def edit_board():
    # TO BE IMPLEMENTED: can do only if editor OR manager
    board_id = request.form.get('board_id')
    board_title = request.form.get('board_title')
    board_desc = request.form.get('board_desc')
    new_mod_date = board_logic.edit_board(board_id, board_title, board_desc)
    return jsonify(new_mod_date)


@app.route('/api/edit_card', methods=['POST'])
@account.login_required
def edit_card():
    # TO BE IMPLEMENTED: can do only if editor
    card_id = request.form.get('card_id')
    card_title = request.form.get('card_title')
    card_desc = request.form.get('card_desc')
    assigned_to = request.form.get('assigned_to')
    new_mod_date = board_logic.edit_card(card_id, card_title, card_desc, assigned_to)
    return jsonify(new_mod_date)


@app.route('/team/<team_id>/delete_logo', methods=['POST'])
@team_logic.access_level_required('manager')
def delete_logo(team_id):
    team_id = request.form.get('team_id')
    deleted = team_logic.delete_logo(team_id)
    return jsonify(deleted)


@app.route('/team/<team_id>/delete_team', methods=['POST'])
@team_logic.access_level_required('owner')
def delete_team(team_id):
    team_id = request.form.get('team_id')
    team_logic.delete_team(team_id)
    return jsonify("Done")


@app.route('/team/<team_id>/leave_team', methods=['POST'])
@team_logic.access_level_required('not_owner')
def leave_team(team_id):
    account_id = common.get_account_id(session["user_name"])
    team_id = request.form.get('team_id')

    team_logic.leave_team(team_id, account_id)

    return jsonify("Done")


@app.route('/team/<team_id>/send_invite', methods=['POST'])
@team_logic.access_level_required('manager')
def send_invite(team_id):
    team_id = request.form.get('team_id')
    invited_id = request.form.get('invited_id')
    if int(invited_id):
        team_logic.send_invite(team_id, invited_id)
    else:
        return jsonify("empty_input")

    return jsonify("Done")


@app.route('/team/<team_id>/cancel_invite', methods=['POST'])
@team_logic.access_level_required('manager')
def cancel_invite(team_id):
    team_id = request.form.get('team_id')
    invited_id = request.form.get('invited_id')

    team_logic.cancel_invite(team_id, invited_id)

    return jsonify("Done")


@app.route('/team/<team_id>/accept_request', methods=['POST'])
@team_logic.access_level_required('manager')
def accept_request(team_id):
    team_id = request.form.get('team_id')
    request_acc_id = request.form.get('request_acc_id')

    team_logic.add_member(team_id, request_acc_id)
    team_logic.delete_request(team_id, request_acc_id)

    return jsonify("Done")


@app.route('/team/<team_id>/decline_request', methods=['POST'])
@team_logic.access_level_required('manager')
def decline_request(team_id):
    team_id = request.form.get('team_id')
    request_acc_id = request.form.get('request_acc_id')

    team_logic.delete_request(team_id, request_acc_id)

    return jsonify("Done")


@app.route('/team/<team_id>/remove_member', methods=['POST'])
@team_logic.access_level_required('manager')
def remove_member(team_id):
    team_id = request.form.get('team_id')
    member_id = request.form.get('member_id')

    deleted = team_logic.remove_member(team_id, member_id)

    return jsonify(deleted)


@app.route('/team/<team_id>/change_role', methods=['POST'])
@team_logic.access_level_required('owner')
def change_role(team_id):
    team_id = request.form.get('team_id')
    member_id = request.form.get('member_id')
    new_role = request.form.get('new_role')

    if new_role != 'owner':
        team_logic.change_role(team_id, member_id, new_role)

    return jsonify("Done")


@app.route('/team/<team_id>/get_boards_access', methods=['POST'])
@team_logic.access_level_required('manager')
def get_boards_access(team_id):
    acc_team_id = request.form.get('acc_team_id')
    team_id = request.form.get('team_id')

    boards_access, not_accessed_boards = team_logic.get_boards_access(acc_team_id, team_id)

    return jsonify(boards_access=boards_access, not_accessed_boards=not_accessed_boards)


@app.route('/team/<team_id>/save_boards_access_changes', methods=['POST'])
@team_logic.access_level_required('manager')
def save_boards_access_changes(team_id):
    acc_boards_data = json.loads(request.form.get('acc_boards_data'))
    acc_team_id = request.form.get('acc_team_id')
    team_role = request.form.get('team_role')

    if team_role == 'member':
        team_logic.save_boards_access_changes(acc_boards_data, acc_team_id)
    else:
        return

    return jsonify("Done")


@app.route('/api/get_team_boards/<team_id>', methods=['POST'])
@account.login_required
def get_team_boards(team_id):
    acc_team_id = request.form.get('acc_team_id')

    account_id = common.get_account_id(session["user_name"])
    role = team_logic.get_account_team_role(account_id, team_id)

    if role in ('manager', 'owner'):
        boards_data = board_logic.get_all_team_boards(team_id)
    elif role == 'member':
        boards_data = board_logic.get_accessed_team_boards(acc_team_id)

    team_members = team_logic.get_team_members(team_id)

    return jsonify(boards_data=boards_data, team_role=role, team_id=team_id, team_members=team_members)


@app.route('/api/get_personal_boards')
@account.login_required
def get_personal_boards():
    account_id = common.get_account_id(session["user_name"])
    boards_data = board_logic.get_personal_boards(account_id)

    return jsonify(boards_data=boards_data, team_role='personal')


if __name__ == '__main__':
    app.run(debug=True, port=3000, host='0.0.0.0')
