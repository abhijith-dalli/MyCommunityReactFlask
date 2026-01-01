import bcrypt 
import psycopg2.extras

class User():
    def __init__(self,connection):
        self.connection = connection
    def getUserDetails(self,username):
        with self.connection.cursor(cursor_factory= psycopg2.extras.RealDictCursor) as cur:
            cur.execute("SELECT * FROM management.users where username=%s",(username,))
            account = cur.fetchone()
        return account
    def validateUser(self,username,password):
        # hashed_password = bcrypt.hashpw(password.encode(), bcrypt.gensalt())
        userDetain = self.getUserDetails(username)
        if password == userDetain['password']:
            return 'True'
        else:
            return 'False'
        
    def registerUser(self,username,password,flat,email,phone,apartment):
        with self.connection.cursor(cursor_factory= psycopg2.extras.RealDictCursor) as cur:
            cur.execute("SELECT username FROM management.users where username=%s",(username,))
            existingusername = cur.fetchone()
        if(existingusername):
            return 'Username already exists!'
        else:
            # Need to implement the hashed passed password!
            # hashed_password = bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()
            try:
                with self.connection.cursor(cursor_factory= psycopg2.extras.RealDictCursor) as cur:
                    cur.execute(""" 
                                INSERT INTO management.users (username, password, email, phone, type , flat, apt_id)
                                VALUES (%s,%s,%s,%s,%s,%s,%s)
                                returning id,username;
                                """,(username,password,email,phone,'owner',flat,apartment))
                    username = cur.fetchone()['username']
                self.connection.commit()
                print('Details ',username)
            except (ValueError, TypeError) as e:
                print("Error: ",e)
            return f'Registration successful for user {username}.'
