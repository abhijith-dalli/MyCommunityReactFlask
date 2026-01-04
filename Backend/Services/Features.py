import psycopg2.extras
from Services.Users import Logs 

class Event():
    def __init__(self,connection,user_id):
        self.connection = connection
        self.user_id = int(user_id)
        self.logData = Logs(connection)

    def createEvent(self,eventDICT):
        try:
            with self.connection.cursor(cursor_factory= psycopg2.extras.RealDictCursor) as cur:
                cur.execute(""" 
                            INSERT INTO management.events (user_id, title, image, organizer, date, time , location, description)
                            VALUES (%s,%s,%s,%s,CAST(%s AS date),CAST(%s AS time),%s,%s)
                            returning id,user_id,title,image, organizer, date::text , time::text , location, description,create_date;
                            """,(self.user_id,eventDICT['eName'],eventDICT['eventImage'],eventDICT['organizer'],eventDICT['date'],eventDICT['time'],eventDICT['location'],eventDICT['desc']))
                newEvent = cur.fetchall()
            self.connection.commit()
            return newEvent[0]
        except (ValueError, TypeError) as e:
            print("Error: ",e)
            return 'Error'
        
    def getEvents(self):
        with self.connection.cursor(cursor_factory= psycopg2.extras.RealDictCursor) as cur:
            if self.user_id != 0:
                cur.execute("SELECT id,title,organizer,date::text,time::text,location,description FROM management.events where user_id=%s",(self.user_id,))
            else:
                cur.execute("""SELECT id,
                            title,
                            image,
                            organizer,
                            TO_CHAR(date, 'Day, Mon DD, YYYY') as date,
                            TO_CHAR(time,'HH:MI  AM') as time, 
                            case when 
                                date = now()::date then 'Today'
                                when (date) < now()::date then 'Completed'
                                else 'Upcoming'
                            end as due,
                            location,
                            description 
                                FROM management.events
                            order by time,date""")
            events = cur.fetchall()
        return events
    
    def updateEvent(self,eventDICT):
        try:
            with self.connection.cursor(cursor_factory= psycopg2.extras.RealDictCursor) as cur:
                cur.execute("""UPDATE management.events
                                SET title = %s, 
                                    organizer = %s,
                                    date = %s,
                                    time = %s,
                                    location = %s,
                                    description = %s
                                WHERE id = %s;
                                """,(eventDICT['title'],eventDICT['organizer'],eventDICT['date'],eventDICT['time'],eventDICT['location'],eventDICT['description'],eventDICT['event_id']))
            self.connection.commit()
            self.logData.createLog(self.user_id,eventDICT['event_id'],'events','Updated the event','Update')
            return True
        except (ValueError, TypeError) as e:
            print("Error: ",e)
            return False
    def deleteEvent(self,event_id):
        try:
            with self.connection.cursor(cursor_factory= psycopg2.extras.RealDictCursor) as cur:
                cur.execute("delete from management.events where id = %s",(event_id,))
            self.connection.commit()
            return True
        except (ValueError, TypeError) as e:
            print("Error: ",e)
            return False