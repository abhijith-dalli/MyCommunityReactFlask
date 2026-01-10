from flask import Flask, render_template, request, redirect, url_for, session,jsonify,send_from_directory
from flask_sqlalchemy import SQLAlchemy
import os,time,psycopg2.extras,re
from flask_cors import CORS
from Services.Users import User,Logs,Flats
from Services.Features import Event

app = Flask(__name__)
CORS(app)
app.secret_key = "super-secret-key"
# PostgreSQL configuration
app.config['APP_NAME'] = 'Abhi(s) Application'
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:Abhijith12345@localhost:5432/postgres'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

connection = psycopg2.connect(host="localhost",database="postgres",user="postgres",password="Abhijith12345",port="5432")

upload_path = "uploads"
os.makedirs(upload_path, exist_ok=True)

@app.route('/')
def root():
    return "Please pass some path to get response / This route does'nt exists"

@app.route("/User", methods=["GET","POST"])
def userloginregistration():
    if(request.method == 'GET'):
        if ('user_id' in request.args):
            getUser = User(connection)
            details = getUser.getUserByID(request.args.get("user_id"))
            return details
        elif ('username' in request.args and 'password' in request.args):
            getUser = User(connection)
            isValid = getUser.validateUser(request.args.get("username"),request.args.get("password"))
            print(isValid)
            logData = Logs(connection)
            if 'id' in isValid and isValid['id']:
                logData.createLog(isValid['id'],-1,'','User Logged in','LoggedIn')
            return (isValid)
    elif(request.method == 'POST'):
        getUser = User(connection)
        if (request.form.get('role') == 'Owner'):
            register_user = getUser.registerUser(request.form.get('username'),request.form.get('password'),request.form.get('flat'),request.form.get('email'),request.form.get('phone'),request.form.get('role'),request.form.get('apartment')) 
            return register_user
        elif(request.form.get('role') == 'Security'):
            register_user = getUser.registerUser(request.form.get('username'),'','',request.form.get('email'),request.form.get('phone'),request.form.get('role'),request.form.get('apartment')) 
            return register_user
    else:
        return "Not a valid request method."

@app.route('/upload',methods=["POST"])
def uploadFile():
    file = request.files.get("file")
    filename = file.filename
    name, ext = os.path.splitext(filename)
    unique_name = f"{name}_{int(time.time())}{ext}"
    file.save(os.path.join("uploads", unique_name))
    return {"message": "Success","filename":unique_name}

@app.route("/uploads/<path:filename>")
def getUpload(filename):
    return send_from_directory(upload_path, filename)

@app.route("/Event", methods=["GET","POST","PATCH"])
def events():
    if request.method == 'POST':
        event = Event(connection,request.form.get('user_id'))
        new_event = event.createEvent(request.form)
        return new_event
    if request.method == 'GET':
        event = Event(connection,request.args.get('user_id'))
        getEvents = event.getEvents()
        return getEvents
    if request.method == 'PATCH':
        event = Event(connection,request.form.get('user_id'))
        updated = event.updateEvent(request.form)
        if updated:
            return event.getEvents()
        else:
            return 'Failed!'
    
@app.route("/Event/<int:event_id>/<int:user_id>", methods=["DELETE"])
def delete_event(event_id,user_id):
    event = Event(connection,user_id)
    detete_event = event.deleteEvent(event_id)
    if detete_event == True:
         user_events = event.getEvents()
         return user_events
    else:
        return 'Failed!'

@app.route('/admin/apartments',methods=["GET","POST","PATCH"])
def apartments():
    if request.method == 'GET':
        objtype = request.args.get('obj')
        if(objtype == 'apt'):
            aptObj =  Flats(connection)
            apts = aptObj.getApts()
            return apts
        elif(objtype == 'flat'):
            apt_id = request.args.get('apt_id')
            flatsObj =  Flats(connection)
            flats = flatsObj.getFlats(apt_id)
            return flats
    if request.method == 'POST':
        createObj =  Flats(connection)
        
        createApt = createObj.createAptFlats(request.form.get('name'),request.form.get('location'),request.form.get('flats'))
        return createApt

@app.route('/view_session')
def view_session():
    return dict(session)

if __name__ == '__main__':
    app.run(host='localhost', port=4000, debug=True)
