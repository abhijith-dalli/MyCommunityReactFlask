import bcrypt
import psycopg2.extras

class User():
    def __init__(self,connection):
        self.connection = connection
    def getUserDetails(self,username):
        with self.connection.cursor(cursor_factory= psycopg2.extras.RealDictCursor) as cur:
            cur.execute("SELECT * FROM management.users where username=%s",(username,))
            account = cur.fetchall()
        return account
    def validateUser(self,username,password):
        # hashed_password = bcrypt.hashpw(password.encode(), bcrypt.gensalt())
        userDetail = self.getUserDetails(username)
        print('userdetils   ',userDetail)
        if len(userDetail) and password == userDetail[0]['password']:
            return userDetail[0]
        else:
            return 'Failed'

    def getUserByID(self,user_id):
        with self.connection.cursor(cursor_factory= psycopg2.extras.RealDictCursor) as cur:
            cur.execute("SELECT * FROM management.users where id=%s",(user_id,))
            userDetails = cur.fetchone()
        return userDetails
    def registerUser(self,username,password,flat,email,phone,type,apartment):
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
                                INSERT INTO management.users (username, password, email, phone, type , apt_id)
                                VALUES (%s,%s,%s,%s,%s,%s)
                                returning id,username;
                                """,(username,password,email,phone,type,apartment))
                    userdetails = cur.fetchone()
                    username = userdetails['username']
                    user_id = userdetails['id']
                    if (type == 'Owner'):
                        cur.execute(""" 
                        INSERT INTO management.flat_user_map (flat_id , user_id)
                        VALUES (%s,%s);
                        """,(flat,user_id))
                self.connection.commit()
                print('Details ',username)
            except (ValueError, TypeError) as e:
                print("Error: ",e)
            return f'Registration successful for user {username}.'

    def getAllUsers(self):
        with self.connection.cursor(cursor_factory= psycopg2.extras.RealDictCursor) as cur:
            cur.execute("""
            SELECT u.id as id,
                u.username as username,
                u.email as email,
                u.phone as phone,
                u.type as role,
                u.status as status,
                u.apt_id as apt_id,
                a.name as apartment,
                f.id as f_id,
                f.name as flat
            FROM management.users u 
            left join management.apt a on a.id = u.apt_id
            left join management.flat_user_map fu on fu.user_id = u.id
            left join management.flats f on f.id = fu.flat_id 
            order by u.id desc""")
            allUsers = cur.fetchall()
            return allUsers

    def updateUserDetails(self,user_id,username, email, phone, status):
        try:
            with self.connection.cursor(cursor_factory= psycopg2.extras.RealDictCursor) as cur:
                cur.execute("""UPDATE management.users 
                                    SET username=%s,
                                        email=%s,
                                        phone=%s,
                                        status=%s
                                    WHERE id=%s;""", (username,email,phone,status,user_id))
            self.connection.commit()
            return 'Updated'
        except Exception as e:
            print("ERROR::",e)


class Logs():

    def __init__(self,connection):
        self.connection = connection

    def createLog(self,user_id,p_id,p_table,notes,action):
        try:
            with self.connection.cursor(cursor_factory= psycopg2.extras.RealDictCursor) as cur:
                cur.execute(""" 
                            INSERT INTO management.logs (user_id, primary_id, primary_table, note, action)
                            VALUES (%s,%s,%s,%s,%s);
                            """,(user_id,p_id,p_table,notes,action))
            self.connection.commit()
        except (ValueError, TypeError) as e:
            print("Error: ",e)

class Flats():

    def __init__(self,connection):
        self.connection = connection
    def getApts(self):
        with self.connection.cursor(cursor_factory= psycopg2.extras.RealDictCursor) as cur:
            cur.execute("""SELECT 
                            a.id as id,
                            a.name as name,
                            a.loc as loc,
                            a.status as status,
                            json_agg(
								json_build_object(
									'id', f.id,
									'name', f.name
								)
								ORDER BY f.name asc
								) AS flats
                        FROM management.apt a
                        LEFT JOIN management.flats f 
                            ON a.id = f.apt_id
                        GROUP BY 
                            a.id, a.name, a.loc
                        order by a.id desc;""")
            apts = cur.fetchall()
        return apts
    def getFlats(self,apt_id):
        with self.connection.cursor(cursor_factory= psycopg2.extras.RealDictCursor) as cur:
            cur.execute("select * from management.flats where apt_id = %s;",(apt_id,))
            flats = cur.fetchall()
        return flats
    def createAptFlats(self,aptName,loc,flats):
        try:
            with self.connection.cursor(cursor_factory= psycopg2.extras.RealDictCursor) as cur:
                cur.execute("""Insert into management.apt 
                            (name,loc) 
                            values (%s,%s)
                            returning id,name,loc;""",(aptName,loc))
                aptInfo = cur.fetchone()
                aptFlats =list(map(str, flats.split(",")))
                for flat in aptFlats:
                    cur.execute("""Insert into management.flats 
                                (name,apt_id) 
                                values (%s,%s) 
                                returning id;""",(flat,aptInfo["id"]))
            self.connection.commit()
            return aptInfo
        except (ValueError, TypeError) as e:
            return ("Error: ",e)
        
    def updateApts(self,id,name,loc,status):
        try:
            with self.connection.cursor(cursor_factory= psycopg2.extras.RealDictCursor) as cur:
                cur.execute("""UPDATE management.apt 
                                    SET name=%s,
                                        loc=%s,
                                        status=%s
                                    WHERE id=%s;""", (name,loc,status,id))
            self.connection.commit()
            return 'Updated'
        except Exception as e:
            print("ERROR::",e)