from flask import Flask, request, url_for
from flask.templating import render_template
from flask.helpers import redirect

app = Flask(__name__);


@app.route('/')
def index():
    # initial page with radio selection
    return render_template('index.html')


@app.route('/start-game', methods=['POST'])
def start_game():
    # get selected mode from radio input
    selected_mode = request.form.get('player')  # "computer" or "2P"

    # redirect to game.html, passing mode as query parameter
    return redirect(url_for('game', mode=selected_mode)) 


@app.route('/game')
def game():
    # read mode from query string
    mode = request.args.get('mode', 'computer')  # default to 2P if not provided
    return render_template('game.html', mode=mode)  


@app.route('/go-home', methods=['POST'])
def go_home():
    # Redirect back to the initial route "/"
    return redirect(url_for('index'))


if __name__ == '__main__':
    app.run(debug=True)

