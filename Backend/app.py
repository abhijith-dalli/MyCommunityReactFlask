from flask import Flask, render_template, request, redirect, url_for, session,jsonify
from flask_sqlalchemy import SQLAlchemy
import psycopg2
import psycopg2.extras 
import re
from flask_cors import CORS
from Users import User
app = Flask(__name__)
CORS(app)
app.secret_key = "super-secret-key"
# PostgreSQL configuration
app.config['APP_NAME'] = 'Abhi(s) Application'
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:Abhijith12345@localhost:5432/postgres' #This can be postgresql as well.
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

connection = psycopg2.connect(host="localhost",database="postgres",user="postgres",password="Abhijith12345",port="5432")

@app.route('/')
def root():
    return "Please pass some path to get response / This route does'nt exists"

@app.route('/register', methods=['GET', 'POST'])
def register():
    msg = ''
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        email = request.form['email']
        cur = connection.cursor(cursor_factory= psycopg2.extras.RealDictCursor)
        cur.execute("SELECT id,username,email FROM accounts where username=%s",(username,))
        account = cur.fetchone()
        print('acocunt:',account)
        if account:
            msg = 'Account already exists!'
        elif not re.match(r'[^@]+@[^@]+\.[^@]+', email):
            msg = 'Invalid email address!'
        elif not re.match(r'[A-Za-z0-9]+', username):
            msg = 'Username must contain only letters and numbers!'
        else:
            msg = 'You have successfully registered!'
            return render_template('register.html', msg=msg)
        cur.close()
    return render_template('register.html', msg=msg)

@app.route("/User", methods=["GET","POST"])
def userloginregistration():
    if(request.method == 'GET'):
        getUser = User(connection)
        isValid = getUser.validateUser(request.args.get("username"),request.args.get("password"))
        print(isValid)
        return isValid
    elif(request.method == 'POST'):
        getUser = User(connection)
        register_user = getUser.registerUser(request.form.get('username'),request.form.get('password'),request.form.get('flat'),request.form.get('email'),request.form.get('phone'),request.form.get('apartment')) 
        return register_user
    else:
        return "Not a valid request method."

@app.route('/home')
def home():
    if 'loggedin' in session:
        return render_template('home.html', username=session['username'])
    return redirect(url_for('login'))

@app.route('/logout')
def logout():
    session.clear()
    return redirect(url_for('login'))

@app.route('/view_session')
def view_session():
    return dict(session)

if __name__ == '__main__':
    app.run(host='localhost', port=4000, debug=True)
