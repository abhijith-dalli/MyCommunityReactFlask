import psycopg2.extras

class Event():
    def __init__(self,connection,user_id):
        self.connection = connection
        self.user_id = user_id
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
            cur.execute("SELECT id,title,organizer,date::text,time::text,location,description FROM management.events where user_id=%s",(self.user_id,))
            events = cur.fetchall()
        return events
    