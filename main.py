
from flask import Flask, render_template

import account_logic as account

app = Flask(__name__)


@app.route("/")
def index():
    return render_template('index.html')


@app.route('/login', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        if request.form.get('register_acc_name'):
            return account.register_account()
        elif request.form.get('login_acc_name'):
            return account.login_user()

    return render_template('account.html')


if __name__ == '__main__':
    app.run(debug=True, port=5000)
