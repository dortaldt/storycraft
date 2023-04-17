import os
import time

from flask import Flask, request, jsonify
from flask_restful import Resource, Api
from flask_cors import CORS
from werkzeug.utils import secure_filename
from PIL import Image

app = Flask(__name__)
CORS(app)
api = Api(app)

UPLOAD_FOLDER = os.path.join('static', 'images')
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
    return response

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

class ImageUpload(Resource):
    def post(self):
        if 'image' not in request.files:
            return {'error': 'No image file'}, 400
        file = request.files['image']
        if file.filename == '':
            return {'error': 'No selected file'}, 400
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))

            # Process the image if needed, e.g. resgit pullizing or adding a watermark.
            # You can use the Pillow library for image manipulation.
            time.sleep(3)
            return {'imageUrl': f'localhost:7860/{UPLOAD_FOLDER}/{filename}'}, 200
        else:
            return {'error': 'File type not allowed'}, 400

api.add_resource(ImageUpload, '/submit_room')

if __name__ == '__main__':
    app.run(debug=True, port=7860, host='0.0.0.0')