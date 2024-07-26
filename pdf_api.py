
from flask import Flask, jsonify, request
from flask_cors import CORS  
import pyodbc
import os
import base64
import spacy
# from replace_v5 import *
import json

files_folder = 'uploads/'

# nlp = spacy.load("en_core_web_sm")
server = 'RHJ-9F-D077\\SQLEXPRESS'
database = 'pdfredaction'
conn = pyodbc.connect('DRIVER=ODBC Driver 17 for SQL Server;SERVER=' + server +';DATABASE=' + database + ';Trusted_Connection=yes;')
cursor = conn.cursor()
print('connected')

app = Flask(__name__)
CORS(app) 


@app.route('/upload',methods=['POST'])
def files_upload():
    try:
        folder_name = request.form['folderName']
        print(folder_name)
        files = request.files.getlist('files[]')
        print(files)

        os.makedirs(files_folder+'/'+folder_name, exist_ok=True)

        # Process each file
        filenames = []
        for file in files:
            # Save the file to the 'uploads' directory
            file_path = os.path.join(files_folder+'/'+folder_name, file.filename)
            file.save(file_path)
            filenames.append(file.filename)

        # You can return a response with the uploaded filenames
        return jsonify({"message": "Files uploaded successfully", "filenames": filenames})
        # return jsonify({"message":'file_data'})
    
    except Exception as e:
        return jsonify(error=str(e)), 500


@app.route('/files', methods=['GET','POST'])
def get_files():
    try:
        data = request.get_json()
        file_data = []
        folder_path=files_folder+data['name']
        for filename in os.listdir(folder_path):
            file_path = os.path.join(folder_path, filename)
            if os.path.isfile(file_path):
                with open(file_path, 'rb') as file:
                    
                    content_base64 = base64.b64encode(file.read()).decode('utf-8')
                    file_data.append({
                        'filename': filename,
                        'content_base64': content_base64
                    })
        
        
        
        return jsonify(file_data)
    
    except Exception as e:
        return jsonify(error=str(e)), 500
    


@app.route('/register',methods=['POST'])
def register():
    try:
        print('post')
        data = request.get_json()
        print(data)
        name =data.get('name')
        email = data.get('email')
        password = data.get('password')
        cursor.execute('INSERT INTO users (name,emailid,password) VALUES (?, ?, ?)',
                    (name,email,password))
        
        conn.commit()
        folder_path = 'uploads/'

        
        new_folder_path = os.path.join(folder_path,name)

        
        os.makedirs(new_folder_path, exist_ok=True)
        return jsonify({'success': True, 'message': 'User Registered Successfully'})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)})
    

  



@app.route('/login',methods=['POST'])
def login():
    try:
        print('post')
        data = request.get_json()
        print(data)
        name=data.get('name')
        email = data.get('email')
        password = data.get('password')
        cursor.execute('select * from users where name=? and password=?',
                    (name,password))
        a=cursor.fetchall()
        print(a)
        
        conn.commit()
        return jsonify({'success': True, 'message': 'User logined Successfully', 'user':list(a[0])})
        #return jsonify({'success': True, 'message': 'User logined Successfully', 'user':list(('1',name,email,password))})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)})




# @app.route('/get', methods=['GET','POST'])
# def send_json():
#     print('send_json')
#     filepath = request.json.get('file')
#     print('filepath',filepath)
#     text = extract_text_from_pdf(files_folder+filepath)
#     data=find_entities(text)
#     print(data)
#     print('get request success')
#     return jsonify(data)
    
@app.route('/get', methods=['GET','POST'])
def send_json():
  print('send_json')
  print('request',request)
  filepath = request.json.get('file')
  print('filepath',filepath)
  data={
          "1":{
            "person":["Alice Johnson","James Smith","Emily Wilson","twinkling","vibrant"],
            "org":["Quantum Innovations Ltd"],
            "email":[],
            "address":[],
            "phone number":[]
          },
          "2":{
            "person":["Samantha Davis","civilization"],
            "org":["Quantum Innovations Ltd"],
            "email":["james.smith@email.org", "contact@quantuminnovations.com a"],
            "address":["789 Pine Road"],
            "phone number":["+1 (555) 123-4567","+44 20 7123 4567"]
          },
          "3":{
            "person":["Samantha Davis","carried"],
            "org":[],
            "email":["research@quantuminnovations.com","info@jazzharmony.com"],
            "address":["456 Oak Avenue","303 Quantum Way, Tech City"],
            "phone number":["+49 30 1234 5678"]
          },
          "4":{
            "person":["Allison Harper","saxophone"],
            "org":["NexTech Solutions"],
            "email":["info@canvasdreams.gallery","researchupdates@bluehorizon.org"],
            "address":["601 Gallery Street"],
            "phone number":["+61 2 9876 5432","+1 (555) 987-6543"]
          },
          "5":{
            "person":["James Smith"],
            "org":[],
            "email":["harmonygarden@email.net"],
            "address":[],
            "phone number":["+49 30 8765 4321","+61 2 3456 7890"]
          },
          }
  print('get request success')
  return jsonify({'data':data})
@app.route('/redact_data', methods=['POST'])
def redact_data():
    try:
        print('post')
        data = request.get_json()
        data_selected = data.get('dataSelected', {})
        print(data_selected)
        return jsonify({'success': True, 'message': 'Redaction completed'})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)})
    

@app.route('/file_redact', methods=['POST'])
def make_redaction_api():
    file_data=[]
    data = request.json.get('json')
    file_path = request.json.get('name')
    folder_name,f_name=file_path.split('/')
    f_name=f_name.split('.')[0]
    f_path=files_folder+folder_name+'/metadata/'+f_name+'.json'
    print(folder_name)
    print(data,file_path)
    with open(f_path, 'w') as json_file:
        json.dump(data, json_file, indent=4)
    result = make_redaction(data,file_path)
    if os.path.isfile(result):
      with open(result, 'rb') as file:
         
          content_base64 = base64.b64encode(file.read()).decode('utf-8')
          file_data.append({
              'filename': 'pdf.pdf',
              'content_base64': content_base64
          })
  
    return jsonify({'file':file_data})


if __name__ == "__main__":
    app.run()