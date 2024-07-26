
from flask import Flask, jsonify, request
from flask_cors import CORS  


app = Flask(__name__)
CORS(app) 



@app.route('/get', methods=['GET'])
def send_json():
    data={
          "1":{
            "person":["Alice Johnson","James Smith","Emily Wilson","Samantha Davis"],
            "org":["Quantum Innovations Ltd"],
            "email":[],
            "address":[],
            "phone number":[]
          },
          "2":{
            "person":["Samantha Davis"],
            "org":["Quantum Innovations Ltd"],
            "email":["james.smith@email.org", "samantha.davis@email.net", "contact@quantuminnovations.com a"],
            "address":["789 Pine Road"],
            "phone number":["+1 (555) 123-4567","+44 20 7123 4567"]
          },
          "3":{
            "person":["Samantha Davis","Michael Brown"],
            "org":[""],
            "email":["research@quantuminnovations.com","info@jazzharmony.com",],
            "address":["456 Oak Avenue","303 Quantum Way, Tech City"],
            "phone number":["+49 30 1234 5678"]
          },
          "4":{
            "person":["Allison Harper","Michael Brown"],
            "org":["NexTech Solutions"],
            "email":["samantha.davis@email.net","info@canvasdreams.gallery"," newsletter@harmonyjazz.com.","researchupdates@bluehorizon.org"],
            "address":["601 Gallery Street"],
            "phone number":["+61 2 9876 5432","+1 (555) 987-6543"]
          },
          "5":{
            "person":["James Smith"],
            "org":[""],
            "email":["harmonygarden@email.net","chefmaria@gastronomicdelights.com"],
            "address":[""],
            "phone number":["+44 20 7654 3210","+49 30 8765 4321","+61 2 3456 7890"]
          },
          }
    print('get request success')
    return jsonify(data)

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


if __name__ == "__main__":
    app.run()