from flask import Flask, request, jsonify, Response
from flaskext.mysql import MySQL
import json
from flask_cors import CORS, cross_origin
from pymysql.cursors import DictCursor



app = Flask(__name__)
cors = CORS(app, resources={r"/api/*": {"origins": "*"}})
app.config['CORS_HEADERS'] = 'Content-Type'

mysql = MySQL()
app.config['MYSQL_DATABASE_USER'] = 'yKO0jZzvIM'
app.config['MYSQL_DATABASE_PASSWORD'] = 'a5mgNe5TJt'
app.config['MYSQL_DATABASE_DB'] = 'yKO0jZzvIM'
app.config['MYSQL_DATABASE_HOST'] = 'remotemysql.com'
mysql.init_app(app)

@app.route('/api/login', methods=['POST'])
def login():
    reqBody = request.json
    uname=reqBody['name']
    pwd=reqBody['pwd']
    conn= mysql.connect()
    cursor= conn.cursor()
    cursor.execute("SELECT * FROM login WHERE uname=%s" , uname)
    data = cursor.fetchone()
    if data and data[2]==pwd:
        
        cursor.execute("SELECT * FROM user WHERE id=%s" , data[0])
        d = cursor.fetchone()
        print(d)
        return jsonify({'status':200,'message':'Successfully authenticated', 'id': data[0],'name':d[1],'mobile':d[2],'email':d[4]}), 200
    return jsonify({'status':401,'message':'Please check your uname/pwd'}), 401


@app.route('/api/register', methods=['POST'])
def register():
    reqBody = request.json
    uname=reqBody['name']
    pwd=reqBody['pwd']
    mobile = reqBody['mobile']
    email = reqBody['email']
    conn= mysql.connect()
    cursor= conn.cursor()
    cursor.execute("INSERT INTO user (name, mobile, password, email) VALUES (%s,%s,%s,%s)" , (uname, mobile, pwd, email))
    conn.commit()
    cursor.execute("INSERT INTO login (uname, pwd) VALUES (%s,%s)" , (email, pwd))
    conn.commit()
    cursor.execute("SELECT * FROM login WHERE uname=%s" , email)
    data = cursor.fetchone()
    print(data)
    token = jwt.encode(reqBody, "securecarpark", algorithm="HS256")
    return jsonify({'status':200,'message':'Successfully authenticated', 'token':token, 'id' : data[0], 'uname':uname,'email':email,'mobile':mobile }), 200
    


@app.route('/api/addslug', methods=['POST'])
def slug():
    reqBody = request.json
    name=reqBody["parkingName"]
    area=reqBody["area"]
    time=reqBody["time"]
    price=reqBody["price"]
    address=reqBody["address"]
    latitude=reqBody["latitude"]
    longitude=reqBody["longitude"]
    city=reqBody["city"]
    country=reqBody["country"]
    uid = reqBody['userID']
    conn= mysql.connect()
    cursor= conn.cursor()
    cursor.execute("INSERT INTO slugs (name, area, time, price, address, latitude, longitude, city, country, user_id) VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)" , (name, area, time, price, address, latitude, longitude, city, country,uid))
    conn.commit()
    cursor.execute('SELECT * FROM slugs')
    data = cursor.fetchall()
    response = jsonify({'status':200,'message':'Successfully Inserted', 'token':data}), 200 
    return response


@app.route('/api/getslug', methods=['GET'])
def getSlug():
    conn= mysql.connect()
    cursor= conn.cursor()
    cursor.execute('SELECT * FROM slugs')
    data = cursor.fetchall()
    response = jsonify({'status':200,'message':'Successfully Inserted', 'data' : data}), 200 
    return response

@app.route('/api/bookslug', methods=['POST'])
def bookslug():
    reqBody = request.json
    start=reqBody["start"]
    end=reqBody["end"]
    bookingId=reqBody["bookingid"]
    bookinguserId=reqBody["bookinguserid"]
    currentuserId=reqBody["currentuserid"]
    conn= mysql.connect()
    cursor= conn.cursor()
    cursor.execute("INSERT INTO booking (parkingId, userid, starttime, endtime, bookinguserid) VALUES (%s,%s,%s,%s,%s)" , (bookingId, bookinguserId, start, end, currentuserId))
    conn.commit()
    response = jsonify({'status':200,'message':'Successfully Inserted'}), 200 
    return response


@app.route('/api/getuserad', methods=['POST'])
def getuserad():
    reqBody = request.json
    id=reqBody["id"]
    conn= mysql.connect()
    cursor= conn.cursor()
    cursor.execute("SELECT * FROM slugs WHERE user_id=%s" , id)
    data = cursor.fetchall()
    list = []
    data2 = []
    if data:
        for result in data:
            cursor.execute("SELECT * FROM booking WHERE parkingId=%s" , result[0])
            data1 = cursor.fetchone()
            if data1:
                cursor.execute("SELECT * FROM user WHERE id=%s" , data1[5])
                data2 = cursor.fetchone()
            list.append([result,data1,data2])
        response = jsonify({'status':200,'message':'Successfully Inserted', 'data' : list}), 200 
        return response
    response = jsonify({'status':400,'message':'Error'}), 400 
    return response
      

@app.route('/api/getuserbooking', methods=['POST'])
def getuserbooking():
    reqBody = request.json
    id=reqBody["id"]
    list = []
    conn= mysql.connect()
    cursor= conn.cursor()
    cursor.execute("SELECT * FROM booking WHERE bookinguserid=%s" , id)
    data = cursor.fetchall()
    if data:
        for result in data:
            cursor.execute("SELECT * FROM slugs WHERE id=%s" , result[1])
            data1 = cursor.fetchone()
            cursor.execute("SELECT * FROM user WHERE id=%s" , result[2])
            data2 = cursor.fetchone()
            dict = {'start': result[3], 
                    'end': result[4],
                    'name': data1[1],
                    'area': data1[2],
                    'price': data1[4],
                    'time': data1[3],
                    'address': data1[5],
                    'lat': data1[6],
                    'lng': data1[7],
                    'uname': data2[1],
                    'umobile': data2[2]}
            list.append(dict)
        print(list)
        response = jsonify(data=list), 200 
        return response
    response = jsonify({'status':400,'message':'Error'}), 400 
    return response


if __name__=="__main__":
    app.debug=True
    app.run()
    app.run(debug=True)